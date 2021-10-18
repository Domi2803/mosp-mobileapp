import {AsyncStorage} from "react-native";
import global from "./global"

async function updatePushConfig(setSyncStatus){
    console.log("updating...");
    setSyncStatus(true);
    const dsbUser = await AsyncStorage.getItem("@dsbUser");
    const myCourses = JSON.parse(await AsyncStorage.getItem("@myCourses"));
    const pushToken = await AsyncStorage.getItem("@pushToken");
    const isPushEnabled = await AsyncStorage.getItem("@notificationsEnabled") == 1 ? true: false;
    const userMode = await AsyncStorage.getItem("@userMode");
    const myYear = await AsyncStorage.getItem("@myClass");
    const myTeacherID = await AsyncStorage.getItem("@myTeacherID");


    if(!dsbUser){
        fetch(global.apiURL + "/push", {method: 'POST', headers: {'Content-Type': 'application/json'},body: JSON.stringify({type: "remove"})});
        return;
    }

    if(!pushToken || pushToken == "")
    return;

    const response = fetch(global.apiURL + "/push", {method: 'POST', headers: {
        'Content-Type': 'application/json'
    },body: JSON.stringify({
        type: isPushEnabled ? "add":"remove", 
        token: pushToken, 
        user: dsbUser,
        year: myYear,
        teacherID: myTeacherID,
        userMode: userMode == "student" ? 0:1,
        courses: myCourses})}).then(response =>{
            if(response.status == 200){
                setSyncStatus(false);
            }else{
                console.log("Syncing got Status: ", response.status, ", trying again...");
                setTimeout(()=>updatePushConfig(setSyncStatus), 100);
            }
        }).catch(error =>{
            setTimeout(()=>updatePushConfig(setSyncStatus), 100);
        });

    console.log(response.status);
    
}

module.exports = {updatePushConfig};