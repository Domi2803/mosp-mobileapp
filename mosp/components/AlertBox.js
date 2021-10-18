import React, { Component } from 'react'
import { Text, StyleSheet, View, Image } from 'react-native'
import {MaterialIcons, MaterialCommunityIcons} from '@expo/vector-icons';

export default class AlertBox extends Component {
    render() {
        return (
            <View style={styles.box}>
                {this.props.type == "alert" ? (<MaterialCommunityIcons name="alert" color="red" size={60} style={styles.icon}/>) : null}
                {this.props.type == "info" ? (<MaterialCommunityIcons name="information" color="white" size={60} style={styles.icon}/>) : null}
                <Text style={styles.text}>{this.props.message }</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    box:{
        width: '100%',
        borderRadius: 5,
        backgroundColor: '#000000',
        padding: 10,
        height: 100,
        justifyContent: "center",
        alignContent: "center",
        alignItems:"center",
        flexDirection: "row",
        marginBottom: 15
    },
    text: {
        fontSize: 17,
        color: 'white',
        textAlign: "left",
        flex: 1,
        paddingLeft: 15,
        // backgroundColor: "red",
    },
    icon:{
        width: 68,
        height: 60,
        paddingLeft: 8,
        top: -2,
        // backgroundColor: "green",
    }
})
