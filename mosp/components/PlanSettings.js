import React, { Component } from 'react'
import { Text, StyleSheet, View, TextInput, Switch, AsyncStorage, Platform, TouchableOpacity, TouchableHighlight, ActionSheetIOS } from 'react-native'
import global from '../global';
import {updatePushConfig} from "../pushHandler"
import {Picker} from "@react-native-community/picker";
import { Ionicons } from '@expo/vector-icons';



export default class PlanSettings extends Component {
    constructor(props){
        super(props);
        this.state={myClass: null, 
            notificationsEnabled: true, 
            userMode: 0,
        myTeacherID: null,
        classObject:[],
        teacherObject:[]};
        
    }

    componentDidMount(){
        AsyncStorage.getItem("@myClass", (err, res) => this.changeClass(res));
        AsyncStorage.getItem("@myTeacherID", (err, res) => this.changeTeacherID(res));
        AsyncStorage.getItem("@userMode", (err, res) => this.setUserMode(res == "teacher" ? 1 : 0));
        AsyncStorage.getItem("@notificationsEnabled", (err, res) => this.switchNotification(res == "1" ? true : false));
        AsyncStorage.getItem("@classes", (err, res)=>{
            console.log(res);
            if(err || res == null){
                this.getClassAutocomplete();
                return;
            }
            this.setState({classObject: JSON.parse(res).sort()});
        });
        AsyncStorage.getItem("@teachers", (err, res) => {
            
            if(err || res == null){
                this.getTeacherAutocomplete();
                return;
            }
            this.setState({teacherObject: JSON.parse(res).sort()});
        })

        

        
    }

    switchNotification = (value) =>{
        
        this.setState({notificationsEnabled: value});
        AsyncStorage.setItem("@notificationsEnabled", value == true ? "1" : "0");
        updatePushConfig(this.props.setSyncStatus);
    }

    changeClass = (value) =>{
        if(value == null) return;
        this.setState({myClass: value}, ()=>this.updateClass());
        this.props.updateYearCallback(value);
    }

    changeTeacherID = (value) =>{
        if(value == null) return;
        console.log(value);
        this.setState({myTeacherID: value}, ()=>this.updateTeacherID());
    }
    
    updateClass = () =>{
        AsyncStorage.setItem("@myClass", this.state.myClass);
        global.myClass = this.state.myClass;
        global.planState.setState({myClass: this.state.myClass});

        updatePushConfig(this.props.setSyncStatus);
    }

    updateTeacherID = () =>{
        AsyncStorage.setItem("@myTeacherID", this.state.myTeacherID);
        global.planState.setState({myTeacherID: this.state.myTeacherID});
        updatePushConfig(this.props.setSyncStatus);
    }
    
    setUserMode = (mode) =>{
        this.setState({userMode: mode});
        AsyncStorage.setItem("@userMode", mode == 0 ? "student" : "teacher");
        global.planState.setState({userMode: this.state.userMode});
        updatePushConfig(this.props.setSyncStatus);
    }
    
    classObject = [];
    getClassAutocomplete = async () =>{
            const response = await fetch(global.apiURL + "/getAutocomplete?type=class", {method: "get", headers: {"Authorization": "Bearer " + global.authToken}});
        
        
        if(response.status != 200){
            console.log("error fetching auto complete...");
            this.getClassAutocomplete();
            return;
        }
        this.classObject = await response.json();
        this.classObject.sort();

        this.setState({classObject: this.classObject});
        
        AsyncStorage.setItem("@classes", JSON.stringify(this.classObject));
        console.log("migrated class autocomplete");
    }

    teacherObject = [];
    getTeacherAutocomplete = async () =>{
        if(this.state.teacherObject) return;
        const response = await fetch(global.apiURL + "/getAutocomplete?type=teacher", {method: "get", headers: {"Authorization": "Bearer " + global.authToken}});
        
        if(response.status != 200){
            console.log("error fetching auto complete...");
            this.getTeacherAutocomplete();
            return;
        }
        this.teacherObject = await response.json();
        this.teacherObject.sort();

        this.setState({teacherObject: this.teacherObject});
        AsyncStorage.setItem("@teachers", JSON.stringify(this.teacherObject));
        console.log("migrated teacher autocomplete");
    }

    openIOSPicker = async (type) =>{
        switch(type){
            case "class": 
                var obj = ['Abbrechen'].concat(this.state.classObject);
                
                ActionSheetIOS.showActionSheetWithOptions({options: obj, cancelButtonIndex: 0},(buttonIndex)=>{
                    if(buttonIndex == 0) return;
                    this.changeClass(this.state.classObject[buttonIndex -1]);
                });
            break;

            case "teacher":
                var obj = ['Abbrechen'].concat(this.state.teacherObject);
            
                ActionSheetIOS.showActionSheetWithOptions({options: obj, cancelButtonIndex: 0},(buttonIndex)=>{
                    if(buttonIndex == 0) return;
                    this.changeTeacherID(this.state.teacherObject[buttonIndex-1]);
                });
            break;
        }
    }

    render() {
        var cond_myYearTextFieldEmpty = null;
       

        const classPickerItems = this.state.classObject.map((value, i)=>{
            return <Picker.Item key={value} label={value} value={value}/>

        })

        const teacherPickerItems = this.state.teacherObject.map((value, i)=>{
            return <Picker.Item key={value} label={value} value={value}/>

        })



        // STUDENT SETTINGS ------------------------
        const studentSettings = (
            <View key="studentSettings">
                <View>
                    <Text style={this.styles.myYearLabel}>Meine Klasse / Stufe:</Text> 
                    <Text style={this.styles.myYearLabelDescription}>z.B. 12 oder 7a</Text> 
                    {Platform.OS == "android" ? 
                        <Picker style={[this.styles.myYearTextField, cond_myYearTextFieldEmpty]} selectedValue={this.state.myClass} onValueChange={this.changeClass} >
                            {classPickerItems}
                        </Picker>
                    :
                        <TouchableOpacity style={[this.styles.myYearTextField, cond_myYearTextFieldEmpty]} onPress={() => this.openIOSPicker("class")}>
                            <Text style={{textAlign: "center", textAlignVertical: "center", height: "100%", width: "100%", paddingRight: 20, lineHeight: 32, fontSize: 18}} >{this.state.myClass}</Text>
                            <Ionicons style={{position: "absolute", right: 10, top: 5}} name="md-arrow-dropdown" size={24} color="black" />
                        </TouchableOpacity>
                    }
                    {/* <TextInput style={[this.styles.myYearTextField, cond_myYearTextFieldEmpty]} value={this.state.myClass} spellCheck={false} autoCapitalize={false} autoCorrect={false}  onChangeText={this.changeClass} onEndEditing={this.updateClass}/> */}
                </View>
                <Text style={this.styles.spacer} />
                <View style={{flexDirection: "row"}}>
                    <View style={{width: '80%'}}>
                        <Text style={this.styles.myYearLabel}>Benachrichtigungen:</Text> 
                        <Text style={[this.styles.myYearLabelDescription, {width: '65%'}]}>Benachrichtigungen erhalten, wenn der Plan aktualisiert wird.</Text> 
                    </View>
                    <Switch value={this.state.notificationsEnabled} style={this.styles.notificationSwitch} onValueChange={this.switchNotification} />
                </View>
            </View>);

        // TEACHER SETTINGS ---------------------
        const teacherSettings = (
            <View key="teacherSettings">
                <View>
                    <Text style={this.styles.myYearLabel}>Mein Lehrerkürzel:</Text> 
                    <Text style={this.styles.myYearLabelDescription}>Wie auf dem Vertretungsplan</Text> 
                    {Platform.OS == "android" ? 
                        <Picker style={[this.styles.myYearTextField, cond_myYearTextFieldEmpty]} selectedValue={this.state.myTeacherID} onValueChange={this.changeTeacherID} >
                            {teacherPickerItems}
                        </Picker>
                    :
                        <TouchableOpacity style={[this.styles.myYearTextField, cond_myYearTextFieldEmpty]} onPress={() => this.openIOSPicker("teacher")}>
                            <Text style={{textAlign: "center", textAlignVertical: "center", height: "100%", width: "100%", paddingRight: 20, lineHeight: 32, fontSize: 18}} >{this.state.myTeacherID}</Text>
                            <Ionicons style={{position: "absolute", right: 10, top: 5}} name="md-arrow-dropdown" size={24} color="black" />
                        </TouchableOpacity>
                    }
                    {/* <TextInput style={[this.styles.myYearTextField]} value={this.state.myTeacherID} spellCheck={false} autoCapitalize={false} autoCorrect={false} onChangeText={this.changeTeacherID} onEndEditing={this.updateTeacherID}/> */}
                </View>
                <Text style={this.styles.spacer} />
                <View style={{flexDirection: "row"}}>
                    <View style={{width: '80%'}}>
                        <Text style={this.styles.myYearLabel}>Benachrichtigungen:</Text> 
                        <Text style={[this.styles.myYearLabelDescription, {width: '65%'}]}>Benachrichtigungen erhalten, wenn der Plan aktualisiert wird.</Text> 
                    </View>
                    <Switch value={this.state.notificationsEnabled} style={this.styles.notificationSwitch} onValueChange={this.switchNotification} />
                </View>
            </View>
        );

        

        return (
            <View>
                
                <View style={this.styles.planModeSelectorContainer}>
                    <TouchableOpacity style={[this.styles.planModeSelectorButton, this.state.userMode == 0 ? this.styles.planModeSelectorButtonSelected : null]} onPress={() => this.setUserMode(0)}><Text style={[this.styles.planModeSelectorLabel, this.state.userMode == 0 ? this.styles.planModeSelectorLabelSelected : null]}>Schüler</Text></TouchableOpacity>
                    <Text style={{width: '5%'}}/>
                    <TouchableOpacity style={[this.styles.planModeSelectorButton, this.state.userMode == 1 ? this.styles.planModeSelectorButtonSelected : null]} onPress={() => this.setUserMode(1)}><Text style={[this.styles.planModeSelectorLabel, this.state.userMode == 1 ? this.styles.planModeSelectorLabelSelected : null]}>Lehrer</Text></TouchableOpacity>
                </View>
                <Text style={this.styles.spacer} />
                <Text style={this.styles.spacer} />
                {this.state.userMode == 0 ? studentSettings : teacherSettings}
            </View>
        )
    }

    

    styles = StyleSheet.create({
        myYearLabel: {
            width: '75%',
        },
        myYearTextField: {
            width: '35%',
            position: "absolute",
            top: Platform.OS == 'ios' ? -5 : 0,
            right: 0,
            textAlign: "center",
            borderRadius: 50,
            height: 35
        },
        myYearLabelDescription:{
            fontSize: 10,
            color: '#777777',
        },
        spacer: {
            height: 10
        },
        myYearTextFieldEmpty:{
            borderColor: 'red',
            borderWidth: 2
        },
        planModeSelectorContainer: {
            width: '100%',
            flexDirection: "row",
            flex: 1,
            justifyContent: "center"
        },
        planModeSelectorButton:{
            borderColor: "#0084ff",
            borderWidth: 0,
            borderRadius: 45,
            height: 35,
            width: '45%',
            textAlign: "center",
            backgroundColor: "#eeeeee",
            
        },
        planModeSelectorButtonSelected:{
            borderWidth: 3,
        },
        planModeSelectorLabel: {
            width: '100%',
            height: '100%',
            textAlign: "center",
            textAlignVertical: "center",
            lineHeight: Platform.OS == "ios" ? 35 : null,
        },
        planModeSelectorLabelSelected:{
            lineHeight: Platform.OS == "ios" ? 29 : null // Because iOS doesnt vertically center the text, we need to manually adjust the line-height seperately.
        }
    })
}

