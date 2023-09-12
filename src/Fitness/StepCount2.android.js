import React, { Component } from "react";
import { View, Text, ActivityIndicator, Image, Alert, TouchableOpacity } from 'react-native';
import { GoogleSignin, GoogleSigninButton} from '@react-native-google-signin/google-signin';
import { getWidthnHeight } from "../NewComponents/common";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StepCountUI from "./StepCount.android";
import HelloWorldModule from './CustomModule';

class StepCount extends Component{
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity 
                    style={{padding: getWidthnHeight(2).width, borderWidth: 1, borderColor: '#000000'}}
                    onPress={async() => {
                        // HelloWorldModule.createHelloWorldEvent('Kulbir', 'Punjab');
                        console.log('@@@ NATIVE CODE: ', HelloWorldModule)
                        try{
                            HelloWorldModule.createHelloWorldEvent('Kulbir', 'Punjab');
                        }catch(err){
                            console.log('@#@# ERROR: ', err)
                        }
                    }}
                >
                    <Text>Button</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default StepCount;