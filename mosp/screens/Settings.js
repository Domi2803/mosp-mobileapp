import React, { Component } from 'react'
import {  Text, StyleSheet, Button, ScrollView,View, Image, TouchableOpacity, AsyncStorage, KeyboardAvoidingView} from 'react-native'

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {Card} from 'react-native-elements'
import global from '../global'
import PlanSettings from '../components/PlanSettings'
import MyCourses from '../components/MyCourses'
import SettingsHeader from '../components/SettingsHeader'
import * as Updates from 'expo-updates';

import { YellowBox } from 'react-native'

import { MaterialIcons } from '@expo/vector-icons'; 
import * as Analytics from 'expo-firebase-analytics';
import SettingsTitleBar from '../components/SettingsTitleBar'
import * as _ from 'lodash';
import AddCourseModal from '../components/AddCourseModal'



YellowBox.ignoreWarnings([
  'VirtualizedLists should never be nested', // TODO: Remove when fixed
])

export default class Settings extends Component {
    
    state={userMode: 0}

    static navigationOptions = ({navigation}) => {
        return({

        // 
        //headerTitle: ()=>{return(<Dropdown data={[{value: "today", label: "Heute"}, {value: "tomorrow", label: "Morgen"}]} style={{height: 25, width: 100}}></Dropdown>)},
        headerTitle: ()=>{
            // 
            return (<SettingsTitleBar rotating={_.get(navigation, "state.params.rotating", false)}/>)
        },
        headerShown: true,
        })
    }


    componentDidMount(){
        
        AsyncStorage.getItem("@userMode", (err, res) =>{
            if(res != null){
                this.setState({userMode: res == "student" ? 0 : 1});
            }
        })

        AsyncStorage.getItem("@myClass", (err,res)=>{
            if(res != null){
                this.updateYear(res);
            }
        })

        AsyncStorage.getItem("@courses", (err, res) => {
            
            if(err || res == null){
                this.getCourses();
                return;
            }
            this.setState({courses: JSON.parse(res)});
        })

        

        this.props.navigation.addListener('didFocus', ()=>{

            Analytics.setCurrentScreen("Settings");
        });
    }

    getCourses = async () =>{
        console.log("getCourses");
        const response = await fetch(global.apiURL + "/getAutocomplete?type=courses", {method: "get", headers: {"Authorization": "Bearer " + global.authToken}});
        
        
        if(response.status != 200){
            console.log("error fetching auto complete...");
            this.getCourses();
            return;
        }
        var courses = await response.json();
        

        this.setState({courses: courses});

        
        
        AsyncStorage.setItem("@courses", JSON.stringify(courses));
        console.log("migrated courses autocomplete");
    }

    componentDidUpdate(){
        AsyncStorage.getItem("@userMode", (err, res) =>{
            if(res != null && res == "student" ? 0 : 1 != this.state.userMode){
                this.setState({userMode: res == "student" ? 0 : 1});
            }
        });

        
    }

    setSyncStatus = (syncing) =>{
        this.props.navigation.setParams({
            rotating: syncing
        })
    }

    updateYear = (newYear) =>{
        this.setState({year: newYear});
    }

    updateCourses = () =>{

    }
  
    render() {
        var year;
        try{
            year = Number.parseInt(this.state.year.match(/(\d+)/g));
        }catch(e){
            year = 0;
        }

        var autoComplete = {};
        if(this.state.year && this.state.courses){
            autoComplete = this.state.courses[this.state.year];
        }

        return (            
            <KeyboardAwareScrollView enableOnAndroid={true} extraHeight={100} extraScrollHeight={125}>
                <SettingsHeader navigation={this.props.navigation} />
                
                    <View key="cardContainer" style={this.styles.cardContainer}>
                        <Card style={this.styles.card} title='Planeinstellungen'>
                            <PlanSettings setSyncStatus={this.setSyncStatus} updateYearCallback={this.updateYear}/>
                        </Card>
                        {this.state.userMode == 0 && year > 10 ? (<Card style={this.styles.card} title='Meine Kurse'>
                            <MyCourses setSyncStatus={this.setSyncStatus} coursesAutocomplete={autoComplete}/>
                        </Card>): null}
                        
                        <View style={{paddingLeft: 50, paddingRight: 50, paddingTop: 25}}><Button title="DEBUG" onPress={()=>this.onDebug()}/></View>
                        <View style={{paddingLeft: 50, paddingRight: 50, paddingTop: 25}}><Button title="FORCE UPDATE" onPress={()=>this.checkUpdates()}/></View>
                        
                        <Text style={{textAlign: "center", paddingTop: 10, color: "#888888"}}>{"\n(c) 2020 DTF IGS Hamm/Sieg\nDominik Vierbuchen\nStephan Stoffelen"}</Text>
                        
                        <View style={{height: 150}}></View>
                    </View>
            </KeyboardAwareScrollView>
        )
    }

    checkUpdates = () =>{
        
        Updates.checkForUpdateAsync().then((update)=>{
            if (update.isAvailable) {
              Updates.fetchUpdateAsync().then(()=>{
                  alert("Update installiert. Starte neu...");
                  Updates.reloadAsync();
              });
            }else{
                alert("Kein Update verfügbar.")
            }
          });
      
    }

    onDebug = () =>{
        this.props.navigation.navigate("DebugScreen");
    }

    styles = StyleSheet.create({
        headerImage:{
            height: 250,
            width: '100%',
            position: "absolute"
        },
        mospIcon:{
            width: 80,
            height: 80,
            top: 35,
            alignSelf: "center"
        },
        schoolName:{
            textAlign: "center",
            position: "absolute",
            top: 120,
            width: '100%',
            color: 'white',
            fontSize: 20,
            
            textShadowColor: "#000",
            textShadowOffset: {
                width: 0,
                height: 2,
            },
            textShadowRadius: 3.84,

            elevation: 5,
        },
        logoutButton:{
            top: 85,
            backgroundColor: '#069a8c',
            width: 140,
            alignSelf: "center",
            borderRadius: 90,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 6,
            },
            shadowOpacity: 0.37,
            shadowRadius: 7.49,

            elevation: 12,
        },
        buttonText:{
            color: 'white',
            fontSize: 14,
            fontWeight: 'bold',
            width: '100%',
            textAlign: "center",
            padding: 7
        },
        cardContainer:{
            width: '100%',
            maxWidth: 600,
            top: 125,
            padding: 5,
            alignSelf: "center"
        },
        card:{
            width: '100%',
            padding: 10
        },
        cardHeader:{
            position: "absolute",
            top: 0,
            left: 0,
            fontSize: 20
        }
    })
}


