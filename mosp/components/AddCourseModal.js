import { Picker } from "@react-native-community/picker";
import React, { Component } from "react";
import { Text, StyleSheet, View, Button } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import CourseOption from "./CourseOption";

export default class AddCourseModal extends Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
  }

  renderItem = ({ item }) => {
    const courseItem = this.props.coursesAutocomplete[item];
    return (
      <CourseOption key={courseItem.courseName + courseItem.teacher} selected={this.props.myCourses.indexOf(courseItem.courseName) != -1} courseName={courseItem.courseName} teacher={courseItem.teacher} addCourse={()=>this.props.addCourse(courseItem.courseName)} />
    );
  };

  render() {
    return (
      <View>
        <Button
          onPress={() => {
            if (this.modal) this.modal.current.open();
          }}
          title="Kurs hinzufügen"
        />
        <Portal>
          <Modalize
            ref={this.modal}
            modalHeight={500}
            HeaderComponent={(
                <Text style={{padding: 10, fontSize: 20, fontWeight: "bold", textAlign: "center"}}>Neuen Kurs hinzufügen</Text>
            )}
            flatListProps={{
              data: Object.keys(this.props.coursesAutocomplete),
              renderItem: this.renderItem,
              keyExtractor: (item) => item.heading,
              showsVerticalScrollIndicator: true,
            }}
          ></Modalize>
        </Portal>
      </View>
    );
  }

  onClose = () => {};
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
