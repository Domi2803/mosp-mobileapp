import React, { Component } from 'react'
import { Text, StyleSheet, View, Platform, TouchableOpacity, ActionSheetIOS } from 'react-native'
import {Picker} from '@react-native-community/picker';
import global from '../global'

export default class HeaderDaySelect extends Component {
    constructor(props){
        super(props);
        this.state = {selectedDay: "today", todayDate: "Heute", tomorrowDate: "Folgetag"}
        global.headerDaySelectState = this;
    }

    onValueChange = (value, index) =>{
        this.setState({selectedDay: value});
        global.planState.setState({selectedDay: value == "tomorrow"? 1:0});
    }

    componentDidMount(){
        this.onValueChange("today");
    }

    render() {
        if(Platform.OS == 'android')
        return (
            <Picker
                mode="dropdown"
                selectedValue={this.state.selectedDay}
                style={{height: 25, width: '95%', marginLeft: 15, textAlign: 'center'}}
                onValueChange={this.onValueChange}>
                <Picker.Item key="today" label={this.props.todayDate == null  ? "Heute [Kein Plan vorhanden]": this.props.todayDate} value="today"/>
                <Picker.Item key="tomorrow" label={this.props.tomorrowDate == null ? "Folgetag [Kein Plan vorhanden]": this.props.tomorrowDate} value="tomorrow" />
            </Picker>
        )

        if(Platform.OS == 'ios')
        return (
            <TouchableOpacity onPress={()=>this.iosShowActionsheet()}>
                <Text style={{fontWeight: 'bold', fontSize: 15}}>
                    {this.state.selectedDay == 'today' 
                    ? this.props.todayDate == null  ? "Heute [Kein Plan vorhanden]": this.props.todayDate : 
                    this.props.tomorrowDate == null ? "Folgetag [Kein Plan vorhanden]": this.props.tomorrowDate}  ▼
                </Text>
            </TouchableOpacity>
        )
    }

    iosShowActionsheet = () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
              options: [
                this.props.todayDate == null  ? "Heute [Kein Plan vorhanden]": this.props.todayDate, 
                this.props.tomorrowDate == null ? "Folgetag [Kein Plan vorhanden]": this.props.tomorrowDate
                ],
            },
            (buttonIndex) => {
              this.onValueChange(buttonIndex == 1 ? "tomorrow" : "today");
            },
          );
    }
}

const styles = StyleSheet.create({})
