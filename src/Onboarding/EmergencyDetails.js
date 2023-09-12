import React, {Component} from 'react';
import {
    View, Text, ImageBackground, Animated, Keyboard, ScrollView,  TextInput, TouchableHighlight,
    FlatList, Alert, Platform, StyleSheet, KeyboardAvoidingView, TouchableOpacity,
    BackHandler, SafeAreaView, StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import DocumentPicker from 'react-native-document-picker'
import moment from 'moment';
import axios from 'axios';
// import { Dropdown } from 'react-native-material-dropdown';
import { Dropdown } from 'react-native-element-dropdown';
import RNBackgroundDownloader from 'react-native-background-downloader';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS, { exists } from 'react-native-fs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    getWidthnHeight, IOS_StatusBar, getMarginTop, fontSizeH4, fontSizeH3, AnimatedTextInput, getMarginHorizontal,
    DismissKeyboard, GradientIcon, ChoppedButton, getMarginVertical, getMarginLeft, getMarginBottom, MaskedGradientText,
    SearchableDropDown, AnimateDateLabel, Slider, getMarginRight, DownloadModal, Spinner, ScreensModal, Attachments, DateTimePicker
} from '../NewComponents/common';
import {fetchBaseURL} from '../api/BaseURL';

const COLOR1 = "#039FFD";
const COLOR2 = "#EA304F";
const downloadColor = "#F98404";
const colorTitle = '#0B8EE8';
const experience = 'experience';
const scannedDD = 'scannedDD';
const mb1 = '1048576'; //1 MB

class EmergencyDetails extends Component{
    constructor(props){
        super(props)
        let year = `${moment().year()}`;
        let month = `${moment().month() + 1}`;
        month = (month < 10)? `0${month}` : month;
        let initialDate = '1';
        initialDate = (initialDate < 10)? `0${initialDate}` : initialDate;
        let currentDate = `${year}-${month}-${initialDate}`;
        console.log("!!@@@ DATE: ", currentDate)
        currentDate = moment(currentDate, "YYYY-MM-DD").subtract(1, 'month').format("YYYY-MM-DD");
        const fromStartDate = moment(currentDate, "YYYY-MM-DD").subtract(50, 'years').format("YYYY-MM-DD");
        const currentYear = moment(currentDate, "YYYY-MM-DD").format("YYYY");
        if(year !== currentYear){
            currentDate = `${year}-${month}-${initialDate}`
            console.log("***&&& DATE2: ", currentDate, year, currentYear)
        }
        const currentTime = "12:00 AM";
        const currentDateTime = `${currentDate} ${currentTime}`;
        const utcTimeStamp = moment(currentDateTime, "YYYY-MM-DD hh:mm A").utc().toDate();
        const fromUtcTime = moment(`${fromStartDate} 12:00 AM`, "YYYY-MM-DD hh:mm A").utc().toDate();
        this.state = {
            submit: false,
            bankID: null,
            bankName: '',
            bankError: true,
            name: '',
            nameError: true,
            mobile: '',
            mobileError: true,
            relation: '',
            relationID: null,
            relationError: true,
            address: 'new',
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
            fromDate: '',
            fromDateError: true,
            fromTimeStamp: moment().valueOf(),
            fromTime: '12:00 AM',
            fromMinDate: fromUtcTime,
            showFromDatePicker: false,
            toDate: '',
            toDateError: true,
            toTimeStamp: moment().valueOf(),
            toTime: '11:59 PM',
            toMinDate: fromUtcTime,
            showToDatePicker: false,
            stdCode: '',
            stdCodeError: true,
            landline: '',
            landlineError: true,
            companyName: '',
            companyNameError: true,
            companyWebsite: '',
            companyWebsiteError: true,
            reportingPerson: '',
            reportingPersonError: true,
            personDesignationID: null,
            personDesignation: '',
            personDesignationError: true,
            orgEmail: false,
            orgEmailAddress: '',
            orgEmailError: true,
            email: false,
            emailAddress: '',
            emailError: true,
            rpContact: '',
            rpContactError: true,
            ctc: '',
            ctcError: true,
            reason: '',
            reasonError: true,
            myDepartmentID: null,
            myDepartment: '',
            myDepartmentError: true,
            myDesignationID: null,
            myDesignation: '',
            myDesignationError: true,
            experienceCertificate: '',
            experienceError: true,
            fullnFinal: false,
            ddDate: '',
            ddDateError: true,
            ddTimeStamp: moment().valueOf(),
            ddMinDate: utcTimeStamp,
            ddNumber: '',
            ddNumberError: true,
            amount: '',
            amountError: true,
            ddCopy: '',
            ddCopyError: true,
            showDDPicker: false,
            noError: function(){
                return (
                    this.nameError === false && this.mobileError === false && this.relationError === false &&
                    this.houseError === false && this.pincodeError === false && this.roadError === false && 
                    this.localityError === false && this.countryError === false && this.stateError === false && 
                    this.cityError === false
                );
            },
            checkEmpHistory: false,
            anyEmpError: function(){
                return (
                    this.fromDateError === false || this.toDateError === false || this.companyNameError === false || this.stdCodeError === false || this.landlineError === false ||
                    this.companyWebsiteError === false || this.reportingPersonError === false || this.personDesignationError === false || this.emailError === false ||
                    this.rpContactError === false || this.ctcError === false || this.reasonError === false || this.experienceError === false || this.orgEmailError === false
                );
            },
            noEmpError: function(){
                // const data = [
                //     this.fromDateError , this.toDateError , this.companyNameError , this.stdCodeError , this.landlineError ,
                //     this.companyWebsiteError , this.reportingPersonError , this.personDesignationError , this.emailError ,
                //     this.rpContactError , this.ctcError , this.reasonError , this.experienceError , this.orgEmailError
                // ];
                // data.forEach((name) => {
                //     console.log(`${name}\n`)
                // })
                return (
                    this.fromDateError === false && this.toDateError === false && this.companyNameError === false && this.stdCodeError === false && this.landlineError === false &&
                    this.companyWebsiteError === false && this.reportingPersonError === false && this.personDesignationError === false && this.emailError === false &&
                    this.rpContactError === false && this.ctcError === false && this.reasonError === false && this.experienceError === false && this.orgEmailError === false
                );
            },
            checkSecurity: false,
            anysecurityError: function(){
                return (
                    this.ddDateError === false || this.ddNumberError === false || this.bankError === false || this.amountError === false || this.ddCopyError === false
                );
            },
            noSecurityError: function(){
                return (
                    this.ddDateError === false && this.ddNumberError === false && this.bankError === false && this.amountError === false && this.ddCopyError === false
                );
            },
            screens: [],
            showScreensList: false,
            baseURL: null,
            loading: false,
            uploadedExperience: [],
            viewAttachments: false, 
            secretToken: null, 
            removeAttachment: 'experience',
            downloadModal: false,
            percent: 0,
            fullFileName: '',
            checkFile: false,
            fileSize: null,
            downloadFileName: '',
            showHistory: false,
            showSecurityDetails: false
        };
    }

    componentDidMount(){
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.handleBackButton())
        AsyncStorage.getItem('onboardingToken').then((secretToken) => {
            this.setState({secretToken})
        });
        fetchBaseURL().then((baseURL) => {
            const apiData = JSON.parse(this.props.route.params.apiData);
            this.setState({baseURL, screens: apiData.sectionData.links.pageLinks}, () => {
                if(apiData.sectionData.oldData){
                    this.fillOldData();
                }
            })
        })
    }

    fillOldData(){
        const apiData = JSON.parse(this.props.route.params.apiData);
        const emergencyDetails = apiData.sectionData.oldData.emergency_contact;
        this.setState({
            name: emergencyDetails.name, nameError: false, mobile: emergencyDetails.mobile_number, mobileError: false, 
            relationID: emergencyDetails.relation, relation: emergencyDetails.relation_name, relationError: false
        }, () => {
            if(emergencyDetails.same_as_correspondence === "0" && emergencyDetails.same_as_permanent === "0"){
                this.setState({
                    house: emergencyDetails.house_number, houseError: false, pincode: emergencyDetails.pincode, pincodeError: false, road: emergencyDetails.road, roadError: false,
                    locality: emergencyDetails.locality, localityError: false, countryID: emergencyDetails.country_id, countryName: emergencyDetails.country, countryError: false,
                    stateID: emergencyDetails.state_id, stateName: emergencyDetails.state, stateError: false, cityID: emergencyDetails.city_id, cityName: emergencyDetails.city,
                    cityError: false
                })
            }else if(emergencyDetails.same_as_permanent === "1"){
                this.setState({address: 'permanent'}, () => this.fillAddress())
            }else if(emergencyDetails.same_as_correspondence === "1"){
                this.setState({address: 'correspondence'}, () => this.fillAddress())
            }
        })
        if(apiData.sectionData.oldData.hasOwnProperty('employment_history')){
            const empHistoryDetail = apiData.sectionData.oldData.employment_history[0];
            console.log("@#@#@ EMP HISTORY: ", JSON.stringify(empHistoryDetail, null, 4));
            this.setState({
                fromDate: empHistoryDetail.from_date, fromDateError: false, toDate: empHistoryDetail.to_date, toDateError: false, companyName: empHistoryDetail.organization_name,
                showHistory: true, companyNameError: false, stdCode: empHistoryDetail.std_code, stdCodeError: false, landline: empHistoryDetail.landline_number, landlineError: false,
                orgEmail: true, orgEmailAddress: empHistoryDetail.organization_email, orgEmailError: false, companyWebsite: empHistoryDetail.organization_website, 
                companyWebsiteError: false, reportingPerson: empHistoryDetail.reporting_person, reportingPersonError: false, personDesignation: empHistoryDetail.reporting_person_designation,
                personDesignationError: false, email: true, emailAddress: empHistoryDetail.official_email, emailError: false, rpContact: empHistoryDetail.reporting_person_number, 
                rpContactError: false, ctc: empHistoryDetail.ctc_per_month, ctcError: false, reason: empHistoryDetail.reason_for_leaving, reasonError: false, 
                fullnFinal: (empHistoryDetail.department === null || empHistoryDetail.department === "null")? false : true, experienceError: false,
                uploadedExperience: empHistoryDetail.experience_certificate
            }, () => {
                const {fullnFinal, personDesignation} = this.state;
                if(fullnFinal){
                    const apiData = JSON.parse(this.props.route.params.apiData); 
                    let departmentList = [];
                    departmentList = Array.isArray(apiData.sectionData.dropdown.departments) && apiData.sectionData.dropdown.departments.map((item) => {
                        return {...item, id: `${item.id}`};
                    });
                    let designationList = [];
                    designationList = Array.isArray(apiData.sectionData.dropdown.designations) && apiData.sectionData.dropdown.designations.map((item) => {
                        return {...item, id: `${item.id}`};
                    });
                    const departmentDetail = departmentList.find((item) => item.name.trim() === empHistoryDetail.department.trim());
                    const reportingPersonDeignation = designationList.find((item) => item.name.trim() === personDesignation.trim());
                    const designationDetail = designationList.find((item) => item.name.trim() === empHistoryDetail.designation.trim());
                    console.log("!!!! DEPARTMENT DETAIL: ", departmentDetail);
                    this.setState({
                        myDepartment: empHistoryDetail.department, myDepartmentID: departmentDetail?.id, myDepartmentError: false,
                        myDesignation: empHistoryDetail.designation, myDesignationID: designationDetail?.id, myDesignationError: false,
                        personDesignationID: reportingPersonDeignation?.id
                    })
                }
            })
        }
        if(apiData.sectionData.oldData.hasOwnProperty('security')){
            const securityDetails = apiData.sectionData.oldData.security;
            this.setState({
                ddDate: securityDetails.dd_date, ddDateError: false, ddNumber: securityDetails.dd_number, ddNumberError: false, 
                bankID: securityDetails.bank_name, bankName: securityDetails.bank, bankError: false, amount: securityDetails.dd_amount, 
                amountError: false, ddCopyError: false, showSecurityDetails: true
            })
        }
    }

    handleBackButton = () => {
        //ToastAndroid.show('Not Allowed', ToastAndroid.SHORT)
        if(this.props.route.name === "EmergencyDetails"){
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

    async generateDownloadLink(fileName, docID, document){
        this.setState({downloadFileName: fileName}, () => {
            this.downloadAttachment(docID, document);
        })
    }

    async downloadAttachment(docID, document){
        const {downloadFileName, secretToken, loading} = this.state;
        //console.log("BEFORE: ", secretToken, "\n\n", loading)
        if(!secretToken || loading){
            return;
        }
        //console.log("AFTER")
        this.showLoader();
        let downloadDir = null;
        if(Platform.OS === 'android'){
            downloadDir = RNFetchBlob.fs.dirs.DownloadDir;
        }else if(Platform.OS === 'ios'){
            downloadDir = RNFS.DocumentDirectoryPath;
        }
        const downloadPath = `${downloadDir}/S3_${downloadFileName}`;
        this.setState({fullFileName: `S3_${downloadFileName}`}, () => {
            const {fullFileName} = this.state;
            if(fullFileName){
                exists(downloadPath).then((checkFile) => {
                    //console.log("@@@@@ CHECK FILE EXISTS: ", checkFile);
                    if(checkFile){
                        Alert.alert("File already exists!", `${fullFileName} ${"\n\n"}Continue Downloading ?`, [
                            {
                                text: "Yes",
                                onPress: () => {
                                    console.log("%%%% CONTINUE YES")
                                    this.continueDownload(downloadPath, docID, document);
                                }
                            },
                            {
                                text: "No",
                                onPress: () => {
                                    console.log("^^^^ DOWNLOAD DISCARDED")
                                    this.setState({loading: false, downloadModal: false, fullFileName: ''})
                                    return;
                                }
                            }
                        ])
                    }else{
                        this.continueDownload(downloadPath, docID, document);
                    }
                })
            }
        });
    }

    continueDownload(downloadPath, id, staticValue){
        const {secretToken, fullFileName, baseURL, downloadFileName} = this.state;
        const apiData = JSON.parse(this.props.route.params.apiData);
        const document = (staticValue === null)? downloadFileName : staticValue;
        const docID = (id)? id : 0;
        console.log(
            "###### CONTINUE DOWNLOAD\n\n", 
            `${baseURL}/onboarding/download-document/${document}/${apiData.draftId}/${downloadFileName}/${(docID)}`, 
            "\n\n", fullFileName, downloadPath
        );
        const downloadLink = `${baseURL}/onboarding/download-document/${document}/${apiData.draftId}/${downloadFileName}/${docID}`;
        RNBackgroundDownloader.download({
            id: fullFileName,
            url: downloadLink,
            destination: downloadPath,
            headers: {
                Authorization: `Bearer ${secretToken}`
            }
        }).begin((expectedBytes) => {
            //console.log(`Going to download ${expectedBytes} bytes!`);
            this.setState({fileSize: expectedBytes}, () => {
                if(this.state.fileSize > 0){
                    this.setState({downloadModal: true})
                }
            });
        }).progress((percent) => {
            console.log(`Downloaded: ${percent * 100}%`);
            this.setState({percent: Math.floor(percent * 100)})
        }).done(() => {
            const {fileSize} = this.state;
            console.log('Download is done!');
            this.setState({downloadModal: false, percent: 0})
            this.hideLoader();
            if(fileSize > 0){
                if(Platform.OS === 'android'){
                    Alert.alert("Download Complete!", `File available in Downloads folder. ${"\n\n"} ${fullFileName}`)
                }else if(Platform.OS === 'ios'){
                    Alert.alert("Download Complete!", `On My iPhone/xenia: ${"\n\n"} ${fullFileName}`)
                }
            }else{
                Alert.alert("File not found")
            }
            this.setState({fullFileName: ''})
        }).error((error) => {
            console.log('@@@ Download canceled due to error: ', error);
            this.setState({downloadModal: false, percent: 0, fullFileName: ''})
            this.hideLoader();
            Alert.alert("Error!", `Unable to Download File.\nError Code: 614`)
        });
    }

    async checkExistingDownloads(attachment, docID = null, document = null){
        const {loading} = this.state;
        if(loading){
            this.setState({downloadModal: true})
            return;
        }
        let lostTasks = await RNBackgroundDownloader.checkForExistingDownloads();
        //console.log("$$$$ ANY DOWNLOADS: ", lostTasks)
        if(lostTasks.length == 0){
            this.generateDownloadLink(attachment, docID, document)
        }else if(lostTasks.length > 0){
            this.setState({loading: true, downloadModal: true})
            for(let task  of lostTasks){
                this.setState({fullFileName: task['id']})
                //console.log("***^^^ TASK ID: ", task['id'])
                task.progress((percent) => {
                    this.setState({percent: Math.floor(percent * 100)})
                    console.log(`Downloaded: ${percent * 100}%`);
                }).done(() => {
                    console.log('Downlaod is done!');
                    this.setState({loading: false, downloadModal: false, fullFileName: '', percent: 0})
                    if(Platform.OS === 'android'){
                        Alert.alert("Download Complete!", `File available in Downloads folder. ${"\n\n"} ${task['id']}`)
                    }else if(Platform.OS === 'ios'){
                        Alert.alert("Download Complete!", `On My iPhone/xenia: ${"\n\n"} ${task['id']}`)
                    }
                }).error((error) => {
                    this.setState({loading: false, downloadModal: false, fullFileName: '', percent: 0})
                    Alert.alert("Error!", "Unable to Download File")
                    console.log('Download canceled due to error: ', error);
                });
            }
        }
    }

    fillAddress(){
        Keyboard.dismiss();
        const {address} = this.state;
        const apiData = JSON.parse(this.props.route.params.apiData);
        let addressDetails = null;
        console.log("@@@ BEFORE");
        if(address === 'new'){
            this.setState({
                house: '', houseError: true, pincode: '', pincodeError: true, road: '', roadError: true, 
                locality: '', localityError: true, stateID: '', stateName: '', stateError: true, cityID: '', 
                cityName: '', cityError: true
            }, () => {});
            return;
        }
        if(address === 'permanent'){
            addressDetails = apiData.sectionData.dropdown.permanent;
        }
        else if(address === 'correspondence'){
            addressDetails = apiData.sectionData.dropdown.correspondence;
        }
        this.setState({
            house: addressDetails.house_number, houseError: false, pincode: addressDetails.pincode, pincodeError: false, road: addressDetails.road, roadError: false, 
            locality: addressDetails.locality, localityError: false, countryID: addressDetails.country_id, countryName: addressDetails.country, countryError: false, 
            stateID: addressDetails.state_id, stateName: addressDetails.state, stateError: false, cityID: addressDetails.city_id, cityName: addressDetails.city, cityError: false
        }, () => {
            this.cities(this.state.stateID)
        })
        console.log("@@@ AFTER: ", addressDetails);
    }

    onSubmit(){
        this.setState({submit: true}, () => {
            const checkError = this.state.noError();
            if(checkError){
                const anyEmpError = this.state.anyEmpError();
                if(anyEmpError){
                    this.setState({checkEmpHistory: true}, () => {
                        const {fullnFinal} = this.state;
                        const noError = this.state.noEmpError();
                        if(noError){
                            if(fullnFinal){
                                const {myDepartmentError, myDesignationError} = this.state;
                                if(myDepartmentError || myDesignationError){
                                    alert('Please fill the fields highlighted in RED.');
                                    return;
                                }else{
                                    this.checkSecurityDetails();
                                }
                            }else{
                                this.checkSecurityDetails();
                            }
                        }else{
                            alert('Please fill the fields highlighted in RED..');
                            return;
                        }
                    })
                }else{
                    this.setState({checkEmpHistory: false}, () => {
                        this.checkSecurityDetails();
                    })
                }
            }else{
                alert('Please fill the fields highlighted in RED...');
                return;
            }
        })
    }

    checkSecurityDetails(){
        const anysecurityError = this.state.anysecurityError();
        if(anysecurityError){
            this.setState({checkSecurity: true}, () => {
                const noSecurityError = this.state.noSecurityError();
                if(noSecurityError){
                    this.setState({checkSecurity: false}, () => {
                        this.callAPI()
                    })
                }else{
                    alert('Please fill the fields highlighted in RED....');
                    return;
                }
            })
        }else{
            this.setState({checkSecurity: false}, () => {
                this.callAPI();
            })
        }
    }

    async callAPI(){
        const {address, baseURL, secretToken} = this.state;
        this.showLoader();
        const apiData = JSON.parse(this.props.route.params.apiData);
        const sendData = new FormData();
        sendData.append('id', apiData.draftId);
        sendData.append('page', apiData.currentPage);
        sendData.append('project_id', apiData.projectId);
        sendData.append('next', apiData.sectionData.links.next.page);
        const emergencyDetails = {
            name: this.state.name,
            mobile_number: this.state.mobile,
            relation: this.state.relationID,
            relation_name: this.state.relation,
            same_as_correspondence: (address === 'correspondence')? 1 : 0,
            same_as_permanent: (address === 'permanent')? 1 : 0,
            house_number: this.state.house,
            pincode: this.state.pincode,
            road: this.state.road,
            locality: this.state.locality,
            country_id: this.state.countryID,
            country: this.state.countryName,
            state_id: this.state.stateID,
            state: this.state.stateName,
            city_id: this.state.cityID,
            city: this.state.cityName
        };
        const contactList = Object.keys(emergencyDetails);
        contactList.forEach((name) => {
            sendData.append(`emergency_contact[${name}]`, emergencyDetails[name])
        })
        const checkEmpData = this.state.noEmpError();
        if(checkEmpData){
            const {fullnFinal} = this.state;
            const empHistory = {
                from_date: this.state.fromDate,
                to_date: this.state.toDate,
                organization_name: this.state.companyName,
                std_code: this.state.stdCode,
                landline_number: this.state.landline,
                organization_email: this.state.orgEmailAddress,
                organization_website: this.state.companyWebsite,
                reporting_person: this.state.name,
                reporting_person_designation: this.state.personDesignation,
                official_email: this.state.emailAddress,
                reporting_person_number: this.state.rpContact,
                ctc_per_month: this.state.ctc,
                reason_for_leaving: this.state.reason,
                experience_certificate: this.state.experienceCertificate,
                department: (fullnFinal)? this.state.myDepartment : null,
                designation: (fullnFinal)? this.state.myDesignation : null,
            }
            const empDetailsList = Object.keys(empHistory);
            empDetailsList.forEach((name) => {
                if(name === 'experience_certificate'){
                    const attachments = empHistory[name];
                    if(attachments.length > 0){
                        attachments.forEach((content) => {
                            sendData.append(`employment_history[${name}][]`, content);
                        })
                    }
                }else{
                    sendData.append(`employment_history[${name}]`, empHistory[name]);
                }
            })
            if(apiData.sectionData.oldData && apiData.sectionData.oldData.hasOwnProperty('employment_history')){
                const oldCertificate = this.state.uploadedExperience;
                if(oldCertificate.length > 0){
                    oldCertificate.forEach((fileName) => {
                        sendData.append(`employment_history[experience_certificate_old_filename][]`, fileName);
                    })
                }
            }
        }
        const checkSecurityData = this.state.noSecurityError();
        if(checkSecurityData){
            const securityData = {
                dd_date: this.state.ddDate,
                dd_number: this.state.ddNumber,
                bank_name: this.state.bankID,
                bank: this.state.bankName,
                dd_amount: this.state.amount,
                dd_copy: this.state.ddCopy[0]
            }
            const securityList = Object.keys(securityData);
            securityList.forEach((name) => {
                // if(name === 'dd_copy'){
                //     const attachments = securityData[name];
                //     if(attachments.length > 0){
                //         attachments.forEach((content) => {
                //             sendData.append(`security[${name}][]`, content);
                //         })
                //     }
                // }else {
                //     sendData.append(`security[${name}]`, securityData[name]);
                // }
                sendData.append(`security[${name}]`, securityData[name]);
            })
            console.log("***** EMP SECURITY LIST: ", apiData.sectionData.oldData);
            if(apiData.sectionData.oldData && apiData.sectionData.oldData.hasOwnProperty('security')){
                // const ddAttachment = apiData.sectionData.oldData.security.dd_copy;
                // if(ddAttachment !== 'null' || ddAttachment !== null || ddAttachment !== ''){
                //     sendData.append(`security[dd_copy_old_filename][]`, ddAttachment)
                // }
                const oldDD = apiData.sectionData.oldData.security.dd_copy;
                if(oldDD.length !== 'null' || oldDD !== null || oldDD !== ''){
                    sendData.append(`security[dd_copy_old_filename][]`, oldDD);
                }
            }
        }
        console.log("^^**$$ SEND DATA: ", JSON.stringify(sendData, null, 4));
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
            console.log("### @@@ ^^^ SUCCESS ACHIEVED: ", parsedData, parsedData.errors);
            if(parsedData.status === 1){
                alert(parsedData.message);
                this.props.navigation.navigate(parsedData.sectionData.links.currentPage.key, {apiData: JSON.stringify(parsedData)});
            }else if(parsedData.status === 0){
                Alert.alert(parsedData.message, `${parsedData.errors}`);
            }
        }).catch((error) => {
            this.hideLoader();
            // console.log("%%% ERROR: ", error)
            if(error.response){
                const status = error.response.status;
                console.log("%%% ERROR2: ", JSON.stringify(error.response, null, 4))
                Alert.alert("ERROR", `Error Code: ${status}606`);
            }else{
                console.log("^^^^^ ERROR: ", JSON.stringify(error, null, 4))
                alert(`${error}, API CODE: 606`)
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

    cities = async(stateID) => {
        const {baseURL} = this.state;
        this.showLoader();
        //console.log("### STATE WISE CITIES: ", `${baseURL}/master/cities`)
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
            //console.log("@@@ STATE WISE CITIES: ", (response.data))
            const responseJson = response.data;
            this.setState({cityList: responseJson.data.map((item) => {
                return {...item, id: `${item.id}`}
            })}, () => {})
            
        }).catch((error) => {
            this.hideLoader();
            let status = null;
            if(error.response){
                status = error.response.status;
                Alert.alert("Error!!!", `ErrorCode: ${status}607.`)
            }else{
                alert(`${error}, API CODE: 607`)
            }
        })
    }

    async addAttachment(name){
        try {
            if(name === experience){
                const res = await DocumentPicker.pickMultiple({
                    type: [DocumentPicker.types.pdf],
                })
                const index = res.findIndex((item) => {
                    return (item.size > mb1)
                })
                if(index > -1){
                    alert(`File size is too large, recommended size is 1MB.`);
                }else{
                    this.setState({experienceCertificate: res, experienceError: false}, () => {
                        console.log("EXPERIENCE", this.state.experienceCertificate)
                    })
                }
            }else if(name === scannedDD){
                const res = await DocumentPicker.pick({
                    type: [DocumentPicker.types.pdf],
                })
                if(res[0].size > mb1){
                    alert(`File size is too large, recommended size is 1MB.`)
                }else{
                    this.setState({ddCopy: res, ddCopyError: false}, () => {
                        console.log("DD", this.state.ddCopy)
                    })
                }
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
            // User cancelled the picker, exit any dialogs or menus and move on
            }
        }
    }

    updateAttachment(updateData){
        const {removeAttachment} = this.state;
        if(removeAttachment === 'experience'){
            this.setState({uploadedExperience: updateData}, () => {
                const {uploadedExperience, experienceCertificate} = this.state;
                if(uploadedExperience.length === 0 && experienceCertificate.length === 0){
                    this.setState({experienceError: true})
                }
            })
        }
    }

    clearEmployeeHistory(){
        this.setState({
            fromDate: '', fromDateError: true, toDate: '', toDateError: true, companyName: '', companyNameError: true,
            stdCode: '', stdCodeError: true, landline: '', landlineError: true, companyWebsite: '', companyWebsiteError: true,
            reportingPerson: '', reportingPersonError: true, personDesignation: '', personDesignationID: '', personDesignationError: true,
            email: false, emailAddress: '', emailError: true, rpContact: '', rpContactError: true, ctc: '', ctcError: true,
            reason: '', reasonError: true, experienceCertificate: '', experienceError: true, fullnFinal: false, myDesignation: '',
            myDesignationID: '', myDesignationError: true, myDepartment: '', myDepartmentID: '', myDepartmentError: true, 
            checkEmpHistory: false, orgEmail: false, orgEmailAddress: '', orgEmailError: true
        })
    }

    render(){
        const {
            submit, bankID, bankName, bankError, name, nameError, mobile, mobileError, relation, relationID, relationError, bankAC, bankACError, 
            address, house, houseError, pincode, pincodeError, sameAddress, orgEmail, orgEmailAddress, orgEmailError, removeAttachment,
            road, roadError, locality, localityError, countryID, countryName, countryError, stateID, stateName, stateError, cityID, cityName, 
            cityError, fromDate, fromDateError, toDate, toDateError, companyName, companyNameError, companyWebsite, companyWebsiteError,
            stdCode, stdCodeError, landline, landlineError, reportingPerson, reportingPersonError, personDesignation, personDesignationError,
            personDesignationID, email, emailAddress, emailError, rpContact, rpContactError, ctc, ctcError, reason, reasonError,
            myDepartment, myDepartmentID, myDepartmentError, myDesignation, myDesignationID, myDesignationError, fullnFinal, secretToken,
            ddDate, ddDateError, ddNumber, ddNumberError, amount, amountError, experienceCertificate, experienceError, ddCopy, ddCopyError,
            screens, showScreensList, baseURL, loading, cityList, checkEmpHistory, checkSecurity, uploadedExperience, viewAttachments,
            downloadModal, percent, fullFileName, checkFile, fileSize, downloadFileName, showHistory, showSecurityDetails,
            ddTimeStamp, ddMinDate, showDDPicker, fromMinDate, fromTimeStamp, toTimeStamp, showFromDatePicker, showToDatePicker
        } = this.state;
        const apiData = JSON.parse(this.props.route.params.apiData); 
        // const relationList = apiData.sectionData.dropdown.relations;
        let relationList = [];
        relationList = Array.isArray(apiData.sectionData.dropdown.relations) && apiData.sectionData.dropdown.relations.map((item) => {
            return {...item, id: `${item.id}`};
        });
        let countryList = [];
        countryList = Array.isArray(apiData.sectionData.dropdown.countries) && apiData.sectionData.dropdown.countries.map((item) => {
            return {...item, id: `${item.id}`};
        });
        let stateList = [];
        stateList = Array.isArray(apiData.sectionData.dropdown.states) && apiData.sectionData.dropdown.states.map((item) => {
            return {...item, id: `${item.id}`};
        });
        // const stateList = apiData.sectionData.dropdown.states;
        let departmentList = [];
        departmentList = Array.isArray(apiData.sectionData.dropdown.departments) && apiData.sectionData.dropdown.departments.map((item) => {
            return {...item, id: `${item.id}`};
        });
        // const departmentList = apiData.sectionData.dropdown.departments;
        let designationList = [];
        designationList = Array.isArray(apiData.sectionData.dropdown.designations) && apiData.sectionData.dropdown.designations.map((item) => {
            return {...item, id: `${item.id}`};
        });
        // const designationList = apiData.sectionData.dropdown.designations;
        let bankList = [];
        bankList = Array.isArray(apiData.sectionData.dropdown.banks) && apiData.sectionData.dropdown.banks.map((item) => {
            return {...item, id: `${item.id}`};
        });
        // const bankList = apiData.sectionData.dropdown.banks;
        const todaysDate = `${moment().format("YYYY-MM-DD")} 12:00AM`
        // console.log("@@@@ FROM DATE: ", fromMaxDate, todaysDate);
        const projectName = apiData.projectName;
        const designation = apiData.designationName;
        const currentYear = moment().year();
        const maxDate = `${currentYear}-${moment().month() + 1}-${moment().date()}`;
        const ddMax = `${currentYear}-${moment().month() + 1}-${moment().date()}`;
        const fromMaxDate = moment(todaysDate, "YYYY-MM-DD hh:mm A").utc().toDate();
        const toMinDate = moment(`${fromDate} 11:59 PM`, "YYYY-MM-DD hh:mm A").utc().toDate();
        const ddMaxDate = moment(`${ddMax} 12:00 AM`, "YYYY-MM-DD hh:mm A").utc().toDate();
        let securityDetails = null;
        if(apiData.sectionData.oldData && apiData.sectionData.oldData.hasOwnProperty('security')){
            securityDetails = apiData.sectionData.oldData.security;
        }
        return (
            <SafeAreaView style={[{alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: '#F6F6F6', flex: 1}]}>
                <StatusBar hidden={false} barStyle="dark-content" />
                <View style={{flex: 1, justifyContent: 'space-between'}}>
                    <View style={[{alignItems: 'center', flex: 1}, getWidthnHeight(100)]}>
                        <DismissKeyboard>
                            <View style={[{alignItems: 'center'}, getMarginTop((Platform.OS === "android")? 2 : 0)]}>
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
                                        <View style={{flex: 1, alignItems: 'center'}}>
                                            <View style={[{alignSelf: 'flex-start'}, getMarginLeft(3)]}>
                                                <MaskedGradientText
                                                    title={"EMERGENCY CONTACT DETAILS"}
                                                    titleStyle={[{fontWeight: 'bold', color: '#000000', fontSize: (fontSizeH4().fontSize)}, styles.boldFont]}
                                                    start={{x: 0, y: 0}}
                                                    end={{x: 0.7, y: 0}}
                                                    colors={["#039FFD", "#EA304F"]}
                                                />
                                            </View>
                                            <View style={[{alignItems: 'center'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                <View>
                                                    <AnimatedTextInput 
                                                        placeholder="Name"
                                                        mandatory={true}
                                                        placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                        value={name}
                                                        slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                        slideHorizontal={[0, getWidthnHeight(-1).width]}
                                                        placeholderScale={[1, 0.75]}
                                                        autoFocus={false}
                                                        autoCapitalize={"words"}
                                                        onChangeText={(name) => {
                                                            const text = name.replace(/[^A-Za-z ]/gi,'')
                                                            this.setState({ name: text.trimLeft() }, () => {
                                                                const {name} = this.state;
                                                                if(name !== ''){
                                                                    this.setState({nameError: false})
                                                                }else{
                                                                    this.setState({name: '', nameError: true}, () => Keyboard.dismiss())
                                                                }
                                                            })
                                                        }}
                                                        clearText={() => this.setState({name: '', nameError: true})}
                                                        containerColor={[(submit && nameError)? 'red' : '#C4C4C4', (submit && nameError)? 'red' : '#C4C4C4']}
                                                        containerBorderWidth={[(submit && nameError)? 2 : 1, 1]}
                                                        containerStyle={[{
                                                            borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && nameError)? 'dashed' : 'solid',
                                                        }, getWidthnHeight(87, 6.5)]}
                                                        style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(85, 6.5), getMarginHorizontal(2)]}
                                                    />
                                                </View>
                                                <View style={[getMarginTop(2)]}>
                                                    <AnimatedTextInput 
                                                        placeholder="Mobile Number"
                                                        mandatory={true}
                                                        placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                        value={mobile}
                                                        keyboardType={'numeric'}
                                                        maxLength={10}
                                                        slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                        slideHorizontal={[0, getWidthnHeight(-2).width]}
                                                        placeholderScale={[1, 0.75]}
                                                        autoFocus={false}
                                                        onChangeText={(value) => {
                                                            this.setState({ mobile: value.replace(/[^0-9]/g, '') }, () => {
                                                                const {mobile} = this.state;
                                                                if(mobile !== '' && mobile.length === 10){
                                                                    this.setState({mobileError: false})
                                                                }else if(mobile === ''){
                                                                    this.setState({mobileError: true}, () => Keyboard.dismiss())
                                                                }else if(mobile.length < 10){
                                                                    this.setState({mobileError: true})
                                                                }
                                                            })
                                                        }}
                                                        clearText={() => this.setState({mobile: '', mobileError: true})}
                                                        containerColor={[(submit && mobileError)? 'red' : '#C4C4C4', (submit && mobileError)? 'red' : '#C4C4C4']}
                                                        containerBorderWidth={[(submit && mobileError)? 2 : 1, 1]}
                                                        containerStyle={[{
                                                            borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && mobileError)? 'dashed' : 'solid',
                                                        }, getWidthnHeight(87, 6.5)]}
                                                        style={[{
                                                            borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2),
                                                            color: (mobileError)? 'red' : 'black'
                                                        }, getWidthnHeight(87, 6.5), getMarginHorizontal(2)]}
                                                    />
                                                </View>
                                                <View style={[{flexDirection: 'row', justifyContent: 'space-evenly'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                    <View style={[{
                                                        borderColor: (submit && relationError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: getWidthnHeight(1).width,
                                                        borderStyle: (submit && relationError)? 'dashed' : 'solid', borderWidth: (submit && relationError)? 2 : 1,
                                                    }, getWidthnHeight(87, 6.5)]}>
                                                        {/* <Dropdown
                                                            containerStyle={[{textOverflow:'hidden', borderColor: '#C4C4C4', borderWidth: 0}, getWidthnHeight(87), getMarginTop(-1)]}
                                                            inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getWidthnHeight(87)]}
                                                            label={'Relation with Employee*'}
                                                            labelFontSize={fontSizeH4().fontSize - 3}
                                                            labelTextStyle={[getMarginLeft(1.5), getMarginTop(0)]}
                                                            data={relationList}
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
                                                        /> */}
                                                        <Dropdown
                                                            style={[{borderColor: '#C4C4C4', borderWidth: 0, justifyContent: 'center'}, getMarginTop(0)]}
                                                            containerStyle={[{marginHorizontal: getMarginHorizontal(3).marginHorizontal, width: '100%'}, getWidthnHeight(87)]}
                                                            inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getMarginTop(0)]}
                                                            placeholder='Relation with Employee*'
                                                            placeholderStyle={{color: '#C4C4C4', fontSize: fontSizeH4().fontSize, paddingHorizontal: getWidthnHeight(3).width}}
                                                            selectedTextStyle={[getMarginLeft(3)]}
                                                            data={relationList}
                                                            valueField={'id'}
                                                            labelField={'name'}
                                                            onChange={(item) => {
                                                                console.log(item);
                                                                this.setState({
                                                                    relation: item.name, relationID: item.id, relationError: false 
                                                                }, () => console.log("### BANK ID: ", this.state.bankID))
                                                                this.dismissKeyboard();
                                                            }}
                                                            value={relationID}
                                                        />
                                                    </View>
                                                </View>
                                                <View style={[{backgroundColor: 'rgba(196, 196, 196, 0.5)', height: 1}, getWidthnHeight(87), getMarginTop(3)]}/>
                                            </View>
                                            <View style={[{alignItems: 'flex-start'}, getWidthnHeight(87), getMarginTop(2)]}>
                                                <MaskedGradientText
                                                    title={"ADDRESS"}
                                                    titleStyle={[{fontWeight: 'bold', color: '#000000', fontSize: (fontSizeH4().fontSize)}, styles.boldFont]}
                                                    start={{x: 0, y: 0}}
                                                    end={{x: 0.9, y: 0}}
                                                    colors={["#039FFD", "#EA304F"]}
                                                />
                                            </View>
                                            <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                <TouchableOpacity activeOpacity={0.8} 
                                                    onPress={() => {
                                                        const {address} = this.state;
                                                        if(address !== 'new'){
                                                            this.setState({address: 'new'}, () => this.fillAddress());
                                                        }
                                                    }}
                                                >
                                                    <View style={[{
                                                        alignItems: 'center', justifyContent: 'center', backgroundColor: (address === 'new')? 'rgb(19,111,232)' : '#E1F2F9',
                                                        borderTopLeftRadius: getWidthnHeight(1).width, borderBottomLeftRadius: getWidthnHeight(1).width
                                                        }, getWidthnHeight(24, 6)]}>
                                                        <Text style={[{color: (address === 'new')? 'white' : 'black', fontSize: (fontSizeH4().fontSize + 1)}]}>Add</Text>
                                                        <Text style={[{color: (address === 'new')? 'white' : 'black', fontSize: (fontSizeH4().fontSize + 1), fontWeight: 'bold'}, styles.boldFont]}>New</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity activeOpacity={0.8}
                                                    onPress={() => {
                                                        const {address} = this.state;
                                                        if(address !== 'permanent'){
                                                            this.setState({address: 'permanent'}, () => this.fillAddress());
                                                        }
                                                    }}
                                                >
                                                    <View style={[{
                                                        alignItems: 'center', justifyContent: 'center', backgroundColor: (address === 'permanent')? 'rgb(19,111,232)' : '#E1F2F9'
                                                        }, getWidthnHeight(25, 6)]}>
                                                        <Text style={[{color: (address === 'permanent')? 'white' : 'black', fontSize: (fontSizeH4().fontSize + 1)}]}>Same as</Text>
                                                        <Text style={[{color: (address === 'permanent')? 'white' : 'black', fontSize: (fontSizeH4().fontSize + 1), fontWeight: 'bold'}, styles.boldFont]}>Permanent</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity activeOpacity={0.8} 
                                                    onPress={() => {
                                                        const {address} = this.state;
                                                        if(address !== 'correspondence'){
                                                            this.setState({address: 'correspondence'}, () => this.fillAddress());
                                                        }
                                                    }}
                                                >
                                                    <View style={[{
                                                        alignItems: 'center', justifyContent: 'center', backgroundColor: (address === 'correspondence')? 'rgb(19,111,232)' : '#E1F2F9',
                                                        borderTopRightRadius: getWidthnHeight(1).width, borderBottomRightRadius: getWidthnHeight(1).width
                                                        }, getWidthnHeight(undefined, 6)]}>
                                                        <Text style={[{color: (address === 'correspondence')? 'white' : 'black', fontSize: (fontSizeH4().fontSize + 1)}]}>Same as</Text>
                                                        <Text style={[{color: (address === 'correspondence')? 'white' : 'black', fontSize: (fontSizeH4().fontSize + 1), fontWeight: 'bold'}, styles.boldFont]}> Correspondence </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, getWidthnHeight(87), getMarginTop(2)]}>
                                                <AnimatedTextInput 
                                                    placeholder="House Number"
                                                    mandatory={true}
                                                    placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                    value={house}
                                                    slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                    slideHorizontal={[0, getWidthnHeight(-3).width]}
                                                    placeholderScale={[1, 0.75]}
                                                    autoFocus={false}
                                                    autoCapitalize={'words'}
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
                                                    placeholder="Pincode"
                                                    mandatory={true}
                                                    placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                    value={pincode}
                                                    slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                    slideHorizontal={[0, getWidthnHeight(-2).width]}
                                                    placeholderScale={[1, 0.75]}
                                                    keyboardType={'numeric'}
                                                    maxLength={10}
                                                    autoFocus={false}
                                                    onChangeText={(number) => {
                                                        this.setState({ pincode: number.replace(/[^0-9]/g, '')}, () => {
                                                            const {pincode} = this.state;
                                                            if(pincode !== ''){
                                                                this.setState({pincodeError: false})
                                                            }else{
                                                                this.setState({pincode: '', pincodeError: true}, () => Keyboard.dismiss())
                                                            }
                                                        })
                                                    }}
                                                    clearText={() => this.setState({pincode: '', pincodeError: true})}
                                                    containerColor={[(submit && pincodeError)? 'red' : '#C4C4C4', (submit && pincodeError)? 'red' : '#C4C4C4']}
                                                    containerBorderWidth={[(submit && pincodeError)? 2 : 1, 1]}
                                                    containerStyle={[{
                                                        borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && pincodeError)? 'dashed' : 'solid',
                                                    }, getWidthnHeight(30, 6.5)]}
                                                    style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(28, 6.5), getMarginHorizontal(2)]}
                                                />
                                            </View>
                                            <View style={[{alignItems: 'center'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                <AnimatedTextInput 
                                                    placeholder="Road/Street"
                                                    mandatory={true}
                                                    placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                    value={road}
                                                    slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                    slideHorizontal={[0, getWidthnHeight(-2.7).width]}
                                                    placeholderScale={[1, 0.75]}
                                                    autoFocus={false}
                                                    autoCapitalize={'words'}
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
                                                    placeholder="Locality/Area"
                                                    mandatory={true}
                                                    placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                    value={locality}
                                                    slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                    slideHorizontal={[0, getWidthnHeight(-2.7).width]}
                                                    placeholderScale={[1, 0.75]}
                                                    autoFocus={false}
                                                    autoCapitalize={'words'}
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
                                                {/* <Dropdown
                                                    containerStyle={[{borderColor: '#C4C4C4', borderWidth: 0, justifyContent: 'center'}, getWidthnHeight(20, 4), getMarginRight(1.5)]}
                                                    inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getWidthnHeight(20), getMarginTop(-2)]}
                                                    labelFontSize={fontSizeH4().fontSize - 3}
                                                    labelTextStyle={[getMarginLeft(1.5), getMarginTop(0)]}
                                                    data={countryList}
                                                    valueExtractor={({id})=> id}
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
                                                    data={stateList}
                                                    value={stateName}
                                                    style={[{
                                                        borderColor: (submit && stateError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: getWidthnHeight(1).width,
                                                        borderStyle: (submit && stateError)? 'dashed' : 'solid', borderWidth: (submit && stateError)? 2 : 1,
                                                    }, getWidthnHeight(42, 6.5)]}
                                                    searchStyle={[getWidthnHeight(34, 6.5)]}
                                                    slidePlaceHolderVertical={[0, getMarginTop(-3.2).marginTop]}
                                                    slidePlaceHolderHorizontal={[0, getMarginLeft(-1.5).marginLeft]}
                                                    labelStyle={[{fontSize: fontSizeH4().fontSize + 2}]}
                                                    dropDownSize={[getWidthnHeight(42, 20)]}
                                                    textBoxSize={[getWidthnHeight(42, 4)]}
                                                    iconSize={getWidthnHeight(7).width}
                                                    onChangeText={(id, name, index, data) => {
                                                        this.setState({
                                                            stateID: id, stateName: name, stateError: false,
                                                            cityID: null, cityName: '', cityError: true, cityList: []
                                                        }, () => {
                                                            this.cities(this.state.stateID);
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
                                                            }, () => this.cities(this.state.stateID));
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
                                                    slidePlaceHolderVertical={[0, getMarginTop(-3.2).marginTop]}
                                                    slidePlaceHolderHorizontal={[0, getMarginLeft(-1.5).marginLeft]}
                                                    labelStyle={[{fontSize: fontSizeH4().fontSize + 2}]}
                                                    dropDownSize={[getWidthnHeight(42, 20)]}
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
                                            <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, getMarginTop(2), getWidthnHeight(87)]}>
                                                <View style={{alignItems: 'flex-start'}}>
                                                    <MaskedGradientText
                                                        title={"EMPLOYMENT HISTORY"}
                                                        titleStyle={[{fontWeight: 'bold', color: '#000000', fontSize: (fontSizeH4().fontSize)}, styles.boldFont]}
                                                        start={{x: 0, y: 0}}
                                                        end={{x: 0.9, y: 0}}
                                                        colors={["#039FFD", "#EA304F"]}
                                                    />
                                                    <MaskedGradientText
                                                        title={"(OPTIONAL)"}
                                                        titleStyle={[{fontWeight: 'bold', color: '#000000', fontSize: (fontSizeH4().fontSize - 3)}, styles.boldFont]}
                                                        start={{x: 0, y: 0}}
                                                        end={{x: 1, y: 0}}
                                                        colors={["#039FFD", "#EA304F"]}
                                                    />
                                                </View>
                                                <Slider 
                                                    activeColor={colorTitle} 
                                                    //inactiveColor={'red'}
                                                    //buttonColor={'red'}
                                                    // buttonBorderColor={'blue'}
                                                    value={showHistory}
                                                    onSlide={(showHistory) => this.setState({showHistory}, () => {
                                                        const {showHistory} = this.state;
                                                        if(!showHistory){
                                                            this.clearEmployeeHistory();
                                                        }
                                                    })}
                                                    delay={300}
                                                />
                                            </View>
                                            {(showHistory) &&
                                                <>
                                                    <View style={[{flexDirection: 'row', justifyContent: 'space-evenly'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                        {/* <View style={[{alignItems: 'center'}, getWidthnHeight(42)]}>
                                                            <AnimateDateLabel
                                                                containerColor={[(checkEmpHistory && fromDateError)? 'red' : '#C4C4C4', (checkEmpHistory && fromDateError)? 'red' : '#C4C4C4']}
                                                                containerBorderWidth={[(checkEmpHistory && fromDateError)? 2 : 1, 1]}
                                                                containerStyle={[{
                                                                    borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (checkEmpHistory && fromDateError)? 'dashed' : 'solid',
                                                                }, getWidthnHeight(42, 6.5)]}
                                                                slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                                slideHorizontal={[0, getWidthnHeight(-4).width]}
                                                                style={[{justifyContent: 'center'}, getWidthnHeight(42, 6.5)]}
                                                                date={fromDate}
                                                                minDate={`1970-01-01`}
                                                                maxDate={`${maxDate}`}
                                                                mode="date"
                                                                placeholder="From Date"
                                                                titleStyle={[getMarginLeft(-15)]}
                                                                format="YYYY-MM-DD"
                                                                onDateChange={(date) => {
                                                                    const currentTimeStamp = moment().valueOf();
                                                                    const addTime = moment(currentTimeStamp).add(1, 'second').format('hh:mm:ss A')
                                                                    const selectedTimeStamp = moment(`${date} ${addTime}`, "YYYY-MM-DD hh:mm:ss A").valueOf();
                                                                    const date2AddTime = moment(currentTimeStamp).add(2, 'seconds').format('hh:mm:ss A');
                                                                    let date2TimeStamp = moment(`${toDate} ${date2AddTime}`, "YYYY-MM-DD hh:mm:ss A").valueOf();
                                                                    this.setState({fromDate: date, fromDateError: false}, () => {
                                                                        Keyboard.dismiss();
                                                                    })
                                                                    if(selectedTimeStamp > date2TimeStamp && date2TimeStamp){
                                                                        this.setState({toDate: '', toDateError: true}, () => {
                                                                            Keyboard.dismiss();
                                                                        })
                                                                    }
                                                                }}
                                                            />
                                                        </View> */}
                                                        <View style={[{borderColor: 'red', borderWidth: 0}, getWidthnHeight(42, 6)]}>
                                                            <TouchableOpacity 
                                                                onPress={() => this.setState({showFromDatePicker: !showFromDatePicker})}
                                                            >
                                                                <View 
                                                                    style={[{
                                                                        alignItems: 'center', justifyContent: 'center', borderRadius: 5, 
                                                                        borderColor: (checkEmpHistory && fromDateError)? 'red' : '#C4C4C4',
                                                                        borderWidth: (checkEmpHistory && fromDateError)? 2 : 1,
                                                                        borderStyle: (checkEmpHistory && fromDateError)? 'dashed' : 'solid'
                                                                    }, getWidthnHeight(42, 6.5)]}>
                                                                    <Text style={[{color: fromDate? '#000000' : '#C4C4C4', fontSize: (fontSizeH4().fontSize + 2)}]}>{fromDate || 'Select Date'}</Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                            {(showFromDatePicker) && (
                                                                <DateTimePicker 
                                                                    styleBox={{flex: 1}}
                                                                    date={moment(fromTimeStamp).utc().toDate()}
                                                                    androidMode='default'
                                                                    mode='date'
                                                                    is24Hour={false}
                                                                    placeholder='Select Date'
                                                                    format='YYYY-MM-DD'
                                                                    minDate={fromMinDate}
                                                                    maxDate={fromMaxDate}
                                                                    onDateChange={(event, newDate) => {
                                                                        if(event.type === "dismissed"){
                                                                            this.setState({showFromDatePicker: !showFromDatePicker})
                                                                            return;
                                                                        }
                                                                        this.setState({showFromDatePicker: !showFromDatePicker})
                                                                        const fromTimeStamp = event.nativeEvent.timestamp;
                                                                        this.setState({
                                                                            fromDate: moment(newDate).format("YYYY-MM-DD"), fromTimeStamp,
                                                                            showToDatePicker: false, fromDateError: false,
                                                                        });
                                                                        Keyboard.dismiss();
                                                                    }} 
                                                                />
                                                            )}
                                                            <View style={styles.forDate}>
                                                                <Text style={[{fontSize: (fontSizeH4().fontSize - 3), color: '#0B8EE8', fontWeight: 'normal', textAlign: 'center'}, styles.boldFont]}>From Date</Text>
                                                            </View>
                                                        </View>
                                                        {/* <View style={[{alignItems: 'center'}, getWidthnHeight(42)]}>
                                                            <AnimateDateLabel
                                                                containerColor={[(checkEmpHistory && toDateError)? 'red' : '#C4C4C4', (checkEmpHistory && toDateError)? 'red' : '#C4C4C4']}
                                                                containerBorderWidth={[(checkEmpHistory && toDateError)? 2 : 1, 1]}
                                                                containerStyle={[{
                                                                    borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (checkEmpHistory && toDateError)? 'dashed' : 'solid',
                                                                }, getWidthnHeight(42, 6.5)]}
                                                                slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                                slideHorizontal={[0, getWidthnHeight(-4).width]}
                                                                style={[{justifyContent: 'center'}, getWidthnHeight(42, 6.5)]}
                                                                date={toDate}
                                                                disabled={(fromDateError)? true : false}
                                                                minDate={fromDate}
                                                                maxDate={`${maxDate}`}
                                                                mode="date"
                                                                placeholder="To Date"
                                                                titleStyle={[getMarginLeft(-15)]}
                                                                format="YYYY-MM-DD"
                                                                onDateChange={(date) => {
                                                                    const currentTimeStamp = moment().valueOf();
                                                                    const addTime = moment(currentTimeStamp).add(2, 'seconds').format('hh:mm:ss A')
                                                                    const selectedTimeStamp = moment(`${date} ${addTime}`, "YYYY-MM-DD hh:mm:ss A").valueOf();
                                                                    const date1AddTime = moment(currentTimeStamp).add(1, 'second').format('hh:mm:ss A');
                                                                    let date1TimeStamp = moment(`${fromDate} ${date1AddTime}`, "YYYY-MM-DD hh:mm:ss A").valueOf();
                                                                    if(date1TimeStamp > selectedTimeStamp){
                                                                        this.setState({toDate: '', toDateError: true}, () => {
                                                                            Keyboard.dismiss();
                                                                        })
                                                                        alert("This date should be greater/equal to FROM DATE")
                                                                    }else{
                                                                        this.setState({toDate: date, toDateError: false}, () => {
                                                                            Keyboard.dismiss();
                                                                        })
                                                                    }
                                                                }}
                                                            />
                                                        </View> */}
                                                        <View style={[getWidthnHeight(42, 6.5)]}>
                                                            <TouchableOpacity 
                                                                disabled={(fromDateError)? true : false}
                                                                onPress={() => this.setState({showToDatePicker: !showToDatePicker})}
                                                            >
                                                                <View 
                                                                    style={[{
                                                                        alignItems: 'center', justifyContent: 'center', borderRadius: 5, 
                                                                        borderColor: (checkEmpHistory && toDateError)? 'red' : '#C4C4C4',
                                                                        borderWidth: (checkEmpHistory && toDateError)? 2 : 1,
                                                                        borderStyle: (checkEmpHistory && toDateError)? 'dashed' : 'solid'
                                                                    }, getWidthnHeight(42, 6.5)]}>
                                                                    <Text style={[{color: toDate? '#000000' : '#C4C4C4', fontSize: (fontSizeH4().fontSize + 2)}]}>{toDate || 'Select Date'}</Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                            {(showToDatePicker) && (
                                                                <DateTimePicker 
                                                                    styleBox={{flex: 1}}
                                                                    date={moment(toTimeStamp).utc().toDate()}
                                                                    // disabled={(fromDateError)? true : false}
                                                                    androidMode='default'
                                                                    mode='date'
                                                                    is24Hour={false}
                                                                    placeholder='Select Date'
                                                                    format='YYYY-MM-DD'
                                                                    minDate={toMinDate}
                                                                    maxDate={fromMaxDate}
                                                                    onDateChange={(event, newDate) => {
                                                                        Keyboard.dismiss()
                                                                        if(event.type === "dismissed"){
                                                                            this.setState({showToDatePicker: !showToDatePicker})
                                                                            return;
                                                                        }
                                                                        this.setState({showToDatePicker: !showToDatePicker});
                                                                        const toTimeStamp = event.nativeEvent.timestamp;
                                                                        //console.log('### To Date: ', moment(newDate).format("YYYY-MM-DD"))
                                                                        this.setState({
                                                                            toDate: moment(newDate).format("YYYY-MM-DD"), toTimeStamp,
                                                                            toDateError: false
                                                                        });
                                                                    }} 
                                                                />
                                                            )}
                                                            <View style={styles.forDate}>
                                                                <Text style={[{fontSize: (fontSizeH4().fontSize - 4), color: '#0B8EE8', fontWeight: 'normal', textAlign: 'center'}, styles.boldFont]}>To Date</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View style={[getMarginTop(2)]}>
                                                        <AnimatedTextInput 
                                                            placeholder=" Organization Name "
                                                            placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                            value={companyName}
                                                            slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                            slideHorizontal={[0, getWidthnHeight(-2).width]}
                                                            placeholderScale={[1, 0.75]}
                                                            autoFocus={false}
                                                            autoCapitalize={'words'}
                                                            onChangeText={(name) => {
                                                                this.setState({ companyName: name.trimLeft() }, () => {
                                                                    const {companyName} = this.state;
                                                                    if(companyName !== ''){
                                                                        this.setState({companyNameError: false})
                                                                    }else{
                                                                        this.setState({companyName: '', companyNameError: true}, () => Keyboard.dismiss())
                                                                    }
                                                                })
                                                            }}
                                                            clearText={() => this.setState({companyName: '', companyNameError: true})}
                                                            containerColor={[(checkEmpHistory && companyNameError)? 'red' : '#C4C4C4', (checkEmpHistory && companyNameError)? 'red' : '#C4C4C4']}
                                                            containerBorderWidth={[(checkEmpHistory && companyNameError)? 2 : 1, 1]}
                                                            containerStyle={[{
                                                                borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (checkEmpHistory && companyNameError)? 'dashed' : 'solid',
                                                            }, getWidthnHeight(87, 6.5)]}
                                                            style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(87, 6.5), getMarginHorizontal(2)]}
                                                        />
                                                    </View>
                                                    <View style={[{flexDirection: 'row', justifyContent: 'space-evenly'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                        <View>
                                                            <AnimatedTextInput 
                                                                placeholder=" STD Code "
                                                                placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                                value={stdCode}
                                                                slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                                slideHorizontal={[0, getWidthnHeight(-3).width]}
                                                                placeholderScale={[1, 0.75]}
                                                                keyboardType={'numeric'}
                                                                maxLength={8}
                                                                autoFocus={false}
                                                                onChangeText={(value) => {
                                                                    this.setState({ stdCode: value.replace(/[^0-9]/g, '')}, () => {
                                                                        const {stdCode} = this.state;
                                                                        if(stdCode !== ''){
                                                                            this.setState({stdCodeError: false})
                                                                        }else{
                                                                            this.setState({stdCode: '', stdCodeError: true}, () => Keyboard.dismiss())
                                                                        }
                                                                    })
                                                                }}
                                                                clearText={() => this.setState({stdCode: '', stdCodeError: true})}
                                                                containerColor={[(checkEmpHistory && stdCodeError)? 'red' : '#C4C4C4', (checkEmpHistory && stdCodeError)? 'red' : '#C4C4C4']}
                                                                containerBorderWidth={[(checkEmpHistory && stdCodeError)? 2 : 1, 1]}
                                                                containerStyle={[{
                                                                    borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (checkEmpHistory && stdCodeError)? 'dashed' : 'solid',
                                                                }, getWidthnHeight(42, 6.5)]}
                                                                style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(40, 6.5), getMarginHorizontal(2)]}
                                                            />
                                                        </View>
                                                        <View>
                                                            <AnimatedTextInput 
                                                                placeholder=" Landline Number "
                                                                placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                                value={landline}
                                                                slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                                slideHorizontal={[0, getWidthnHeight(-3.3).width]}
                                                                placeholderScale={[1, 0.75]}
                                                                keyboardType={'numeric'}
                                                                maxLength={8}
                                                                autoFocus={false}
                                                                onChangeText={(number) => {
                                                                    this.setState({ landline: number.replace(/[^0-9]/g, '')}, () => {
                                                                        const {landline} = this.state;
                                                                        if(landline !== ''){
                                                                            this.setState({landlineError: false})
                                                                        }else{
                                                                            this.setState({landline: '', landlineError: true}, () => Keyboard.dismiss())
                                                                        }
                                                                    })
                                                                }}
                                                                clearText={() => this.setState({landline: '', landlineError: true})}
                                                                containerColor={[(checkEmpHistory && landlineError)? 'red' : '#C4C4C4', (checkEmpHistory && landlineError)? 'red' : '#C4C4C4']}
                                                                containerBorderWidth={[(checkEmpHistory && landlineError)? 2 : 1, 1]}
                                                                containerStyle={[{
                                                                    borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (checkEmpHistory && landlineError)? 'dashed' : 'solid',
                                                                }, getWidthnHeight(42, 6.5)]}
                                                                style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(40, 6.5), getMarginHorizontal(2)]}
                                                            />
                                                        </View>
                                                    </View>
                                                    <View style={[{alignItems: 'center'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                        <AnimatedTextInput 
                                                            placeholder=" Organization Email "
                                                            placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                            value={orgEmailAddress}
                                                            slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                            slideHorizontal={[0, getWidthnHeight(-1).width]}
                                                            placeholderScale={[1, 0.75]}
                                                            autoFocus={false}
                                                            onChangeText={(text) => {
                                                                const check = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                                                if(check.test(String(text).toLowerCase())){
                                                                    this.setState({orgEmail: true, orgEmailError: false, orgEmailAddress: text})
                                                                }else{
                                                                    this.setState({orgEmail: false, orgEmailError: true, orgEmailAddress: text}, () => {
                                                                        if(this.state.orgEmailAddress === ''){
                                                                            Keyboard.dismiss();
                                                                        }
                                                                    })
                                                                }
                                                            }}
                                                            clearText={() => this.setState({orgEmail: false, orgEmailAddress: '', orgEmailError: true})}
                                                            containerColor={[(checkEmpHistory && orgEmailError)? 'red' : '#C4C4C4', (checkEmpHistory && orgEmailError)? 'red' : '#C4C4C4']}
                                                            containerBorderWidth={[(checkEmpHistory && orgEmailError)? 2 : 1, 1]}
                                                            containerStyle={[{
                                                                borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (checkEmpHistory && orgEmailError)? 'dashed' : 'solid',
                                                            }, getWidthnHeight(87, 6.5)]}
                                                            style={[{
                                                                borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2),
                                                                color: (orgEmailError)? '#CD113B' : '#01937C'
                                                            }, getWidthnHeight(85, 6.5), getMarginHorizontal(2)]}
                                                        />
                                                    </View>
                                                    <View style={[getMarginTop(2)]}>
                                                        <AnimatedTextInput 
                                                            placeholder=" Organization Website "
                                                            placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                            value={companyWebsite}
                                                            slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                            slideHorizontal={[0, getWidthnHeight(-2).width]}
                                                            placeholderScale={[1, 0.75]}
                                                            autoFocus={false}
                                                            onChangeText={(name) => {
                                                                this.setState({ companyWebsite: name.trim() }, () => {
                                                                    const {companyWebsite} = this.state;
                                                                    if(companyWebsite !== ''){
                                                                        this.setState({companyWebsiteError: false})
                                                                    }else{
                                                                        this.setState({companyWebsite: '', companyWebsiteError: true}, () => Keyboard.dismiss())
                                                                    }
                                                                })
                                                            }}
                                                            clearText={() => this.setState({companyWebsite: '', companyWebsiteError: true})}
                                                            containerColor={[(checkEmpHistory && companyWebsiteError)? 'red' : '#C4C4C4', (checkEmpHistory && companyWebsiteError)? 'red' : '#C4C4C4']}
                                                            containerBorderWidth={[(checkEmpHistory && companyWebsiteError)? 2 : 1, 1]}
                                                            containerStyle={[{
                                                                borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (checkEmpHistory && companyWebsiteError)? 'dashed' : 'solid',
                                                            }, getWidthnHeight(87, 6.5)]}
                                                            style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(87, 6.5), getMarginHorizontal(2)]}
                                                        />
                                                    </View>
                                                    <View style={[getMarginTop(2)]}>
                                                        <AnimatedTextInput 
                                                            placeholder=" Reporting Person Name "
                                                            placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                            value={reportingPerson}
                                                            slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                            slideHorizontal={[0, getWidthnHeight(-2).width]}
                                                            placeholderScale={[1, 0.75]}
                                                            autoFocus={false}
                                                            onChangeText={(name) => {
                                                                const text = name.replace(/[^A-Za-z ]/gi,'')
                                                                this.setState({ reportingPerson: text.trimLeft() }, () => {
                                                                    const {reportingPerson} = this.state;
                                                                    if(reportingPerson !== ''){
                                                                        this.setState({reportingPersonError: false})
                                                                    }else{
                                                                        this.setState({reportingPerson: '', reportingPersonError: true}, () => Keyboard.dismiss())
                                                                    }
                                                                })
                                                            }}
                                                            clearText={() => this.setState({reportingPerson: '', reportingPersonError: true})}
                                                            containerColor={[(checkEmpHistory && reportingPersonError)? 'red' : '#C4C4C4', (checkEmpHistory && reportingPersonError)? 'red' : '#C4C4C4']}
                                                            containerBorderWidth={[(checkEmpHistory && reportingPersonError)? 2 : 1, 1]}
                                                            containerStyle={[{
                                                                borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (checkEmpHistory && reportingPersonError)? 'dashed' : 'solid',
                                                            }, getWidthnHeight(87, 6.5)]}
                                                            style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(87, 6.5), getMarginHorizontal(2)]}
                                                        />
                                                    </View>
                                                    <View style={[{flexDirection: 'row', justifyContent: 'space-evenly'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                        <View style={[{
                                                            borderColor: (checkEmpHistory && personDesignationError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: getWidthnHeight(1).width,
                                                            borderStyle: (checkEmpHistory && personDesignationError)? 'dashed' : 'solid', borderWidth: (checkEmpHistory && personDesignationError)? 2 : 1,
                                                        }, getWidthnHeight(87, 6.5)]}>
                                                            {/* <Dropdown
                                                                containerStyle={[{textOverflow:'hidden', borderColor: '#C4C4C4', borderWidth: 0}, getWidthnHeight(87), getMarginTop(-1)]}
                                                                inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getWidthnHeight(87)]}
                                                                label={'Reporting Person Designation'}
                                                                labelFontSize={fontSizeH4().fontSize - 3}
                                                                labelTextStyle={[getMarginLeft(1.5), getMarginTop(0)]}
                                                                data={designationList}
                                                                valueExtractor={({id})=> id}
                                                                labelExtractor={({name})=> name}
                                                                onChangeText={(id, index, data) => {
                                                                    this.setState({
                                                                        personDesignation: data[index]['name'], personDesignationID: id, personDesignationError: false 
                                                                    }, () => console.log("### DESIGNATION ID: ", this.state.personDesignationID))
                                                                    this.dismissKeyboard();
                                                                }}
                                                                value={personDesignation}
                                                                baseColor = {(personDesignation)? colorTitle : '#C4C4C4'}
                                                                //pickerStyle={[getMarginLeft(4), getWidthnHeight(42), getMarginTop(10)]}
                                                                fontSize = {(personDesignation)? fontSizeH4().fontSize + 2 : fontSizeH4().fontSize}
                                                            /> */}
                                                            <Dropdown
                                                                search
                                                                searchPlaceholder="Search..."
                                                                style={[{borderColor: '#C4C4C4', borderWidth: 0, justifyContent: 'center'}, getWidthnHeight(87), getMarginRight(-1)]}
                                                                containerStyle={{marginHorizontal: getMarginHorizontal(3).marginHorizontal, width: '100%'}}
                                                                inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getWidthnHeight(87)]}
                                                                placeholder='Reporting Person Designation'
                                                                placeholderStyle={{color: '#C4C4C4', fontSize: fontSizeH4().fontSize, paddingHorizontal: getWidthnHeight(3).width}}
                                                                selectedTextStyle={[getMarginLeft(3)]}
                                                                data={designationList}
                                                                // iconStyle={{paddingRight: 20}}
                                                                valueField={'id'}
                                                                labelField={'name'}
                                                                onChange={(item) => {
                                                                    console.log(item);
                                                                    this.setState({
                                                                        personDesignation: item.name, personDesignationID: item.id, personDesignationError: false 
                                                                    }, () => console.log("### DESIGNATION ID: ", this.state.personDesignationID))
                                                                    this.dismissKeyboard();
                                                                }}
                                                                value={personDesignationID}
                                                            />
                                                        </View>
                                                    </View>
                                                    <View style={[{alignItems: 'center'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                        <AnimatedTextInput 
                                                            placeholder=" Reporting Person Official Email "
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
                                                            containerColor={[(checkEmpHistory && emailError)? 'red' : '#C4C4C4', (checkEmpHistory && emailError)? 'red' : '#C4C4C4']}
                                                            containerBorderWidth={[(checkEmpHistory && emailError)? 2 : 1, 1]}
                                                            containerStyle={[{
                                                                borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (checkEmpHistory && emailError)? 'dashed' : 'solid',
                                                            }, getWidthnHeight(87, 6.5)]}
                                                            style={[{
                                                                borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2),
                                                                color: (emailError)? '#CD113B' : '#01937C'
                                                            }, getWidthnHeight(85, 6.5), getMarginHorizontal(2)]}
                                                        />
                                                    </View>
                                                    <View style={[getMarginTop(2)]}>
                                                        <AnimatedTextInput 
                                                            placeholder=" Reporting Person Contact Number "
                                                            placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                            value={rpContact}
                                                            slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                            slideHorizontal={[0, getWidthnHeight(-3.3).width]}
                                                            placeholderScale={[1, 0.75]}
                                                            keyboardType={'numeric'}
                                                            maxLength={10}
                                                            autoFocus={false}
                                                            onChangeText={(number) => {
                                                                this.setState({ rpContact: number.replace(/[^0-9]/g, '')}, () => {
                                                                    const {rpContact} = this.state;
                                                                    if(rpContact !== ''){
                                                                        this.setState({rpContactError: false})
                                                                    }else{
                                                                        this.setState({rpContact: '', rpContactError: true}, () => Keyboard.dismiss())
                                                                    }
                                                                })
                                                            }}
                                                            clearText={() => this.setState({rpContact: '', rpContactError: true})}
                                                            containerColor={[(checkEmpHistory && rpContactError)? 'red' : '#C4C4C4', (checkEmpHistory && rpContactError)? 'red' : '#C4C4C4']}
                                                            containerBorderWidth={[(checkEmpHistory && rpContactError)? 2 : 1, 1]}
                                                            containerStyle={[{
                                                                borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (checkEmpHistory && rpContactError)? 'dashed' : 'solid',
                                                            }, getWidthnHeight(87, 6.5)]}
                                                            style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(87, 6.5), getMarginHorizontal(2)]}
                                                        />
                                                    </View>
                                                    <View style={[getMarginTop(2)]}>
                                                        <AnimatedTextInput 
                                                            placeholder=" CTC - yearly (in Rupees) "
                                                            placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                            value={ctc}
                                                            slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                            slideHorizontal={[0, getWidthnHeight(-3.3).width]}
                                                            placeholderScale={[1, 0.75]}
                                                            keyboardType={'numeric'}
                                                            autoFocus={false}
                                                            onChangeText={(number) => {
                                                                this.setState({ ctc: number.replace(/[^0-9]/g, '')}, () => {
                                                                    const {ctc} = this.state;
                                                                    if(ctc !== ''){
                                                                        this.setState({ctcError: false})
                                                                    }else{
                                                                        this.setState({ctc: '', ctcError: true}, () => Keyboard.dismiss())
                                                                    }
                                                                })
                                                            }}
                                                            clearText={() => this.setState({ctc: '', ctcError: true})}
                                                            containerColor={[(checkEmpHistory && ctcError)? 'red' : '#C4C4C4', (checkEmpHistory && ctcError)? 'red' : '#C4C4C4']}
                                                            containerBorderWidth={[(checkEmpHistory && ctcError)? 2 : 1, 1]}
                                                            containerStyle={[{
                                                                borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (checkEmpHistory && ctcError)? 'dashed' : 'solid',
                                                            }, getWidthnHeight(87, 6.5)]}
                                                            style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(87, 6.5), getMarginHorizontal(2)]}
                                                        />
                                                    </View>
                                                    <View style={[getMarginTop(2)]}>
                                                        <AnimatedTextInput 
                                                            placeholder="Reason for Leaving"
                                                            placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                            value={reason}
                                                            multiline={true}
                                                            maxLength={190}
                                                            numberOfLines={4}
                                                            slideVertical={[0, getWidthnHeight(undefined, -5).height]}
                                                            slideHorizontal={[0, getWidthnHeight(-3.5).width]}
                                                            placeholderScale={[1, 0.75]}
                                                            autoFocus={false}
                                                            onChangeText={(reason) => {
                                                                this.setState({ reason: reason.trimLeft() }, () => {
                                                                    const {reason} = this.state;
                                                                    if(reason !== ''){
                                                                        this.setState({reasonError: false})
                                                                    }else{
                                                                        this.setState({reason: '', reasonError: true}, () => Keyboard.dismiss())
                                                                    }
                                                                })
                                                            }}
                                                            clearText={() => this.setState({reason: '', reasonError: true})}
                                                            containerColor={[(checkEmpHistory && reasonError)? 'red' : '#C4C4C4', (checkEmpHistory && reasonError)? 'red' : '#C4C4C4']}
                                                            containerBorderWidth={[(checkEmpHistory && reasonError)? 2 : 1, 1]}
                                                            containerStyle={[{
                                                                borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (checkEmpHistory && reasonError)? 'dashed' : 'solid',
                                                            }, getWidthnHeight(86, 10)]}
                                                            style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(86, 10), getMarginHorizontal(1.5)]}
                                                            // iconSize={Math.floor(getWidthnHeight(5).width)}
                                                            // iconColor={'#C4C4C4'}
                                                        />
                                                    </View>
                                                    <View style={[{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, getWidthnHeight(85), getMarginTop(2)]}>
                                                        <View style={{alignItems: 'flex-start'}}>
                                                            <Text style={[{color: 'grey'}, fontSizeH4()]}>Work Experience Certificate (pdf)</Text>
                                                            {(uploadedExperience.length > 0) &&
                                                                <TouchableOpacity onPress={() => {
                                                                    this.setState({viewAttachments: true})
                                                                }}>
                                                                    <Text style={[{color: colorTitle}, fontSizeH4()]}>(Tap to view)</Text>
                                                                </TouchableOpacity>
                                                            }
                                                        </View>
                                                        <TouchableOpacity
                                                            activeOpacity={0.5}
                                                            onPress={() => {
                                                                this.addAttachment(experience)
                                                            }}
                                                        >
                                                            {(experienceError)?
                                                                <View style={[{
                                                                    width: getWidthnHeight(13).width, height: getWidthnHeight(13).width, 
                                                                    backgroundColor: 'rgba(11, 142, 232, 0.2)', alignItems: 'center', justifyContent: 'center',
                                                                    borderRadius: getWidthnHeight(1).width, borderWidth: (checkEmpHistory && experienceError)? 2 : 0,
                                                                    borderColor: (checkEmpHistory && experienceError)? 'red' : 'transparent',
                                                                    borderStyle: (checkEmpHistory && experienceError)? 'dashed' : null
                                                                }]}>
                                                                    <FontAwesome name="upload" size={getWidthnHeight(7).width} color={colorTitle}/>
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
                                                    <View style={[{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}, getWidthnHeight(85), getMarginTop(2)]}>
                                                        <View>
                                                            <Text style={[{color: 'grey'}, fontSizeH4()]}>Full and final completed in last</Text>
                                                            <Text style={[{color: 'grey'}, fontSizeH4()]}>organisation</Text>
                                                        </View>
                                                        <View style={[{borderColor: 'red', borderWidth: 0}]}>
                                                            <Slider 
                                                                activeColor={colorTitle} 
                                                                //inactiveColor={'red'}
                                                                //buttonColor={'red'}
                                                                // buttonBorderColor={'blue'}
                                                                value={fullnFinal}
                                                                onSlide={(fullnFinal) => this.setState({fullnFinal})}
                                                                delay={300}
                                                            />
                                                        </View>
                                                    </View>
                                                    <View>
                                                        <View style={[{flexDirection: 'row', justifyContent: 'space-evenly'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                            <View style={[{
                                                                borderColor: (checkEmpHistory && myDepartmentError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: getWidthnHeight(1).width,
                                                                borderStyle: (checkEmpHistory && myDepartmentError)? 'dashed' : 'solid', borderWidth: (checkEmpHistory && myDepartmentError)? 2 : 1,
                                                            }, getWidthnHeight(87, 6.5)]}>
                                                                {/* <Dropdown
                                                                    containerStyle={[{textOverflow:'hidden', borderColor: '#C4C4C4', borderWidth: 0}, getWidthnHeight(87), getMarginTop(-1)]}
                                                                    inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getWidthnHeight(87)]}
                                                                    label={'Department'}
                                                                    labelFontSize={fontSizeH4().fontSize - 3}
                                                                    labelTextStyle={[getMarginLeft(1.5), getMarginTop(0)]}
                                                                    data={departmentList}
                                                                    valueExtractor={({id})=> id}
                                                                    labelExtractor={({name})=> name}
                                                                    onChangeText={(id, index, data) => {
                                                                        this.setState({
                                                                            myDepartment: data[index]['name'], myDepartmentID: id, myDepartmentError: false 
                                                                        }, () => console.log("### DEPARTMENT ID: ", this.state.myDepartmentID))
                                                                        this.dismissKeyboard();
                                                                    }}
                                                                    value={myDepartment}
                                                                    baseColor = {(myDepartment)? colorTitle : '#C4C4C4'}
                                                                    //pickerStyle={[getMarginLeft(4), getWidthnHeight(42), getMarginTop(10)]}
                                                                    fontSize = {(myDepartment)? fontSizeH4().fontSize + 2 : fontSizeH4().fontSize}
                                                                /> */}
                                                                <Dropdown
                                                                    search
                                                                    searchPlaceholder="Search..."
                                                                    style={[{borderColor: '#C4C4C4', borderWidth: 0, justifyContent: 'center'}, getWidthnHeight(87), getMarginRight(-1)]}
                                                                    containerStyle={{marginHorizontal: getMarginHorizontal(3).marginHorizontal, width: '100%'}}
                                                                    inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getWidthnHeight(87)]}
                                                                    placeholder='Department'
                                                                    placeholderStyle={{color: '#C4C4C4', fontSize: fontSizeH4().fontSize, paddingHorizontal: getWidthnHeight(3).width}}
                                                                    selectedTextStyle={[getMarginLeft(3)]}
                                                                    data={departmentList}
                                                                    // iconStyle={{paddingRight: 20}}
                                                                    valueField={'id'}
                                                                    labelField={'name'}
                                                                    onChange={(item) => {
                                                                        console.log(item);
                                                                        this.setState({
                                                                            myDepartment: item.name, myDepartmentID: item.id, myDepartmentError: false 
                                                                        }, () => console.log("### DEPARTMENT ID: ", this.state.myDepartmentID))
                                                                        this.dismissKeyboard();
                                                                    }}
                                                                    value={myDepartmentID}
                                                                />
                                                            </View>
                                                        </View>
                                                        <View style={[{flexDirection: 'row', justifyContent: 'space-evenly'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                            <View style={[{
                                                                borderColor: (checkEmpHistory && myDesignationError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: getWidthnHeight(1).width,
                                                                borderStyle: (checkEmpHistory && myDesignationError)? 'dashed' : 'solid', borderWidth: (checkEmpHistory && myDesignationError)? 2 : 1,
                                                            }, getWidthnHeight(87, 6.5)]}>
                                                                {/* <Dropdown
                                                                    containerStyle={[{textOverflow:'hidden', borderColor: '#C4C4C4', borderWidth: 0}, getWidthnHeight(87), getMarginTop(-1)]}
                                                                    inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getWidthnHeight(87)]}
                                                                    label={'Designation'}
                                                                    labelFontSize={fontSizeH4().fontSize - 3}
                                                                    labelTextStyle={[getMarginLeft(1.5), getMarginTop(0)]}
                                                                    data={designationList}
                                                                    valueExtractor={({id})=> id}
                                                                    labelExtractor={({name})=> name}
                                                                    onChangeText={(id, index, data) => {
                                                                        this.setState({
                                                                            myDesignation: data[index]['name'], myDesignationID: id, myDesignationError: false 
                                                                        }, () => console.log("### DESIGNATION ID: ", this.state.myDesignationID))
                                                                        this.dismissKeyboard();
                                                                    }}
                                                                    value={myDesignation}
                                                                    baseColor = {(myDesignation)? colorTitle : '#C4C4C4'}
                                                                    //pickerStyle={[getMarginLeft(4), getWidthnHeight(42), getMarginTop(10)]}
                                                                    fontSize = {(myDesignation)? fontSizeH4().fontSize + 2 : fontSizeH4().fontSize}
                                                                /> */}
                                                                <Dropdown
                                                                    search
                                                                    searchPlaceholder="Search..."
                                                                    style={[{borderColor: '#C4C4C4', borderWidth: 0, justifyContent: 'center'}, getWidthnHeight(87), getMarginRight(-1)]}
                                                                    containerStyle={{marginHorizontal: getMarginHorizontal(3).marginHorizontal, width: '100%'}}
                                                                    inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getWidthnHeight(87)]}
                                                                    placeholder='Designation'
                                                                    placeholderStyle={{color: '#C4C4C4', fontSize: fontSizeH4().fontSize, paddingHorizontal: getWidthnHeight(3).width}}
                                                                    selectedTextStyle={[getMarginLeft(3)]}
                                                                    data={designationList}
                                                                    // iconStyle={{paddingRight: 20}}
                                                                    valueField={'id'}
                                                                    labelField={'name'}
                                                                    onChange={(item) => {
                                                                        console.log(item);
                                                                        this.setState({
                                                                            myDesignation: item.name, myDesignationID: item.id, myDesignationError: false 
                                                                        }, () => console.log("### DESIGNATION ID: ", this.state.myDesignationID))
                                                                        this.dismissKeyboard();
                                                                    }}
                                                                    value={myDesignationID}
                                                                />
                                                            </View>
                                                        </View>
                                                    </View>
                                                </>
                                            }
                                            <View style={[{backgroundColor: 'rgba(196, 196, 196, 0.5)', height: 1}, getWidthnHeight(87), getMarginTop(3)]}/>
                                            <View style={[{
                                                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                                                }, getMarginTop(2), getWidthnHeight(87), getMarginBottom((showSecurityDetails)? 0 : 1)
                                            ]}>
                                                <View style={{alignItems: 'flex-start'}}>
                                                    <MaskedGradientText
                                                        title={"SECURITY DETAILS"}
                                                        titleStyle={[{fontWeight: 'bold', color: '#000000', fontSize: (fontSizeH4().fontSize)}, styles.boldFont]}
                                                        start={{x: 0, y: 0}}
                                                        end={{x: 0.9, y: 0}}
                                                        colors={["#039FFD", "#EA304F"]}
                                                    />
                                                    <MaskedGradientText
                                                        title={"(OPTIONAL)"}
                                                        titleStyle={[{fontWeight: 'bold', color: '#000000', fontSize: (fontSizeH4().fontSize - 3)}, styles.boldFont]}
                                                        start={{x: 0, y: 0}}
                                                        end={{x: 1, y: 0}}
                                                        colors={["#039FFD", "#EA304F"]}
                                                    />
                                                </View>
                                                <Slider 
                                                    activeColor={colorTitle} 
                                                    //inactiveColor={'red'}
                                                    //buttonColor={'red'}
                                                    // buttonBorderColor={'blue'}
                                                    value={showSecurityDetails}
                                                    onSlide={(showSecurityDetails) => this.setState({
                                                        showSecurityDetails, ddDate: '', ddDateError: true, ddNumber: '', ddNumberError: true, bankID: '', bankName: '', bankError: true,
                                                        amount: '', amountError: true, ddCopy: '', ddCopyError: true, checkSecurity: false
                                                    })}
                                                    delay={300}
                                                />
                                            </View>
                                            {(showSecurityDetails) &&
                                                <>
                                                    <View style={[{flexDirection: 'row', justifyContent: 'space-evenly'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                        <View style={[{alignItems: 'center'}, getWidthnHeight(42, 6)]}>
                                                            {/* <AnimateDateLabel
                                                                containerColor={[(checkSecurity && ddDateError)? 'red' : '#C4C4C4', (checkSecurity && ddDateError)? 'red' : '#C4C4C4']}
                                                                containerBorderWidth={[(checkSecurity && ddDateError)? 2 : 1, 1]}
                                                                containerStyle={[{
                                                                    borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (checkSecurity && ddDateError)? 'dashed' : 'solid',
                                                                }, getWidthnHeight(42, 6.5)]}
                                                                slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                                slideHorizontal={[0, getWidthnHeight(-5).width]}
                                                                style={[{justifyContent: 'center'}, getWidthnHeight(42, 6.5)]}
                                                                date={ddDate}
                                                                minDate={ddMinDate}
                                                                maxDate={ddMaxDate}
                                                                mode="date"
                                                                placeholder="DD Date"
                                                                titleStyle={[getMarginLeft(-15)]}
                                                                format="YYYY-MM-DD"
                                                                onDateChange={(date) => {this.setState({ddDate: date, ddDateError: false}, () => {
                                                                    Keyboard.dismiss();
                                                                })}}
                                                            /> */}
                                                            <TouchableOpacity 
                                                                onPress={() => this.setState({showDDPicker: !showDDPicker})}
                                                            >
                                                                <View 
                                                                    style={[{
                                                                        alignItems: 'center', justifyContent: 'center', borderRadius: 5, 
                                                                        borderColor: '#C4C4C4', borderWidth: 1
                                                                    }, getWidthnHeight(42, 6.5)]}>
                                                                    <Text style={[{color: ddDate? '#000000' : '#C4C4C4', fontSize: (fontSizeH4().fontSize + 2)}]}>{ddDate || 'DD Date'}</Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                            {(showDDPicker) && (
                                                                <DateTimePicker 
                                                                    styleBox={{flex: 1}}
                                                                    date={moment(ddTimeStamp).utc().toDate()}
                                                                    androidMode='default'
                                                                    mode='date'
                                                                    is24Hour={false}
                                                                    placeholder='DD Date'
                                                                    format='YYYY-MM-DD'
                                                                    minDate={ddMinDate}
                                                                    maxDate={ddMaxDate}
                                                                    onDateChange={(event, newDate) => {
                                                                        if(event.type === "dismissed"){
                                                                            this.setState({showDDPicker: !showDDPicker})
                                                                            return;
                                                                        }
                                                                        this.setState({showDDPicker: !showDDPicker})
                                                                        const ddTimeStamp = event.nativeEvent.timestamp;
                                                                        this.setState({
                                                                            ddDate: moment(newDate).format("YYYY-MM-DD"), ddTimeStamp,
                                                                            ddDateError: false
                                                                        });
                                                                        Keyboard.dismiss();
                                                                    }} 
                                                                />
                                                            )}
                                                            <View style={styles.forDate}>
                                                                <Text style={[{fontSize: (fontSizeH4().fontSize - 4), color: '#0B8EE8', fontWeight: 'normal', textAlign: 'center'}, styles.boldFont]}>From Date</Text>
                                                            </View>
                                                        </View>
                                                        <View>
                                                            <AnimatedTextInput 
                                                                placeholder=" DD Number "
                                                                placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                                value={ddNumber}
                                                                slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                                slideHorizontal={[0, getWidthnHeight(-3.3).width]}
                                                                placeholderScale={[1, 0.75]}
                                                                keyboardType={'numeric'}
                                                                maxLength={8}
                                                                autoFocus={false}
                                                                onChangeText={(number) => {
                                                                    this.setState({ ddNumber: number.replace(/[^0-9]/g, '')}, () => {
                                                                        const {ddNumber} = this.state;
                                                                        if(ddNumber !== ''){
                                                                            this.setState({ddNumberError: false})
                                                                        }else{
                                                                            this.setState({ddNumber: '', ddNumberError: true}, () => Keyboard.dismiss())
                                                                        }
                                                                    })
                                                                }}
                                                                clearText={() => this.setState({ddNumber: '', ddNumberError: true})}
                                                                containerColor={[(checkSecurity && ddNumberError)? 'red' : '#C4C4C4', (checkSecurity && ddNumberError)? 'red' : '#C4C4C4']}
                                                                containerBorderWidth={[(checkSecurity && ddNumberError)? 2 : 1, 1]}
                                                                containerStyle={[{
                                                                    borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (checkSecurity && ddNumberError)? 'dashed' : 'solid',
                                                                }, getWidthnHeight(42, 6.5)]}
                                                                style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(40, 6.5), getMarginHorizontal(2)]}
                                                            />
                                                        </View>
                                                    </View>
                                                    <View style={[{flexDirection: 'row', justifyContent: 'space-evenly'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                        <View style={[{
                                                            borderColor: (checkSecurity && bankError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: getWidthnHeight(1).width,
                                                            borderStyle: (checkSecurity && bankError)? 'dashed' : 'solid', borderWidth: (checkSecurity && bankError)? 2 : 1,
                                                        }, getWidthnHeight(87, 6.5)]}>
                                                            {/* <Dropdown
                                                                containerStyle={[{textOverflow:'hidden', borderColor: '#C4C4C4', borderWidth: 0}, getWidthnHeight(87), getMarginTop(-1)]}
                                                                inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getWidthnHeight(87)]}
                                                                label={'Bank Name'}
                                                                labelFontSize={fontSizeH4().fontSize - 3}
                                                                labelTextStyle={[getMarginLeft(1.5), getMarginTop(0)]}
                                                                data={bankList}
                                                                valueExtractor={({id})=> id}
                                                                labelExtractor={({name})=> name}
                                                                onChangeText={(id, index, data) => {
                                                                    this.setState({
                                                                        bankName: data[index]['name'], bankID: id, bankError: false 
                                                                    }, () => console.log("### BANK ID: ", this.state.bankID))
                                                                    this.dismissKeyboard();
                                                                }}
                                                                value={bankName}
                                                                baseColor = {(bankName)? colorTitle : '#C4C4C4'}
                                                                //pickerStyle={[getMarginLeft(4), getWidthnHeight(42), getMarginTop(10)]}
                                                                fontSize = {(bankName)? fontSizeH4().fontSize + 2 : fontSizeH4().fontSize}
                                                            /> */}
                                                            <Dropdown
                                                                search
                                                                searchPlaceholder="Search..."
                                                                containerStyle={[{borderColor: '#C4C4C4', borderWidth: 0}, getWidthnHeight(87), getMarginTop(-1)]}
                                                                inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getWidthnHeight(87)]}
                                                                placeholder={'Bank Name*'}
                                                                placeholderStyle={{color: '#C4C4C4', fontSize: fontSizeH4().fontSize, paddingLeft: getWidthnHeight(3).width}}
                                                                selectedTextStyle={[getMarginLeft(3)]}
                                                                data={bankList}
                                                                valueField={'id'}
                                                                labelField={'name'}
                                                                onChange={(item) => {
                                                                    this.setState({
                                                                        bankName: item.name, bankID: item.id, bankError: false 
                                                                    }, () => console.log("### BANK ID: ", this.state.bankID))
                                                                    this.dismissKeyboard();
                                                                }}
                                                                value={bankID}
                                                            />
                                                        </View>
                                                    </View>
                                                    <View style={[getMarginTop(2)]}>
                                                        <AnimatedTextInput 
                                                            placeholder=" Amount (in Rupees) "
                                                            placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                            value={amount}
                                                            slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                            slideHorizontal={[0, getWidthnHeight(-3.3).width]}
                                                            placeholderScale={[1, 0.75]}
                                                            keyboardType={'numeric'}
                                                            autoFocus={false}
                                                            onChangeText={(number) => {
                                                                this.setState({ amount: number.replace(/[^0-9]/g, '')}, () => {
                                                                    const {amount} = this.state;
                                                                    if(amount !== ''){
                                                                        this.setState({amountError: false})
                                                                    }else{
                                                                        this.setState({amount: '', amountError: true}, () => Keyboard.dismiss())
                                                                    }
                                                                })
                                                            }}
                                                            clearText={() => this.setState({amount: '', amountError: true})}
                                                            containerColor={[(checkSecurity && amountError)? 'red' : '#C4C4C4', (checkSecurity && amountError)? 'red' : '#C4C4C4']}
                                                            containerBorderWidth={[(checkSecurity && amountError)? 2 : 1, 1]}
                                                            containerStyle={[{
                                                                borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (checkSecurity && amountError)? 'dashed' : 'solid',
                                                            }, getWidthnHeight(87, 6.5)]}
                                                            style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(87, 6.5), getMarginHorizontal(2)]}
                                                        />
                                                    </View>
                                                    <View style={[{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, getWidthnHeight(85), getMarginTop(2)]}>
                                                        <View style={{alignItems: 'flex-start'}}>
                                                            <Text style={[{color: 'grey', paddingBottom: getMarginTop(1).marginTop}, fontSizeH4()]}>Scanned Copy of DD (pdf)</Text>
                                                            {(securityDetails) &&
                                                                <View style={[{flexDirection: 'row', justifyContent: 'space-between'}, getWidthnHeight(15)]}>
                                                                    <TouchableOpacity onPress={() => {
                                                                        this.checkExistingDownloads(securityDetails.dd_copy, null, 'ddCopy');
                                                                    }}>
                                                                        <View style={[{
                                                                        width: getWidthnHeight(6).width, height: getWidthnHeight(6).width, 
                                                                        backgroundColor: 'rgba(249, 132, 4, 0.2)', alignItems: 'center', justifyContent: 'center',
                                                                        borderRadius: getWidthnHeight(1).width,
                                                                        }]}>
                                                                            <FontAwesome name="download" size={getWidthnHeight(3.5).width} color={downloadColor}/>
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                </View>
                                                            }
                                                        </View>
                                                        <TouchableOpacity
                                                            activeOpacity={0.5}
                                                            onPress={() => {
                                                                this.addAttachment(scannedDD)
                                                            }}
                                                        >
                                                            {(ddCopyError)?
                                                                <View style={[{
                                                                    width: getWidthnHeight(13).width, height: getWidthnHeight(13).width, 
                                                                    backgroundColor: 'rgba(11, 142, 232, 0.2)', alignItems: 'center', justifyContent: 'center',
                                                                    borderRadius: getWidthnHeight(1).width, borderWidth: (checkSecurity && ddCopyError)? 2 : 0,
                                                                    borderColor: (checkSecurity && ddCopyError)? 'red' : 'transparent',
                                                                    borderStyle: (checkSecurity && ddCopyError)? 'dashed' : null
                                                                }]}>
                                                                    <FontAwesome name="upload" size={getWidthnHeight(7).width} color={colorTitle}/>
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
                                                </>
                                            }
                                        </View>
                                    </ScrollView>
                                    <View style={[{backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}, getMarginBottom(1), getWidthnHeight(93)]}>
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
                                            {(viewAttachments) && (
                                                <Attachments 
                                                    isVisible={viewAttachments}
                                                    headerColor={COLOR1}
                                                    toggle={() => this.setState({viewAttachments: false}, () => Keyboard.dismiss())}
                                                    data={uploadedExperience}
                                                    apiData={this.props.route.params.apiData}
                                                    baseURL={baseURL}
                                                    downloadColor={downloadColor}
                                                    secretToken={secretToken}
                                                    staticValue={removeAttachment}
                                                    updateAttachment={(updateData) => this.updateAttachment(updateData)}
                                                    downloadAttachment={(attachment, docID, document) => {
                                                        const {removeAttachment} = this.state;
                                                        if(removeAttachment){
                                                            this.checkExistingDownloads(attachment, docID, document);
                                                        }
                                                    }}
                                                />
                                            )}
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
        marginLeft: 10,
        left: 0
    },
})

export default EmergencyDetails;