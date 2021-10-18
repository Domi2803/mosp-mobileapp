import React, { Component } from 'react'
import {
    Text,
    Button,
    View,
    Image,
    StyleSheet,
    TextInput,
    AsyncStorage,
    KeyboardAvoidingView,
    Platform,
    Dimensions
} from 'react-native';


import global from '../global'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LoginActivityModal from '../components/LoginActivityModal';

export class Login extends Component {

    static navigationOptions = {
        title:"Login",
        headerShown: true
    }

    constructor(props) {
        super(props);
        this.state = {isWrong: false, loggingIn: false, username: "", password: "", orientation: this.isPortrait() ? 'portrait' : 'landscape'};
    }

     isPortrait = () => {
        const dim = Dimensions.get('screen');
        return dim.height >= dim.width;
    };

    componentDidMount(){
        this.setState({username: "", password: ""});

          // Event Listener for orientation changes
          Dimensions.addEventListener('change', () => {
            this.setState({
              orientation: this.isPortrait() ? 'portrait' : 'landscape'
            });
          });
    }
      
    handleSubmit = () =>{
        this.setState({loggingIn: true});
        fetch(global.apiURL + "/login", {method: "POST", headers: {
            'Content-Type': 'application/json'
        },body: JSON.stringify({dsbUser: this.state.username, dsbPass: this.state.password})}).then(res=>{console.log(res.status); return res.json()})
        .then(res => {
            console.log(res);
            if(res.status == "ok"){
                this.setState({loggingIn: false, isWrong: false});
                global.authToken = res.token;
                AsyncStorage.setItem("@loginToken", res.token);
                AsyncStorage.setItem("@dsbUser", this.state.username);
                AsyncStorage.setItem("@schoolName", res.schoolName);
                AsyncStorage.setItem("@classes", JSON.stringify(res.classes));
                AsyncStorage.setItem("@teachers", JSON.stringify(res.teachers));
                AsyncStorage.setItem("@courses", JSON.stringify(res.courses));
                this.props.navigation.navigate("HomeScreen");
            }else{
                this.setState({isWrong: true});
                setTimeout(()=>{
                    this.setState({isWrong: false, loggingIn: false});
                }, 1500);
            }
        }).catch((err)=>{
            this.setState({isWrong: false, loggingIn: false});
        });

          //console.log(response);
    }

    

    render() {
        return (
            <KeyboardAwareScrollView extraScrollHeight={150} contentContainerStyle={{height: "100%", justifyContent: "center"}}>
                <View style={{height: "75%", flexDirection: this.state.orientation == "portrait" ? "column" : "row"}}>

                <Image resizeMode="contain" style={styles.logo} source={require("../assets/newIcons/loginLogo.png")}></Image>
                <View style={styles.loginContainer}>
                    <TextInput name="username" 
                        ref={ref =>{
                            this.usernameField = ref;
                        }}
                        placeholder="Benutzer" 
                        autoCapitalize="none"
                        autoCorrect={false}
                        
                        autoCompleteType="username" 
                        style={styles.input}
                        returnKeyType = { "next" }
                        onSubmitEditing={() => { this.passwordField.focus(); }}
                        blurOnSubmit={false}
                        onChangeText={(value) => {this.setState({username: value})}} 
                        value={this.state.username}
                        />
                    
                    
                    <TextInput name="password" 
                        ref={ref =>{
                            this.passwordField = ref;
                        }}
                        placeholder="Passwort" 
                        secureTextEntry={true} 
                        autoCompleteType="password" 
                        onSubmitEditing={() => { this.handleSubmit(); }}
                        style={[styles.input, styles.passwordField]} 
                        onChangeText={(value) => {this.setState({password: value})}} 
                        value={this.state.password}
                        />
                    
                    <Button style={styles.loginButton} title="Login" onPress={() =>{this.handleSubmit();}} />
                    <View style={{height: 25}}></View>
                </View>
                </View>
                <LoginActivityModal isOpen={this.state.loggingIn} isWrong={this.state.isWrong} />
            </KeyboardAwareScrollView>
        )
    }
}

const styles = StyleSheet.create({
    logo:{
        flex: 1,
        alignSelf: "center",
        height: 200,
    },

    loginContainer: {
        flex: 1,
        width: "75%",
        alignSelf: "center",
        marginTop: 25
    },

    input:{
        marginBottom: 15,
        width: '100%',
        height: 40,
        backgroundColor: '#eeeeee',
        padding: 10
    },
    passwordField:{
        marginBottom: 25
    },
    loginButton:{
        height: 25,
    }
});

export default Login
