import React, { Component } from 'react'
import { Text, StyleSheet, View, Linking } from 'react-native'
import {Card, Button} from 'react-native-elements'
import {MaterialIcons} from "@expo/vector-icons"
import { Html5Entities } from 'html-entities';
const htmlEntities = new Html5Entities();

export default class NewsItem extends Component {
    render() {
        return (
            <Card style={styles.card} title={this.props.title}>
                <Text><Text style={{fontWeight: "bold"}}>{this.props.date}</Text>{this.props.description == "" ? " - Keine Vorschau verfügbar": " - "}{htmlEntities.decode(this.props.description) + "\n"}</Text>
                <Button icon={<MaterialIcons name="open-in-new" size={20} color="white"/>} title=" Im Browser öffnen" onPress={this.openArticle}/>
            </Card>
        )
    }

    openArticle = () =>{
        Linking.openURL(this.props.link);
    }
}

const styles = StyleSheet.create({
    card:{
        width: '100%',
        padding: 10
    },
})
