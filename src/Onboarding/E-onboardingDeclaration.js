import React, {Component} from 'react';
import {
    View, Text, ImageBackground, Animated, Keyboard, ScrollView,  TextInput, TouchableHighlight,
    FlatList, Alert, Platform, StyleSheet, KeyboardAvoidingView, TouchableOpacity,
    BackHandler, Image, Linking, SafeAreaView, StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import RNBackgroundDownloader from 'react-native-background-downloader';
import WebView from 'react-native-webview';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS, { exists } from 'react-native-fs';
import LinearGradient from 'react-native-linear-gradient';
import DocumentPicker from 'react-native-document-picker';
import { Dropdown } from 'react-native-material-dropdown';
import ImagePicker from 'react-native-image-crop-picker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Delete from 'react-native-vector-icons/Ionicons';
import {fetchBaseURL} from '../api/BaseURL';
import {
    getWidthnHeight, IOS_StatusBar, getMarginTop, fontSizeH4, fontSizeH3, AnimatedTextInput, getMarginHorizontal,
    DismissKeyboard, OTPInput, ChoppedButton, getMarginVertical, getMarginLeft, getMarginBottom, MaskedGradientText,
    SearchableDropDown, Slider, getMarginRight, CheckList, Attachments, ScreensModal, Spinner,
    DownloadModal, fontSizeH2, GradientIcon
} from '../NewComponents/common';

const COLOR1 = "#039FFD";
const COLOR2 = "#EA304F";
const colorTitle = "#0B8EE8";

class OnboardingDeclaration extends Component{
    constructor(props){
        super(props)
        this.state = {
            submit: false,
            baseURL: null,
            secretToken: null,
            downloadModal: false,
            percent: 0,
            fullFileName: '',
            checkFile: false,
            fileSize: null,
            downloadFileName: '',
            downloadLink: function(){
                console.log("^^^^^ PROPS: ", JSON.stringify(props?.route, null, 4));
                const apiData = JSON.parse(props?.route?.params?.apiData);
                const downloadPath = `${apiData?.url}${apiData?.projectName?.toLowerCase()}/${apiData?.draftId}`;
                return downloadPath;
            }
        };
    }

    componentDidMount(){
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.handleBackButton());
        AsyncStorage.getItem('onboardingToken').then((secretToken) => {
            this.setState({secretToken})
        });
        fetchBaseURL().then((baseURL) => {
            this.setState({baseURL}, () => {})
        })
        Alert.alert("Alert", `Click "VIEW" to open PDF in your web browser.`, 
            [
                {
                    text: 'Cancel'
                },
                {
                    text: 'View',
                    onPress: () => {
                        Linking.openURL(this.state.downloadLink());
                    }
                }
            ]
        );
    }

    handleBackButton = () => {
        //ToastAndroid.show('Not Allowed', ToastAndroid.SHORT)
        if(this.props.route.name === "OtherDetails"){
            Alert.alert("Alert", "Are you sure you want to exit onboarding ?", [
                {text: 'YES', onPress: () => Actions.auth()},
                {text: 'Cancel', onPress: () => null}
            ]);
            return true;
        }else{
            return false;
        }
    }

    componentWillUnmount(){
        this.backHandler.remove();
    }

    showLoader(){
        this.setState({loading: true})
    }

    hideLoader(){
        this.setState({loading: false})
    }

    dismissKeyboard(){
        Keyboard.dismiss();
    }

    render(){
        const {
            submit, loading, downloadModal, fullFileName, percent
        } = this.state;
        return (
            <SafeAreaView style={[{alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: '#F6F6F6', flex: 1}]}>
                <StatusBar hidden={false} barStyle="dark-content" />
                <View style={[{flex: 1}]}>
                    <View style={[{alignItems: 'center', flex: 1}]}>
                        <DismissKeyboard>
                            <View style={[{alignItems: 'center'}, getMarginTop((Platform.OS === "android")? 2 : 0.5)]}>
                                <View 
                                    style={[{
                                        alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', shadowOpacity: 0.4, shadowColor: '#000000', 
                                        shadowRadius: 2, elevation: 5, borderColor: 'red', borderWidth: 0, shadowOffset: {width: 0, height: 0}
                                    }, getWidthnHeight(93)]}
                                >
                                    <LinearGradient 
                                        start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                        colors={['rgba(3, 159, 253, 0.4)', 'rgba(234, 48, 79, 0.4)']}
                                        style={[{alignItems: 'center', justifyContent: 'center', width: '100%'}]}>
                                        <ImageBackground 
                                            resizeMode="cover"
                                            source={require('../Image/PeopleBG.png')} 
                                            style={[{
                                                position: 'absolute', opacity: 0.5, width: '100%', height: '100%'}
                                        ]}/>
                                        <View style={[{alignItems: 'center', justifyContent: 'center'}, getMarginVertical(1)]}>
                                            <Image 
                                                source={require('../Image/512logo.png')} 
                                                resizeMode='contain'
                                                style={[getWidthnHeight(40, 10)]}
                                            />
                                            <View style={[getMarginTop(1)]}>
                                                <MaskedGradientText
                                                    title={"E-Onboarding Declaration"}
                                                    titleStyle={[{fontWeight: 'normal', color: '#000000', fontSize: (fontSizeH3().fontSize - 5)}, styles.boldFont]}
                                                    start={{x: 0, y: 0}}
                                                    end={{x: 0.7, y: 0}}
                                                    colors={["#000000", "#000000"]}
                                                />
                                            </View>
                                        </View> 
                                    </LinearGradient>
                                </View>
                            </View>
                        </DismissKeyboard>
                        <View style={[{
                            alignItems: 'center', backgroundColor: 'white', shadowOpacity: 0.4, shadowColor: '#000000', shadowRadius: 2, elevation: 3, borderColor: 'red',
                            borderWidth: 0, shadowOffset: {width: 0, height: 0}, flex: 1, ...Platform.select({android: getMarginVertical(2), ios: getMarginTop(2)})}, getWidthnHeight(93)]}> 
                            <View style={[{flex: 1, alignItems: 'center'}, getMarginVertical(2), getMarginHorizontal(5)]}>
                                <Text style={[{textAlign: 'justify', fontSize: (fontSizeH4().fontSize + 3)}]}>If you do not see the pop up message, Click the icon below to download the E-Declaration form. Take a print out of this declaration, sign it and send it to below mentioned address by post / courier.</Text>
                                <View style={[getMarginTop(5)]}>
                                    <Text style={[{fontSize: (fontSizeH4().fontSize + 3), fontWeight: 'bold'}, styles.boldFont, getMarginBottom(1)]}>Address: </Text>
                                    <Text numberOfLines={4} style={[{textAlign: 'justify', fontSize: (fontSizeH4().fontSize + 3)}]}>XEAM Tower, E-202, Sector 74 A, Industrial Area, Sector 74, Sahibzada Ajit Singh Nagar, Punjab 160055.</Text>
                                </View>
                                <View style={[{alignItems: 'center'}, getMarginTop(5)]}>
                                    <TouchableOpacity 
                                        style={{alignItems: 'center'}}
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            Linking.openURL(this.state.downloadLink());
                                        }}
                                    >
                                        <GradientIcon
                                            start={{x: 0.3, y: 0}}
                                            end={{x: 0.7, y: 0}}
                                            containerStyle={[{borderWidth: 0, borderColor: 'red', alignItems: 'center'}, getWidthnHeight(20)]}
                                            icon={<FontAwesome5 name={'file-pdf'} style={{backgroundColor: 'transparent'}} size={getWidthnHeight(20).width}/>}
                                            colors={["#DA1212", "#F23A3A"]}
                                        />
                                        <Text style={[{fontWeight: 'bold', fontSize: (fontSizeH4().fontSize + 3)}, styles.boldFont]}>Open PDF</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {(downloadModal) &&
                                <DownloadModal 
                                    visible={downloadModal}
                                    fileName={fullFileName}
                                    percent={percent}
                                    onBackdropPress={() => this.setState({downloadModal: false})}
                                />
                            }
                        </View>
                    </View>
                    <View 
                        style={[{
                            backgroundColor: (loading)? 'rgba(0, 0, 0, 0.3)' : 'transparent', borderTopLeftRadius:0,
                            borderTopRightRadius: 0, borderColor: 'yellow', borderWidth: 0}, StyleSheet.absoluteFill
                        ]} 
                        pointerEvents={(loading)? 'auto' : 'none'}
                    >
                        {(loading) && 
                            <Spinner loading={loading} style={[styles.loadingStyle, getWidthnHeight(50, 8), getMarginTop(5)]} color='rgb(19,111,232)'/>
                        }
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    boldFont: {
        ...Platform.select(
            {
                android: {
                    fontFamily: ''
                }
            }
        )
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
    }
})

export default OnboardingDeclaration;