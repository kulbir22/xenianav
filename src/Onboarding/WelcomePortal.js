import React, {Component} from 'react';
import {
    View, Text, ImageBackground, Animated, Keyboard, ScrollView,  TextInput, TouchableHighlight,
    FlatList, Alert, StyleSheet, Platform, PermissionsAndroid, SafeAreaView, StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import axios from 'axios';
import {fetchBaseURL} from '../api/BaseURL';
import {
    getWidthnHeight, IOS_StatusBar, getMarginTop, fontSizeH4, fontSizeH3, AnimatedTextInput, getMarginHorizontal,
    DismissKeyboard, OTPInput, ChoppedButton, getMarginVertical, getMarginLeft, getMarginBottom, Spinner
} from '../NewComponents/common';

const COLOR1 = "#039FFD";
const COLOR2 = "#EA304F";

class WelcomePortal extends Component{
    constructor(props){
        super(props)
        this.state = {
            mobileNumber: '',
            mobileNumberError: true,
            getOTP: false,
            showInputField: false,
            input1: '',
            input2: '',
            input3: '',
            input4: '',
            input5: '',
            input6: '',
            inputError1: true,
            inputError2: true,
            inputError3: true,
            inputError4: true,
            inputError5: true,
            inputError6: true,
            focus1: false,
            focus2: false,
            focus3: false,
            focus4: false,
            focus5: false,
            focus6: false,
            show1: true,
            show2: false,
            show3: false,
            show4: false,
            show5: false,
            show6: false,
            points: [
                {id: '1', title: 'Bank Passbook / Cancelled Cheque'},
                {id: '2', title: 'Aadhar Card'},
                {id: '3', title: 'Pan Card'},
                {id: '4', title: 'Updated CV'},
                {id: '5', title: 'Educational Certificates'},
                {id: '6', title: 'ID Proof'},
                {id: '7', title: 'Passport size photograph'}
            ],
            noError: function(){
                return (
                    !this.inputError1 && !this.inputError2 && !this.inputError3 && !this.inputError4 && 
                    !this.inputError5 && !this.inputError5 && !this.inputError6
                );
            },
            shakeAnimation: new Animated.Value(0),
            baseURL: null,
            loading: false
        };
    }

    componentDidMount(){
        fetchBaseURL().then((baseURL) => {
            this.setState({baseURL}, () => console.log("###$$$ONBOARDING URL: ", this.state.baseURL))
        });
        if(Platform.OS === 'android'){
            this.getAndroidStoragePermission();
        }else if(Platform.OS === 'ios'){
            this.get_iOS_StoragePermission();
        }
    }

    componentDidUpdate(){
        const { input1, input2, input3, input4, input5, input6 } = this.state;
        if(input1 && input2 && input3 && input4 && input5 && input6){
            this.matchOTP();   
        }
    }

    async getAndroidStoragePermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                //Alert.alert("Permission granted","Now you can download anything!");
            }else {
                Alert.alert(
                "Permission Denied!",
                "You need to give storage permission to download the file",
                [{
                    text: "OK",
                    onPress: () =>this.props.navigation.goBack()
                }]
                );
            }
        }catch (err) {
            console.warn(err);
        }
    }
    
    async get_iOS_StoragePermission(){
        await check(PERMISSIONS.IOS.MEDIA_LIBRARY).then(async(result) => {
            console.log("&&&&&&&& PERMISSION: ", result)
            switch (result) {
                case RESULTS.UNAVAILABLE:
                  console.log('^^^&&&&&This feature is not available (on this device / in this context)');
                  break;
                case RESULTS.DENIED:
                  console.log('The permission has not been requested / is denied but requestable');
                  const response = await request(PERMISSIONS.IOS.MEDIA_LIBRARY)
                  response === RESULTS.GRANTED ? console.log("@@@ MEDIA PERMISSION GRANTED") :this.props.navigation.goBack();
                  break;
                case RESULTS.GRANTED:
                  console.log('The permission is granted');
                  break;
                case RESULTS.BLOCKED:
                  console.log('The permission is denied and not requestable anymore');
                  break;
              }
        })
        //console.log("$$$$$ CHECK PERMISSION: ", response)
    }

    onSubmit(){
        const checkError = this.state.noError();
        if(!checkError){
            this.shakeFunction();
            return
        }else{
            if(!this.state.mobileNumberError){
                this.matchOTP();
            }else{
                alert("Please enter 10-digit mobile number")
            }
        }
    }

    shakeFunction(){
        const {shakeAnimation} = this.state;
        Animated.timing(shakeAnimation, {
            toValue: 10,
            duration: 200
        }).start(({finished}) => {
            if(finished){
                Alert.alert("", "6-digit OTP is required", [{text: 'OK', onPress: () => this.state.shakeAnimation.setValue(0)}]);
            }
        })
    }

    showLoader(){
        this.setState({loading: true})
    }

    hideLoader(){
        this.setState({loading: false})
    }

    async sendOTP(){
        const {baseURL, mobileNumber} = this.state;
        this.showLoader();
        console.log("SEND OTP URL: ", `${baseURL}/onboarding/send-otp`)
        axios.post(`${baseURL}/onboarding/send-otp`,
        {
            mobile_number: mobileNumber
        },
        {
            headers: {
                'Accept': 'application/json',
            }
        }).then((response) => {
            this.hideLoader();
            const parsedData = response.data;
            this.setState({showInputField: true})
            console.log("SUCCESS", parsedData)
            //Alert.alert("Success", parsedData.message)
        }).catch((error) => {
            this.hideLoader();
            //console.log("ERROR: ", error)
            if(error.response){
                const status = error.response.status;
                Alert.alert("ERROR", `Error Code: ${status}601`);
            }else{
                alert(`${error}, API CODE: 601`)
            }
        })
    }

    async matchOTP(){
        const {
            baseURL, mobileNumber, input1, input2, input3, input4, input5, input6
        } = this.state;
        this.showLoader();
        const otp = `${input1}${input2}${input3}${input4}${input5}${input6}`;
        this.setState({
            input1: '', input2: '', input3: '',
            input4: '', input5: '', input6: ''
        }, () => {
            axios.post(`${baseURL}/onboarding/match-otp`,
            {
                mobile_number: mobileNumber,
                otp 
            },
            {
                headers: {
                    'Accept': 'application/json',
                }
            }).then((response) => {
                this.hideLoader();
                const parsedData = response.data;
                if(parsedData.status === 1){
                    alert(parsedData.message);
                    if(parsedData.complete === false){
                        // console.log("MATCH SUCCESS", parsedData)
                        const screenList = parsedData.sectionData.links.pageLinks;
                        const currentPage = parsedData.currentPage;
                        const index = screenList.findIndex((item) => {
                            return (item.page === currentPage)
                        })
                        //console.log("PAGE INDEX: ", index, currentPage)
                        //AsyncStorage.setItem("onboardingScreens", JSON.stringify(screenList));
                        AsyncStorage.setItem('onboardingToken', parsedData.secret_token);
                        this.props.navigation.navigate(screenList[index]['key'], {apiData: JSON.stringify(parsedData)})
                    }else{
                        this.props.navigation.navigate('OtherDetails', {apiData: JSON.stringify(parsedData)});
                    }
                }else{
                    alert(parsedData.message);
                }
            }).catch((error) => {
                this.hideLoader();
                console.log("ERROR: ", error.response)
                if(error.response){
                    const status = error.response.status;
                    Alert.alert("ERROR", `Error Code: ${status}602`);
                }else{
                    alert(`${error}, API CODE: 602`)
                }
            })
        });
    }

    render(){
        const {
            mobileNumber, mobileNumberError, getOTP, input1, input2, input3, input4, input5, input6,
            inputError1, inputError2, inputError3, inputError4, inputError5, inputError6, points,
            focus1, focus2, focus3, focus4, focus5, focus6, show1, show2, show3, show4, show5, show6,
            shakeAnimation, loading, showInputField
        } = this.state;
        const animatedStyle = {
            transform: [
                {
                    translateX: shakeAnimation.interpolate({
                        inputRange: [0, 2, 4, 6, 8, 10],
                        outputRange: [0, -10, 10, -10, 10, 0]
                    })
                }
            ]
        }
        return (
            <SafeAreaView style={{flex: 1}}>
                <StatusBar hidden={false} barStyle="dark-content" />
                <View style={[{alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: '#F6F6F6', flex: 1}]}>
                    <View style={{flex: 1}}>
                        <View style={{alignItems: 'center', flex: 1}}>
                            {/* <IOS_StatusBar color={['#F6F6F6', '#F6F6F6']} barStyle="dark-content"/> */}
                            <DismissKeyboard>
                                <View style={{alignItems: 'center'}}>
                                    <View style={{position: 'absolute', alignSelf: 'flex-start'}}>
                                        <Ionicons 
                                            onPress={() => this.props.navigation.goBack()}
                                            style={[getMarginTop(1.5)]} 
                                            name='arrow-back' 
                                            color={'black'} 
                                            size={getWidthnHeight(8).width}
                                        />
                                    </View>
                                    <View style={[{borderColor: 'black', borderWidth: 0}, getMarginTop(0)]}>
                                        <Animated.Image 
                                            source={require('../Image/512logo.png')} 
                                            style={[{
                                                resizeMode: 'contain', width: getWidthnHeight(30).width, 
                                                height: getWidthnHeight(undefined, 10).height
                                            }]}
                                        />
                                    </View>
                                    <LinearGradient 
                                    start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                    colors={[COLOR1, COLOR2]}
                                    style={[{alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(93, 15)]}>
                                        <ImageBackground 
                                            resizeMode="cover"
                                            source={require('../Image/PeopleBG.png')} 
                                            style={[{
                                                position: 'absolute', opacity: 0.5}, getWidthnHeight(93, 15), getMarginTop(0)
                                        ]}/>
                                        <Text style={[{color: 'white', fontSize: (fontSizeH4().fontSize + 5)}]}>Welcome To</Text>
                                        <Text style={[{color: 'white', fontSize: (fontSizeH3().fontSize + 4)}]}>Onboarding Portal</Text>  
                                    </LinearGradient>
                                </View>
                            </DismissKeyboard>
                            <View style={[{
                                alignItems: 'center', backgroundColor: 'white', shadowOpacity: 0.4, shadowColor: '#000000', shadowRadius: 2, elevation: 2, 
                                shadowOffset: {width: 0, height: 0}, flex: 1}, getMarginVertical(2), getWidthnHeight(93)]}>
                                <DismissKeyboard>
                                    <View style={{alignItems: 'center'}}>
                                        <View style={[{flexDirection: 'row', justifyContent: 'space-evenly'}, getMarginTop(2), getWidthnHeight(93)]}>
                                            <AnimatedTextInput 
                                                placeholder=" Mobile Number "
                                                placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                value={mobileNumber}
                                                maxLength={10}
                                                keyboardType={'numeric'}
                                                slideVertical={[0, getWidthnHeight(undefined, -3.5).height]}
                                                slideHorizontal={[0, getWidthnHeight(-3).width]}
                                                placeholderScale={[1, 0.75]}
                                                autoFocus={false}
                                                onChangeText={(mobileNumber) => {
                                                    this.setState({ mobileNumber: mobileNumber.replace(/[^0-9]/g, '')}, () => {
                                                        const {mobileNumber} = this.state;
                                                        if(mobileNumber.length === 10){
                                                            this.setState({mobileNumberError: false})
                                                        }else if(mobileNumber.length > 0 && mobileNumber.length < 10){
                                                            this.setState({mobileNumberError: true})
                                                        }else if(mobileNumber === ''){
                                                            this.setState({mobileNumber: '', mobileNumberError: true}, () => Keyboard.dismiss())
                                                        }
                                                    })
                                                }}
                                                clearText={() => this.setState({mobileNumber: '', mobileNumberError: true})}
                                                containerColor={[(getOTP && mobileNumberError)? 'red' : '#C4C4C4', (getOTP && mobileNumberError)? 'red' : '#C4C4C4']}
                                                containerBorderWidth={[(getOTP && mobileNumberError)? 2 : 1, 1]}
                                                containerStyle={[{
                                                    borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (getOTP && mobileNumberError)? 'dashed' : 'solid',
                                                }, getWidthnHeight(65, 7)]}
                                                style={[{
                                                    borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 4),
                                                    color: (mobileNumberError)? 'red' : 'black'
                                                }, getWidthnHeight(55, 7), getMarginHorizontal(2)]}
                                                // iconSize={Math.floor(getWidthnHeight(5).width)}
                                                // iconColor={'#C4C4C4'}
                                            />
                                            <TouchableHighlight 
                                                underlayColor={COLOR2} 
                                                onPress={() => {
                                                    if(mobileNumber.length < 10 && mobileNumberError){
                                                        alert("Please enter 10-digit mobile number")
                                                    }else{
                                                        this.sendOTP();
                                                    }
                                                    Keyboard.dismiss();
                                                }}
                                                style={[{
                                                    backgroundColor: COLOR1, alignItems: 'center', justifyContent: 'center', borderRadius: getWidthnHeight(1).width
                                                    }, getWidthnHeight(20, 7)
                                            ]}>
                                                <Text style={[{color: 'white'}, fontSizeH4()]}>GET OTP</Text>
                                            </TouchableHighlight>
                                        </View>
                                        {(showInputField) &&
                                            <>
                                                <Animated.View style={[{
                                                    alignItems: 'center', justifyContent: 'space-evenly', flexDirection: 'row', borderColor: 'black', borderWidth: 0
                                                    }, getMarginTop(3), getWidthnHeight(93), animatedStyle
                                                ]}>
                                                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                                        <TextInput 
                                                            ref={(ref) => {this.inputText1 = ref}}
                                                            style={[{
                                                                width: Math.floor(getWidthnHeight(10).width), height: Math.floor(getWidthnHeight(10).width),
                                                                borderRadius: Math.floor(getWidthnHeight(1).width), textAlign: 'center', textAlignVertical: 'center',
                                                                borderColor: ((focus1 && inputError1) || !inputError1)? COLOR1  : 'grey', borderWidth: (focus1 || !inputError1)? 2 : 1,
                                                                fontSize: (fontSizeH4().fontSize + 4), color: 'black'
                                                            }]}
                                                            maxLength={1}
                                                            keyboardType={'numeric'}
                                                            value={input1}
                                                            onFocus={() => this.setState({focus1: true})}
                                                            onBlur={() => this.setState({focus1: false})}
                                                            onChangeText={(input1) => {
                                                                this.setState({input1: input1.replace(/[^0-9]/g, '')}, () => {
                                                                    const {input1} = this.state;
                                                                    if(input1 === ''){
                                                                        this.setState({inputError1: true})
                                                                    }else{
                                                                        this.setState({inputError1: false}, () => {
                                                                            this.inputText2.focus();
                                                                        })
                                                                    }
                                                                })
                                                            }}
                                                        />
                                                    </View>
                                                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                                        <TextInput 
                                                            ref={(ref) => {this.inputText2 = ref}}
                                                            onKeyPress={({nativeEvent}) => {
                                                                if(nativeEvent.key === 'Backspace'){
                                                                    if(inputError3){
                                                                        this.inputText1.focus()
                                                                    }
                                                                }
                                                            }}
                                                            style={[{
                                                                width: Math.floor(getWidthnHeight(10).width), height: Math.floor(getWidthnHeight(10).width),
                                                                borderRadius: Math.floor(getWidthnHeight(1).width), textAlign: 'center', textAlignVertical: 'center',
                                                                borderColor: (focus2)? COLOR1 : (inputError2)? 'grey' : COLOR1, borderWidth: (focus2 || !inputError2)? 2 : 1,
                                                                fontSize: (fontSizeH4().fontSize + 4), color: 'black' 
                                                            }]}
                                                            maxLength={1}
                                                            keyboardType={'numeric'}
                                                            value={input2}
                                                            onFocus={() => this.setState({focus2: true}, () => {if(inputError1)this.inputText1.focus()})}
                                                            onBlur={() => this.setState({focus2: false})}
                                                            onChangeText={(input2) => {
                                                                this.setState({input2: input2.replace(/[^0-9]/g, '')}, () => {
                                                                    const {input2} = this.state;
                                                                    if(input2 === ''){
                                                                        this.setState({inputError2: true}, () => {
                                                                            if(inputError3){
                                                                                this.inputText1.focus()
                                                                            }
                                                                        })
                                                                    }else{
                                                                        this.setState({inputError2: false}, () => this.inputText3.focus())
                                                                    }
                                                                })
                                                            }}
                                                        />
                                                    </View>
                                                
                                                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                                        <TextInput 
                                                            ref={(ref) => {this.inputText3 = ref}}
                                                            onKeyPress={({nativeEvent}) =>{
                                                                if(nativeEvent.key === 'Backspace'){
                                                                    if(inputError4){
                                                                        this.inputText2.focus()
                                                                    }
                                                                }
                                                            }}
                                                            style={[{
                                                                width: Math.floor(getWidthnHeight(10).width), height: Math.floor(getWidthnHeight(10).width),
                                                                borderRadius: Math.floor(getWidthnHeight(1).width), textAlign: 'center', textAlignVertical: 'center',
                                                                borderColor: (focus3)? COLOR1 : (inputError3)? 'grey' : COLOR1, borderWidth: (focus3 || !inputError3)? 2 : 1, 
                                                                fontSize: (fontSizeH4().fontSize + 4), color: 'black'
                                                            }]}
                                                            maxLength={1}
                                                            keyboardType={'numeric'}
                                                            value={input3}
                                                            onFocus={() => this.setState({focus3: true}, () => {if(inputError1)this.inputText1.focus()})}
                                                            onBlur={() => this.setState({focus3: false})}
                                                            onChangeText={(input3) => {
                                                                this.setState({input3: input3.replace(/[^0-9]/g, '')}, () => {
                                                                    const {input3} = this.state;
                                                                    if(input3 === ''){
                                                                        this.setState({inputError3: true}, () => {
                                                                            if(inputError4){
                                                                                this.inputText2.focus()
                                                                            }
                                                                        })
                                                                    }else{
                                                                        this.setState({inputError3: false}, () => this.inputText4.focus())
                                                                    }
                                                                })
                                                            }}
                                                        />
                                                    </View>
                                                
                                                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                                        <TextInput 
                                                            ref={(ref) => {this.inputText4 = ref}}
                                                            onKeyPress={({nativeEvent}) =>{
                                                                if(nativeEvent.key === 'Backspace'){
                                                                    if(inputError5){
                                                                        this.inputText3.focus()
                                                                    }
                                                                }
                                                            }}
                                                            style={[{
                                                                width: Math.floor(getWidthnHeight(10).width), height: Math.floor(getWidthnHeight(10).width),
                                                                borderRadius: Math.floor(getWidthnHeight(1).width), textAlign: 'center', textAlignVertical: 'center',
                                                                borderColor: (focus4)? COLOR1 : (inputError4)? 'grey' : COLOR1, borderWidth: (focus4 || !inputError4)? 2 : 1, 
                                                                fontSize: (fontSizeH4().fontSize + 4), color: 'black'
                                                            }]}
                                                            maxLength={1}
                                                            keyboardType={'numeric'}
                                                            value={input4}
                                                            onFocus={() => this.setState({focus4: true}, () => {if(inputError1)this.inputText1.focus()})}
                                                            onBlur={() => this.setState({focus4: false})}
                                                            onChangeText={(input4) => {
                                                                this.setState({input4: input4.replace(/[^0-9]/g, '')}, () => {
                                                                    const {input4} = this.state;
                                                                    if(input4 === ''){
                                                                        this.setState({inputError4: true}, () => {
                                                                            if(inputError5){
                                                                                this.inputText3.focus()
                                                                            }
                                                                        })
                                                                    }else{
                                                                        this.setState({inputError4: false}, () => this.inputText5.focus())
                                                                    }
                                                                })
                                                            }}
                                                        />
                                                    </View>
                                                
                                                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                                        <TextInput 
                                                            ref={(ref) => {this.inputText5 = ref}}
                                                            onKeyPress={({nativeEvent}) =>{
                                                                if(nativeEvent.key === 'Backspace'){
                                                                    if(inputError6){
                                                                        this.inputText4.focus()
                                                                    }
                                                                }
                                                            }}
                                                            style={[{
                                                                width: Math.floor(getWidthnHeight(10).width), height: Math.floor(getWidthnHeight(10).width),
                                                                borderRadius: Math.floor(getWidthnHeight(1).width), textAlign: 'center', textAlignVertical: 'center',
                                                                borderColor: (focus5)? COLOR1 : (inputError5)? 'grey' : COLOR1, borderWidth: (focus5 || !inputError5)? 2 : 1, 
                                                                fontSize: (fontSizeH4().fontSize + 4), color: 'black'
                                                            }]}
                                                            maxLength={1}
                                                            keyboardType={'numeric'}
                                                            value={input5}
                                                            onFocus={() => this.setState({focus5: true}, () => {if(inputError1)this.inputText1.focus()})}
                                                            onBlur={() => this.setState({focus5: false})}
                                                            onChangeText={(input5) => {
                                                                this.setState({input5: input5.replace(/[^0-9]/g, '')}, () => {
                                                                    const {input5} = this.state;
                                                                    if(input5 === ''){
                                                                        this.setState({inputError5: true}, () => {
                                                                            if(inputError6){
                                                                                this.inputText4.focus()
                                                                            }
                                                                        })
                                                                    }else{
                                                                        this.setState({inputError5: false}, () => this.inputText6.focus())
                                                                    }
                                                                })
                                                            }}
                                                        />
                                                    </View>
                                                
                                                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                                        <TextInput 
                                                            ref={(ref) => {this.inputText6 = ref}}
                                                            onKeyPress={({nativeEvent}) =>{
                                                                if(nativeEvent.key === 'Backspace'){
                                                                    this.inputText5.focus();
                                                                }
                                                            }}
                                                            style={[{
                                                                width: Math.floor(getWidthnHeight(10).width), height: Math.floor(getWidthnHeight(10).width),
                                                                borderRadius: Math.floor(getWidthnHeight(1).width), textAlign: 'center', textAlignVertical: 'center',
                                                                borderColor: (focus6)? COLOR1 : (inputError6)? 'grey' : COLOR1, borderWidth: (focus6 || !inputError6)? 2 : 1, 
                                                                fontSize: (fontSizeH4().fontSize + 4), color: 'black'
                                                            }]}
                                                            maxLength={1}
                                                            keyboardType={'numeric'}
                                                            value={input6}
                                                            onFocus={() => this.setState({focus6: true}, () => {if(inputError1)this.inputText1.focus()})}
                                                            onBlur={() => this.setState({focus6: false})}
                                                            onChangeText={(input6) => {
                                                                this.setState({input6: input6.replace(/[^0-9]/g, '')}, () => {
                                                                    const {input6} = this.state;
                                                                    if(input6 === ''){
                                                                        this.setState({inputError6: true}, () => this.inputText5.focus())
                                                                    }else{
                                                                        this.setState({inputError6: false})
                                                                    }
                                                                })
                                                            }}
                                                        />
                                                    </View>
                                                </Animated.View>
                                                <View style={[getMarginTop(3), getWidthnHeight(35)]}>
                                                    <ChoppedButton 
                                                        onPress={() => {this.onSubmit()}}
                                                        leftBoxSize={{width: getWidthnHeight(6).width, height: getWidthnHeight(undefined, 6).height}}
                                                        middleBoxSize={{width: getWidthnHeight(25).width, height: getWidthnHeight(undefined, 6).height}}
                                                        rightBoxSize={{width: getWidthnHeight(6).width, height: getWidthnHeight(undefined, 6).height}}
                                                        title={'SUBMIT'}
                                                        titleStyle={[{color: '#FFFFFF', letterSpacing: 2}]}
                                                        buttonColor={"#039FFD"}
                                                        underLayColor={"#EA304F"}
                                                    />
                                                </View>
                                            </>
                                        }
                                        <View style={[{backgroundColor: 'rgba(196, 196, 196, 0.5)', height: 1}, getMarginVertical(3), getWidthnHeight(88)]}/>

                                        <View style={[{alignSelf: 'flex-start'}, getMarginBottom(2)]}>
                                            <Text style={[{color: COLOR1}, fontSizeH4(), getMarginLeft(3)]}>POINTS TO REMEMBER</Text>
                                            <Text style={[{color: 'black'}, fontSizeH4(), getMarginLeft(3), getMarginTop(2)]}>You should have :</Text>
                                        </View>
                                    </View>
                                </DismissKeyboard>
                                <View style={[{alignItems: 'center', borderColor: 'red', borderWidth: 0, flex: 1}, getMarginBottom(2), getWidthnHeight(93)]}>
                                    <FlatList 
                                        data={points}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({item, index}) => {
                                            return (
                                                <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', borderColor: 'black', borderWidth: 0}, getMarginBottom(2), getWidthnHeight(90)]}>
                                                    <LinearGradient 
                                                        start={{x: 0, y: 0.7}} end={{x: 0.6, y: 0}}
                                                        colors={[COLOR1, COLOR2]}
                                                        style={[{
                                                            alignItems: 'center', justifyContent: 'center', 
                                                            width: getWidthnHeight(3).width, height: getWidthnHeight(3).width,
                                                            borderRadius: getWidthnHeight(3).width
                                                    }]}/>
                                                    <View style={[{borderColor: 'green', borderWidth: 0}, getWidthnHeight(80)]}>
                                                        <Text style={[{lineHeight: 20}, fontSizeH4()]}>{item.title}</Text>
                                                    </View>
                                                </View>
                                            );
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View 
                    style={[{
                        backgroundColor: (loading)? 'rgba(0, 0, 0, 0.3)' : 'transparent', borderTopLeftRadius:0,
                        borderTopRightRadius: 0}, StyleSheet.absoluteFill
                    ]} 
                    pointerEvents={(loading)? 'auto' : 'none'}
                >
                    {(loading) && 
                        <Spinner loading={loading} style={[styles.loadingStyle, getWidthnHeight(50, 8)]} color='rgb(19,111,232)'/>
                    }
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    loadingStyle: {
        flexDirection:'row', 
        backgroundColor: '#EFEFEF',
        alignItems: 'center',
        justifyContent: 'center',
        //position: 'absolute', 
        borderRadius: 10,      
        shadowOffset:{width: 0,  height: 5},
        shadowColor: '#000000',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
        borderColor: 'red',
        borderWidth: 0
    },
})

export default WelcomePortal;