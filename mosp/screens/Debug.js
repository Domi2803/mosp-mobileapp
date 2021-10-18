import React, { Component } from 'react'
import { Text, StyleSheet, View, TextInput, AsyncStorage, ScrollView } from 'react-native'
import global from "../global"
import * as Analytics from 'expo-firebase-analytics';

export default class Debug extends Component {
    static navigationOptions = {
        title: "DEBUG",
        headerShown: true
    }

    state={apiURL: null, pushToken: null, myClass: null, myTeacherID: null, myCourses: null, userMode: null}

    componentDidMount() {
        this.getUserMode();
        this.getMyCourses();
        this.getClass();
        this.setState({apiURL: global.apiURL});
        this.getPushToken();

        this.props.navigation.addListener('didFocus', ()=>{

            Analytics.setCurrentScreen("Debug");
        });
    }

    getPushToken = async () =>{
        var pushToken = await AsyncStorage.getItem("@pushToken");
        this.setState({pushToken: pushToken});
    }

    getClass = async () =>{
        AsyncStorage.getItem("@myClass", (err, res) =>{
            this.setState({myClass: res});
        });
        AsyncStorage.getItem("@myTeacherID", (err, res) =>{
            this.setState({myTeacherID: res});
        });
    }

    getMyCourses = async () =>{
        AsyncStorage.getItem("@myCourses", (err, res) =>{
            if(res != null){
                this.setState({myCourses: res});
            }
        })
    }

    getUserMode = async () =>{
        AsyncStorage.getItem("@userMode", (err, res) =>{
            if(res != null){
                this.setState({userMode: res + " [id:" + (res == "student" ? 0 : 1) + "]"});
            }
        })
    }

    render() {
        return (
            <ScrollView >
                <View style={{padding: 15}}>

                <Text style={{color: "red", paddingBottom: 10}}>DIESE EINSTELLUNGEN SIND NUR FÜR ENTWICKLER GEDACHT. BITTE NUR BEARBEITEN, WENN DU WEIST WAS DU TUST.{"\n"}EIN NEUSTART SETZT DIE EINSTELLUNGEN ZURÜCK.</Text>
                <Text>API URL:</Text><TextInput style={styles.textField} value={global.apiURL} onChangeText={this.changeURL}/>
                <Text>Auth Token:</Text><TextInput style={[styles.textField]} numberOfLines={4} value={global.authToken} multiline={true} />
                <Text>Push Token:</Text><TextInput style={styles.textField} value={this.state.pushToken} multiline={true} />
                <Text>userMode:</Text><TextInput editable={false} style={styles.textField} value={this.state.userMode} multiline={true} />
                <Text>myClass:</Text><TextInput editable={false} style={styles.textField} value={this.state.myClass} multiline={true} />
                <Text>myTeacherID:</Text><TextInput editable={false} style={styles.textField} value={this.state.myTeacherID} multiline={true} />
                <Text>myCourses:</Text><TextInput editable={false} style={styles.textField} value={this.state.myCourses} multiline={true} />
                </View>
            </ScrollView>
        )
    }

    changeURL = (e) =>{
        this.setState({apiURL: global.apiURL});
        global.apiURL = e;
        console.log(global.apiURL);
    }
}

const styles = StyleSheet.create({
    textField: {
        borderColor: "#000000",
        borderWidth: 1,
        marginBottom:10,
        paddingLeft: 5,
        paddingRight: 5
    }
})
