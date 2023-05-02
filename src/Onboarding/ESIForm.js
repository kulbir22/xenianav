import React, {Component} from 'react';
import {
    View, Text, BackHandler, Animated, Keyboard, ScrollView,  TextInput, SafeAreaView, StatusBar,
    FlatList, Alert, Platform, StyleSheet, KeyboardAvoidingView, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import LinearGradient from 'react-native-linear-gradient';
import DocumentPicker from 'react-native-document-picker'
import moment from 'moment';
import { Dropdown } from 'react-native-material-dropdown';
import AntdesignIcons from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Delete from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {
    getWidthnHeight, IOS_StatusBar, getMarginTop, fontSizeH4, fontSizeH3, AnimatedTextInput, getMarginHorizontal,
    DismissKeyboard, GradientIcon, ChoppedButton, getMarginVertical, getMarginLeft, getMarginBottom, GradientText,
    Spinner, AnimateDateLabel, Slider, getMarginRight, CheckList, LanguageSelection, ScreensModal, fontSizeH2,
    BasicChoppedButton, MaskedGradientText, stateList, cities, FamilyDetailsModal
} from '../KulbirComponents/common';
import {fetchBaseURL, savedToken} from '../api/BaseURL';

const COLOR1 = "#039FFD";
const COLOR2 = "#EA304F";
const colorTitle = '#0B8EE8';
const deleteColor = "#E02401";
const experience = 'experience';
const scannedDD = 'scannedDD';
const aadharCard = 'aadhar';
const mb1 = '1048576'; //1 MB

class ESIForm extends Component{
    constructor(props){
        super(props)
        this.state = {
            submit: false,
            esi: '',
            esiError: true,
            familyData: [],
            addFamilyDetails: false,
            showFamilyModal: false,
            showNomineeModal: false,
            filledFamilyTable: function(){
                return (
                    !this.nameError && !this.dobError && !this.relationError && !this.residingError && !this.stateError && !this.cityError && 
                    !this.aadharNumberError
                );
            },
            blankFamilyTable: function(){
                return (
                    this.nameError && this.dobError && this.relationError && this.residingError && this.stateError && this.cityError && 
                    this.aadharNumberError && this.aadharAttachmentError
                );
            },
            filledNomineeTable: function() {
                return (
                    !this.nomineeNameError && !this.nomineeDOBError && !this.nomineeRelationError && !this.nomineeAddressError && 
                    !this.nomineeAadharError
                );
            },
            blankNomineeTable: function(){
                return (
                    this.nomineeNameError && this.nomineeDOBError && this.nomineeRelationError && this.nomineeAddressError && 
                    this.nomineeAadharError && this.nomineeAttachmentError
                );
            },
            checkDispensary: function(){
                return (this.input1Error === false || this.input2Error === false)
            },
            filledDispensary: function(){
                return(!this.input1Error && !this.input2Error);
            },
            name: '',
            nameError: true,
            dob: '',
            dobError: true,
            relation: '',
            relationID: null,
            relationError: true,
            residingID: null,
            residing: '',
            residingError: true, 
            stateList: [],
            stateID: null,
            stateName: '',
            stateError: true,
            cityList: [],
            cityID: null,
            cityName: '',
            cityError: true,
            aadharNumber: '',
            aadharNumberError: true,
            aadharAttachment: [],
            aadharAttachmentError: true,
            oldFamilyAadhar: [],
            nomineeData: [],
            addNomineeDetails: false,
            nomineeName: '',
            nomineeNameError: true,
            nomineeDOB: '',
            nomineeDOBError: true,
            nomineeRelationID: null,
            nomineeRelation: '',
            nomineeRelationError: true,
            nomineeAddress: '',
            nomineeAddressError: true,
            nomineeAadhar: '',
            nomineeAadharError: true,
            nomineeAttachment: [],
            nomineeAttachmentError: true,
            oldNomineeAadhar: [],
            input1: '',
            input1Error: true,
            input2: '',
            input2Error: true,
            noError: function(){
                return (
                    !this.esiError
                );
            },
            screens: [],
            showScreensList: false,
            editFamilyDetails: false,
            editFamilyIndex: null,
            editNomineeDetails: false,
            editNomineeIndex: null,
            baseURL: null,
            loading: false,
            includeSecurity: false, 
            secretToken: null
        };
    }

    componentDidMount(){
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.handleBackButton());
        AsyncStorage.getItem('onboardingToken').then((secretToken) => {
            this.setState({secretToken})
        });
        fetchBaseURL().then((baseURL) => {
            const apiData = JSON.parse(this.props.route.params.apiData);
            const oldData = apiData.sectionData.oldData;
            this.setState({baseURL, screens: apiData.sectionData.links.pageLinks}, () => {
                if(oldData){
                    this.fillOldData();
                }
            })
        })
    }

    fillOldData(){
        const apiData = JSON.parse(this.props.route.params.apiData);
        const oldData = apiData.sectionData.oldData;
        const esiData = oldData.esi;
        this.setState({esi: (esiData.esi_number)? esiData.esi_number : '', esiError: (esiData.esi_number)? false : true});
        if(oldData.hasOwnProperty('family')){
            const oldFamilyData = oldData.family;
            const residingWith = [
                {id: '1', name: 'Yes'},
                {id: '2', name: 'No'},
            ];
            let uploadedFamilyData = [];
            oldFamilyData.forEach((item, index) => {
                const subIndex = residingWith.findIndex((data) => {
                    return (data.name === item.residing_with);
                });
                const residingID = residingWith[subIndex]['id'];
                let oldAadharCard = [];
                if(item.hasOwnProperty('adhaar_card_file_old_filename')){
                    oldAadharCard = (item.adhaar_card_file_old_filename)? item.adhaar_card_file_old_filename : [];
                }
                const createData = {
                    id: uuidv4(),
                    name: item.name,
                    dob: item.date_of_birth,
                    relationID: item.relationship,
                    relation: item.relation_name,
                    residing: item.residing_with,
                    residingID: residingID,
                    stateID: item.state_id,
                    stateName: item.state,
                    cityID: item.city_id,
                    cityName: item.city,
                    aadharNumber: item.aadhaar_number,
                    aadharAttachment: (item.adhaar_card_file)? item.adhaar_card_file : [],
                    oldFamilyAadhar: oldAadharCard
                } 
                uploadedFamilyData.push(createData)
            });
            this.setState({familyData: uploadedFamilyData})
        }
        if(oldData.hasOwnProperty('nominee')){
            const oldNomineeData = oldData.nominee;
            let uploadedNomineeData = [];
            oldNomineeData.forEach((item) => {
                let oldAadharCard = [];
                if(item.hasOwnProperty('adhaar_card_file_old_filename')){
                    oldAadharCard = (item.adhaar_card_file_old_filename)? item.adhaar_card_file_old_filename : [];
                }
                const createData = {
                    id: uuidv4(),
                    nomineeName: item.name,
                    nomineeDOB: item.date_of_birth,
                    nomineeRelationID: item.relationship,
                    nomineeRelation: item.relation_name,
                    nomineeAddress: item.address,
                    nomineeAadhar: item.aadhaar_number,
                    nomineeAttachment: (item.adhaar_card_file)? item.adhaar_card_file : [],
                    oldNomineeAadhar: oldAadharCard
                }
                uploadedNomineeData.push(createData);
            })
            this.setState({nomineeData: uploadedNomineeData})
        }
        if(oldData.hasOwnProperty('despensary_detail')){
            const oldDispensartDetails = oldData.despensary_detail;
            this.setState({
                input1: oldDispensartDetails.for_insured_person, input1Error: (oldDispensartDetails.for_insured_person)? false : true,
                input2: oldDispensartDetails.for_family, input2Error: (oldDispensartDetails.for_family)? false : true
            })
        }
    }

    handleBackButton = () => {
        //ToastAndroid.show('Not Allowed', ToastAndroid.SHORT)
        if(this.props.route.name === "ESIForm"){
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

    dismissKeyboard(){
        Keyboard.dismiss();
    }

    async addAttachment(name, type = 'family'){
        try {
            const res = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.pdf],
            })
            if(res.length > 2){
                alert('Maximum of 2 files are allowed.');
                return;
            }
            const largeFileSize = res.findIndex((data, index) => {
                return (data.size > mb1);
            })
            if(largeFileSize > -1){
                alert(`File size is too large, max. recommended size is 1MB.`);
            }else{
                if(name === aadharCard && type === 'family'){
                    this.setState({aadharAttachment: res, aadharAttachmentError: false}, () => {
                        console.log("AADHAR", this.state.aadharAttachment)
                    })
                }else if(name === aadharCard && type === 'nominee'){
                    this.setState({nomineeAttachment: res, nomineeAttachmentError: false}, () => {
                        console.log("NOMINEE AADHAR", this.state.nomineeAttachment)
                    })
                }
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
            // User cancelled the picker, exit any dialogs or menus and move on
            }
        }
    }

    removeAttachment(name, type = 'family'){
        if(name === aadharCard && type === 'family'){
            this.setState({aadharAttachment: '', aadharAttachmentError: true})
        }else if(name === aadharCard && type === 'nominee'){
            this.setState({nomineeAttachment: '', nomineeAttachmentError: true})
        }
    }

    deleteNomineeInstance(index){
        Keyboard.dismiss();
        const {editNomineeIndex, nomineeData} = this.state;
        if(editNomineeIndex === index){
            this.clearNomineeTable();
        }
        nomineeData.splice(index, 1);
        this.setState({nomineeData}, () => {})
    }

    enterNomineeDetails(){
        const noError = this.state.filledNomineeTable();
        if(noError){
            this.checkErrorsInNomineeDetails();
        }else{
            alert("Please fill the fields highlighted in RED");
        }
    }

    checkErrorsInNomineeDetails(){
        const {
            nomineeName, nomineeDOB, nomineeRelation, nomineeRelationID, 
            nomineeAddress, nomineeAadhar, nomineeAttachment, oldNomineeAadhar
        } = this.state;
        const createData = {
            id: uuidv4(),
            nomineeName, 
            nomineeDOB, 
            nomineeRelation, 
            nomineeRelationID, 
            nomineeAddress, 
            nomineeAadhar, 
            nomineeAttachment,
            oldNomineeAadhar
        }
        this.state.nomineeData.push(createData);
        this.setState({nomineeData: this.state.nomineeData}, () => {    
            this.clearNomineeTable();
        })
    }

    editNomineeDetailsFunction(item, index){
        Keyboard.dismiss();
        this.setState({
            nomineeName: item.nomineeName, nomineeNameError: false, nomineeDOB: item.nomineeDOB, nomineeDOBError: false,
            nomineeRelation: item.nomineeRelation, nomineeRelationID: item.nomineeRelationID, nomineeRelationError: false,
            nomineeAddress: item.nomineeAddress, nomineeAddressError: false, nomineeAadhar: item.nomineeAadhar, nomineeAadharError: false,
            nomineeAttachment: item.nomineeAttachment, nomineeAttachmentError: (item.nomineeAttachment.length > 0)? false : true, 
            editNomineeIndex: index, editNomineeDetails: true, oldNomineeAadhar: item.oldNomineeAadhar
        })
    }

    saveNomineeDetails(){
        const {
            nomineeName, nomineeDOB, nomineeRelation, nomineeRelationID, 
            nomineeAddress, nomineeAadhar, nomineeAttachment, editNomineeIndex,
            oldNomineeAadhar
        } = this.state;
        this.setState({addNomineeDetails: true});
        const checkError = this.state.filledNomineeTable();
        let editNomineeDetails = [];
        if(checkError){
            editNomineeDetails = {
                id: uuidv4(),
                nomineeName, 
                nomineeDOB, 
                nomineeRelation, 
                nomineeRelationID, 
                nomineeAddress, 
                nomineeAadhar, 
                nomineeAttachment,
                oldNomineeAadhar
            }
            this.state.nomineeData.splice(editNomineeIndex, 1, editNomineeDetails)
            this.setState({nomineeData: this.state.nomineeData}, () => {    
                this.clearNomineeTable();
            })
        }else{
            alert("Please fill the fields highlighted in RED");
        }
    }

    deleteFamilyInstance(index){
        Keyboard.dismiss();
        const {editFamilyIndex, familyData} = this.state;
        if(editFamilyIndex === index){
            this.clearFamilyTable();
        }
        familyData.splice(index, 1);
        this.setState({familyData}, () => {})
    }

    enterFamilyDetails(){
        const noError = this.state.filledFamilyTable();
        if(noError){
            this.checkErrorsInFamilyDetails();
        }else{
            alert("Please fill the fields highlighted in RED");
        }
    }

    checkErrorsInFamilyDetails(){
        const {
            name, dob, relation, relationID, residing, residingID, 
            stateName, stateID, cityName, cityID, aadharNumber, 
            aadharAttachment, oldFamilyAadhar
        } = this.state;
        const createData = {
            id: uuidv4(),
            name,
            dob,
            relation,
            relationID,
            residing,
            residingID,
            stateName,
            stateID,
            cityName,
            cityID,
            aadharNumber,
            aadharAttachment,
            oldFamilyAadhar
        }
        this.state.familyData.push(createData);
        this.setState({familyData: this.state.familyData}, () => {    
            console.log("FAMILY DATA: ", this.state.familyData);
            this.clearFamilyTable();
        })
    }

    editFamilyDetailsFunction(item, index){
        console.log("EDIT FAMILY: ", item)
        Keyboard.dismiss();
        this.setState({
            name: item.name, nameError: false, dob: item.dob, dobError: false, relation: item.relation, relationID: item.relationID, relationError: false,
            residing: item.residing, residingID: item.residingID, residingError: false, aadharNumber: item.aadharNumber, aadharNumberError: false, 
            editFamilyIndex: index, aadharAttachment: item.aadharAttachment, aadharAttachmentError: (item.aadharAttachment.length > 0)? false : true, 
            editFamilyDetails: true, oldFamilyAadhar: item.oldFamilyAadhar
        }, () => {
            this.cities(item, 'familyState');
        })
    }

    saveFamilyDetails(){
        const {
            name, dob, relation, relationID, residing, residingID, editFamilyIndex,
            stateName, stateID, cityName, cityID, aadharNumber, aadharAttachment, oldFamilyAadhar
        } = this.state;
        this.setState({addFamilyDetails: true})
        const checkError = this.state.filledFamilyTable()
        let editFamilyDetails = [];
        if(checkError){
            editFamilyDetails = {
                id: uuidv4(),
                name,
                dob,
                relation,
                relationID,
                residing,
                residingID,
                stateName,
                stateID,
                cityName,
                cityID,
                aadharNumber,
                aadharAttachment,
                oldFamilyAadhar
            }
            console.log("FAMILY DATA: ", this.state.familyData)
            this.state.familyData.splice(editFamilyIndex, 1, editFamilyDetails);
            this.setState({
                familyData: this.state.familyData
            }, () => {    
                this.clearFamilyTable();
            })
        }else{
            alert("Please fill the fields highlighted in RED");
        }
    }

    clearFamilyTable(){
        Keyboard.dismiss();
        this.setState({
            name: '', nameError: true, dob: '', dobError: true, relation: '', relationID: null, relationError: true, residing: '', residingID: null, residingError: true,
            stateID: null, stateName: '', stateError: true, cityID: null, cityName: '', cityError: true, aadharNumber: '', aadharNumberError: true, aadharAttachment: [], 
            aadharAttachmentError: true, oldFamilyAadhar: [], addFamilyDetails: false, editFamilyDetails: false, editFamilyIndex: null, cityList: [] 
        })
    }

    clearNomineeTable(){
        Keyboard.dismiss();
        this.setState({
            nomineeName: '', nomineeNameError: true, nomineeDOB: '', nomineeDOBError: true, nomineeRelation: '', nomineeRelationID: null, nomineeRelationError: true,
            nomineeAddress: '', nomineeAddressError: true, nomineeAadhar: '', nomineeAadharError: true, nomineeAttachment: '', nomineeAttachmentError: true,
            oldNomineeAadhar: [], addNomineeDetails: false, editNomineeDetails: false, editNomineeIndex: null
        })
    }

    showLoader(){
        this.setState({loading: true})
    }

    hideLoader(){
        this.setState({loading: false})
    }

    cities = async(item, name = null) => {
        const {baseURL} = this.state;
        this.showLoader();
        // var asyncData = await AsyncStorage.getItem('user_token');
        // var parsedData = JSON.parse(asyncData);
        // var secretToken = parsedData.success.secret_token;
        console.log("@@@*** STATE WISE CITIES: ", `${baseURL}/master/cities`, item.stateID)
        axios.post(`${baseURL}/master/cities`,
        {
            state_id: item.stateID
        },
        {
            headers: {
                'Accept': 'application/json'
            }
        }).then((response) => {
            this.hideLoader();
            console.log("### CITIES SUCCESS: ", (response.data))
            const responseJson = response.data;
            if(name === 'familyState'){
                this.setState({
                    cityList: responseJson.data, stateName: item.stateName, stateID: item.stateID, stateError: false,
                    cityName: item.cityName, cityID: item.cityID, cityError: false, 
                })
            }else{
                this.setState({cityList: responseJson.data})
            }
        }).catch((error) => {
            this.hideLoader();
            let status = null;
            if(error.response){
                status = error.response.status;
                Alert.alert("Error!!!", `ErrorCode: ${status}610.`)
            }else{
                alert(`${error}, API CODE: 610`)
            }
        })
    }

    checkAllErrors(){
        const checkDispensary = this.state.checkDispensary();
        this.setState({submit: true, includeSecurity: (checkDispensary)? checkDispensary : false}, () => {
            const {familyData, nomineeData, esi, esiError, secretToken, baseURL} = this.state;
            const apiData = JSON.parse(this.props.route.params.apiData);
            const sendData = new FormData();
            const checkFamilyData = Boolean(familyData.length > 0);
            const familyBlank = this.state.blankFamilyTable();
            const checkNomineeData = Boolean(nomineeData.length > 0);
            const nomineeBlank = this.state.blankNomineeTable();
            if(esi && esiError){
                alert("Please enter 10-digit ESI number.")
                return;
            }
            if(checkFamilyData && familyBlank){
                this.setState({addFamilyDetails: false})
            }else{
                this.setState({addFamilyDetails: true}, () => {
                    alert("Please add family details.")
                });
                return;
            }
            if(checkNomineeData && nomineeBlank){
                this.setState({addNomineeDetails: false})
            }else{
                this.setState({addNomineeDetails: true}, () => {
                    alert("Please add nominee details.")
                });
                return;
            }
            let noDispensaryError = true;
            if(checkDispensary){
                noDispensaryError = this.state.filledDispensary();
            }
            if(noDispensaryError){
                const relationData = apiData.sectionData.dropdown.relations;
                const personalDetails = apiData.sectionData.firstPagedetail.personal;
                const fullName = `${personalDetails.first_name} ${personalDetails.middle_name} ${personalDetails.last_name}`;
                const currentPageFilled = apiData.sectionData.links.currentPage.filled;
                const esi = {
                    name: fullName,
                    dob: personalDetails.date_of_birth,
                    father_name_spouse_name: personalDetails.father_name,
                    adhaar_number: apiData.adhaarNumber,
                    esi_number: this.state.esi
                }
                sendData.append('id', apiData.draftId);
                sendData.append('page', apiData.currentPage);
                sendData.append('project_id', apiData.projectId);
                sendData.append('next', apiData.sectionData.links.next.page);
                const esiPropList = Object.keys(esi);
                esiPropList.forEach((name) => {
                    sendData.append(`esi[${name}]`, esi[name])
                });
                let uploadFamilyData = [];
                familyData.forEach((item, index) => {
                    const createData = {
                        name: item.name,
                        date_of_birth: item.dob,
                        relationship: item.relationID,
                        relation_name: item.relation,
                        residing_with: item.residing,
                        country_id: 1,
                        country: "India",
                        state_id: item.stateID,
                        state: item.stateName,
                        city_id: item.cityID,
                        city: item.cityName,
                        aadhaar_number: item.aadharNumber,
                        adhaar_card_file: item.aadharAttachment,
                        adhaar_card_file_old_filename: item.oldFamilyAadhar
                    } 
                    //uploadFamilyData.push(createData)
                    const nameTypeList = Object.keys(createData);
                    nameTypeList.forEach((name) => {
                        if(name === "adhaar_card_file"){
                            let data = [];
                            data = createData[name];
                            if(data.length > 0 && !currentPageFilled){
                                data.forEach((subItem, subIndex) => {
                                    sendData.append(`family[${name}][${index}][${subIndex}]`, subItem)
                                })
                            }else{
                                sendData.append(`family[${name}][]`, 0)
                            }
                        }else if(name === "adhaar_card_file_old_filename"){
                            let data = [];
                            data = createData["adhaar_card_file"];
                            if(data.length > 0 && currentPageFilled){
                                data.forEach((subItem, subIndex) => {
                                    sendData.append(`family[${name}][${index}][${subIndex}]`, subItem);
                                })
                            }else{
                                sendData.append(`family[${name}][]`, "");
                            }
                        }else{
                            sendData.append(`family[${name}][]`, createData[name]);
                        }
                    })
                });
                let uploadNomineeData = [];
                nomineeData.forEach((item, index) => {
                    const createData = {
                        name: item.nomineeName,
                        date_of_birth: item.nomineeDOB,
                        relationship: item.nomineeRelationID,
                        relation_name: item.nomineeRelation,
                        address: item.nomineeAddress,
                        aadhaar_number: item.nomineeAadhar,
                        adhaar_card_file: item.nomineeAttachment,
                        adhaar_card_file_old_filename: item.oldNomineeAadhar
                    } 
                    //uploadNomineeData.push(createData);
                    const nameTypeList = Object.keys(createData);
                    nameTypeList.forEach((name) => {
                        if(name === "adhaar_card_file"){
                            let data = [];
                            data = createData[name];
                            if(data.length > 0 && !currentPageFilled){
                                data.forEach((subItem, subIndex) => {
                                    sendData.append(`nominee[${name}][${index}][${subIndex}]`, subItem)
                                })
                            }else{
                                sendData.append(`nominee[${name}][]`, 0)
                            }
                        }else if(name === "adhaar_card_file_old_filename"){
                            let data = [];
                            data = createData["adhaar_card_file"];
                            if(data.length > 0 && currentPageFilled){
                                data.forEach((subItem, subIndex) => {
                                    sendData.append(`nominee[${name}][${index}][${subIndex}]`, subItem);
                                })
                            }else{
                                sendData.append(`nominee[${name}][]`, "");
                            }
                        }else{
                            sendData.append(`nominee[${name}][]`, createData[name]);
                        }
                    })
                });
                // let uploadFamilyData = [];
                // familyData.forEach((item, index) => {
                //     const createData = {
                //         name: item.name,
                //         date_of_birth: item.dob,
                //         relationship: item.relationID,
                //         relation_name: item.relation,
                //         residing_with: item.residing,
                //         country_id: 1,
                //         country: "India",
                //         state_id: item.stateID,
                //         state: item.stateName,
                //         city_id: item.cityID,
                //         city: item.cityName,
                //         aadhaar_number: item.aadharNumber,
                //         adhaar_card_file: item.aadharAttachment,
                //         adhaar_card_file_old_filename: item.oldFamilyAadhar
                //     } 
                //     uploadFamilyData.push(createData)
                // });
                // let uploadNomineeData = [];
                // nomineeData.forEach((item, index) => {
                //     const createData = {
                //         name: item.nomineeName,
                //         date_of_birth: item.nomineeDOB,
                //         relationship: item.nomineeRelationID,
                //         relation_name: item.nomineeRelation,
                //         address: item.nomineeAddress,
                //         aadhaar_number: item.nomineeAadhar,
                //         adhaar_card_file: item.nomineeAttachment,
                //         adhaar_card_file_old_filename: item.oldNomineeAadhar
                //     } 
                //     uploadNomineeData.push(createData)
                // });
                const uploadDispensaryDetails = this.state.filledDispensary();
                if(uploadDispensaryDetails){
                    sendData.append('despensary_detail[for_insured_person]', this.state.input1);
                    sendData.append('despensary_detail[for_family]', this.state.input2);
                }
                this.showLoader();
                console.log("@@@ &&& @@@ BASEURL: ", `${baseURL}/onboarding/submit-onboarding`, "\n\nDATA: ", sendData);
                axios.post(`${baseURL}/onboarding/submit-onboarding`,
                sendData,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${secretToken}`
                    }
                }).then((response) => {
                    this.hideLoader();
                    console.log("%%%%%%% SUCCESS ###$$$^^^ ", response);
                    const parsedData = response.data;
                    if(parsedData.status === 1){
                        alert(parsedData.message);
                        console.log("&&&&& SUCCESS ACHIEVED: ", "\n", parsedData.sectionData.links.next, "\n", parsedData.sectionData.links.currentPage)
                        this.props.navigation.navigate(parsedData.sectionData.links.currentPage.key, {apiData: JSON.stringify(parsedData)})
                    }else if(parsedData.status === 0){
                        Alert.alert(parsedData.message, `${parsedData.errors}`);
                    }
                }).catch((error) => {
                    this.hideLoader();
                    console.log("%%% ERROR: ", error, error.response)
                    if(error.response){
                        const status = error.response.status;
                        console.log("%%% ERROR2: ", error.response)
                        Alert.alert("ERROR", `Error Code: ${status}609`);
                    }else{
                        alert(`${error}, API CODE: 609`);
                    }
                })
            }else{
                alert("Please fill the fields highlighted in RED.");
            }
        })
    }

    render(){
        const {
            submit, esi, esiError, familyData, residing, residingID, residingError, bankID, bankName, bankError, name, nameError, dob, dobError, 
            mobile, mobileError, relation, relationID, relationError, bankAC, bankACError, address, house, houseError, sameAddress, addFamilyDetails, 
            addNomineeDetails, road, roadError, locality, localityError, countryID, countryName, countryError, stateID, stateName, stateError, cityID, 
            cityName, aadharNumber, aadharNumberError, aadharAttachment, aadharAttachmentError, nomineeData, nomineeName, nomineeNameError, nomineeDOB, 
            nomineeDOBError, nomineeRelationID, nomineeRelation, nomineeRelationError, nomineeAddress, nomineeAddressError, nomineeAadhar, 
            nomineeAadharError, nomineeAttachment, nomineeAttachmentError, cityError, input1, input1Error, input2, input2Error, screens, showScreensList,
            editFamilyDetails, cityList, editNomineeDetails, showFamilyModal, showNomineeModal, baseURL, loading, includeSecurity
        } = this.state;
        const apiData = JSON.parse(this.props.route.params.apiData);
        const relationData = apiData.sectionData.dropdown.relations;
        const personalDetails = apiData.sectionData.firstPagedetail.personal;
        const residingWith = [
            {id: '1', name: 'Yes'},
            {id: '2', name: 'No'},
        ];
        const currentYear = moment().year();
        const month = '01';
        const minDate = `${currentYear - 75}-${month}-01`;
        const maxDate = `${currentYear}-${moment().month() + 1}-${moment().date()}`;
        const buttonColor = 'rgb(19,111,232)';
        const disableEdit = apiData.sectionData.oldData;
        const fullName = `${personalDetails.first_name} ${personalDetails.middle_name} ${personalDetails.last_name}`;
        let totalNominee = 1;
        if(apiData.sectionData.hasOwnProperty('totalNominee')){
            totalNominee = apiData.sectionData.totalNominee;
        }
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
                                            title={"ESI Nomination Form"}
                                            titleStyle={[{fontWeight: '600', color: '#000000', fontSize: (fontSizeH3().fontSize), textDecorationLine: 'underline'}]}
                                            start={{x: 0, y: 0}}
                                            end={{x: 0.7, y: 0}}
                                            colors={["#039FFD", "#EA304F"]}
                                        />
                                    </View>
                                </DismissKeyboard>
                                <View style={{flex: 1, borderWidth: 0, borderColor: 'red'}}>
                                    <View style={[{
                                        alignItems: 'center', backgroundColor: 'transparent', borderColor: 'cyan',
                                        borderWidth: 0, flex: 1}, getMarginBottom(0)]}> 
                                        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" style={[{flex: 1, borderWidth: 0, borderColor: 'blue'}, getMarginVertical(1), getWidthnHeight(93, (Platform.OS === "android")? 75 : 71.5)]}>
                                            <View style={[{flex: 1, alignItems: 'center'}]}>
                                                <View style={[{flexDirection: 'row', alignItems: 'center'}, getWidthnHeight(87), getMarginTop(1)]}>
                                                    <MaskedGradientText
                                                        title={"Your Details"}
                                                        titleStyle={[{color: '#000000', fontSize: (fontSizeH4().fontSize + 3), fontWeight: 'bold'}]}
                                                        start={{x: 0, y: 0}}
                                                        end={{x: 0.8, y: 0}}
                                                        colors={["#039FFD", "#EA304F"]}
                                                    />
                                                    <Text style={[{fontSize: (fontSizeH4().fontSize + 2)}, styles.boldFont]}> (as in documents)</Text>
                                                </View>
                                                <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, getWidthnHeight(87), getMarginTop(2)]}>
                                                    <Text style={[{fontWeight: 'bold', fontSize: (fontSizeH4().fontSize + 2)}, styles.boldFont]}>Name:</Text>
                                                    <Text style={[{fontSize: (fontSizeH4().fontSize + 2)}]}>{fullName}</Text>
                                                </View>
                                                <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, getWidthnHeight(87), getMarginTop(2)]}>
                                                    <Text style={[{fontWeight: 'bold', fontSize: (fontSizeH4().fontSize + 2)}, styles.boldFont]}>Date of Birth:</Text>
                                                    <Text style={[{fontSize: (fontSizeH4().fontSize + 2)}]}>{moment(personalDetails.date_of_birth, "YYYY-MM-DD").format("DD-MM-YYYY")}</Text>
                                                </View>
                                                <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, getWidthnHeight(87), getMarginTop(2)]}>
                                                    <Text style={[{fontWeight: 'bold', fontSize: (fontSizeH4().fontSize + 2)}, styles.boldFont]}>Father / Spouse Name:</Text>
                                                    <Text style={[{fontSize: (fontSizeH4().fontSize + 2)}]}>{personalDetails.father_name}</Text>
                                                </View>
                                                <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, getWidthnHeight(87), getMarginTop(2)]}>
                                                    <Text style={[{fontWeight: 'bold', fontSize: (fontSizeH4().fontSize + 2)}, styles.boldFont]}>Aadhar Card Number:</Text>
                                                    <Text style={[{fontSize: (fontSizeH4().fontSize + 2)}]}>{apiData.adhaarNumber}</Text>
                                                </View>
                                                <View style={[getMarginTop(2)]}>
                                                    <AnimatedTextInput 
                                                        placeholder=" ESI Number "
                                                        placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                        value={esi}
                                                        keyboardType={'numeric'}
                                                        maxLength={10}
                                                        slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                        slideHorizontal={[0, getWidthnHeight(-2).width]}
                                                        placeholderScale={[1, 0.75]}
                                                        autoFocus={false}
                                                        onChangeText={(value) => {
                                                            this.setState({ esi: value.replace(/[^0-9]/g, '') }, () => {
                                                                const {esi} = this.state;
                                                                if(esi.length === 10){
                                                                    this.setState({esiError: false})
                                                                }else if(esi === ''){
                                                                    this.setState({esiError: true}, () => Keyboard.dismiss())
                                                                }else if(esi.length < 10){
                                                                    this.setState({esiError: true})
                                                                }
                                                            })
                                                        }}
                                                        clearText={() => this.setState({esi: '', esiError: true})}
                                                        containerColor={[(submit && esi && esiError)? 'red' : '#C4C4C4', (submit && esi && esiError)? 'red' : '#C4C4C4']}
                                                        containerBorderWidth={[(submit && esi && esiError)? 2 : 1, 1]}
                                                        containerStyle={[{
                                                            borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && esi && esiError)? 'dashed' : 'solid',
                                                        }, getWidthnHeight(87, 6.5)]}
                                                        style={[{
                                                            borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2),
                                                            color: (esiError)? 'red' : 'black'
                                                        }, getWidthnHeight(87, 6.5), getMarginHorizontal(1)]}
                                                    />
                                                </View>
                                                <View style={[{backgroundColor: 'rgba(196, 196, 196, 0.5)', height: 1}, getWidthnHeight(87), getMarginTop(3)]}/>
                                                {(showFamilyModal) &&
                                                    <FamilyDetailsModal
                                                        disableEdit={Boolean(disableEdit)}
                                                        data={familyData}
                                                        title={'Family Members'}
                                                        editFamilyData={(item, index) => this.editFamilyDetailsFunction(item, index)}
                                                        isvisible={showFamilyModal}
                                                        toggle={() => this.setState({showFamilyModal: false})}
                                                        colorTheme={colorTitle}
                                                        dobBG={'#FFA400'}
                                                        arrowColor={'grey'}
                                                        deleteFamilyDetail = {(index) => this.deleteFamilyInstance(index)}
                                                    />
                                                }
                                                <View style={[{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, getMarginTop(2), getWidthnHeight(87)]}>
                                                    <View style={{alignItems: 'center'}}>
                                                        <MaskedGradientText
                                                            title={"Dependent"}
                                                            titleStyle={[{color: '#000000', fontSize: (fontSizeH4().fontSize + 4), fontWeight: 'bold'}]}
                                                            start={{x: 0, y: 0}}
                                                            end={{x: 0.9, y: 0}}
                                                            colors={["#039FFD", "#EA304F"]}
                                                        />
                                                        <MaskedGradientText
                                                            title={"Family Members Details"}
                                                            titleStyle={[{color: '#000000', fontSize: (fontSizeH4().fontSize + 4), fontWeight: 'bold'}]}
                                                            start={{x: 0, y: 0}}
                                                            end={{x: 0.9, y: 0}}
                                                            colors={["#039FFD", "#EA304F"]}
                                                        />
                                                    </View>
                                                    <TouchableOpacity activeOpacity={0.7} onPress={() => {this.setState({showFamilyModal: true}, () => Keyboard.dismiss())}}>
                                                        <View style={[{backgroundColor: buttonColor, alignItems: 'center', justifyContent: 'center', borderRadius: getWidthnHeight(2).width}, getWidthnHeight(25, 5)]}>
                                                            {(familyData.length === 0)?
                                                                <Text style={[{color: '#FFFFFF'}, fontSizeH4()]}>View All</Text>
                                                            :
                                                                <Text style={[{color: '#FFFFFF'}, fontSizeH4()]}>{`View All (${familyData.length})`}</Text>
                                                            }      
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={[{alignItems: 'flex-start'}, getWidthnHeight(87)]}>
                                                    <Text style={[{fontSize: (fontSizeH4().fontSize - 2)}]}>{`(Spouse, Children & Parents only)`}</Text>
                                                </View>
                                                <View style={[{
                                                    borderWidth: 1, borderColor: '#C4C4C4', borderRadius: getWidthnHeight(2).width, 
                                                    alignItems: 'center', overflow: 'hidden'
                                                    }, getMarginTop(2), getWidthnHeight(87)
                                                ]}>
                                                    <View style={[{alignItems: 'center', flex: 1}, getWidthnHeight(87)]}>
                                                        <View style={{alignItems: 'center', flex: 1}}>
                                                            <View style={[getMarginTop(2)]}>
                                                                <AnimatedTextInput 
                                                                    placeholder=" Name "
                                                                    placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                                    autoCapitalize={"words"}
                                                                    value={name}
                                                                    slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                                    slideHorizontal={[0, getWidthnHeight(-1).width]}
                                                                    placeholderScale={[1, 0.75]}
                                                                    autoFocus={false}
                                                                    onChangeText={(name) => {
                                                                        this.setState({ name: name.trimLeft() }, () => {
                                                                            const {name} = this.state;
                                                                            if(name !== ''){
                                                                                this.setState({nameError: false})
                                                                            }else{
                                                                                this.setState({name: '', nameError: true}, () => Keyboard.dismiss())
                                                                            }
                                                                        })
                                                                    }}
                                                                    clearText={() => this.setState({name: '', nameError: true})}
                                                                    containerColor={[(addFamilyDetails && nameError)? 'red' : '#C4C4C4', (addFamilyDetails && nameError)? 'red' : '#C4C4C4']}
                                                                    containerBorderWidth={[(addFamilyDetails && nameError)? 2 : 1, 1]}
                                                                    containerStyle={[{
                                                                        borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (addFamilyDetails && nameError)? 'dashed' : 'solid',
                                                                    }, getWidthnHeight(80, 6.5)]}
                                                                    style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(80, 6.5), getMarginHorizontal(2)]}
                                                                />
                                                            </View>
                                                            <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, getWidthnHeight(80), getMarginTop(2)]}>
                                                                <AnimateDateLabel
                                                                    containerColor={[(addFamilyDetails && dobError)? 'red' : '#C4C4C4', (addFamilyDetails && dobError)? 'red' : '#C4C4C4']}
                                                                    containerBorderWidth={[(addFamilyDetails && dobError)? 2 : 1, 1]}
                                                                    containerStyle={[{
                                                                        borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (addFamilyDetails && dobError)? 'dashed' : 'solid',
                                                                    }, getWidthnHeight(40, 6.5)]}
                                                                    slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                                    slideHorizontal={[0, getWidthnHeight(-5).width]}
                                                                    style={[{justifyContent: 'center'}, getWidthnHeight(40, 6.5)]}
                                                                    titleStyle={[{fontSize: (fontSizeH4().fontSize)}, getMarginLeft(-1)]}
                                                                    date={dob}
                                                                    dateIcon={{transform: [{scale: 0}]}}
                                                                    minDate={`${minDate}`}
                                                                    maxDate={`${maxDate}`}
                                                                    mode="date"
                                                                    placeholder="DOB (YYYY-MM-DD) "
                                                                    format="YYYY-MM-DD"
                                                                    onDateChange={(date) => {this.setState({dob: date, dobError: false}, () => {
                                                                        Keyboard.dismiss();
                                                                    })}}
                                                                />
                                                                <View style={[{
                                                                    borderColor: (addFamilyDetails && relationError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: getWidthnHeight(1).width,
                                                                    borderStyle: (addFamilyDetails && relationError)? 'dashed' : 'solid', borderWidth: (addFamilyDetails && relationError)? 2 : 1,
                                                                }, getWidthnHeight(37, 6.5)]}>
                                                                    <Dropdown
                                                                        containerStyle={[{textOverflow:'hidden', borderColor: '#C4C4C4', borderWidth: 0}, getWidthnHeight(37), getMarginTop(-1)]}
                                                                        inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getWidthnHeight(37)]}
                                                                        label={'Relationship'}
                                                                        labelFontSize={fontSizeH4().fontSize - 3}
                                                                        labelTextStyle={[getMarginLeft(1.5), getMarginTop(0)]}
                                                                        data={relationData}
                                                                        valueExtractor={({id})=> id}
                                                                        labelExtractor={({name})=> name}
                                                                        onChangeText={(id, index, data) => {
                                                                            this.setState({
                                                                                relation: data[index]['name'], relationID: id, relationError: false 
                                                                            }, () => console.log("### BANK ID: ", this.state.bankID))
                                                                            this.dismissKeyboard();
                                                                        }}
                                                                        value={relation}
                                                                        baseColor = {(relation)? colorTitle : '#C4C4C4'}
                                                                        //pickerStyle={[getMarginLeft(4), getWidthnHeight(42), getMarginTop(10)]}
                                                                        fontSize = {(relation)? fontSizeH4().fontSize + 2 : fontSizeH4().fontSize}
                                                                    />
                                                                </View>
                                                            </View>
                                                            <View style={[{flexDirection: 'row', justifyContent: 'space-between'}, getWidthnHeight(80), getMarginTop(2)]}>
                                                                <View style={[{
                                                                    borderColor: (addFamilyDetails && residingError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: getWidthnHeight(1).width,
                                                                    borderStyle: (addFamilyDetails && residingError)? 'dashed' : 'solid', borderWidth: (addFamilyDetails && residingError)? 2 : 1,
                                                                }, getWidthnHeight(40, 6.5)]}>
                                                                    <Dropdown
                                                                        containerStyle={[{textOverflow:'hidden', borderColor: '#C4C4C4', borderWidth: 0}, getWidthnHeight(40), getMarginTop(-1)]}
                                                                        inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getWidthnHeight(40)]}
                                                                        label={'Residing Together'}
                                                                        labelFontSize={fontSizeH4().fontSize - 3}
                                                                        labelTextStyle={[getMarginLeft(1.5), getMarginTop(0)]}
                                                                        data={residingWith}
                                                                        valueExtractor={({id})=> id}
                                                                        labelExtractor={({name})=> name}
                                                                        onChangeText={(id, index, data) => {
                                                                            this.setState({
                                                                                residing: data[index]['name'], residingID: id, residingError: false 
                                                                            }, () => console.log("### RESIDING ID: ", this.state.residingID))
                                                                            this.dismissKeyboard();
                                                                        }}
                                                                        value={residing}
                                                                        baseColor = {(residing)? colorTitle : '#C4C4C4'}
                                                                        //pickerStyle={[getMarginLeft(4), getWidthnHeight(42), getMarginTop(10)]}
                                                                        fontSize = {(residing)? fontSizeH4().fontSize + 2 : fontSizeH4().fontSize}
                                                                    />
                                                                </View>
                                                                <AnimatedTextInput 
                                                                    placeholder=" Aadhar Number "
                                                                    placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                                    value={aadharNumber}
                                                                    slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                                    slideHorizontal={[0, getWidthnHeight(-3.5).width]}
                                                                    placeholderScale={[0.95, 0.75]}
                                                                    keyboardType={'numeric'}
                                                                    maxLength={12}
                                                                    autoFocus={false}
                                                                    onChangeText={(value) => {
                                                                        const aadharValue = value.replace(/[^0-9]/g, '');
                                                                        this.setState({ aadharNumber: aadharValue}, () => {
                                                                            const {aadharNumber} = this.state;
                                                                            if(aadharNumber.length === 12){
                                                                                this.setState({aadharNumberError: false})
                                                                            }else if(aadharNumber === ''){
                                                                                this.setState({aadharNumberError: true}, () => Keyboard.dismiss())
                                                                            }else if(aadharNumber.length < 12){
                                                                                this.setState({aadharNumberError: true})
                                                                            }
                                                                        })
                                                                    }}
                                                                    clearText={() => this.setState({aadharNumber: '', aadharNumberError: true})}
                                                                    containerColor={[(addFamilyDetails && aadharNumberError)? 'red' : '#C4C4C4', (addFamilyDetails && aadharNumberError)? 'red' : '#C4C4C4']}
                                                                    containerBorderWidth={[(addFamilyDetails && aadharNumberError)? 2 : 1, 1]}
                                                                    containerStyle={[{
                                                                        borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (addFamilyDetails && aadharNumberError)? 'dashed' : 'solid',
                                                                    }, getWidthnHeight(37, 6.5)]}
                                                                    style={[{
                                                                        borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2),
                                                                        color: (aadharNumberError)? 'red' : 'black'
                                                                    }, getWidthnHeight(37, 6.5), getMarginHorizontal(2)]}
                                                                />
                                                            </View>
                                                            <View style={[{
                                                                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: getWidthnHeight(80).width
                                                            }, getMarginTop(2)]}>
                                                                <View style={[{
                                                                    borderWidth: (addFamilyDetails && stateError)? 2 : 1, borderColor: (addFamilyDetails && stateError)? 'red' : '#C4C4C4',
                                                                    borderStyle: (addFamilyDetails && stateError)? 'dashed' : 'solid', borderRadius: getWidthnHeight(1).width}, getWidthnHeight(40, 6.5)
                                                                ]}>
                                                                    <Dropdown
                                                                        containerStyle={[{textOverflow:'hidden', borderColor: '#C4C4C4', borderWidth: 0}, getWidthnHeight(40), getMarginTop(-1.3)]}
                                                                        inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getWidthnHeight(40)]}
                                                                        label={"State"}
                                                                        labelFontSize={fontSizeH4().fontSize - 3}
                                                                        labelTextStyle={[getMarginLeft(1.5), getMarginTop(0)]}
                                                                        data={stateList}
                                                                        valueExtractor={({id})=> id}
                                                                        labelExtractor={({name})=> name}
                                                                        onChangeText={async(id, index, data) => {
                                                                            Keyboard.dismiss();
                                                                            this.setState({
                                                                                stateID: id, stateName: data[index]['name'], stateError: false,
                                                                                cityID: null, cityName: '', cityError: true
                                                                            }, () => this.cities(this.state))
                                                                        }}
                                                                        value={stateName}
                                                                        baseColor={(stateName)? "#039FFD" : '#C4C4C4'}
                                                                        fontSize={(stateName)? fontSizeH4().fontSize + 2 : fontSizeH4().fontSize}
                                                                    />
                                                                </View>
                                                                <View style={[{
                                                                    borderWidth: (addFamilyDetails && cityError)? 2 : 1, borderColor: (addFamilyDetails && cityError)? 'red' : '#C4C4C4',
                                                                    borderStyle: (addFamilyDetails && cityError)? 'dashed' : 'solid', borderRadius: getWidthnHeight(1).width}, 
                                                                    getWidthnHeight(37, 6.5)
                                                                ]}>
                                                                    <Dropdown
                                                                        containerStyle={[{textOverflow:'hidden', borderColor: '#C4C4C4', borderWidth: 0}, getWidthnHeight(37), getMarginTop(-1.3)]}
                                                                        inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getWidthnHeight(37)]}
                                                                        disabled={stateError}
                                                                        data={cityList}
                                                                        value={cityName}
                                                                        valueExtractor={({id})=> id}
                                                                        label={"City"}
                                                                        fontSize={(cityName)? fontSizeH4().fontSize + 2 : fontSizeH4().fontSize}
                                                                        labelFontSize={fontSizeH4().fontSize - 3}
                                                                        labelTextStyle={[getMarginLeft(1.5), getMarginTop(0)]}
                                                                        baseColor={(cityName)? "#039FFD" : '#C4C4C4'}
                                                                        labelExtractor={({name})=> name}
                                                                        onChangeText={(id, index, data) => {
                                                                            Keyboard.dismiss();
                                                                            this.setState({
                                                                                cityID: id, cityName: data[index]['name'], cityError: false
                                                                            })
                                                                            // this.setState({ cities_Value })
                                                                            // this.setState({cityError: false})
                                                                        }}
                                                                    />
                                                                </View>
                                                            </View>
                                                            <View style={[{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, getWidthnHeight(80), getMarginTop(2)]}>
                                                                <View style={{alignItems: 'flex-start'}}>
                                                                    <Text style={[{color: 'grey'}, fontSizeH4()]}>Aadhar Card (optional)</Text>
                                                                </View>
                                                                <TouchableOpacity
                                                                    activeOpacity={0.5}
                                                                    onPress={() => {
                                                                        Keyboard.dismiss();
                                                                        this.addAttachment(aadharCard)
                                                                    }}
                                                                >
                                                                    {(aadharAttachmentError)?
                                                                        <View style={[{
                                                                            width: getWidthnHeight(13).width, height: getWidthnHeight(13).width, 
                                                                            backgroundColor: 'rgba(11, 142, 232, 0.2)', alignItems: 'center', justifyContent: 'center',
                                                                            borderRadius: getWidthnHeight(1).width, borderWidth: 1, borderColor: 'transparent'
                                                                        }]}>
                                                                            <FontAwesome name="upload" size={getWidthnHeight(7).width} color={buttonColor}/>
                                                                        </View>
                                                                    :
                                                                        <View style={[{
                                                                            width: getWidthnHeight(13).width, height: getWidthnHeight(13).width, 
                                                                            backgroundColor: 'rgba(47, 221, 146, 0.2)', alignItems: 'center', justifyContent: 'center',
                                                                            borderRadius: getWidthnHeight(7.5).width
                                                                        }]}>
                                                                            <FontAwesome name="check-circle" color="#2FDD92" size={getWidthnHeight(9).width}/>
                                                                        </View>
                                                                    }
                                                                </TouchableOpacity>
                                                            </View>
                                                            <View style={[{borderColor: 'red', borderWidth: 0, flexDirection: 'row', alignItems: 'center'}, getWidthnHeight(80, 8)]}>
                                                                <View style={[getWidthnHeight(15)]}/>
                                                                <View style={[{alignItems: 'center'}, getWidthnHeight(50)]}>
                                                                    <BasicChoppedButton
                                                                        onPress={() => {
                                                                            this.setState({addFamilyDetails: true}, () => {
                                                                                const {editFamilyDetails} = this.state;
                                                                                Keyboard.dismiss();
                                                                                if(editFamilyDetails){
                                                                                    this.saveFamilyDetails();
                                                                                }else{
                                                                                    this.enterFamilyDetails()
                                                                                }
                                                                            })
                                                                        }}
                                                                        leftBoxSize={{width: getWidthnHeight(6).width, height: getWidthnHeight(undefined, 5.5).height}}
                                                                        middleBoxSize={{width: getWidthnHeight(18).width, height: getWidthnHeight(undefined, 5.5).height}}
                                                                        rightBoxSize={{width: getWidthnHeight(6).width, height: getWidthnHeight(undefined, 5.5).height}}
                                                                        title={(editFamilyDetails)? 'UPDATE' : 'ADD'}
                                                                        titleStyle={[{
                                                                            color: '#FFFFFF', fontSize: (editFamilyDetails)? (fontSizeH4().fontSize) : (fontSizeH4().fontSize + 2),
                                                                            letterSpacing: (editFamilyDetails)? 0 : 2
                                                                        }]}
                                                                        buttonColor={buttonColor}
                                                                    />
                                                                </View>
                                                                <View style={[{alignItems: 'flex-end'}, getWidthnHeight(15)]}>
                                                                    <TouchableOpacity 
                                                                        activeOpacity={0.5}
                                                                        onPress={() => {this.clearFamilyTable()}}
                                                                    >
                                                                        <View style={[{
                                                                            width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, 
                                                                            backgroundColor: 'rgba(224, 36, 1, 0.2)', alignItems: 'center', justifyContent: 'center',
                                                                            borderRadius: getWidthnHeight(1).width,
                                                                        }, getMarginLeft(3)]}>
                                                                            <IonIcons name="trash" size={getWidthnHeight(5).width} color={deleteColor}/>
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                </View>
                                                            </View>
                                                        </View>
                                                        <View 
                                                            style={[{
                                                                backgroundColor: (disableEdit)? 'rgba(0, 0, 0, 0.3)' : 'transparent', borderTopLeftRadius:0,
                                                                borderTopRightRadius: 0, borderColor: 'yellow', borderWidth: 0}, StyleSheet.absoluteFill
                                                            ]} 
                                                            pointerEvents={(disableEdit)? 'auto' : 'none'}
                                                        />
                                                    </View>
                                                </View>
                                                <View style={[{backgroundColor: 'rgba(196, 196, 196, 0.5)', height: 1}, getWidthnHeight(87), getMarginTop(3)]}/>
                                                <View style={[getMarginTop(2)]}>
                                                    <View style={[{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, getWidthnHeight(87)]}>
                                                        <View>
                                                            <MaskedGradientText
                                                                title={"Nominee Details"}
                                                                titleStyle={[{color: '#000000', fontSize: (fontSizeH4().fontSize + 4), fontWeight: 'bold'}]}
                                                                start={{x: 0, y: 0}}
                                                                end={{x: 0.6, y: 0}}
                                                                colors={["#039FFD", "#EA304F"]}
                                                            />
                                                            <Text style={[{fontSize: (fontSizeH4().fontSize - 2)}]}>{`(Spouse, Children & Parents only)`}</Text>
                                                        </View>
                                                        <TouchableOpacity activeOpacity={0.7} onPress={() => {this.setState({showNomineeModal: true}, () => Keyboard.dismiss())}}>
                                                            <View style={[{backgroundColor: buttonColor, alignItems: 'center', justifyContent: 'center', borderRadius: getWidthnHeight(2).width}, getWidthnHeight(25, 5)]}>
                                                                {(nomineeData.length === 0)?
                                                                    <Text style={[{color: '#FFFFFF'}, fontSizeH4()]}>View All</Text>
                                                                :
                                                                    <Text style={[{color: '#FFFFFF'}, fontSizeH4()]}>{`View All (${(nomineeData.length)})`}</Text>
                                                                }      
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                                {(showNomineeModal) &&
                                                    <FamilyDetailsModal
                                                        disableEdit={Boolean(disableEdit)}
                                                        data={nomineeData}
                                                        title={'Nominees'}
                                                        nominee={true}
                                                        editFamilyData={(item, index) => this.editNomineeDetailsFunction(item, index)}
                                                        isvisible={showNomineeModal}
                                                        toggle={() => this.setState({showNomineeModal: false})}
                                                        colorTheme={colorTitle}
                                                        dobBG={'#FFA400'}
                                                        arrowColor={'grey'}
                                                        deleteFamilyDetail = {(index) => this.deleteNomineeInstance(index)}
                                                    />
                                                }
                                                <View style={[{
                                                    borderWidth: 1, borderColor: '#C4C4C4', borderRadius: getWidthnHeight(2).width, 
                                                    alignItems: 'center', overflow: 'hidden'
                                                    }, getMarginTop(2), getWidthnHeight(87)
                                                ]}>
                                                    <View style={[{alignItems: 'center', flex: 1}, getWidthnHeight(87)]}>
                                                        <View style={{alignItems: 'center', flex: 1}}>
                                                            <View style={[getMarginTop(2)]}>
                                                                <AnimatedTextInput 
                                                                    placeholder=" Name "
                                                                    placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                                    autoCapitalize={"words"}
                                                                    value={nomineeName}
                                                                    slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                                    slideHorizontal={[0, getWidthnHeight(-1).width]}
                                                                    placeholderScale={[1, 0.75]}
                                                                    autoFocus={false}
                                                                    onChangeText={(name) => {
                                                                        this.setState({ nomineeName: name.trimLeft() }, () => {
                                                                            const {nomineeName} = this.state;
                                                                            if(nomineeName !== ''){
                                                                                this.setState({nomineeNameError: false})
                                                                            }else{
                                                                                this.setState({nomineeName: '', nomineeNameError: true}, () => Keyboard.dismiss())
                                                                            }
                                                                        })
                                                                    }}
                                                                    clearText={() => this.setState({nomineeName: '', nomineeNameError: true})}
                                                                    containerColor={[(addNomineeDetails && nomineeNameError)? 'red' : '#C4C4C4', (addNomineeDetails && nomineeNameError)? 'red' : '#C4C4C4']}
                                                                    containerBorderWidth={[(addNomineeDetails && nomineeNameError)? 2 : 1, 1]}
                                                                    containerStyle={[{
                                                                        borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (addNomineeDetails && nomineeNameError)? 'dashed' : 'solid',
                                                                    }, getWidthnHeight(80, 6.5)]}
                                                                    style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(80, 6.5), getMarginHorizontal(2)]}
                                                                />
                                                            </View>
                                                            <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, getWidthnHeight(80), getMarginTop(2)]}>
                                                                <AnimateDateLabel
                                                                    containerColor={[(addNomineeDetails && nomineeDOBError)? 'red' : '#C4C4C4', (addNomineeDetails && nomineeDOBError)? 'red' : '#C4C4C4']}
                                                                    containerBorderWidth={[(addNomineeDetails && nomineeDOBError)? 2 : 1, 1]}
                                                                    containerStyle={[{
                                                                        borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (addNomineeDetails && nomineeDOBError)? 'dashed' : 'solid',
                                                                    }, getWidthnHeight(40, 6.5)]}
                                                                    slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                                    slideHorizontal={[0, getWidthnHeight(-5).width]}
                                                                    style={[{justifyContent: 'center'}, getWidthnHeight(40, 6.5)]}
                                                                    titleStyle={[{fontSize: (fontSizeH4().fontSize)}, getMarginLeft(-1)]}
                                                                    date={nomineeDOB}
                                                                    dateIcon={{transform: [{scale: 0}]}}
                                                                    minDate={`${minDate}`}
                                                                    maxDate={`${maxDate}`}
                                                                    mode="date"
                                                                    placeholder="DOB (YYYY-MM-DD) "
                                                                    format="YYYY-MM-DD"
                                                                    onDateChange={(date) => {this.setState({nomineeDOB: date, nomineeDOBError: false}, () => {
                                                                        Keyboard.dismiss();
                                                                    })}}
                                                                />
                                                                <View style={[{
                                                                    borderColor: (addNomineeDetails && nomineeRelationError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: getWidthnHeight(1).width,
                                                                    borderStyle: (addNomineeDetails && nomineeRelationError)? 'dashed' : 'solid', borderWidth: (addNomineeDetails && nomineeRelationError)? 2 : 1,
                                                                }, getWidthnHeight(37, 6.5)]}>
                                                                    <Dropdown
                                                                        containerStyle={[{textOverflow:'hidden', borderColor: '#C4C4C4', borderWidth: 0}, getWidthnHeight(37), getMarginTop(-1)]}
                                                                        inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getWidthnHeight(37)]}
                                                                        label={'Relationship'}
                                                                        labelFontSize={fontSizeH4().fontSize - 3}
                                                                        labelTextStyle={[getMarginLeft(1.5), getMarginTop(0)]}
                                                                        data={relationData}
                                                                        valueExtractor={({id})=> id}
                                                                        labelExtractor={({name})=> name}
                                                                        onChangeText={(id, index, data) => {
                                                                            this.setState({
                                                                                nomineeRelation: data[index]['name'], nomineeRelationID: id, nomineeRelationError: false 
                                                                            }, () => console.log("###NOMINEE RELATION ID: ", this.state.nomineeRelationID))
                                                                            this.dismissKeyboard();
                                                                        }}
                                                                        value={nomineeRelation}
                                                                        baseColor = {(nomineeRelation)? colorTitle : '#C4C4C4'}
                                                                        //pickerStyle={[getMarginLeft(4), getWidthnHeight(42), getMarginTop(10)]}
                                                                        fontSize = {(nomineeRelation)? fontSizeH4().fontSize + 2 : fontSizeH4().fontSize}
                                                                    />
                                                                </View>
                                                            </View>
                                                            <View style={[getMarginTop(2)]}>
                                                                <AnimatedTextInput 
                                                                    placeholder=" Address of Nominee "
                                                                    placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                                    value={nomineeAddress}
                                                                    slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                                    slideHorizontal={[0, getWidthnHeight(-3.5).width]}
                                                                    placeholderScale={[1, 0.75]}
                                                                    autoFocus={false}
                                                                    onChangeText={(value) => {
                                                                        this.setState({ nomineeAddress: value.trimLeft() }, () => {
                                                                            const {nomineeAddress} = this.state;
                                                                            if(nomineeAddress !== ''){
                                                                                this.setState({nomineeAddressError: false})
                                                                            }else{
                                                                                this.setState({nomineeAddress: '', nomineeAddressError: true}, () => Keyboard.dismiss())
                                                                            }
                                                                        })
                                                                    }}
                                                                    clearText={() => this.setState({nomineeAddress: '', nomineeAddressError: true})}
                                                                    containerColor={[(addNomineeDetails && nomineeAddressError)? 'red' : '#C4C4C4', (addNomineeDetails && nomineeAddressError)? 'red' : '#C4C4C4']}
                                                                    containerBorderWidth={[(addNomineeDetails && nomineeAddressError)? 2 : 1, 1]}
                                                                    containerStyle={[{
                                                                        borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (addNomineeDetails && nomineeAddressError)? 'dashed' : 'solid',
                                                                    }, getWidthnHeight(80, 6.5)]}
                                                                    style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(80, 6.5), getMarginHorizontal(2)]}
                                                                />
                                                            </View>
                                                            <View style={[getMarginTop(2)]}>
                                                                <AnimatedTextInput 
                                                                    placeholder=" Aadhar Card Number "
                                                                    placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                                    value={nomineeAadhar}
                                                                    slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                                    slideHorizontal={[0, getWidthnHeight(-3.5).width]}
                                                                    placeholderScale={[1, 0.75]}
                                                                    keyboardType={'numeric'}
                                                                    maxLength={12}
                                                                    autoFocus={false}
                                                                    onChangeText={(value) => {
                                                                        const aadharValue = value.replace(/[^0-9]/g, '');
                                                                        this.setState({ nomineeAadhar: aadharValue}, () => {
                                                                            const {nomineeAadhar} = this.state;
                                                                            if(nomineeAadhar.length === 12){
                                                                                this.setState({nomineeAadharError: false})
                                                                            }else if(nomineeAadhar === ''){
                                                                                this.setState({nomineeAadhar: '', nomineeAadharError: true}, () => Keyboard.dismiss())
                                                                            }else if(nomineeAadhar.length < 12){
                                                                                this.setState({nomineeAadharError: true})
                                                                            }
                                                                        })
                                                                    }}
                                                                    clearText={() => this.setState({nomineeAadhar: '', nomineeAadharError: true})}
                                                                    containerColor={[(addNomineeDetails && nomineeAadharError)? 'red' : '#C4C4C4', (addNomineeDetails && nomineeAadharError)? 'red' : '#C4C4C4']}
                                                                    containerBorderWidth={[(addNomineeDetails && nomineeAadharError)? 2 : 1, 1]}
                                                                    containerStyle={[{
                                                                        borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (addNomineeDetails && nomineeAadharError)? 'dashed' : 'solid',
                                                                    }, getWidthnHeight(80, 6.5)]}
                                                                    style={[{
                                                                        borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2),
                                                                        color: (nomineeAadharError)? 'red' : 'black'
                                                                    }, getWidthnHeight(80, 6.5), getMarginHorizontal(2)]}
                                                                />
                                                            </View>
                                                            <View style={[{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, getWidthnHeight(80), getMarginTop(2)]}>
                                                                <View style={{alignItems: 'flex-start'}}>
                                                                    <Text style={[{color: 'grey'}, fontSizeH4()]}>Aadhar Card (optional)</Text>
                                                                </View>
                                                                <TouchableOpacity
                                                                    activeOpacity={0.5}
                                                                    onPress={() => {
                                                                        Keyboard.dismiss();
                                                                        this.addAttachment(aadharCard, 'nominee');
                                                                    }}
                                                                >
                                                                    {(nomineeAttachmentError)?
                                                                        <View style={[{
                                                                            width: getWidthnHeight(13).width, height: getWidthnHeight(13).width, 
                                                                            backgroundColor: 'rgba(11, 142, 232, 0.2)', alignItems: 'center', justifyContent: 'center',
                                                                            borderRadius: getWidthnHeight(1).width, borderWidth: 1, borderColor: 'transparent'
                                                                        }]}>
                                                                            <FontAwesome name="upload" size={getWidthnHeight(7).width} color={buttonColor}/>
                                                                        </View>
                                                                    :
                                                                        <View style={[{
                                                                            width: getWidthnHeight(13).width, height: getWidthnHeight(13).width, 
                                                                            backgroundColor: 'rgba(47, 221, 146, 0.2)', alignItems: 'center', justifyContent: 'center',
                                                                            borderRadius: getWidthnHeight(7.5).width
                                                                        }]}>
                                                                            <FontAwesome name="check-circle" color="#2FDD92" size={getWidthnHeight(9).width}/>
                                                                        </View>
                                                                    }
                                                                </TouchableOpacity>
                                                            </View>
                                                            <View style={[{borderColor: 'red', borderWidth: 0, flexDirection: 'row', alignItems: 'center'}, getWidthnHeight(80, 8)]}>
                                                                <View style={[getWidthnHeight(15)]}/>
                                                                <View style={[{alignItems: 'center'}, getWidthnHeight(50)]}>
                                                                    <BasicChoppedButton
                                                                        onPress={() => {
                                                                            this.setState({addNomineeDetails: true}, () => {
                                                                                const {editNomineeDetails} = this.state;
                                                                                Keyboard.dismiss();
                                                                                if(editNomineeDetails){
                                                                                    this.saveNomineeDetails();
                                                                                }else{
                                                                                    this.enterNomineeDetails();
                                                                                }
                                                                            })
                                                                        }}
                                                                        leftBoxSize={{width: getWidthnHeight(6).width, height: getWidthnHeight(undefined, 5.5).height}}
                                                                        middleBoxSize={{width: getWidthnHeight(18).width, height: getWidthnHeight(undefined, 5.5).height}}
                                                                        rightBoxSize={{width: getWidthnHeight(6).width, height: getWidthnHeight(undefined, 5.5).height}}
                                                                        title={(editNomineeDetails)? 'UPDATE' : 'ADD'}
                                                                        titleStyle={[{
                                                                            color: '#FFFFFF', fontSize: (editNomineeDetails)? (fontSizeH4().fontSize) : (fontSizeH4().fontSize + 2),
                                                                            letterSpacing: (editNomineeDetails)? 0 : 2
                                                                        }]}
                                                                        buttonColor={buttonColor}
                                                                    />
                                                                </View>
                                                                <View style={[{alignItems: 'flex-end'}, getWidthnHeight(15)]}>
                                                                    <TouchableOpacity 
                                                                        activeOpacity={0.5}
                                                                        onPress={() => {this.clearNomineeTable()}}
                                                                    >
                                                                        <View style={[{
                                                                            width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, 
                                                                            backgroundColor: 'rgba(224, 36, 1, 0.2)', alignItems: 'center', justifyContent: 'center',
                                                                            borderRadius: getWidthnHeight(1).width,
                                                                        }, getMarginLeft(3)]}>
                                                                            <IonIcons name="trash" size={getWidthnHeight(5).width} color={deleteColor}/>
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                </View>
                                                            </View>
                                                        </View>
                                                        <View 
                                                            style={[{
                                                                backgroundColor: (disableEdit || (nomineeData.length === totalNominee && !editNomineeDetails))? 'rgba(0, 0, 0, 0.3)' : 'transparent', borderTopLeftRadius:0,
                                                                borderTopRightRadius: 0, borderColor: 'yellow', borderWidth: 0}, StyleSheet.absoluteFill
                                                            ]} 
                                                            pointerEvents={(disableEdit || (nomineeData.length === totalNominee && !editNomineeDetails))? 'auto' : 'none'}
                                                        />
                                                    </View>
                                                </View>
                                                <View style={[{backgroundColor: 'rgba(196, 196, 196, 0.5)', height: 1}, getWidthnHeight(87), getMarginTop(3)]}/>
                                                <View style={[{alignItems: 'flex-start'}, getWidthnHeight(87), getMarginTop(2)]}>
                                                    <MaskedGradientText
                                                        title={"Dispensary Details"}
                                                        titleStyle={[{color: '#000000', fontSize: (fontSizeH4().fontSize + 3), fontWeight: 'bold'}]}
                                                        start={{x: 0, y: 0}}
                                                        end={{x: 0.8, y: 0}}
                                                        colors={["#039FFD", "#EA304F"]}
                                                    />
                                                </View>
                                                <View style={[{alignItems: 'flex-start'}, getWidthnHeight(87), getMarginTop(1)]}>
                                                    <Text style={[{color: buttonColor}, fontSizeH4()]}>DISPENSARY / IMP FOR INSURED PERSON</Text>
                                                </View>
                                                <View style={[getMarginTop(1)]}>
                                                    <TextInput 
                                                        placeholder="Textarea"
                                                        placeholderTextColor={"#C4C4C4"}
                                                        value={input1}
                                                        numberOfLines={4}
                                                        multiline
                                                        onChangeText={(text) => {
                                                            this.setState({input1: text.trimLeft()}, () => {
                                                                const {input1} = this.state;
                                                                if(input1 === ''){
                                                                    this.setState({input1Error: true})
                                                                }else{
                                                                    this.setState({input1Error: false})
                                                                }
                                                            })
                                                        }}
                                                        style={[{
                                                            borderColor: (includeSecurity && input1Error)? 'red' : '#C4C4C4', borderWidth: (includeSecurity && input1Error)? 2 : 1,
                                                            borderStyle: (includeSecurity && input1Error)? 'dashed' : 'solid', borderRadius: getWidthnHeight(1).width,
                                                            paddingHorizontal: getMarginLeft(2).marginLeft
                                                        }, fontSizeH4(), getWidthnHeight(87, 10)]}
                                                    />
                                                </View>
                                                <View style={[{alignItems: 'flex-start'}, getWidthnHeight(87), getMarginTop(2)]}>
                                                    <Text style={[{color: buttonColor}, fontSizeH4()]}>DISPENSARY / IMP FOR FAMILY</Text>
                                                </View>
                                                <View style={[getMarginVertical(1)]}>
                                                    <TextInput 
                                                        placeholder="Textarea"
                                                        placeholderTextColor={"#C4C4C4"}
                                                        value={input2}
                                                        numberOfLines={4}
                                                        multiline
                                                        onChangeText={(text) => {
                                                            this.setState({input2: text.trimLeft()}, () => {
                                                                const {input2} = this.state;
                                                                if(input2 === ''){
                                                                    this.setState({input2Error: true})
                                                                }else{
                                                                    this.setState({input2Error: false})
                                                                }
                                                            })
                                                        }}
                                                        style={[{
                                                            borderColor: (includeSecurity && input2Error)? 'red' : '#C4C4C4', borderWidth: (includeSecurity && input2Error)? 2 : 1,
                                                            borderStyle: (includeSecurity && input2Error)? 'dashed' : 'solid', borderRadius: getWidthnHeight(1).width,
                                                            paddingHorizontal: getMarginLeft(2).marginLeft
                                                        }, fontSizeH4(), getWidthnHeight(87, 10)]}
                                                    />
                                                </View>
                                            </View>
                                        </ScrollView>
                                        <View style={[{backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}, getMarginBottom(1), getWidthnHeight(93)]}>
                                            <View style={[getWidthnHeight(34)]}/>
                                            <View style={[{borderWidth: 0, borderColor: 'red'}, getWidthnHeight(32)]}>
                                                <ChoppedButton 
                                                    onPress={() => {this.checkAllErrors()}}
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

export default ESIForm;