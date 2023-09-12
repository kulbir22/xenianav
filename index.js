import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import ReactNativeForegroundService from "@supersami/rn-foreground-service";
import 'react-native-get-random-values';

import App from "./Navigation";
import {name as appName} from './app.json';

ReactNativeForegroundService.register();

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
})

messaging().onMessage(async remoteMessage => {
    console.log('FOREGROUND Message!', remoteMessage);
})

AppRegistry.registerComponent(appName, () => (App));
