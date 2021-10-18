import React, { Component } from "react";
import { Text, View, Animated, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Easing } from "react-native-reanimated";
import syncIcon from '../assets/sync.png';

export class SettingsTitleBar extends Component {
  state = {
    rotation: new Animated.Value(0),
    opacity: new Animated.Value(1),
  };

  componentDidMount() {
    Animated.loop(
      Animated.timing(this.state.rotation, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  }

  render() {

    var rotationValue = this.state.rotation.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "-360deg"],
    });

    
    return (
      <View
        style={{

          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ marginLeft: 15, fontSize: 18 }}>Einstellungen</Text>
        <Animated.View
          style={{
            marginRight: 15,
            opacity: this.props.rotating ? 1 : 0,
            transform: [
              {
                rotate: rotationValue,
              },
            ],
          }}
        >
          <Image style={{width: 25, height: 25, transform: [{translateY: 1}]}} source={syncIcon} />
        </Animated.View>
      </View>
    );
  }
}

export default SettingsTitleBar;
