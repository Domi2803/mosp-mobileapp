import React, { Component } from 'react'
import { AppState, Text, View, ScrollView, FlatList, ActivityIndicator, Button, AsyncStorage, Platform, Dimensions, ActionSheetIOS} from 'react-native'
import PlanItem from '../components/PlanItem'
import global from '../global'
import AlertBox from '../components/AlertBox'
// import { Dropdown } from 'react-native-material-dropdown';
import HeaderDaySelect from '../components/HeaderDaySelect'
import PTRView from 'react-native-pull-to-refresh';
import {updatePushConfig} from "../pushHandler"
import Tutorial from '../components/Tutorial'
import { ScreenHit, PageHit } from 'expo-analytics'
import * as Analytics from 'expo-firebase-analytics';

export default class Plan extends Component {

    static navigationOptions = ({navigation}) => {
        return({

        
        //headerTitle: ()=>{return(<Dropdown data={[{value: "today", label: "Heute"}, {value: "tomorrow", label: "Morgen"}]} style={{height: 25, width: 100}}></Dropdown>)},
        headerTitle: ()=>{
            
            return (<HeaderDaySelect todayDate={navigation.getParam('todayDate')} tomorrowDate={navigation.getParam('tomorrowDate')}/>)
        },
        headerShown: true,
        })
    }

    constructor(props){
        super(props);

        const isPortrait = () => {
            const dim = Dimensions.get('screen');
            return dim.height >= dim.width;
        };

        this.state = {
            loading: true, 
            plan: null, 
            refreshing: false, 
            lastAnimationTimestamp: Date.now(), 
            fail: false,
            myClass: null,
            selectedDay: 0,
            myCourses:[],
            appState: AppState.currentState,
            myTeacherID: null,
            userMode: 0,
            orientation: isPortrait() ? 'portrait' : 'landscape',
            firstRun: true
        };
      
          // Event Listener for orientation changes
        Dimensions.addEventListener('change', () => {
          this.setState({
            orientation: isPortrait() ? 'portrait' : 'landscape'
          });
        });
    }

    _handleFocus = () => {
        console.log("Refresh due to focus");
          this.onRefresh();
          Analytics.setCurrentScreen("Plan");
    }

    _handleAppStateChange = (nextAppState) => {
      if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log("Refreshing due to onResume()");
        this.onRefresh();
        Analytics.setCurrentScreen("Plan");
      }
      this.setState({appState: nextAppState});
    }

    onRefresh = () =>{
        
        this.setState({fail: false, refreshing: true}, async ()=>{await this.getUserMode(); await this.getClass(); this.fetchData()});
    }

    fetchData = ()=>{
        
        if(this.state.userMode == 0){
            console.log("student");
            console.log(global.apiURL + "/getPlan?year=" + this.state.myClass );
            fetch(global.apiURL + "/getPlan?apiVer=2&year=" + this.state.myClass , {headers: {"Authorization": 'Bearer ' + global.authToken}})
            .then(res=>{
                if(res.status != 200){
                    if(global.authToken == null){
                        alert("Es ist ein Fehler bei der Abfrage aufgetreten")
                        AsyncStorage.getItem("@loginToken", (err, res) =>{if(res == null) return; global.authToken = res; this.fetchData();})
                    }
                    this.setState({ loading: true, fail: true});
                }else{
                   res.json().then(data =>{
                       this.setState({plan: data, loading: false, refreshing: false, fail: false, lastAnimationTimestamp: Date.now()});
                       if(data[0]){
                           this.props.navigation.setParams({todayDate: data[0].date});
                       }
                       if(data[1]){
                        this.props.navigation.setParams({tomorrowDate: data[1].date});
                        }
                   }) 
                }
            }).catch(()=>{
                this.setState({fail: true});
            })
        }else if(this.state.userMode == 1){
            console.log("teacher");
            fetch(global.apiURL + "/getTeacherPlan?apiVer=2&teacherID=" + this.state.myTeacherID , {headers: {"Authorization": 'Bearer ' + global.authToken}})
            .then(res=>{
                if(res.status != 200){
                    if(global.authToken == null){
                        alert("Es ist ein Fehler bei der Abfrage aufgetreten")
                        AsyncStorage.getItem("@loginToken", (err, res) =>{if(res == null) return; global.authToken = res; this.fetchData();})
                    }
                    this.setState({ loading: true, fail: true});
                }else{
                   res.json().then(data =>{
                       this.setState({plan: data, loading: false, refreshing: false, fail: false, lastAnimationTimestamp: Date.now()});
                       if(data[0]){
                           this.props.navigation.setParams({todayDate: data[0].date});
                       }
                       if(data[1]){
                        this.props.navigation.setParams({tomorrowDate: data[1].date});
                        }
                   }) 
                }
            }).catch(()=>{
                this.setState({fail: true});
            })
        }
        
    }

    getClass = async () =>{
        await AsyncStorage.getItem("@myClass", (err, res) =>{
            this.setState({myClass: res});
        });
        await AsyncStorage.getItem("@myTeacherID", (err, res) =>{
            this.setState({myTeacherID: res});
        });
    }

    getMyCourses = async () =>{
        await AsyncStorage.getItem("@myCourses", (err, res) =>{
            if(res != null){
                this.setState({myCourses: JSON.parse(res)});
            }
        })
    }

    getUserMode = async () =>{
        await AsyncStorage.getItem("@userMode", (err, res) =>{
            if(res != null){
                this.setState({userMode: res == "student" ? 0 : 1});
            }
        })
    }

    async componentDidMount(){
        global.planState = this;
        await this.getUserMode();
        await this.getMyCourses();
        await this.getClass();
        await this.fetchData();
        
        const firstRun = await AsyncStorage.getItem("@firstRun");
        if(firstRun == null){
            AsyncStorage.setItem("@firstRun", "no");
            global.startTutorial();
        }

        Analytics.setCurrentScreen("Plan");
        this.focusListener = this.props.navigation.addListener('didFocus', this._handleFocus);
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount(){
        AppState.removeEventListener('change', this._handleAppStateChange);
        this.focusListener.remove();
    }

    sortKeys = () =>{
        const courses = this.state.plan[this.state.selectedDay].courses;
        const coursesKeys = Object.keys(courses);
        var dict = {};
        coursesKeys.forEach(key => {
            const course = courses[key];
            dict[course.hour + course.courseName + course.teacher + course.newTeacher + course.room] = key;
        });

        var sortedDictKeys = Object.keys(dict).sort();
        var rawKeys =[];
        for (let i = 0; i < sortedDictKeys.length; i++) {
            const element = dict[sortedDictKeys[i]];
            rawKeys.push(element);
        }
        
        var sortedKeys = [];
        // First pass
        for(var i = 0; i < rawKeys.length; i++){
            if(this.state.myCourses.includes(rawKeys[i])){
                sortedKeys.push(rawKeys[i]);
            }
        }

        // Fill in rest
        for(var i = 0; i < rawKeys.length; i++){
            if(!this.state.myCourses.includes(rawKeys[i])){
                sortedKeys.push(rawKeys[i]);
            }
        }
        return sortedKeys;
    }

    saveMyCourses = () =>{
        AsyncStorage.setItem("@myCourses", JSON.stringify(this.state.myCourses));
        updatePushConfig();
    }

    deleteCourse = (courseName) =>{
        var courses = this.state.myCourses;

        var index = courses.indexOf(courseName);

        if(index == 0){
            courses.shift();
            this.setState({myCourses: courses});
        }else{
            courses.splice(index,1);
            this.setState({myCourses: courses});
        }
        this.saveMyCourses();
    }

    addToMyCourses = (courseName) =>{
        if(this.state.myCourses.includes(courseName)){
            console.log("already exists");
            this.deleteCourse(courseName);
            return;
        }
        var courses = this.state.myCourses;
        courses.push(courseName);
        this.setState({myCourses: courses});
        this.saveMyCourses();
    }

    render() {
        //console.log(this.state);
        if(this.state.fail){
            return(
                <PTRView onRefresh={()=>this.onRefresh()}>

                <View style={{flex: 1, padding: 10}}>
                    <AlertBox type="alert" message={"Es ist ein Fehler aufgetreten"}/>
                    <Button title="Erneut versuchen" onPress={() =>this.onRefresh()}/>
                </View>
                </PTRView>
            )
        }
        if(this.state.loading){
            return(
                <View style={{flex: 1, padding: 10}}>
                    <ActivityIndicator/>
                </View>
            )
        }
        if(this.state.userMode == 0){
            if(this.state.myClass == null || this.state.myClass == ""){
                return (
                    <View style={{flex: 1, padding: 10}}>
                        <AlertBox type="alert" message={"Keine Klasse ausgewählt. \nBitte gehe in die Einstellungen."} />
                    </View>
                )
            }        
        }else if(this.state.userMode == 1){
            if(this.state.myTeacherID == null || this.state.myTeacherID == ""){
                return (
                    <View style={{flex: 1, padding: 10}}>
                        <AlertBox type="alert" message={"Keinen Lehrerkürzel ausgewählt. \nBitte gehe in die Einstellungen."} />
                    </View>
                )
            }        
        }
        if(!this.state.plan[this.state.selectedDay] || Object.keys(this.state.plan[this.state.selectedDay].courses).length == 0) {
            return (
                <PTRView onRefresh={()=>this.onRefresh()}>

                <View style={{flex: 1, padding: 10}}>
                    <AlertBox type="info" message={this.state.userMode == 0 ? "Keine Vertretung für Klasse " + this.state.myClass : "Keine Vertretung für " + this.state.myTeacherID} />
                </View>
                </PTRView>
            )
        }


        var sortedKeys = this.sortKeys();

        

        
        
        return (
            <View>
                <FlatList style={{height: '100%'}}
                    refreshing={this.state.refreshing}
                    data={sortedKeys}
                    key={this.state.orientation + "_flatList"}
                    numColumns={this.state.orientation == "portrait" ? 1 : 2}
                    renderItem={({ item }) => { 
                        
                        var planItem = this.state.plan[this.state.selectedDay].courses[item];
                        
                        //var planItem = item;
                        var actionString;
                        var type = planItem.courseSubstituteType;
                        if(type == 1)
                        actionString = "fällt aus" 
                        else if (type == 2)
                        actionString = "Vertretung"
                        else if(type == 3)
                        actionString = "Raumänderung";
                        else if(type == 4)
                        actionString = "Aufteilung";

                        return <PlanItem addToMyCourses={this.addToMyCourses} ownCourse={this.state.myCourses.includes(planItem.courseName) ? true : false} lastAnimationTimestamp={this.state.lastAnimationTimestamp} time={planItem.hour} courseName={planItem.courseName} year={this.state.userMode == 1 ? planItem.year : null} teacherName={planItem.teacher} roomName={planItem.room} info={planItem.info} newTeacherName={planItem.newTeacher} actionString={actionString}/>}}
                    onRefresh={() => {console.log("refresh");this.onRefresh()}}
                    keyExtractor={(obj, index) => {return this.state.selectedDay + this.state.myClass + "_" + obj}}
                />
            </View>
        )
    }
}
