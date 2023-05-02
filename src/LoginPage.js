import React, {Component} from 'react';
import {
    View, StyleSheet, TextInput, ActivityIndicator,
    Text, KeyboardAvoidingView, TouchableOpacity, TouchableWithoutFeedback, 
    Alert, Dimensions, Keyboard, Linking, Animated, Easing, ScrollView, 
    Platform, BackHandler, ToastAndroid, Image, ImageBackground, StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';
import RNExitApp from 'react-native-exit-app';
import {connect} from 'react-redux';
import DeviceInfo, {getDeviceId} from 'react-native-device-info';
import axios from 'axios';
//import firebase  from './firebase';
import RNFirebase from '@react-native-firebase/app';
import firebase from './firebase';
import messaging from '@react-native-firebase/messaging';
import UserIcon from 'react-native-vector-icons/FontAwesome';
import PasswordKey from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
    getWidthnHeight, Spinner, CommonModal, ChangePassword, IOS_StatusBar, MaskedGradientText,
    getMarginTop, fontSizeH2, InputText, LoginButton, getMarginLeft, statusBarGradient,
    DismissKeyboard, ReactLoader, Slider, getMarginRight, fontSizeH4, DesktopLoader, GradientIcon
} from './KulbirComponents/common';
import { sendProps, serverLink, loginState, setProject, setServerLabel } from './store/redux/reducer';

let beginCount;
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const AnimateTouch = Animated.createAnimatedComponent(TouchableOpacity);

const testLabel = (<Text style={[{fontSize: fontSizeH4().fontSize - 3, color: 'white'}, getMarginRight(3)]}>Test</Text>);

class LoginPage extends Component {
  	constructor(props){
    super(props)
        this.state={
            employee_code:'',
            userPassword:'',
            device_id: null,
            device_type:'',
            loading: false,
            name:'',
            code:'',
            permissions:'',
            counter:0,
            baseURL: null, 
            userObj: null,
            token: null,
            reload: false,
            showTip: false,
            showPassword: false,
            errorCode: null,
            apiCode: null,
            commonModal: false,
            clickCount: null,
            selectServerModal: false,
            liveLink: '',
            testLink: '',
            serverLink: '',
            bgImage: new Animated.Value(0),
            xeamLogo: new Animated.Value(0),
            versionOpacity: new Animated.Value(0),
            showSlider: false,
            sliderState: false,
            currentVersion: DeviceInfo.getVersion(),
            iOSLink: '',
            countTouch: 0,
            exitCount: 0,
            showChangePassModal: false,
            changePassStep: null,
            minuteHand: 0,
            secondHand: 0,
            resetTimer: true,
            onboardingLive: '',
            onboardingTest: '',
            firebaseLink: null
        }
        if(!this.state.firebaseLink){
            database().ref('/url').on('value', snapshot => {
                //console.log('$$$ @@@ User data: ', snapshot.val());
                const realTimeDatabase = snapshot.val();
                const { live, test } = realTimeDatabase;
                this.setState({
                    liveLink: live.erp, testLink: test.erp, serverLink: live.erp,
                    onboardingLive: live.onboarding, onboardingTest: test.onboarding
                }, () => {
                    const { 
                        liveLink, testLink, serverLink, onboardingLive, onboardingTest, showSlider, sliderState
                    } = this.state;
                    console.log(
                        "\nLIVE: ", liveLink, "\nTEST: ", testLink, "\nSERVER LINK: ", serverLink,
                        "\nONBOARDING LIVE: ", onboardingLive, "\nONBOARDING TEST: ", onboardingTest
                    )
                    if(!this.state.sliderState && this.state.showSlider){
                        this.setState({serverLink: this.state.testLink}, () => {
                            this.props.serverLink(this.state.serverLink)
                        })
                    }else{
                        this.props.serverLink(this.state.serverLink)
                    }
                    AsyncStorage.setItem("onboardingURL", (showSlider && !sliderState)? onboardingTest : onboardingLive);
                })
            });
        }
    }
           
    componentDidMount(){
        this.showBackground(() => {})
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.handleBackButton());
        //console.log("PLEASE LOGIN: ", DeviceInfo.getUniqueId())
        this.initialize();
    }

    resetTimerFunction(){
        this.setState({resetTimer: false, minuteHand: 1, secondHand: 59}, () => {})
    }

    startCount(){
        this.resetTimerFunction();
        beginCount = setInterval(() => {
            const {minuteHand, secondHand} = this.state;
            console.log("@@@@MINUTE: ", minuteHand, "SECOND: ", secondHand)
            if(minuteHand === 1 && secondHand >= 0){
                this.setState({secondHand: secondHand - 1}, () => {
                    const {secondHand} = this.state;
                    if(secondHand < 0){
                        this.setState({minuteHand: 0, secondHand: 59});
                    }
                })
            }else if(minuteHand === 0 && secondHand >= 0){
                this.setState({secondHand: secondHand - 1}, () => {
                    const {secondHand} = this.state;
                    if(secondHand < 0){
                        this.setState({resetTimer: true})
                        clearInterval(beginCount);
                    }
                })
            }
        }, 1000);
    }
    
    componentWillUnmount(){
        this.backHandler.remove();
        //BackHandler.removeEventListener('hardwareBackPress', () => this.handleBackButton())
    }

    showSliderFunction(){
        this.setState({countTouch: (this.state.countTouch + 1)}, () => {
            //console.log("KEEP COUNTING: ", this.state.countTouch)
            if(this.state.countTouch === 1){
                setTimeout(() => {
                    this.setState({countTouch: 0}, () => {
                        //console.log("RESET COUNT: ", this.state.countTouch)
                    })
                }, 4000)
            }
            if(this.state.countTouch === 13){
                this.setState({
                    showSlider: true, countTouch: 0, 
                    serverLink: this.state.testLink, 
                    userPassword: 'xeam@123'
                }, async () => {
                    clearTimeout();
                    this.props.serverLink(this.state.serverLink);
                    await AsyncStorage.removeItem('onboardingURL');
                    AsyncStorage.setItem("onboardingURL", (this.state.showSlider && !this.state.sliderState)? this.state.onboardingTest : this.state.onboardingLive);
                })
            }
        })
    }

    openGooglePlayStore(){
        Linking.openURL("market://details?id=com.xenia");
    }

    async openAppHostIOS(){
        await Linking.openURL(this.state.iOSLink);
    }

    showBackground(callBack){
        const {bgImage, xeamLogo} = this.state;
        Animated.sequence([
            Animated.parallel([
                Animated.timing(bgImage, {
                    toValue: 1,
                    duration: 700,
                    easing: Easing.ease
                }).start(),
                Animated.timing(xeamLogo, {
                    toValue: 1,
                    duration: 700,
                    easing: Easing.ease
                })          
            ]),
            Animated.timing(this.state.versionOpacity, {
                toValue: 1,
                duration: 100
            })
        ]).start(({finished}) => {
            if(finished){
                callBack(true)
            }
        })
    }

    hideBackground(){const {bgImage, xeamLogo} = this.state;
        Animated.parallel([
            Animated.timing(bgImage, {
                toValue: 0,
                duration: 700,
                easing: Easing.ease
            }).start(),
            Animated.timing(xeamLogo, {
                toValue: 0,
                duration: 700,
                easing: Easing.ease
            }),
            Animated.timing(this.state.versionOpacity, {
                toValue: 0,
                duration: 400
            }).start()        
        ]).start(() => {
            this.loginAPI();
            this.hide();
        })
    }

    handleBackButton(){
        const {exitCount} = this.state;
        console.log("###$$$ CALLED ", this.props.route)
        if(this.props.route.name === 'login'){
            Alert.alert("Alert", "Are you sure you want to close the app ?", [
                {
                    text: "CANCEL",
                    onPress: () => null
                },
                {
                    text: "YES",
                    onPress: () => BackHandler.exitApp()
                }
            ])
            return true;
        }else{
            return false;
        }
    }

    setExitCount(){
        ToastAndroid.show('Press again to exit', ToastAndroid.SHORT);
        return true;
    }

    initialize(){
        //Alert.alert("ALERT 4");
        const deviceInfo2 = DeviceInfo.getSystemName();
        this.setState({device_type : deviceInfo2}, () => {
            console.log('%^%^&&& DEVICE TYPE: ', deviceInfo2)
            if(Platform.OS === 'ios'){
                this.checkiOSPermission().done();
            }else if(Platform.OS === 'android'){
                this.requestUserPermission();
            }
        });
    }

    requestUserPermission = async () => {
        //Alert.alert("ALERT 5");
        await firebase.messaging().registerDeviceForRemoteMessages();
        const token = await firebase.messaging().getToken();
        this.setState({device_id: token}, () => this.value());
    }

    value_thrd= async()=>{
        console.log("iOS Detected*****")
        //await messaging().registerDeviceForRemoteMessages();
        await firebase.messaging().requestPermission().then(async(success) => {
            console.log("IOS ACK: ", Boolean(success))
            const token = await firebase.messaging().getToken()
            //this.setState({device_id : DeviceInfo.getUniqueId()})
            this.setState({device_id : token}, () => {
                console.log("IOS TOKEN: ", this.state.device_id)
                if(this.state.device_id){
                    this.value();
                }
            })
        }).catch((error) => {
            console.log("IOS NACK: ", Boolean(error))
            Alert.alert("Request TimeOut. \n To Allow: \n Goto Settings -> Xenia -> Notifications -> Allow Notifications \n Afterwards, clear app from background and try again.")
            RNExitApp.exitApp();
        })
    }

    componentDidUpdate(prevProps, prevState){
        const { mainLink } = this.props;
        if(mainLink !== prevProps.mainLink){
            this.value();
        }
    }

    async value(){
        const promiseEmpCode = AsyncStorage.getItem('user');
        const promisePassword = AsyncStorage.getItem('user_pass');
        Promise.all([promiseEmpCode, promisePassword]).then((values) => {
            const {sliderState, showSlider} = this.state;
            const { mainLink } = this.props;
            const empCode = values[0];
            const password = values[1];
            this.setState({
                employee_code: empCode, userPassword: (!sliderState && showSlider)? 'xeam@123' : password
            }, () => {});
            const {employee_code, userPassword, currentVersion} = this.state;
            const { playStoreVersion } = this.props;
            if(playStoreVersion > currentVersion){
                //console.log("DUMMY NEW VERSION IS NOW LIVE");
                if(employee_code && userPassword && mainLink){
                    this.loginAPI();
                }
            }
        }).catch((error) => {
            Alert.alert(error);
        })
    }

    checkiOSPermission = async () => {
        const enabled = await firebase.messaging().hasPermission();
        console.log("PROMISE CHECK: ", enabled)
        if(enabled){
            this.value_thrd();
        } else {
            this.requestiOSPermission();
        }
    }

    requestiOSPermission = async () => {
        await firebase.messaging().requestPermission()
        .then(() => {
          this.checkiOSPermission();
        })
        .catch((error) => {
          console.log("REQUEST PERMISSION: ", error)
          // User has rejected permissions 
        })
    }

    hideLoader = () => {
        this.setState({ loading: false });
    }

    showLoader = () => {
        this.setState({ loading: true });
    }

    loginAPI(){
        const { mainLink } = this.props;
        const { employee_code, userPassword } = this.state;
        this.showLoader();
        console.log("API LINK: ", `${mainLink}/login`)
        axios.post(`${mainLink}/login`, {
            "employee_code": this.state.employee_code,
            "password": this.state.userPassword,
            "device_id": this.state.device_id,
            "device_type": this.state.device_type
        },
        {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }).then((response) => {
            this.hideLoader();
            const stringifyData = JSON.stringify(response.data)
            //console.log("##### RESPONSE: ", stringifyData);
            this.props.sendProps(stringifyData);
            this.props.setProject(response.data.success.project);
            if(!!mainLink && mainLink.includes('bpo')){
                this.props.setServerLabel(testLabel);
            }else{
                this.props.setServerLabel(null);
            }
            const data = JSON.parse(stringifyData);
            AsyncStorage.setItem('receivedBaseURL', mainLink);
            AsyncStorage.setItem('user',employee_code);
            AsyncStorage.setItem('user_pass',userPassword);
            AsyncStorage.setItem('user_token',stringifyData);
            AsyncStorage.setItem('userObj',stringifyData);
            if(data.success.hasOwnProperty('dashboard_ui')){
                this.props.loginState(true);
            }else{
                // Actions.coupons();
            }
        }).catch((error) => {
            this.hideLoader();
            console.log("$$$@@@ ERROR: ", typeof error, error);
            if(!error.response){
                Alert.alert('Error', JSON.stringify(error), [
                    {text: 'OK', onPress: () => this.showBackground(() => {})}
                ]);
                return;
            }
            if(error.response?.data?.error){
                Alert.alert('Error', error.response.data.error, [
                    {text: 'OK', onPress: () => this.showBackground(() => {})}
                ]);
                return;
            }
            if(error){
                Alert.alert('Error', JSON.stringify(error), [
                    {text: 'OK', onPress: () => this.showBackground(() => {})}
                ]);
                return;
            }
            //this.showBackground(() => {})
        })
    }

    hide =()=>{
        const a= Keyboard.dismiss();
    }

    functionCombined() {
        if(this.state.employee_code && this.state.userPassword){
            this.hideBackground();
        }else {
            Alert.alert("Please enter both credentials")
        }
    }

    render () {
        const {
            bgImage, xeamLogo, versionOpacity, loading, showSlider, device_id, showChangePassModal,
            changePassStep, resetTimer, currentVersion
        } = this.state;
        const { playStoreVersion } = this.props;
        let directLogin = false;
        console.log("ASYNC CHECK: ", )
            const animateRight = bgImage.interpolate({
                inputRange: [0, 1],
                outputRange: ['-100%', '-0.5%']
            })
            const animateBGImage = {
                //opacity: bgOpacity
                right: animateRight
            }
            const animateLeftLogo = xeamLogo.interpolate({
                inputRange: [0, 1],
                outputRange: ['-300%', '0%']
            })
            const animateLogo = {
                left: animateLeftLogo,
            }
        const {errorCode, apiCode, selectServerModal} = this.state;
        //const {navigate} = this.props.navigation;
        const card = {card: {width: '100%', height: '100%',backgroundColor: '#edeceb'}};
        let gradientShadow = ['#0D4EBA', '#197EC4'];
        let gradient = ['#039FFD', '#EA304F']
        const circleWidth = getWidthnHeight(70)
        const circleHeight = {height: circleWidth.width}
        //console.log("@@@@ APP MODE: ", Math.floor(getWidthnHeight(6).width), __DEV__);
        //console.log("device_type", this.state.device_type);
        //console.log("REDUX PROPS: ", this.props)
        //Alert.alert("ALERT 2");
        const _this = this;
        const newIcon = (<MaterialIcons name={'fiber-new'} style={{backgroundColor: 'transparent'}} size={getWidthnHeight(10).width}/>);
        const newIconOpacity = (<MaterialIcons name={'fiber-new'} style={{opacity: 0}} size={getWidthnHeight(10).width}/>);
        const animateOpacity = {
            opacity: versionOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1]
            })
        }
        return (
            <View style={{flex: 1}}>
            <StatusBar hidden={false} barStyle="dark-content" />
            {(!loading) && 
                <View style={{flex: 1}}>
                    <View style={{flex: 1, zIndex: 2}}>
                    <DismissKeyboard>
                        <View style={[{borderColor: 'red', borderWidth: 0, width: '100%', height: '100%'}]}>
                            <Animated.View style={[{borderWidth: 0, borderColor: 'green'}, animateBGImage]}>
                                <View style={[{borderColor: 'red', borderWidth: 0, alignItems: 'flex-end', justifyContent: 'space-between', flexDirection: 'row', zIndex: 2}, getWidthnHeight(99, 10)]}>
                                    <TouchableOpacity style={[{borderColor: 'black', borderWidth: 0}, getWidthnHeight(30, 10)]} onPress={() => {
                                        const {showSlider} = this.state;
                                        if(!showSlider){
                                            this.showSliderFunction();
                                        }
                                    }}>
                                        <View style={{flex: 1, backgroundColor: 'transparent'}}/>
                                    </TouchableOpacity>
                                    <View>
                                        {(showSlider) &&
                                            <View style={[getMarginRight(3), {borderColor: 'red', borderWidth: 0}]}>
                                                <Slider 
                                                    activeColor={'#26DA7B'} 
                                                    //inactiveColor={'red'}
                                                    //buttonColor={'red'}
                                                    // buttonBorderColor={'blue'}
                                                    value={this.state.sliderState}
                                                    onSlide={(sliderState) => this.setState({sliderState}, async() => {
                                                        const {sliderState} = this.state;
                                                        await AsyncStorage.removeItem('onboardingURL');
                                                        console.log("SLIDER STATE: ", sliderState)
                                                        if(sliderState){
                                                            this.setState({serverLink: this.state.liveLink, userPassword: ''}, () => {
                                                                this.props.serverLink(this.state.serverLink);
                                                                AsyncStorage.setItem("onboardingURL", this.state.onboardingLive);
                                                            })
                                                        }else{
                                                            this.setState({serverLink: this.state.testLink, userPassword: 'xeam@123'}, () => {
                                                                this.props.serverLink(this.state.serverLink);
                                                                AsyncStorage.setItem("onboardingURL", this.state.onboardingTest);
                                                            })
                                                        }
                                                    })}
                                                    delay={300}
                                                    title={['Test', 'Live']}
                                                />
                                            </View>
                                        }
                                    </View>
                                </View>
                                <Animated.View style={[animateLogo]}>
                                    <Animated.View style={[{borderColor: 'black', borderWidth: 0, justifyContent: 'space-evenly'}, getWidthnHeight(100, 25)]}>
                                        <View style={[{borderColor: 'black', borderWidth: 0}, styles.logoPosition]}>
                                            <Animated.Image 
                                                source={require('./Image/512logo.png')} 
                                                style={[{
                                                    resizeMode: 'contain', width: getWidthnHeight(40).width, 
                                                    height: getWidthnHeight(undefined, 10).height
                                                }]}
                                            />
                                        </View>
                                        <Animated.View style={[{
                                            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', 
                                            width: getWidthnHeight(60).width, borderWidth: 0, borderColor: 'red'
                                        }, getMarginLeft(2)]}>
                                            <Text style={[styles.boldFont, {fontWeight: 'bold', color: '#505355'}, fontSizeH2()]}>LOGIN</Text>
                                            <View style={[{backgroundColor: 'grey', height: 1}, getWidthnHeight(30)]}/>
                                        </Animated.View>
                                    </Animated.View>
                                </Animated.View>
                            </Animated.View>
                            <Animated.View style={[{flex: 1}, animateLogo]}>
                                <KeyboardAvoidingView contentContainerStyle={{flex: 1}} behavior={(Platform.OS === 'ios')? "padding" : null} keyboardVerticalOffset={(Platform.OS === "ios")? 120 : null}> 
                                    <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                                        <Animated.View style={[{borderColor: 'blue', borderWidth: 0}, getWidthnHeight(100, 65)]}>
                                            <View style={[{marginTop: (getMarginTop(7).marginTop + 3)}, getWidthnHeight(80, 15),  styles.credentialsBox]}>
                                                <View style={{flex: 1}}>
                                                    <View style={{flex: 1, justifyContent: 'space-evenly'}}>
                                                        <View style={[{flexDirection: 'row', alignItems: 'center', borderColor: 'black', borderWidth: 0}, getMarginLeft(5), getWidthnHeight(undefined, 7)]}>
                                                            <UserIcon name="user-circle" color='grey' size={Math.floor(getWidthnHeight(10).width)}/>
                                                            <TextInput
                                                                key='TextInput1'
                                                                style={[{paddingLeft: 10, paddingRight: 10, flex: null, borderColor: '#D3D3D3', borderWidth: 0, borderRadius: 10, fontSize: fontSizeH4().fontSize + 3}, getWidthnHeight(55, 6)]}
                                                                value={this.state.employee_code}
                                                                onChangeText={(employee_code) => _this.setState({employee_code: employee_code.trim()})}
                                                                placeholder='Employee Code'
                                                                placeholderTextColor={'dimgrey'}
                                                                autoCorrect={false}
                                                                autoCapitalize={'none'}
                                                            />
                                                        </View>
                                                        <View style={[{height: 1, backgroundColor: 'lightgrey'}, getWidthnHeight(80)]}/>
                                                        <View style={[{flexDirection: 'row', alignItems: 'center', borderWidth: 0, borderColor: 'black'}, getMarginLeft(5), getWidthnHeight(undefined, 7)]}>
                                                            <View style={{
                                                                backgroundColor: 'grey', borderRadius: 40, alignItems: 'center', 
                                                                justifyContent: 'center', width: Math.floor(getWidthnHeight(10).width),
                                                                height: Math.floor(getWidthnHeight(10).width)
                                                            }}>
                                                                <PasswordKey name="key" color='white' size={Math.floor(getWidthnHeight(6).width)}/>
                                                            </View>
                                                            <View style={{borderWidth: 0, borderColor: 'black'}}>
                                                                <TextInput
                                                                    style={[{paddingLeft: 13, paddingRight: 10, flex: null, borderColor: '#D3D3D3', borderWidth: 0, borderRadius: 10, fontSize: fontSizeH4().fontSize + 3}, getWidthnHeight(55, 6)]}
                                                                    value={this.state.userPassword}
                                                                    onChangeText={(userPassword) => _this.setState({userPassword: userPassword.trim()})}
                                                                    placeholder='Password'
                                                                    placeholderTextColor={'dimgrey'}
                                                                    autoCorrect={false}
                                                                    autoCapitalize={'none'}
                                                                    secureTextEntry={(!this.state.showPassword)? true : false}
                                                                />
                                                                <View style={[{position: 'absolute', alignSelf: 'flex-end', borderColor: 'black', borderWidth: 0}, getWidthnHeight(undefined, 7)]}>
                                                                {(!this.state.showPassword) ?
                                                                    <View style={[{flexDirection: 'row', alignItems: 'center'}, getWidthnHeight(undefined, 7)]}>
                                                                        <TouchableOpacity onPress={() => this.setState({showPassword: true})}>
                                                                            <Image source={require('./Image/visibilityOff.png')} style={{marginRight: 10, width: 20, height: 20}}/>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                :
                                                                    <View style={[{flexDirection: 'row', alignItems: 'center'}, getWidthnHeight(undefined, 7)]}>
                                                                        <TouchableOpacity onPress={() => this.setState({showPassword: false})}>
                                                                            <Image source={require('./Image/visibility.png')} style={{marginRight: 10, width: 20, height: 20}}/>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                }
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    {(!device_id) &&
                                                        <View style={[{
                                                            backgroundColor: 'rgba(0,0,0,0.50)', alignItems: 'center', justifyContent: 'center',
                                                            borderTopEndRadius: getWidthnHeight(undefined, 100).height,
                                                            borderBottomEndRadius: getWidthnHeight(undefined, 100).height,}, StyleSheet.absoluteFill
                                                        ]}>
                                                            <ActivityIndicator size="large" color={'#FFFFFF'} style={{transform: [{scale: 1.5}]}}/>
                                                        </View>
                                                    }
                                                </View>
                                            </View>
                                            <View style={[{justifyContent: 'center', alignItems: 'flex-start', borderColor: 'black', borderWidth: 0}, getMarginLeft(5), getWidthnHeight(50), getMarginTop(5)]}>
                                                <LoginButton 
                                                    title="LOGIN"
                                                    disable={(device_id)? false : true}
                                                    gradient={gradient}
                                                    onPress={() =>{
                                                        const {device_id} = this.state;
                                                        Keyboard.dismiss();
                                                        if(device_id){
                                                            this.functionCombined();
                                                        }else{
                                                            //alert('If its taking too long. Close the app and try again.')
                                                        }
                                                    }}
                                                    style={[{borderRadius: 10},getWidthnHeight(45, 7)]}
                                                    textBoxStyle={[getWidthnHeight(35, 7)]}
                                                />
                                            </View>
                                            <Animated.View style={[getMarginTop(5), getMarginLeft(5), animateOpacity]}>
                                                <TouchableOpacity 
                                                    activeOpacity={0.5}
                                                    onPress={() => {
                                                        if(playStoreVersion > currentVersion){
                                                            Alert.alert('Alert!', `Update Xenia (${playStoreVersion}) now to continue using "User E-Onboarding"`, [
                                                                {
                                                                    text: 'Update Now',
                                                                    onPress: () => {
                                                                        if(Platform.OS === 'android'){
                                                                            this.openGooglePlayStore();
                                                                        }else if(Platform.OS === 'ios'){
                                                                            this.openAppHostIOS();
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    text: 'Cancel'
                                                                }
                                                            ]);
                                                        }else{
                                                            this.props.navigation.navigate('WelcomePortal');
                                                        }
                                                        //console.log("ONBOARDING PORTAL")
                                                    }}
                                                    style={[{flexDirection: 'row', alignItems: 'center'}]}
                                                >
                                                    <GradientIcon
                                                        start={{x: 0, y: 0}}
                                                        end={{x: 0.7, y: 0}}
                                                        containerStyle={[{borderWidth: 0, borderColor: 'red', alignItems: 'center'}, getWidthnHeight(10)]}
                                                        icon={newIcon}
                                                        hiddenIcon={newIconOpacity}
                                                        colors={["#CF0000", "#FF2442"]}
                                                    />
                                                    <Text style={[{fontStyle: 'italic', color: '#0074E4', fontSize: (fontSizeH4().fontSize + 3)}]}>USER E-ONBOARDING</Text>
                                                </TouchableOpacity>
                                            </Animated.View>
                                            {/* {<AnimateTouch
                                                activeOpacity={0.5}
                                                style={[animateOpacity]}
                                                onPress={() => {
                                                    this.setState({showChangePassModal: true})
                                                }}
                                            >
                                                <Text 
                                                    style={[{
                                                        fontStyle: 'italic', textDecorationLine: 'underline', 
                                                        color: '#0074E4', fontSize: (fontSizeH4().fontSize + 3)
                                                    }, getMarginTop(1), getMarginLeft(5)
                                                ]}>
                                                    Forgot Password ?
                                                </Text>
                                            </AnimateTouch>} */}
                                            <Animated.Text style={[{fontStyle: 'italic'}, getMarginTop(5), getMarginLeft(5), animateOpacity]}>Version: {DeviceInfo.getVersion()}</Animated.Text>
                                        </Animated.View>
                                        {(showChangePassModal) && (
                                            <ChangePassword 
                                                title={'FORGOT PASSWORD'}
                                                isvisible={showChangePassModal}
                                                toggle={() => this.setState({showChangePassModal: false})}
                                                colorTheme={'#0B8EE8'}
                                                passStep={changePassStep}
                                                updatePassStep={(step) => this.setState({changePassStep: step})}
                                                startCount={() => this.startCount()}
                                                clearCount={() => {
                                                    this.setState({resetTimer: true, minuteHand: 1, secondHand: 59}, () => clearInterval(beginCount));
                                                }}
                                                minuteHand={this.state.minuteHand}
                                                secondHand={this.state.secondHand}
                                                reset={resetTimer}
                                            />
                                        )}
                                    </ScrollView>
                                </KeyboardAvoidingView>
                            </Animated.View>
                        </View>
                    </DismissKeyboard>
                    </View>
                    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
                        <Animated.Image 
                            source={require('./Image/LoginPage.png')}
                            style={[{zIndex: 1}, getWidthnHeight(100, 100), animateBGImage]}
                        />
                    </View>
                </View>
            }
            {(loading) && (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <DesktopLoader 
                        scale={0.7}
                        screenStyle={[getWidthnHeight(30, 10)]}
                        baseStyle={[getWidthnHeight(43, 0.5)]}
                        // outlineColor = "red"
                        // loaderColor = "cyan"
                        size = "large"
                        loaderScale = {1.4}
                    />
                    {/* <ReactLoader /> */}
                </View>
            )}
            </View>
          );
      }
}


    const styles = StyleSheet.create({
        logintext: {
            alignItems:'center',
            marginBottom:0,
            marginTop: -10
        },
        logoPosition: {
            ...Platform.select({
                ios: {
                    marginLeft: getMarginLeft(2).marginLeft
                },
                android: {
                    marginLeft: getMarginLeft(5).marginLeft
                }
            })
        },
        credentialsBox: {
            shadowColor: '#000000',
            shadowOpacity: 0.5,
            elevation: 8,
            borderTopEndRadius: getWidthnHeight(undefined, 100).height,
            borderBottomEndRadius: getWidthnHeight(undefined, 100).height,
            shadowRadius: 5,
            backgroundColor: '#FFFFFF',
            alignItems: 'flex-start',
            justifyContent: 'space-evenly',
            shadowOffset: {width: 0, height: 0}
        },
        title: {
            textAlign:'center',
            color: 'rgb(19,111,232)',
            fontSize: 38,
            marginBottom: 20
            // fontWeight: 'bold',
        },
        button: {
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 50,
            shadowColor: '#000000',
            elevation: 7
        },
        buttonShadow: {
            marginTop: 10,
            marginLeft: 0,
            borderTopLeftRadius: 50,
            borderBottomRightRadius: 50
        },
        pagecomponent: {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor:'#ffffff',
            borderRadius: 10,
            borderTopWidth: 1.5,
            borderBottomWidth:1.5,
            borderRightWidth:1.5,
            borderLeftWidth:1.5,
            borderColor: '#ffffff',
            width:viewportWidth/1.2,
            height: '60%',
            // shadowOffset:{  width: 100,  height: 100,  },
            shadowColor: '#330000',
            shadowOpacity: 0,
            // shadowRadius: 0,
            elevation: 3,
        },
        separator: {
            marginVertical: 8,
            borderBottomColor: '#2B2929',
            borderBottomWidth: StyleSheet.hairlineWidth,
        },
        container: {
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#edeceb'
        },
        btnEye: {
            position: 'absolute',
            top: 20,
            right: 28,
        },
        iconEye: {
            width: 50,
            height: 50,
            tintColor: "black",
        },
        loginCard: {
            backgroundColor: 'white', 
            borderRadius: 10, 
            alignItems: 'center', 
            borderColor: 'black', 
            borderWidth: 0, 
            shadowColor: '#000000',
            elevation: 10,
            justifyContent: 'space-evenly'
        },
        loadingStyle: {
            shadowOffset: null, 
            shadowColor: 'black', 
            shadowOpacity: null, 
            shadowRadius: 10, 
            elevation: 5,
            backgroundColor: 'white',
            height: 60,
            borderRadius:5,
        },
        boldFont: {
            ...Platform.select({
                android: {
                    fontFamily: ''
                }
            })
        }
    });

// export default LoginPage;

const mapStateToProps = (state) => {
    // console.log("@@@### SAVED LINK: ", state)
    return {
        mainLink: state.reduxState.mainLink
    }
}

const LoginPageComponent = connect(mapStateToProps, {sendProps, serverLink, loginState, setProject, setServerLabel})(LoginPage);
export default LoginPageComponent;