import React, {Component} from 'react';
import {
    View, Text, ImageBackground, Animated, Keyboard, ScrollView, StatusBar, BackHandler, SafeAreaView,
    FlatList, Alert, Platform, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import DocumentPicker from 'react-native-document-picker'
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import {
    getWidthnHeight, IOS_StatusBar, getMarginTop, fontSizeH4, fontSizeH3, AnimatedTextInput, getMarginHorizontal,
    DismissKeyboard, GradientIcon, ChoppedButton, getMarginVertical, getMarginLeft, getMarginBottom, GradientText,
    SearchableDropDown, AnimateDateLabel, Slider, getMarginRight, CheckList, LanguageSelection, ScreensModal, fontSizeH2,
    BasicChoppedButton, MaskedGradientText, stateList, cities, Spinner, RadioEnable, RadioDisable
} from '../NewComponents/common';
import {fetchBaseURL, savedToken} from '../api/BaseURL';

const COLOR1 = "#039FFD";
const COLOR2 = "#EA304F";
const colorTitle = '#0B8EE8';

class PFDeclaration extends Component{
    constructor(props){
        super(props)
        this.state = {
            submit: false,
            baseURL: null,
            loading: false, 
            showScreensList: false,
            screens: [],
            iAgree: false,
            currentDate: function(){
                let date = moment().date();
                date = (date < 10)? `0${date}` : date;
                let month = (moment().month() + 1);
                month = (month < 10)? `0${month}` : month;
                return `${date}-${month}-${moment().year()}`;
            }
        };
    }

    componentDidMount(){
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.handleBackButton())
        fetchBaseURL().then((baseURL) => {
            const apiData = JSON.parse(this.props.route.params.apiData);
            this.setState({
                baseURL, screens: apiData.sectionData.links.pageLinks
            }, () => {})
        })
    }

    handleBackButton = () => {
        //ToastAndroid.show('Not Allowed', ToastAndroid.SHORT)
        if(this.props.route.name === "PFDeclaration"){
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

    onSubmit(){
        const {iAgree} = this.state;
        if(iAgree){
            this.callAPI();
        }else{
            alert("Please tick the highlighted box to agree to the Declaration Form.")
        }
    }

    async callAPI(){
        this.showLoader();
        const {baseURL, iAgree} = this.state;
        const apiData = JSON.parse(this.props.route.params.apiData);
        const secretToken = await AsyncStorage.getItem('onboardingToken');
        let sendData = new FormData();
        sendData.append('id', apiData.draftId);
        sendData.append('page', apiData.currentPage);
        sendData.append('project_id', apiData.projectId);
        sendData.append('submit_type', "process");
        sendData.append('epf_declaration[agree_for_t_and_c]', iAgree);
        sendData.append('epf_declaration[date]', moment(this.state.currentDate(), "DD-MM-YYYY").format("YYYY-MM-DD"));
        axios.post(`${baseURL}/onboarding/submit-onboarding`,
        sendData,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${secretToken}`
            }
        }).then((response) => {
            this.hideLoader();
            const parsedData = response.data;
            console.log("### @@@ ^^^ SUCCESS ACHIEVED: ", parsedData);
            if(parsedData.status === 1){
                alert(parsedData.message);
                this.props.navigation.navigate('OtherDetails', {apiData: JSON.stringify(parsedData)});
            }else if(parsedData.status === 0){
                Alert.alert(parsedData.message, `${parsedData.errors}`);
            }
        }).catch((error) => {
            this.hideLoader();
            //console.log("%%% ERROR: ", error)
            if(error.response){
                const status = error.response.status;
                //console.log("%%% ERROR2: ", error.response)
                Alert.alert("ERROR", `Error Code: ${status}611`);
            }else{
                alert(`${error}, API CODE: 611`)
            }
        })
    }

    dismissKeyboard(){
        Keyboard.dismiss();
    }

    showLoader(){
        this.setState({loading: true})
    }

    hideLoader(){
        this.setState({loading: false})
    }

    render(){
        const {
            loading, baseURL, screens, showScreensList, iAgree, submit
        } = this.state;
        const apiData = JSON.parse(this.props.route.params.apiData);
        const signature = apiData.sectionData.dropdown.signature;
        const address = apiData.sectionData.dropdown.permanent_address;
        //console.log("SIGNATURE: ", signature)
        return (
            <SafeAreaView style={[{alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: '#F6F6F6', flex: 1}]}>
                <StatusBar hidden={false} barStyle="dark-content" />
                <View style={{flex: 1, ...Platform.select({android: getMarginVertical(2)})}}>
                    <View style={[{alignItems: 'center', flex: 1}, getWidthnHeight(100)]}>
                        <KeyboardAvoidingView style={{alignItems: 'center'}} behavior={(Platform.OS === 'ios')? "padding" : null} keyboardVerticalOffset={(Platform.OS === 'ios')? getMarginTop(6).marginTop : null}>
                            <View style={[{
                                alignItems: 'center', backgroundColor: 'white', shadowOpacity: 0.4, shadowColor: '#000000', shadowRadius: 2, elevation: 2, 
                                shadowOffset: {width: 0, height: 0}, borderColor: 'purple', borderWidth: 0, flex: 1}, 
                                getWidthnHeight(93)]}>
                                <DismissKeyboard>
                                    <View style={[{alignItems: 'center'}, getMarginTop(1)]}>
                                        <MaskedGradientText
                                            title={"PF Declaration Form"}
                                            titleStyle={[{fontWeight: '600', color: '#000000', fontSize: (fontSizeH3().fontSize), textDecorationLine: 'underline'}]}
                                            start={{x: 0, y: 0}}
                                            end={{x: 0.7, y: 0}}
                                            colors={["#039FFD", "#EA304F"]}
                                        />
                                        <Text style={[{fontSize: (fontSizeH4().fontSize), fontWeight: 'bold', textAlign: 'center'}, styles.boldFont, getMarginTop(1), getMarginHorizontal(3)]}>
                                            {`DECLARATION & CONFIRMATION FOR NOT HOLDING ANY PREVIOUS EPF ACCOUNT`}
                                        </Text>
                                    </View>
                                </DismissKeyboard>
                                <View style={{flex: 1, borderWidth: 0, borderColor: 'red'}}>
                                    <View style={[{
                                        alignItems: 'center', backgroundColor: 'transparent', borderColor: 'cyan',
                                        borderWidth: 0, flex: 1}, getMarginBottom(0)]}> 
                                        <ScrollView 
                                            showsVerticalScrollIndicator={false} 
                                            keyboardShouldPersistTaps="handled" 
                                            style={[{flex: 1, borderWidth: 0, borderColor: 'blue'}, getMarginTop(2), getMarginBottom(1), getWidthnHeight(93)]}
                                        >
                                            <View style={[{flex: 1, alignItems: 'center'}]}>
                                                <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}, getWidthnHeight(87), getMarginTop(2)]}>
                                                    {(iAgree)?
                                                        <TouchableOpacity activeOpacity={0.7} onPress={() => this.setState({iAgree: !this.state.iAgree})}>
                                                            <MaterialCommunityIcons name="checkbox-marked" size={getWidthnHeight(7).width} color={colorTitle}/>
                                                        </TouchableOpacity>
                                                    :
                                                        <TouchableOpacity activeOpacity={0.7} onPress={() => this.setState({iAgree: !this.state.iAgree})}>
                                                            <MaterialCommunityIcons 
                                                                name='checkbox-blank' 
                                                                color={(submit && !iAgree)? 'red' : 'rgba(146, 146, 146, 0.6)'} 
                                                                size={getWidthnHeight(7).width}
                                                            />
                                                        </TouchableOpacity>
                                                    }
                                                    <Text style={[{paddingLeft: getWidthnHeight(2).width}, fontSizeH4()]}>I hereby declare that:</Text>
                                                </View>
                                                <View style={[{alignItems: 'center'}, getMarginTop(2), getMarginHorizontal(3)]}>
                                                    <Text style={[{textAlign: 'justify'}, fontSizeH4()]}>
                                                        {`1. I have applied through XEAM online portal only.\n\n`}
                                                        {`2. I got this opportunity to work on the project purely on the basis of merit.\n\n`}
                                                        {`3. No one from XEAM Ventures has contacted me for any obligation/bribe/money in lieu of job placement.\n\n`}
                                                        {`4. I have not paid to anyone from XEAM Ventures (except a refundable security if any)\n\n`}
                                                        {`5. I clearly understand that XEAM Ventures has a zero tolerance policy for any obligation in lieu of Job and no one from XEAM Ventures accepts anything in cash or kind for job placements.\n\n`}
                                                        {`6. I hereby assure that if in future anyone from XEAM Ventures contacts me on any of the above points, I will immediately inform XEAM Ventures on xeam@xeamventures.com and hr@xeamventures.com\n`}
                                                    </Text>
                                                    <Text style={[{textAlign: 'justify'}, fontSizeH4()]}>
                                                        
                                                    </Text>
                                                </View>
                                                <View style={[{alignItems: 'center', borderColor: colorTitle, borderWidth: 2}, getMarginTop(0)]}>
                                                    <Image 
                                                        source={{uri: signature}}
                                                        resizeMode="contain"
                                                        style={[getWidthnHeight(40, 10)]}
                                                    />
                                                </View>
                                                <Text style={[{fontStyle: 'italic'}, fontSizeH4(), getMarginVertical(1)]}>Signature of Employee</Text>
                                                {/* <View style={[{flexDirection: 'row'}, getMarginTop(2), getWidthnHeight(83)]}>
                                                    <Text style={[{fontWeight: 'bold', fontSize: (fontSizeH4().fontSize + 2)}, styles.boldFont]}>Date:</Text>
                                                    <Text style={[{fontSize: (fontSizeH4().fontSize + 2)}, getMarginLeft(2)]}>{this.state.currentDate()}</Text>
                                                </View>
                                                <View style={[{flexDirection: 'row'}, getMarginTop(2), getWidthnHeight(83)]}>
                                                    <Text style={[{fontWeight: 'bold', fontSize: (fontSizeH4().fontSize + 2)}, styles.boldFont]}>Address:</Text>
                                                    <View style={{flex: 1}}>
                                                        <Text style={[{fontSize: (fontSizeH4().fontSize + 2)}, getMarginLeft(2)]}>{address.line1}</Text>
                                                        <Text style={[{fontSize: (fontSizeH4().fontSize + 2)}, getMarginLeft(2)]}>{address.line2}</Text>
                                                    </View>
                                                </View> */}
                                            </View>
                                        </ScrollView>
                                        <View style={[{backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}, getMarginBottom(1), getWidthnHeight(93)]}>
                                            <View style={[getWidthnHeight(34)]}/>
                                            <View style={[{borderWidth: 0, borderColor: 'red'}, getWidthnHeight(32)]}>
                                                <ChoppedButton 
                                                    onPress={() => {this.setState({submit: true}, () => this.onSubmit())}}
                                                    leftBoxSize={{width: getWidthnHeight(6).width, height: getWidthnHeight(undefined, 6).height}}
                                                    middleBoxSize={{width: getWidthnHeight(20).width, height: getWidthnHeight(undefined, 6).height}}
                                                    rightBoxSize={{width: getWidthnHeight(6).width, height: getWidthnHeight(undefined, 6).height}}
                                                    title={'SUBMIT'}
                                                    titleStyle={[{color: '#FFFFFF', letterSpacing: 2}]}
                                                    buttonColor={"#039FFD"}
                                                    underLayColor={"#EA304F"}
                                                />
                                            </View>
                                            <View style={[{alignItems: 'center', justifyContent: 'center', borderWidth: 0, borderColor: 'red'}, getWidthnHeight(34)]}>
                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    style={[{
                                                        alignItems: 'center', justifyContent: 'center', width: getWidthnHeight(12).width, height: getWidthnHeight(12).width,
                                                        borderRadius: getWidthnHeight(6).width, backgroundColor: '#FFFFFF', shadowColor: '#000000', shadowOpacity: 0.5,
                                                        shadowRadius: 2, elevation: 2, borderColor: 'rgba(196, 196, 196, 0.5)', borderWidth: 0.4, shadowOffset: {width: 0, height: 0}
                                                    }]}
                                                    onPress={() => this.setState({showScreensList: true}, () => {
                                                        Keyboard.dismiss();
                                                    })}
                                                >
                                                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                                        <GradientIcon
                                                            start={{x: 0, y: 0}}
                                                            end={{x: 0, y: 0.8}}
                                                            containerStyle={[{borderWidth: 0, borderColor: 'red', alignItems: 'center'}, getWidthnHeight(8)]}
                                                            icon={<MaterialCommunityIcons name={'file-eye'} style={{backgroundColor: 'transparent'}} size={getWidthnHeight(8).width}/>}
                                                            //colors={["#CF0000", "#FF2442"]}
                                                        />
                                                    </View>
                                                </TouchableOpacity>
                                                {(showScreensList) && (
                                                    <ScreensModal 
                                                        isVisible={showScreensList}
                                                        checkBoxColor={COLOR1}
                                                        underLayColor={'#E1F2F9'}
                                                        toggle={() => this.setState({showScreensList: false}, () => Keyboard.dismiss())}
                                                        data={screens}
                                                        apiData={apiData}
                                                        baseURL={baseURL}
                                                        navigation={this.props.navigation}
                                                        route={this.props.route}
                                                    />
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
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

export default PFDeclaration;