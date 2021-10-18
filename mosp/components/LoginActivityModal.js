import { Picker } from "@react-native-community/picker";
import React, { Component } from "react";
import { Text, StyleSheet,Animated, View, Button, Image } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { Easing } from "react-native-reanimated";
import syncIcon from '../assets/sync.png';


export default class LoginActivityModal extends Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.state = { isOpen: false, rotation: new Animated.Value(0),
        opacity: new Animated.Value(1),};
  }

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
    if (this.props.isOpen != this.state.isOpen && this.modal.current) {
      if (this.state.isOpen) {
        this.modal.current.close();
        console.log("close");
      } else {
        this.modal.current.open();
        console.log("open");
      }

      this.setState({ isOpen: this.props.isOpen });
    }

    var rotationValue = this.state.rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "-360deg"],
      });

    return (
      <Portal>
        <Modalize
          ref={this.modal}
          modalHeight={100}
          closeOnOverlayTap={false}
          tapGestureEnabled={false}
          panGestureEnabled={false}
        >
          <View style={styles.container}>
            {this.props.isWrong?(
                
                <Text allowFontScaling={false} style={[styles.loginText, {color: "#ff0000"}]}>Zugangsdaten ungültig</Text>
                ):(
                    
                    <Text allowFontScaling={false} style={styles.loginText}>Einloggen...</Text>
            )}
          </View>
        </Modalize>
      </Portal>
    );
  }

  onClose = () => {};
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1
  },
  loginText: {
    fontSize: 24,
    textAlign: "center",
    marginTop: 20
  },
});
