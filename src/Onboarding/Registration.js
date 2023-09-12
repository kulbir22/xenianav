import React, {Component} from 'react';
import {
    View, Text, ImageBackground, Animated, Keyboard, ScrollView,  TextInput, TouchableHighlight,
    FlatList, Alert, Platform, StyleSheet, KeyboardAvoidingView, TouchableOpacity,
    BackHandler, SafeAreaView, StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
// import { Dropdown } from 'react-native-material-dropdown';
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Down from 'react-native-vector-icons/MaterialIcons';
import Delete from 'react-native-vector-icons/Ionicons';
import { Dropdown } from 'react-native-element-dropdown';

import {
    getWidthnHeight, IOS_StatusBar, getMarginTop, fontSizeH4, fontSizeH3, AnimatedTextInput, getMarginHorizontal,
    DismissKeyboard, GradientIcon, ChoppedButton, getMarginVertical, getMarginLeft, getMarginBottom, MaskedGradientText,
    SearchableDropDown, AnimateDateLabel, Slider, getMarginRight, CheckList, LanguageSelection, ScreensModal, Spinner,
} from '../NewComponents/common';
import {fetchBaseURL} from '../api/BaseURL';

const COLOR1 = "#039FFD";
const COLOR2 = "#EA304F";
const colorTitle = '#0B8EE8';
const salutationData = [
    {id: '1', name: 'Mr.'},
    {id: '2', name: 'Ms.'},
    {id: '3', name: 'Mrs.'},
    {id: '4', name: 'Mx.'}
]

class Registration extends Component{
    // static navigatorStyle = {
    //     disabledBackGesture: true,
    //     statusBarTextColorSchemeSingleScreen: 'dark'
    //     //topBarShadowColor: 'green'
    // };
    constructor(props){
        super(props)
        let initialDate = moment("1970-01-01", "YYYY-MM-DD").format("YYYY-MM-DD");
        const currentTime = "12:00 AM";
        const initialDateTime = `${initialDate} ${currentTime}`;
        const dobMaxDateTime = moment(`${moment().year()}-01-01`, "YYYY-MM-DD").subtract(18, 'years').format("YYYY-MM-DD");
        const utcTimeStamp = moment(initialDateTime, "YYYY-MM-DD hh:mm A").utc().toDate();
        const dobMaxUtcTimeStamp = moment(dobMaxDateTime, "YYYY-MM-DD hh:mm A").utc().toDate();
        console.log("$$$$$ DOB MAX DATE: ", moment("1995-12-25").valueOf(), moment(dobMaxDateTime).valueOf());
        this.state = {
            submit: false,
            salutationID: null,
            salutationName: '',
            salutationError: true,
            firstName: '',
            firstNameError: true,
            middleName: '',
            middleNameError: true,
            lastName: '',
            lastNameError: true,
            dob: '',
            dobTimeStamp: moment(dobMaxDateTime).valueOf(),
            dobMinDate: utcTimeStamp,
            dobMaxDate: dobMaxUtcTimeStamp,
            dobError: true,
            fatherName: '',
            fatherNameError: true,
            motherName: '',
            motherNameError: true,
            gender: 'male',
            maritalStatus: 'single',
            spouseName: '',
            spouseNameError: true,
            marriageDate: '',
            marriageDateError: true,
            qualificationID: null,
            qualificationName: '',
            qualificationError: true,
            selectedQualID: [],
            selectedQualName: '',
            skillsID: null,
            skillsName: '',
            skillsError: true,
            selectedSkillID: [],
            selectedSkillName: '',
            languageID: null,
            languageName: '',
            languageError: true,
            selectedLangID: [],
            selectedLangName: {},
            selectedLangRWS: {},
            mobile1: '',
            mobile1Error: true,
            mobile2: '',
            mobile2Error: true,
            emailAddress: '',
            email: false,
            emailError: true,
            house: '',
            houseError: true,
            pincode: '',
            pincodeError: true,
            road: '',
            roadError: true,
            locality: '',
            localityError: true,
            countryID: '1',
            countryName: 'India',
            countryError: false,
            stateList: [],
            stateID: null,
            stateName: '',
            stateError: true,
            cityList: [],
            cityID: null,
            cityName: '',
            cityError: true,
            sameAddress: true,
            noError: function(){
                //console.log("@@@### PINCODE: ", this.pincodeError, this.pincodeError === false)
                return (
                    this.salutationError === false && this.firstNameError === false && this.lastNameError === false && this.dobError === false && this.fatherNameError === false && 
                    this.motherNameError === false && this.qualificationError === false && this.skillsError === false && this.languageError === false && this.mobile1Error === false && 
                    this.houseError === false && this.pincodeError === false && this.roadError === false && this.localityError === false && this.stateError === false && 
                    this.cityError === false && ((this.mobile2 && this.mobile2Error)? false : true) && ((this.sameAddress === true)? true : (this.house2Error === false && 
                    this.pincode2Error === false && this.road2Error === false && this.locality2Error === false && this.state2Error === false && this.city2Error === false))
                );
            },
            house2: '',
            house2Error: true,
            pincode2: '',
            pincode2Error: true,
            road2: '',
            road2Error: true,
            locality2: '',
            locality2Error: true,
            country2ID: '1',
            country2Name: 'India',
            country2Error: false,
            state2List: [],
            state2ID: null,
            state2Name: '',
            state2Error: true,
            city2List: [],
            city2ID: null,
            city2Name: '',
            city2Error: true,
            showQualificationList: false,
            animateQualification: new Animated.Value(0),
            animateSkills: new Animated.Value(0),
            qualificationList: [],
            skillsList: [],
            languageList: [],
            showSkillsList: false,
            showLanguageList: false,
            selectedQualification: [],
            selectedSkills: [],
            selectedLanguage: [],
            screens: [],
            // screens: [
            //     {id: '1', name: 'Personal Details, Contact Details', status: 'Completed'},
            //     {id: '2', name: 'Document Details, Professional Details', status: 'In Progress'},
            //     {id: '3', name: 'Emergency Details', status: 'Disabled'},
            //     {id: '4', name: 'Security Details', status: 'Disabled'},
            //     {id: '5', name: 'Other Details', status: 'Disabled'}
            // ],
            showScreensList: false,
            baseURL: null,
            loading: false
        };
    }

    componentDidMount(){
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.handleBackButton())
        fetchBaseURL().then((baseURL) => {
            const apiData = JSON.parse(this.props.route.params.apiData);
            const updateQualificationList = apiData.sectionData.dropdown.qualifications.map((item, index) => {
                return {...item, id: `${item.id}`, selected: false}
            })
            const updateSkillsList = apiData.sectionData.dropdown.skills.map((item, index) => {
                return {...item, id: `${item.id}`, selected: false}
            })
            const updateLanguageList = apiData.sectionData.dropdown.languages.map((item, index) => {
                return {...item, id: `${item.id}`, selected: false, read: false, write: false, speak: true}
            })
            this.setState({
                baseURL, screens: apiData.sectionData.links.pageLinks, qualificationList: updateQualificationList, skillsList: updateSkillsList, 
                languageList: updateLanguageList, mobile1: apiData.mobileNumber, mobile1Error: false
            }, () => {
                console.log("ONBOARDING URL: ", this.state.baseURL)
                if(apiData.sectionData.oldData){
                    this.setState({loading: true}, () => {
                        this.fillOldData()
                    })
                }
            })
        })
    }

    handleBackButton = () => {
        //ToastAndroid.show('Not Allowed', ToastAndroid.SHORT)
        if(this.props.route.name === "BasicDetails"){
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

    fillOldData(){
        const apiData = JSON.parse(this.props.route.params.apiData);
        console.log("@@@ DATA RECEIVED: ", apiData)
        const oldPersoanlData = apiData.sectionData.oldData.personal;
        const oldContactData = apiData.sectionData.oldData.contact;
        salutationData.filter((item) => {
            if(item.name.trim() === oldPersoanlData.salutation.trim()){
                this.setState({salutationName: item.name, salutationID: item.id, salutationError: false})
            }
        })
        this.setState({
            firstName: oldPersoanlData.first_name, firstNameError: false, middleName: oldPersoanlData.middle_name,
            lastName: oldPersoanlData.last_name, lastNameError: false, dob: oldPersoanlData.date_of_birth, dobError: false,
            fatherName: oldPersoanlData.father_name, fatherNameError: false, motherName:oldPersoanlData.mother_name, motherNameError: false,
            gender: oldPersoanlData.gender.toLowerCase(), maritalStatus: oldPersoanlData.marital_status.toLowerCase()
        }, () => {})
        if(oldPersoanlData.marriage_date){
            this.setState({
                spouseName: oldPersoanlData.spouse_name, spouseNameError: false, marriageDate: oldPersoanlData.marriage_date, marriageDateError: false
            })
        }
        oldPersoanlData.qualifications.forEach((id) => {
            this.selectQualFunction(id);
        })
        oldPersoanlData.skills.forEach((id) => {
            this.selectSkillFunction(id);
        })
        oldPersoanlData.languages.forEach((id) => {
            this.autoSelectLanguage(id);
        })

        //CONTACT DETAILS
        this.setState({
            mobile2: (oldContactData.alt_mobile_number)? oldContactData.alt_mobile_number : '', mobile2Error: (oldContactData.alt_mobile_number)? false : true
        }, () => {})
        if(oldContactData.email_id){
            this.setState({email: true, emailError: false, emailAddress: oldContactData.email_id})
        }
        const permanentAddress = oldContactData.permanent;
        const correspondenceAddress = oldContactData.correspondence;
        this.setState({
            house: permanentAddress.house_number, houseError: false, pincode: permanentAddress.pincode, pincodeError: false,
            road: permanentAddress.road, roadError: false, locality: permanentAddress.locality, localityError: false, 
            countryID: permanentAddress.country_id, countryName: permanentAddress.country, 
            stateID: permanentAddress.state_id, stateName: permanentAddress.state, stateError: false
        }, async() => {
            await this.cities(this.state.stateID)
            this.setState({
                cityID: permanentAddress.city_id, cityName: permanentAddress.city, cityError: false
            })
        })
        if(oldContactData.same_as_permanent === "1"){
            this.setState({sameAddress: true})
        }else{
            this.setState({sameAddress: false}, () => {
                this.setState({
                    house2: correspondenceAddress.house_number, house2Error: false, pincode2: correspondenceAddress.pincode, pincode2Error: false,
                    road2: correspondenceAddress.road, road2Error: false, locality2: correspondenceAddress.locality, locality2Error: false, 
                    country2ID: correspondenceAddress.country_id, country2Name: correspondenceAddress.country, 
                    state2ID: correspondenceAddress.state_id, state2Name: correspondenceAddress.state, state2Error: false
                }, async () => {
                    await this.cities(this.state.state2ID, 'correspondence');
                    this.setState({
                        city2ID: correspondenceAddress.city_id, city2Name: correspondenceAddress.city, city2Error: false
                    })
                })
            })
        }
    }

    autoSelectLanguage(id){
        const {languageList} = this.state;
        const apiData = JSON.parse(this.props.route.params.apiData);
        const oldPersoanlData = apiData.sectionData.oldData.personal;
        const indexValue = languageList.findIndex((item) => {
            return (item.id === id)
        })
        languageList[indexValue]['selected'] = true;
        const languageRWS = oldPersoanlData.lang[`${id}`];
        languageRWS.forEach((item) => {
            if(item === "read"){
                languageList[indexValue][item] = true;
            }else if(item === "write"){
                languageList[indexValue][item] = true;
            }else if(item === "speak"){
                languageList[indexValue][item] = true;
            }
        })
        const selected = languageList.filter((item) => {
            return (item.selected === true);
        })
        this.setState({
            languageList: this.state.languageList, selectedLanguage: selected, languageError: false
        }, () => this.updateLanguageSelection())
    }

    selectQualFunction(id, index){
        const {qualificationList} = this.state;
        const indexValue = qualificationList.findIndex((item) => {
            return (item.id === id)
        })
        qualificationList[indexValue]['selected'] = true;
        const selected = qualificationList.filter((item) => {
            return (item.selected === true);
        })
        this.setState({
            qualificationList: qualificationList, selectedQualification: selected, qualificationError: false
        }, () => {
            this.updateQualificationSelection();
        })
    }

    selectSkillFunction(id){
        const {skillsList} = this.state;
        const indexValue = skillsList.findIndex((item) => {
            return (item.id === id)
        })
        skillsList[indexValue]['selected'] = true;
        const selected = skillsList.filter((item) => {
            return (item.selected === true);
        })
        this.setState({
            skillsList: this.state.skillsList, selectedSkills: selected, skillsError: false
        }, () => {
            this.updateSkillSelection();
        })
    }

    onSubmit(){
        this.setState({submit: true}, () => {
            const {emailAddress, emailError, maritalStatus, spouseNameError, marriageDateError} = this.state;
            if(emailAddress && emailError){
                alert("Invalid Email");
                return;
            }
            let enable = true;
            if(maritalStatus === 'married'){
                if(spouseNameError || marriageDateError){
                    enable = false;
                    alert("Please fill the fields highlighted in RED");
                    return;
                }
            }
            const checkError = this.state.noError();
            console.log("ON SUBMIT", checkError)
            if(checkError && enable){
                this.submitOnboarding();
            }else{
                alert("Please fill the fields highlighted in RED")
            }
        })
    }

    showLoader(){
        this.setState({loading: true})
    }

    hideLoader(){
        this.setState({loading: false})
    }

    async submitOnboarding(){
        const {
            salutationName, firstName, middleName, lastName, dob, fatherName, motherName, gender, maritalStatus, spouseName, marriageDate, selectedQualID, selectedQualName,
            selectedSkillID, selectedSkillName, selectedLangID, selectedLangName, selectedLangRWS, mobile1, mobile2, emailAddress, house, house2, pincode, pincode2, road, road2, 
            locality, locality2, countryID, countryName, country2ID, country2Name, stateID, stateName, state2ID, state2Name, cityID, cityName, city2ID, city2Name, sameAddress,
            baseURL
        } = this.state;
        const apiData = JSON.parse(this.props.route.params.apiData);
        const secretToken = await AsyncStorage.getItem('onboardingToken');
        const sendData = new FormData();
        sendData.append('id', apiData.draftId);
        sendData.append('page', apiData.currentPage);
        sendData.append('project_id', apiData.projectId);
        sendData.append('next', apiData.sectionData.links.next.page);
        //console.log("SUBMIT SUBMIT SUBMIT", secretToken)
        let personalDetails = {
            salutation: salutationName,
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            date_of_birth: dob,
            father_name: fatherName,
            mother_name: motherName,
            gender: gender.replace(/^\w/, (c) => c.toUpperCase()),
            marital_status: maritalStatus.replace(/^\w/, (c) => c.toUpperCase()),
            spouse_name: spouseName,
            marriage_date: marriageDate,
            qualifications: selectedQualID,
            qualifications_name: selectedQualName,
            skills: selectedSkillID,
            skills_name: selectedSkillName,
            languages: selectedLangID,
            lang_name: selectedLangName,
            lang: selectedLangRWS
        };
        const personalDetailsList = Object.keys(personalDetails);
        personalDetailsList.forEach((name, index) => {
            if(Array.isArray(personalDetails[name])){
                const data = personalDetails[name];
                data.forEach((item) => {
                    sendData.append(`personal[${name}][]`, item)
                })
            }else{
                if(typeof personalDetails[name] === 'object'){
                    const langIDArray = Object.keys(personalDetails[name]);
                    langIDArray.forEach((item) => {
                        const data = personalDetails[name][item];
                        if(Array.isArray(data)){
                            data.forEach((subName, _i) => {
                                sendData.append(`personal[${name}][${item}][]`, subName)
                            })
                        }else{
                            sendData.append(`personal[${name}][${item}]`, data)
                        }
                    })
                }else{
                    sendData.append(`personal[${[name]}]`, personalDetails[name])
                }
            }
        })
        let contactDetails = {
            dial_code: "+91",
            mobile_number: mobile1,
            alt_dial_code: "+91",
            alt_mobile_number: mobile2,
            email_id: emailAddress,
            permanent: {
                house_number: house,
                road: road,
                locality: locality,
                pincode: pincode,
                country_id: countryID,
                country: countryName,
                state_id: stateID,
                state: stateName,
                city_id: cityID,
                city: cityName 
            },
            same_as_permanent: (sameAddress)? 1 : 0,
            correspondence: {
                house_number: house2,
                road: road2,
                locality: locality2,
                pincode: pincode2,
                country_id: country2ID,
                country: country2Name,
                state_id: state2ID,
                state: state2Name,
                city_id: city2ID,
                city: city2Name 
            }
        }
        const contactDetailsList = Object.keys(contactDetails);
        contactDetailsList.forEach((name, index) => {
            if(typeof contactDetails[name] === 'object'){
                const data = contactDetails[name];
                const dataList = Object.keys(data);
                dataList.forEach((text) => {
                    sendData.append(`contact[${name}][${text}]`, contactDetails[name][text]);
                })
            }else{
                sendData.append(`contact[${[name]}]`, contactDetails[name]);
            }
        })
        console.log("###@@@^^^ SEND DATA: ", sendData);
        this.showLoader();
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
                this.props.navigation.navigate(parsedData.sectionData.links.currentPage.key,{apiData: JSON.stringify(parsedData)});
            }else{
                Alert.alert(parsedData.message, `${parsedData.errors}`);
            }
        }).catch((error) => {
            this.hideLoader();
            console.log("%%% ERROR: ", JSON.stringify(error, null, 4))
            if(error.response){
                const status = error.response.status;
                console.log("%%% ERROR2: ", error.response)
                Alert.alert("ERROR", `Error Code: ${status}603`);
            }else{
                alert(`${error}, API CODE: 603`)
            }
        })
    }

    dismissKeyboard(){
        Keyboard.dismiss();
    }

    selectLanguage(id){
        const {languageList} = this.state;
        const indexValue = languageList.findIndex((item) => {
            return (item.id === id)
        })
        languageList[indexValue]['selected'] = true;
        languageList[indexValue]['read'] = false;
        languageList[indexValue]['write'] = false;
        languageList[indexValue]['speak'] = true;
        const selected = languageList.filter((item) => {
            return (item.selected === true);
        })
        this.setState({
            languageList: this.state.languageList, selectedLanguage: selected, languageError: false
        }, () => this.updateLanguageSelection())
    }

    deselectLanguage(id){
        const {languageList, selectedLanguage} = this.state;
        const indexValue = languageList.findIndex((item) => {
            return (item.id === id)
        })
        languageList[indexValue]['selected'] = false;
        languageList[indexValue]['read'] = false;
        languageList[indexValue]['write'] = false;
        languageList[indexValue]['speak'] = true;
        const deselect = selectedLanguage.filter((item) => {
            return (item.id !== id)
        })
        this.setState({languageList: this.state.languageList, selectedLanguage: deselect}, () => {
            const {selectedLanguage} = this.state;
            console.log("DESELECT LANGUAGE: ", selectedLanguage)
            if(selectedLanguage.length === 0){
                this.setState({languageError: true})
            }
            this.updateLanguageSelection();
        })
    }

    updateLanguageSelection(){
        const {selectedLanguage} = this.state;
        let selectedLangID = [];
        selectedLangID = selectedLanguage.map((item) => {
            return item.id;
        })
        let selectedLangName = {};
        let selectedLangRWS = {};
        for(let i = 0; i < selectedLanguage.length; i++){let data = [];
            if(selectedLanguage[i]['read']){
                data.push('read');
            }
            if(selectedLanguage[i]['write']){
                data.push('write');
            }
            if(selectedLanguage[i]['speak']){
                data.push('speak');
            }
            Object.assign(selectedLangRWS, {
                [selectedLanguage[i].id]: data
            })
            Object.assign(selectedLangName, {[selectedLanguage[i].id]: selectedLanguage[i].name})
        }
        this.setState({
            selectedLangID, selectedLangName, selectedLangRWS
        }, () => {
            console.log("@@## SELECTED LANG ID: ", this.state.selectedLangID, this.state.selectedLangName, this.state.selectedLangRWS)
        })
    }

    updateQualificationSelection(){
        const {selectedQualification} = this.state;
        let selectedQualID = [];
        let selectedQualName = '';
        selectedQualID = selectedQualification.map((item, index) => {
            if((selectedQualification.length - 1) !== index){
                selectedQualName += `${item.name} ~~ `;
            }else{
                selectedQualName += item.name;
            }
            return item.id
        })
        this.setState({
            selectedQualID, selectedQualName
        }, () => console.log("SELECTED QUAL ID: ", this.state.selectedQualID, this.state.selectedQualName))
    }

    updateSkillSelection(){
        const {selectedSkills} = this.state;
        let selectedSkillID = [];
        let selectedSkillName = '';
        selectedSkillID = selectedSkills.map((item, index) => {
            if((selectedSkills.length - 1) !== index){
                selectedSkillName += `${item.name} ~~ `;
            }else{
                selectedSkillName += item.name;
            }
            return item.id
        })
        this.setState({
            selectedSkillID, selectedSkillName
        }, () => console.log("SELECTED SKILL ID: ", this.state.selectedSkillID, this.state.selectedSkillName))
    }

    updatedRWS(){
        const {languageList} = this.state;
        const selected = languageList.filter((item) => {
            return (item.selected === true);
        });
        this.setState({selectedLanguage: selected}, () => this.updateLanguageSelection());
    }

    cities = async(stateID, type = 'permanent') => {
        const {baseURL} = this.state;
        const apiData = JSON.parse(this.props.route.params.apiData);
        let oldContactData = null;
        if(apiData.sectionData.oldData){
            oldContactData = apiData.sectionData.oldData.contact;
        }
        this.showLoader();
        console.log("### STATE WISE CITIES: ", `${baseURL}/master/cities`)
        axios.post(`${baseURL}/master/cities`,
        {
            state_id: stateID
        },
        {
            headers: {
                'Accept': 'application/json',
            }
        }).then((response) => {
            this.hideLoader();
            console.log("@@@ STATE WISE CITIES: ", (response.data))
            const responseJson = response.data;
            if(type === 'permanent'){
                this.setState({cityList: responseJson.data.map((item) => {
                    return {...item, id: `${item.id}`}
                })}, () => {})
            }else if(type === 'correspondence'){
                this.setState({city2List: responseJson.data.map((item) => {
                    return {...item, id: `${item.id}`}
                })}, () => {})
            }
        }).catch((error) => {
            this.hideLoader();
            let status = null;
            if(error.response){
                status = error.response.status;
                Alert.alert("Error!!!", `ErrorCode: ${status}604.`)
            }else{
                alert(`${error}, API CODE: 604`)
            }
        })
    }

    render(){
        const {
            submit, salutationID, salutationName, salutationError, firstName, firstNameError, middleName, middleNameError, lastName, lastNameError,
            dob, dobError, fatherName, fatherNameError, motherName, motherNameError, maritalStatus, spouseName, spouseNameError, gender,
            marriageDate, marriageDateError, qualificationID, qualificationName, qualificationError, skillsID, skillsName, skillsError, languageID, 
            languageName, languageError, mobile1, mobile1Error, mobile2, mobile2Error, emailAddress, email, emailError, house, houseError, sameAddress,
            road, roadError, locality, localityError, countryID, countryName, countryError, stateID, stateName, stateError, cityID, cityName, cityError,
            cityList, house2, house2Error, road2, road2Error, locality2, locality2Error, country2ID, country2Name, country2Error,
            state2ID, state2Name, state2Error, city2ID, city2Name, city2Error, city2List, showQualificationList, animateQualification, animateSkills,
            qualificationList, showSkillsList, skillsList, selectedQualification, selectedSkills, languageList, showLanguageList, selectedLanguage,
            screens, showScreensList, pincode, pincodeError, pincode2, pincode2Error, loading, baseURL, dobMinDate, dobMaxDate, dobTimeStamp
        } = this.state;
        const apiData = JSON.parse(this.props.route.params.apiData);
        const projectName = apiData.projectName;
        const designation = apiData.designationName;
        const currentYear = moment().year();
        const month = '01';
        const minDate = `${currentYear - 75}-${month}-01`;
        const maxDate = `${currentYear - 18}-${moment().month() + 1}-${moment().date()}`;
        const single = 'single';
        const married = 'married';
        const widowed = 'widowed';
        const divorced = 'divorced';
        const male = 'male';
        const female = 'female';
        const transgender = 'transgender';
        let countryList = [];
        countryList = Array.isArray(apiData.sectionData.dropdown.countries) && apiData.sectionData.dropdown.countries.map((item) => {
            return {...item, id: `${item.id}`};
        });
        let stateList = [];
        stateList = Array.isArray(apiData.sectionData.dropdown.states) && apiData.sectionData.dropdown.states.map((item) => {
            return {...item, id: `${item.id}`};
        });
        let state2List = [];
        state2List = Array.isArray(apiData.sectionData.dropdown.states) && apiData.sectionData.dropdown.states.map((item) => {
            return {...item, id: `${item.id}`};
        });
        console.log("### EDIT DETAILS: ", cityList)
        const qualificationStyle = {
            width: animateQualification.interpolate({
                inputRange: [0, 1],
                outputRange: [getWidthnHeight(87).width, getWidthnHeight(77).width]
            }),
            height: getWidthnHeight(undefined, 6.5).height
        }
        return (
            <SafeAreaView style={[{alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: '#F6F6F6', flex: 1}]}>
                <StatusBar hidden={false} barStyle="dark-content" />
                <View style={{flex: 1, justifyContent: 'space-between'}}>
                    <View style={[{alignItems: 'center', flex: 1}, getWidthnHeight(100)]}>
                        <DismissKeyboard>
                            <View style={[{alignItems: 'center'}, getMarginTop((Platform.OS === "android")? 2 : 0.5)]}>
                                <LinearGradient 
                                start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                colors={[COLOR1, COLOR2]}
                                style={[{alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(93, 12)]}>
                                    <ImageBackground 
                                        resizeMode="cover"
                                        source={require('../Image/PeopleBG.png')} 
                                        style={[{
                                            position: 'absolute', opacity: 0.5}, getWidthnHeight(93, 12)
                                    ]}/>
                                    <Text style={[{color: 'white', fontSize: (fontSizeH3().fontSize + 3)}]}>{projectName}</Text> 
                                    <Text style={[{color: 'white', fontSize: (fontSizeH4().fontSize + 4)}]}>{designation}</Text> 
                                </LinearGradient>
                            </View>
                        </DismissKeyboard>
                        <View style={{flex: 1}}>
                            <KeyboardAvoidingView style={{alignItems: 'center'}} behavior={(Platform.OS === 'ios')? "padding" : null} keyboardVerticalOffset={(Platform.OS === 'ios')? getMarginTop(18).marginTop : null}>
                                <View style={[{
                                    alignItems: 'center', backgroundColor: 'white', shadowOpacity: 0.4, shadowColor: '#000000', shadowRadius: 2, elevation: 2, borderColor: 'red',
                                    borderWidth: 0, shadowOffset: {width: 0, height: 0}, flex: 1, ...Platform.select({android: getMarginVertical(2), ios: getMarginTop(2)})}]}> 
                                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" style={[{flex: 1}, getMarginVertical(1), getWidthnHeight(93)]}>
                                        <View style={{flex: 1, alignItems: 'center', zIndex: 1}}>
                                            <View style={[{alignSelf: 'flex-start'}, getMarginLeft(3)]}>
                                                <MaskedGradientText
                                                    title={"PERSONAL DETAILS"}
                                                    titleStyle={[{fontWeight: 'bold', color: '#000000', fontSize: (fontSizeH4().fontSize)}, styles.boldFont]}
                                                    start={{x: 0, y: 0}}
                                                    end={{x: 0.7, y: 0}}
                                                    colors={["#039FFD", "#EA304F"]}
                                                />
                                            </View>
                                            <View style={[{flexDirection: 'row', justifyContent: 'space-evenly'}, getWidthnHeight(93), getMarginTop(1)]}>
                                                <View style={[{
                                                    borderColor: (submit && salutationError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: getWidthnHeight(1).width,
                                                    borderStyle: (submit && salutationError)? 'dashed' : 'solid', borderWidth: (submit && salutationError)? 2 : 1,
                                                }, getWidthnHeight(42, 6.5)]}>
                                                    <Dropdown
                                                        containerStyle={[{textOverflow:'hidden', borderColor: '#C4C4C4', borderWidth: 0}, getWidthnHeight(42), getMarginTop(-1)]}
                                                        inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getWidthnHeight(42)]}
                                                        placeholder={'Select Salutation*'}
                                                        placeholderStyle={{color: '#C4C4C4', fontSize: fontSizeH4().fontSize, paddingLeft: getWidthnHeight(3).width}}
                                                        selectedTextStyle={[getMarginLeft(3)]}
                                                        data={salutationData}
                                                        valueField={'id'}
                                                        labelField={'name'}
                                                        onChange={(item) => {
                                                            console.log(item);
                                                            this.setState({
                                                                salutationName: item.name, salutationID: item.id, salutationError: false 
                                                            }, () => console.log("### SALVATION ID: ", this.state.salutationID))
                                                            this.dismissKeyboard();
                                                        }}
                                                        value={salutationID}
                                                    />
                                                </View>
                                                <View>
                                                    <AnimatedTextInput 
                                                        placeholder=" First Name* "
                                                        placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                        value={firstName}
                                                        slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                        slideHorizontal={[0, getWidthnHeight(-2).width]}
                                                        placeholderScale={[1, 0.75]}
                                                        autoFocus={false}
                                                        autoCapitalize={"words"}
                                                        onChangeText={(name) => {
                                                            const text = name.replace(/[^A-Za-z ]/gi,'');
                                                            this.setState({ firstName: text.trimLeft() }, () => {
                                                                const {firstName} = this.state;
                                                                if(firstName !== ''){
                                                                    this.setState({firstNameError: false})
                                                                }else{
                                                                    this.setState({firstName: '', firstNameError: true}, () => Keyboard.dismiss())
                                                                }
                                                            })
                                                        }}
                                                        clearText={() => this.setState({firstName: '', firstNameError: true})}
                                                        containerColor={[(submit && firstNameError)? 'red' : '#C4C4C4', (submit && firstNameError)? 'red' : '#C4C4C4']}
                                                        containerBorderWidth={[(submit && firstNameError)? 2 : 1, 1]}
                                                        containerStyle={[{
                                                            borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && firstNameError)? 'dashed' : 'solid',
                                                        }, getWidthnHeight(42, 6.5)]}
                                                        style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(40, 6.5), getMarginHorizontal(2)]}
                                                    />
                                                </View>
                                            </View>
                                            <View style={[{flexDirection: 'row', justifyContent: 'space-evenly'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                <View>
                                                    <AnimatedTextInput 
                                                        placeholder=" Middle Name "
                                                        placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                        value={middleName}
                                                        slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                        slideHorizontal={[0, getWidthnHeight(-2).width]}
                                                        placeholderScale={[1, 0.75]}
                                                        autoFocus={false}
                                                        autoCapitalize={"words"}
                                                        onChangeText={(name) => {
                                                            const text = name.replace(/[^A-Za-z ]/gi,'');
                                                            this.setState({ middleName: text.trimLeft() }, () => {
                                                                const {middleName} = this.state;
                                                                if(middleName === ''){
                                                                    Keyboard.dismiss();
                                                                }
                                                            })
                                                        }}
                                                        clearText={() => this.setState({middleName: ''})}
                                                        containerColor={['#C4C4C4', '#C4C4C4']}
                                                        containerBorderWidth={[1, 1]}
                                                        containerStyle={[{
                                                            borderRadius: getWidthnHeight(1).width, justifyContent: 'center',
                                                        }, getWidthnHeight(42, 6.5)]}
                                                        style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(40, 6.5), getMarginHorizontal(2)]}
                                                    />
                                                </View>
                                                <View>
                                                    <AnimatedTextInput 
                                                        placeholder=" Last Name "
                                                        placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                        value={lastName}
                                                        slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                        slideHorizontal={[0, getWidthnHeight(-2).width]}
                                                        placeholderScale={[1, 0.75]}
                                                        autoFocus={false}
                                                        autoCapitalize={"words"}
                                                        onChangeText={(name) => {
                                                            const text = name.replace(/[^A-Za-z ]/gi,'');
                                                            this.setState({ lastName: text.trimLeft() }, () => {
                                                                const {lastName} = this.state;
                                                                if(lastName !== ''){
                                                                    this.setState({lastNameError: false})
                                                                }else{
                                                                    this.setState({lastName: '', lastNameError: true}, () => Keyboard.dismiss())
                                                                }
                                                            })
                                                        }}
                                                        clearText={() => this.setState({lastName: '', lastNameError: true})}
                                                        containerColor={[(submit && lastNameError)? 'red' : '#C4C4C4', (submit && lastNameError)? 'red' : '#C4C4C4']}
                                                        containerBorderWidth={[(submit && lastNameError)? 2 : 1, 1]}
                                                        containerStyle={[{
                                                            borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && lastNameError)? 'dashed' : 'solid',
                                                        }, getWidthnHeight(42, 6.5)]}
                                                        style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(40, 6.5), getMarginHorizontal(2)]}
                                                    />
                                                </View>
                                            </View>
                                            <View style={[{alignItems: 'center'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                <AnimateDateLabel
                                                    containerColor={[(submit && dobError)? 'red' : '#C4C4C4', (submit && dobError)? 'red' : '#C4C4C4']}
                                                    containerBorderWidth={[(submit && dobError)? 2 : 1, 1]}
                                                    containerStyle={[{
                                                        borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && dobError)? 'dashed' : 'solid',
                                                    }, getWidthnHeight(87, 6.5)]}
                                                    slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                    slideHorizontal={[0, getWidthnHeight(-34.5).width]}
                                                    style={[{justifyContent: 'center', alignItems: 'center'}, getWidthnHeight(87, 6.5)]}
                                                    date={moment(dobTimeStamp).utc().toDate()}
                                                    dateValue={dob}
                                                    minDate={dobMinDate}
                                                    maxDate={dobMaxDate}
                                                    mode="date"
                                                    placeholder="Date of Birth*"
                                                    format="YYYY-MM-DD"
                                                    onDateChange={(date, fromTimeStamp) => {
                                                        this.setState({dob: date, dobError: false,  dobTimeStamp: fromTimeStamp}, () => {
                                                            Keyboard.dismiss();
                                                        })
                                                    }}
                                                />
                                            </View>
                                            <View style={[{alignItems: 'center'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                <AnimatedTextInput 
                                                    placeholder=" Father's Name* "
                                                    placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                    value={fatherName}
                                                    slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                    slideHorizontal={[0, getWidthnHeight(-3).width]}
                                                    placeholderScale={[1, 0.75]}
                                                    autoFocus={false}
                                                    autoCapitalize={"words"}
                                                    onChangeText={(name) => {
                                                        const text = name.replace(/[^A-Za-z ]/gi,'');
                                                        this.setState({ fatherName: text.trimLeft() }, () => {
                                                            const {fatherName} = this.state;
                                                            if(fatherName !== ''){
                                                                this.setState({fatherNameError: false})
                                                            }else{
                                                                this.setState({fatherName: '', fatherNameError: true}, () => Keyboard.dismiss())
                                                            }
                                                        })
                                                    }}
                                                    clearText={() => this.setState({fatherName: '', fatherNameError: true})}
                                                    containerColor={[(submit && fatherNameError)? 'red' : '#C4C4C4', (submit && fatherNameError)? 'red' : '#C4C4C4']}
                                                    containerBorderWidth={[(submit && fatherNameError)? 2 : 1, 1]}
                                                    containerStyle={[{
                                                        borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && fatherNameError)? 'dashed' : 'solid',
                                                    }, getWidthnHeight(87, 6.5)]}
                                                    style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(85, 6.5), getMarginHorizontal(2)]}
                                                />
                                            </View>
                                            <View style={[{alignItems: 'center'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                <AnimatedTextInput 
                                                    placeholder=" Mother's Name* "
                                                    placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                    value={motherName}
                                                    slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                    slideHorizontal={[0, getWidthnHeight(-3).width]}
                                                    placeholderScale={[1, 0.75]}
                                                    autoFocus={false}
                                                    autoCapitalize={"words"}
                                                    onChangeText={(name) => {
                                                        const text = name.replace(/[^A-Za-z ]/gi,'');
                                                        this.setState({ motherName: text.trimLeft() }, () => {
                                                            const {motherName} = this.state;
                                                            if(motherName !== ''){
                                                                this.setState({motherNameError: false})
                                                            }else{
                                                                this.setState({motherName: '', motherNameError: true}, () => Keyboard.dismiss())
                                                            }
                                                        })
                                                    }}
                                                    clearText={() => this.setState({motherName: '', motherNameError: true})}
                                                    containerColor={[(submit && motherNameError)? 'red' : '#C4C4C4', (submit && motherNameError)? 'red' : '#C4C4C4']}
                                                    containerBorderWidth={[(submit && motherNameError)? 2 : 1, 1]}
                                                    containerStyle={[{
                                                        borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && motherNameError)? 'dashed' : 'solid',
                                                    }, getWidthnHeight(87, 6.5)]}
                                                    style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(85, 6.5), getMarginHorizontal(2)]}
                                                />
                                            </View>
                                            <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                <TouchableOpacity activeOpacity={0.8} onPress={() => this.setState({gender: male})}>
                                                    <View style={[{
                                                        alignItems: 'center', justifyContent: 'center', backgroundColor: (gender === male)? 'rgb(19,111,232)' : '#E1F2F9',
                                                        borderTopLeftRadius: getWidthnHeight(1).width, borderBottomLeftRadius: getWidthnHeight(1).width
                                                        }, getWidthnHeight(25, 4)]}>
                                                        <Text style={[{color: (gender === male)? 'white' : 'black', fontSize: (fontSizeH4().fontSize + 1)}]}>Male</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity activeOpacity={0.8} onPress={() => this.setState({gender: female})}>
                                                    <View style={[{
                                                        alignItems: 'center', justifyContent: 'center', backgroundColor: (gender === female)? 'rgb(19,111,232)' : '#E1F2F9'
                                                        }, getWidthnHeight(25, 4)]}>
                                                        <Text style={[{color: (gender === female)? 'white' : 'black', fontSize: (fontSizeH4().fontSize + 1)}]}>Female</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity activeOpacity={0.8} onPress={() => this.setState({gender: transgender})}>
                                                    <View style={[{
                                                        alignItems: 'center', justifyContent: 'center', backgroundColor: (gender === transgender)? 'rgb(19,111,232)' : '#E1F2F9',
                                                        borderTopRightRadius: getWidthnHeight(1).width, borderBottomRightRadius: getWidthnHeight(1).width
                                                        }, getWidthnHeight(29, 4)]}>
                                                        <Text style={[{color: (gender === transgender)? 'white' : 'black', fontSize: (fontSizeH4().fontSize + 1)}]}>Transgender</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}, getWidthnHeight(93), getMarginTop(2), getMarginBottom(1)]}>
                                                <TouchableOpacity 
                                                    activeOpacity={0.8} 
                                                    onPress={() => this.setState({
                                                        maritalStatus: single, spouseName: '', spouseNameError: true,
                                                        marriageDate: '', marriageDateError: true
                                                })}>
                                                    <View style={{alignItems: 'center'}}>
                                                        <View style={[{
                                                            width: getWidthnHeight(10).width, height: getWidthnHeight(10).width,
                                                            backgroundColor: (maritalStatus === single)? 'rgb(19,111,232)' : '#E1F2F9',
                                                            borderRadius: getWidthnHeight(6).width, alignItems: 'center', justifyContent: 'center'
                                                        }]}>
                                                            <Text style={[{color: (maritalStatus === single)? 'white' : 'black', fontSize: (fontSizeH3().fontSize + 0)}]}>S</Text>
                                                        </View>
                                                        <Text style={[{color: (maritalStatus === single)? 'black' : '#C4C4C4', fontSize: (fontSizeH4().fontSize - 2)}]}>SINGLE</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity activeOpacity={0.8} onPress={() => this.setState({maritalStatus: married})}>
                                                    <View style={{alignItems: 'center'}}>
                                                        <View style={[{
                                                            width: getWidthnHeight(10).width, height: getWidthnHeight(10).width,
                                                            backgroundColor: (maritalStatus === married)? 'rgb(19,111,232)' : '#E1F2F9',
                                                            borderRadius: getWidthnHeight(6).width, alignItems: 'center', justifyContent: 'center'
                                                        }]}>
                                                            <Text style={[{color: (maritalStatus === married)? 'white' : 'black', fontSize: (fontSizeH3().fontSize + 0)}]}>M</Text>
                                                        </View>
                                                        <Text style={[{color: (maritalStatus === married)? 'black' : '#C4C4C4', fontSize: (fontSizeH4().fontSize - 2)}]}>MARRIED</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity  
                                                    activeOpacity={0.8} 
                                                    onPress={() => this.setState({
                                                        maritalStatus: widowed, spouseName: '', spouseNameError: true,
                                                        marriageDate: '', marriageDateError: true
                                                })}>
                                                    <View style={{alignItems: 'center'}}>
                                                        <View style={[{
                                                            width: getWidthnHeight(10).width, height: getWidthnHeight(10).width,
                                                            backgroundColor: (maritalStatus === widowed)? 'rgb(19,111,232)' : '#E1F2F9',
                                                            borderRadius: getWidthnHeight(6).width, alignItems: 'center', justifyContent: 'center'
                                                        }]}>
                                                            <Text style={[{color: (maritalStatus === widowed)? 'white' : 'black', fontSize: (fontSizeH3().fontSize + 0)}]}>W</Text>
                                                        </View>
                                                        <Text style={[{color: (maritalStatus === widowed)? 'black' : '#C4C4C4', fontSize: (fontSizeH4().fontSize - 2)}]}>WIDOWED</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity 
                                                    activeOpacity={0.8} 
                                                    onPress={() => this.setState({
                                                        maritalStatus: divorced, spouseName: '', spouseNameError: true,
                                                        marriageDate: '', marriageDateError: true
                                                })}>
                                                    <View style={{alignItems: 'center'}}>
                                                        <View style={[{
                                                            width: getWidthnHeight(10).width, height: getWidthnHeight(10).width,
                                                            backgroundColor: (maritalStatus === divorced)? 'rgb(19,111,232)' : '#E1F2F9',
                                                            borderRadius: getWidthnHeight(6).width, alignItems: 'center', justifyContent: 'center'
                                                        }]}>
                                                            <Text style={[{color: (maritalStatus === divorced)? 'white' : 'black', fontSize: (fontSizeH3().fontSize + 0)}]}>D</Text>
                                                        </View>
                                                        <Text style={[{color: (maritalStatus === divorced)? 'black' : '#C4C4C4', fontSize: (fontSizeH4().fontSize - 2)}]}>DIVORCED</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                            {(maritalStatus === 'married') && (
                                                <View style={[{alignItems: 'center'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                    <View style={[{alignItems: 'center'}, getWidthnHeight(93), getMarginTop(0)]}>
                                                        <AnimatedTextInput 
                                                            placeholder=" Spouse Name* "
                                                            placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                            value={spouseName}
                                                            slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                            slideHorizontal={[0, getWidthnHeight(-3).width]}
                                                            placeholderScale={[1, 0.75]}
                                                            autoFocus={false}
                                                            autoCapitalize={"words"}
                                                            onChangeText={(name) => {
                                                                const text = name.replace(/[^A-Za-z ]/gi,'');
                                                                this.setState({ spouseName: text.trimLeft() }, () => {
                                                                    const {spouseName} = this.state;
                                                                    if(spouseName !== ''){
                                                                        this.setState({spouseNameError: false})
                                                                    }else{
                                                                        this.setState({spouseName: '', spouseNameError: true}, () => Keyboard.dismiss())
                                                                    }
                                                                })
                                                            }}
                                                            clearText={() => this.setState({spouseName: '', spouseNameError: true})}
                                                            containerColor={[(submit && spouseNameError)? 'red' : '#C4C4C4', (submit && spouseNameError)? 'red' : '#C4C4C4']}
                                                            containerBorderWidth={[(submit && spouseNameError)? 2 : 1, 1]}
                                                            containerStyle={[{
                                                                borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && spouseNameError)? 'dashed' : 'solid',
                                                            }, getWidthnHeight(87, 6.5)]}
                                                            style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(85, 6.5), getMarginHorizontal(2)]}
                                                        />
                                                    </View>
                                                    <View style={[{alignItems: 'center'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                        <AnimateDateLabel
                                                            containerColor={[(submit && marriageDateError)? 'red' : '#C4C4C4', (submit && marriageDateError)? 'red' : '#C4C4C4']}
                                                            containerBorderWidth={[(submit && marriageDateError)? 2 : 1, 1]}
                                                            containerStyle={[{
                                                                borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && marriageDateError)? 'dashed' : 'solid',
                                                            }, getWidthnHeight(87, 6.5)]}
                                                            slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                            slideHorizontal={[0, getWidthnHeight(-32).width]}
                                                            style={[{justifyContent: 'center'}, getWidthnHeight(87, 6.5)]}
                                                            date={marriageDate}
                                                            minDate={`${currentYear - 75}-01-01`}
                                                            maxDate={`${moment().year()}-${moment().month() +1 }-${moment().date()}`}
                                                            mode="date"
                                                            placeholder="Date of Marriage*"
                                                            format="YYYY-MM-DD"
                                                            onDateChange={(date) => {this.setState({marriageDate: date, marriageDateError: false}, () => {
                                                                Keyboard.dismiss();
                                                            })}}
                                                        />
                                                    </View>
                                                </View>
                                            )}
                                            <View style={[{alignItems: 'center'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                <TouchableOpacity 
                                                    onPress={() => this.setState({showQualificationList: true}, () => Keyboard.dismiss())}
                                                    activeOpacity={0.6} 
                                                    style={{flex: 1}}
                                                >
                                                    <CheckList 
                                                        containerStyle={[{
                                                            borderColor: (submit && qualificationError)? 'red' : '#C4C4C4', justifyContent: 'space-between', borderRadius: getWidthnHeight(1).width,
                                                            borderStyle: (submit && qualificationError)? 'dashed' : 'solid', borderWidth: (submit && qualificationError)? 2 : 1,
                                                            flexDirection: 'row', alignItems: 'center'
                                                        }, getWidthnHeight(87, 6.5)]}
                                                        isVisible={showQualificationList}
                                                        toggle={() => this.setState({showQualificationList: false}, () => Keyboard.dismiss())}
                                                        title={"Qualification*"}
                                                        titleStyle={[{color: COLOR1}]}
                                                        checkBoxColor={COLOR1}
                                                        underLayColor={COLOR2}
                                                        data={qualificationList}
                                                        selectedList={selectedQualification}
                                                        selectFunction={(id, index) => this.selectQualFunction(id)}
                                                        deselectFunction={(id, index) => {
                                                            const indexValue = qualificationList.findIndex((item) => {
                                                                return (item.id === id)
                                                            })
                                                            qualificationList[indexValue]['selected'] = false;
                                                            const deselect = selectedQualification.filter((item) => {
                                                                return (item.id !== id)
                                                            })
                                                            this.setState({
                                                                qualificationList: this.state.qualificationList, selectedQualification: deselect
                                                            }, () => {
                                                                const {selectedQualification} = this.state;
                                                                if(selectedQualification.length === 0){
                                                                    this.setState({qualificationError: true})
                                                                }
                                                                this.updateQualificationSelection();
                                                            })
                                                        }}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={[{alignItems: 'center'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                <TouchableOpacity 
                                                    onPress={() => this.setState({showSkillsList: true}, () => Keyboard.dismiss())}
                                                    activeOpacity={0.6} 
                                                    style={{flex: 1}}
                                                >
                                                    <CheckList 
                                                        containerStyle={[{
                                                            borderColor: (submit && skillsError)? 'red' : '#C4C4C4', justifyContent: 'space-between', borderRadius: getWidthnHeight(1).width,
                                                            borderStyle: (submit && skillsError)? 'dashed' : 'solid', borderWidth: (submit && skillsError)? 2 : 1,
                                                            flexDirection: 'row', alignItems: 'center'
                                                        }, getWidthnHeight(87, 6.5)]}
                                                        isVisible={showSkillsList}
                                                        toggle={() => this.setState({showSkillsList: false}, () => Keyboard.dismiss())}
                                                        title={"Skills*"}
                                                        titleStyle={[{color: COLOR1}]}
                                                        checkBoxColor={COLOR1}
                                                        underLayColor={COLOR2}
                                                        data={skillsList}
                                                        selectedList={selectedSkills}
                                                        selectFunction={(id, index) => this.selectSkillFunction(id)}
                                                        deselectFunction={(id, index) => {
                                                            const indexValue = skillsList.findIndex((item) => {
                                                                return (item.id === id)
                                                            })
                                                            skillsList[indexValue]['selected'] = false;
                                                            const deselect = selectedSkills.filter((item) => {
                                                                return (item.id !== id)
                                                            })
                                                            this.setState({skillsList: this.state.skillsList, selectedSkills: deselect}, () => {
                                                                const {selectedSkills} = this.state;
                                                                console.log("DESELECT SKILLS: ", selectedSkills)
                                                                if(selectedSkills.length === 0){
                                                                    this.setState({skillsError: true})
                                                                }
                                                                this.updateSkillSelection();
                                                            })
                                                        }}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={[{alignItems: 'center'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                <TouchableOpacity 
                                                    onPress={() => this.setState({showLanguageList: true}, () => Keyboard.dismiss())}
                                                    activeOpacity={0.6} 
                                                    style={{flex: 1}}
                                                >
                                                    <LanguageSelection 
                                                        containerStyle={[{
                                                            borderColor: (submit && languageError)? 'red' : '#C4C4C4', justifyContent: 'space-between', borderRadius: getWidthnHeight(1).width,
                                                            borderStyle: (submit && languageError)? 'dashed' : 'solid', borderWidth: (submit && languageError)? 2 : 1,
                                                            flexDirection: 'row', alignItems: 'center'
                                                        }, getWidthnHeight(87, 6.5)]}
                                                        isVisible={showLanguageList}
                                                        toggle={() => this.setState({showLanguageList: false}, () => Keyboard.dismiss())}
                                                        title={"Language*"}
                                                        titleStyle={[{color: COLOR1}]}
                                                        checkBoxColor={COLOR1}
                                                        overLayColor={"rgb(19,111,232)"}
                                                        underLayColor={'#E1F2F9'}
                                                        data={languageList}
                                                        selectFunction={this.selectLanguage.bind(this)}
                                                        deselectFunction={this.deselectLanguage.bind(this)}
                                                        addRemoveRead={(id) => {
                                                            const indexValue = languageList.findIndex((item) => {
                                                                return (item.id === id);
                                                            })
                                                            languageList[indexValue]['read'] = !languageList[indexValue]['read'];
                                                            if(!languageList[indexValue]['read'] && !languageList[indexValue]['write'] && !languageList[indexValue]['speak']){
                                                                languageList[indexValue]['read'] = !languageList[indexValue]['read'];
                                                            }
                                                            this.setState({
                                                                languageList: this.state.languageList
                                                            }, () => {
                                                                this.updatedRWS();
                                                            })
                                                        }}
                                                        addRemoveWrite={(id) => {
                                                            const indexValue = languageList.findIndex((item) => {
                                                                return (item.id === id);
                                                            })
                                                            languageList[indexValue]['write'] = !languageList[indexValue]['write'];
                                                            if(!languageList[indexValue]['read'] && !languageList[indexValue]['write'] && !languageList[indexValue]['speak']){
                                                                languageList[indexValue]['write'] = !languageList[indexValue]['write'];
                                                            }
                                                            this.setState({
                                                                languageList: this.state.languageList
                                                            }, () => {
                                                                this.updatedRWS();
                                                            })
                                                        }}
                                                        addRemoveSpeak={(id) => {
                                                            const indexValue = languageList.findIndex((item) => {
                                                                return (item.id === id);
                                                            })
                                                            languageList[indexValue]['speak'] = !languageList[indexValue]['speak'];
                                                            if(!languageList[indexValue]['read'] && !languageList[indexValue]['write'] && !languageList[indexValue]['speak']){
                                                                languageList[indexValue]['speak'] = !languageList[indexValue]['speak'];
                                                            }
                                                            this.setState({
                                                                languageList: this.state.languageList
                                                            }, () => {
                                                                this.updatedRWS();
                                                            })
                                                        }}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            {(selectedLanguage.length > 0) && (
                                                <View style={[getWidthnHeight(87)]}>
                                                    <FlatList 
                                                        data={selectedLanguage}
                                                        keyExtractor={(item) => item.id}
                                                        renderItem={({item, index}) => {
                                                            return(
                                                                <View style={[{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, getWidthnHeight(87), getMarginTop(1)]}>
                                                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                                        <TouchableOpacity activeOpacity={0.8} onPress={() => {this.deselectLanguage(item.id)}}>
                                                                            <View style={[{
                                                                                width: getWidthnHeight(9).width, height: getWidthnHeight(9).width, borderRadius: getWidthnHeight(4.5).width,
                                                                                backgroundColor: 'red', alignItems: 'center', justifyContent: 'center'
                                                                            }]}>
                                                                                <Delete name="trash-sharp" color="#FFFFFF" size={getWidthnHeight(6).width}/>
                                                                            </View>
                                                                        </TouchableOpacity>
                                                                        <Text style={[{fontSize: (fontSizeH4().fontSize + 2)}, getMarginLeft(3)]}>{item.name}</Text>
                                                                    </View>
                                                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                                        {(item.read) && (
                                                                            <View style={[{
                                                                                width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, borderRadius: getWidthnHeight(3.5).width,
                                                                                backgroundColor: '#6ECB63', alignItems: 'center', justifyContent: 'center'
                                                                            }, getMarginRight(2)]}>
                                                                                <Text style={[{color: '#FFFFFF', fontSize: (fontSizeH4().fontSize + 1)}]}>R</Text>
                                                                            </View>
                                                                        )}
                                                                        {(item.write) && (
                                                                            <View style={[{
                                                                                width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, borderRadius: getWidthnHeight(3.5).width,
                                                                                backgroundColor: '#6ECB63', alignItems: 'center', justifyContent: 'center'
                                                                            }, getMarginRight(2)]}>
                                                                                <Text style={[{color: '#FFFFFF', fontSize: (fontSizeH4().fontSize + 1)}]}>W</Text>
                                                                            </View>
                                                                        )}
                                                                        {(item.speak) && (
                                                                            <View style={[{
                                                                                width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, borderRadius: getWidthnHeight(3.5).width,
                                                                                backgroundColor: '#6ECB63', alignItems: 'center', justifyContent: 'center'
                                                                            }]}>
                                                                                <Text style={[{color: '#FFFFFF', fontSize: (fontSizeH4().fontSize + 1)}]}>S</Text>
                                                                            </View>
                                                                        )}
                                                                    </View>
                                                                </View>
                                                            );
                                                        }}
                                                    />
                                                </View>
                                            )}
                                            <View style={[{backgroundColor: 'rgba(196, 196, 196, 0.5)', height: 1}, getWidthnHeight(87), getMarginTop((selectedLanguage.length === 0)? 3 : 1)]}/>
                                            <View style={[{alignSelf: 'flex-start'}, getMarginLeft(3), getMarginTop(1)]}>
                                                <MaskedGradientText
                                                    title={"CONTACT DETAILS"}
                                                    titleStyle={[{fontWeight: 'bold', color: '#000000', fontSize: (fontSizeH4().fontSize)}, styles.boldFont]}
                                                    start={{x: 0, y: 0}}
                                                    end={{x: 0.7, y: 0}}
                                                    colors={["#039FFD", "#EA304F"]}
                                                />
                                            </View>
                                            <View style={[{flexDirection: 'row', justifyContent: 'space-evenly'}, getWidthnHeight(93), getMarginTop(1.5)]}>
                                                <View>
                                                    <AnimatedTextInput 
                                                        placeholder=" Mobile Number* "
                                                        placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                        value={mobile1}
                                                        editable={(mobile1)? false : true}
                                                        slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                        slideHorizontal={[0, getWidthnHeight(-3).width]}
                                                        placeholderScale={[1, 0.75]}
                                                        keyboardType={'numeric'}
                                                        maxLength={10}
                                                        autoFocus={false}
                                                        onChangeText={(number) => {
                                                            this.setState({ mobile1: number.replace(/[^0-9]/g, '')}, () => {
                                                                const {mobile1} = this.state;
                                                                if(mobile1 !== ''){
                                                                    this.setState({mobile1Error: false})
                                                                }else{
                                                                    this.setState({mobile1: '', mobile1Error: true}, () => Keyboard.dismiss())
                                                                }
                                                            })
                                                        }}
                                                        clearText={() => this.setState({mobile1: '', mobile1Error: true})}
                                                        containerColor={[(submit && mobile1Error)? 'red' : '#C4C4C4', (submit && mobile1Error)? 'red' : '#C4C4C4']}
                                                        containerBorderWidth={[(submit && mobile1Error)? 2 : 1, 1]}
                                                        containerStyle={[{
                                                            borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && mobile1Error)? 'dashed' : 'solid',
                                                        }, getWidthnHeight(42, 6.5)]}
                                                        style={[{color: 'grey', borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(40, 6.5), getMarginHorizontal(2)]}
                                                    />
                                                </View>
                                                <View>
                                                    <AnimatedTextInput 
                                                        placeholder=" Alt. Mobile Number "
                                                        placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                        value={mobile2}
                                                        slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                        slideHorizontal={[0, getWidthnHeight(-3.3).width]}
                                                        placeholderScale={[1, 0.75]}
                                                        keyboardType={'numeric'}
                                                        maxLength={10}
                                                        autoFocus={false}
                                                        onChangeText={(number) => {
                                                            this.setState({ mobile2: number.replace(/[^0-9]/g, '')}, () => {
                                                                const {mobile2} = this.state;
                                                                if(mobile2 !== '' && mobile2.length === 10){
                                                                    this.setState({mobile2Error: false})
                                                                }else if(mobile2 === ''){
                                                                    this.setState({mobile2Error: true}, () => Keyboard.dismiss())
                                                                }else if(mobile2.length < 10){
                                                                    this.setState({mobile2Error: true})
                                                                }
                                                            })
                                                        }}
                                                        clearText={() => this.setState({mobile2: '', mobile2Error: true})}
                                                        containerColor={[(submit && mobile2Error && mobile2)? 'red' : '#C4C4C4', (submit && mobile2Error && mobile2)? 'red' : '#C4C4C4']}
                                                        containerBorderWidth={[(submit && mobile2Error && mobile2)? 2 : 1, 1]}
                                                        containerStyle={[{
                                                            borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && mobile2Error && mobile2)? 'dashed' : 'solid',
                                                        }, getWidthnHeight(42, 6.5)]}
                                                        style={[{
                                                            borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2),
                                                            color: (mobile2Error)? 'red' : 'black'
                                                        }, getWidthnHeight(40, 6.5), getMarginHorizontal(2)]}
                                                    />
                                                </View>
                                            </View>
                                            <View style={[{alignItems: 'center'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                <AnimatedTextInput 
                                                    placeholder=" E-mail* "
                                                    placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                    value={emailAddress}
                                                    slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                    slideHorizontal={[0, getWidthnHeight(-1).width]}
                                                    placeholderScale={[1, 0.75]}
                                                    autoFocus={false}
                                                    onChangeText={(text) => {
                                                        const check = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                                        if(check.test(String(text).toLowerCase())){
                                                            this.setState({email: true, emailError: false, emailAddress: text})
                                                        }else{
                                                            this.setState({email: false, emailError: true, emailAddress: text}, () => {
                                                                if(this.state.emailAddress === ''){
                                                                    Keyboard.dismiss();
                                                                }
                                                            })
                                                        }
                                                    }}
                                                    clearText={() => this.setState({email: false, emailAddress: '', emailError: true})}
                                                    containerColor={[(submit && emailError && emailAddress !== '')? 'red' : '#C4C4C4', (submit && emailError && emailAddress !== '')? 'red' : '#C4C4C4']}
                                                    containerBorderWidth={[(submit && emailError && emailAddress !== '')? 2 : 1, 1]}
                                                    containerStyle={[{
                                                        borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && emailError && emailAddress !== '')? 'dashed' : 'solid',
                                                    }, getWidthnHeight(87, 6.5)]}
                                                    style={[{
                                                        borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2),
                                                        color: (email)? '#01937C' : '#CD113B'
                                                    }, getWidthnHeight(85, 6.5), getMarginHorizontal(2)]}
                                                />
                                            </View>
                                            <View style={[{backgroundColor: 'rgba(196, 196, 196, 0.5)', height: 1}, getWidthnHeight(87), getMarginTop(3)]}/>
                                            <View style={[{alignSelf: 'flex-start'}, getMarginLeft(3), getMarginTop(1)]}>
                                                <MaskedGradientText
                                                    title={"PERMANENT ADDRESS"}
                                                    titleStyle={[{fontWeight: 'bold', color: '#000000', fontSize: (fontSizeH4().fontSize)}, styles.boldFont]}
                                                    start={{x: 0, y: 0}}
                                                    end={{x: 0.7, y: 0}}
                                                    colors={["#039FFD", "#EA304F"]}
                                                />
                                            </View>
                                            <View style={[{alignItems: 'center'}, getWidthnHeight(93), getMarginTop(1.5)]}>
                                                <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, getWidthnHeight(87), getMarginTop(1.5)]}>
                                                    <AnimatedTextInput 
                                                        placeholder=" House Number* "
                                                        placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                        value={house}
                                                        slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                        slideHorizontal={[0, getWidthnHeight(-3).width]}
                                                        placeholderScale={[1, 0.75]}
                                                        autoFocus={false}
                                                        autoCapitalize={"words"}
                                                        onChangeText={(text) => {
                                                            this.setState({ house: text.trimLeft() }, () => {
                                                                const {house} = this.state;
                                                                if(house !== ''){
                                                                    this.setState({houseError: false})
                                                                }else{
                                                                    this.setState({house: '', houseError: true}, () => Keyboard.dismiss())
                                                                }
                                                            })
                                                        }}
                                                        clearText={() => this.setState({house: '', houseError: true})}
                                                        containerColor={[(submit && houseError)? 'red' : '#C4C4C4', (submit && houseError)? 'red' : '#C4C4C4']}
                                                        containerBorderWidth={[(submit && houseError)? 2 : 1, 1]}
                                                        containerStyle={[{
                                                            borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && houseError)? 'dashed' : 'solid',
                                                        }, getWidthnHeight(54, 6.5)]}
                                                        style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(52, 6.5), getMarginHorizontal(2)]}
                                                    />
                                                    <AnimatedTextInput 
                                                        placeholder=" Pincode* "
                                                        placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                        value={pincode}
                                                        slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                        slideHorizontal={[0, getWidthnHeight(-2).width]}
                                                        placeholderScale={[1, 0.75]}
                                                        keyboardType={'numeric'}
                                                        maxLength={6}
                                                        autoFocus={false}
                                                        onChangeText={(number) => {
                                                            this.setState({ pincode: number.replace(/[^0-9]/g, '')}, () => {
                                                                const {pincode} = this.state;
                                                                if(pincode.length === 6){
                                                                    this.setState({pincodeError: false})
                                                                }else if(pincode === ''){
                                                                    this.setState({pincodeError: true}, () => Keyboard.dismiss())
                                                                }else if(pincode.length < 6){
                                                                    this.setState({pincodeError: true});
                                                                }
                                                            })
                                                        }}
                                                        clearText={() => this.setState({pincode: '', pincodeError: true})}
                                                        containerColor={[(submit && pincodeError)? 'red' : '#C4C4C4', (submit && pincodeError)? 'red' : '#C4C4C4']}
                                                        containerBorderWidth={[(submit && pincodeError)? 2 : 1, 1]}
                                                        containerStyle={[{
                                                            borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && pincodeError)? 'dashed' : 'solid',
                                                        }, getWidthnHeight(30, 6.5)]}
                                                        style={[{
                                                            borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2),
                                                            color: (pincodeError)? 'red' : 'black'
                                                        }, getWidthnHeight(28, 6.5), getMarginHorizontal(2)]}
                                                    />
                                                </View>
                                            </View>
                                            <View style={[{alignItems: 'center'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                <AnimatedTextInput 
                                                    placeholder=" Road/Street* "
                                                    placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                    value={road}
                                                    slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                    slideHorizontal={[0, getWidthnHeight(-2.7).width]}
                                                    placeholderScale={[1, 0.75]}
                                                    autoFocus={false}
                                                    autoCapitalize={"words"}
                                                    onChangeText={(text) => {
                                                        this.setState({ road: text.trimLeft() }, () => {
                                                            const {road} = this.state;
                                                            if(road !== ''){
                                                                this.setState({roadError: false})
                                                            }else{
                                                                this.setState({road: '', roadError: true}, () => Keyboard.dismiss())
                                                            }
                                                        })
                                                    }}
                                                    clearText={() => this.setState({road: '', roadError: true})}
                                                    containerColor={[(submit && roadError)? 'red' : '#C4C4C4', (submit && roadError)? 'red' : '#C4C4C4']}
                                                    containerBorderWidth={[(submit && roadError)? 2 : 1, 1]}
                                                    containerStyle={[{
                                                        borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && roadError)? 'dashed' : 'solid',
                                                    }, getWidthnHeight(87, 6.5)]}
                                                    style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(85, 6.5), getMarginHorizontal(2)]}
                                                />
                                            </View>
                                            <View style={[{alignItems: 'center'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                <AnimatedTextInput 
                                                    placeholder=" Locality/Area* "
                                                    placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                    value={locality}
                                                    slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                    slideHorizontal={[0, getWidthnHeight(-2.7).width]}
                                                    placeholderScale={[1, 0.75]}
                                                    autoFocus={false}
                                                    autoCapitalize={"words"}
                                                    onChangeText={(text) => {
                                                        this.setState({ locality: text.trimLeft() }, () => {
                                                            const {locality} = this.state;
                                                            if(locality !== ''){
                                                                this.setState({localityError: false})
                                                            }else{
                                                                this.setState({locality: '', localityError: true}, () => Keyboard.dismiss())
                                                            }
                                                        })
                                                    }}
                                                    clearText={() => this.setState({locality: '', localityError: true})}
                                                    containerColor={[(submit && localityError)? 'red' : '#C4C4C4', (submit && localityError)? 'red' : '#C4C4C4']}
                                                    containerBorderWidth={[(submit && localityError)? 2 : 1, 1]}
                                                    containerStyle={[{
                                                        borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && localityError)? 'dashed' : 'solid',
                                                    }, getWidthnHeight(87, 6.5)]}
                                                    style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(85, 6.5), getMarginHorizontal(2)]}
                                                />
                                            </View>
                                            <View style={[{alignItems: 'flex-end'}, getWidthnHeight(93)]}>
                                                <Dropdown
                                                    style={[{borderColor: '#C4C4C4', borderWidth: 0, justifyContent: 'center'}, getWidthnHeight(20, 4), getMarginRight(3)]}
                                                    containerStyle={{marginHorizontal: getMarginHorizontal(3).marginHorizontal, width: '100%'}}
                                                    inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getMarginTop(0)]}
                                                    placeholder='Select Country*'
                                                    placeholderStyle={{color: '#C4C4C4', fontSize: fontSizeH4().fontSize, paddingHorizontal: getWidthnHeight(3).width}}
                                                    selectedTextStyle={[getMarginLeft(3)]}
                                                    data={countryList}
                                                    valueField={'id'}
                                                    labelField={'name'}
                                                    onChange={(item) => {
                                                        console.log(item);
                                                        this.setState({
                                                            countryName: item.name, countryID: item.id, countryError: false 
                                                        }, () => console.log("### COUNTRY ID: ", this.state.countryID))
                                                        this.dismissKeyboard();
                                                    }}
                                                    value={countryID}
                                                />
                                            </View>
                                            <View 
                                                style={[{
                                                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'
                                            }, getMarginTop(0), getWidthnHeight(90)]}>
                                                {/* <SearchableDropDown 
                                                    placeholder=" State* "
                                                    data={apiData.sectionData.dropdown.states}
                                                    value={stateName}
                                                    style={[{
                                                        borderColor: (submit && stateError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: getWidthnHeight(1).width,
                                                        borderStyle: (submit && stateError)? 'dashed' : 'solid', borderWidth: (submit && stateError)? 2 : 1,
                                                    }, getWidthnHeight(42, 6.5)]}
                                                    searchStyle={[getWidthnHeight(34, 6.5)]}
                                                    slidePlaceHolderVertical={[0, getMarginTop(-3.1).marginTop]}
                                                    slidePlaceHolderHorizontal={[0, getMarginLeft(-1.5).marginLeft]}
                                                    labelStyle={[{fontSize: fontSizeH4().fontSize + 2}]}
                                                    dropDownSize={[getWidthnHeight(42, 20)]}
                                                    dropDownPosition={{top: getWidthnHeight(undefined, -26.5).height}}
                                                    textBoxSize={[getWidthnHeight(42, 4)]}
                                                    iconSize={getWidthnHeight(7).width}
                                                    onChangeText={(id, name, index, data) => {
                                                        this.setState({
                                                            stateID: id, stateName: name, stateError: false,
                                                            cityID: null, cityName: '', cityError: true, cityList: []
                                                        }, async() => {
                                                            this.cities(this.state.stateID, 'permanent');
                                                        })
                                                    }}
                                                /> */}
                                                <View style={[{
                                                    borderColor: (submit && stateError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: getWidthnHeight(1).width,
                                                    borderStyle: (submit && stateError)? 'dashed' : 'solid', borderWidth: (submit && stateError)? 2 : 1
                                                }, getWidthnHeight(42, 6.5)]}>
                                                    <Dropdown
                                                        search
                                                        searchPlaceholder="Search..."
                                                        containerStyle={[{borderColor: '#C4C4C4', borderWidth: 0}, getWidthnHeight(42)]}
                                                        inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getWidthnHeight(42)]}
                                                        placeholder={'State*'}
                                                        placeholderStyle={{color: '#C4C4C4', fontSize: fontSizeH4().fontSize, paddingLeft: getWidthnHeight(3).width}}
                                                        selectedTextStyle={[getMarginLeft(3)]}
                                                        data={stateList}
                                                        valueField={'id'}
                                                        labelField={'name'}
                                                        onChange={(item) => {
                                                            console.log(item);
                                                            this.setState({
                                                                stateName: item.name, stateID: item.id, stateError: false,
                                                                cityList: [], cityID: null, cityError: true 
                                                            }, () => this.cities(this.state.stateID, 'permanent'));
                                                            this.dismissKeyboard();
                                                        }}
                                                        value={stateID}
                                                    />
                                                </View>
                                                {/* <SearchableDropDown 
                                                    placeholder=" City* "
                                                    data={cityList}
                                                    value={cityName}
                                                    disabled={(stateID)? false : true}
                                                    style={[{
                                                        borderColor: (submit && cityError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: getWidthnHeight(1).width,
                                                        borderStyle: (submit && cityError)? 'dashed' : 'solid', borderWidth: (submit && cityError)? 2 : 1,
                                                    }, getWidthnHeight(42, 6.5)]}
                                                    searchStyle={[getWidthnHeight(34, 6.5)]}
                                                    slidePlaceHolderVertical={[0, getMarginTop(-3.1).marginTop]}
                                                    slidePlaceHolderHorizontal={[0, getMarginLeft(-1.5).marginLeft]}
                                                    labelStyle={[{fontSize: fontSizeH4().fontSize + 2}]}
                                                    dropDownSize={[getWidthnHeight(42, 20)]}
                                                    dropDownPosition={{top: getWidthnHeight(undefined, -26.5).height}}
                                                    textBoxSize={[getWidthnHeight(42, 4)]}
                                                    iconSize={getWidthnHeight(7).width}
                                                    onChangeText={(id, name, index, data) => {
                                                        this.setState({cityID: id, cityName: name, cityError: false}, () => {
                                                        })
                                                    }}
                                                /> */}
                                                <View style={[{
                                                    borderColor: (submit && cityError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: getWidthnHeight(1).width,
                                                    borderStyle: (submit && cityError)? 'dashed' : 'solid', borderWidth: (submit && cityError)? 2 : 1,
                                                }, getWidthnHeight(42, 6.5)]}>
                                                    <Dropdown
                                                        search
                                                        searchPlaceholder="Search..."
                                                        containerStyle={[{borderColor: '#C4C4C4', borderWidth: 0}, getWidthnHeight(42)]}
                                                        inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getWidthnHeight(42)]}
                                                        placeholder={'City*'}
                                                        placeholderStyle={{color: '#C4C4C4', fontSize: fontSizeH4().fontSize, paddingLeft: getWidthnHeight(3).width}}
                                                        selectedTextStyle={[getMarginLeft(3)]}
                                                        data={cityList}
                                                        valueField={'id'}
                                                        labelField={'name'}
                                                        onChange={(item) => {
                                                            console.log(item);
                                                            this.setState({
                                                                cityName: item.name, cityID: item.id, cityError: false 
                                                            });
                                                            this.dismissKeyboard();
                                                        }}
                                                        value={cityID}
                                                    />
                                                </View>
                                            </View>
                                            <View style={[{backgroundColor: 'rgba(196, 196, 196, 0.5)', height: 1}, getWidthnHeight(87), getMarginTop(3)]}/>
                                            <View style={[{alignItems: 'center'}, getWidthnHeight(93), getMarginVertical(1)]}>
                                                <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, getWidthnHeight(87)]}>
                                                    <MaskedGradientText
                                                        title={"CORRESPONDENCE ADDRESS"}
                                                        titleStyle={[{fontWeight: 'bold', color: '#000000', fontSize: (fontSizeH4().fontSize)}, styles.boldFont]}
                                                        start={{x: 0, y: 0}}
                                                        end={{x: 0.7, y: 0}}
                                                        colors={["#039FFD", "#EA304F"]}
                                                    />
                                                    <Slider 
                                                        activeColor={'#039FFD'} 
                                                        //inactiveColor={'red'}
                                                        // buttonColor={'red'}
                                                        // buttonBorderColor={'blue'}
                                                        value={sameAddress}
                                                        onSlide={(sameAddress)=>this.setState({sameAddress},()=>{
                                                        })}
                                                        delay={400}
                                                        //title={['Test', 'Live']}
                                                    />
                                                </View>
                                            </View>
                                            {(!sameAddress) && (
                                                <View>
                                                    <View style={[{alignItems: 'center'}, getWidthnHeight(93), getMarginTop(1.5)]}>
                                                        <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, getWidthnHeight(87), getMarginTop(1.5)]}>
                                                            <AnimatedTextInput 
                                                                placeholder=" House Number* "
                                                                placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                                value={house2}
                                                                slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                                slideHorizontal={[0, getWidthnHeight(-3).width]}
                                                                placeholderScale={[1, 0.75]}
                                                                autoFocus={false}
                                                                autoCapitalize={"words"}
                                                                onChangeText={(text) => {
                                                                    this.setState({ house2: text.trimLeft() }, () => {
                                                                        const {house2} = this.state;
                                                                        if(house2 !== ''){
                                                                            this.setState({house2Error: false})
                                                                        }else{
                                                                            this.setState({house2: '', house2Error: true}, () => Keyboard.dismiss())
                                                                        }
                                                                    })
                                                                }}
                                                                clearText={() => this.setState({house2: '', house2Error: true})}
                                                                containerColor={[(submit && house2Error)? 'red' : '#C4C4C4', (submit && house2Error)? 'red' : '#C4C4C4']}
                                                                containerBorderWidth={[(submit && house2Error)? 2 : 1, 1]}
                                                                containerStyle={[{
                                                                    borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && house2Error)? 'dashed' : 'solid',
                                                                }, getWidthnHeight(54, 6.5)]}
                                                                style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(52, 6.5), getMarginHorizontal(2)]}
                                                            />
                                                            <AnimatedTextInput 
                                                                placeholder=" Pincode* "
                                                                placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                                value={pincode2}
                                                                slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                                slideHorizontal={[0, getWidthnHeight(-2).width]}
                                                                placeholderScale={[1, 0.75]}
                                                                keyboardType={'numeric'}
                                                                maxLength={6}
                                                                autoFocus={false}
                                                                onChangeText={(number) => {
                                                                    this.setState({ pincode2: number.replace(/[^0-9]/g, '')}, () => {
                                                                        const {pincode2} = this.state;
                                                                        if(pincode2.length === 6){
                                                                            this.setState({pincode2Error: false})
                                                                        }else if(pincode2 === ''){
                                                                            this.setState({pincode2Error: true}, () => Keyboard.dismiss())
                                                                        }else if(pincode2.length < 6){
                                                                            this.setState({pincode2Error: true})
                                                                        }
                                                                    })
                                                                }}
                                                                clearText={() => this.setState({pincode2: '', pincode2Error: true})}
                                                                containerColor={[(submit && pincode2Error)? 'red' : '#C4C4C4', (submit && pincode2Error)? 'red' : '#C4C4C4']}
                                                                containerBorderWidth={[(submit && pincode2Error)? 2 : 1, 1]}
                                                                containerStyle={[{
                                                                    borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && pincode2Error)? 'dashed' : 'solid',
                                                                }, getWidthnHeight(30, 6.5)]}
                                                                style={[{
                                                                    borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2),
                                                                    color: (pincode2Error)? 'red' : 'black'
                                                                }, getWidthnHeight(28, 6.5), getMarginHorizontal(2)]}
                                                            />
                                                        </View>
                                                    </View>
                                                    <View style={[{alignItems: 'center'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                        <AnimatedTextInput 
                                                            placeholder=" Road/Street* "
                                                            placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                            value={road2}
                                                            slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                            slideHorizontal={[0, getWidthnHeight(-2.7).width]}
                                                            placeholderScale={[1, 0.75]}
                                                            autoFocus={false}
                                                            autoCapitalize={"words"}
                                                            onChangeText={(text) => {
                                                                this.setState({ road2: text.trimLeft() }, () => {
                                                                    const {road2} = this.state;
                                                                    if(road2 !== ''){
                                                                        this.setState({road2Error: false})
                                                                    }else{
                                                                        this.setState({road2: '', road2Error: true}, () => Keyboard.dismiss())
                                                                    }
                                                                })
                                                            }}
                                                            clearText={() => this.setState({road2: '', road2Error: true})}
                                                            containerColor={[(submit && road2Error)? 'red' : '#C4C4C4', (submit && road2Error)? 'red' : '#C4C4C4']}
                                                            containerBorderWidth={[(submit && road2Error)? 2 : 1, 1]}
                                                            containerStyle={[{
                                                                borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && road2Error)? 'dashed' : 'solid',
                                                            }, getWidthnHeight(87, 6.5)]}
                                                            style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(85, 6.5), getMarginHorizontal(2)]}
                                                        />
                                                    </View>
                                                    <View style={[{alignItems: 'center'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                        <AnimatedTextInput 
                                                            placeholder=" Locality/Area* "
                                                            placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                            value={locality2}
                                                            slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                            slideHorizontal={[0, getWidthnHeight(-2.7).width]}
                                                            placeholderScale={[1, 0.75]}
                                                            autoFocus={false}
                                                            autoCapitalize={"words"}
                                                            onChangeText={(text) => {
                                                                this.setState({ locality2: text.trimLeft() }, () => {
                                                                    const {locality2} = this.state;
                                                                    if(locality2 !== ''){
                                                                        this.setState({locality2Error: false})
                                                                    }else{
                                                                        this.setState({locality2: '', locality2Error: true}, () => Keyboard.dismiss())
                                                                    }
                                                                })
                                                            }}
                                                            clearText={() => this.setState({locality2: '', locality2Error: true})}
                                                            containerColor={[(submit && locality2Error)? 'red' : '#C4C4C4', (submit && locality2Error)? 'red' : '#C4C4C4']}
                                                            containerBorderWidth={[(submit && locality2Error)? 2 : 1, 1]}
                                                            containerStyle={[{
                                                                borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && locality2Error)? 'dashed' : 'solid',
                                                            }, getWidthnHeight(87, 6.5)]}
                                                            style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(85, 6.5), getMarginHorizontal(2)]}
                                                        />
                                                    </View>
                                                    <View style={[{alignItems: 'flex-end'}, getWidthnHeight(93)]}>
                                                        <Dropdown
                                                            style={[{borderColor: '#C4C4C4', borderWidth: 0, justifyContent: 'center'}, getWidthnHeight(20, 4), getMarginRight(3)]}
                                                            containerStyle={{marginHorizontal: getMarginHorizontal(3).marginHorizontal, width: '100%'}}
                                                            inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getMarginTop(0)]}
                                                            placeholder='Select Country*'
                                                            placeholderStyle={{color: '#C4C4C4', fontSize: fontSizeH4().fontSize, paddingHorizontal: getWidthnHeight(3).width}}
                                                            selectedTextStyle={[getMarginLeft(3)]}
                                                            data={countryList}
                                                            valueField={'id'}
                                                            labelField={'name'}
                                                            onChange={(item) => {
                                                                console.log(item);
                                                                this.setState({
                                                                    country2Name: item.name, country2ID: item.id, country2Error: false 
                                                                }, () => console.log("### COUNTRY 2 ID: ", this.state.country2ID))
                                                                this.dismissKeyboard();
                                                            }}
                                                            value={country2ID}
                                                        />
                                                    </View>
                                                    <View 
                                                        style={[{
                                                            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'
                                                    }, getMarginTop(0), getWidthnHeight(90)]}>
                                                        {/* <SearchableDropDown 
                                                            placeholder=" State* "
                                                            data={apiData.sectionData.dropdown.states}
                                                            value={state2Name}
                                                            style={[{
                                                                borderColor: (submit && state2Error)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: getWidthnHeight(1).width,
                                                                borderStyle: (submit && state2Error)? 'dashed' : 'solid', borderWidth: (submit && state2Error)? 2 : 1,
                                                            }, getWidthnHeight(42, 6.5)]}
                                                            searchStyle={[getWidthnHeight(34, 6.5)]}
                                                            slidePlaceHolderVertical={[0, getMarginTop(-3.2).marginTop]}
                                                            slidePlaceHolderHorizontal={[0, getMarginLeft(-1.5).marginLeft]}
                                                            labelStyle={[{fontSize: fontSizeH4().fontSize + 2}]}
                                                            dropDownSize={[getWidthnHeight(42, 20)]}
                                                            dropDownPosition={{top: getWidthnHeight(undefined, -26.5).height}}
                                                            textBoxSize={[getWidthnHeight(42, 4)]}
                                                            iconSize={getWidthnHeight(7).width}
                                                            onChangeText={(id, name, index, data) => {
                                                                this.setState({
                                                                    state2ID: id, state2Name: name, state2Error: false,
                                                                    city2ID: null, city2Name: '', city2Error: true, city2List: []
                                                                }, async() => {
                                                                    this.cities(this.state.state2ID, 'correspondence');
                                                                })
                                                            }}
                                                        /> */}
                                                        <View style={[{
                                                            borderColor: (submit && state2Error)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: getWidthnHeight(1).width,
                                                            borderStyle: (submit && state2Error)? 'dashed' : 'solid', borderWidth: (submit && state2Error)? 2 : 1
                                                        }, getWidthnHeight(42, 6.5)]}>
                                                            <Dropdown
                                                                search
                                                                searchPlaceholder="Search..."
                                                                containerStyle={[{borderColor: '#C4C4C4', borderWidth: 0}, getWidthnHeight(42)]}
                                                                inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getWidthnHeight(42)]}
                                                                placeholder={'State*'}
                                                                placeholderStyle={{color: '#C4C4C4', fontSize: fontSizeH4().fontSize, paddingLeft: getWidthnHeight(3).width}}
                                                                selectedTextStyle={[getMarginLeft(3)]}
                                                                data={state2List}
                                                                valueField={'id'}
                                                                labelField={'name'}
                                                                onChange={(item) => {
                                                                    console.log(item);
                                                                    this.setState({
                                                                        state2Name: item.name, state2ID: item.id, state2Error: false,
                                                                        city2List: [], city2ID: null, city2Error: true 
                                                                    }, () => this.cities(this.state.state2ID, 'correspondence'));
                                                                    this.dismissKeyboard();
                                                                }}
                                                                value={state2ID}
                                                            />
                                                        </View>
                                                        {/* <SearchableDropDown 
                                                            placeholder=" City* "
                                                            data={city2List}
                                                            value={city2Name}
                                                            disabled={(state2ID)? false : true}
                                                            style={[{
                                                                borderColor: (submit && city2Error)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: getWidthnHeight(1).width,
                                                                borderStyle: (submit && city2Error)? 'dashed' : 'solid', borderWidth: (submit && city2Error)? 2 : 1,
                                                            }, getWidthnHeight(42, 6.5)]}
                                                            searchStyle={[getWidthnHeight(34, 6.5)]}
                                                            slidePlaceHolderVertical={[0, getMarginTop(-3.2).marginTop]}
                                                            slidePlaceHolderHorizontal={[0, getMarginLeft(-1.5).marginLeft]}
                                                            labelStyle={[{fontSize: fontSizeH4().fontSize + 2}]}
                                                            dropDownSize={[getWidthnHeight(42, 20)]}
                                                            dropDownPosition={{top: getWidthnHeight(undefined, -26.5).height}}
                                                            textBoxSize={[getWidthnHeight(42, 4)]}
                                                            iconSize={getWidthnHeight(7).width}
                                                            onChangeText={(id, name, index, data) => {
                                                                this.setState({city2ID: id, city2Name: name, city2Error: false}, () => {
                                                                })
                                                            }}
                                                        /> */}
                                                        <View style={[{
                                                            borderColor: (submit && city2Error)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: getWidthnHeight(1).width,
                                                            borderStyle: (submit && city2Error)? 'dashed' : 'solid', borderWidth: (submit && city2Error)? 2 : 1,
                                                        }, getWidthnHeight(42, 6.5)]}>
                                                            <Dropdown
                                                                search
                                                                searchPlaceholder="Search..."
                                                                containerStyle={[{borderColor: '#C4C4C4', borderWidth: 0}, getWidthnHeight(42)]}
                                                                inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getWidthnHeight(42)]}
                                                                placeholder={'City*'}
                                                                placeholderStyle={{color: '#C4C4C4', fontSize: fontSizeH4().fontSize, paddingLeft: getWidthnHeight(3).width}}
                                                                selectedTextStyle={[getMarginLeft(3)]}
                                                                data={city2List}
                                                                valueField={'id'}
                                                                labelField={'name'}
                                                                onChange={(item) => {
                                                                    console.log(item);
                                                                    this.setState({
                                                                        city2Name: item.name, city2ID: item.id, city2Error: false 
                                                                    });
                                                                    this.dismissKeyboard();
                                                                }}
                                                                value={city2ID}
                                                            />
                                                        </View>
                                                    </View>
                                                </View>
                                            )}
                                        </View>
                                    </ScrollView>
                                    <View style={[{backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}, getWidthnHeight(93), getMarginBottom(1)]}>
                                        <View style={[getWidthnHeight(34)]}/>
                                        <View style={[{borderWidth: 0, borderColor: 'red'}, getWidthnHeight(32)]}>
                                            <ChoppedButton 
                                                onPress={() => {this.onSubmit()}}
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
                                                    shadowRadius: 2, elevation: 2, borderColor: 'rgba(196, 196, 196, 0.5)', borderWidth: 0.4, shadowOffset: {width: 0, height: 0}
                                                }]}
                                                onPress={() => this.setState({showScreensList: true}, () => Keyboard.dismiss())}
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
                            </KeyboardAvoidingView>
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
    },
})

export default Registration;