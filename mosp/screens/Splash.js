import React, { Component } from 'react'
import {
    Text,
    Button,
    View,
    Image,
    StyleSheet,
    AsyncStorage
} from 'react-native';

import global from '../global'

export class Splash extends Component {

    static navigationOptions = {
        title:"Hello",
        headerShown: false
    }

    componentDidMount(){
        AsyncStorage.getItem("@myClass", (err, res) =>{
            global.myClass = res;
        });
        AsyncStorage.getItem("@loginToken", (err, res) =>{
            if(res != null && err == null){
                global.authToken = res;
                setTimeout(()=>{
    
                    this.props.navigation.navigate("HomeScreen");
                },250);
            }else{
                setTimeout(()=>{
    
                    this.props.navigation.navigate("Login");
                },250);
            }
        });
    }

    render() {

        setTimeout(()=>{
        }, 2000)
        return (
            <View style={{flex: 1, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center'}}>
                <Image resizeMode="contain" style={styles.logo} source={require("../assets/adaptiveIcon.png")}></Image>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    logo:{
        position: 'absolute',
        width: '75%',
        height: 125,
    }
});

export default Splash
