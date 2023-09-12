import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {getWidthnHeight} from '../NewComponents/common';
//////////////////////////////////////////////////////////////////////////////////////
//LIVE SERVER
export const login = 'http://www.erp.xeamventures.com/api/v1';

export const fetchURL = async() => await AsyncStorage.getItem('receivedBaseURL');

export const extractBaseURL = async() => AsyncStorage.getItem('receivedBaseURL');

export const getLeadDownloadAPI = async(fileName) => {
    const serverLink = await AsyncStorage.getItem('receivedBaseURL');
    return `${serverLink}/lead/lead/${fileName}/download`
}

export const getLeadAttachmentDownloadAPI = async(fileName) => {
    const serverLink = await AsyncStorage.getItem('receivedBaseURL');
    // console.log("@@@@ ACTIVE SERVER: ", serverLink)
    // const check = serverLink.includes('bpo')
    return `${serverLink}/lead/lead-comments/${fileName}/download`
}

export const getClaimDocumentAttachmentAPI = async(fileName) => {
    const serverLink = await AsyncStorage.getItem('receivedBaseURL');
    // const check = serverLink.includes('bpo')
    // console.log("@@@@ ACTIVE SERVER: ", serverLink, check)
    return `${serverLink}/travel/download-attachment/claim/${fileName}`
}

export const fetchBaseURL = async() => await AsyncStorage.getItem('onboardingURL');

// const savedURL = async() => {
//     await extractBaseURL().then((baseURL) => {
//         return baseURL;
//       })
// }

// export const axiosAPI = axios.create({
//     'baseURL': savedURL()
// })

export const drawerMenuWidth = getWidthnHeight(80);

export const savedToken = "";