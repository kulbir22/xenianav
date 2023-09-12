import React, {Component} from 'react';
import {
    View, Text, StatusBar, Animated, Keyboard, ScrollView,  TextInput, BackHandler, SafeAreaView,
    FlatList, Alert, Platform, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import DocumentPicker from 'react-native-document-picker'
import moment from 'moment';
import { Dropdown } from 'react-native-element-dropdown';
import AntdesignIcons from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Down from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Delete from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {
    getWidthnHeight, IOS_StatusBar, getMarginTop, fontSizeH4, fontSizeH3, AnimatedTextInput, getMarginHorizontal,
    DismissKeyboard, GradientIcon, ChoppedButton, getMarginVertical, getMarginLeft, getMarginBottom, GradientText,
    SearchableDropDown, AnimateDateLabel, Slider, getMarginRight, CheckList, LanguageSelection, ScreensModal, fontSizeH2,
    BasicChoppedButton, MaskedGradientText, stateList, cities, Spinner, RadioEnable, RadioDisable, DateTimePicker
} from '../NewComponents/common';
import {fetchBaseURL, savedToken} from '../api/BaseURL';

const COLOR1 = "#039FFD";
const COLOR2 = "#EA304F";
const colorTitle = '#0B8EE8';
const experience = 'experience';
const scannedDD = 'scannedDD';
const aadharCard = 'aadhar';

class PFForm extends Component{
    constructor(props){
        super(props)
        let year = `${moment().year()}`;
        let month = `${moment().month() + 1}`;
        month = (month < 10)? `0${month}` : month;
        let initialDate = '1';
        initialDate = (initialDate < 10)? `0${initialDate}` : initialDate;
        let currentDate = `${year}-${month}-${initialDate}`;
        console.log("!!@@@ DATE: ", currentDate)
        // currentDate = moment(currentDate, "YYYY-MM-DD").subtract(1, 'month').format("YYYY-MM-DD");
        const fromStartDate = moment(currentDate, "YYYY-MM-DD").subtract(50, 'years').format("YYYY-MM-DD");
        const currentTime = "12:00 AM";
        const currentDateTime = `${currentDate} ${currentTime}`;
        let fromMinUtc = moment(currentDate, "YYYY-MM-DD").subtract(25, 'years').format("YYYY-MM-DD");
        // let toMaxUtc = moment(currentDate, "YYYY-MM-DD").add(25, 'years').format("YYYY-MM-DD");
        fromMinUtc = moment(`${fromMinUtc} 12:00 AM`, "YYYY-MM-DD hh:mm A").utc().toDate();
        // toMaxUtc = moment(`${toMaxUtc} 12:00 AM`, "YYYY-MM-DD hh:mm A").utc().toDate();
        const utcTimeStamp = moment(currentDateTime, "YYYY-MM-DD hh:mm A").utc().toDate();
        const fromUtcTime = moment(`${fromStartDate} 12:00 AM`, "YYYY-MM-DD hh:mm A").utc().toDate();
        this.state = {
            submit: false,
            baseURL: null,
            loading: false, 
            showScreensList: false,
            screens: [],
            selectName: null,
            selectEPF: 2,
            selectEPS: 2,
            uan: '',
            uanError: true,
            pfAccount: '',
            pfAccountError: true,
            dateExit: '',
            dateExitError: true,
            dETimeStamp: moment().valueOf(),
            dEMinDate: fromUtcTime,
            showDEPicker: false,
            certificateNo: '',
            certificateNoError: true,
            paymentOrder: '',
            paymentOrderError: true,
            sliderState: false,
            countryID: '',
            countryName: '',
            countryError: true,
            passportNumber: '',
            passportNumberError: true,
            validFrom: '',
            validFromError: true,
            validFromTimeStamp: moment().valueOf(),
            validFromTime: '12:00 AM',
            validfromMinDate: fromMinUtc,
            showFromDatePicker: false,
            validTo: '',
            validToError: true,
            validToTimeStamp: moment().valueOf(),
            validToTime: '11:59 PM',
            validToMinDate: fromMinUtc,
            showToDatePicker: false,
            place: '',
            placeError: true,
            currentDate: function(){
                let date = moment().date();
                date = (date < 10)? `0${date}` : date;
                let month = (moment().month() + 1);
                month = (month < 10)? `0${month}` : month;
                return `${moment().year()}-${month}-${date}`;
            }
        };
    }

    componentDidMount(){
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.handleBackButton())
        fetchBaseURL().then((baseURL) => {
            const apiData = JSON.parse(this.props.route.params.apiData);
            this.setState({baseURL, screens: apiData.sectionData.links.pageLinks}, () => {})
            if(apiData.sectionData.oldData){
                if(apiData.sectionData.oldData.hasOwnProperty('epf')){
                    const oldEPFData = apiData.sectionData.oldData.epf;
                    if(oldEPFData.father_or_spouse_name === "spouse"){
                        this.setState({selectName: 2})
                    }else{
                        this.setState({selectName: 1})
                    }
                    if(oldEPFData.member_of_epf === "Yes"){
                        this.setState({selectEPS: 1})
                    }
                    if(oldEPFData.member_of_eps === "Yes"){
                        this.setState({selectEPS: 1})
                    }
                    if(oldEPFData.member_of_epf === "Yes" || oldEPFData.member_of_eps === "Yes"){
                        this.setState({
                            uan: oldEPFData.uan_number, uanError: false, pfAccount: oldEPFData.pf_account_number, pfAccountError: false, dateExit: oldEPFData.date_of_exit, dateExitError: false, 
                            certificateNo: (oldEPFData.scheme_certificate_number)? oldEPFData.scheme_certificate_number : '', certificateNoError: (oldEPFData.scheme_certificate_number)? false : true,
                            paymentOrder: (oldEPFData.ppo_number)? oldEPFData.ppo_number : '', paymentOrderError: (oldEPFData.ppo_number)? false : true
                        })
                    }
                    if(oldEPFData.international_worker === "Yes"){
                        this.setState({
                            sliderState: true, countryID: oldEPFData.country_id, countryName: oldEPFData.country, passportNumber: oldEPFData.passport_number, passportNumberError: false,
                            dateExit: oldEPFData.date_of_exit, dateExitError: false, validFrom: oldEPFData.passport_validity_from, validFromError: false, validTo: oldEPFData.passport_validity_to, 
                            validToError: false
                        })
                    }
                    this.setState({place: oldEPFData.location, placeError: false})
                }
            }
        })
    }

    handleBackButton = () => {
        //ToastAndroid.show('Not Allowed', ToastAndroid.SHORT)
        if(this.props.route.name === "PFForm"){
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

    checkBlankFields(){
        this.setState({submit: true}, () => {
            const {
                selectName, selectEPF, selectEPS, uanError, pfAccountError, dateExitError, place, sliderState,
                placeError, uan, pfAccount, dateExit, certificateNo, certificateNoError, paymentOrder, paymentOrderError,
                countryID, countryName, countryError, passportNumber, passportNumberError, validFrom, validFromError, validTo,
                validToError, baseURL
            } = this.state;
            const sendData = new FormData();
            const apiData = JSON.parse(this.props.route.params.apiData);
            const todaysDate = this.state.currentDate();
            if(selectName && !placeError && todaysDate){
                const epfDetails = {
                    father_or_spouse_name: (selectName === 1)? 'father' : 'spouse',
                    member_of_epf: (selectEPF === 1)? "Yes" : "No",
                    member_of_eps: (selectEPS === 1)? "Yes" : "No",
                    date: todaysDate,
                    location: place
                }
                const listItem = Object.keys(epfDetails);
                listItem.forEach((name) => {
                    sendData.append(`epf[${name}]`, epfDetails[name]);
                });
                if(selectEPF === 1 || selectEPS === 1){
                    if(!uanError && !pfAccountError && !dateExitError){
                        sendData.append(`epf[uan_number]`, uan);
                        sendData.append(`epf[pf_account_number]`, pfAccount);
                        sendData.append(`epf[date_of_exit]`, dateExit);
                        if(!certificateNoError){
                            sendData.append(`epf[scheme_certificate_number]`, certificateNo);
                        }
                        if(!paymentOrderError){
                            sendData.append(`epf[ppo_number]`, paymentOrder);
                        }
                    }else{
                        alert("Please fill the fields highlighted in RED.");
                        return;
                    }
                }
                sendData.append(`epf[international_worker]`, (sliderState)? "Yes" : "No");
                if(sliderState){
                    if(!countryError && !passportNumberError && !validFromError && !validToError){
                        sendData.append(`epf[country_id]`, countryID);
                        sendData.append(`epf[country]`, countryName);
                        sendData.append(`epf[passport_number]`, passportNumber);
                        sendData.append(`epf[passport_validity_from]`, validFrom);
                        sendData.append(`epf[passport_validity_to]`, validTo);
                    }else{
                        alert("Please fill the fields highlighted in RED.");
                        return;
                    }
                }
                sendData.append('id', apiData.draftId);
                sendData.append('page', apiData.currentPage);
                sendData.append('project_id', apiData.projectId);
                sendData.append('next', apiData.sectionData.links.next.page);
                this.callAPI(sendData);
            }else{
                alert("Please fill the fields highlighted in RED...")
            }
        })
    }

    async callAPI(sendData){
        this.showLoader();
        const {baseURL} = this.state;
        const secretToken = await AsyncStorage.getItem('onboardingToken');
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
            console.log("%%%% SUCCESS: ", parsedData)
            if(parsedData.status === 1){
                console.log("### @@@ ^^^ SUCCESS ACHIEVED: ", parsedData, "\n\n", parsedData.sectionData.links.pageLinks);
                alert(parsedData.message);
                this.props.navigation.navigate(parsedData.sectionData.links.currentPage.key, {apiData: JSON.stringify(parsedData)});
            }else if(parsedData.status === 0){
                Alert.alert(parsedData.message, `${parsedData.errors}`);
            }
        }).catch((error) => {
            this.hideLoader();
            console.log("%%% ERROR: ", error)
            if(error.response){
                const status = error.response.status;
                console.log("%%% ERROR2: ", error.response)
                Alert.alert("ERROR", `Error Code: ${status}608`);
            }else{
                alert(`${error}, API CODE: 608`)
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
            loading, showScreensList, selectName, selectEPF, selectEPS, uan, uanError, submit, pfAccount, pfAccountError, dateExit, dateExitError,
            certificateNo, certificateNoError, paymentOrder, paymentOrderError, sliderState, validFrom, validFromError, validTo, validToError,
            passportNumber, passportNumberError, countryID, countryName, countryError, place, placeError, baseURL, screens, dEMinDate, dETimeStamp,
            showDEPicker, showFromDatePicker, showToDatePicker, validfromMinDate, validFromTimeStamp, validToTimeStamp
        } = this.state;
        const buttonColor = 'rgb(19,111,232)';
        const currentYear = moment().year();
        const presentDate = `${currentYear}-${moment().month() + 1}-${moment().date()}`;
        const maxDate = `${currentYear + 20}-${moment().month() + 1}-${moment().date()}`;
        const dEMax = `${currentYear}-${moment().month() + 1}-${moment().date()}`;
        const dEMaxDate = moment(`${dEMax} 12:00 AM`, "YYYY-MM-DD hh:mm A").utc().toDate();
        const apiData = JSON.parse(this.props.route.params.apiData);
        let date = moment().date();
        date = (date < 10)? `0${date}` : date;
        const countryList = apiData.sectionData.dropdown.countries.map((item) => {
            return {
                ...item, id: `${item.id}`
            }
        });
        // console.log('@@@@@ COUNTRY LIST: ', countryList);
        const bankDetails = JSON.parse(apiData.sectionData.dropdown.bankDetails.professional);
        const personalDetails = JSON.parse(apiData.sectionData.dropdown.personalDetails.personal);
        const currentDate = this.state.currentDate();
        const maxDateofExit = `${moment().year()}-${(moment().month() + 1)}-${(moment().date() - 1)}`;
        let validFromMaxDate = moment(`${presentDate} 12:00 AM`, "YYYY-MM-DD hh:mm A").utc().toDate();
        const validToMinDate = moment(`${validFrom} 12:00 AM`, "YYYY-MM-DD hh:mm A").utc().toDate();
        let validToMaxDate = moment(validFrom, "YYYY-MM-DD").add(25, 'years').format("YYYY-MM-DD");
        validToMaxDate = moment(`${validToMaxDate} 12:00 AM`, "YYYY-MM-DD hh:mm A").utc().toDate();
        return (
            <SafeAreaView style={[{alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: '#F6F6F6', flex: 1}]}>
                <StatusBar hidden={false} barStyle="dark-content" />
                <View style={{flex: 1, ...Platform.select({android: getMarginVertical(2)})}}>
                    <View style={[{alignItems: 'center', flex: 1}, getWidthnHeight(100)]}>
                        <KeyboardAvoidingView style={{alignItems: 'center'}} behavior={(Platform.OS === 'ios')? "padding" : null} keyboardVerticalOffset={(Platform.OS === 'ios')? getMarginTop(6).marginTop : null}>
                            <View style={[{
                                alignItems: 'center', backgroundColor: 'white', shadowOpacity: 0.4, shadowColor: '#000000', shadowRadius: 2, elevation: 2, 
                                shadowOffset: {width: 0, height: 0}, borderColor: 'purple', borderWidth: 0, flex: 1}, 
                                getMarginTop(0), getWidthnHeight(93)]}>
                                <DismissKeyboard>
                                    <View style={[{alignItems: 'center'}, getMarginTop(1)]}>
                                        <MaskedGradientText
                                            title={"PF Nomination Form"}
                                            titleStyle={[{fontWeight: '600', color: '#000000', fontSize: (fontSizeH3().fontSize), textDecorationLine: 'underline'}, styles.boldFont]}
                                            start={{x: 0, y: 0}}
                                            end={{x: 0.7, y: 0}}
                                            colors={["#039FFD", "#EA304F"]}
                                        />
                                        <Text style={[{fontSize: (fontSizeH4().fontSize), fontWeight: 'bold'}, styles.boldFont, getMarginTop(1)]}>EMPLOYEE'S PROVIDENT FUND ORGANIZATION</Text>
                                        <Text
                                            numberOfLines={2}
                                            style={[{
                                                fontSize: (fontSizeH4().fontSize - 2), textAlign: 'center', color: 'grey'
                                                }, getMarginTop(1)
                                            ]}
                                        >
                                            {`Employee's Provident Funds Scheme, 1952 (Paragraph 34 & 57) &`}
                                        </Text>
                                        <Text
                                            numberOfLines={2}
                                            style={[{
                                                fontSize: (fontSizeH4().fontSize - 2), textAlign: 'center', color: 'grey'
                                                }, getMarginTop(0.5)
                                            ]}
                                        >
                                            {`Employee's Pension Scheme, 1995 (Paragraph 24)`}
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
                                            <View style={[{flex: 1, alignItems: 'center', borderColor: 'red', borderWidth: 0, overflow: 'hidden'}]}>
                                                <View style={[{alignItems: 'flex-start'}, getWidthnHeight(87)]}>
                                                    <Text 
                                                        style={[{
                                                            color: colorTitle, fontSize: (fontSizeH4().fontSize), textAlign: 'justify', fontWeight: 'bold', lineHeight: 20
                                                        }, styles.boldFont
                                                    ]}>
                                                        (Declaration by a person taking up employment in any establishment on which EPF, 1952 and / or EPS, 1995 is applicable)
                                                    </Text>
                                                </View>
                                                <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, getMarginTop(1.5), getWidthnHeight(87)]}>
                                                    <Text style={[{fontWeight: 'bold', fontSize: (fontSizeH4().fontSize + 2)}, styles.boldFont]}>Member's Name:</Text>
                                                    <Text style={[{fontSize: (fontSizeH4().fontSize + 2)}, getMarginTop(0.5)]}>{`${personalDetails.first_name} ${personalDetails.middle_name} ${personalDetails.last_name}`}</Text>
                                                </View>
                                                <View style={[{
                                                    flexDirection: 'row', justifyContent: 'flex-start', paddingVertical: getMarginTop(1).marginTop,
                                                    borderColor: (submit && !selectName)? 'red' : 'transparent', borderWidth: 2, borderRadius: getWidthnHeight(1).width ,
                                                    borderStyle: 'dashed'
                                                    }, getMarginTop(1), getWidthnHeight(93)
                                                ]}>
                                                    {(selectName === 1)?
                                                        <RadioEnable 
                                                            title={"Father's Name"}
                                                            containerStyle={{borderWidth: 0, borderColor: 'black', justifyContent: 'center'}}
                                                            outerCircle={{width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, borderRadius: getWidthnHeight(7).width, borderWidth: getWidthnHeight(1).width}}
                                                            innerCircle={{width: getWidthnHeight(3.5).width, height: getWidthnHeight(3.5).width, borderRadius: getWidthnHeight(3.5).width}}
                                                            textContainerStyle={[getMarginLeft(2)]}
                                                        />
                                                    :
                                                        <RadioDisable 
                                                            title={"Father's Name"}
                                                            onPress={() => {
                                                                this.setState({selectName: 1}, () => Keyboard.dismiss());
                                                            }}
                                                            containerStyle={{borderWidth: 0, borderColor: 'black', justifyContent: 'center'}}
                                                            outerCircle={{width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, borderRadius: getWidthnHeight(7).width, borderWidth: getWidthnHeight(2).width}}
                                                            textContainerStyle={[getMarginLeft(2)]}
                                                        />
                                                    }
                                                    {(personalDetails.marital_status === "Married") &&
                                                        <>
                                                            {(selectName === 2)?
                                                                <RadioEnable 
                                                                    title={"Spouse's Name"}
                                                                    containerStyle={{borderWidth: 0, borderColor: 'black', justifyContent: 'center'}}
                                                                    outerCircle={{width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, borderRadius: getWidthnHeight(7).width, borderWidth: getWidthnHeight(1).width}}
                                                                    innerCircle={{width: getWidthnHeight(3.5).width, height: getWidthnHeight(3.5).width, borderRadius: getWidthnHeight(3.5).width}}
                                                                    textContainerStyle={[getMarginLeft(2)]}
                                                                />
                                                            :
                                                                <RadioDisable 
                                                                    title={"Spouse's Name"}
                                                                    onPress={() => {
                                                                        this.setState({selectName: 2}, () => Keyboard.dismiss());
                                                                    }}
                                                                    containerStyle={{borderWidth: 0, borderColor: 'black', justifyContent: 'center'}}
                                                                    outerCircle={{width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, borderRadius: getWidthnHeight(7).width, borderWidth: getWidthnHeight(2).width}}
                                                                    textContainerStyle={[getMarginLeft(2)]}
                                                                />
                                                            }
                                                        </>
                                                    }
                                                </View>
                                                <View style={[{alignItems: 'flex-start'}, getWidthnHeight(87)]}>
                                                    <Text style={[{fontStyle: 'italic', color: 'grey'}, fontSizeH4(), getMarginTop(0)]}>(Please check whichever is applicable)</Text>
                                                    {(selectName === 2) &&
                                                        <Text style={[{fontSize: (fontSizeH4().fontSize + 2)}, getMarginTop(0.5)]}>{personalDetails.spouse_name}</Text>
                                                    }
                                                    {(selectName === 1) &&
                                                        <Text style={[{fontSize: (fontSizeH4().fontSize + 2)}, getMarginTop(0.5)]}>{personalDetails.father_name}</Text>
                                                    }
                                                    {(selectName === null) &&
                                                        <Text style={[{fontSize: (fontSizeH4().fontSize + 2)}, getMarginTop(0.5)]}>--</Text>
                                                    }
                                                </View>
                                                <View style={[{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, getMarginTop(2), getWidthnHeight(87)]}>
                                                    <View style={{alignItems: 'center'}}>
                                                        <Text style={[{fontWeight: 'bold', fontSize: (fontSizeH4().fontSize + 2)}, styles.boldFont]}>Date of Birth</Text>
                                                        <Text style={[{fontSize: (fontSizeH4().fontSize - 2)}, styles.boldFont]}>(DD/MM/YYYY)</Text>
                                                    </View>
                                                    <Text style={[{fontSize: (fontSizeH4().fontSize + 2), textAlign: 'right'}]}>{moment(personalDetails.date_of_birth).format("DD/MM/YYYY")}</Text>
                                                </View>
                                                <View style={[{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, getMarginTop(1.5), getWidthnHeight(87)]}>
                                                    <Text style={[{fontWeight: 'bold', fontSize: (fontSizeH4().fontSize + 2)}, styles.boldFont]}>Marital Status</Text>
                                                    <Text style={[{fontSize: (fontSizeH4().fontSize + 2), textAlign: 'right'}]}>{personalDetails.marital_status}</Text>
                                                </View>
                                                <View style={[{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, getMarginTop(2), getWidthnHeight(87)]}>
                                                    <Text style={[{fontWeight: 'bold', fontSize: (fontSizeH4().fontSize + 2)}, styles.boldFont]}>Email ID</Text>
                                                    <Text style={[{fontSize: (fontSizeH4().fontSize + 2), textAlign: 'right'}]}>{(apiData.emailId)? apiData.emailId : '--'}</Text>
                                                </View>
                                                <View style={[{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, getMarginTop(2), getWidthnHeight(87)]}>
                                                    <Text style={[{fontWeight: 'bold', fontSize: (fontSizeH4().fontSize + 2)}, styles.boldFont]}>Mobile Number</Text>
                                                    <Text style={[{fontSize: (fontSizeH4().fontSize + 2), textAlign: 'right'}]}>{apiData.mobileNumber}</Text>
                                                </View>
                                                <View style={[{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, getMarginTop(2.5), getWidthnHeight(87)]}>
                                                    <Text style={[{fontWeight: 'bold', fontSize: (fontSizeH4().fontSize + 2)}, styles.boldFont]}>
                                                        Whether earlier a member of Employee's Provident Fund Scheme, 1952
                                                    </Text>
                                                </View>
                                                <View style={[{flexDirection: 'row', justifyContent: 'flex-start'}, getMarginTop(1), getWidthnHeight(87)]}>
                                                    {(selectEPF === 1)?
                                                        <RadioEnable 
                                                            title={"Yes"}
                                                            containerStyle={{borderWidth: 0, borderColor: 'black', justifyContent: 'center', width: null}}
                                                            outerCircle={{width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, borderRadius: getWidthnHeight(7).width, borderWidth: getWidthnHeight(1).width}}
                                                            innerCircle={{width: getWidthnHeight(3.5).width, height: getWidthnHeight(3.5).width, borderRadius: getWidthnHeight(3.5).width}}
                                                            textContainerStyle={[getMarginLeft(2)]}
                                                        />
                                                    :
                                                        <RadioDisable 
                                                            title={"Yes"}
                                                            onPress={() => {
                                                                this.setState({selectEPF: 1}, () => Keyboard.dismiss());
                                                            }}
                                                            containerStyle={{borderWidth: 0, borderColor: 'black', justifyContent: 'center', width: null}}
                                                            outerCircle={{width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, borderRadius: getWidthnHeight(7).width, borderWidth: getWidthnHeight(2).width}}
                                                            textContainerStyle={[getMarginLeft(2)]}
                                                        />
                                                    }
                                                    {(selectEPF === 2)?
                                                        <RadioEnable 
                                                            title={"No"}
                                                            containerStyle={{borderWidth: 0, borderColor: 'black', justifyContent: 'center', }}
                                                            outerCircle={{width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, borderRadius: getWidthnHeight(7).width, borderWidth: getWidthnHeight(1).width}}
                                                            innerCircle={{width: getWidthnHeight(3.5).width, height: getWidthnHeight(3.5).width, borderRadius: getWidthnHeight(3.5).width}}
                                                            textContainerStyle={[getMarginLeft(2)]}
                                                        />
                                                    :
                                                        <RadioDisable 
                                                            title={"No"}
                                                            onPress={() => {
                                                                this.setState({selectEPF: 2}, () => Keyboard.dismiss());
                                                            }}
                                                            containerStyle={{borderWidth: 0, borderColor: 'black', justifyContent: 'center'}}
                                                            outerCircle={{width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, borderRadius: getWidthnHeight(7).width, borderWidth: getWidthnHeight(2).width}}
                                                            textContainerStyle={[getMarginLeft(2)]}
                                                        />
                                                    }
                                                </View>
                                                <View style={[{alignItems: 'flex-start'}, getMarginTop(1.5), getWidthnHeight(87)]}>
                                                    <Text style={[{fontWeight: 'bold', fontSize: (fontSizeH4().fontSize + 2)}, styles.boldFont]}>
                                                        Whether earlier a member of Employee's Pension Scheme, 1995
                                                    </Text>
                                                </View>
                                                <View style={[{flexDirection: 'row', justifyContent: 'flex-start'}, getMarginTop(1), getWidthnHeight(87)]}>
                                                    {(selectEPS === 1)?
                                                        <RadioEnable 
                                                            title={"Yes"}
                                                            containerStyle={{borderWidth: 0, borderColor: 'black', justifyContent: 'center', width: null}}
                                                            outerCircle={{width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, borderRadius: getWidthnHeight(7).width, borderWidth: getWidthnHeight(1).width}}
                                                            innerCircle={{width: getWidthnHeight(3.5).width, height: getWidthnHeight(3.5).width, borderRadius: getWidthnHeight(3.5).width}}
                                                            textContainerStyle={[getMarginLeft(2)]}
                                                        />
                                                    :
                                                        <RadioDisable 
                                                            title={"Yes"}
                                                            onPress={() => {
                                                                this.setState({selectEPS: 1}, () => Keyboard.dismiss());
                                                            }}
                                                            containerStyle={{borderWidth: 0, borderColor: 'black', justifyContent: 'center', width: null}}
                                                            outerCircle={{width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, borderRadius: getWidthnHeight(7).width, borderWidth: getWidthnHeight(2).width}}
                                                            textContainerStyle={[getMarginLeft(2)]}
                                                        />
                                                    }
                                                    {(selectEPS === 2)?
                                                        <RadioEnable 
                                                            title={"No"}
                                                            containerStyle={{borderWidth: 0, borderColor: 'black', justifyContent: 'center', }}
                                                            outerCircle={{width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, borderRadius: getWidthnHeight(7).width, borderWidth: getWidthnHeight(1).width}}
                                                            innerCircle={{width: getWidthnHeight(3.5).width, height: getWidthnHeight(3.5).width, borderRadius: getWidthnHeight(3.5).width}}
                                                            textContainerStyle={[getMarginLeft(2)]}
                                                        />
                                                    :
                                                        <RadioDisable 
                                                            title={"No"}
                                                            onPress={() => {
                                                                this.setState({selectEPS: 2}, () => Keyboard.dismiss());
                                                            }}
                                                            containerStyle={{borderWidth: 0, borderColor: 'black', justifyContent: 'center'}}
                                                            outerCircle={{width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, borderRadius: getWidthnHeight(7).width, borderWidth: getWidthnHeight(2).width}}
                                                            textContainerStyle={[getMarginLeft(2)]}
                                                        />
                                                    }
                                                </View>
                                                {(selectEPF === 1 || selectEPS === 1) &&
                                                    <View style={[{backgroundColor: 'rgba(196, 196, 196, 0.5)', height: 1}, getWidthnHeight(87), getMarginTop(3)]}/>
                                                }
                                                {(selectEPF === 1 || selectEPS === 1) &&
                                                    <View style={{alignItems: 'center'}}>
                                                        <View style={[{alignItems: 'flex-start'}, getMarginTop(1.5), getWidthnHeight(87)]}>
                                                            <Text style={[{fontWeight: 'bold', fontSize: (fontSizeH4().fontSize + 2), color: colorTitle}, styles.boldFont]}>Previous employment details: </Text>
                                                            <Text style={[{fontSize: (fontSizeH4().fontSize - 1)}, getMarginTop(0.5)]}>(If YES to 7 AND / OR 8 above)</Text>
                                                        </View>
                                                        <View style={[{borderWidth: 1, borderColor: '#C4C4C4', borderRadius: getWidthnHeight(1).width, alignItems: 'center'}, getMarginTop(2), getMarginBottom(1), getWidthnHeight(87, 44.5)]}>
                                                            <View style={[{alignItems: 'center'}, getWidthnHeight(87), getMarginTop(2)]}>
                                                                <AnimatedTextInput 
                                                                    placeholder=" Universal Account Number "
                                                                    placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                                    value={uan}
                                                                    keyboardType={'numeric'}
                                                                    maxLength={12}
                                                                    slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                                    slideHorizontal={[0, getWidthnHeight(-5).width]}
                                                                    placeholderScale={[1, 0.75]}
                                                                    autoFocus={false}
                                                                    onChangeText={(number) => {
                                                                        this.setState({ uan: number.replace(/[^0-9]/g, '') }, () => {
                                                                            const {uan} = this.state;
                                                                            if(uan !== '' && uan.length === 12){
                                                                                this.setState({uanError: false})
                                                                            }else if(uan === ''){
                                                                                this.setState({uan: '', uanError: true}, () => Keyboard.dismiss())
                                                                            }else if(uan.length < 12){
                                                                                this.setState({uanError: true})
                                                                            }
                                                                        })
                                                                    }}
                                                                    clearText={() => this.setState({uan: '', uanError: true})}
                                                                    containerColor={[(submit && uanError)? 'red' : '#C4C4C4', (submit && uanError)? 'red' : '#C4C4C4']}
                                                                    containerBorderWidth={[(submit && uanError)? 2 : 1, 1]}
                                                                    containerStyle={[{
                                                                        borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && uanError)? 'dashed' : 'solid',
                                                                    }, getWidthnHeight(80, 6.5)]}
                                                                    style={[{
                                                                        borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2),
                                                                        color: (uanError)? 'red' : 'black'
                                                                    }, getWidthnHeight(78, 6.5), getMarginHorizontal(1)]}
                                                                />
                                                            </View>
                                                            <View style={[{alignItems: 'center'}, getWidthnHeight(87), getMarginTop(2)]}>
                                                                <AnimatedTextInput 
                                                                    placeholder=" Previous PF Account Number "
                                                                    placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                                    value={pfAccount}
                                                                    slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                                    slideHorizontal={[0, getWidthnHeight(-5).width]}
                                                                    placeholderScale={[1, 0.75]}
                                                                    autoFocus={false}
                                                                    onChangeText={(text) => {
                                                                        this.setState({ pfAccount: text.trimLeft() }, () => {
                                                                            const {pfAccount} = this.state;
                                                                            if(pfAccount !== ''){
                                                                                this.setState({pfAccountError: false})
                                                                            }else if(pfAccount === ''){
                                                                                this.setState({pfAccountError: true}, () => Keyboard.dismiss())
                                                                            }
                                                                        })
                                                                    }}
                                                                    clearText={() => this.setState({pfAccount: '', pfAccountError: true})}
                                                                    containerColor={[(submit && pfAccountError)? 'red' : '#C4C4C4', (submit && pfAccountError)? 'red' : '#C4C4C4']}
                                                                    containerBorderWidth={[(submit && pfAccountError)? 2 : 1, 1]}
                                                                    containerStyle={[{
                                                                        borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && pfAccountError)? 'dashed' : 'solid',
                                                                    }, getWidthnHeight(80, 6.5)]}
                                                                    style={[{
                                                                        borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2),
                                                                        color: 'black'
                                                                    }, getWidthnHeight(78, 6.5), getMarginHorizontal(1)]}
                                                                />
                                                            </View>
                                                            <View style={[{alignItems: 'center'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                                {/* <AnimateDateLabel
                                                                    containerColor={[(submit && dateExitError)? 'red' : '#C4C4C4', (submit && dateExitError)? 'red' : '#C4C4C4']}
                                                                    containerBorderWidth={[(submit && dateExitError)? 2 : 1, 1]}
                                                                    containerStyle={[{
                                                                        borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && dateExitError)? 'dashed' : 'solid',
                                                                    }, getWidthnHeight(80, 6.5)]}
                                                                    slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                                    slideHorizontal={[0, getWidthnHeight(-31).width]}
                                                                    style={[{justifyContent: 'center'}, getWidthnHeight(80, 6.5)]}
                                                                    date={dateExit}
                                                                    minDate={'1990-01-01'}
                                                                    maxDate={`${maxDateofExit}`}
                                                                    mode="date"
                                                                    placeholder="Date of Exit"
                                                                    format="YYYY-MM-DD"
                                                                    onDateChange={(date) => {this.setState({dateExit: date, dateExitError: false}, () => {
                                                                        Keyboard.dismiss();
                                                                    })}}
                                                                /> */}
                                                                <TouchableOpacity 
                                                                    onPress={() => this.setState({showDEPicker: !showDEPicker})}
                                                                >
                                                                    <View 
                                                                        style={[{
                                                                            alignItems: 'center', justifyContent: 'center', borderRadius: 5, 
                                                                            borderColor: (submit && dateExitError)? 'red' : '#C4C4C4', 
                                                                            borderWidth: (submit && dateExitError)? 2 : 1,
                                                                            borderStyle: (submit && dateExitError)? 'dashed' : 'solid'
                                                                        }, getWidthnHeight(80, 6.5)]}>
                                                                        <Text style={[{color: dateExit? '#000000' : '#C4C4C4', fontSize: (fontSizeH4().fontSize + 2)}]}>{dateExit || 'Select Date'}</Text>
                                                                    </View>
                                                                </TouchableOpacity>
                                                                {(showDEPicker) && (
                                                                    <DateTimePicker 
                                                                        styleBox={{flex: 1}}
                                                                        date={moment(dETimeStamp).utc().toDate()}
                                                                        androidMode='default'
                                                                        mode='date'
                                                                        is24Hour={false}
                                                                        placeholder='Select Date'
                                                                        format='YYYY-MM-DD'
                                                                        minDate={dEMinDate}
                                                                        maxDate={dEMaxDate}
                                                                        onDateChange={(event, newDate) => {
                                                                            if(event.type === "dismissed"){
                                                                                this.setState({showDEPicker: !showDEPicker})
                                                                                return;
                                                                            }
                                                                            this.setState({showDEPicker: !showDEPicker})
                                                                            const dETimeStamp = event.nativeEvent.timestamp;
                                                                            this.setState({
                                                                                dateExit: moment(newDate).format("YYYY-MM-DD"), dETimeStamp,
                                                                                dateExitError: false
                                                                            });
                                                                            Keyboard.dismiss();
                                                                        }} 
                                                                    />
                                                                )}
                                                                <View style={[{
                                                                    position: 'absolute',
                                                                    backgroundColor: '#FFFFFF',
                                                                    left: 0,
                                                                    marginLeft: getWidthnHeight(8).width
                                                                }, getMarginTop(-1)]}>
                                                                    <Text style={[{fontSize: (fontSizeH4().fontSize - 3), color: '#0B8EE8', fontWeight: 'normal', textAlign: 'center'}, styles.boldFont]}>Date of Exit</Text>
                                                                </View>
                                                            </View>
                                                            <View style={[{alignItems: 'center'}, getWidthnHeight(87), getMarginTop(2)]}>
                                                                <AnimatedTextInput 
                                                                    placeholder=" Scheme Certificate No. (if issued) "
                                                                    placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                                    value={certificateNo}
                                                                    slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                                    slideHorizontal={[0, getWidthnHeight(-6).width]}
                                                                    placeholderScale={[1, 0.75]}
                                                                    autoFocus={false}
                                                                    onChangeText={(text) => {
                                                                        this.setState({ certificateNo: text.trimLeft() }, () => {
                                                                            const {certificateNo} = this.state;
                                                                            if(certificateNo !== ''){
                                                                                this.setState({certificateNoError: false})
                                                                            }else if(certificateNo === ''){
                                                                                this.setState({certificateNoError: true}, () => Keyboard.dismiss())
                                                                            }
                                                                        })
                                                                    }}
                                                                    clearText={() => this.setState({certificateNo: '', certificateNoError: true})}
                                                                    containerColor={['#C4C4C4', '#C4C4C4']}
                                                                    containerBorderWidth={[1, 1]}
                                                                    containerStyle={[{
                                                                        borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: 'solid',
                                                                    }, getWidthnHeight(80, 6.5)]}
                                                                    style={[{
                                                                        borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2),
                                                                        color: 'black'
                                                                    }, getWidthnHeight(78, 6.5), getMarginHorizontal(1)]}
                                                                />
                                                            </View>
                                                            <View style={[{alignItems: 'center'}, getWidthnHeight(87), getMarginTop(2)]}>
                                                                <AnimatedTextInput 
                                                                    placeholder=" Pension Payment Order (PPO) No. (if issued) "
                                                                    placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                                    value={paymentOrder}
                                                                    slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                                    slideHorizontal={[0, getWidthnHeight(-8).width]}
                                                                    placeholderScale={[1, 0.75]}
                                                                    autoFocus={false}
                                                                    onChangeText={(text) => {
                                                                        this.setState({ paymentOrder: text.trimLeft() }, () => {
                                                                            const {paymentOrder} = this.state;
                                                                            if(paymentOrder !== ''){
                                                                                this.setState({paymentOrderError: false})
                                                                            }else if(paymentOrder === ''){
                                                                                this.setState({paymentOrderError: true}, () => Keyboard.dismiss())
                                                                            }
                                                                        })
                                                                    }}
                                                                    clearText={() => this.setState({paymentOrder: '', paymentOrderError: true})}
                                                                    containerColor={['#C4C4C4', '#C4C4C4']}
                                                                    containerBorderWidth={[1, 1]}
                                                                    containerStyle={[{
                                                                        borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: 'solid',
                                                                    }, getWidthnHeight(80, 6.5)]}
                                                                    style={[{
                                                                        borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2),
                                                                        color: 'black'
                                                                    }, getWidthnHeight(78, 6.5), getMarginHorizontal(1)]}
                                                                />
                                                            </View>
                                                        </View>
                                                    </View>
                                                }
                                                <View style={[{backgroundColor: 'rgba(196, 196, 196, 0.5)', height: 1}, getWidthnHeight(87), getMarginTop(2)]}/>
                                                <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, getMarginTop(2), getWidthnHeight(87)]}>
                                                    <View style={[{alignItems: 'flex-start'}]}>
                                                        <Text style={[{fontWeight: 'bold', fontSize: (fontSizeH4().fontSize + 2), color: colorTitle}, styles.boldFont]}>International Worker:</Text>
                                                        <Text style={[{fontSize: (fontSizeH4().fontSize - 1)}, getMarginTop(0.5)]}>(If YES to 7 AND / OR 8 above)</Text>
                                                    </View>
                                                    <Slider 
                                                        activeColor={colorTitle} 
                                                        //inactiveColor={'red'}
                                                        //buttonColor={'red'}
                                                        // buttonBorderColor={'blue'}
                                                        value={sliderState}
                                                        onSlide={(sliderState) => this.setState({sliderState}, () => {
                                                            const {sliderState} = this.state;
                                                            if(!sliderState){
                                                                this.setState({
                                                                    countryID: '', countryName: '', countryError: true, passportNumber: '', passportNumberError: true,
                                                                    validFrom: '', validFromError: true, validTo: '', validToError: true
                                                                })
                                                            }
                                                        })}
                                                        delay={300}
                                                    />
                                                </View>
                                                {(sliderState) &&
                                                    <View style={{alignItems: 'center'}}>
                                                        <View style={[{borderWidth: 1, borderColor: '#C4C4C4', borderRadius: getWidthnHeight(1).width, alignItems: 'center'}, getMarginTop(2), getMarginBottom(1), getWidthnHeight(87, 36)]}>
                                                            <View style={[{alignItems: 'center'}, getWidthnHeight(87), getMarginTop(2)]}>
                                                                {/* <Dropdown
                                                                    containerStyle={[{
                                                                        borderColor: (submit && countryError)? 'red' : '#C4C4C4', borderWidth: (submit && countryError)? 2 : 1, 
                                                                        borderStyle: (submit && countryError)? 'dashed' : 'solid', justifyContent: 'center', borderRadius: getWidthnHeight(1).width
                                                                    }, getWidthnHeight(80, 6.5), getMarginRight(0)]}
                                                                    inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getWidthnHeight(80)]}
                                                                    labelFontSize={fontSizeH4().fontSize - 3}
                                                                    labelTextStyle={[getMarginLeft(1.5), getMarginTop(0)]}
                                                                    data={countryList}
                                                                    valueExtractor={({id})=> id}
                                                                    label={"Country"}
                                                                    labelExtractor={({name})=> name}
                                                                    onChangeText={(id, index, data) => {
                                                                        this.setState({
                                                                            countryName: data[index]['name'], countryID: id, countryError: false 
                                                                        }, () => console.log("### COUNTRY ID: ", this.state.countryID))
                                                                        this.dismissKeyboard();
                                                                    }}
                                                                    value={countryName}
                                                                    baseColor = {(countryName)? colorTitle : '#C4C4C4'}
                                                                    //pickerStyle={[getMarginLeft(4), getWidthnHeight(42), getMarginTop(10)]}
                                                                    fontSize = {(countryName)? fontSizeH4().fontSize + 2 : fontSizeH4().fontSize}
                                                                /> */}
                                                                <Dropdown
                                                                    style={[{
                                                                        borderColor: (submit && countryError)? 'red' : '#C4C4C4', borderWidth: (submit && countryError)? 2 : 1, 
                                                                        borderStyle: (submit && countryError)? 'dashed' : 'solid', justifyContent: 'center', borderRadius: getWidthnHeight(1).width
                                                                    }, getWidthnHeight(80, 6.5)]}
                                                                    inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }]}
                                                                    placeholder={'Country'}
                                                                    placeholderStyle={{color: '#C4C4C4', fontSize: fontSizeH4().fontSize, paddingLeft: getWidthnHeight(3).width}}
                                                                    selectedTextStyle={[getMarginLeft(3)]}
                                                                    data={countryList}
                                                                    valueField={'id'}
                                                                    labelField={'name'}
                                                                    onChange={(item) => {
                                                                        // console.log(item);
                                                                        this.setState({
                                                                            countryName: item.name, countryID: item.id, countryError: false
                                                                        });
                                                                        this.dismissKeyboard();
                                                                    }}
                                                                    value={countryID}
                                                                />
                                                            </View>
                                                            <View style={[{alignItems: 'center'}, getWidthnHeight(87), getMarginTop(2)]}>
                                                                <AnimatedTextInput 
                                                                    placeholder=" Passport Number "
                                                                    placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                                    value={passportNumber}
                                                                    slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                                    slideHorizontal={[0, getWidthnHeight(-4).width]}
                                                                    placeholderScale={[1, 0.75]}
                                                                    autoFocus={false}
                                                                    autoCapitalize={'words'}
                                                                    onChangeText={(text) => {
                                                                        this.setState({ passportNumber: text.trim() }, () => {
                                                                            const {passportNumber} = this.state;
                                                                            if(passportNumber === ''){
                                                                                this.setState({passportNumberError: true}, () => Keyboard.dismiss())
                                                                            }else{
                                                                                this.setState({passportNumberError: false})
                                                                            }
                                                                        })
                                                                    }}
                                                                    clearText={() => this.setState({passportNumber: '', passportNumberError: true})}
                                                                    containerColor={[(submit && passportNumberError)? 'red' : '#C4C4C4', (submit && passportNumberError)? 'red' : '#C4C4C4']}
                                                                    containerBorderWidth={[(submit && passportNumberError)? 2 : 1, 1]}
                                                                    containerStyle={[{
                                                                        borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && passportNumberError)? 'dashed' : 'solid',
                                                                    }, getWidthnHeight(80, 6.5)]}
                                                                    style={[{
                                                                        borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2),
                                                                        color: (passportNumberError)? 'red' : 'black'
                                                                    }, getWidthnHeight(78, 6.5), getMarginHorizontal(1)]}
                                                                />
                                                            </View>
                                                            <View style={[{alignItems: 'center'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                                {/* <AnimateDateLabel
                                                                    containerColor={[(submit && validFromError)? 'red' : '#C4C4C4', (submit && validFromError)? 'red' : '#C4C4C4']}
                                                                    containerBorderWidth={[(submit && validFromError)? 2 : 1, 1]}
                                                                    containerStyle={[{
                                                                        borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && validFromError)? 'dashed' : 'solid',
                                                                    }, getWidthnHeight(80, 6.5)]}
                                                                    slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                                    slideHorizontal={[0, getWidthnHeight(-23).width]}
                                                                    style={[{justifyContent: 'center'}, getWidthnHeight(80, 6.5)]}
                                                                    date={validFrom}
                                                                    minDate={'2000-01-01'}
                                                                    maxDate={`${validFromMaxDate}`}
                                                                    mode="date"
                                                                    placeholder="Validity of passport - From"
                                                                    format="YYYY-MM-DD"
                                                                    onDateChange={(date) => {
                                                                        const currentTimeStamp = moment().valueOf();
                                                                        const addTime = moment(currentTimeStamp).add(1, 'second').format('hh:mm:ss A')
                                                                        const selectedTimeStamp = moment(`${date} ${addTime}`, "YYYY-MM-DD hh:mm:ss A").valueOf();
                                                                        const date2AddTime = moment(currentTimeStamp).add(2, 'seconds').format('hh:mm:ss A');
                                                                        let date2TimeStamp = moment(`${validTo} ${date2AddTime}`, "YYYY-MM-DD hh:mm:ss A").valueOf();
                                                                        this.setState({validFrom: date, validFromError: false}, () => {
                                                                            Keyboard.dismiss();
                                                                        })
                                                                        if(selectedTimeStamp > date2TimeStamp && date2TimeStamp){
                                                                            this.setState({validTo: '', validToError: true}, () => {
                                                                                Keyboard.dismiss();
                                                                            })
                                                                        }
                                                                    }}
                                                                /> */}
                                                                <TouchableOpacity 
                                                                    onPress={() => this.setState({showFromDatePicker: !showFromDatePicker})}
                                                                >
                                                                    <View 
                                                                        style={[{
                                                                            alignItems: 'center', justifyContent: 'center', borderRadius: 5, 
                                                                            borderColor: (submit && validFromError)? 'red' : '#C4C4C4',
                                                                            borderWidth: (submit && validFromError)? 2 : 1,
                                                                            borderStyle: (submit && validFromError)? 'dashed' : 'solid'
                                                                        }, getWidthnHeight(80, 6.5)]}>
                                                                        <Text style={[{color: validFrom? '#000000' : '#C4C4C4', fontSize: (fontSizeH4().fontSize + 2)}]}>{validFrom || 'Select Date'}</Text>
                                                                    </View>
                                                                </TouchableOpacity>
                                                                {(showFromDatePicker) && (
                                                                    <DateTimePicker 
                                                                        styleBox={{flex: 1}}
                                                                        date={moment(validFromTimeStamp).utc().toDate()}
                                                                        androidMode='default'
                                                                        mode='date'
                                                                        is24Hour={false}
                                                                        placeholder='Select Date'
                                                                        format='YYYY-MM-DD'
                                                                        minDate={validfromMinDate}
                                                                        maxDate={validFromMaxDate}
                                                                        onDateChange={(event, newDate) => {
                                                                            if(event.type === "dismissed"){
                                                                                this.setState({showFromDatePicker: !showFromDatePicker})
                                                                                return;
                                                                            }
                                                                            this.setState({showFromDatePicker: !showFromDatePicker})
                                                                            const validFromTimeStamp = event.nativeEvent.timestamp;
                                                                            this.setState({
                                                                                validFrom: moment(newDate).format("YYYY-MM-DD"), validFromTimeStamp,
                                                                                showToDatePicker: false, validFromError: false,
                                                                            });
                                                                            Keyboard.dismiss();
                                                                        }} 
                                                                    />
                                                                )}
                                                                <View style={[{
                                                                    position: 'absolute',
                                                                    backgroundColor: '#FFFFFF',
                                                                    left: 0,
                                                                    marginLeft: getWidthnHeight(8).width
                                                                }, getMarginTop(-1)]}>
                                                                    <Text style={[{fontSize: (fontSizeH4().fontSize - 3), color: '#0B8EE8', fontWeight: 'normal', textAlign: 'center'}, styles.boldFont]}>Validity of passport - From</Text>
                                                                </View>
                                                            </View>
                                                            <View style={[{alignItems: 'center'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                                {/* <AnimateDateLabel
                                                                    containerColor={[(submit && validToError)? 'red' : '#C4C4C4', (submit && validToError)? 'red' : '#C4C4C4']}
                                                                    containerBorderWidth={[(submit && validToError)? 2 : 1, 1]}
                                                                    containerStyle={[{
                                                                        borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && validToError)? 'dashed' : 'solid',
                                                                    }, getWidthnHeight(80, 6.5)]}
                                                                    slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                                    slideHorizontal={[0, getWidthnHeight(-24).width]}
                                                                    style={[{justifyContent: 'center'}, getWidthnHeight(80, 6.5)]}
                                                                    disabled={(validFromError)? true : false}
                                                                    date={validTo}
                                                                    minDate={validFrom}
                                                                    maxDate={`${maxDate}`}
                                                                    mode="date"
                                                                    placeholder="Validity of passport - To"
                                                                    format="YYYY-MM-DD"
                                                                    onDateChange={(date) => {
                                                                        const currentTimeStamp = moment().valueOf();
                                                                        const addTime = moment(currentTimeStamp).add(2, 'seconds').format('hh:mm:ss A')
                                                                        const selectedTimeStamp = moment(`${date} ${addTime}`, "YYYY-MM-DD hh:mm:ss A").valueOf();
                                                                        const date1AddTime = moment(currentTimeStamp).add(1, 'second').format('hh:mm:ss A');
                                                                        let date1TimeStamp = moment(`${validFrom} ${date1AddTime}`, "YYYY-MM-DD hh:mm:ss A").valueOf();
                                                                        if(date1TimeStamp > selectedTimeStamp){
                                                                            this.setState({validTo: '', validToError: true}, () => {
                                                                                Keyboard.dismiss();
                                                                            })
                                                                            alert("This date should be greater/equal to FROM DATE")
                                                                        }else{
                                                                            this.setState({validTo: date, validToError: false}, () => {
                                                                                Keyboard.dismiss();
                                                                            })
                                                                        }
                                                                    }}
                                                                /> */}
                                                                <TouchableOpacity 
                                                                    onPress={() => this.setState({showToDatePicker: !showToDatePicker})}
                                                                    disabled={validFromError? true : false}
                                                                >
                                                                    <View 
                                                                        style={[{
                                                                            alignItems: 'center', justifyContent: 'center', borderRadius: 5, 
                                                                            borderColor: (submit && validToError)? 'red' : '#C4C4C4',
                                                                            borderWidth: (submit && validToError)? 2 : 1,
                                                                            borderStyle: (submit && validToError)? 'dashed' : 'solid'
                                                                        }, getWidthnHeight(80, 6.5)]}>
                                                                        <Text style={[{color: validTo? '#000000' : '#C4C4C4', fontSize: (fontSizeH4().fontSize + 2)}]}>{validTo || 'Select Date'}</Text>
                                                                    </View>
                                                                </TouchableOpacity>
                                                                {(showToDatePicker) && (
                                                                    <DateTimePicker 
                                                                        styleBox={{flex: 1}}
                                                                        date={moment(validToTimeStamp).utc().toDate()}
                                                                        androidMode='default'
                                                                        mode='date'
                                                                        is24Hour={false}
                                                                        placeholder='Select Date'
                                                                        format='YYYY-MM-DD'
                                                                        minDate={validToMinDate}
                                                                        maxDate={validToMaxDate}
                                                                        onDateChange={(event, newDate) => {
                                                                            if(event.type === "dismissed"){
                                                                                this.setState({showToDatePicker: !showToDatePicker})
                                                                                return;
                                                                            }
                                                                            this.setState({showToDatePicker: !showToDatePicker})
                                                                            const validToTimeStamp = event.nativeEvent.timestamp;
                                                                            this.setState({
                                                                                validTo: moment(newDate).format("YYYY-MM-DD"), validToTimeStamp,
                                                                                showToDatePicker: false, validToError: false,
                                                                            });
                                                                            Keyboard.dismiss();
                                                                        }} 
                                                                    />
                                                                )}
                                                                <View style={[{
                                                                    position: 'absolute',
                                                                    backgroundColor: '#FFFFFF',
                                                                    left: 0,
                                                                    marginLeft: getWidthnHeight(8).width
                                                                }, getMarginTop(-1)]}>
                                                                    <Text style={[{fontSize: (fontSizeH4().fontSize - 3), color: '#0B8EE8', fontWeight: 'normal', textAlign: 'center'}, styles.boldFont]}>Validity of passport - To</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                }
                                                <View style={[{backgroundColor: 'rgba(196, 196, 196, 0.5)', height: 1}, getWidthnHeight(87), getMarginTop(3)]}/>

                                                <View style={[{alignItems: 'flex-start'}, getMarginTop(2), getWidthnHeight(87)]}>
                                                    <Text style={[{fontWeight: 'bold', fontSize: (fontSizeH4().fontSize + 2), color: colorTitle}, styles.boldFont]}>KYC Details:</Text>
                                                    <Text style={[{fontSize: (fontSizeH4().fontSize - 1)}]}>(Attach self attested copies of following KYCs)</Text>
                                                </View>
                                                <View style={[{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, getMarginTop(2), getWidthnHeight(87)]}>
                                                    <Text style={[{fontWeight: 'bold', fontSize: (fontSizeH4().fontSize + 2)}, styles.boldFont]}>Bank Account No.</Text>
                                                    <Text style={[{fontSize: (fontSizeH4().fontSize + 2), textAlign: 'right'}]}>{bankDetails.account_number}</Text>
                                                </View>
                                                <View style={[{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, getMarginTop(2), getWidthnHeight(87)]}>
                                                    <Text style={[{fontWeight: 'bold', fontSize: (fontSizeH4().fontSize + 2)}, styles.boldFont]}>IFSC Code</Text>
                                                    <Text style={[{fontSize: (fontSizeH4().fontSize + 2), textAlign: 'right'}]}>{bankDetails.ifsc_code}</Text>
                                                </View>
                                                <View style={[{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, getMarginTop(2), getWidthnHeight(87)]}>
                                                    <Text style={[{fontWeight: 'bold', fontSize: (fontSizeH4().fontSize + 2)}, styles.boldFont]}>AADHAR NUMBER</Text>
                                                    <Text style={[{fontSize: (fontSizeH4().fontSize + 2), textAlign: 'right'}]}>{bankDetails.adhaar_number}</Text>
                                                </View>
                                                <View style={[{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, getMarginTop(2), getWidthnHeight(87)]}>
                                                    <Text style={[{flex: 1, fontWeight: 'bold', fontSize: (fontSizeH4().fontSize + 2), borderWidth: 0, borderColor: 'red'}, styles.boldFont]}>Permanent Account Number (PAN), if available</Text>
                                                    <Text style={[{flex: 1, fontSize: (fontSizeH4().fontSize + 2), textAlign: 'right', borderWidth: 0, borderColor: 'red'}]}>
                                                        {(bankDetails.pan_number !== 'null' || bankDetails.pan_number !== null || bankDetails.pan_number !== '')?
                                                            bankDetails.pan_number
                                                        :
                                                            '--'
                                                        }
                                                    </Text>
                                                </View>

                                                <View style={[{backgroundColor: 'rgba(196, 196, 196, 0.5)', height: 1}, getWidthnHeight(87), getMarginTop(3)]}/>

                                                <View style={[{alignItems: 'flex-start'}, getMarginTop(2), getWidthnHeight(87)]}>
                                                    <MaskedGradientText
                                                        title={"UNDERTAKING"}
                                                        titleStyle={[{fontWeight: 'bold', color: '#000000', fontSize: (fontSizeH4().fontSize + 3)}, styles.boldFont]}
                                                        start={{x: 0, y: 0}}
                                                        end={{x: 0.7, y: 0}}
                                                        colors={["#039FFD", "#EA304F"]}
                                                    />
                                                </View>
                                                <View style={[getWidthnHeight(87)]}>
                                                    <Text style={[{fontSize: (fontSizeH4().fontSize), fontStyle: 'italic', textAlign: 'justify'}, getMarginVertical(1)]}>
                                                        1) Certified that the particulars are true to the best of my knowledge.
                                                    </Text>
                                                    <Text style={[{fontSize: (fontSizeH4().fontSize), fontStyle: 'italic', textAlign: 'justify'}, getMarginVertical(1)]}>
                                                        2) I authorize  EPFO  to use my Aadhar for verification/ authentication/ eKYC purpose for service delivery.
                                                    </Text>
                                                    <Text style={[{fontSize: (fontSizeH4().fontSize), fontStyle: 'italic', textAlign: 'justify'}, getMarginTop(1)]}>
                                                        3) Kindly transfer the funds and service details, if appplicable, from the previous PF account as declared above to the present P.F. Account.
                                                    </Text>
                                                    <Text style={[{fontSize: (fontSizeH4().fontSize), fontStyle: 'italic', textAlign: 'justify'}, getMarginBottom(1)]}>
                                                        (The transfer would be possible only if the identified KYC  detail approved by prevoius employer has been verified by present employer
                                                        using his Digital Signature Certificate).
                                                    </Text>
                                                    <Text style={[{fontSize: (fontSizeH4().fontSize), fontStyle: 'italic', textAlign: 'justify'}, getMarginVertical(1)]}>
                                                        4) In case of changes in above details, the same will be intimated to employer at the earliest.
                                                    </Text>
                                                </View>
                                                <View style={[{alignItems: 'flex-start'}, getMarginTop(1), getWidthnHeight(87)]}>
                                                    <Text style={[{fontWeight: 'bold', fontSize: (fontSizeH4().fontSize + 2)}, styles.boldFont]}>Date:</Text>
                                                    <Text style={[{fontSize: (fontSizeH4().fontSize + 2)}]}>{moment(currentDate, "YYYY-MM-DD").format("DD-MM-YYYY")}</Text>
                                                </View>
                                                <View style={[getMarginTop(2), getMarginBottom(1)]}>
                                                    <AnimatedTextInput 
                                                        placeholder=" Place "
                                                        placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                        value={place}
                                                        slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                        slideHorizontal={[0, getWidthnHeight(-1).width]}
                                                        placeholderScale={[1, 0.75]}
                                                        autoFocus={false}
                                                        autoCapitalize={"words"}
                                                        onChangeText={(place) => {
                                                            const text = place.replace(/[^A-Za-z]/gi,'')
                                                            this.setState({ place: text.trim() }, () => {
                                                                const {place} = this.state;
                                                                if(place !== ''){
                                                                    this.setState({placeError: false})
                                                                }else{
                                                                    this.setState({place: '', placeError: true}, () => Keyboard.dismiss())
                                                                }
                                                            })
                                                        }}
                                                        clearText={() => this.setState({place: '', placeError: true})}
                                                        containerColor={[(submit && placeError)? 'red' : '#C4C4C4', (submit && placeError)? 'red' : '#C4C4C4']}
                                                        containerBorderWidth={[(submit && placeError)? 2 : 1, 1]}
                                                        containerStyle={[{
                                                            borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && placeError)? 'dashed' : 'solid',
                                                        }, getWidthnHeight(87, 6.5)]}
                                                        style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(85, 6.5), getMarginHorizontal(1)]}
                                                    />
                                                </View>
                                                <View style={[{alignItems: 'center', borderColor: colorTitle, borderWidth: 2}, getMarginTop(1)]}>
                                                    <Image 
                                                        source={{uri: apiData.sectionData.dropdown.signature}}
                                                        resizeMode="contain"
                                                        style={[getWidthnHeight(40, 10)]}
                                                    />
                                                </View>
                                                <Text style={[{fontStyle: 'italic'}, fontSizeH4(), getMarginVertical(1)]}>Signature of Employee</Text>
                                            </View>
                                        </ScrollView>
                                        <View style={[{backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}, getMarginBottom(1), getWidthnHeight(93)]}>
                                            <View style={[getWidthnHeight(34)]}/>
                                            <View style={[{borderWidth: 0, borderColor: 'red'}, getWidthnHeight(32)]}>
                                                <ChoppedButton 
                                                    onPress={() => {this.checkBlankFields()}}
                                                    leftBoxSize={{width: getWidthnHeight(6).width, height: getWidthnHeight(undefined, 6).height}}
                                                    middleBoxSize={{width: getWidthnHeight(20).width, height: getWidthnHeight(undefined, 6).height}}
                                                    rightBoxSize={{width: getWidthnHeight(6).width, height: getWidthnHeight(undefined, 6).height}}
                                                    title={'NEXT'}
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
                                                        shadowRadius: 2, elevation: 2, borderColor: 'rgba(196, 196, 196, 0.5)', borderWidth: 0.4, shadowOffset: { width: 0, height: 0}
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
    },
    forDate: {
        position: 'absolute',
        backgroundColor: 'white',
        justifyContent: 'center', 
        //alignSelf: 'center', 
        borderColor: 'black', 
        borderWidth: 0, 
        marginTop: getMarginTop(-1).marginTop, 
        width: 50, 
        height: 16,
        // marginLeft: 10,
        left: getWidthnHeight(8).width
    },
})

export default PFForm;