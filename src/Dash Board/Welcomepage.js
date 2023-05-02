import React, { Component } from 'react';
import {
    StyleSheet, Text, LayoutAnimation,
    TouchableOpacity, View, Image, SafeAreaView,
    Dimensions, Alert, Linking, TouchableWithoutFeedback,
    Platform, BackHandler, Animated, Easing, FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import DeviceInfo from 'react-native-device-info';
import PTRView from 'react-native-pull-to-refresh';
import checkVersion from 'react-native-store-version';
import Update from 'react-native-vector-icons/MaterialIcons';
import DoubleArrow from 'react-native-vector-icons/FontAwesome5';
import User from 'react-native-vector-icons/FontAwesome';
import Leave from 'react-native-vector-icons/FontAwesome5';
import Tasks from 'react-native-vector-icons/FontAwesome5';
import Airplane from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

import { selectDrawerItem, setReloadHome } from '../store/redux/reducer';
import AartiDrugs from '../Image/AartiLogo-128.png'
import {
    getWidthnHeight, WelcomeModal, GradientText, WaveHeader, fontSizeH4,
    CommonModal, IOS_StatusBar, Spinner, getMarginTop, getMarginRight,
    AppUpdate, getMarginLeft, getMarginVertical, InOutButton, AnimatedFlatList,
    getMarginHorizontal, fontSizeH1, DummyFlatlist, SelfBirthday, FeaturePopup
} from '../KulbirComponents/common';
import { extractBaseURL } from '../api/BaseURL';

const AnimateTouch = Animated.createAnimatedComponent(TouchableOpacity);

const leaveIcon = (<Image source={require('../Image/leave32.png')} style={{ width: getWidthnHeight(7).width, height: getWidthnHeight(7).width }} />)
const taskIcon = (<Image source={require('../Image/task_2.png')} style={{ width: getWidthnHeight(7).width, height: getWidthnHeight(7).width }} />)
const leadIcon = (<Image source={require('../Image/lead.png')} style={{ width: getWidthnHeight(7).width, height: getWidthnHeight(7).width }} />)
const travelIcon = (<Image source={require('../Image/globe.png')} style={{ width: getWidthnHeight(7).width, height: getWidthnHeight(7).width }} />)
const cakeIcon = (<Image source={require('../Image/dessert.png')} style={{ width: getWidthnHeight(7).width, height: getWidthnHeight(7).width }} />)
const appContent = [
    { name: 'Leave', color: '#F38523', icon: leaveIcon, id: 0, fullName: 'Leave Notification' },
    { name: 'Lead', color: '#EA2F54', icon: leadIcon, id: 1, fullName: 'Lead Notification' },
    { name: 'Task', color: '#1FAB89', icon: taskIcon, id: 2, fullName: 'Task Notification' },
    { name: 'Travel', color: '#14D6CA', icon: travelIcon, id: 3, fullName: 'Travel Notification' },
    { name: 'Birthdays', color: '#CC9B6D', icon: cakeIcon, id: 4, fullName: 'Cakes are special, isn\'t it' }
]

var CustomAnimation = {
    // duration: 10,
    // delete: {
    // type: LayoutAnimation.Types.linear,
    // property: LayoutAnimation.Properties.opacity,
    // springDamping: 0
    // }
}

class Welcomepage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            successToken: '',
            userName: '',
            loading: false,
            device: '',
            appVersion: DeviceInfo.getVersion(),
            rendum_value: '',
            dashboard: [],
            singleDate: [],
            doubleDate: [],
            loading: false,
            animating: true,
            project: "1",
            dimensions: undefined,
            logo: undefined,
            //baseURL: 'http://www.erp.xeamventures.com/api/v1',
            baseURL: null,
            errorCode: null,
            apiCode: null,
            commonModal: false,
            header: undefined,
            playStoreAppVersion: '',
            updateAvailable: false,
            enableAlert: false,
            alertTitle: '',
            subtitle: '',
            updateButton: new Animated.Value(0),
            blinkerOpacity: new Animated.Value(1),
            showAllDates: false,
            rotateIcon: new Animated.Value(0),
            dateOpacity: new Animated.Value(0),
            animateSubHeader: new Animated.Value(0),
            animateFlatListBounce: new Animated.Value(0.01),
            bounceFlatList: true,
            featureList: [],
            iOSLink: '',
            dashboardData: null,
            checkBirthday: false,
            userGender: '',
            featureTimer: 5,
            animateGameIcon: new Animated.Value(1),
            showWelcomeModal: false,
            attendancePermission: {}
        }
        this._refresh = this._refresh.bind(this);
        this.featureTimer = null;
    }

    checkXeniaUpdate() {
        if (Platform.OS === "android") {
            console.log("##### CHECK UPDATE")
            checkVersion({
                version: DeviceInfo.getVersion(), // app local version
                androidStoreURL: 'https://play.google.com/store/apps/details?id=com.xenia',
                country: 'jp', // default value is 'jp'
            }).then((result) => {
                console.log("$$$$$ PlayStore Result: ", result);
                this.setState({ playStoreAppVersion: result.remote }, () => {
                    console.log("$$$$$ Xenia version on Playstore: ", this.state.playStoreAppVersion);
                    this.extractLink();
                })
            }).catch((error) => {
                this.extractLink();
                console.log("error occurred", error);
            })
        } else {
            this.checkiOSUpdate();
        }
    }

    checkiOSUpdate() {
        const userID = 'fO81JtVcAfQ5BIALRz094zLBpW52';
        const appID = 'b2TgtDNCt4DQCtCJAPm5';
        const platform = 'ios';
        const appHostURL = `https://appho.st/api/get_current_version/?u=${userID}&a=${appID}&platform=${platform}`;
        this.showLoader();
        axios.get(appHostURL).then((response) => {
            this.hideLoader();
            const responseJson = (response.data);
            console.log("@@@@@ APPHOST SUCCESS", responseJson)
            this.setState({ playStoreAppVersion: responseJson.version, iOSLink: responseJson.url }, () => {
                console.log("$$$$$ Xenia version on App Host: ", this.state.playStoreAppVersion, this.state.iOSLink);
                this.extractLink();
            })
        }).catch((error) => {
            this.hideLoader();
            this.extractLink();
            console.log("AXIOS ERROR: ", error)
            let status = null;
            if (error.response) {
                status = error.response.status;
                //Alert.alert("Error!", `Error Code: ${status}145`)
            } else {
                //alert(`${error}, API CODE: 145`)
            }
        });
    }

    animateButton() {
        Animated.loop(
            Animated.parallel([
                Animated.timing(this.state.updateButton, {
                    toValue: 1,
                    duration: 1000
                }),
                Animated.timing(this.state.blinkerOpacity, {
                    toValue: 0,
                    duration: 1000
                })
            ])
        ).start();
    }

    //Runs the functions once when the screen shows up
    async componentDidMount() {
        const { enableGame, navigation, route, reloadHome } = this.props;
        this.unsubscribe = navigation.addListener('beforeRemove', (e) => {
            // Screen was focused
            return true;
        });
        if (enableGame) {
            this.showGameIcon();
        }
        this.device_id();
        // BackHandler.addEventListener('hardwareBackPress', () => {
        //     //ToastAndroid.show('Not Allowed', ToastAndroid.SHORT)
        //     if(route.name === "Home"){
        //         return true;
        //     }else{
        //         return false;
        //     }
        // })
        this.animatePage();
        //console.log("WELCOME LIFE CYCLE END");
    }

    componentDidUpdate(prevProps) {
        if (prevProps.enableGame !== this.props.enableGame) {
            // Do whatever you want
            //console.log("@@@ PERMISSION")
            this.showGameIcon();
        }
        if ((prevProps.reloadHome !== this.props.reloadHome) && (this.props.reloadHome === true)) {
            this.continueAnimation();
            this._refresh();
            this.props.setReloadHome(false);
        }
    }

    showGameIcon() {
        const { animateGameIcon, featureTimer } = this.state;
        Animated.loop(
            Animated.sequence([
                Animated.timing(animateGameIcon, {
                    toValue: 0,
                    duration: 1500,
                    easing: Easing.ease
                }),
                Animated.delay(featureTimer * 1000),
                Animated.timing(animateGameIcon, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.ease
                }),
                Animated.delay(featureTimer * 1000)
            ])
        ).start();
    }

    componentWillUnmount() {
        this.unsubscribe();
        // BackHandler.removeEventListener('hardwareBackPress', () => {
        //     //ToastAndroid.show('Not Allowed', ToastAndroid.SHORT)
        //     if(this.props.route.name === "Home"){
        //         return true;
        //     }else{
        //         return false;
        //     }
        // })
    }

    UNSAFE_componentWillUpdate() {
        LayoutAnimation.configureNext(CustomAnimation)
    }

    animatePage() {
        const { animateSubHeader, animateFlatListBounce } = this.state;
        Animated.stagger(1300, [
            Animated.timing(animateSubHeader, {
                toValue: 1,
                duration: 2000,
                easing: Easing.ease
            }),
            Animated.spring(animateFlatListBounce, {
                toValue: 1,
                friction: 7,
                tension: 250,
                useNativeDriver: true
            })
        ]).start(({ finished }) => {
            this.setState({ bounceFlatList: false }, () => {
                console.log("BOUNCE FLATLIST: ", this.state.bounceFlatList)
            })
            const { dashboardScroller, dashboardQuickLinks, enableAttendance } = this.getDashboardPermissions();
            if (finished) {
                if (!dashboardScroller && !dashboardQuickLinks && !enableAttendance) {
                    this.props.navigation.navigate('SalarySlipXM');
                }
            }
        })
    }

    rotateIconFunction() {
        const { rotateIcon, showAllDates, dateOpacity } = this.state;
        if (showAllDates) {
            Animated.stagger(200, [
                Animated.timing(rotateIcon, {
                    toValue: 1,
                    duration: 500
                }),
                Animated.timing(dateOpacity, {
                    toValue: 1,
                    duration: 300
                })
            ]).start()
        } else {
            Animated.parallel([
                Animated.timing(rotateIcon, {
                    toValue: 0,
                    duration: 400
                }),
                Animated.timing(dateOpacity, {
                    toValue: 0,
                    duration: 200
                })
            ]).start()
        }
    }

    //Hides the Loading Spinner
    hideLoader = () => {
        this.setState({ loading: false });
    }

    //Shows the Loading Spinner
    showLoader = () => {
        this.setState({ loading: true });
    }

    //Gets DeviceID of the users phone
    device_id() {
        const deviceInfo2 = DeviceInfo.getSystemName();
        const appVersion = DeviceInfo.getVersion();
        //alert('deviceInfo1'+deviceInfo1);
        //console.log("DEVICE INFO and VERSION: ", deviceInfo2, appVersion)
        this.setState({ device: deviceInfo2 }, () => this.checkXeniaUpdate())
        // console.log(deviceInfo2)
    }

    onDecline() {
        this.setState({ commonModal: false })
    }

    update() {
        const url = 'https://play.google.com/store/apps/details?id=com.xenia';
        Linking.canOpenURL(url)
            .then((supported) => {
                if (!supported) {
                    console.log("Can't handle url: " + url);
                } else {
                    return Linking.openURL(url);
                }
            })
            .catch((err) => console.error('An error occurred', err));
    }

    _menu = null;

    setMenuRef = ref => {
        this._menu = ref;
    };

    hideMenu = () => {
        this._menu.hide();
    };

    showMenu = () => {
        this._menu.show();
    };

    //Navigates the user to the Check In Screen                
    checkIn = (gradient, project) => {
        const { attendancePermission } = this.state;
        const { navigation } = this.props;
        // const parentNavigation = navigation.getParent('authNavigator');
        console.log("I am inside checkIn", attendancePermission)
        //console.log("THIS>PROPS: ", this.props)
        // const _this = this;
        // this.showLoader();
        const context = this;
        var userObj = JSON.parse(this.props.drawerProps);
        var successToken = { token: userObj.success.secret_token };
        var user_id = { userid: userObj.success.user.employee.user_id }
        var userName = { fullname: userObj.success.user.employee.fullname }
        var title = "Check-In";
        var xyz = "Check-In";
        navigation.navigate('cameraPage',
            {
                successToken: successToken,
                button: gradient,
                project: project,
                userName: userName,
                user_id: user_id,
                xyz,
                details: attendancePermission
            }
        );
    }

    //Navigates the user to the Check Out Screen                  
    checkOut = (gradient, project) => {
        const { attendancePermission } = this.state;
        const { navigation } = this.props;
        console.log("I am inside checkOutPage")
        // const _this = this;
        // this.showLoader();
        const context = this;
        var userObj = JSON.parse(this.props.drawerProps);
        var successToken = { token: userObj.success.secret_token };
        var user_id = { userid: userObj.success.user.employee.user_id }
        var userName = { fullname: userObj.success.user.employee.fullname }
        var title = "Check-Out";
        var xyz = "Check-Out";
        navigation.navigate('CheckOut',
            {
                successToken: successToken,
                button: gradient,
                project: project,
                userName: userName,
                user_id: user_id,
                xyz,
                details: attendancePermission
            }
        );
    }

    otherPage = () => {
        const context = this;
        var userObj = JSON.parse(this.props.drawerProps);
        var successToken = (userObj.success.secret_token);
        var user_id = (userObj.success.user.employee.user_id);
        context.props.navigation.navigate("monthlyreport", { successToken });
        context.props.navigation.navigate("monthlyreport", { user_id });
    }

    sec_otherPage = () => {
        Alert.alert("\nthis service not activate right now !");
    }

    thrd_otherPage = () => {
        Alert.alert("\nthis service not activate right now !");
    }

    _onItemPressed(item) {
        this.value().done();
    }

    //Open or Closes the Drawer Menu                
    dwaerButton() {
        const context = this;
        context.props.navigation.toggleDrawer();
        this._onItemPressed.bind(this);
    }

    getDashboardPermissions() {
        let userObj = JSON.parse(this.props.drawerProps);
        let dashboardScroller = false;
        let dashboardQuickLinks = false;
        let enableAttendance = false;
        if (userObj.success.hasOwnProperty('dashboard_ui')) {
            if (userObj.success.dashboard_ui.hasOwnProperty('mark_attendance')) {
                dashboardScroller = userObj.success.dashboard_ui.scroller;
                dashboardQuickLinks = userObj.success.dashboard_ui.quick_links;
                enableAttendance = userObj.success.dashboard_ui.mark_attendance;
            }
        }
        return { dashboardScroller, dashboardQuickLinks, enableAttendance };
    }

    async extractLink() {
        //console.log("LOG 1");
        const { playStoreAppVersion, appVersion } = this.state;
        //console.log("LOG 2");
        const { dashboardScroller, dashboardQuickLinks, enableAttendance } = await this.getDashboardPermissions();
        //console.log("LOG 3", dashboardScroller, dashboardQuickLinks, enableAttendance);
        //console.log("%%% GET DASHBOARD PERMISSIONS: ", dashboardScroller, dashboardQuickLinks, enableAttendance);
        await extractBaseURL().then((baseURL) => {
            //console.log("URL LOG: ", baseURL);
            this.setState({ baseURL }, () => {
                const { baseURL } = this.state;
                console.log("&&&& CALLING DASHBOARD", baseURL);
                if (baseURL && enableAttendance) {
                    //console.log("&&&& CALLING DASHBOARD");
                    this.lastThreeDaysAttendance()
                }
                if (!dashboardScroller && !dashboardQuickLinks && !enableAttendance) {
                    //console.log("!!!@@@##$$$%%%^^&&&CHECK APP VERSION: ", appVersion)
                    if (playStoreAppVersion > appVersion) {
                        this.getFeatureList();
                    }
                }
            })
        }).catch((err) => {
            console.log("LOG 4", err);
        })
        //console.log("LOG 4");
    }

    //Fetches the Last 3 Days attendance data

    async lastThreeDaysAttendance() {
        const { navigation, enableGame } = this.props;
        // console.log("### NAVIGATION: ", navigation.dangerouslyGetParent().state.routes)
        // const pastNavigationRoutes = navigation.dangerouslyGetParent().state.routes;
        const { baseURL, playStoreAppVersion, appVersion } = this.state;
        this.showLoader();
        const user_token = await AsyncStorage.getItem('user_token');
        const parsedData = JSON.parse(user_token);
        //console.log("WELCOME: ", parsedData)
        const secretToken = parsedData.success.secret_token;
        this.setState({ userGender: parsedData.success.user.employee.gender })
        if (parsedData.success.project === "Aarti Drugs Ltd") {
            this.setState({ project: "3" }, () => console.log("AARTI: ", this.state.project))
        } else {
            this.setState({ project: "1" }, () => console.log("XEAM: ", this.state.project))
        }
        axios.get(`${baseURL}/emp-three-days-attendance`, {
            headers: {
                "Authorization": ` Bearer ${secretToken}`
            }
        }).then((response) => {
            this.hideLoader();
            this.props.setReloadHome(false);
            const success = response.data.success;
            this.setState({ dashboardData: success });
            //var DashBoard = json_obj.success.attendance_data;
            //console.log("DashBoard", json_obj.success)
            const data = success.attendance_data.map((item, key) => {
                const official_InTimeStamp = moment(`${item.on_date} ${"09:30 AM"}`, "YYYY-MM-DD hh:mm A").valueOf();
                let timeCheck = null;
                let color = '#ADADAD';
                if (item.first_punch !== 'N/A') {
                    timeCheck = moment(`${item.on_date} ${item.first_punch}`, "YYYY-MM-DD hh:mm A").valueOf();
                    if (official_InTimeStamp < timeCheck) {
                        color = '#F7432A';
                    } else {
                        color = '#0BB04F';
                    }
                }
                return { color: color, on_date: item.on_date, first_punch: item.first_punch, last_punch: item.last_punch }
            })
            const singleDate = data.splice(0, 1)
            this.setState({
                dashboard: success.attendance_data, singleDate, doubleDate: data, showAllDates: false, attendancePermission: success.attd_permission
            }, () => {
                console.log("^^^### SPLICED DATA: ", this.state.singleDate, "\n\n", this.state.doubleDate)
                this.rotateIconFunction();
            })
            if (playStoreAppVersion > appVersion) {
                this.getFeatureList();
            }
            const currentMonth = (moment().month() + 1);
            const currentDate = (moment().date() + 0);
            if (parsedData.success.user.employee.hasOwnProperty('birth_date')) {
                const birthDate = parsedData.success.user.employee.birth_date;
                //const birthDate = "1989-09-08"
                const dob = moment(birthDate);
                const month = (dob.month() + 1);
                const date = dob.date();
                let showBirthday = true;
                // if(pastNavigationRoutes.length === 1){
                //     const screenName = pastNavigationRoutes[0]['routeName'];
                //     if(screenName === 'First'){
                //         showBirthday = true;
                //     }
                // }
                //console.log("@@@ CHECK BIRTHDAY: ", currentMonth, currentDate, "\t", month, date, "\t", showBirthday, "\t", parsedData.success.user.employee.hasOwnProperty('birth_date'))
                if (currentMonth === month && currentDate === date && showBirthday) {
                    this.setState({ checkBirthday: true })
                }
            }
            if (parsedData.success.hasOwnProperty('first_login')) {
                this.setState({ showWelcomeModal: parsedData.success.first_login }, () => {
                    parsedData.success.first_login = false;
                    AsyncStorage.setItem('user_token', JSON.stringify(parsedData));
                    AsyncStorage.setItem('userObj', JSON.stringify(parsedData));
                })
            }
            this.continueAnimation();
        }).catch((error) => {
            this.hideLoader();
            console.log("### ERROR: ", error)
        })
    }

    async getFeatureList() {
        const { baseURL } = this.state;
        this.showLoader();
        console.log("BASEURL: ", `${baseURL}/app-update-details`)
        var user_token = await AsyncStorage.getItem('user_token');
        var permissions_fir = JSON.parse(user_token);
        var permissions_four = permissions_fir.success.secret_token;
        axios.get(`${baseURL}/app-update-details`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + permissions_four,
                }
            }).then((response) => {
                this.hideLoader();
                const responseJson = (response.data);
                console.log("@@@@@ SUCCESS", responseJson[0])
                this.setState({
                    featureList: responseJson, updateAvailable: true, enableAlert: true,
                    alertTitle: 'Update Available', subtitle: `Version: ${this.state.playStoreAppVersion}`
                }, () => {
                    this.animateButton();
                })
            }).catch((error) => {
                this.hideLoader();
                console.log("AXIOS ERROR: ", error)
                let status = null;
                if (error.response) {
                    status = error.response.status;
                    //Alert.alert("Error!", `Error Code: ${status}144`)
                } else {
                    //alert(`${error}, API CODE: 144`)
                }
            });
    }

    _refresh() {
        // you must return Promise everytime
        return new Promise((resolve) => {
            setTimeout(() => {
                // some refresh process should come here
                this.lastThreeDaysAttendance();
                resolve();
            }, 10)
        })
    }

    //Evaluates which Header is to be shown
    renderHeader() {
        const { project } = this.state;
        return (
            <WaveHeader
                wave={false}
                menu='white'
                logo={(project === "3") ? AartiDrugs : null}
                logoBG={[{ width: getWidthnHeight(15).width, height: getWidthnHeight(15).width, backgroundColor: 'white', borderRadius: getWidthnHeight(7.5).width }]}
                logoSize={[{ width: getWidthnHeight(12).width, height: getWidthnHeight(12).width }]}
            />
        );
    }

    //Calculates the Dimensions for Header based on users device dimension

    headerLayout = (event) => {
        if (this.state.header) {
            return;
        }
        let width = Math.round(event.nativeEvent.layout.width)
        let height = Math.round(event.nativeEvent.layout.height)
        let data = event.nativeEvent.layout
        this.setState({ header: height })
    }

    onLayout = (event) => {
        if (this.state.dimensions) {
            return;
        }
        let width = Math.round(event.nativeEvent.layout.width)
        let height = Math.round(event.nativeEvent.layout.height)
        let data = event.nativeEvent.layout
        this.setState({ dimensions: { width, height } })
    }

    //Calculates the Dimensions for Logo based on users device dimension
    logoLayout = (event) => {
        if (this.state.logo) {
            return;
        }
        let width = Math.round(event.nativeEvent.layout.width)
        let height = Math.round(event.nativeEvent.layout.height)
        let data = event.nativeEvent.layout
        console.log("LOGO: ", data)
        this.setState({ logo: { width, height } })
    }

    //Evaluates the color for the WELCOME text
    renderText(project) {
        switch (project) {
            case "1":
                return (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[{ color: 'black', fontWeight: 'bold' }, styles.boldFont, fontSizeH1()]}>X</Text>
                        <Text style={[{ color: 'black', fontWeight: 'bold' }, styles.boldFont, fontSizeH1()]}>ENI</Text>
                        <Text style={[{ color: 'black', fontWeight: 'bold' }, styles.boldFont, fontSizeH1()]}>A</Text>
                    </View>
                )
            case "3":
                return <Text style={[{ color: 'black', fontWeight: 'bold' }, styles.boldFont, fontSizeH1()]}>XENIA</Text>
        }
    }

    openGooglePlayStore() {
        Linking.openURL("market://details?id=com.xenia");
    }

    async openAppHostIOS(iOSLink) {
        await Linking.openURL(iOSLink);
    }

    continueAnimation() {
        console.log("CALLED ANIMATION FUNCTION")
        this.animatePage();
        this.rotateIconFunction();
    }

    testFunction() {
        console.log("CALLED TEST FUNCTION")
    }

    render() {
        const {
            updateAvailable, updateButton, blinkerOpacity, alertTitle, subtitle, featureList, iOSLink,
            rotateIcon, dateOpacity, animateSubHeader, animateFlatListBounce, bounceFlatList, loading,
            dashboardData, checkBirthday, userGender, featureTimer, animateGameIcon, showWelcomeModal, attendancePermission
        } = this.state;
        const { navigation } = this.props;
        let markAttendance = false;
        console.log("@@@@ NAVIGATION WELCOME: ", navigation)
        if (attendancePermission?.can_mark_attd) {
            markAttendance = attendancePermission.can_mark_attd;
            console.log("@@@@@ ATTENDANCE PERMISSION: ", attendancePermission?.can_mark_attd);
        }
        // console.log("@@##!!$$DATE 1: ", this.props.drawerProps);
        // console.log("DATE 2: ", moment("30-04-2021 10:30 AM", "DD-MM-YYYY hh:mm A").valueOf());
        const scaleInterpolate = updateButton.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 2]
        });
        const opacityInterpolate = blinkerOpacity.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        });
        const animateStyle = {
            transform: [
                {
                    scale: scaleInterpolate,
                }
            ],
            opacity: opacityInterpolate
        }
        const rotateInterpolate = rotateIcon.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg']
        })
        const animateDownArrow = {
            transform: [{
                rotateX: rotateInterpolate,
            }]
        }
        const heightInterpolate = rotateIcon.interpolate({
            inputRange: [0, 1],
            outputRange: [0, getWidthnHeight(8).width]
        })
        const datesOpacity = dateOpacity.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        })
        const animateHeight = {
            height: heightInterpolate,
            opacity: datesOpacity
        }
        const subHeaderInterpolate = animateSubHeader.interpolate({
            inputRange: [0, 1],
            outputRange: ['-300%', '0%']
        })
        const animateXenia = {
            left: subHeaderInterpolate
        }
        const animateProfilePicture = {
            right: subHeaderInterpolate
        }
        const interpolateIcons = animateSubHeader.interpolate({
            inputRange: [0, 1],
            outputRange: ['-100%', '0%']
        })
        const animateLeftIcons = {
            left: interpolateIcons
        }
        const animateRightIcons = {
            right: interpolateIcons
        }
        const animateCheckInOut = animateSubHeader.interpolate({
            inputRange: [0, 1],
            outputRange: ['-400%', '0%']
        })
        const animateCheckIn = {
            left: animateCheckInOut
        }
        const animateCheckOut = {
            right: animateCheckInOut
        }
        const animateFlatList = {
            transform: [
                {
                    scale: animateFlatListBounce
                }
            ]
        }
        const gameIconStyle = {
            transform: [
                {
                    translateX: animateGameIcon.interpolate({
                        inputRange: [0, 1],
                        outputRange: [getMarginLeft(0).marginLeft, getMarginLeft(20).marginLeft]
                    })
                },
                {
                    rotate: animateGameIcon.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg']
                    })
                }
            ]
        }
        console.log("@#@#@# ANIMATE: ", typeof animateGameIcon, animateGameIcon)
        const calculate = Dimensions.get('window')
        let userObj = JSON.parse(this.props.drawerProps);
        let user = userObj.success.project;
        const { dashboardScroller, dashboardQuickLinks, enableAttendance } = this.getDashboardPermissions();
        const userImage = { uri: userObj.success.user.employee.profile_picture };
        const empNameArray = userObj.success.user.employee.fullname.split(' ');
        const totalHeight = getWidthnHeight(undefined, 100)
        const { dimensions, logo, errorCode, apiCode } = this.state;
        let gradient = ['#039FFD', '#EA304F']
        let gradientShadow = ['#0D4EBA', '#197EC4']
        let backgroundColor = { backgroundColor: '#3E81EF' }
        let borderColor = { borderColor: '#3E81EF' }
        return (
            <View style={{ flex: 1, backgroundColor: '#F8F3F3' }}>
                <IOS_StatusBar color={gradient} barStyle="light-content" />
                <SafeAreaView style={{ flex: 1 }}>
                    <View>
                        {/* {this.renderHeader()}  */}
                        <View style={{ position: 'absolute', alignSelf: 'flex-end', borderColor: 'white', borderWidth: 0, marginVertical: 3 }}>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 0, borderColor: 'white', marginRight: 3 }}>
                                {(updateAvailable) ?
                                    <TouchableWithoutFeedback onPress={() => (Platform.OS === "android") ? this.openGooglePlayStore() : this.openAppHostIOS(iOSLink)}>
                                        <View style={[{ borderColor: 'red', borderWidth: 0, alignItems: 'center', justifyContent: 'space-evenly' }, getWidthnHeight(undefined, 7)]} >
                                            <Animated.View style={[{
                                                alignItems: 'center', justifyContent: 'center',
                                                borderColor: 'white', borderWidth: 0
                                            }, animateStyle
                                            ]}>
                                                <Update name="system-update" color="white" size={Math.floor(getWidthnHeight(4).width)} />
                                            </Animated.View>
                                            <Text style={{ fontSize: (fontSizeH4().fontSize - 5), color: 'white', textAlign: 'center' }}>Update App</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    :
                                    null
                                }
                            </View>
                        </View>
                    </View>

                    {(checkBirthday) && (
                        <SelfBirthday
                            visible={checkBirthday}
                            onDecline={() => this.setState({ checkBirthday: false }, () => {
                                this.continueAnimation();
                            })}
                            userImage={userImage}
                            userName={userObj.success.user.employee.fullname.toUpperCase()}
                            gender={userGender}
                        />
                    )}

                    {(this.state.commonModal) ?
                        <CommonModal
                            title={"Something went wrong"}
                            subtitle={`Error Code: ${errorCode}${apiCode}`}
                            visible={this.state.commonModal}
                            onDecline={this.onDecline.bind(this)}
                            buttonColor={['#0E57CF', '#25A2F9']}
                            apiCode={Number(apiCode)}
                        />
                        :
                        null
                    }
                    {(this.state.enableAlert) &&
                        <AppUpdate
                            title={alertTitle}
                            subtitle={subtitle}
                            visible={this.state.enableAlert}
                            onDecline={() => this.setState({ enableAlert: false })}
                            titleStyle={[styles.titleStyle, { fontSize: fontSizeH4().fontSize + 2 }]}
                            featureList={featureList}
                            androidURL={() => this.openGooglePlayStore()}
                            iOSURL={() => this.openAppHostIOS()}
                        />
                    }
                    {(showWelcomeModal) && (
                        <WelcomeModal
                            title={`Welcome, ${userObj.success.user.employee.fullname}`}
                            designation={userObj.success.user.designation[0]['name']}
                            subtitle={(
                                `Congratulations on being part of the Team!\n\nThe whole XEAM Family welcomes you and we look forward to a successful journey with you.\n\nWelcome aboard!`
                            )}
                            profilePic={userImage}
                            visible={showWelcomeModal}
                            onDecline={() => this.setState({ showWelcomeModal: false })}
                        />
                    )}
                    <View style={{ flex: 1 }}>
                        <PTRView onRefresh={this._refresh}>
                            <View style={[{ justifyContent: 'space-between' }, getWidthnHeight(100, 89)]}>
                                <View style={{ alignItems: 'center', borderColor: 'black', borderWidth: 0 }}>
                                    <View style={[{ alignItems: 'center', backgroundColor: 'white', justifyContent: 'center' }, getWidthnHeight(100, 13)]}>
                                        <View style={[{ flexDirection: 'row', borderColor: 'black', borderWidth: 0 }, getWidthnHeight(90), getMarginTop(1)]}>
                                            <Animated.View style={[{ borderColor: 'red', borderWidth: 0 }, getWidthnHeight(60), animateXenia]}>
                                                {this.renderText(this.state.project)}
                                                <View style={{ alignItems: 'flex-start' }}>
                                                    <Text style={{ fontSize: (fontSizeH4().fontSize + 5), color: 'black', fontStyle: 'italic', textAlign: 'left' }}> Welcome, {empNameArray[0].replace(/^\w/, (c) => c.toUpperCase())} </Text>
                                                </View>
                                            </Animated.View>

                                            <Animated.View style={[getWidthnHeight(30), { borderColor: 'red', borderWidth: 0, alignItems: 'flex-end' }, animateProfilePicture]}>
                                                <View style={[{ borderColor: 'lightgrey', borderWidth: 2, borderRadius: getWidthnHeight(20).width, alignItems: 'center', justifyContent: 'center', width: getWidthnHeight(20).width, height: getWidthnHeight(20).width }]}>
                                                    {(userImage) ?
                                                        <Image source={userImage} style={{ width: getWidthnHeight(18).width, height: getWidthnHeight(18).width, borderColor: 'white', borderWidth: 0, borderRadius: getWidthnHeight(18).width }} />
                                                        :
                                                        <View style={{
                                                            width: getWidthnHeight(18).width, height: getWidthnHeight(18).width,
                                                            alignItems: 'center', justifyContent: 'center', backgroundColor: '#D9E8FA',
                                                            borderRadius: getWidthnHeight(18).width
                                                        }}>
                                                            <User name="user" size={Math.floor(getWidthnHeight(10).width)} color="#227CE7" />
                                                        </View>
                                                    }
                                                </View>
                                            </Animated.View>
                                        </View>
                                    </View>
                                    {(dashboardScroller) && (
                                        <View style={[{ backgroundColor: '#F8F3F3', borderRadius: 10, borderWidth: 0, borderColor: 'blue' }, getWidthnHeight(100)]}>
                                            <View style={[{ borderWidth: 0, borderColor: 'red', borderRadius: 10 }, getWidthnHeight(100, 22)]}>
                                                {(!dashboardData) &&
                                                    <DummyFlatlist
                                                        appContent={appContent}
                                                        animateScale={(bounceFlatList) ? animateFlatList : null}
                                                    />
                                                }
                                                {(dashboardData) &&
                                                    <AnimatedFlatList
                                                        appContent={appContent}
                                                        animateScale={(bounceFlatList) ? animateFlatList : null}
                                                        data={JSON.stringify(dashboardData)}
                                                        navigation={navigation}
                                                    />
                                                }
                                            </View>
                                        </View>
                                    )}
                                    {(dashboardQuickLinks) && (
                                        <View style={[{ backgroundColor: 'white', borderColor: 'red', borderWidth: 0, flexDirection: 'row', alignItems: 'center' }, getWidthnHeight(100, 12)]}>
                                            <Animated.View style={[{ flexDirection: 'row', justifyContent: 'space-around', borderWidth: 0, borderColor: 'red' }, animateLeftIcons, getWidthnHeight(50, 12)]}>
                                                <View style={[{ alignItems: 'center', justifyContent: 'center' }]}>
                                                    <TouchableOpacity onPress={() => navigation.navigate('My_Profile', { userObj: this.props.drawerProps })}>
                                                        <View style={{
                                                            width: getWidthnHeight(13).width, height: getWidthnHeight(13).width,
                                                            alignItems: 'center', justifyContent: 'center', backgroundColor: '#D9E8FA',
                                                            borderRadius: getWidthnHeight(13).width
                                                        }}>
                                                            <User name="user" size={Math.floor(getWidthnHeight(7).width)} color="#227CE7" />
                                                        </View>
                                                    </TouchableOpacity>
                                                    <Text style={[fontSizeH4()]}>MY PROFILE</Text>
                                                </View>
                                                <View style={[{ alignItems: 'center', justifyContent: 'center' }]}>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            const screen = 'ApplyForLeave'
                                                            this.props.selectDrawerItem(screen);
                                                            navigation.navigate(screen);
                                                        }}
                                                    >
                                                        <View style={{
                                                            width: getWidthnHeight(13).width, height: getWidthnHeight(13).width,
                                                            alignItems: 'center', justifyContent: 'center', backgroundColor: '#D9E8FA',
                                                            borderRadius: getWidthnHeight(13).width
                                                        }}>
                                                            <Leave name="umbrella-beach" size={Math.floor(getWidthnHeight(7).width)} color="#227CE7" />
                                                        </View>
                                                    </TouchableOpacity>
                                                    <Text style={[fontSizeH4()]}>APPLY LEAVE</Text>
                                                </View>
                                            </Animated.View>
                                            <Animated.View style={[{ flexDirection: 'row', justifyContent: 'space-around', borderWidth: 0, borderColor: 'red' }, animateRightIcons, getWidthnHeight(50, 12)]}>
                                                <View style={[{ alignItems: 'center', justifyContent: 'center' }]}>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            const screen = 'MyTask'
                                                            this.props.selectDrawerItem(screen);
                                                            navigation.navigate(screen);
                                                        }}
                                                    >
                                                        <View style={{
                                                            width: getWidthnHeight(13).width, height: getWidthnHeight(13).width,
                                                            alignItems: 'center', justifyContent: 'center', backgroundColor: '#D9E8FA',
                                                            borderRadius: getWidthnHeight(13).width
                                                        }}>
                                                            <Tasks name="tasks" size={Math.floor(getWidthnHeight(7).width)} color="#227CE7" />
                                                        </View>
                                                    </TouchableOpacity>
                                                    <Text style={[fontSizeH4()]}>MY TASKS</Text>
                                                </View>
                                                <View style={[{ alignItems: 'center', justifyContent: 'center' }]}>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            const screen = 'PreApprovalForm'
                                                            this.props.selectDrawerItem(screen);
                                                            navigation.navigate(screen);
                                                        }}
                                                    >
                                                        <View style={{
                                                            width: getWidthnHeight(13).width, height: getWidthnHeight(13).width,
                                                            alignItems: 'center', justifyContent: 'center', backgroundColor: '#D9E8FA',
                                                            borderRadius: getWidthnHeight(13).width
                                                        }}>
                                                            <Airplane name="airplane-sharp" size={Math.floor(getWidthnHeight(7).width)} color="#227CE7" />
                                                        </View>
                                                    </TouchableOpacity>
                                                    <Text style={[fontSizeH4()]}>ADD TRAVEL</Text>
                                                </View>
                                            </Animated.View>
                                        </View>
                                    )
                                    }

                                    {(enableAttendance) &&
                                        <View style={[{ backgroundColor: '#F8F3F3', alignItems: 'center' }]}>
                                            <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderColor: 'black', borderWidth: 0 }, getMarginTop(3), getWidthnHeight(70)]}>
                                                <Animated.View style={[{ borderColor: 'red', borderWidth: 0, justifyContent: 'center', alignItems: 'center' }, animateCheckIn, getWidthnHeight(31, 7)]}>
                                                    <InOutButton
                                                        title="CHECK IN"
                                                        disabled={(!markAttendance) ? true : false}
                                                        //gradient={['#7B6079', '#654062']}
                                                        //gradient={['#387980', '#2F5D62']}
                                                        gradient={(!markAttendance) ? ['#C4C4C4', '#C4C4C4'] : ['#1089FF', '#1089FF']}
                                                        onPress={() => this.checkIn(gradient, this.state.project)}
                                                        style={[{ borderRadius: 5 }, getWidthnHeight(30, 6)]}
                                                        textBoxStyle={[getWidthnHeight(30, 6)]}
                                                    />
                                                </Animated.View>
                                                <Animated.View style={[{ borderColor: 'red', borderWidth: 0, justifyContent: 'center', alignItems: 'center' }, animateCheckOut, getWidthnHeight(31, 7)]}>
                                                    <InOutButton
                                                        title="CHECK OUT"
                                                        disabled={(!markAttendance) ? true : false}
                                                        //gradient={['#7B6079', '#654062']}
                                                        //gradient={['#387980', '#2F5D62']}
                                                        gradient={(!markAttendance) ? ['#C4C4C4', '#C4C4C4'] : ['#1089FF', '#1089FF']}
                                                        onPress={() => this.checkOut(gradient, this.state.project)}
                                                        style={[{ borderRadius: 5 }, getWidthnHeight(30, 6)]}
                                                        textBoxStyle={[getWidthnHeight(30, 6)]}
                                                    />
                                                </Animated.View>
                                            </View>

                                            <View style={[{ alignItems: 'center', borderColor: 'black', borderWidth: 0 }, getWidthnHeight(100), getMarginTop(3)]}>
                                                <View style={[{ flexDirection: 'row', borderColor: 'black', borderWidth: 0, justifyContent: 'center' }, getWidthnHeight(100)]}>
                                                    <Animated.View style={[{ alignItems: 'center', flexDirection: 'row', borderColor: 'black', borderWidth: 0, justifyContent: 'center' }, animateLeftIcons, getWidthnHeight(65)]}>
                                                        <Text style={[{ fontWeight: 'bold', width: getWidthnHeight(30).width, borderColor: 'black', borderWidth: 0, textAlign: 'center', fontSize: (fontSizeH4().fontSize + 1) }, styles.boldFont]}>DATE</Text>
                                                        <Text style={[{ fontWeight: 'bold', width: getWidthnHeight(35).width, borderColor: 'black', borderWidth: 0, textAlign: 'center', fontSize: (fontSizeH4().fontSize + 1) }, styles.boldFont]}>FIRST PUNCH</Text>
                                                    </Animated.View>
                                                    <Animated.View style={[{ alignItems: 'center', flexDirection: 'row', borderColor: 'black', borderWidth: 0, justifyContent: 'center' }, animateRightIcons, getWidthnHeight(35)]}>
                                                        <Text style={[{ fontWeight: 'bold', width: getWidthnHeight(35).width, borderColor: 'black', borderWidth: 0, textAlign: 'center', fontSize: (fontSizeH4().fontSize + 1) }, styles.boldFont]}>LAST PUNCH</Text>
                                                        {/* {(this.state.showAllDates)?
                                        <Text style={[{fontWeight: 'bold', width: getWidthnHeight(15).width, borderColor: 'black', borderWidth: 0, textAlign: 'right'}, styles.boldFont, fontSizeH4()]}>LESS</Text>
                                    :
                                        <Text style={[{fontWeight: 'bold', width: getWidthnHeight(15).width, borderColor: 'black', borderWidth: 0, textAlign: 'right'}, styles.boldFont, fontSizeH4()]}>MORE</Text>
                                    } */}
                                                    </Animated.View>
                                                </View>
                                                <View style={[{ borderColor: 'blue', borderWidth: 0, justifyContent: 'center', alignItems: 'center' }, getWidthnHeight(100)]}>
                                                    <View style={[{ alignItems: 'center', borderColor: 'black', borderWidth: 0 }, getWidthnHeight(100), getMarginTop(1)]}>
                                                        <View style={[getMarginVertical(1)]}>
                                                            {this.state.singleDate.map((item, key) => {
                                                                return (
                                                                    <View style={[{ flexDirection: 'row', borderWidth: 0, borderColor: 'black', justifyContent: 'center' }, getWidthnHeight(100)]}>
                                                                        <Text style={[{ width: getWidthnHeight(30).width, borderColor: 'black', borderWidth: 0, textAlign: 'center', fontSize: (fontSizeH4().fontSize + 1) }, styles.boldFont]}>{moment(item.on_date).format("DD MMM").toUpperCase()}</Text>
                                                                        {(item.first_punch === 'N/A') ?
                                                                            <Text style={[{ width: getWidthnHeight(35).width, borderColor: 'black', borderWidth: 0, textAlign: 'center', fontSize: (fontSizeH4().fontSize + 1) }, styles.boldFont]}>{item.first_punch}</Text>
                                                                            :
                                                                            <View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: getWidthnHeight(35).width, borderColor: 'black', borderWidth: 0 }]}>
                                                                                <View style={[getMarginLeft(-1), { width: getWidthnHeight(3.5).width, height: getWidthnHeight(3.5).width, backgroundColor: item.color, borderRadius: getWidthnHeight(3.5).width }, getMarginHorizontal(2)]} />
                                                                                <Text style={[getMarginLeft(-1), { borderColor: 'black', borderWidth: 0, textAlign: 'center', fontSize: (fontSizeH4().fontSize + 1) }, styles.boldFont]}>{item.first_punch}</Text>
                                                                            </View>
                                                                        }
                                                                        {(item.last_punch === 'N/A') ?
                                                                            <Text style={[{ width: getWidthnHeight(35).width, borderColor: 'black', borderWidth: 0, textAlign: 'center', fontSize: (fontSizeH4().fontSize + 1) }, styles.boldFont]}>{item.last_punch}</Text>
                                                                            :
                                                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: getWidthnHeight(35).width, borderColor: 'black', borderWidth: 0 }}>
                                                                                <View style={[getMarginLeft(-1), { width: getWidthnHeight(3.5).width, height: getWidthnHeight(3.5).width, backgroundColor: '#0BB04F', borderRadius: getWidthnHeight(3.5).width }, getMarginHorizontal(2)]} />
                                                                                <Text style={[getMarginLeft(-1), { borderColor: 'black', borderWidth: 0, textAlign: 'center', fontSize: (fontSizeH4().fontSize + 1) }, styles.boldFont]}>{item.last_punch}</Text>
                                                                            </View>
                                                                        }
                                                                    </View>
                                                                )
                                                            })}
                                                        </View>
                                                        <View style={[{ alignItems: 'center', borderColor: 'red', borderWidth: 0 }]}>
                                                            {this.state.doubleDate.map((item, key) => {
                                                                return (
                                                                    <Animated.View style={[{ borderWidth: 0, borderColor: 'black' }, animateHeight]}>
                                                                        <View style={[{ flexDirection: 'row', borderWidth: 0, borderColor: 'black', justifyContent: 'center' }, getWidthnHeight(100), getMarginTop(1)]}>
                                                                            <Text style={[{ width: getWidthnHeight(30).width, borderColor: 'black', borderWidth: 0, textAlign: 'center', fontSize: (fontSizeH4().fontSize + 1) }, styles.boldFont]}>{moment(item.on_date).format("DD MMM").toUpperCase()}</Text>
                                                                            {(item.first_punch === 'N/A') ?
                                                                                <Text style={[{ width: getWidthnHeight(35).width, borderColor: 'black', borderWidth: 0, textAlign: 'center', fontSize: (fontSizeH4().fontSize + 1) }, styles.boldFont]}>{item.first_punch}</Text>
                                                                                :
                                                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: getWidthnHeight(35).width, borderColor: 'black', borderWidth: 0 }}>
                                                                                    <View style={[getMarginLeft(-1), { width: getWidthnHeight(3.5).width, height: getWidthnHeight(3.5).width, backgroundColor: item.color, borderRadius: getWidthnHeight(3.5).width }, getMarginHorizontal(2)]} />
                                                                                    <Text style={[getMarginLeft(-1), { borderColor: 'black', borderWidth: 0, textAlign: 'center', fontSize: (fontSizeH4().fontSize + 1) }, styles.boldFont]}>{item.first_punch}</Text>
                                                                                </View>
                                                                            }
                                                                            {(item.last_punch === 'N/A') ?
                                                                                <Text style={[{ width: getWidthnHeight(35).width, borderColor: 'black', borderWidth: 0, textAlign: 'center', fontSize: (fontSizeH4().fontSize + 1) }, styles.boldFont]}>{item.last_punch}</Text>
                                                                                :
                                                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: getWidthnHeight(35).width, borderColor: 'black', borderWidth: 0 }}>
                                                                                    <View style={[getMarginLeft(-1), { width: getWidthnHeight(3.5).width, height: getWidthnHeight(3.5).width, backgroundColor: '#0BB04F', borderRadius: getWidthnHeight(3.5).width }, getMarginHorizontal(2)]} />
                                                                                    <Text style={[getMarginLeft(-1), { borderColor: 'black', borderWidth: 0, textAlign: 'center', fontSize: (fontSizeH4().fontSize + 1) }, styles.boldFont]}>{item.last_punch}</Text>
                                                                                </View>
                                                                            }
                                                                        </View>
                                                                    </Animated.View>
                                                                )
                                                            })}
                                                        </View>
                                                    </View>
                                                    {(this.state.singleDate.length > 0) &&
                                                        <View style={[{ alignItems: 'center', flexDirection: 'row' }, getMarginTop(0.5), getWidthnHeight(100)]}>
                                                            <View style={[{ alignItems: 'center', borderColor: 'black', borderWidth: 0 }, getWidthnHeight(30)]} />
                                                            <View style={[{ alignItems: 'center', borderColor: 'black', borderWidth: 0 }, getWidthnHeight(35)]}>
                                                                <TouchableOpacity
                                                                    style={[{
                                                                        borderColor: 'black', borderWidth: 0, alignItems: 'center', justifyContent: 'center',
                                                                        width: getWidthnHeight(12).width, height: getWidthnHeight(8).width
                                                                    }, getMarginTop(-1)]}
                                                                    onPress={() => this.setState({ showAllDates: !this.state.showAllDates }, () => this.rotateIconFunction())}>
                                                                    <Animated.View style={[{ width: getWidthnHeight(15).width, borderColor: 'black', borderWidth: 0, alignItems: 'center', justifyContent: 'flex-start' }, animateDownArrow]}>
                                                                        <DoubleArrow name="angle-double-down" color="#3E81EF" size={Math.floor(getWidthnHeight(4).width)} style={[{ transform: [{ scaleX: 1.5 }, { scaleY: 1.1 }], borderColor: 'red', borderWidth: 0 }]} />
                                                                    </Animated.View>
                                                                </TouchableOpacity>
                                                            </View>
                                                            <View style={[{ alignItems: 'center', borderColor: 'black', borderWidth: 0 }, getWidthnHeight(35)]} />
                                                        </View>
                                                    }
                                                </View>
                                            </View>
                                        </View>
                                    }
                                </View>

                                <View style={{ flex: 1, borderWidth: 0, borderColor: 'red', justifyContent: 'flex-end' }}>
                                    <View style={{ alignItems: 'center', marginTop: 0 }}>
                                        <Text style={{ fontSize: (fontSizeH4().fontSize - 3), textAlign: 'center' }}>© Copyright 2020 XEAM Ventures Pvt Ltd All Rights Reserved</Text>
                                        <Text style={{ fontSize: (fontSizeH4().fontSize - 3), color: 'black' }}>{`Version ${this.state.appVersion}`}</Text>
                                    </View>
                                </View>
                                <View style={[{ alignItems: 'flex-end' }, getWidthnHeight(100)]}>
                                    <View style={[{ position: 'absolute' }, styles.gameIconPosition]}>
                                        <AnimateTouch
                                            activeOpacity={0.7}
                                            style={[gameIconStyle]}
                                            onPress={() => navigation.navigate('tictactoe')}
                                        >
                                            <FeaturePopup />
                                        </AnimateTouch>
                                    </View>
                                </View>
                            </View>
                        </PTRView>
                        <View
                            style={[{
                                backgroundColor: (loading) ? 'rgba(0, 0, 0, 0.5)' : 'transparent', alignItems: 'center', justifyContent: 'center'
                            }, StyleSheet.absoluteFill]}
                            pointerEvents={(loading) ? 'auto' : 'none'}
                        >
                            {(loading) &&
                                <Spinner loading={loading} style={[styles.loadingStyle, getWidthnHeight(45, 10), getMarginLeft(3)]} color='rgb(19,111,232)' />
                            }
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    gameIconPosition: {
        ...Platform.select({
            android: {
                marginTop: getMarginTop(-13).marginTop
            },
            ios: {
                marginTop: getMarginTop(-14).marginTop
            }
        })
    },
    present: {
        backgroundColor: '#F7432A', borderRadius: 5,
        color: 'white', overflow: "hidden",
        paddingLeft: 5, paddingRight: 5,
        width: '23%', textAlign: 'center',
        textAlignVertical: 'center',
    },
    data_sec: {
        backgroundColor: '#0BB04F', color: 'white',
        borderRadius: 5, overflow: "hidden",
        paddingLeft: 5, paddingRight: 5,
        width: '23%', textAlign: 'center',
        textAlignVertical: 'center',
    },
    n_a: {
        backgroundColor: '#adadad', color: 'white',
        borderRadius: 5, overflow: "hidden",
        paddingLeft: 5, paddingRight: 5,
        width: '23%', textAlign: 'center',
        textAlignVertical: 'center',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        shadowColor: '#000000',
    },
    buttonShadow: {
        marginTop: 10,
        marginLeft: 0,
        borderTopLeftRadius: 50,
        borderBottomRightRadius: 50
    },
    separator: {
        marginVertical: 8,
        borderBottomColor: '#2B2929',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    container: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
    },
    dashboard_list_component: {
        margin: 10,
        flexDirection: 'column',
        justifyContent: 'space-around',
        //   alignItems: 'stretch',
        borderRadius: 5,
        borderTopWidth: 1.5,
        borderBottomWidth: 1.5,
        borderRightWidth: 1.5,
        borderLeftWidth: 1.5,
        backgroundColor: '#ffffff',
        borderColor: '#2667D0',
        // shadowOffset:{  width: 0,  height: 0,  },
        shadowColor: '#330000',
        paddingTop: 10,
        paddingBottom: 10,
        width: '95%',
        height: '30%',
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 10,
        overflow: "hidden"
    },
    aartiLogo: {
        borderColor: 'black',
        borderWidth: 0,
        //justifyContent: 'center',
        shadowColor: 'black',
        elevation: 7,
        shadowRadius: 25,
        borderColor: '#E44C13',
        borderBottomWidth: 0,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25
    },
    logo: {
        backgroundColor: 'white',
        borderRadius: 10,
        justifyContent: 'center',
        shadowColor: 'black',
        elevation: 7,
        shadowRadius: 25,
    },
    linearGradient: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 95,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25
    },
    loadingStyle: {
        flexDirection: 'row',
        backgroundColor: '#EFEFEF',
        alignItems: 'center',
        justifyContent: 'center',
        //position: 'absolute', 
        borderRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        shadowColor: '#000000',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
        borderColor: 'red',
        borderWidth: 0,
    },
    titleStyle: {
        color: '#525553',
        fontWeight: 'bold',
        ...Platform.select({
            android: {
                fontFamily: ''
            }
        })
    },
    boldFont: {
        ...Platform.select({
            android: {
                fontFamily: ''
            }
        })
    }
});

const mapStateToProps = ({ reduxState }) => {
    // console.log("@@#Welcome***MAP STATE TO PROPS: ", reduxState.reloadHome)
    return {
        drawerProps: reduxState.userObj,
        enableGame: reduxState.enableGame,
        reloadHome: reduxState.reloadHome
    }
}

export default connect(mapStateToProps, { selectDrawerItem, setReloadHome })(Welcomepage);
// export default Welcomepage;