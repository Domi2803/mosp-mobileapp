import React, { Component } from 'react'
import { Text, Image,  StyleSheet, View, TouchableWithoutFeedback, TouchableOpacity, Linking, AsyncStorage, Platform, requireNativeComponent } from 'react-native';

import Animated, {Easing} from 'react-native-reanimated';

import {MaterialIcons} from '@expo/vector-icons';
import  { Menu, MenuItem, Position } from "react-native-enhanced-popup-menu";

const global = require("../global");

const timeIcon = require('../assets/clock.svg');

class PlanItem extends Component {

    // Teacher Bottom Bar Element
    teacher = (<>
    <MaterialIcons name="person" style={[styles.icon, styles.teacherIcon]} />
    <Text allowFontScaling={false} style={styles.bottomBarText}>{this.props.teacherName}</Text>
    <Text allowFontScaling={false} style={styles.bottomBarSpacer} />
    </>);

     // Teacher Bottom Bar Element
    newTeacher = (<>
       <MaterialIcons name="person" style={[styles.icon, styles.newTeacherIcon]} />
       <Text allowFontScaling={false} style={styles.bottomBarText}>{this.props.newTeacherName}</Text>
       <Text allowFontScaling={false} style={styles.bottomBarSpacer} />
       </>);

    // Room Bottom Bar Element
    room = (<>
    <MaterialIcons name="room" style={[styles.icon, styles.roomIcon]} />
    <Text allowFontScaling={false} style={styles.bottomBarText}>{this.props.roomName}</Text>
    </>);

    menuRef = null;
    textRef = React.createRef();

    constructor(props){
        super(props);
        this.state = {
            slideIn: new Animated.Value(0),
            pressIn: false,
            lastAnimationTimestamp: 0
        }
    }

    componentDidMount(){
        this.setState({lastAnimationTimestamp: this.props.lastAnimationTimestamp});
        this.startAnimation(Date.now());
    }

    startAnimation = (timestamp)=>{
        this.setState({lastAnimationTimestamp: timestamp, slideIn: new Animated.Value(0)}, ()=>{

            Animated.timing(this.state.slideIn, {
                toValue: 1,
                duration: 500,
                easing: Easing.out(Easing.cubic)
            }).start();
        });
    }

    onPressInfo = async () =>{
        if(this.props.info.includes("EVA")) {
            const dsbUser = await AsyncStorage.getItem("@dsbUser");
            var result = await fetch(global.apiURL + "/getURL?type=eva&user=" + dsbUser);
            var resultObj = await result.json();

            Linking.openURL(resultObj.url);
        }
    }

    componentDidUpdate(prevPros){
        if(this.props.lastAnimationTimestamp > this.state.lastAnimationTimestamp)
            this.startAnimation(this.props.lastAnimationTimestamp);
    }

    render() {
                
        if(this.props.info != null)
            var infoSmall = this.props.info.length > 15 ? styles.smallInfo : null;

        
        
        var pressInStyle = null;
        if(this.state.pressIn){
            pressInStyle = {backgroundColor: '#818181'}
        }
        
        var timeString = "";
        
        if(this.props.time){

            var timeSplit = this.props.time.toString().split(',');
            if(timeSplit.length > 1){
                timeString = timeSplit[0] +" -"+timeSplit[timeSplit.length-1]; 
            }else
            timeString = timeSplit[0];
        }
                  
        return (
            <TouchableWithoutFeedback onPressIn={()=>{this.setState({pressIn: true}); }} onPressOut={()=>{this.setState({pressIn: false})}} onLongPress={()=>{console.log("long press"); this.menuRef.show(this.textRef.current, Position.TOP_LEFT, {top:20, left: 100});}}>
            <Animated.View style={[styles.base, {left: Animated.interpolate(this.state.slideIn, {inputRange: [0,1], outputRange: [500, 0]}), opacity: this.state.slideIn}, pressInStyle, {margin: 10, marginBottom: 0}]}>
                <Text numberOfLines={1} allowFontScaling={false} style={[styles.timeSlot, this.props.ownCourse && styles.active, this.props.year ? {paddingTop: Platform.OS == "ios" ? 8:16}: null]}>
                    {/* <MaterialIcons name="watch-later" style={[styles.icon]} />{"\n"} */}
                    {timeString}
                </Text>
                {this.props.year ? <Text allowFontScaling={false} style={[styles.year,  this.props.year.length > 5 ? {fontSize: 12} : null]}>{this.props.year ? this.props.year + "\n" : null}</Text>
                :null}
                <Text ref={this.textRef} numberOfLines={1} style={[styles.action]} allowFontScaling={false}>
                    <Text style={styles.courseName}>{this.props.courseName}</Text>{this.props.actionString == null ? "" : ": " + this.props.actionString}
                </Text>
                <View style={styles.bottomBar} >
                    {this.props.teacherName != "" && this.teacher} 
                    {this.props.newTeacherName != null && this.newTeacher} 
                    {this.props.roomName != null && this.room}

                    <TouchableOpacity onPress={()=>this.onPressInfo()} style={[styles.infoIcon]}><MaterialIcons name="info" style={[styles.icon]} /></TouchableOpacity>
                    <Text numberOfLines={1} style={[styles.bottomBarText, styles.infoText, infoSmall]} allowFontScaling={false}>{this.props.info == "" ? "-" : this.props.info}</Text>
                </View>

                <Menu
                    ref={(ref)=>this.menuRef = ref}
                >
                    <MenuItem onPress={()=>{this.props.addToMyCourses(this.props.courseName); this.menuRef.hide()}}>{!this.props.ownCourse ? "Zu meinen Kursen hinzufügen":"Von meinen Kursen entfernen" }</MenuItem>
                </Menu>
            </Animated.View>
            </TouchableWithoutFeedback>
        )
    }
}

export default PlanItem;

const styles = StyleSheet.create({
    base:{
        flex: 1,
        marginBottom: 15,

        
        backgroundColor: '#999999',
        height: 100,
        borderRadius: 5,

        //#region shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,
        //#endregion
    },
    year: {
        color: 'white',
        fontSize: 15,
        width:75,
        textAlign: "center", 
        position: "absolute", 
        top: 0, 
        margin: 0,
        backgroundColor: '#444444',
        height: 22,
        borderTopLeftRadius: 5,
        lineHeight: Platform.OS == "ios" ? 22 : 20,
        textAlignVertical: "center"
    },
    bottomBar: {
        height: 30,
        width: '100%',
        backgroundColor: '#333333',
        position: 'absolute',
        bottom: 0,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        flex: 1,
        flexDirection: "row"
    },
    timeSlot:{
        position: 'absolute',
        backgroundColor: "#555555",
        width: 75,
        height: 71,
        paddingTop: 5,
        color: 'white',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 25,
        lineHeight: Platform.OS == 'ios' ? 65 : 25,
        borderTopLeftRadius: 5,
    },
    courseName:{
        fontSize: 25,
        fontWeight: "bold"
    },
    action:{
        position: 'absolute',
        paddingLeft: 90,
        height: 70,
        top: 0,
        textAlign: 'left',
        textAlignVertical: 'center',
        fontSize: 25,
        lineHeight: Platform.OS == 'ios' ? 70 : 70/2,
        color: 'white',
        width: "100%"
    },

    active:{
        backgroundColor: '#ff8800'
    },
    icon:{
        fontSize: 25,
        color: 'white',
        height: 30,
        textAlignVertical: 'center',
        marginRight: 0,
        lineHeight: Platform.OS == 'ios' ? 30 : 25,
    },

    bottomBarText:{
        fontSize: 16,
        height: 30,
        textAlignVertical: "center",
        color: 'white',
        lineHeight: Platform.OS == 'ios' ? 30 : 20,
    },
    bottomBarSpacer:{
        width: 10
    },

    teacherIcon:{
        paddingLeft: 2.5,
        color: 'red'
    },
    newTeacherIcon:{
        paddingLeft: 2.5,
        color: '#61eb34'
    },
    roomIcon:{
        paddingLeft: 2.5,
        color: 'white',
        fontSize: 23
    },

    infoIcon:{
        position: "absolute",
        right: 0,
        width: 30,
        height: 30
    },
    infoText:{
        position: "absolute",
        right: 35,
        top: 0,
        width: 175,
        textAlign: "right",
    },
    verySmallInfo:{
        fontSize: 8,
        textAlign: "right"
    },
    smallInfo:{fontSize: 10, textAlign: "right"}, 
})
