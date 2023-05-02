import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView, View, ActivityIndicator, Alert, Text, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import checkVersion from 'react-native-store-version';

import { sendProps, loginState, setProject, setServerLabel } from './store/redux/reducer';
import { fontSizeH4, getMarginRight } from './KulbirComponents/common';

const testLabel = (<Text style={[{fontSize: fontSizeH4().fontSize - 3, color: 'white'}, getMarginRight(3)]}>Test</Text>);

function AppLoading({navigation}){

    const route = useRoute();
    const dispatch = useDispatch();
    const [ currentVersion, setCurrentVersion ] = useState(DeviceInfo.getVersion());

    async function checkXeniaUpdate(){
        if(Platform.OS === "android"){
            try {
                const check = await checkVersion({
                  version: currentVersion, // app local version
                  androidStoreURL: 'https://play.google.com/store/apps/details?id=com.xenia',
                  country: 'jp', // default value is 'jp'
                });
        
                console.log("RESULT: ", check)
                //setPlayStoreAppVersion(check.remote)
                checkUserAlreadyLoggedIn(check.remote);
            } catch (e) {
                console.log("LOADING ERRRO: ", e);
                checkUserAlreadyLoggedIn();
            }       
        }else{
            checkiOSUpdate();
        }
    }

    async function checkiOSUpdate(){
        const userID = 'fO81JtVcAfQ5BIALRz094zLBpW52';
        const appID = 'b2TgtDNCt4DQCtCJAPm5';
        const platform = 'ios';
        const appHostURL = `https://appho.st/api/get_current_version/?u=${userID}&a=${appID}&platform=${platform}`;
        //this.showLoader();
        axios.get(appHostURL).then((response) => {
            //this.hideLoader();
            const responseJson = (response.data);
            console.log("!!!### APPHOST SUCCESS", responseJson)
            // setPlayStoreAppVersion(responseJson.version)
            checkUserAlreadyLoggedIn(responseJson.version);
        }).catch((error) => {
            //this.hideLoader();
            console.log("AXIOS ERROR: ", error)
            checkUserAlreadyLoggedIn();
            let status = null;
            if(error.response){
                status = error.response.status;
                //Alert.alert("Error!", `Close the app and try again. Error Code: ${status}146`);
            }else{
                //Alert.alert("Error!", `Close the app and try again. ${error} API CODE: 146`);
            }
        });
    }

    async function checkUserAlreadyLoggedIn(playStoreAppVersion){
        try{
            AsyncStorage.getItem('userObj').then(async(userObj) => {
                const baseURL = await AsyncStorage.getItem('receivedBaseURL');
                // console.log("@@@###$$$ BASEURL: ", baseURL)
                if(!!baseURL && baseURL.includes('bpo')){
                    dispatch(setServerLabel(testLabel));
                }else{
                    dispatch(setServerLabel(null));
                }
                if(userObj){
                    dispatch(sendProps(userObj));
                    const parsedData = JSON.parse(userObj);
                    dispatch(setProject(parsedData.success.project));
                    // console.log("&&& APP VERSION: ", playStoreAppVersion, '>', currentVersion);
                    if(playStoreAppVersion > currentVersion){
                        dispatch(loginState(false));
                        // navigation.navigate('login', {playStoreVersion: this.state.playStoreAppVersion})
                    }else{
                        dispatch(loginState(true));
                    }
                }else{
                    // navigation.navigate('login', {playStoreVersion: this.state.playStoreAppVersion});
                    dispatch(loginState(false));
                }
            })
        }catch(error){
            console.log("### ERROR: ", error)
            Alert.alert("Alert!", error);
        }
    }

    useEffect(() => {
        checkXeniaUpdate();
        console.log("@@@ LOADING NAVIGATION STATE: ", navigation.getState());
    }, []);
    return (
        <SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size={"large"} color="#039FFD" style={{transform: [{scale: 2}]}}/>
        </SafeAreaView>
    )
}

export default AppLoading;