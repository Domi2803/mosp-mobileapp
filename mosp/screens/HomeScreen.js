import React, { Component } from 'react';
import {
    Text,
    Button,
    View
} from 'react-native';

export class HomeScreen extends Component {

    static navigationOptions = {
        title: "Home [SCHOOL_NAME]",
        headerShown: true
    }

    render() {
        return (
            <View>
                <Text>WELCOME. YOU HAVE ENTERED THE ZONE OF ULTIMATE PLEASURE.</Text>
            </View>
        )
    }
}

export default HomeScreen
