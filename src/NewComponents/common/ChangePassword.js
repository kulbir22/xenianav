import React, {Component} from 'react';
import {Keyboard, Text, View, StyleSheet,TouchableOpacity, FlatList, TouchableHighlight, Animated, Image, TouchableWithoutFeedback} from 'react-native';
//import {TouchableHighlight} from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import OctIcons from 'react-native-vector-icons/Octicons';
import moment from 'moment';
import {
    getMarginTop, getMarginLeft, getMarginRight, fontSize_H3, getWidthnHeight, fontSizeH4, 
    getMarginVertical, getMarginBottom, getMarginHorizontal, fontSizeH3
} from './width';
import {AnimatedTextInput} from './AnimatedTextInput';
import {BasicChoppedButton} from './ChoppedButton';
import {Spinner} from './Spinner';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { Platform } from 'react-native';

    class ChangePassword extends Component{
        constructor(props){
            super(props)
            this.state = {
                loading: false,
                modalHeight: new Animated.Value(0),
                empCode: '',
                otp: '',
                step: 1,
                newPass: '',
                newError: true,
                confirmNewPass: '',
                confirmError: true,
                showNewPass: false,
                showConfirmPass: false,
                minuteHand: '01',
                secondHand: '59'
            }
        }

        componentDidMount(){
            const {step} = this.state;
            const {startCount = () => {}, passStep = null} = this.props;
            if(passStep){
                this.setState({step: passStep}, () => {
                    const {step} = this.state;
                    if(step === 3){
                        this.expandModal();
                    }
                })
            }
        }

        expandModal(){
            const {modalHeight} = this.state;
            Animated.timing(modalHeight, {
                toValue: 1,
                duration: 1000
            }).start();
        }

        render(){
            const { loading, modalHeight, empCode, otp, step, newPass, newError, confirmNewPass, confirmError, showNewPass, showConfirmPass } = this.state;
            const { 
                isvisible = false, toggle = () => {}, colorTheme='#0B8EE8', updatePassStep = () => {}, minuteHand, secondHand,
                startCount = () => {}, clearCount = () => {}, reset = false
            } = this.props;
            const animateHeight = {
                width: getWidthnHeight(90).width,
                height: modalHeight.interpolate({
                    inputRange: [0, 1],
                    outputRange: [getWidthnHeight(undefined, 40).height, getWidthnHeight(undefined, 50).height]
                })
            }
            const message = `An OTP has been sent to the mobile number which is linked with Employee Code: ${empCode}`;
            let title = "FORGOT PASSWORD";
            let buttonText = "SUBMIT";
            if(step === 2){
                title = "OTP";
                buttonText = "VERIFY";
            }else if(step === 3){
                title = "RESET PASSWORD";
                buttonText = "RESET";
            }
            const minutes = `0${minuteHand}`;
            const seconds = (secondHand >= 10)? secondHand : `0${secondHand}`;
            return (
                <View>
                    <Modal 
                        isVisible={isvisible}
                        //onBackdropPress={toggle}
                    >    
                        <Animated.View style={[styles.container, animateHeight]}>
                            <View style={[{flexDirection:'row' ,borderTopLeftRadius:12, borderTopRightRadius:12, alignItems:'center', justifyContent: 'space-between', backgroundColor: colorTheme}, getWidthnHeight(90, 7)]}>
                                <Text style={[{fontSize: (fontSizeH4().fontSize + 5), color:'white', fontWeight:'600'}, getMarginLeft(5), styles.boldFont]}>{title}</Text>
                                <View style={[{borderRadius:30, marginTop:getMarginTop(-6).marginTop}, getMarginRight(5)]}>
                                    <TouchableOpacity 
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            if(step === 3){
                                                updatePassStep(null);
                                            }
                                            toggle();
                                        }}
                                        style={{
                                            width: getWidthnHeight(12).width, height: getWidthnHeight(12).width, borderRadius: getWidthnHeight(6).width,
                                            alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', borderColor: 'blue', borderWidth: 0
                                        }}
                                    >
                                        <View 
                                            style={{
                                                width: getWidthnHeight(8).width, height: getWidthnHeight(8).width, borderRadius: getWidthnHeight(4).width,
                                                alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', borderColor: 'red', borderWidth: 0
                                            }}
                                        >
                                            <IonIcons name="close" color={'#3180E5'} size={getWidthnHeight(6.5).width}/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{flex: 1, alignItems: 'center', borderWidth: 0, borderColor: 'red'}}>
                                <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-evenly', borderWidth: 0, borderColor: 'blue'}}>
                                    {(step === 1) &&
                                        <>
                                            <View style={[getMarginTop(-2)]}>
                                                <Image 
                                                    resizeMode='contain'
                                                    source={require('../../Image/forgotPass.png')}
                                                    style={[{transform: [{scale: 0.7}], borderWidth: 0, borderColor: 'black'}]}
                                                />
                                            </View>
                                            <View style={[{borderWidth: 0, borderColor: 'cyan'}, getMarginTop(-2)]}>
                                                <AnimatedTextInput 
                                                    placeholder=" Employee Code "
                                                    placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                    value={empCode}
                                                    maxLength={10}
                                                    slideVertical={[0, getWidthnHeight(undefined, -3.5).height]}
                                                    slideHorizontal={[0, getWidthnHeight(-3).width]}
                                                    placeholderScale={[1, 0.75]}
                                                    autoFocus={false}
                                                    onChangeText={(text) => {
                                                        this.setState({ empCode: text.trim() }, () => {
                                                            const {empCode} = this.state;
                                                            if(empCode === ''){
                                                                Keyboard.dismiss()
                                                            }
                                                        })
                                                    }}
                                                    clearText={() => this.setState({empCode: ''})}
                                                    containerColor={['#C4C4C4', '#C4C4C4']}
                                                    containerBorderWidth={[1, 1]}
                                                    containerStyle={[{
                                                        borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: 'solid',
                                                    }, getWidthnHeight(65, 7)]}
                                                    style={[{
                                                        borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 4),
                                                    }, getWidthnHeight(55, 7), getMarginHorizontal(1.5)]}
                                                />
                                            </View>
                                        </>
                                    }
                                    {(step === 2) &&
                                        <>
                                            <View style={[getWidthnHeight(80)]}>
                                                <Text style={[fontSizeH4()]}>{message}</Text>
                                            </View>
                                            <View style={[{borderWidth: 0, borderColor: 'cyan'}, getMarginTop(0)]}>
                                                <AnimatedTextInput 
                                                    placeholder=" Enter OTP "
                                                    placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                    value={otp}
                                                    keyboardType={'numeric'}
                                                    maxLength={6}
                                                    slideVertical={[0, getWidthnHeight(undefined, -3.5).height]}
                                                    slideHorizontal={[0, getWidthnHeight(-2).width]}
                                                    placeholderScale={[1, 0.75]}
                                                    onChangeText={(text) => {
                                                        this.setState({ otp: text.replace(/[^0-9]/g, '') }, () => {
                                                            const {otp} = this.state;
                                                            if(otp === ''){
                                                                Keyboard.dismiss();
                                                            }
                                                        })
                                                    }}
                                                    clearText={() => this.setState({otp: ''})}
                                                    containerColor={['#C4C4C4', '#C4C4C4']}
                                                    containerBorderWidth={[1, 1]}
                                                    containerStyle={[{
                                                        borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: 'solid',
                                                    }, getWidthnHeight(65, 7)]}
                                                    style={[{
                                                        borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 4),
                                                    }, getWidthnHeight(55, 7), getMarginHorizontal(1.5)]}
                                                />
                                            </View>
                                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                <View style={[getWidthnHeight(30)]}/>
                                                <TouchableOpacity 
                                                    style={[getWidthnHeight(30)]} 
                                                    activeOpacity={(reset)? 0.5 : 1} 
                                                    onPress={() => {
                                                        if(reset){
                                                            startCount();
                                                        }
                                                    }}
                                                >
                                                    <View style={[{borderColor: 'red', borderWidth: 0, alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(undefined, 4)]}>
                                                        <Text style={[{color: (reset)? colorTheme : 'grey'}, fontSizeH4()]}>Resend OTP </Text>
                                                    </View>
                                                </TouchableOpacity>
                                                <View style={[getWidthnHeight(30)]}>
                                                    {(!reset) &&
                                                        <Text style={[{color: 'tomato'}, fontSizeH4(), getMarginLeft(-4)]}>{`(${minutes}:${seconds})`}</Text> 
                                                    }
                                                </View>
                                            </View>
                                        </>
                                    }
                                    {(step === 3) &&
                                        <>
                                            <View style={[getMarginTop(-2)]}>
                                                <Image 
                                                    resizeMode='contain'
                                                    source={require('../../Image/Reset.png')}
                                                    style={[{transform: [{scale: 0.7}], borderWidth: 0, borderColor: 'black'}]}
                                                />
                                            </View>
                                            <View style={[{flexDirection: 'row', borderWidth: 0, borderColor: 'cyan', alignItems: 'center'}, getMarginTop(0)]}>
                                                <AnimatedTextInput 
                                                    placeholder=" New Password "
                                                    placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                    value={newPass}
                                                    secureTextEntry={(showNewPass)? false : true}
                                                    slideVertical={[0, getWidthnHeight(undefined, -3.5).height]}
                                                    slideHorizontal={[0, getWidthnHeight(-2).width]}
                                                    placeholderScale={[1, 0.75]}
                                                    autoFocus={false}
                                                    onChangeText={(text) => {
                                                        this.setState({ newPass: text.trim() }, () => {
                                                            const {newPass, newError} = this.state;
                                                            if(newPass === ''){
                                                                this.setState({
                                                                    newError: true, confirmNewPass: '', confirmError: true
                                                                }, () => Keyboard.dismiss());
                                                            }else if(newPass.length >= 6){
                                                                this.setState({newError: false})
                                                            }else if(newPass.length > 0 && newPass.length < 6){
                                                                this.setState({newError: true})
                                                            }
                                                            if(newPass !== confirmNewPass){
                                                                this.setState({confirmError: true});
                                                            }
                                                            if(!newError && (newPass === confirmNewPass)){
                                                                this.setState({confirmError: false});
                                                            }
                                                        })
                                                    }}
                                                    clearText={() => this.setState({newPass: '', newError: true})}
                                                    containerColor={['#C4C4C4', '#C4C4C4']}
                                                    containerBorderWidth={[1, 1]}
                                                    containerStyle={[{
                                                        borderTopLeftRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: 'solid',
                                                        borderRightWidth: 0, borderBottomLeftRadius: getWidthnHeight(1).width
                                                    }, getWidthnHeight(55, 7)]}
                                                    style={[{
                                                        borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 4),
                                                        color: (newError)? 'red' : 'black'
                                                    }, getWidthnHeight(50, 7), getMarginHorizontal(1.5)]}
                                                />
                                                <View style={[{
                                                    borderTopWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#C4C4C4',
                                                    borderTopRightRadius: getWidthnHeight(1).width, borderBottomRightRadius: getWidthnHeight(1).width,
                                                    alignItems: 'center', justifyContent: 'center'
                                                }, getWidthnHeight(12, 7)]}>
                                                    {(showNewPass)?
                                                        <TouchableOpacity 
                                                            style={[{
                                                                flex: 1, borderWidth: 0, borderColor: 'red', alignItems: 'center', justifyContent: 'center'}
                                                            ]}
                                                            onPress={() => this.setState({showNewPass: false}, () => Keyboard.dismiss())}>
                                                            <OctIcons name='eye' size={getWidthnHeight(7).width}/>
                                                        </TouchableOpacity>
                                                    :
                                                        <TouchableOpacity 
                                                            style={[{
                                                                flex: 1, borderWidth: 0, borderColor: 'red', alignItems: 'center', justifyContent: 'center'}
                                                            ]} 
                                                            onPress={() => this.setState({showNewPass: true}, () => Keyboard.dismiss())}>
                                                            <OctIcons name='eye-closed' size={getWidthnHeight(7).width}/>
                                                        </TouchableOpacity>
                                                    }
                                                </View>
                                            </View>
                                            <View style={[{borderWidth: 0, borderColor: 'cyan', flexDirection: 'row', alignItems: 'center'}, getMarginTop(0)]}>
                                                <AnimatedTextInput 
                                                    placeholder=" Confirm New Password "
                                                    placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                    value={confirmNewPass}
                                                    secureTextEntry={(showConfirmPass)? false : true}
                                                    editable={(newError)? false : true}
                                                    slideVertical={[0, getWidthnHeight(undefined, -3.5).height]}
                                                    slideHorizontal={[0, getWidthnHeight(-3.5).width]}
                                                    placeholderScale={[1, 0.75]}
                                                    autoFocus={false}
                                                    onChangeText={(text) => {
                                                        this.setState({ confirmNewPass: text.trim() }, () => {
                                                            const {confirmNewPass} = this.state;
                                                            if(confirmNewPass === ''){
                                                                this.setState({confirmError: true}, () => Keyboard.dismiss());
                                                            }else if(newPass === confirmNewPass){
                                                                this.setState({confirmError: false});
                                                            }else if(newPass !== confirmNewPass){
                                                                this.setState({confirmError: true});
                                                            }
                                                        })
                                                    }}
                                                    clearText={() => this.setState({confirmNewPass: ''})}
                                                    containerColor={['#C4C4C4', '#C4C4C4']}
                                                    containerBorderWidth={[1, 1]}
                                                    containerStyle={[{
                                                        borderTopLeftRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: 'solid',
                                                        borderRightWidth: 0, borderBottomLeftRadius: getWidthnHeight(1).width
                                                    }, getWidthnHeight(55, 7)]}
                                                    style={[{
                                                        borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 4),
                                                        color: (confirmError)? 'red' : 'black'
                                                    }, getWidthnHeight(50, 7), getMarginHorizontal(1.5)]}
                                                />
                                                <View style={[{
                                                    borderTopWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#C4C4C4',
                                                    borderTopRightRadius: getWidthnHeight(1).width, borderBottomRightRadius: getWidthnHeight(1).width,
                                                    alignItems: 'center', justifyContent: 'center'
                                                }, getWidthnHeight(12, 7)]}>
                                                    {(showConfirmPass)?
                                                        <TouchableOpacity 
                                                            style={[{
                                                                flex: 1, borderWidth: 0, borderColor: 'red', alignItems: 'center', justifyContent: 'center'}
                                                            ]}
                                                            onPress={() => this.setState({showConfirmPass: false})}>
                                                            <OctIcons name='eye' size={getWidthnHeight(7).width}/>
                                                        </TouchableOpacity>
                                                    :
                                                        <TouchableOpacity 
                                                            style={[{
                                                                flex: 1, borderWidth: 0, borderColor: 'red', alignItems: 'center', justifyContent: 'center'}
                                                            ]} 
                                                            onPress={() => this.setState({showConfirmPass: true})}>
                                                            <OctIcons name='eye-closed' size={getWidthnHeight(7).width}/>
                                                        </TouchableOpacity>
                                                    }
                                                </View>
                                            </View>
                                        </>
                                    }
                                    <View style={{borderWidth: 0, borderColor: 'green'}}>
                                        <BasicChoppedButton
                                            onPress={() => {
                                                const {step, empCode, otp} = this.state;
                                                if(step === 1){
                                                    if(empCode){
                                                        this.setState({step: 2}, () => {
                                                            startCount();
                                                            updatePassStep(this.state.step);
                                                        });
                                                    }else{
                                                        alert("Please enter valid Employee Code.")
                                                    }
                                                }else if(step === 2){
                                                    if(otp.length === 6){
                                                        this.setState({step: 3, empCode: '', otp: ''}, () => {
                                                            this.expandModal();
                                                            updatePassStep(this.state.step);
                                                        });
                                                    }else{
                                                        //clearCount();
                                                        alert("Please enter 6-digit OTP.")
                                                    }
                                                }else if(step === 3){
                                                    updatePassStep(null);
                                                    toggle();
                                                }
                                            }}
                                            leftBoxSize={{width: getWidthnHeight(6).width, height: getWidthnHeight(undefined, 5.5).height}}
                                            middleBoxSize={{width: getWidthnHeight(20).width, height: getWidthnHeight(undefined, 5.5).height}}
                                            rightBoxSize={{width: getWidthnHeight(6).width, height: getWidthnHeight(undefined, 5.5).height}}
                                            title={buttonText}
                                            titleStyle={[{color: '#FFFFFF'}]}
                                            buttonColor={colorTheme}
                                        />
                                    </View>
                                </View>
                                <View 
                                    style={[{backgroundColor: (loading)? 'rgba(0, 0, 0, 0.5)' : 'transparent', borderTopLeftRadius:0,
                                    borderTopRightRadius: 0}, StyleSheet.absoluteFill]} 
                                    pointerEvents={(loading)? 'auto' : 'none'}
                                >
                                    {(loading) ?
                                        <Spinner loading={loading} style={[styles.loadingStyle, getWidthnHeight(45, 10)]} color='rgb(19,111,232)'/>
                                    : null}
                                </View>
                            </View>
                        </Animated.View>
                    </Modal>
                </View>
            );
        }
    }

    const styles = StyleSheet.create({
        container:{
            backgroundColor: '#FFFFFF',
            borderWidth:0,
            borderColor: '#C4C4C4',
            alignItems:'center',
            borderRadius:12
        },
        boldFont: {
            ...Platform.select({
            android: {
                fontFamily: ''
            }
            })
        },
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
    });
  
export {ChangePassword};