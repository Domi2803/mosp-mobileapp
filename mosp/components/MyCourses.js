import React, { Component, createRef } from 'react'
import { Text, StyleSheet, View, AsyncStorage, Button} from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import global from "../global"
import MyCourseItem from './MyCourseItem';
import { NavigationEvents } from 'react-navigation';
import {updatePushConfig} from "../pushHandler"

import { YellowBox } from 'react-native'
import { Picker } from '@react-native-community/picker';
import AddCourseModal from './AddCourseModal';



YellowBox.ignoreWarnings([
  'VirtualizedLists should never be nested', // TODO: Remove when fixed
])



export default class MyCourses extends Component {
    constructor(props){
        super(props);
        this.state = {myCourses: []}
    }

    getMyCourses = () =>{
        AsyncStorage.getItem("@myCourses", (err, res) =>{
            if(res != null){
                this.setState({myCourses: JSON.parse(res)});
            }
        })
    }

    saveMyCourses = () =>{
        AsyncStorage.setItem("@myCourses", JSON.stringify(this.state.myCourses));
        global.planState.setState({myCourses: this.state.myCourses});
        updatePushConfig(this.props.setSyncStatus);
    }

    addCourse = (courseName) =>{
        if(this.state.myCourses.indexOf(courseName) != -1){
            return this.deleteCourse(courseName);
        }
        var courses = this.state.myCourses;
        courses.push(courseName);
        this.setState({myCourses: courses});
        this.saveMyCourses();
    }

    editCourse = (oldName, newName) =>{
        var courses = this.state.myCourses;
        courses[courses.indexOf(oldName)] = newName;
        this.setState({myCourses:courses});
        this.saveMyCourses();
    }

    deleteCourse = (courseName) =>{
        var courses = this.state.myCourses;

        var index = courses.indexOf(courseName);

        if(index == 0){
            courses.shift();
            this.setState({myCourses: courses});
        }else{
            courses.splice(index,1);
            this.setState({myCourses: courses});
        }
        this.saveMyCourses();
    }

    showPicker(){
        
    }

    componentDidMount(){
        this.getMyCourses();
    }

    pickerRef = createRef();

    render() {
        

        
        return (
            <View>
                <NavigationEvents onWillFocus={()=>this.getMyCourses()}/>
                <FlatList 
                data={this.state.myCourses}
                scrollEnabled={false}
                renderItem={({item}) => <MyCourseItem courseName={item} deleteCallback={this.deleteCourse} updateNameCallback={this.editCourse}/>}
                keyExtractor={(obj, index) => {return index+obj}}
                    />

                <Text style={{height: 5}}></Text>
                {/* <Button title="Hinzufügen" onPress={this.addCourse} /> */}
                <AddCourseModal addCourse={this.addCourse} myCourses={this.state.myCourses} coursesAutocomplete={this.props.coursesAutocomplete} />
            </View>
        )
    }

}

const styles = StyleSheet.create({})
