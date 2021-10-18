import React, { Component } from 'react'
import { Animated , Easing, Text, StyleSheet, View } from 'react-native'

export default class PulseIcon extends Component {

    state={
        circleSize: new Animated.Value(0),
        circleOpacity: new Animated.Value(1),
    }


    componentDidMount(){
        this.doPulse();
    }

    doPulse = ()=>{
        Animated.timing(this.state.circleSize, {toValue: 1, duration: 500, easing: Easing.out(Easing.quad), useNativeDriver:true}).start(()=>setTimeout(this.reversePulse, 150));
        Animated.timing(this.state.circleOpacity, {toValue: 0.25, duration: 500, easing: Easing.out(Easing.quad), useNativeDriver:true}).start();
        
    }

    reversePulse = () =>{
        
        Animated.timing(this.state.circleSize, {toValue: 0, duration: 500, easing: Easing.out(Easing.quad), useNativeDriver:true}).start(()=>setTimeout(this.doPulse, 50));
        Animated.timing(this.state.circleOpacity, {toValue: 1, duration: 500, easing: Easing.out(Easing.quad), useNativeDriver:true}).start();
    }


    render() {
        return (
            <Animated.View style={[styles.circle, {transform: [{scale: this.state.circleSize}], opacity: this.state.circleOpacity}]}>
                
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    circle:{
        backgroundColor: 'white',
        borderRadius: 90,
        position: "absolute",
        bottom: -15,
        right: 15,
        width: 100,
        height: 100
    }
})
