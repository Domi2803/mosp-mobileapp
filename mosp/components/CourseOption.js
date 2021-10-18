import { MaterialIcons } from "@expo/vector-icons";
import React, { Component } from "react";
import { Text, StyleSheet, View, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import icon from "../assets/icon.png";

export default class CourseOption extends Component {
  render() {
    return (
        <TouchableOpacity onPress={()=>{this.props.addCourse();}}>

      <View style={styles.container}>
        {this.props.selected ? (
            <MaterialIcons
            name="check"
            size={24}
            color="black"
            style={styles.checkmark}
            />
            ) : null}
        <Text style={styles.courseName}>{this.props.courseName}</Text>
        <Text style={styles.teacher}>{this.props.teacher}</Text>
      </View>
            </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    marginBottom: 8,
    marginTop: 8,
    paddingLeft: 15,
  },
  courseName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  teacher: {
    fontSize: 15,
    marginTop: -5,
  },
  checkmark: { position: "absolute", right: 15, top: 15 },
});
