import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, Button } from 'react-native'
import Animated, { Easing } from 'react-native-reanimated';
import Swiper from 'react-native-swiper';
import { MaterialIcons } from '@expo/vector-icons'; 
import PulseIcon from './PulseIcon';
import global from '../global';
export class Tutorial extends Component {



    state = {
        isActive: false,
        opacity: new Animated.Value(0)
    }

    fadeIn = ()=>{
        this.setState({isActive: true});
        Animated.timing(this.state.opacity, {toValue: 0.9, duration: 250, easing: Easing.linear}).start();
    }


    constructor(props){
        super(props);
        this.mospIcon = require('../assets/logo.png');
        global.startTutorial = ()=>this.fadeIn();
        
    }

    render() {
        console.log("tutorialstate", this.state.active)
        if(!this.state.isActive) return <View></View>;
        return (
            <Animated.View className="tutorialScreen" style={[styles.tutorialScreen, {opacity: this.state.opacity}]}>
                <Swiper style={styles.wrapper} showsButtons={true} showsPagination={false} loop={false}>

                    <View testID="welcome" style={styles.slide}>
                        <Text style={styles.text}>Willkommen bei</Text>
                        <Image source={this.mospIcon} resizeMethod={'scale'} style={{marginTop: 20, width: 300, height: 100}} />

                        <Text style={styles.swipeToContinueText}>Wische zum Fortfahren {'\n\n'}
                        </Text>
                    </View>

                    <View testID="settings" style={styles.slide}>
                        <Text style={styles.text}>Gehe zunächst in die Einstellungen und gebe deine Klasse ein.</Text>
                        <PulseIcon/>
                        <Text style={styles.swipeToContinueText}>Wische zum Fortfahren {'\n\n'}
                        </Text>
                    </View>

                    <View testID="Simple" style={styles.slide}>
                        <Text style={styles.text}>Füge dann deine Kurse hinzu, indem du lange auf einen Planeintrag drückst oder den Kurskürzel in den Einstellungen eingibst</Text>
                        <View style={{marginTop:60, width: '60%'}}><Button title="Verstanden!" onPress={()=>this.finish()}/></View>
                    </View>
                </Swiper>
                {/* <View style={styles.container}>
                    <Text style={styles.text}>Willkommen bei</Text>
                    <Image key="icon" fadeDuration={0}  source={this.mospIcon} resizeMethod={'resize'} style={{position: "absolute", top: 100, left: 0, left: '20%', width: '60%', height: 90}}/>
                </View> */}
            </Animated.View>
        )
    }

    finish(){
        Animated.timing(this.state.opacity, {toValue: 0, duration: 250, easing: Easing.linear}).start();
        setTimeout(()=>this.setState({isActive: false}), 250)
    }

}

const styles = StyleSheet.create({
    tutorialScreen:{
        position: "absolute",
        height: '100%',
        width: '100%',
        backgroundColor: '#000000',
        
    },
    container:{
        color: '#ffffff',
        fontSize: 35,
        width: '100%',
        height: '100%',
        paddingTop: 50
    },
    text: {
        color: 'white',
        fontSize: 25,
        width: '100%',
        textAlign: "center"
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 50,
    },
    swipeToContinueText:{
        color: 'white',
        fontSize: 18,
        position: 'absolute',
        bottom: 0,
        textAlign:"center"
    }
});
export default Tutorial
