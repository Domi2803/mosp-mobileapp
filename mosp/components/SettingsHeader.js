import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity, AsyncStorage } from 'react-native'

import * as firebase from 'firebase';

import global from '../global'

export default class SettingsHeader extends Component {

    state={
        headerURL: "",
        iconURL: "",
        schoolName: "",
    }

    constructor(props){
        super(props);
        this.backgroundImage = require('../assets/schoolHeader.jpg');
        this.backgroundImageOverlay = require('../assets/schoolHeaderOverlayLight.png');
        this.mospIcon = require('../assets/newIcons/settingsHeaderWithoutCloud.png');

        AsyncStorage.getItem("@schoolName", (error, res)=>{
            this.setState({schoolName: res});
        })
        AsyncStorage.getItem("@dsbUser", (error, res)=>{
            this.setState({schoolID: res});

            firebase.storage().ref(`${res}/header.jpg`).getDownloadURL().then(url=>{
                this.setState({headerURL: url})
            })
            firebase.storage().ref(`${res}/icon.png`).getDownloadURL().then(url=>{
                this.setState({iconURL: url})
            })
        })

        
    }

    onLogout = () =>{
        global.authToken = null;
        AsyncStorage.removeItem('@loginToken').catch(console.log);
        AsyncStorage.removeItem("@firstRun").catch(console.log);
        AsyncStorage.removeItem("@classes").catch(console.log);
        AsyncStorage.removeItem("@teachers").catch(console.log);
        this.props.navigation.navigate("Login");
    }

    render() {
        return (
            <View >
                <Image key="background" blurRadius={2.5} resizeMethod="scale" resizeMode="cover" fadeDuration={200} source={this.state.headerURL ? {uri:this.state.headerURL, cache: true}: null} style={this.styles.headerImage}/>
                
                <Image key="overlay" resizeMode="stretch" resizeMethod="scale" fadeDuration={0}  source={this.backgroundImageOverlay} style={this.styles.headerImage}/>
                <View style={{alignSelf: "center", width: 200}}>  
                
                    <Image key="icon" fadeDuration={200} borderRadius={90} source={this.state.iconURL ? {uri:this.state.iconURL, cache: true}: null} style={this.styles.mospIcon}/>
                    <Text style={this.styles.schoolName}>{this.state.schoolName}</Text>
                    <TouchableOpacity
                        style={this.styles.logoutButton}
                        onPress={()=>this.onLogout()}>
                        <Text style={this.styles.buttonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
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
            alignSelf: "center",
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
            top: 125,
            padding: 5
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
