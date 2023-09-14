import React, {Component} from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import { createAppContainer } from 'react-navigation';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import HomeScreen from './screens/HomeScreen';
import Screen2 from './screens/Screen2';
import Splash from './screens/Splash';
import Login from './screens/Login';
import { Transition } from 'react-native-reanimated';

import {MaterialIcons, MaterialCommunityIcons} from '@expo/vector-icons';
import Plan from './screens/Plan';
import News from './screens/News';

import Expo from 'expo'
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import global from "./global";
import Debug from './screens/Debug';

import {updatePushConfig} from "./pushHandler"
import Tutorial from './components/Tutorial';
import * as Analytics from 'expo-firebase-analytics';
import * as firebase from 'firebase';
import AddCourseModal from './components/AddCourseModal';
import { Host } from 'react-native-portalize';
import { DefaultTheme } from '@react-navigation/native';    
import Settings from './screens/Settings';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';


const bottomTab = require('react-navigation-material-bottom-tabs').createMaterialBottomTabNavigator;

const AuthStack = createStackNavigator({LoginScreen: Login});
const MainStack = bottomTab({PlanTab: {
    screen: createStackNavigator({Plan: Plan}),
    navigationOptions:{
        tabBarLabel: "Plan",
        tabBarIcon: ({ tintColor }) => (
            <MaterialCommunityIcons name="calendar-blank" color={tintColor} size={20}/>
        ),
        
    },  
}, NewsTab: {
    screen: createStackNavigator({NewsTab: News}),
    navigationOptions:{
        tabBarLabel: "Informationen",
        tabBarIcon: ({ tintColor }) => (
            <MaterialIcons name="dashboard" color={tintColor} size={20}/>
        ),
        
    },  
},

SettingsTab: {
    screen: createStackNavigator({SettingsTab: Settings, DebugScreen: Debug}),
    navigationOptions:{
        tabBarLabel: "Einstellungen",
        tabBarIcon: ({ tintColor }) => (
            <MaterialIcons name="settings" color={tintColor} size={20}/>
        ),
        
    },  
},
}, {barStyle: { backgroundColor: '#ffffff'}, activeColor: '#069a8c', inactiveColor: '#000000', });



const AuthFlowNavigator = createAnimatedSwitchNavigator({
    SplashScreen:Splash,
    Login: AuthStack,
    HomeScreen: MainStack
}, 
{
    transition: (
        <Transition.Together>
          <Transition.Out
            type="fade"
            durationMs={200}
            interpolation="easeIn"
            />
          <Transition.In type="slide-bottom" durationMs={300} interpolation="easeOut" />
        </Transition.Together>
      ),
      initialRouteName: "SplashScreen", 
});


async function registerPush(){
    console.log("trying to register push")
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    console.log("Status: ", existingStatus);
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    console.log("Status: ", finalStatus);
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      console.log("Failed to get push token for push notification!");
      return;
    }
    console.log("getting token")
    let token = (await Notifications.getExpoPushTokenAsync({experienceId: "@domi2803/mosp"})).data;
    console.log("Token: ", token);
    AsyncStorage.setItem("@pushToken", token);
    console.log(token);

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('plan',
        {
            name: "Planaktualisierungen",
            sound: true,
            enableVibrate: true,
            lockscreenVisibility: true,
            importance: Notifications.AndroidImportance.HIGH,
            description: "Personalisierte Planaktualisierungen jeden Morgen",
        });

        Notifications.setNotificationChannelAsync('messages',
        {
            name: "Nachrichten",
            sound: true,
            enableVibrate: true,
            importance: Notifications.AndroidImportance.MAX,
            lockscreenVisibility: true,
            description: 'Manuell verfasste Benachrichtigungen von der Schulleitung'
        })
        
    }

    // In App Notification Subscription
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
}

async function initRegister(){
    console.log()
    updatePushConfig(()=>{})
}
const AppContainer =  createAppContainer(AuthFlowNavigator);

export default class App extends Component {

    async componentDidMount(){
        registerPush();
        initRegister();

        var firebaseConfig = {
            apiKey: "AIzaSyA8jS-2EuaJ9H96YAFuuUrTDBnmfpypwxk",
            authDomain: "mosp-dcd1c.firebaseapp.com",
            databaseURL: "https://mosp-dcd1c.firebaseio.com",
            projectId: "mosp-dcd1c",
            storageBucket: "mosp-dcd1c.appspot.com",
            messagingSenderId: "104787847560",
            appId: "1:104787847560:web:5d138e7a5782009959f23d",
            measurementId: "G-H7Y0485EJW"
          };
          // Initialize Firebase
          firebase.initializeApp(firebaseConfig);
    }



    render() {
        
        return (
            <SafeAreaView style={{ flex: 1,}}>
                <Host>
                    <AppContainer style={{backgroundColor: '#ffffff'}} />
                    <Tutorial />
                    <StatusBar style="dark" />
                </Host>
            </SafeAreaView>
        )
    }
}


