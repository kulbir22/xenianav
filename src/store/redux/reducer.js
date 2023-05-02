import { createSlice, combineReducers } from '@reduxjs/toolkit';

export const userData = createSlice({
    name: 'User-Data',
    initialState: {
        userObj: null,
        mainLink: '',
        isLoggedIn: null,
        enableGame: false,
        resetDrawer: false,
        cameraFile: null,
        timePicker: {'fromTime': null, 'toTime': null},
        preBid: {'fromTime': null, 'toTime': null},
        drawerSelection: '',
        project: '',
        serverLabel: null,
        reloadHome: false
    },
    reducers: {
        sendProps: (state, action) => {
            state.userObj = action.payload;
        },
        severLink: (state, action) => {
            state.mainLink = action.payload;
        },
        loginState: (state, action) => {
            // console.log("### LOGIN STATE CALLED: ", action.payload);
            state.isLoggedIn = action.payload;
        },
        showGame: (state, action) => {
            state.enableGame = action.payload;
        },
        reloadDrawer: (state, action) => {
            state.resetDrawer = action.payload;
        },
        cameraFile: (state, action) => {
            state.cameraFile = action.payload;
        },
        show_HideTimePicker: (state, action) => {
            state.timePicker = action.payload;
        },
        prebidTime: (state, action) => {
            state.preBid = action.payload;
        },
        selectDrawerItem: (state, action) => {
            state.drawerSelection = action.payload;
        },
        setProject: (state, action) => {
            state.project = action.payload;
        },
        setServerLabel: (state, action) => {
            state.serverLabel = action.payload;
        },
        setReloadHome: (state, action) => {
            state.reloadHome = action.payload;
        }
    }
})

export const sendProps = userData.actions.sendProps;
export const serverLink = userData.actions.severLink;
export const loginState = userData.actions.loginState;
export const showGame = userData.actions.showGame;
export const reloadDrawer = userData.actions.reloadDrawer;
export const cameraFile = userData.actions.cameraFile;
export const show_HideTimePicker = userData.actions.show_HideTimePicker;
export const prebidTime = userData.actions.prebidTime;
export const selectDrawerItem = userData.actions.selectDrawerItem;
export const setProject = userData.actions.setProject;
export const setServerLabel = userData.actions.setServerLabel;
export const setReloadHome = userData.actions.setReloadHome;