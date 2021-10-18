import React, { Component } from 'react'
import { TextInput, StyleSheet, View, TouchableOpacity } from 'react-native'
import {Ionicons} from '@expo/vector-icons';

export default class MyCourseItem extends Component {

    constructor(props){
        super(props);
        this.state = {courseName: ""}
    }

    componentDidMount() {
        this.setState({courseName: this.props.courseName});
        console.log(this.props.coursesAutocomplete);
    }

    onChange = (value) =>{
        this.setState({courseName: value});
    }

    updateList = () =>{
        this.props.updateNameCallback(this.props.courseName, this.state.courseName);
    }

    render() {
        return (
            <View style={styles.itemBase}>
                <TextInput editable={false} style={styles.courseName} value={this.state.courseName} spellCheck={false} autoCapitalize={false} autoCorrect={false}  onChangeText={this.onChange} onEndEditing={this.updateList} />
                <TouchableOpacity style={styles.delete}
                    onPress={() => this.props.deleteCallback(this.props.courseName)}>
                    <Ionicons name={"ios-close-circle"} size={28} style={styles.delete} />
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    itemBase:{flexDirection: "row", padding: 10, marginBottom: 10, backgroundColor: '#eeeeee', borderRadius: 90, height: 48},
    courseName: {width: '85%', height: '100%', fontSize: 15, paddingLeft: 5},
    delete:{
        position: "absolute",
        right: 5,
        top: 5,
        width: 28,height: 28
    }
})
