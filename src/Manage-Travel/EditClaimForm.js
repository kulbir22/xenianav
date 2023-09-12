import React from 'react';
import {
    StyleSheet, Text, TouchableOpacity, PermissionsAndroid,
    TouchableHighlight, View, Alert, Image, KeyboardAvoidingView,
    ScrollView, Animated, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    StayModal, getWidthnHeight, WaveHeader, getMarginTop, getMarginLeft, DateTimePicker, Spinner, SearchableDropDown,
    getMarginRight, CustomTextInput, MySwitch,RoundButton, ItineraryDescriptionModal,fontSize_H3, fontSizeH4, AlertBox, 
    IOS_StatusBar, statusBarGradient, DateSelector, getMarginVertical, getMarginBottom, DocumentsModal} from '../NewComponents/common';
import moment from 'moment';
import axios from 'axios';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import RNBackgroundDownloader from 'react-native-background-downloader';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS, { exists } from 'react-native-fs';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import AntdesignIcons from 'react-native-vector-icons/AntDesign';
import { Dropdown } from 'react-native-material-dropdown';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Icons from 'react-native-vector-icons/MaterialIcons';
import DocumentPicker from 'react-native-document-picker';
import {extractBaseURL, getClaimDocumentAttachmentAPI} from '../api/BaseURL';

const colorBase = '#25A2F9';
const colorTitle = '#0B8EE8'; 
const message = "Please fill the fields highlighted in RED";
let displayImage = [];

export default class Claim_Form_Travel extends React.Component {

    constructor(props) {
        super(props)
        let year = `${moment().year()}`;
        let month = `${moment().month() + 1}`;
        month = (month < 10)? `0${month}` : month;
        const currentDate = `${moment().date()}-${month}-${year}`;
        let previousDate = `01-${month}-${year}`
        previousDate = moment(previousDate, "DD-MM-YYYY").subtract(1, 'month').format("DD-MM-YYYY");
        const currentTime = "12:00 AM";
        const previousDateTime = `${previousDate} ${currentTime}`; 
        const currentDateTime = `${currentDate} ${currentTime}`;
        const minUtcTimeStamp = moment(previousDateTime, "DD-MM-YYYY hh:mm A").utc().toDate();
        const maxUtcTimeStamp = moment(currentDateTime, "DD-MM-YYYY hh:mm A").utc().toDate();
        this.state = {
            travelDateTime:'',
            travelTimeStamp: moment().valueOf(),
            travelMinDate: minUtcTimeStamp,
            travelMaxDate: maxUtcTimeStamp,
            showTravelDatePicker: false,
            fromDate: moment().format("DD-MM-YYYY"),
            fromTimeStamp: moment().valueOf(),
            fromTime: '12:00 AM',
            fromMinDate: minUtcTimeStamp,
            showFromDatePicker: false,
            toDate: moment().format("DD-MM-YYYY"),
            toTimeStamp: moment().valueOf(),
            toTime: '11:59 PM',
            toMinDate: minUtcTimeStamp,
            showToDatePicker: false,
            switchpolicy: false,
            switchStay: false,
            itinerarytoggle:false,
            staytoggle:false,
            baseURL: null,
            conveyanceType: [],
            cities: [],
            loading: false,
            conveyanceID: null,
            conveyanceName: '',
            fromCityID: null,
            fromCityName: '',
            toCityID: null,
            toCityName: '',
            isLocal: 0,
            pricePerKM: 0,
            distance: '',
            amount: '',
            description: '',
            calculatedAmount: null,
            animateFontSize: new Animated.Value(fontSizeH4().fontSize),
            animateTextHeight: new Animated.Value(0),
            animateTextOpacity: new Animated.Value(0),
            animationCalled: false,
            travelCategories: [],
            travelCategoryID: '',
            travelCategoryName: '',
            travelCategoryError: true,
            tDateError: true,
            conveyanceError: true,
            tFromCityError: true,
            tToCityError: true,
            tDistanceError: true,
            amountError: true,
            descriptionError: true,
            checkTravelErrors: function(){
                return (this.tDateError === false && this.conveyanceError === false && this.fromStateError === false &&  this.tFromCityError === false 
                        && this.toStateError === false && this.tToCityError === false && ((this.isLocal === 0)? true : this.tDistanceError === false) &&
                        ((this.isLocal === 0)? this.amountError === false : true) && this.descriptionError === false)
            },
            checkStayErrors: function(){
                return (this.stayDateError === false && this.stayDateError2 === false && this.stateError === false && this.stayCityError === false 
                        && this.stayRateError === false && this.foodExpenseError === false)
            },
            submitTravel: false,
            travelData: [],
            // travelData: [
            //     {"amount": 63, "isLocal": 1, "conveyance": "Auto [Rs.4.5/km]", "date": "17/05/2021", "distance": "14", "from": "Adilabad", "id": 1, "to": "Adoni", "fromCityID": 2, "toCityID": 3, "conveyanceID": 5}, 
            //     {"amount": 825, "isLocal": 1, "conveyance": "Own Car - Petrol [Rs.5.5/km]", "date": "17/05/2021", "distance": "150", "from": "Anantapur", "id": 2, "to": "Banganapalle", "fromCityID": 3, "toCityID": 5, "conveyanceID": 1}, 
            //     {"amount": "20", "isLocal": 0, "conveyance": "DA", "date": "17/05/2021", "distance": null, "from": "Bhainsa", "id": 3, "to": "Bhongir", "fromCityID": 7, "toCityID": 4, "conveyanceID": 1}
            // ],
            enableAlert: false,
            alertTitle: null,
            alertColor: false,
            submitStay: false,
            stayDate: '',
            stayDate2: '',
            stateName: '',
            stateID: null,
            stayDateError: true,
            stayDateError2: true,
            stateError: true,
            stayCityID: null,
            stayCityName: '',
            stayCityError: true,
            stayRate: '',
            stayRateError: true,
            foodExpense: '',
            foodExpenseError: true,
            stateData: [],
            stayData: [],
            // stayData: [
            //     {"city": "Chandigarh", "stayCityID": 2, "date1": "17/05/2021", "date2": "18/05/2021" , "date": "17/05/2021 - 18/05/2021", "foodExpense": "200", "id": 1, "state": "Chandigarh", "stayRate": "500"},
            //     {"city": "Mohali", "stayCityID": 2, "date1": "19/05/2021", "date2": "20/05/2021", "date": "19/05/2021 - 20/05/2021", "foodExpense": "200", "id": 2, "state": "Punjab", "stayRate": "500"},
            //     {"city": "Moga", "stayCityID": 4, "date1": "21/05/2021", "date2": "22/05/2021", "date": "21/05/2021 - 22/05/2021", "foodExpense": "200", "id": 3, "state": "Punjab", "stayRate": "500"}
            // ],
            stateWiseCity: [],
            foodAllowance: null,
            save: false,
            checkTravelBlank: function(){
                return (this.tDateError === true && this.conveyanceError === true && this.fromStateError === true && this.tFromCityError === true 
                    && this.toStateError === true && this.tToCityError === true && ((this.isLocal === 0)? true : this.tDistanceError === true) && 
                    ((this.isLocal === 0)? this.amountError === true : true) && this.descriptionError === true)
            },
            checkStayBlank: function(){
                return (this.stayDateError === true && this.stayDateError2 === true && this.stateError === true && this.stayCityError === true 
                    && this.stayRateError === true && this.foodExpenseError === true)
            },
            bounceTravelButton: false,
            animateSubmitButton: new Animated.Value(1),
            bounceStayButton: false,
            hotelAllowance: null,
            cityID: null,
            bandID: null,
            apiError: false,
            errorCode: null,
            apiCode: null,
            travelDate: [],
            conveyance: [],
            fromCity: [],
            toCity: [],
            distanceInKM: [],
            travelAmount: [],
            travelDescription: [],
            stayDateRange: [],
            stayStateID: [],
            stayCity: [],
            stayRatePerNight: [],
            da: [],
            stayDateR1: [],
            stayDateR2: [], 
            itineraryTotal: 0,
            stayTotal: 0,
            editTravel: false,
            editTravelIndex: null,
            editStay: false,
            editStayIndex: null,
            distanceTypeCount: 0,
            amountTypeCount: 0,
            descriptionTypeCount: 0,
            travelProgress: 0,
            bounceTravelCount: new Animated.Value(1),
            incrementTravel: false,
            stayProgress: 0,
            bounceStayCount: new Animated.Value(1),
            incrementStay: false,
            stayRateCount: 0,
            foodExpenseCount: 0,
            attachmentType: [],
            attachedImage: [],
            fileName: '',
            fileNameError: true,
            attachmentID: null,
            attachmentName: '',
            attachmentError: true,
            submitAttachment: false,
            selectedAttachment: '',
            attachedImageError: true,
            checkUploadErrors: function(){
                return (this.fileNameError === false && this.attachmentError === false && this.attachedImageError === false && this.attachedImageError === false)
            },
            documentType: [],
            documentURI: [],
            documentName: [],
            submitClaim: false,
            comments: '',
            commentsError: true,
            filesTitle: [],
            attachmentsName: [],
            attachmentsID: [],
            documentsModal: false,
            editDocumentIndex: null,
            editAttachment: false,
            detailIndex: '0',
            imageArray: [],
            uploadDocument: [],
            incrementIndex: 0,
            claimID: null,
            receivedTravel: [],
            receivedStay: [],
            receivedDocuments: [],
            travelStatus: '',
            travelUniqueID: null,
            stayStatus: '',
            stayUniqueID: null,
            documentStatus: '',
            documentUniqueID: null,
            hideStay: true,
            showSpinner: false,
            editedDocument: 0,
            attachmentUpdated: [],
            secretToken: null,
            downloadLink: null,
            downloadFileName: '',
            fullFileName: '',
            fileSize: null,
            downloadModal: false,
            percent: 0,
            checkFile: false,
            travelAttachment: false,
            stayAttachment: false,
            fromStateArray: [],
            fromState: '',
            fromStateID: null,
            fromStateError: true,
            toStateArray: [],
            toState: '',
            toStateID: null,
            toStateError: true
        };
        this.props.navigation.setOptions({
            title: 'Edit Claim Form'
        })
    }

    showSpinner(){
        this.setState({showSpinner: true})
    }

    hideSpinner(){
        this.setState({showSpinner: false})
    }

    async componentDidMount(){
        if(Platform.OS === 'android'){
            this.getAndroidStoragePermission();
        }else if(Platform.OS === 'ios'){
            this.get_iOS_StoragePermission();
        }
        await extractBaseURL().then((baseURL) => {
            this.setState({baseURL}, () => {
                console.log("EXTRACT LINK AMAN: ", this.state.baseURL)
                this.apicall()
            })
        })
        const user_token= await AsyncStorage.getItem('user_token');
        const permissions_fir= JSON.parse(user_token);
        this.setState({secretToken: permissions_fir.success.secret_token});
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
                    onPress: () => this.props.navigation.goBack()
                }]
                );
            }
        }catch (err) {
            console.warn(err);
        }
    }

    async generateDownloadLink(fileName, number){
        this.setState({downloadFileName: fileName}, async() => {
            await getClaimDocumentAttachmentAPI(fileName).then((link) => {
                this.setState({downloadLink: link}, () => {
                    const {downloadLink} = this.state;
                    console.log("%%%%%% @@@@@@ DOWNLOAD LINK: ", downloadLink)
                    if(downloadLink){
                        this.downloadAttachment(number);
                    }
                })
            })
        })
    }

    async downloadAttachment(number){
        const {downloadFileName, downloadLink, secretToken, showSpinner} = this.state;
        if(!secretToken || !downloadLink || showSpinner){
            return;
        }
        this.showSpinner();
        let downloadDir = null;
        if(Platform.OS === 'android'){
            downloadDir = RNFetchBlob.fs.dirs.DownloadDir;
        }else if(Platform.OS === 'ios'){
            downloadDir = RNFS.DocumentDirectoryPath;
        }
        const downloadPath = `${downloadDir}/D${number}_${downloadFileName}`;
        this.setState({fullFileName: `D${number}_${downloadFileName}`}, () => {
            const {fullFileName} = this.state;
            if(fullFileName){
                exists(downloadPath).then((checkFile) => {
                    console.log("@@@@@ CHECK FILE EXISTS: ", checkFile);
                    this.setState({checkFile}, () => {
                        const {checkFile} = this.state;
                        if(checkFile){
                            Alert.alert("File already exists!", `${fullFileName} ${"\n\n"}Continue Downloading ?`, [
                                {
                                    text: "Yes",
                                    onPress: () => {
                                        console.log("%%%% CONTINUE YES")
                                        this.continueDownload(downloadPath);
                                    }
                                },
                                {
                                    text: "No",
                                    onPress: () => {
                                        console.log("^^^^ DOWNLOAD DISCARDED")
                                        this.setState({showSpinner: false, downloadModal: false, fullFileName: ''})
                                        return;
                                    }
                                }
                            ])
                        }else{
                            this.continueDownload(downloadPath);
                        }
                    });
                })
            }
        });
    }

    continueDownload(downloadPath){
        const {downloadLink, secretToken, fullFileName} = this.state;
        console.log("&&&& CONTINUE DOWNLOAD")
        RNBackgroundDownloader.download({
            id: fullFileName,
            url: downloadLink,
            destination: downloadPath,
            headers: {
                Authorization: `Bearer ${secretToken}`,
            }
        }).begin((expectedBytes) => {
            console.log(`Going to download ${expectedBytes} bytes!`);
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
            this.hideSpinner();
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
            console.log('Download canceled due to error: ', error);
            this.setState({downloadModal: false, percent: 0, fullFileName: ''})
            this.hideSpinner();
            Alert.alert("Error!", "Unable to Download File")
        });
    }

    async checkExistingDownloads(attachment, serialNo){
        const {showSpinner} = this.state;
        if(showSpinner){
            this.setState({downloadModal: true})
            return;
        }
        let lostTasks = await RNBackgroundDownloader.checkForExistingDownloads();
        console.log("$$$$ ANY DOWNLOADS: ", lostTasks)
        if(lostTasks.length == 0){
            this.generateDownloadLink(attachment, serialNo)
        }else if(lostTasks.length > 0){
            this.setState({showSpinner: true, downloadModal: true})
            for(let task  of lostTasks){
                this.setState({fullFileName: task['id']})
                //console.log("***^^^ TASK ID: ", task['id'])
                task.progress((percent) => {
                    this.setState({percent: Math.floor(percent * 100)})
                    console.log(`Downloaded: ${percent * 100}%`);
                }).done(() => {
                    console.log('Downlaod is done!');
                    this.setState({showSpinner: false, downloadModal: false, fullFileName: '', percent: 0})
                    if(Platform.OS === 'android'){
                        Alert.alert("Download Complete!", `File available in Downloads folder. ${"\n\n"} ${task['id']}`)
                    }else if(Platform.OS === 'ios'){
                        Alert.alert("Download Complete!", `On My iPhone/xenia: ${"\n\n"} ${task['id']}`)
                    }
                }).error((error) => {
                    this.setState({showSpinner: false, downloadModal: false, fullFileName: '', percent: 0})
                    Alert.alert("Error!", "Unable to Download File")
                    console.log('Download canceled due to error: ', error);
                });
            }
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
                  response === RESULTS.GRANTED ? console.log("@@@ MEDIA PERMISSION GRANTED") : this.props.navigation.goBack();
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

    showLoader(){
        this.setState({loading: true})
    }

    hideLoader(){
        this.setState({loading: false})
    }

    async apicall(){
        const {baseURL} = this.state;
        this.showLoader();
        console.log("BASEURL: ", `${baseURL}/travel/approval-form`)
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_four=permissions_fir.success.secret_token;
        axios.get(`${baseURL}/travel/approval-form`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+ permissions_four,
            }
        }).then((response) => {
            this.hideLoader();
            const responseJson = (response.data);
            console.log("@@@@@ SUCCESS", responseJson.data.user.designation)
            const modifyData = responseJson.data.user.designation;
            const conveyanceType = this.manageData(modifyData[0]['band']['travel_conveyances']);
            const bandID = modifyData[0]['band']['id'];
            this.setState({
                conveyanceType: conveyanceType,
                stateData: responseJson.data.states,
                cities: responseJson.data.cities,
                travelCategories: responseJson.data.categories,
                projects: responseJson.data.projects,
                bandID: bandID,
                tilData: responseJson.data.lead,
                attachmentType: responseJson.data.conveyances
            }, () => this.autoFillData())
        }).catch((error) => {
            this.hideLoader();
            console.log("AXIOS ERROR: ", error)
            let status = null;
            if(error.response){
                status = error.response.status;
                this.enableModal(status, '127')
            }else{
                alert(`${error}, API CODE: 127`)
            }
        });
    }

    manageData(conveyanceData){
        const renamedData = conveyanceData.map((data) => {
            let name = '';
            if(data.islocal === 1){
                name = `${data.name} [Rs.${data.price_per_km}/km]`;
            }else if(data.islocal === 0){
                name = data.name
            }
            return {...data, name}
        })
        return renamedData;
    }

    autoFillData(){
        const {details} = this.props.route.params;
        const travelData = details.claims.claim_details;
        const stayData = details.claims.claim_stay;
        const attachedImage = details.claims.claim_attachments;
        let receivedTravel = [];
        let claimDetails = travelData.map((item) => {
            receivedTravel.push(item.id);
            let conveyanceName = '';
            if(item.expense_types.islocal === 1){
                conveyanceName = `${item.expense_types.name} [Rs.${item.expense_types.price_per_km}/km]`
            }else{
                conveyanceName = item.expense_types.name;
            }
            const travelDate = moment(item.expense_date).format('DD-MM-YYYY');
            return {
                id: item.id,
                uniqueID: item.id,
                status: item.status,
                date: travelDate,
                conveyance: conveyanceName,
                conveyanceID: item.expense_type,
                fromState: item.from_city.state.name,
                fromStateID: item.from_city.state.id,
                from: item.from_city.name,
                fromCityID: item.from_city.id,
                toState: item.to_city.state.name,
                toStateID: item.to_city.state.id,
                to: item.to_city.name,
                toCityID: item.to_city.id,
                distance: (item.expense_types.islocal === 0)? "" : String(item.distance_in_km),
                amount: String(item.amount),
                isLocal: item.expense_types.islocal,
                pricePerKM: item.expense_types.price_per_km,
                description: item.description
            }
        })
        this.setState({travelData: claimDetails, receivedTravel}, () => {
            console.log("**** RECEIVED TRAVEL ID: ", this.state.receivedTravel, this.state.travelData)
            this.compileTravelData()
        })
        let receivedStay = [];
        let claimStay = [];
        if(stayData.length > 0){
            this.setState({hideStay: false, switchStay: true, stayAttachment: true}, () => {
                claimStay = stayData.map((item) => {
                    receivedStay.push(item.id);
                    const fromDate = moment(item.from_date).format("DD-MM-YYYY");
                    const toDate = moment(item.to_date).format("DD-MM-YYYY");
                    const date1 = moment(fromDate, "DD-MM-YYYY");
                    const date2 = moment(toDate, "DD-MM-YYYY");
                    const days = date2.diff(date1, 'days');
                    return {
                        id: item.id,
                        status: item.status,
                        uniqueID: item.id,
                        date: `${fromDate} - ${toDate}`,
                        state: item.state.name,
                        stateID: item.state.id,
                        city: item.city.name,
                        stayCityID: item.city.id,
                        stayRate: String(item.rate_per_night),
                        foodExpense: String(item.da),
                        calcStayRate: String((item.rate_per_night) * ((days === 0)? 1 : days)),
                        calcFoodExpense: String((item.da) * ((days === 0)? 1 : (days + 1))),
                        date1: fromDate,
                        date2: toDate
                    }
                })
                this.setState({stayData: claimStay, receivedStay}, () => {
                    console.log("**** RECEIVED STAY ID: ", this.state.receivedStay, this.state.stayData)
                    this.compileStayData();
                })
            })
        }
        let receivedDocuments = [];
        let claimAttachments = [];
        if(attachedImage.length > 0){
            claimAttachments = attachedImage.map((item) => {
                receivedDocuments.push(item.id);
                return {
                    id: item.id,
                    status: item.status,
                    uniqueID: item.id,
                    edited: 0,
                    uri:  null,
                    type: null,
                    name: item.attachment,
                    size: null,
                    fileTitle: item.name,
                    attachmentName: item.attachment_types.name,
                    attachmentID: item.attachment_types.id,              
                }
            })
            this.setState({attachedImage: claimAttachments, receivedDocuments}, () => {
                console.log("**** RECEIVED DOCUMENTS ID: ", this.state.receivedDocuments, this.state.attachedImage)
                this.compileDocumentsData()
            })
        }
    }

    cities = async(stateID, name) => {
        const {baseURL} = this.state;
        this.showLoader();
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_four=permissions_fir.success.secret_token;
        console.log("### STATE WISE CITIES: ", `${baseURL}/states-wise-cities`)
        axios.post(`${baseURL}/states-wise-cities`,
        {
            state_ids: stateID
        },
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+ permissions_four,
            }
        }).then((response) => {
            this.hideLoader();
            console.log("### STATE WISE CITIES: ", (response.data))
            const responseJson = response.data;
            if(name === 'fromState'){
                this.setState({fromStateArray: responseJson.success.cities})
            }else if(name === 'toState'){
                this.setState({toStateArray: responseJson.success.cities})
            }else{
                this.setState({stateWiseCity: responseJson.success.cities})
            }
        }).catch((error) => {
            this.hideLoader();
            let status = null;
            if(error.response){
                status = error.response.status;
                this.enableModal(status, '128')
            }else{
                alert(`${error}, API CODE: 128`)
            }
        })
    }

    cityBand = async() => {
        const {baseURL, stayCityID, bandID} = this.state;
        this.showLoader();
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_four=permissions_fir.success.secret_token;
        axios.post(`${baseURL}/band-city`,
        {
            city: stayCityID,
            band: bandID
        },
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+ permissions_four,
            }
        }).then((response) => {
            this.hideLoader();
            console.log("### STATE WISE CITIES: ", (response.data))
            const responseJson = response.data;
            this.setState({
                hotelAllowance: responseJson.city_class[0].pivot.price,
                foodAllowance: responseJson.food_allowance
            }, () => {
                console.log("### CITY ALLOWANCE: ", this.state.hotelAllowance, this.state.foodAllowance)
            })
        }).catch((error) => {
            this.hideLoader();
            let status = null;
            if(error.response){
                status = error.response.status;
                this.enableModal(status, '129')
            }else{
                alert(`${error}, API CODE: 129`)
            }
        })
    }

    bounceSubmitButton(){
        const {animateSubmitButton} = this.state;
        Animated.loop(
            Animated.sequence([
                Animated.spring(animateSubmitButton, {
                    toValue: 1.1,
                    friction: 7,
                    tension: 250,
                    useNativeDriver: true
                }),
                Animated.timing(animateSubmitButton, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true
                })
            ])
        ).start();
    }

    enableModal(status, apiCode){
        this.setState({errorCode: status})
        this.setState({apiCode})
        this.setState({apiError: true})
    }

    editTravelData(item, index){
        this.itinerarytoggle();
        this.setState({editTravel: true, editTravelIndex: index, 
            travelDateTime: item.date, tDateError: false, travelStatus: item.status, travelUniqueID: item.uniqueID,
            conveyanceID: item.conveyanceID, conveyanceName: item.conveyance, conveyanceError: false, 
            isLocal: item.isLocal, pricePerKM: item.pricePerKM, description: item.description,
            descriptionError: false, travelProgress: 100, amountTypeCount: (item.isLocal === 0)? 1 : 0, 
            distanceTypeCount: (item.isLocal === 1)? 1 : 0, descriptionTypeCount: 1
        }, async() => {
            await this.cities(item.fromStateID, 'fromState');
            await this.cities(item.toStateID, 'toState');
            this.setState({
                fromStateID: item.fromStateID, fromState: item.fromState, fromStateError: false, 
                fromCityID: item.fromCityID, fromCityName: item.from, tFromCityError: false, 
                toStateID: item.toStateID, toState: item.toState, toStateError: false,
                toCityID: item.toCityID, toCityName: item.to, tToCityError: false,
            })
        })
        if(item.isLocal === 0){
            this.setState({
                distance: item.distance, tDistanceError: true, 
                amount: String(item.amount), amountError: false
            })
        }else if(item.isLocal === 1){
            this.setState({
                distance: item.distance, tDistanceError: false, 
                calculatedAmount: String(item.amount)
            })
        }
    }

    saveTravelChanges(){
        const {fromState, fromStateID, toState, toStateID} = this.state;
        this.setState({submitTravel: true})
        const chechError = this.state.checkTravelErrors();
        let editTravelArray = null;
        if(chechError){
            editTravelArray = {
                id: moment().valueOf(),
                status: this.state.travelStatus,
                uniqueID: this.state.travelUniqueID,
                date: this.state.travelDateTime,
                conveyance: this.state.conveyanceName,
                conveyanceID: this.state.conveyanceID,
                fromState,
                fromStateID,
                from: this.state.fromCityName,
                fromCityID: this.state.fromCityID,
                toState,
                toStateID,
                to: this.state.toCityName,
                toCityID: this.state.toCityID,
                distance: this.state.distance,
                amount: (this.state.isLocal === 0)? this.state.amount : this.state.calculatedAmount,
                isLocal: this.state.isLocal,
                pricePerKM: this.state.pricePerKM,
                description: this.state.description
            }
            this.state.travelData.splice(this.state.editTravelIndex, 1, editTravelArray)
            this.setState({
                itineraryTotal: 0, travelDate: [], fromCity: [], toCity: [], 
                distanceInKM: [], travelAmount: [], conveyance: []
            })
            this.setState({
                submitTravel: false, bounceTravelButton: false, travelProgress: 0,
                tDateError: true, conveyanceError: true, pricePerKM: 0,
                tFromCityError: true, tToCityError: true, editTravelIndex: null,
                tDistanceError: true, amountError: true, editTravel: false,
                travelDateTime: '', conveyanceID: null, conveyanceName: '', travelUniqueID: null,
                fromCityID: null, fromCityName: '', toCityID: null, toCityName: '', travelStatus: '',
                distance: '', amount: '', isLocal: 0, calculatedAmount: null, distanceTypeCount: 0, 
                amountTypeCount: 0, descriptionTypeCount: 0, description: '', descriptionError: true,
                fromStateID: null, fromState: '', fromStateError: true, fromStateArray: [],
                toStateID: null, toState: '', toStateError: true, toStateArray: []
            }, () => {
                console.log("^^^&&& SAVE ITINERARY CHANGES: ", this.state.travelData.length, this.state.travelData)
                this.compileTravelData();
            })
        }else {
            this.setState({enableAlert: true, alertTitle: message, alertColor: true})
        }
    }

    editStayData(item, index){
        this.staytoggle();
        this.setState({editStay: true, editStayIndex: index,
        stayDate: item.date1, stayDate2: item.date2,
        stayDateError: false, stayDateError2: false, 
        stateName: item.state, stateError: false,
        stateID: item.stateID, stayProgress: 100,
        stayRateCount: 1, foodExpenseCount: 1,
        stayStatus: item.status, stayUniqueID: item.uniqueID
        }, async() => {
            await this.cities(this.state.stateID, 'stayState');
            this.setState({stayCityName: item.city, stayCityID: item.stayCityID,
            stayRate: item.stayRate, foodExpense: item.foodExpense, stayCityError: false,
            stayRateError: false, foodExpenseError: false}, () => {
                this.cityBand();
            })
        })
        console.log("EDIT STAY: ", item)
    }

    saveStayChanges(){
        const {
            stayDate, stayDate2, stateName, stateID, stayCityName, stayRate, foodExpense,
            stayCityID, editStayIndex
        } = this.state;
        this.setState({submitStay: true})
        let createData = null;
        const chechError = this.state.checkStayErrors();
        if(chechError){
            const date1 = moment(stayDate, "DD-MM-YYYY");
            const date2 = moment(stayDate2, "DD-MM-YYYY");
            const days = date2.diff(date1, 'days');
            console.log('Calculate Number of Days: ', typeof days, days)
            createData = {
                id: moment().valueOf(),
                status: this.state.stayStatus,
                uniqueID: this.state.stayUniqueID,
                date: `${stayDate} - ${stayDate2}`,
                state: stateName,
                stateID: stateID, 
                city: stayCityName,
                stayCityID,
                stayRate: stayRate,
                foodExpense: foodExpense,
                calcStayRate: String((stayRate) * ((days === 0)? 1 : (days))),
                calcFoodExpense: String((foodExpense) * ((days === 0)? 1 : (days + 1))),
                date1: stayDate,
                date2: stayDate2
            }
            this.state.stayData.splice(editStayIndex, 1, createData)
            this.setState({
                stayTotal: 0, stayDateR1: [], stayDateR2: [], stayStateID: [],
                stayCity: [], stayRatePerNight: [], da: []
            })
            this.setState({
                submitStay: false, bounceStayButton: false,
                stayDateError: true, stayDateError2: true, 
                stateError: true, stayCityError: true,
                stayRateError: true, foodExpenseError: true, 
                stayDate: '', stayDate2: '', stayStatus: '',
                stateID: null, stateName: '', stayUniqueID: null,
                stayCityID: null, stayCityName: '', 
                stayRate: '', foodExpense: '',
                hotelAllowance: null, foodAllowance: null,
                stateWiseCity: [], editStay: false, stayProgress: 0,
                editStayIndex: null, stayRateCount: 0, foodExpenseCount: 0
            }, () => {
                console.log("###STAY DATA: ", this.state.stayData.length, this.state.stayData)
                this.compileStayData();
            })
        }else {
            this.setState({enableAlert: true, alertTitle: message, alertColor: true})
        }
    }

    async pickfile(){
        try {
            const res = await DocumentPicker.pick({
              type: [DocumentPicker.types.allFiles],
            });
            this.setState({selectedAttachment: res, attachedImageError: false}, () => console.log("SELECTED ATTACHMENT: ", this.state.selectedAttachment))
            // const pathURI = res.uri;
            // await RNFS.fs.stat(pathURI).then((stats) => {
            //     console.log("ABSOLUTE PATH: ", stats, "\nDOCUMENT PICKER: ", res)
            //     this.setState({ 
            //         selectedAttachment: {fileCopyUri: res.fileCopyUri, docURI: res.uri, name: stats.filename, uri: `file://${stats.path}`, type: res.type, size: stats.size}, 
            //         attachedImageError: false }, () => console.log("SELECTED ATTACHMENT: ", this.state.selectedAttachment));
            // }).catch((err) => {
            //     console.log(err);
            //     alert("An error has occured");
            // });
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                //this.setState({enableAlert: true, alertTitle: 'Cancelled', alertColor: false})
                //Alert.alert('Cancelled');
            } else {
                //this.setState({enableAlert: true, alertTitle: 'Unknown Error: ' + JSON.stringify(err), alertColor: false})
                //Alert.alert('Unknown Error: ' + JSON.stringify(err));
                console.log(JSON.stringify(err))
                throw err;
            }
            //alert("An error has occured");
            this.setState({selectedAttachment: '', attachedImageError: true})
        }
    }

    editDocuments(item, index){
        const {documentsModal} = this.state;
        this.setState({
            documentsModal: !documentsModal, selectedAttachment: {name: item.name, uri: item.uri, type: item.type, size: item.size}, 
            attachedImageError: false, fileName: item.fileTitle, fileNameError: false, attachmentName: item.attachmentName,
            attachmentID: item.attachmentID, attachmentError: false, editDocumentIndex: index, editAttachment: true,
            documentStatus: item.status, documentUniqueID: item.uniqueID, editedDocument: item.edited
        }, () => console.log("EDIT DOCUMENT INDEX: ", this.state.editDocumentIndex))
    }

    documentDataSplice(index){
        const {receivedDocuments} = this.state;
        const deleteItem = this.state.attachedImage[index]
        if(deleteItem.uniqueID){
            if(receivedDocuments.length === 1){
                alert("Last record cannot be deleted, but can be updated.");
                return;
            }else {
                this.removeItem('attachment', deleteItem.uniqueID, index)
                console.log("### $$$ DELETE ITEM: ", deleteItem.uniqueID, receivedDocuments)
            }
        }else{
            this.spliceDocumentData(index)
        }
    }

    spliceDocumentData(index){
        const {attachedImage, editDocumentIndex} = this.state;
        const id = attachedImage[index]['id'];
        if(editDocumentIndex == index){
            this.clearDocuments();
        }
        attachedImage.splice(index, 1);
        this.setState({attachedImage}, () => {
            console.log("@@@@ SPLICE: ", this.state.attachedImage)
            this.setState({
                imageArray: [], filesTitle: [], attachmentsName: [], attachmentsID: []
            }, () => {
                if(this.state.attachedImage.length > 0){
                    this.compileDocumentsData();
                }
            })
        })
    }

    saveDocumentChanges(){
        const {selectedAttachment, editDocumentIndex, documentUniqueID} = this.state;
        const {details} = this.props.route.params;
        const claimAttachments = details.claims.claim_attachments;
        this.setState({submitAttachment: true})
        let editFlag = false;
        if(editDocumentIndex < (claimAttachments.length)){
            const attachmentName = claimAttachments[editDocumentIndex]['attachment'];
            if(attachmentName !== selectedAttachment.name){
                editFlag = true;
            }
        }
        let attachedImage = [];
        const checkError = this.state.checkUploadErrors();
        if(checkError){
            attachedImage = {
                id: moment().valueOf(),
                status: this.state.documentStatus,
                uniqueID: documentUniqueID, 
                edited: (documentUniqueID && editFlag)? 1 : 0,
                uri: selectedAttachment.uri,
                type: selectedAttachment.type,
                name: selectedAttachment.name,
                size: selectedAttachment.size,
                fileTitle: this.state.fileName,
                attachmentName: this.state.attachmentName,
                attachmentID: this.state.attachmentID,
            }
            this.state.attachedImage.splice(editDocumentIndex, 1, attachedImage)
            this.setState({
                imageArray: [], filesTitle: [], attachmentsName: [], attachmentsID: []
            })
            this.setState({
                selectedAttachment: '', fileName: '', fileNameError: true, attachmentID: null,
                attachmentName: '', attachmentError: true, editDocumentIndex: null, editAttachment: false,
                submitAttachment: false, attachedImageError: true, documentStatus: '', documentUniqueID: null
            }, () => this.compileDocumentsData())
        }else {
            this.setState({enableAlert: true, alertTitle: message, alertColor: true})
        }
    }

    checkDocumentsError(){
        const {selectedAttachment, attachedImageError} = this.state;
        this.setState({submitAttachment: true})
        const checkErrors = this.state.checkUploadErrors();
        if(attachedImageError){
            alert("No attachment found");
            return;
        }
        let createData = null;
        if(checkErrors){
            createData = {
                id: moment().valueOf(),
                status: null,
                uniqueID: null,
                edited: 0,
                uri:  selectedAttachment.uri,
                type: selectedAttachment.type,
                name: selectedAttachment.name,
                size: selectedAttachment.size,
                fileTitle: this.state.fileName,
                attachmentName: this.state.attachmentName,
                attachmentID: this.state.attachmentID,              
            }
            this.state.attachedImage.push(createData)
            console.log("ATTACHED IMAGE: ", this.state.attachedImage)
            this.setState({attachmentError: true, fileName: '', fileNameError: true, submitAttachment: false, 
                selectedAttachment: '', attachedImageError: true, attachmentID: null, attachmentName: '', 
                editDocumentIndex: null, editAttachment: false, documentStatus: '', documentUniqueID: null
            }, () => {
                    this.compileDocumentsData();
                })
        }else {
            this.setState({enableAlert: true, alertTitle: message, alertColor: true})
        }
    }

    compileDocumentsData(){
        const {attachedImage} = this.state;
        let imageArray = [];
        imageArray = attachedImage.map((item) => {
            return {name: item.name, uri: item.uri, type: item.type, size: item.size}
        })
        let filesTitle = [];
        filesTitle = attachedImage.map((item) => {
            return item.fileTitle
        })
        let attachmentsName = [];
        attachmentsName = attachedImage.map((item) => {
            return item.attachmentName
        })
        let attachmentsID = [];
        attachmentsID = attachedImage.map((item) => {
            return item.attachmentID
        })
        let receivedDocuments = attachedImage.map((item) => {
            return item.uniqueID
        })
        let attachmentUpdated = []
        attachmentUpdated = attachedImage.map((item) => {
            return item.edited
        })
        this.setState({
            imageArray, filesTitle, attachmentsName, attachmentsID, receivedDocuments, attachmentUpdated
        }, () => {
            console.log("\n^^^&&& IMAGE ARRAY: ", this.state.imageArray, "\nFILES TITLE: ", this.state.filesTitle, 
            "\nATTACHMENTS NAME: ",this.state.attachmentsName, "\nATTACHMENTS ID: ",this.state.attachmentsID, 
            "\nDOCUMENTS: ", this.state.receivedDocuments, "\nUPDATED: ", this.state.attachmentUpdated)
            const {imageArray, filesTitle, attachmentsID, receivedDocuments, attachmentUpdated} = this.state;
            let documentArray = [];
            for(let i = 0; i < imageArray.length; i++){
                documentArray[i] = [imageArray[i], filesTitle[i], attachmentsID[i], receivedDocuments[i], attachmentUpdated[i]]
            }
            this.setState({uploadDocument: documentArray}, () => {
                console.log("UPLOAD DOCUMENTS: ", this.state.uploadDocument)
                //if(this.state.uploadDocument.length === 2){}
                //this.documentsAPI();
            })
        })
    }

    itinerarytoggle = () => {
        const {itinerarytoggle} = this.state;
        this.setState({itinerarytoggle : !itinerarytoggle},()=>console.log('switchValue:',itinerarytoggle))
    }

    staytoggle = () => {
        const {staytoggle} = this.state;
        this.setState({staytoggle : !staytoggle},()=>console.log('staytoggle:',staytoggle))
    }

    setindex=(value) => {
        const {detailIndex} = this.state;
        this.setState({detailIndex:value}, ()=>console.log(this.state.detailIndex))
    }

    bounceTravelCountFunction(){
        const {bounceTravelCount} = this.state;
        Animated.timing(bounceTravelCount, {
            toValue: 1.5,
            duration: 500
        }).start(() => {
            Animated.spring(bounceTravelCount, {
                toValue: 1,
                friction: 4,
                tension: 150
            }).start()
        })
    }

    setTravelProgress = (callback) => {
        this.bounceTravelCountFunction();
        this.setState({travelProgress: (this.state.travelProgress + 12.5), incrementTravel: true}, () => {
            const {travelProgress} = this.state;
            console.log("ADD PROGRESS: ", travelProgress)
            if(travelProgress > 100){
                this.setState({travelProgress: 100}, () => callback(true))
            }else{
                callback(true)
            }
        })
    }

    resetTravelProgress = () => {
            this.bounceTravelCountFunction();
            this.setState({travelProgress: (this.state.travelProgress - 12.5), incrementTravel: false}, () => {
                const {travelProgress} = this.state;
                console.log("SUBTRACT PROGRESS: ", travelProgress)
                if(travelProgress < 0){
                    this.setState({travelProgress: 0})
                }
            })
    }

    bounceStayCountFunction(){
        const {bounceStayCount} = this.state;
        Animated.timing(bounceStayCount, {
            toValue: 1.5,
            duration: 500
        }).start(() => {
            Animated.spring(bounceStayCount, {
                toValue: 1,
                friction: 4,
                tension: 150
            }).start()
        })
    }

    setStayProgress = (callback) => {
        this.bounceStayCountFunction();
        this.setState({stayProgress:Math.round(this.state.stayProgress + 16.67), incrementStay: true}, () => {
            const {stayProgress} = this.state;
            console.log("ADD PROGRESS: ", stayProgress)
            if(stayProgress > 100){
                this.setState({stayProgress: 100}, () => callback(true))
            }else{
                callback(true)
            }
        })
    }

    resetStayProgress = (count = 1) => {
        this.bounceStayCountFunction();
        this.setState({stayProgress:Math.round((this.state.stayProgress) - (16.67 * count)), incrementStay: false}, () => {
            const {stayProgress} = this.state;
            console.log("SUBTRACT PROGRESS: ", stayProgress)
            if(stayProgress < 0){
                this.setState({stayProgress: 0})
            }
        })
    }

    onClickDelete = () => {
        this.clearTravel();
        this.setState({travelProgress:0})
    }

    onclickstaydelete = () => {
        this.clearStay();
        this.setState({stayprogress:0})
    }

    travelDataSplice(index){
        const {receivedTravel} = this.state;
        const deleteItem = this.state.travelData[index]
        if(deleteItem.uniqueID){
            if(receivedTravel.length === 1){
                alert("Last record cannot be deleted, but can be updated.");
                return;
            }else {
                this.removeItem('national', deleteItem.uniqueID, index)
                console.log("### $$$ DELETE ITEM: ", deleteItem.uniqueID, receivedTravel)
            }
        }else{
            this.spliceTravelData(index)
        }
    }

    spliceTravelData(index){
        const {travelData, editTravelIndex} = this.state;
        const id = travelData[index]['id'];
        if(editTravelIndex == index){
            this.clearTravel();
        }
        travelData.splice(index, 1);
        this.setState({travelData}, () => {
            console.log("@@@@ SPLICE: ", this.state.travelData)
            this.setState({
                travelDate: [], fromCity: [], 
                toCity: [], distanceInKM: [], travelAmount: [], conveyance: []
            }, () => {
                if(this.state.travelData.length > 0){
                    this.compileTravelData();
                }else{
                    this.setState({itineraryTotal: 0, travelAttachment: false})
                }
            })
        })
    }

    async removeItem(dataType, dataID, index){
        const {baseURL} = this.state;
        const {details} = this.props.route.params;
        this.setState({showSpinner: true})
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_four=permissions_fir.success.secret_token;
        axios.post(`${baseURL}/travel/delete/claim-national-stay`,
        {
            claimid: details.claims.id,
            type: dataType,
            data_id: dataID
        },
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+ permissions_four,
            }
        }).then((response) => {
            this.setState({showSpinner: false})
            const responseJson = (response.data);
            if(dataType === 'national'){
                this.spliceTravelData(index);
                this.state.receivedTravel.splice(index, 1);
            }else if(dataType === 'stay'){
                this.spliceStayData(index);
                this.state.receivedStay.splice(index, 1);
            }else if(dataType === 'attachment'){
                this.spliceDocumentData(index);
                this.state.receivedDocuments.splice(index, 1);
            }
            Alert.alert("Success!", responseJson.msg)
            console.log("@@@@@ SUCCESS", responseJson)
        }).catch((error) => {
            this.setState({showSpinner: false})
            let status = null;
            console.log("#### ERROR: ", error, details.claims.id, dataType, dataID)
            if(error.response){
                status = error.response.status;
                this.enableModal(status, '130')
            }else{
                alert(`${error}, API CODE: 130`)
            }
        });
    }

    compileTravelData(){
        const {travelData} = this.state;
        let sumAmount = 0;
        travelData.forEach((item) => {
            sumAmount = Number(sumAmount) + Number(item.amount);
        })
        let travelDate = [];
        travelDate = travelData.map((item) => {
            return item.date
        })
        let conveyance = [];
        conveyance = travelData.map((item) => {
            return String(item.conveyanceID)
        })
        let fromCity = [];
        fromCity = travelData.map((item) => {
            return String(item.fromCityID)
        })
        let toCity = [];
        toCity = travelData.map((item) => {
            return String(item.toCityID)
        })
        let distanceInKM = []
        distanceInKM = travelData.map((item) => {
            return String(item.distance)
        })
        let travelAmount = []
        travelAmount = travelData.map((item) => {
            return String(item.amount)
        })
        let travelDescription = [];
        travelDescription = travelData.map((item) => {
            return item.description
        })
        let receivedTravel = [];
        receivedTravel = travelData.map((item) => {
            return item.uniqueID;
        })
        let travelAttachment = false;
        travelData.findIndex((item) => {
            if(item.isLocal === 0){
                travelAttachment = true;
            }
        })
        this.setState({
            itineraryTotal: sumAmount, travelDate: (travelDate), fromCity: (fromCity), 
            toCity: (toCity), distanceInKM: (distanceInKM), travelAmount: (travelAmount), travelAttachment,
            conveyance: (conveyance), travelDescription: (travelDescription), receivedTravel: (receivedTravel)
        }, () => console.log("\nTRAVEL DATE: ", this.state.travelDate,
        "\nFROM CITY: ", this.state.fromCity, "\nTO CITY: ", this.state.toCity, "\nDISTANCE: ", this.state.distanceInKM, 
        "\nAMOUNT: ", this.state.travelAmount, "\nCONVEYANCE: ", this.state.conveyance, "\nUNIQUE ID: ", this.state.receivedTravel
        ))
    }

    stayDataSplice(index){
        const {receivedStay} = this.state;
        const deleteItem = this.state.stayData[index]
        if(deleteItem.uniqueID){
            if(receivedStay.length === 1){
                alert("Last record cannot be deleted, but can be updated.");
                return;
            }else{
                this.removeItem('stay', deleteItem.uniqueID, index)
                console.log("### STAY SPLICE: ", deleteItem.uniqueID, receivedStay)
            }
        }else {
            this.spliceStayData(index)
        }
    }

    spliceStayData(index){
        let {stayData, editStayIndex} = this.state;
        const id = stayData[index]['id'];
        if(editStayIndex == index){
            this.clearStay();
        }
        stayData.splice(index, 1)
        this.setState({stayData}, () => {
            console.log("@@@@ SPLICE: ", this.state.stayData)
            this.setState({stayDateRange: [], stayCity: [], stayRatePerNight: [],da: []}, () => {
                if(this.state.stateData.length > 0){
                    this.compileStayData()
                }else{
                    this.setState({stayTotal: 0})
                }
            })
        })
    }

    compileStayData(){
        const {stayData} = this.state;
        let sumAmount = 0;
        stayData.forEach((item) => {
            const date1 = moment(item.date1, "DD-MM-YYYY");
            const date2 = moment(item.date2, "DD-MM-YYYY");
            const days = date2.diff(date1, 'days');
            sumAmount = Number(sumAmount) + Number(item.foodExpense) * ((days === 0)? 1 : (days + 1)) + Number(item.stayRate) * ((days === 0)? 1 : days);
            console.log('Compile Number of Days: ', typeof days, days);
        })
        console.log('@@@ STAY TOTAL: ', sumAmount);
        let stayDateR1 = [];
        stayDateR1 = stayData.map((item) => {
            return item.date1
        })
        let stayDateR2 = [];
        stayDateR2 = stayData.map((item) => {
            return item.date2
        })
        let stayStateID = []
        stayStateID = stayData.map((item) => {
            return String(item.stateID)
        })
        let stayCity = []
        stayCity = stayData.map((item) => {
            return String(item.stayCityID)
        })
        let stayRatePerNight = []
        stayRatePerNight = stayData.map((item) => {
            return item.stayRate
        })
        let da = []
        da = stayData.map((item) => {
            return item.foodExpense
        })
        let receivedStay = [];
        receivedStay = stayData.map((item) => {
            return item.uniqueID
        })
        this.setState({
            stayTotal: sumAmount, stayDateR1: (stayDateR1), stayDateR2: (stayDateR2), stayCity: (stayCity), 
            stayRatePerNight: (stayRatePerNight), da: (da), stayStateID: (stayStateID), receivedStay: (receivedStay)
        }, () => {
            console.log("\n^^^&&& DATE R1: ", this.state.stayDateR1, "\nDATE R2: ", this.state.stayDateR2,  
            "\nSTAY STATE: ", this.state.stayStateID, "\nSTAY CITY: ", this.state.stayCity,
            "\nRATE/NIGHT: ", this.state.stayRatePerNight, "\nDA", this.state.da, 
            "\nRECEIVED STAY: ", this.state.receivedStay)
        })
    }

    colorbox = (color, title, amount, width) => {
        return(
            <View style= {[{backgroundColor:color},styles.multicolorsmallbox, getWidthnHeight(width)]}>
                <Text style = {[{fontStyle:'normal',textAlign:'center', color:'white'}, getMarginTop(0.5)]}>
                    {title}
                </Text>
                <Text style = {[{fontWeight:'bold',textAlign:'center', color:'white', fontSize:16}, styles.boldFont, getMarginTop(0)]}>
                    {amount}
                </Text>
            </View>
        )        
    }

    renderStatusItem = ({item}) => {
        return(
            <View>
                <View style ={[{flexDirection:'row', },getMarginTop(0)]}>
                    <View style={[{color:'black'}, getMarginLeft(2.5), getMarginTop(0.5)]}>  
                        <View style={[{width: '100%',height:30,borderRadius: 30/2, borderWidth:1, justifyContent:'center', borderColor:'#0553BF'}, getMarginTop(1.5), getMarginLeft(1.5)]}>
                            <View style={[{alignItems:'center'}]}>   
                                <FontAwesome name='user-check' size={18} color={'#3480E0'}/>
                            </View>
                        </View>
                    </View>
                    <View style = {[getMarginTop(1), getMarginLeft(4)]}>
                        <View style={[]}>
                            <Text style={[ fontSizeH4()]}>{item.name}</Text>  
                            <View>    
                                <Text numberOfLines={10} style={[fontSizeH4(), getWidthnHeight(60)]}>{item.remark}</Text>
                                <View style ={[getWidthnHeight(25), getMarginLeft(52.5), getMarginTop(-3)]}>
                                    {(item.status === 'New')?
                                    <View style = {[{backgroundColor:'transparent', borderRadius:5, borderWidth:0, borderColor:'red', alignItems:'flex-end'}]}>
                                        <View style={{backgroundColor:'#2F7DE1',borderRadius:5,}}>
                                            <Text style={[{textAlign:'center', margin: '2%' , color:'white', fontWeight:'bold',paddingHorizontal:5}, styles.boldFont, fontSizeH4() ]}>{item.status}</Text> 
                                        </View>
                                    </View> :
                                    <View style = {[{backgroundColor:'transparent', borderRadius:5, borderWidth:0, alignItems:'flex-end'}]}> 
                                        <View style={{backgroundColor:'#3CA73F',borderRadius:5,}}>
                                            <Text style={[{textAlign:'center', margin:"2%" , color:'white', fontWeight:'bold', paddingHorizontal:5}, styles.boldFont, fontSizeH4() ]}>{item.status}</Text> 
                                        </View>
                                    </View>
                                    }  
                                </View>
                            </View> 
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    pre_approval_amount = () => {
        const {details} = this.props.route.params;
        let itineraryTotal = 0;
        details.claims.claim_details.forEach((item) => {
            itineraryTotal += item.amount
        })
        let stayTotal = 0;
        details.claims.claim_stay.forEach((item) => {
            const date1 = moment(item.from_date, "YYYY-MM-DD");
            const date2 = moment(item.to_date, "YYYY-MM-DD");
            const days = date2.diff(date1, 'days');
            stayTotal = Number(stayTotal) + Number(item.da) * ((days === 0)? 1 : (days + 1)) + Number(item.rate_per_night) * ((days === 0)? 1 : days);
            console.log('Compile Number of Days: ', typeof days, days);
        })
        let imprestAmount = details.claims.imprest_taken;
        console.log("SUM ITINERARY: ", itineraryTotal, stayTotal)
        return (
            <View>
                <View style = {[{flexDirection:'row',  marginTop:getMarginTop(1.2).marginTop, justifyContent:'center', alignItems:'center'}, getWidthnHeight(95,5)]}>  
                    <LinearGradient start={{x: 0, y: 0}} end={{x: 0.6, y: 0}} colors={['#0255BF','#1968CF', '#2C7BE0']} style={[{ borderWidth:0, flex:0.5,justifyContent:'center', alignItems:'center'},getWidthnHeight(undefined,5)]}>
                        <TouchableHighlight underlayColor="transparent" onPress= {() => this.setindex('0')}>
                            <Text style={[{textAlign:'center', color:'white'}]}> Pre-Approval Amount </Text>    
                        </TouchableHighlight>
                    </LinearGradient>
                    <TouchableHighlight underlayColor="#DAE7F7" onPress= {() => this.setindex('1')} style={[{ borderWidth:0, flex:0.5, backgroundColor:'#DAE7F7',justifyContent:'center', alignItems:'center'},getWidthnHeight(undefined,5)]}>
                        <Text style={{textAlign:'center'}}> Bank Details </Text> 
                    </TouchableHighlight>
                </View>  
                <View style={[{flexDirection: 'row', borderBottomColor: '#1968CF', borderBottomWidth: 1}, getWidthnHeight(95)]}>
                    <View style={[{borderColor: 'red', borderWidth: 0, alignItems: 'center'}, getWidthnHeight(95/2, 0)]}>
                        <View style={[{position: 'absolute', alignItems: 'center', justifyContent: 'center', borderColor: 'red', borderWidth: 0, transform: [{translateY: -(getWidthnHeight(undefined, 1).height)}]}, getWidthnHeight(95/3, 2)]}>
                            <View style = {[styles.triangleCorner]}/>
                        </View>
                    </View>
                    <View style={[getWidthnHeight(95/2)]}/>
                </View>
                <View style = {[{borderTopWidth:0, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor:'#307FE4'}, getWidthnHeight(95, 9.8)]}>
                    <View style = {{flexDirection:'row'}}>
                        {this.colorbox('#EB3A32', 'Itinerary', (itineraryTotal > 0)? `${"\u20B9"} ${itineraryTotal}/-` : '--' , 29.5)}
                        {this.colorbox('#E68F1B', 'Stay', (stayTotal > 0)? `${"\u20B9"} ${stayTotal}/-` : '--', 29.5)}
                        {this.colorbox('#00B7D9', 'Imprest', (imprestAmount)? `${"\u20B9"} ${imprestAmount}/-` : '--', 29.5)}
                    </View>
                </View>
            </View>
        )
    };
    
    bank_details = () => {
        const {details} = this.props.route.params;
        const bankName = details.approval.user.employee_account.bank.name;
        const empAccount = details.approval.user.employee_account;
        return (
            <View>
                <View style = {[{flexDirection:'row',  marginTop:getMarginTop(1.2).marginTop, justifyContent:'center', alignItems:'center'}, getWidthnHeight(95,5)]}>
                    <TouchableHighlight underlayColor="#DAE7F7" onPress= {() => this.setindex('0')} style={[{ borderWidth:0, flex:0.5, backgroundColor:'#DAE7F7',justifyContent:'center', alignItems:'center'},getWidthnHeight(undefined,5)]}>
                        <Text style={[{textAlign:'center'}]}> Pre-Approval Amount </Text>    
                    </TouchableHighlight>
                    <LinearGradient start={{x: 0, y: 0}} end={{x: 0.4, y: 0}} colors={['#0255BF','#1968CF', '#2C7BE0']} style={[{ borderWidth:0, flex:0.5,justifyContent:'center', alignItems:'center'},getWidthnHeight(undefined,5)]}>
                        <TouchableHighlight underlayColor="transparent" onPress= {() => this.setindex('1')}>
                            <Text style={{textAlign:'center', color:'white'}}> Bank Details </Text> 
                        </TouchableHighlight>
                    </LinearGradient>
                </View>
                <View style={[{flexDirection: 'row', borderBottomColor: '#1968CF', borderBottomWidth: 1}, getWidthnHeight(95)]}>
                    <View style={[{borderColor: 'black', borderWidth: 0}, getWidthnHeight(95/2, 0)]}/>
                    <View style={[{borderColor: 'red', borderWidth: 0, alignItems: 'center'}, getWidthnHeight(95/2, 0)]}>
                        <View style={[{position: 'absolute', alignItems: 'center', justifyContent: 'center', borderColor: 'red', borderWidth: 0, transform: [{translateY: -(getWidthnHeight(undefined, 1).height)}]}, getWidthnHeight(95/3, 2)]}>
                            <View style = {[styles.triangleCorner]}/>
                        </View>
                    </View>
                </View>
                <View style = {[{borderTopWidth:0, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor:'#307FE4'}, getWidthnHeight(95, 18)]}>
                    <View style = {{flexDirection:'row'}}>
                        {this.colorbox('#EB3A32', 'Bank Name', bankName , 45)}
                        {this.colorbox('#E68F1B', 'IFSC', empAccount.ifsc_code, 45)}
                    </View>  
                    {this.colorbox('#00B7D9', 'Account Number', empAccount.bank_account_number ,91.5)}
                </View>
            </View>
        )
    };

    checkErrorsInTravel(){
        const {
            travelData, travelDateTime, conveyanceName, fromCityName, toCityName,
            distance, amount, calculatedAmount, isLocal, fromCityID, toCityID,
            conveyance, conveyanceID, pricePerKM, description, fromState, fromStateID,
            toState, toStateID
        } = this.state;
        this.setState({submitTravel: true})
        let createData = null;
        let data = [];
        const chechError = this.state.checkTravelErrors();
        if(chechError){
            createData = {
                id: moment().valueOf(),
                status: null,
                uniqueID: null,
                date: travelDateTime,
                conveyance: conveyanceName,
                conveyanceID,
                fromState,
                fromStateID,
                from: fromCityName,
                fromCityID,
                toState,
                toStateID,
                to: toCityName,
                toCityID,
                distance: distance,
                amount: (isLocal === 0)? amount : calculatedAmount,
                isLocal: isLocal,
                pricePerKM,
                description
            }
            this.state.travelData.push(createData)
            this.setState({
                submitTravel: false, bounceTravelButton: false, editTravel: false,
                tDateError: true, conveyanceError: true, pricePerKM: 0, travelStatus: '',
                tFromCityError: true, tToCityError: true, editTravelIndex: null,
                tDistanceError: true, amountError: true, travelProgress: 0, travelUniqueID: null,
                travelDateTime: '', conveyanceID: null, conveyanceName: '', 
                fromCityID: null, fromCityName: '', toCityID: null, toCityName: '',
                distance: '', amount: '', isLocal: 0, calculatedAmount: '', distanceTypeCount: 0, 
                amountTypeCount: 0, descriptionTypeCount: 0, description: '', descriptionError: true,
                fromStateID: null, fromState: '', fromStateError: true, fromStateArray: [],
                toStateID: null, toState: '', toStateError: true, toStateArray: []
            }, () => {
                console.log("^^^&&& ITINERARY DATA: ", this.state.travelData.length, this.state.travelData, "\n", typeof createData.id, createData.id)
                this.compileTravelData();
            })
        }else {
            this.setState({enableAlert: true, alertTitle: message, alertColor: true})
        }
    }

    checkErrorsInStayForm(){
        const {
            stayData, stayDate, stayDate2, stateName, stateID, stayCityName, 
            stayRate, foodExpense, stayCityID
        } = this.state;
        this.setState({submitStay: true})
        let createData = null;
        const chechError = this.state.checkStayErrors();
        if(chechError){
            const date1 = moment(stayDate, "DD-MM-YYYY");
            const date2 = moment(stayDate2, "DD-MM-YYYY");
            const days = date2.diff(date1, 'days');
            const checkDate = (stayDate === stayDate2)
            console.log('Calculate Number of Days: ', typeof days, days, checkDate)
            createData = {
                id: moment().valueOf(),
                status: null,
                uniqueID: null,
                date: `${stayDate} - ${stayDate2}`,
                state: stateName,
                stateID: stateID,
                city: stayCityName,
                stayCityID,
                stayRate: stayRate,
                foodExpense: foodExpense,
                calcStayRate: String((stayRate) * ((days === 0)? 1 : (days))),
                calcFoodExpense: String((foodExpense) * ((days === 0)? 1 : (days + 1))),
                date1: stayDate,
                date2: stayDate2
            }
            this.state.stayData.push(createData)
            this.setState({
                submitStay: false, bounceStayButton: false,
                stayDateError: true, stayDateError2: true, 
                stateError: true, stayCityError: true,
                stayRateError: true, foodExpenseError: true, 
                stayDate: '', stayDate2: '', 
                stateID: null, stateName: '', 
                stayCityID: null, stayCityName: '', 
                stayRate: '', foodExpense: '',
                hotelAllowance: null, foodAllowance: null,
                stateWiseCity: [], stayProgress: 0, 
                stayRateCount: 0, foodExpenseCount: 0,
                editStay: false, editStayIndex: null,
                stayStatus: '', stayUniqueID: null
            }, () => {
                console.log("###STAY DATA: ", this.state.stayData.length, this.state.stayData)
                this.compileStayData();
            })
        }else {
            this.setState({enableAlert: true, alertTitle: message, alertColor: true})
        }
    }

    async checkAllErrors(){
        const {switchStay, travelData, stayData, attachedImage, comments} = this.state;
        this.setState({submitClaim: true})
        const checkTravelData = Boolean(travelData.length > 0);
        let checkStayData = true;
        const pollTravel = this.state.checkTravelBlank();
        const pollStay = this.state.checkStayBlank();
        if(pollTravel && checkTravelData){
            this.setState({submitTravel: false, bounceTravelButton: false})
        }else{
            this.bounceSubmitButton();
            this.setState({submitTravel: true, bounceTravelButton: true})
            this.setState({enableAlert: true, alertTitle: 'Please submit your TRAVEL details', alertColor: false})
            return;
        }
        if(switchStay){
            if(pollStay && stayData.length > 0){
                this.setState({submitStay: false, bounceStayButton: false})
                checkStayData = Boolean(stayData.length > 0);
            }else{
                this.bounceSubmitButton();
                this.setState({submitStay: true, bounceStayButton: true})
                this.setState({enableAlert: true, alertTitle: 'Please submit your STAY details', alertColor: false})
                return;
            }
        }
        let isValid = false;
        travelData.findIndex((item) => {
            if(item.isLocal === 0){
                isValid = true;
            }
        })
        if((attachedImage.length === 0 && isValid) || (attachedImage.length === 0 && switchStay)){
            alert("Attach atleast one supporting document")
            return
        }
        if(checkTravelData && pollTravel && checkStayData && comments){
            //alert("success");
            //this.documentsAPI();
            this.checkTotalTravelAmount();
            this.setState({submitClaim: false});
        }else{
            this.setState({enableAlert: true, alertTitle: message, alertColor: true})
        }
    }

    clearTravel(){
        this.setState({submitTravel: false, travelDateTime: '', tDateError: true, conveyanceID: null, conveyanceName: '', conveyanceError: true,
            fromCityID: null, fromCityName: '', tFromCityError: true, toCityID: null, toCityName: '', tToCityError: true, editTravel: false,
            distance: '', tDistanceError: true, amount: '', amountError: true, bounceTravelButton: false, isLocal: 0, editTravelIndex: null, incrementTravel: false,
            pricePerKM: 0, calculatedAmount: '', distanceTypeCount: 0, amountTypeCount: 0, descriptionTypeCount: 0, description: '', descriptionError: true,
            travelProgress: 0, travelStatus: '', travelUniqueID: null, fromStateID: null, fromState: '', fromStateError: true, toStateID: null, toState: '', 
            toStateError: true, fromStateArray: [], toStateArray: []
        })
    }

    clearStay(){
        this.setState({submitStay: false, stayDate: '', stayDate2: '', stayDateError: true, stayDateError2: true, 
            stateID: null, stateName: '', stateError: true, stayCityID: null, stayCityName: '', stayCityError: true, 
            stayRate: '', stayRateError: true, foodExpense: '', foodExpenseError: true, bounceStayButton: false,
            stateWiseCity: [], hotelAllowance: null, foodAllowance: null, editStay: false, editStayIndex: null,
            stayProgress: 0, stayRateCount: 0, foodExpenseCount: 0, stayStatus: '', stayUniqueID: null
        })
    }

    clearDocuments(){
        this.setState({
            fileName: '', fileNameError: true, attachmentError: true, attachmentID: null, editDocumentIndex: null,
            selectedAttachment: '', submitAttachment: false, attachedImageError: true, attachmentName: '',
            editAttachment: false, documentStatus: '', documentUniqueID: null
        })
    }

    checkTotalTravelAmount(){
        const {details} = this.props.route.params;
        let itineraryTotal = 0;
        details.approval.travel_national.forEach((item) => {
            itineraryTotal += item.travel_amount
        })
        let stayTotal = 0;
        details.approval.travel_stay.forEach((item) => {
            const date1 = moment(item.from_date, "YYYY-MM-DD");
            const date2 = moment(item.to_date, "YYYY-MM-DD");
            const days = date2.diff(date1, 'days');
            stayTotal = Number(stayTotal) + Number(item.da) * ((days === 0)? 1 : (days + 1)) + Number(item.rate_per_night) * ((days === 0)? 1 : days);
            console.log('Compile Number of Days: ', typeof days, days);
        })
        let totalPreApprovalAmount = itineraryTotal + stayTotal;
        let totalClaimAmount = this.state.itineraryTotal + this.state.stayTotal;
        if(totalClaimAmount > totalPreApprovalAmount){
            alert(`Total Claim Amount: ${"\u20B9"} ${totalClaimAmount}/-, should not be greater than Pre-Approval Amount: ${"\u20B9"} ${totalPreApprovalAmount}/-.`)
        }else{
            this.saveClaimFormTravel();
        }
    }

    saveClaimFormTravel = async() => {
        const {baseURL, switchStay, switchImprest, incrementIndex, uploadDocument} = this.state;
        const {details} = this.props.route.params;
        const context=this;
        const attachedImage = details.claims.claim_attachments;
        console.log("^^^***### SUBMIT FORM: ", "\n^^^&&& DATE R1: ", this.state.stayDateR1, "\nDATE R2: ", this.state.stayDateR2,  
        "\nSTAY STATEID: ", this.state.stayStateID, "\nSTAY CITY: ", this.state.stayCity, "\nRATE/NIGHT: ", this.state.stayRatePerNight, 
        "\nDA", this.state.da, "\nATTACHED IMAGE ARRAY: ", this.state.attachedImage)
        //return;
        const _this = this;
        this.showLoader();
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_four=permissions_fir.success.secret_token;
        var data = new FormData();
        let stay = (switchStay)? 1 : 0;
        let imprestRequest = (switchImprest)? 1 : 0;
        const travelDate = JSON.stringify(this.state.travelDate);
        const conveyance = JSON.stringify(this.state.conveyance);
        const fromCity = JSON.stringify(this.state.fromCity);
        const toCity = JSON.stringify(this.state.toCity);
        const distanceInKM = JSON.stringify(this.state.distanceInKM);
        const travelAmount = JSON.stringify(this.state.travelAmount);
        const travelDescription = JSON.stringify(this.state.travelDescription);
        const totalTravelAmount = (this.state.itineraryTotal + this.state.stayTotal);
        const receivedTravel = JSON.stringify(this.state.receivedTravel);
        console.log(
            "### TOTAL TRAVEL AMOUNT: ", this.state.itineraryTotal, " + " ,this.state.stayTotal, " = ", totalTravelAmount, 
            "\nRECEIVED TRAVEL: ", receivedTravel, travelDescription)
        data.append('travel_id', details.claims.id);
        data.append('total_travel_amount', totalTravelAmount);
        data.append('travel_type', 2);
        data.append('cover_under_policy', 1);
        data.append('other_financial_approval', 0);
        data.append('travel_date', travelDate);
        data.append('conveyance_id', conveyance)
        data.append('city_id_from_pre', fromCity);
        data.append('city_id_to_pre', toCity);
        data.append('distance_in_km', distanceInKM);
        data.append('amount', travelAmount);
        data.append('description', travelDescription);
        data.append('claim_details', receivedTravel);
        data.append('stay', stay);
        if(stay === 1){
            const receivedStay = JSON.stringify(this.state.receivedStay);
            const stayDateR1 = JSON.stringify(this.state.stayDateR1)
            const stayDateR2 = JSON.stringify(this.state.stayDateR2)
            const stayStateID = JSON.stringify(this.state.stayStateID)
            const stayCity = JSON.stringify(this.state.stayCity)
            const stayRatePerNight = JSON.stringify(this.state.stayRatePerNight)
            const da = JSON.stringify(this.state.da)
            data.append('claim_stays', receivedStay)
            data.append('stay_date_from', stayDateR1);
            data.append('stay_date_to', stayDateR2);
            data.append('state_id_stay', stayStateID);
            data.append('city_id_stay', stayCity);
            data.append('rate_per_night', stayRatePerNight);
            data.append('da', da);
        }
        data.append('comments', this.state.comments)
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function() {
            if(xhr.readyState !== 4){
                return;
            }
            if (xhr.status === 200) {
                console.log('%%%%% SUCCESS %%%%%');
                console.log('RESPONSE: ', xhr.responseText)
                const documentLength = _this.state.uploadDocument.length;
                if(documentLength > 0){
                    var json_obj = JSON.parse(xhr.responseText);
                    _this.setState({claimID: details.claims.id}, () => {
                        console.log("CALLING UPLOAD DOCUMENTS API")
                        _this.documentsAPI();
                    })
                }else{
                    _this.hideLoader();
                    var json_obj = JSON.parse(xhr.responseText);
                    //_this.setState({enableAlert: true, alertTitle: json_obj.message, alertColor: false})
                    Alert.alert("Success!", json_obj.success);
                    this.props.navigation.goBack();
                }
            }else{
                console.log("### ERROR APPROVAL API: ", xhr.responseText)
                var error = xhr.responseText
                _this.hideLoader();
                _this.enableModal(xhr.status, "132");
            }
        });
        xhr.open("POST", `${baseURL}/travel/claim-form-edit/${details.claims.id}`);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Authorization", `Bearer ${permissions_four}`);
        xhr.send(data);
    }

    async documentsAPI(){
        const {baseURL, uploadDocument, incrementIndex, claimID, attachmentUpdated, receivedDocuments} = this.state;
        //this.showLoader();
        const {details} = this.props.route.params;
        console.log("BASEURL: ", `${baseURL}/travel/save-claim-form-attachment`, details.claims.id)
        let sendData = [];
        sendData = (uploadDocument[incrementIndex]);
        const imageObj = {name: sendData[0]['name'], type: sendData[0]['type'], uri: sendData[0]['uri'], size: sendData[0]['size']};
        const imageData = new FormData();
        if(sendData[3] === null && sendData[4] === 0){
            imageData.append('attachment', imageObj);
        }else if(sendData[3] && sendData[4] === 1){
            imageData.append('attachment', imageObj);
        }
        imageData.append('name', sendData[1]);
        imageData.append('type', sendData[2]);
        imageData.append('claim_id', details.claims.id);
        if(sendData[3] !== null){
            imageData.append('claim_attachment_id', sendData[3])
            imageData.append('edited', sendData[4])
        }
        console.log("SEND DATA ARRAY: ", sendData)
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_four=permissions_fir.success.secret_token;
        console.log("SEND DATA: ", imageObj, "\nNAME: ", sendData[1], "\nTYPE: ", sendData[2], "\nCLAIM ID: ", details.claims.id, "\nATTACHMENT ID: ", sendData[3], "\nEDITED: ", sendData[4])
        //return;
        axios.post(`${baseURL}/travel/save-claim-form-attachment`,
        imageData,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+ permissions_four,
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            console.log("### RESPONSE API: ", response.data)
            this.setState({incrementIndex: this.state.incrementIndex + 1}, () => {
                if(this.state.incrementIndex !== uploadDocument.length){
                    console.log("@@@ INCREMENT INDEX: ", this.state.incrementIndex)
                    this.documentsAPI()
                }else{
                    this.hideLoader();
                    this.setState({incrementIndex: 0})
                    Alert.alert("Success!", "Claim saved successfully.")
                    this.props.navigation.goBack();
                }
            })
        }).catch((error) => {
            this.hideLoader();
            console.log("AXIOS ERROR RESPONSE: ", error)
            let status = null;
            if(error.response){
                status = error.response.status;
                this.enableModal(status, '131')
            }else{
                alert(`${error}, API CODE: 131`)
            }
        });
    }

render() {
    const {color} = this.state;
    const {
        travelDateTime, loading, conveyanceType, cities, conveyanceID, fromCityID, toCityID, isLocal, pricePerKM,
        distance, amount, calculatedAmount, animateFontSize, animateTextHeight, animateTextOpacity, travelCategories,
        travelCategoryID, submitTravel, tDateError, conveyanceError, tFromCityError, tToCityError, tDistanceError,
        amountError, conveyanceName, fromCityName, toCityName, submitStay, stayDate, stayDateError, stateName,
        stateID, stateError, stayCityID, stayCityName, stayCityError, stayRate, stayRateError, foodExpense, foodExpenseError,
        projectID, projectName, projectError, save, imprestAmount, imprestAmountError, switchImprest, remarks, remarksError,
        purposeError, travelCategoryError, travelCategoryName, animateSubmitButton, bounceTravelButton, bounceStayButton,
        hotelAllowance, foodAllowance, radioButton1, radioButton2, radioButton3, projects, travelForID, travelForName, travelForError,
        otherPurpose, otherPurposeError, apiError, errorCode, apiCode, stayDate2, stayDateError2, editTravel, editStay, tilData,
        description, descriptionError, incrementTravel, incrementStay, bounceTravelCount, bounceStayCount, attachmentType,
        fileName, fileNameError, attachedImage, attachmentError, submitAttachment, attachmentID, attachmentName, attachedImageError,
        submitClaim, comments, commentsError, editAttachment, showSpinner, travelAttachment, stayAttachment,  fromState, fromStateID, 
        fromStateError, toState, toStateID, toStateError, fromStateArray, toStateArray, travelTimeStamp, travelMinDate, showTravelDatePicker, travelMaxDate,
        fromDate, fromTime, fromMinDate, fromTimeStamp, showFromDatePicker, toDate, toTime, toTimeStamp, showToDatePicker
    } = this.state;
    const animateButton = {
        transform: [{
            scale: animateSubmitButton
        }]
    }
    const fillTravelError = this.state.checkTravelBlank();
    const animateTravelCount = {
        transform: [
            {
                scale: bounceTravelCount
            }
        ],
        color: bounceTravelCount.interpolate({
            inputRange: [1, 1.5],
            outputRange: ['black', (incrementTravel)? '#00A030' : '#EB3A32']
        })
    }
    const travelProgressColor = bounceTravelCount.interpolate({
        inputRange: [1, 1.5],
        outputRange: ['#00A030', (incrementTravel)? '#00A030' : '#EB3A32']
    })
    const scaleTravelCheck = bounceTravelCount.interpolate({
        inputRange: [1, 1.5],
        outputRange: [1, 1.2]
    })
    const fillStayError = this.state.checkStayBlank();
    const animateStayCount = {
        transform: [
            {
                scale: bounceStayCount
            }
        ],
        color: bounceStayCount.interpolate({
            inputRange: [1, 1.5],
            outputRange: ['black', (incrementStay)? '#00A030' : '#EB3A32']
        })
    }
    const stayProgressColor = bounceStayCount.interpolate({
        inputRange: [1, 1.5],
        outputRange: ['#00A030', (incrementStay)? '#00A030' : '#EB3A32']
    })
    const scaleStayCheck = bounceStayCount.interpolate({
        inputRange: [1, 1.5],
        outputRange: [1, 1.2]
    })
    console.log("DETAILS: ", this.state.uploadDocument.length)
    const {details} = this.props.route.params;
    const categoryName = details.approval.travel_category.name;
    let categoryDetail = '';
    if(details.approval.project_id){
        categoryDetail = details.approval.project.name;
    }else if(details.approval.lead_id){
        categoryDetail = details.lead[0]['name'];
    }else if(details.approval.others){
        categoryDetail = details.approval.others;
    }

    let toMinDate = moment(`${stayDate} ${toTime}`, "DD-MM-YYYY hh:mm A").utc().toDate();

    return (
        <View style = {{flex: 1, alignItems: 'center', backgroundColor: 'white'}}>
            <View>
                <IOS_StatusBar color={statusBarGradient} barStyle="light-content"/>
                {/* <WaveHeader
                    wave={Platform.OS ==="ios" ? false : false} 
                    //logo={require('../Image/Logo-164.png')}
                    menu='white'
                    title='Edit Claim Form'
                    headerType = {'small'}
                    menuState = {false}
                    //version={`Version ${this.state.deviceVersion}`}
                /> */}
            </View>
            <View style={[{flex: 1, alignItems: 'center'}, getWidthnHeight(100)]}>
            <View>
            <KeyboardAvoidingView contentContainerStyle={{flex: 1}} behavior={(Platform.OS === 'ios')? "padding" : null} keyboardVerticalOffset={(Platform.OS === 'ios')? 120 : null}> 
            <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps="handled" style={[{zIndex: 1}, getWidthnHeight(100)]} contentContainerStyle={{alignItems: 'center'}}>
            <View style={{alignItems: 'center'}}>     
                <View>    
                    <LinearGradient start={{x: 0, y: 0}} end={{x: 0.4, y: 0}} colors={['#0255BF','#1968CF', '#2C7BE0']} 
                        style = {[{borderTopLeftRadius: 10, borderTopRightRadius: 10}, getWidthnHeight(95, 15.5), getMarginTop(1)]}> 
                        <View style={{alignItems: 'center'}}>  
                            <View style={{position: 'absolute'}}>
                                <View style = {[{flexDirection:'row', justifyContent: 'flex-end'}, getWidthnHeight(90)]}>  
                                    <View style = {[getMarginTop(3.5),]}>
                                        <FontAwesomeIcons name ='plane' size = {getWidthnHeight(12).width} color = {'#4087E3'}/>
                                    </View>
                                    <View style = {[getMarginLeft(4)]}>
                                        <FontAwesomeIcons name ='plane' size = {getWidthnHeight(35).width} color = {'#4087E3'}/>
                                    </View>
                                </View>
                            </View>
                            <ScrollView contentContainerStyle={[{alignItems: 'center'}]} horizontal showsHorizontalScrollIndicator={false} style={[{borderWidth: 0, borderColor: 'red'}, getWidthnHeight(90)]}>
                                <View>
                                    <Text style = {[{fontWeight:'700', color:'white', fontSize:(fontSizeH4().fontSize + 3), fontStyle:'italic'}, styles.boldFont, getMarginTop(0.5)]}>{details.approval.travel_purpose}</Text>
                                    <View style = {[{flexDirection:'row'}, getMarginTop(0.5)]}>
                                        <View style={[{width: getWidthnHeight(6).width,height: getWidthnHeight(6).width,borderRadius: getWidthnHeight(6).width/2, borderWidth:0, backgroundColor:'white', justifyContent:'center'}, getMarginRight(2)]}>  
                                            <View style={[{alignItems:'center'}]}>   
                                                <FontAwesome name='map-marked-alt' size={getWidthnHeight(3.5).width} color={'#3280E2'}/>
                                            </View>
                                        </View>
                                        <Text style = {[{fontWeight:'700', color:'white'}, styles.boldFont, fontSize_H3, getMarginTop(0.2)]}>{categoryName}</Text>
                                        <Text style = {[{color:'white', borderWidth: 0, borderColor: 'white'}, fontSizeH4, getMarginTop(0.2)]}>{(categoryDetail)? `(${categoryDetail})` : ''}</Text>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                        <View>
                            <View style={[{flexDirection: 'row'}, getMarginLeft(3), getMarginTop(1)]}>
                                <Text style = {[{fontWeight:'700', color:'white'}, styles.boldFont, fontSize_H3, getMarginTop(0.2)]}>TC - </Text>
                                <Text numberOfLines={1} style = {[{color:'white', borderWidth: 0, borderColor: 'white'}, fontSizeH4, getMarginTop(0.2), getWidthnHeight(75)]}>{details.approval.travel_code}</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View> 
            
                {(this.state.detailIndex === '0')?
                    this.pre_approval_amount() : 
                    this.bank_details()
                }     
                <View style ={[{flexDirection:'row', alignItems: 'center', justifyContent: 'space-between', marginTop:getMarginTop(2).marginTop},getWidthnHeight(95)]}> 
                    <View style={{justifyContent: 'center'}}>
                        <Text style={[{color:"#3280E4", fontWeight:'bold', textAlignVertical: 'center'}, styles.boldFont, fontSizeH4()]}>ITINERARY DETAILS</Text>
                    </View>
                    <RoundButton 
                        title={(this.state.travelData.length > 0)? `View All (${this.state.travelData.length})` : 'View All'}
                        onPress={()=>this.itinerarytoggle()}
                        gradient={['#3280E4', '#3280E4']}
                        style={[getWidthnHeight(30, 4)]}
                    />
                </View>
                {(this.state.itinerarytoggle)? 
                    <ItineraryDescriptionModal 
                        data={this.state.travelData}
                        status={true}
                        //containerstyle = {{height:getWidthnHeight(undefined,29).height}}
                        editTravelData={(item, index) => this.editTravelData(item, index)}
                        isvisible={this.state.itinerarytoggle}
                        travelTotal={this.state.itineraryTotal}
                        toggle={() => this.itinerarytoggle()}
                        style = {{backgroundColor:'#3180E5'}}
                        iconfirst = {'arrow-right-l'}
                        title = {'Itinerary Details'}
                        textboxtitle = {'Conveyance: '}
                        inputbgStyle = {{backgroundColor:'#DAE7F7'}}
                        iconname_1 = {'route'}
                        iconsize_1 = {getWidthnHeight(4.5).width}
                        iconcolor_1 = {'white'}
                        iconbgColor_1 = {{backgroundColor:'#F48D88'}}
                        textboxplaceholder_1 = {'Distance'}
                        boxcontainerStyle_1 = {{backgroundColor:'#EB3A32'}}
                        iconname_2 = {'money-bill-alt'}
                        iconsize_2 = {getWidthnHeight(4.5).width}
                        iconcolor_2 = {'white'}
                        iconbgColor_2 = {{backgroundColor:'#EAA74E'}}
                        textboxplaceholder_2 = {'Amount'}
                        boxcontainerStyle_2 = {{backgroundColor:'#E58E1B'}}
                        textmarginleft = {[getMarginLeft(4.5)]}
                        deleteItinerary = {(index) => this.travelDataSplice(index)}
                        showSpinner={showSpinner}
                    />
                : 
                    null
                }
                <View style={[styles.bigbox, {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', zIndex: 1}, getWidthnHeight(95)]}>
                    <View>
                        <View style={[{flexDirection:'row', justifyContent: 'space-evenly'}, getWidthnHeight(78)]}>
                            {/* <DateSelector 
                                containerStyle={[{
                                    borderColor: (submitTravel && tDateError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: 1,
                                    borderStyle: (submitTravel && tDateError)? 'dashed' : 'solid', borderWidth: (submitTravel && tDateError)? 2 : 1,
                                    }, getWidthnHeight(37, 7), getMarginTop(1.5), getMarginLeft(0)]}
                                //style={[(travelDateTime === '')? {borderWidth: 0, borderColor: 'green', width: getWidthnHeight(42).width} : {width: getWidthnHeight(37).width}]}
                                style={[{borderWidth: 0, borderColor: 'green', width: getWidthnHeight(37).width}]}
                                date={this.state.travelDateTime}
                                maxDate={moment().toDate()}
                                dateFont={{fontSize: (fontSizeH4().fontSize + 1)}}
                                androidMode='default'
                                mode='date'
                                placeholder='Date'
                                format='DD-MM-YYYY' 
                                onDateChange={(date) => {
                                    if(this.state.travelDateTime === ''){
                                        this.setTravelProgress(() => {})
                                    }
                                    this.setState({travelDateTime: (date), tDateError: false})
                                }}
                            /> */}
                            <View style={[{borderColor: 'red', borderWidth: 0}, getMarginTop(1.5), getMarginLeft(0), getWidthnHeight(37, 7)]}>
                                <TouchableOpacity 
                                    onPress={() => this.setState({showTravelDatePicker: !showTravelDatePicker})}
                                >
                                    <View 
                                        style={[{
                                            alignItems: 'center', justifyContent: 'center', borderRadius: 5, 
                                            borderColor: (submitTravel && tDateError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: 1,
                                            borderStyle: (submitTravel && tDateError)? 'dashed' : 'solid', borderWidth: (submitTravel && tDateError)? 2 : 1
                                        }, getWidthnHeight(37, 7)]}>
                                        <Text style={[{color: (travelDateTime)? '#000000' : '#C4C4C4', fontSize: (fontSizeH4().fontSize + 2)}]}>{travelDateTime || 'Select Date'}</Text>
                                    </View>
                                </TouchableOpacity>
                                {(showTravelDatePicker) && (
                                    <DateTimePicker 
                                        styleBox={{flex: 1}}
                                        date={moment(travelTimeStamp).utc().toDate()}
                                        androidMode='default'
                                        mode='date'
                                        is24Hour={false}
                                        placeholder='Select Date'
                                        format='DD-MM-YYYY'
                                        minDate={travelMinDate}
                                        maxDate={travelMaxDate}
                                        onDateChange={(event, newDate) => {
                                            if(event.type === "dismissed"){
                                                this.setState({showTravelDatePicker: !showTravelDatePicker})
                                                return;
                                            }
                                            this.setState({showTravelDatePicker: !showTravelDatePicker}, () => {
                                                if(this.state.travelDateTime === ''){
                                                    this.setTravelProgress(() => {})
                                                }
                                            })
                                            const travelTimeStamp = event.nativeEvent.timestamp;
                                            this.setState({
                                                travelDateTime: moment(newDate).format("DD-MM-YYYY"), travelTimeStamp,
                                                tDateError: false,
                                            });
                                            Keyboard.dismiss();
                                        }} 
                                    />
                                )}
                            </View>
                            <View style={[{
                                borderColor: (submitTravel && conveyanceError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: 1,
                                borderStyle: (submitTravel && conveyanceError)? 'dashed' : 'solid', borderWidth: (submitTravel && conveyanceError)? 2 : 1,
                            }, getWidthnHeight(37, 7), getMarginTop(1.5)]}>
                                <Dropdown
                                    containerStyle={[{justifyContent: 'center', borderColor: 'grey', borderWidth: 0, paddingLeft: 0, borderRadius: 10, marginTop:-5}, getWidthnHeight(37, 7)]}
                                    maxLength = {24}
                                    inputContainerStyle={[{borderBottomWidth:0, marginTop:4, alignSelf: 'center'}, getWidthnHeight(35, 7)]}
                                    label={'Conveyance Type*'}
                                    labelFontSize={fontSizeH4().fontSize - 2}
                                    data={conveyanceType}
                                    valueExtractor={({id})=> id}
                                    labelExtractor={({name})=> name}
                                    onChangeText={(conveyanceID, index, data) => {
                                        console.log("### GET DETAILS: ", index, data[index]['name'])
                                        if(this.state.conveyanceName === ''){
                                            this.setTravelProgress(() => {});
                                        }
                                        this.setState({ 
                                            conveyanceName: data[index]['name'],
                                            conveyanceID, conveyanceError: false,
                                            isLocal: data[index]['islocal'],
                                            pricePerKM: data[index]['price_per_km'] 
                                        }, () => {
                                            const {isLocal, distance, pricePerKM} = this.state;
                                            console.log("CONVEYANCE: ", this.state.conveyanceID, this.state.isLocal, this.state.pricePerKM)
                                            if(isLocal === 0){
                                                const {amount, tDistanceError} = this.state;
                                                if(!tDistanceError){
                                                    this.resetTravelProgress()
                                                }
                                                this.setState({calculatedAmount: null, distance: '', tDistanceError: true, distanceTypeCount: 0})
                                                if(!amount){
                                                    this.setState({amountError: true})
                                                }
                                            }else if(isLocal === 1){
                                                if(!amountError){
                                                    this.resetTravelProgress()
                                                }
                                                this.setState({calculatedAmount: String(distance * pricePerKM), amountError: true, amount: '', amountTypeCount: 0})
                                            }
                                        })
                                    }}
                                    value={conveyanceName}
                                    baseColor = {(conveyanceID)? colorTitle : 'grey'}
                                    pickerStyle={[getWidthnHeight(37), getMarginTop(10)]}
                                    fontSize = {fontSizeH4().fontSize - 1}
                                />
                            </View> 
                        </View> 
                        <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', ...Platform.select({ios: { zIndex: 3 }})}, getMarginTop(1.5), getWidthnHeight(78)]}>
                            <SearchableDropDown 
                                placeholder="State (from)*"
                                data={this.state.stateData}
                                value={this.state.fromState}
                                style={[{
                                    borderColor: (submitTravel && fromStateError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: 1,
                                    borderStyle: (submitTravel && fromStateError)? 'dashed' : 'solid', borderWidth: (submitTravel && fromStateError)? 2 : 1,
                                }, getWidthnHeight(37, 7)]}
                                searchStyle={[getWidthnHeight(31, 7)]}
                                dropDownSize={[getWidthnHeight(37, 20)]}
                                textBoxSize={[getWidthnHeight(37, 4)]}
                                iconSize={getWidthnHeight(6).width}
                                onChangeText={(id, name, index, data) => {
                                    if(this.state.fromState === ''){
                                        this.setTravelProgress(() => {});
                                    }
                                    if(fromCityName){
                                        this.resetTravelProgress();
                                    }
                                    this.setState({
                                        fromStateID: id, fromState: name, fromStateError: false,
                                        fromCityID: null, fromCityName: '', tFromCityError: true, stateWiseCity: []
                                    }, async() => {
                                        //console.log("FROM STATE: ", this.state.fromStateID, this.state.fromState, "\n", index, data)
                                        await this.cities(this.state.fromStateID, 'fromState');
                                    })
                                }}
                            />
                            <SearchableDropDown 
                                placeholder="City (from)*"
                                data={fromStateArray}
                                value={this.state.fromCityName}
                                disabled={(fromStateID)? false : true}
                                style={[{
                                    borderColor: (submitTravel && tFromCityError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: 1,
                                    borderStyle: (submitTravel && tFromCityError)? 'dashed' : 'solid', borderWidth: (submitTravel && tFromCityError)? 2 : 1,
                                }, getWidthnHeight(37, 7)]}
                                searchStyle={[getWidthnHeight(31, 7)]}
                                dropDownSize={[getWidthnHeight(37, 20)]}
                                textBoxSize={[getWidthnHeight(37, 4)]}
                                iconSize={getWidthnHeight(6).width}
                                onChangeText={(id, name, index, data) => {
                                    if(this.state.fromCityName === ''){
                                        this.setTravelProgress(() => {});
                                    }
                                    this.setState({fromCityID: id, fromCityName: name, tFromCityError: false}, () => {
                                        //console.log("FROM STATE: ", this.state.fromCityID, this.state.fromCityName)
                                    })
                                }}
                            />
                        </View> 
                        <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', ...Platform.select({ios: { zIndex: 2 }})}, getMarginTop(1.5), getWidthnHeight(78)]}>
                            <SearchableDropDown 
                                placeholder="State (to)*"
                                data={this.state.stateData}
                                value={this.state.toState}
                                style={[{
                                    borderColor: (submitTravel && toStateError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: 1,
                                    borderStyle: (submitTravel && toStateError)? 'dashed' : 'solid', borderWidth: (submitTravel && toStateError)? 2 : 1,
                                }, getWidthnHeight(37, 7)]}
                                searchStyle={[getWidthnHeight(31, 7)]}
                                dropDownSize={[getWidthnHeight(37, 20)]}
                                textBoxSize={[getWidthnHeight(37, 4)]}
                                iconSize={getWidthnHeight(6).width}
                                onChangeText={(id, name, index, data) => {
                                    if(this.state.toState === ''){
                                        this.setTravelProgress(() => {});
                                    }
                                    if(toCityName){
                                        this.resetTravelProgress();
                                    }
                                    this.setState({
                                        toStateID: id, toState: name, toStateError: false,
                                        toCityID: null, toCityName: '', tToCityError: true, stateWiseCity: []
                                    }, async() => {
                                        //console.log("FROM STATE: ", this.state.toStateID, this.state.toState, "\n", index, data)
                                        await this.cities(this.state.toStateID, 'toState');
                                    })
                                }}
                            />
                            <SearchableDropDown 
                                placeholder="City (to)*"
                                data={toStateArray}
                                value={this.state.toCityName}
                                disabled={(toStateID)? false : true}
                                style={[{
                                    borderColor: (submitTravel && tToCityError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: 1,
                                    borderStyle: (submitTravel && tToCityError)? 'dashed' : 'solid', borderWidth: (submitTravel && tToCityError)? 2 : 1,
                                }, getWidthnHeight(37, 7)]}
                                searchStyle={[getWidthnHeight(31, 7)]}
                                dropDownSize={[getWidthnHeight(37, 20)]}
                                textBoxSize={[getWidthnHeight(37, 4)]}
                                iconSize={getWidthnHeight(6).width}
                                onChangeText={(id, name, index, data) => {
                                    if(this.state.toCityName === ''){
                                        this.setTravelProgress(() => {});
                                    }
                                    this.setState({toCityID: id, toCityName: name, tToCityError: false}, () => {
                                        //console.log("FROM STATE: ", this.state.fromCityID, this.state.fromCityName)
                                    })
                                }}
                            />
                        </View>
                        <View style={[{flexDirection:'row', justifyContent: 'space-evenly'}, getMarginTop(1.5), getWidthnHeight(78)]}>
                            <View style={[getWidthnHeight(37, 7)]}>
                                <CustomTextInput 
                                    placeholder=" Distance (in k.m)* "
                                    value={this.state.distance}
                                    prefillEnable={(editTravel)? true : false}
                                    inactiveTitleFontSize={fontSizeH4().fontSize + 1}
                                    inactiveTitleHeight={getWidthnHeight(undefined, 3).height}
                                    activeTitleFontSize={fontSizeH4().fontSize - 3}
                                    onChangeText={(distance) => {
                                        const {isLocal, pricePerKM} = this.state;
                                        const number = distance.replace(/[^0-9]/g, '')
                                        this.setState({distance: number.trim()}, () => {
                                            const {distance} = this.state;
                                            if(distance === ''){
                                                this.setState({tDistanceError: true})
                                                if(this.state.distanceTypeCount > 0){
                                                    this.setState({distanceTypeCount: 0}, () => this.resetTravelProgress())
                                                }
                                            }else{
                                                this.setState({tDistanceError: false}, async() => {
                                                    console.log("DISTANCE TYPE COUNT: ", this.state.distanceTypeCount)
                                                    if(this.state.distanceTypeCount === 0){
                                                        console.log("DISTANCE TYPE COUNT***: ", this.state.distanceTypeCount)
                                                        this.setTravelProgress((finished) => {
                                                            if(finished){
                                                                this.setState({distanceTypeCount: this.state.distanceTypeCount + 1})
                                                            }
                                                        });
                                                    }
                                                })
                                            }
                                        })
                                        if(isLocal === 1 && distance > 0){
                                            this.setState({calculatedAmount: String(distance * pricePerKM), amountError: true, amount: ''})
                                        }else{
                                            this.setState({calculatedAmount: null})
                                        }
                                    }}
                                    keyboardType = {'numeric'}
                                    editable={(isLocal === 0)? false : true}
                                    containerStyle={[{
                                        borderColor: ( isLocal === 1 && submitTravel && tDistanceError)? 'red' : '#C4C4C4',
                                        borderStyle: ( isLocal === 1 && submitTravel && tDistanceError)? 'dashed' : 'solid',
                                        borderWidth: ( isLocal === 1 && submitTravel && tDistanceError)? 2 : 1, borderRadius: 1,
                                        backgroundColor: (isLocal === 0)? 'rgba(0,0,0,0.15)' : 'white', 
                                        justifyContent: 'center', alignItems: 'stretch'
                                    }, getWidthnHeight(37, 7)]}
                                    textInputStyle={[{borderColor: 'black', borderWidth: 0, fontSize: fontSizeH4().fontSize + 3}]}
                                    inactiveTitleColor='dimgrey'
                                    activeTitleColor={colorTitle}
                                />
                            </View>
                            <View style={[{borderColor: 'black', borderWidth: 0}, getWidthnHeight(37, 7)]}>
                                {(isLocal === 0)?
                                    <CustomTextInput 
                                        placeholder=" Amount "
                                        value={amount}
                                        prefillEnable={(editTravel)? true : false}
                                        inactiveTitleFontSize={fontSizeH4().fontSize + 1}
                                        inactiveTitleHeight={getWidthnHeight(undefined, 3).height}
                                        activeTitleFontSize={fontSizeH4().fontSize - 3}
                                        onChangeText={(amount) => {
                                            const number = amount.replace(/[^0-9]/g, '')
                                                this.setState({amount: number.trim()}, () => {
                                                    const {amount, amountTypeCount} = this.state;
                                                    if(amount === ''){
                                                        this.setState({amountError: true})
                                                        if(this.state.amountTypeCount > 0){
                                                            this.setState({amountTypeCount: 0}, () => this.resetTravelProgress())
                                                        }
                                                    }else{
                                                        this.setState({amountError: false}, async() => {
                                                            console.log("AMOUNT TYPE COUNT: ", this.state.amountTypeCount)
                                                            if(this.state.amountTypeCount === 0){
                                                                console.log("AMOUNT TYPE COUNT***: ", this.state.amountTypeCount)
                                                                this.setTravelProgress((finished) => {
                                                                    if(finished){
                                                                        this.setState({amountTypeCount: this.state.amountTypeCount + 1})
                                                                    }
                                                                });
                                                            }
                                                        })
                                                    }
                                                })
                                        }}
                                        keyboardType = {'numeric'}
                                        containerStyle={[{
                                            borderColor: (isLocal === 0 && submitTravel && amountError)? 'red' : '#C4C4C4',
                                            borderStyle: (isLocal === 0 && submitTravel && amountError)? 'dashed' : 'solid',
                                            borderWidth: (isLocal === 0 && submitTravel && amountError)? 2 : 1, borderRadius: 1,
                                            justifyContent: 'center', alignItems: 'stretch'
                                        }, getWidthnHeight(37, 7)]}
                                        textInputStyle={[{borderColor: 'black', borderWidth: 0, fontSize: fontSizeH4().fontSize + 3}]}
                                        inactiveTitleColor='dimgrey'
                                        activeTitleColor={colorTitle}
                                    />
                                :
                                    <View>
                                        <CustomTextInput 
                                            placeholder=" Amount "
                                            value={(calculatedAmount)? `${calculatedAmount}` : ''}
                                            prefillEnable={(calculatedAmount)? true : false}
                                            inactiveTitleFontSize={fontSizeH4().fontSize + 1}
                                            inactiveTitleHeight={getWidthnHeight(undefined, 3).height}
                                            activeTitleFontSize={fontSizeH4().fontSize - 3}
                                            editable={false}
                                            containerStyle={[{
                                                borderColor: '#C4C4C4',
                                                borderWidth: 1,
                                                backgroundColor: 'rgba(0,0,0,0.15)',
                                                justifyContent: 'center', alignItems: 'stretch'
                                            }, getWidthnHeight(37, 7)]}
                                            textInputStyle={[{borderColor: 'black', borderWidth: 0, fontSize: (fontSizeH4().fontSize + 3), color: 'black'}]}
                                            inactiveTitleColor='dimgrey'
                                            activeTitleColor={colorTitle}
                                        />
                                    </View>
                                }
                            </View>  
                        </View>
                        <View style={[getMarginTop(1.5), getWidthnHeight(78), {alignItems: 'center'}]}>
                            <CustomTextInput 
                                placeholder=" Description "
                                value={description}
                                prefillEnable={(editTravel)? true : false}
                                inactiveTitleFontSize={fontSizeH4().fontSize + 1}
                                inactiveTitleHeight={getWidthnHeight(undefined, 3).height}
                                activeTitleFontSize={fontSizeH4().fontSize - 3}
                                onChangeText={(description) => {
                                    this.setState({description: description.trimLeft()}, () => {
                                        const {description} = this.state;
                                        if(description === ''){
                                            this.setState({descriptionError: true})
                                            if(this.state.descriptionTypeCount > 0){
                                                this.setState({descriptionTypeCount: 0}, () => this.resetTravelProgress())
                                            }
                                        }else{
                                            this.setState({descriptionError: false}, () => {
                                                const {descriptionTypeCount} = this.state;
                                                if(descriptionTypeCount === 0){
                                                    this.setTravelProgress((finished) => {
                                                        if(finished){
                                                            this.setState({descriptionTypeCount: descriptionTypeCount + 1})
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }}
                                containerStyle={[{
                                    borderColor: (submitTravel && descriptionError)? 'red' : '#C4C4C4',
                                    borderStyle: (submitTravel && descriptionError)? 'dashed' : 'solid',
                                    borderWidth: (submitTravel && descriptionError)? 2 : 1, borderRadius: 1,
                                    justifyContent: 'center', alignItems: 'stretch'
                                }, getWidthnHeight(75, 7)]}
                                textInputStyle={[{borderColor: 'black', borderWidth: 0, fontSize: fontSizeH4().fontSize + 3}]}
                                inactiveTitleColor='dimgrey'
                                activeTitleColor={colorTitle}
                            />
                        </View> 
                        <View style={[{flexDirection: 'row'}, getWidthnHeight(78)]}>
                            <View style={[{borderColor: 'red', borderWidth: 0}, getWidthnHeight(30)]}/>
                            <Animated.View style={[{alignItems: 'center', justifyContent: 'center', borderWidth: 0, borderColor: 'red'}, getMarginVertical(1.5), (bounceTravelButton)? animateButton : null]}>
                                <TouchableOpacity 
                                    style={[{flexDirection:'row', justifyContent: 'center'}, getWidthnHeight(30)]} 
                                    onPress={() => {
                                        if(editTravel){
                                            this.saveTravelChanges();
                                        }else{
                                            this.checkErrorsInTravel()
                                        }
                                    }}
                                >
                                    <View style={[{justifyContent: 'center', alignItems: 'center', backgroundColor:'#3280E4',borderRightWidth:2, borderRightColor:'white', borderTopLeftRadius:10, borderBottomLeftRadius:10}, getWidthnHeight(4,5)]}/>
                                    <View style={[{ justifyContent: 'center', alignItems: 'center', backgroundColor:'#3280E4'}, getWidthnHeight(20,5)]}>
                                        <Text style = {[{color:'white', fontWeight:"bold", fontSize: fontSizeH4().fontSize + 1}, styles.boldFont]}>{(editTravel)? 'DONE' : 'ADD'}</Text>
                                    </View>
                                    <View style={[{justifyContent: 'center', alignItems: 'center', backgroundColor:'#3280E4',borderLeftWidth:2, borderLeftColor:'white', borderTopRightRadius:10, borderBottomRightRadius:10}, getWidthnHeight(4,5)]}/>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                    </View>
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <View style={{width: getWidthnHeight(14).width, height: getWidthnHeight(14).width, borderColor: 'red', borderWidth: 0, alignItems: 'center', justifyContent: 'center'}}>
                            <AnimatedCircularProgress
                                size={Math.floor(getWidthnHeight(13).width)}
                                width={getWidthnHeight(1).width}
                                //fill={this.state.travelDateTime === '' && this.state.conveyance == '' && this.state.city_from == '' && this.state.city_to == '' && this.state.Distance == '' && this.state.Amount == ''  ? 0: this.state.progress > 15 ? this.state.progress : 0}
                                fill={(fillTravelError && (this.state.travelProgress === 0))? 0 : this.state.travelProgress}
                                tintColor={travelProgressColor}
                                backgroundColor="#D1D2D4"
                            >
                                {(fill) => (
                                    <View>
                                        {(fillTravelError && this.state.travelProgress === 0)?
                                            <Text>{'0'}</Text>
                                        :
                                            <View>
                                                {(this.state.travelProgress < 100)?
                                                    <View>
                                                        <Animated.Text style={[animateTravelCount]}>
                                                            {Math.round(this.state.travelProgress)}
                                                        </Animated.Text>
                                                    </View>
                                                :
                                                    <Animated.View style={{transform: [{scale: scaleTravelCheck}]}}>
                                                        <FontAwesomeIcons name={'check-circle'} size={getWidthnHeight(10).width} color={'#00A030'}/>
                                                    </Animated.View>
                                                }
                                            </View>
                                        }
                                    </View>
                                    )
                                }
                            </AnimatedCircularProgress>
                        </View>
                        <View style = {[getMarginTop(1)]}>
                            <TouchableOpacity onPress = {this.onClickDelete}>
                                {(fillTravelError && submitTravel)?
                                    <AnimatedCircularProgress
                                        size={Math.floor(getWidthnHeight(13).width)}
                                        width={getWidthnHeight(1).width}
                                        //fill={this.state.travelDateTime === '' && this.state.conveyance == '' && this.state.city_from == '' && this.state.city_to == '' && this.state.Distance == '' && this.state.Amount == '' ? 0 : 100}
                                        fill={100}
                                        tintColor="#EB3A32"
                                        backgroundColor="#D1D2D4">
                                        {
                                        (fill) => (
                                            <View>
                                                <Icons name={'delete'} size={getWidthnHeight(10).width} color={'#EB3A32'}/>
                                            </View>
                                        )
                                        }
                                    </AnimatedCircularProgress>
                                :  
                                    <AnimatedCircularProgress
                                        size={Math.floor(getWidthnHeight(13).width)}
                                        width={getWidthnHeight(1).width}
                                        //fill={this.state.travelDateTime === '' && this.state.conveyance == '' && this.state.city_from == '' && this.state.city_to == '' && this.state.Distance == '' && this.state.Amount == '' ? 0 : 100}
                                        fill={(fillTravelError)? 0 : 100}
                                        tintColor="#EB3A32"
                                        backgroundColor="#D1D2D4">
                                        {
                                        (fill) => (
                                            <View>
                                            {(fillTravelError)?
                                                <Icons name={'delete'} size={getWidthnHeight(10).width} color={'#D1D2D4'}/>
                                            :
                                                <Icons name={'delete'} size={getWidthnHeight(10).width} color={'#EB3A32'}/>
                                            }
                                            </View>
                                        )
                                        }
                                    </AnimatedCircularProgress>
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                </View> 
                {/* End Big Box */} 
                {/* {(!this.state.hideStay) &&  
                    <View>
                        <View style = {[{borderWidth:0, borderColor:'#487DCB', backgroundColor:'#DCDCDC'}, getWidthnHeight(95,0.2), getMarginTop(1.5)]}/>
                        <View style={[getWidthnHeight(100)]}>
                            <MySwitch
                                title = 'Stay*'
                                value={this.state.switchStay}
                                onValueChange ={(switchStay)=>this.setState({
                                    switchStay, stayData: [], stayDateR1: [], stayDateR2: [], 
                                    stayCity: [], stayRatePerNight: [], da: [], stayTotal: 0
                                },()=>{
                                    console.log('switchValue:',switchStay)
                                    this.clearStay()
                                })}
                                disabled={false}
                            />
                        </View>
                    </View>
                } */}
                {(this.state.switchStay)?
                    <View style = {[{alignItems:'center', justifyContent:'center'}, getMarginTop(1), getWidthnHeight(100)]}>
                    <View style ={[{flexDirection:'row', justifyContent: 'space-between'},getWidthnHeight(95)]}> 
                        <View style={[{alignItems:'flex-start', marginTop:getMarginTop(2).marginTop}]}>
                            <Text style={[{color:"#3280E4", fontWeight:'bold'}, styles.boldFont, fontSizeH4()]}>STAY DETAILS</Text>
                        </View>
                        <View style={[{borderColor: colorBase,}]}/>
                            <RoundButton 
                                title={(this.state.stayData.length === 0)? "View All" : `View All (${this.state.stayData.length})`}
                                onPress={()=>this.staytoggle()}
                                gradient={['#3280E4', '#3280E4']}
                                style={[getWidthnHeight(30, 4), getMarginTop(1),getMarginLeft(3)]}
                            />
                    </View>
                    {(this.state.staytoggle)? 
                        <StayModal 
                            containerstyle = {{height:getWidthnHeight(undefined,25).height}}
                            data={this.state.stayData}
                            status={true}
                            isvisible={this.state.staytoggle}
                            stayTotal={this.state.stayTotal}
                            editStayData={(item, index) => this.editStayData(item, index)}
                            toggle={() => this.staytoggle()}
                            style = {{backgroundColor:'#3180E5'}}
                            title = {'Stay Details'}
                            inputbgStyle = {{backgroundColor:'#DAE7F7'}}
                            iconname_1 = {'bed'}
                            iconsize_1 = {getWidthnHeight(4.5).width}
                            iconcolor_1 = {'white'}
                            iconbgColor_1 = {{backgroundColor:'#F48D88'}}
                            textboxplaceholder_1 = {'Stay Exp'}
                            boxcontainerStyle_1 = {{backgroundColor:'#EB3A32'}}
                            iconname_2 = {'hand-holding-usd'}
                            iconsize_2 = {getWidthnHeight(4.5).width}
                            iconcolor_2 = {'white'}
                            iconbgColor_2 = {{backgroundColor:'#EAA74E'}}
                            textboxplaceholder_2 = {'Food Exp'}
                            boxcontainerStyle_2 = {{backgroundColor:'#E58E1B'}}
                            textmarginleft = {[getMarginLeft(4.5)]}
                            deleteItinerary = {(index) => this.stayDataSplice(index)}
                            showSpinner={showSpinner}
                        />
                    : 
                        null
                    }
                    <View style={[styles.bigbox, {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', zIndex: 1}, getWidthnHeight(95, 33)]}>
                        <View>
                        <View style={[{flexDirection:'row', justifyContent: 'space-evenly'}, getWidthnHeight(78)]}>
                            {/* <DateSelector 
                                containerStyle={[{
                                    borderColor: (submitStay && stayDateError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: 1,
                                    borderStyle: (submitStay && stayDateError)? 'dashed' : 'solid', borderWidth: (submitStay && stayDateError)? 2 : 1,
                                    }, getWidthnHeight(37, 7), getMarginTop(1.5)]}
                                //style={[(stayDate === '')? {borderWidth: 0, borderColor: 'green', width: getWidthnHeight(42).width} : {fontSize: 12, width: getWidthnHeight(35).width}]}
                                style={[{borderWidth: 0, borderColor: 'green', width: getWidthnHeight(37).width}]}
                                date={this.state.stayDate}
                                //clearDate={(stayDate === '')? false : true}
                                //onPress={() => this.setState({stayDate: ''})}
                                maxDate={moment().toDate()}
                                dateFont={{fontSize: (fontSizeH4().fontSize + 1)}}
                                androidMode='default'
                                mode='date'
                                placeholder='From Date'
                                format='DD-MM-YYYY'
                                onDateChange={(date) => {
                                    if(this.state.stayDate === ''){
                                        this.setStayProgress(() => {})
                                    }
                                    const currentTimeStamp = moment().valueOf();
                                    const addTime = moment(currentTimeStamp).add(1, 'second').format('hh:mm:ss A')
                                    const selectedTimeStamp = moment(`${date} ${addTime}`, "DD-MM-YYYY hh:mm:ss A").valueOf();
                                    const date2AddTime = moment(currentTimeStamp).add(2, 'seconds').format('hh:mm:ss A');
                                    let date2TimeStamp = moment(`${stayDate2} ${date2AddTime}`, "DD-MM-YYYY hh:mm:ss A").valueOf();
                                    //console.log(selectedTimeStamp, date2TimeStamp, moment(selectedTimeStamp).format("DD-MM-YYYY"), moment(date2TimeStamp).format("DD-MM-YYYY"), Boolean(date2TimeStamp))
                                    this.setState({stayDate: date, stayDateError: false})
                                    if(selectedTimeStamp > date2TimeStamp && date2TimeStamp){
                                        this.resetStayProgress();
                                        this.setState({stayDate2: '', stayDateError2: true})
                                    }
                                }}
                            /> */}
                            <View style={[getWidthnHeight(37, 7), getMarginTop(1.5)]}>
                                <TouchableOpacity 
                                    onPress={() => this.setState({showFromDatePicker: !showFromDatePicker})}
                                >
                                    <View 
                                        style={[{
                                            alignItems: 'center', justifyContent: 'center',
                                            borderColor: (submitStay && stayDateError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: 1,
                                            borderStyle: (submitStay && stayDateError)? 'dashed' : 'solid', borderWidth: (submitStay && stayDateError)? 2 : 1
                                        }, getWidthnHeight(37, 7)]}>
                                        <Text style={[{color: (stayDate)? '#000000' : '#C4C4C4', fontSize: (fontSizeH4().fontSize + 2)}]}>{stayDate || 'From Date'}</Text>
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
                                        format='DD-MM-YYYY'
                                        minDate={travelMinDate}
                                        maxDate={travelMaxDate}
                                        onDateChange={(event, newDate) => {
                                            if(event.type === "dismissed"){
                                                this.setState({showFromDatePicker: !showFromDatePicker})
                                                return;
                                            }
                                            this.setState({showFromDatePicker: !showFromDatePicker}, () => {
                                                if(this.state.stayDate === ''){
                                                    this.setStayProgress(() => {})
                                                }
                                            })
                                            const { toTimeStamp } = this.state;
                                            const fromTimeStamp = event.nativeEvent.timestamp;
                                            //console.log('From Date: ', fromTimeStamp, ">", toTimeStamp, "=", fromTimeStamp > toTimeStamp)
                                            if(toTimeStamp){
                                                if(fromTimeStamp > toTimeStamp){
                                                    this.setState({
                                                        stayDate2: moment(newDate).format("DD-MM-YYYY"), stayDateError2: false, 
                                                        toTimeStamp: fromTimeStamp, showToDatePicker: false
                                                    }, () => {});
                                                }
                                            }
                                            this.setState({
                                                stayDate: moment(newDate).format("DD-MM-YYYY"), fromTimeStamp, 
                                                stayDateError: false
                                            }, () => {});
                                            Keyboard.dismiss();
                                        }} 
                                    />
                                )}
                            </View> 
                            <View style={[getWidthnHeight(37, 7), getMarginTop(1.5)]}>
                                <TouchableOpacity 
                                    disabled={(stayDateError)? true : false}
                                    onPress={() => this.setState({showToDatePicker: !showToDatePicker})}
                                >
                                    <View 
                                        style={[{
                                            alignItems: 'center', justifyContent: 'center',
                                            borderColor: (submitStay && stayDateError2)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: 1,
                                            borderStyle: (submitStay && stayDateError2)? 'dashed' : 'solid', borderWidth: (submitStay && stayDateError2)? 2 : 1,
                                        }, getWidthnHeight(37, 7)]}>
                                        <Text style={[{color: (stayDate2)? '#000000' : '#C4C4C4', fontSize: (fontSizeH4().fontSize + 2)}]}>{stayDate2 || 'To Date'}</Text>
                                    </View>
                                </TouchableOpacity>
                                {(showToDatePicker) && (
                                    <DateTimePicker 
                                        styleBox={{flex: 1}}
                                        date={moment(toTimeStamp).utc().toDate()}
                                        // disabled={(stayDateError)? true : false}
                                        androidMode='default'
                                        mode='date'
                                        is24Hour={false}
                                        placeholder='Select Date'
                                        format='DD-MM-YYYY'
                                        minDate={toMinDate}
                                        maxDate={travelMaxDate}
                                        onDateChange={(event, newDate) => {
                                            if(event.type === "dismissed"){
                                                this.setState({showToDatePicker: !showToDatePicker})
                                                return;
                                            }
                                            console.log('##$$!!! To Date: ', moment(newDate).format("DD-MM-YYYY"), event)
                                            this.setState({showToDatePicker: !showToDatePicker}, () => {
                                                if(this.state.stayDate2 === ''){
                                                    this.setStayProgress(() => {})
                                                }
                                                this.setState({
                                                    stayDate2: moment(newDate).format("DD-MM-YYYY"), 
                                                    toTimeStamp: event.nativeEvent.timestamp, stayDateError2: false
                                                }, () => {});
                                            });
                                            Keyboard.dismiss();
                                        }} 
                                    />
                                )}
                            </View>
                            {/* <DateSelector 
                                containerStyle={[{
                                    borderColor: (submitStay && stayDateError2)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: 1,
                                    borderStyle: (submitStay && stayDateError2)? 'dashed' : 'solid', borderWidth: (submitStay && stayDateError2)? 2 : 1,
                                    }, getWidthnHeight(37, 7), getMarginTop(1.5)]}
                                //style={[(stayDate2 === '')? {borderWidth: 0, borderColor: 'green', width: getWidthnHeight(42).width} : {fontSize: 12, width: getWidthnHeight(35).width}]}
                                style={[{borderWidth: 0, borderColor: 'green', width: getWidthnHeight(37).width}]}
                                date={this.state.stayDate2}
                                //clearDate={(stayDate === '')? false : true}
                                //onPress={() => this.setState({stayDate: ''})}
                                maxDate={moment().toDate()}
                                dateFont={{fontSize: (fontSizeH4().fontSize + 1)}}
                                disabled={(stayDate)? false : true}
                                androidMode='default'
                                mode='date'
                                placeholder='To Date'
                                format='DD-MM-YYYY'
                                onDateChange={(date) => {
                                    const currentTimeStamp = moment().valueOf();
                                    const addTime = moment(currentTimeStamp).add(2, 'seconds').format('hh:mm:ss A')
                                    const selectedTimeStamp = moment(`${date} ${addTime}`, "DD-MM-YYYY hh:mm:ss A").valueOf();
                                    const date1AddTime = moment(currentTimeStamp).add(1, 'second').format('hh:mm:ss A');
                                    let date1TimeStamp = moment(`${stayDate} ${date1AddTime}`, "DD-MM-YYYY hh:mm:ss A").valueOf();
                                    console.log(date1TimeStamp, selectedTimeStamp, moment(date1TimeStamp).format("DD-MM-YYYY"), moment(selectedTimeStamp).format("DD-MM-YYYY"))
                                    if(date1TimeStamp > selectedTimeStamp){
                                        if(stayDate2){
                                            this.resetStayProgress()
                                        }
                                        this.setState({stayDate2: '', stayDateError2: true})
                                        alert("This date should be greater/equal to FROM DATE")
                                    }else{
                                        if(this.state.stayDate2 === ''){
                                            this.setStayProgress(() => {})
                                        }
                                        this.setState({stayDate2: date, stayDateError2: false})
                                    }
                                }}
                            /> */}
                        </View>  
                        <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', ...Platform.select({ios: { zIndex: 1 }})}, getMarginTop(1.5), getWidthnHeight(78)]}>
                            <SearchableDropDown 
                                placeholder="State"
                                data={this.state.stateData}
                                value={this.state.stateName}
                                style={[{
                                    borderColor: (submitStay && stateError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: 1,
                                    borderStyle: (submitStay && stateError)? 'dashed' : 'solid', borderWidth: (submitStay && stateError)? 2 : 1,
                                }, getWidthnHeight(37, 7)]}
                                searchStyle={[getWidthnHeight(31, 7)]}
                                dropDownSize={[getWidthnHeight(37, 20)]}
                                textBoxSize={[getWidthnHeight(37, 4)]}
                                iconSize={getWidthnHeight(6).width}
                                onChangeText={(id, name, index, data) => {
                                    let count = 0;
                                    if(this.state.stateName === ''){
                                        this.setStayProgress(() => {});
                                    }
                                    if(this.state.stayCityName){
                                        count += 1;
                                    }
                                    if(this.state.stayRate){
                                        count += 1;
                                    }
                                    if(this.state.foodExpense){
                                        count += 1;
                                    }
                                    if(count > 0){
                                        this.resetStayProgress(count)
                                    }
                                    this.setState({
                                        stateName: name, stateError: false, stateID: id, 
                                        stayCityID: null, stayCityError: true, stayRateError: true,
                                        foodExpenseError: true, hotelAllowance: null, foodAllowance: null,
                                        stayRateCount: 0, foodExpenseCount: 0
                                        }, async () => {
                                            console.log("STATE NAME: ", this.state.stateName)
                                            await this.cities(this.state.stateID, 'stayState');
                                            this.setState({stayCityName: '', stayRate: '', foodExpense: ''})
                                    })
                                }}
                            />
                            <SearchableDropDown 
                                placeholder="City"
                                data={this.state.stateWiseCity}
                                value={this.state.stayCityName}
                                disabled={(this.state.stateName)? false : true}
                                style={[{
                                    borderColor: (submitStay && stayCityError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: 1,
                                    borderStyle: (submitStay && stayCityError)? 'dashed' : 'solid', borderWidth: (submitStay && stayCityError)? 2 : 1,
                                }, getWidthnHeight(37, 7)]}
                                searchStyle={[getWidthnHeight(31, 7)]}
                                dropDownSize={[getWidthnHeight(37, 20)]}
                                textBoxSize={[getWidthnHeight(37, 4)]}
                                iconSize={getWidthnHeight(6).width}
                                onChangeText={(id, name, index, data) => {
                                    let count = 0;
                                    if(this.state.stayCityName === ''){
                                        this.setStayProgress(() => {})
                                    }
                                    if(stayRate){
                                        count += 1;
                                        //this.resetStayProgress();
                                    }
                                    if(foodExpense){
                                        count += 1;
                                        //this.resetStayProgress();
                                    }
                                    if(count > 0){
                                        this.resetStayProgress(count)
                                    }
                                    this.setState({
                                        stayCityName: name, stayCityError: false, stayCityID: id,
                                        stayRate: '', stayRateError: true, foodExpense: '', foodExpenseError: true, 
                                        hotelAllowance: null, foodAllowance: null, stayRateCount: 0, foodExpenseCount: 0
                                    }, 
                                        () => {
                                            console.log("CITY NAME: ", this.state.stayCityName, this.state.stayCityID)
                                            this.cityBand();
                                        }
                                    )
                                }}
                            />
                        </View>
                        <View style={[{flexDirection:'row', justifyContent: 'space-evenly'}, getMarginTop(1.5), getWidthnHeight(78)]}>
                            <View style={[getWidthnHeight(37, 7)]}>
                                <CustomTextInput 
                                    placeholder={(hotelAllowance)? ` Per Night(max. ${hotelAllowance}) ` : ' Rate per night '}
                                    value={this.state.stayRate}
                                    prefillEnable={(editStay)? true : false}
                                    inactiveTitleFontSize={fontSizeH4().fontSize + 1}
                                    inactiveTitleHeight={getWidthnHeight(undefined, 3).height}
                                    activeTitleFontSize={fontSizeH4().fontSize - 3}
                                    onChangeText={(stayRate) => {
                                        const number = stayRate.replace(/[^0-9]/g, '')
                                        this.setState({stayRate: number.trim()}, () => {
                                            const {stayRate, hotelAllowance} = this.state;
                                            if(stayRate === ''){
                                                this.setState({stayRateError: true})
                                                if(this.state.stayRateCount > 0){
                                                    this.setState({stayRateCount: 0}, () => this.resetStayProgress())
                                                }
                                            }else if(stayRate > hotelAllowance){
                                                this.setState({
                                                    enableAlert: true, alertTitle: `Your max Lodge Allowance is ${hotelAllowance}`, 
                                                    alertColor: false, stayRate: '', stayRateError: true
                                                })
                                            }else if(stayRate <= hotelAllowance){
                                                this.setState({stayRateError: false}, () => {
                                                    const {stayRateCount} = this.state;
                                                    if(stayRateCount === 0){
                                                        this.setStayProgress((finished) => {
                                                            if(finished){
                                                                this.setState({stayRateCount: stayRateCount + 1})
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }}
                                    keyboardType = {'numeric'}
                                    editable={(hotelAllowance)? true : false}
                                    containerStyle={[{
                                        borderColor: (submitStay && stayRateError)? 'red' : '#C4C4C4',
                                        borderStyle: (submitStay && stayRateError)? 'dashed' : 'solid',
                                        borderWidth: (submitStay && stayRateError)? 2 : 1, borderRadius: 1,
                                        justifyContent: 'center', alignItems: 'stretch'
                                    }, getWidthnHeight(37, 7)]}
                                    textInputStyle={[{borderColor: 'black', borderWidth: 0, fontSize: fontSizeH4().fontSize + 3}]}
                                    inactiveTitleColor='dimgrey'
                                    activeTitleColor={colorTitle}
                                />
                            </View>  
                            <View style={[getWidthnHeight(37, 7)]}>
                                <CustomTextInput 
                                    placeholder={(foodAllowance)? ` Food Exp(max. ${foodAllowance}) ` : ' Food Expense '}
                                    value={this.state.foodExpense}
                                    prefillEnable={(editStay)? true : false}
                                    inactiveTitleFontSize={fontSizeH4().fontSize + 1}
                                    inactiveTitleHeight={getWidthnHeight(undefined, 3).height}
                                    activeTitleFontSize={fontSizeH4().fontSize - 3}
                                    onChangeText={(foodExpense) => {
                                        const number = foodExpense.replace(/[^0-9]/g, '')
                                        this.setState({foodExpense: number.trim()}, () => {
                                            const {foodExpense, foodAllowance} = this.state;
                                            if(foodExpense === ''){
                                                this.setState({foodExpenseError: true})
                                                if(this.state.foodExpenseCount > 0){
                                                    this.setState({foodExpenseCount: 0}, () => this.resetStayProgress())
                                                }
                                            }else if(foodExpense > foodAllowance){
                                                this.setState({
                                                    enableAlert: true, alertTitle: `Your max Food Allowance is ${foodAllowance}`, 
                                                    alertColor: false, foodExpense: '', foodExpenseError: true
                                                })
                                            }else if(foodExpense <= foodAllowance){
                                                this.setState({foodExpenseError: false}, () => {
                                                    const {foodExpenseCount} = this.state;
                                                    if(foodExpenseCount === 0){
                                                        this.setStayProgress((finished) => {
                                                            if(finished){
                                                                this.setState({foodExpenseCount: foodExpenseCount + 1})
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }}
                                    keyboardType = {'numeric'}
                                    editable={(foodAllowance)? true : false}
                                    containerStyle={[{
                                        borderColor: (submitStay && foodExpenseError)? 'red' : '#C4C4C4',
                                        borderStyle: (submitStay && foodExpenseError)? 'dashed' : 'solid',
                                        borderWidth: (submitStay && foodExpenseError)? 2 : 1, borderRadius: 1,
                                        justifyContent: 'center', alignItems: 'stretch'
                                    }, getWidthnHeight(37, 7)]}
                                    textInputStyle={[{borderColor: 'black', borderWidth: 0, fontSize: fontSizeH4().fontSize + 3}]}
                                    inactiveTitleColor='dimgrey'
                                    activeTitleColor={colorTitle}
                                />
                            </View> 
                        </View>
                        <View style={[{flexDirection: 'row'}, getMarginVertical(1.3), getWidthnHeight(78)]}>
                            <View style={[{borderColor: 'red', borderWidth: 0}, getWidthnHeight(30)]}/>
                            <Animated.View style={[{alignItems: 'center', justifyContent: 'center'}, (bounceStayButton)? animateButton : null]}>
                                <TouchableOpacity 
                                    style={[{flexDirection:'row', justifyContent: 'center', }, getWidthnHeight(30)]}
                                    onPress={() => {
                                        if(editStay){
                                            this.saveStayChanges();
                                        }else{
                                            this.checkErrorsInStayForm();
                                        }
                                    }} 
                                >
                                    <View style={[{justifyContent: 'center', alignItems: 'center', backgroundColor:'#3280E4',borderRightWidth:2, borderRightColor:'white', borderTopLeftRadius:10, borderBottomLeftRadius:10}, getWidthnHeight(4,5)]}/>
                                    <View style={[{ justifyContent: 'center', alignItems: 'center', backgroundColor:'#3280E4'}, getWidthnHeight(20,5)]}>
                                        <Text style = {[{color:'white', fontWeight:"bold", fontSize: fontSizeH4().fontSize + 1}, styles.boldFont]}>{(editStay)? 'DONE' : 'ADD'}</Text>
                                    </View>
                                    <View style={[{justifyContent: 'center', alignItems: 'center', backgroundColor:'#3280E4',borderLeftWidth:2, borderLeftColor:'white', borderTopRightRadius:10, borderBottomRightRadius:10}, getWidthnHeight(4,5)]}/>
                                </TouchableOpacity>
                            </Animated.View>
                        </View> 
                        </View>
                        <View>
                            <View style={{width: getWidthnHeight(14).width, height: getWidthnHeight(14).width, borderColor: 'red', borderWidth: 0, alignItems: 'center', justifyContent: 'center'}}>
                                <AnimatedCircularProgress
                                    size={Math.floor(getWidthnHeight(13).width)}
                                    width={getWidthnHeight(1).width}
                                    //fill={this.state.staydateTime === '' && this.state.staystate == '' && this.state.staycity == '' && this.state.staypernight == '' && this.state.foodexpda == '' ? 0: this.state.stayprogress > 2 ? this.state.stayprogress : 0}
                                    fill={(fillStayError && (this.state.stayProgress === 0)?  0 : this.state.stayProgress)}
                                    tintColor={stayProgressColor}
                                    backgroundColor="#D1D2D4"
                                >
                                    {(fill) => (
                                        <View>
                                            {(fillStayError && this.state.stayProgress === 0)?
                                                <Text>{'0'}</Text>
                                            :
                                                <View>
                                                    {(this.state.stayProgress < 100)?
                                                        <View>
                                                            <Animated.Text style={[animateStayCount]}>
                                                                {this.state.stayProgress}
                                                            </Animated.Text>
                                                        </View>
                                                    :
                                                        <Animated.View style={{transform: [{scale: scaleStayCheck}]}}>
                                                            <FontAwesomeIcons name={'check-circle'} size={getWidthnHeight(10).width} color={'#00A030'}/>
                                                        </Animated.View>
                                                    }
                                                </View>
                                            }
                                        </View>
                                        )
                                    }
                                </AnimatedCircularProgress>
                            </View>
                            <View style = {[getMarginTop(1)]}>
                                <TouchableOpacity onPress = {this.onclickstaydelete}>
                                    {(fillStayError && submitStay)?
                                        <AnimatedCircularProgress
                                            size={Math.floor(getWidthnHeight(13).width)}
                                            width={getWidthnHeight(1).width}
                                            //fill={this.state.staydateTime === '' && this.state.staystate == '' && this.state.staycity == '' && this.state.staypernight == '' && this.state.foodexpda == '' ? 0 : 100}
                                            fill={100}
                                            tintColor="#EB3A32"
                                            backgroundColor="#D1D2D4"
                                        >
                                        {(fill) => (
                                            <View>
                                                    <Icons name={'delete'} size={Math.floor(getWidthnHeight(10).width)} color={'#EB3A32'}/>
                                            </View>
                                            )
                                        }
                                        </AnimatedCircularProgress>  
                                    :
                                        <AnimatedCircularProgress
                                            size={Math.floor(getWidthnHeight(13).width)}
                                            width={getWidthnHeight(1).width}
                                            //fill={this.state.staydateTime === '' && this.state.staystate == '' && this.state.staycity == '' && this.state.staypernight == '' && this.state.foodexpda == '' ? 0 : 100}
                                            fill={(fillStayError)? 0 : 100}
                                            tintColor="#EB3A32"
                                            backgroundColor="#D1D2D4"
                                        >
                                        {(fill) => (
                                            <View>
                                                {(fillStayError)?
                                                    <Icons name={'delete'} size={Math.floor(getWidthnHeight(10).width)} color={'#D1D2D4'}/>
                                                :
                                                    <Icons name={'delete'} size={Math.floor(getWidthnHeight(10).width)} color={'#EB3A32'}/>
                                                }
                                            </View>
                                            )
                                        }
                                        </AnimatedCircularProgress>
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View>
                    </View>
                    </View>
                :
                    null
                }           
                {(this.state.documentsModal) &&
                    <DocumentsModal 
                        containerstyle = {{height:getWidthnHeight(undefined,25).height}}
                        data={this.state.attachedImage}
                        status={true}
                        isvisible={this.state.documentsModal}
                        style = {{backgroundColor:'#3180E5'}}
                        editDocuments={(item, index) => this.editDocuments(item, index)}
                        toggle={() => this.setState({documentsModal: !this.state.documentsModal})}
                        title = {'Document Details'}
                        deleteItinerary = {(index) => this.documentDataSplice(index)}
                        showSpinner={showSpinner}
                        downloadImage={(attachment, serialNo) => this.checkExistingDownloads(attachment, serialNo)}
                    />
                }
            
            {(travelAttachment || stayAttachment) &&
                <View style ={[{flexDirection:'row', justifyContent: 'space-between', marginTop: getMarginTop(1).marginTop, zIndex: -1},getWidthnHeight(95), getMarginBottom(0.5)]}> 
                    <View style={[{alignItems:'flex-start', marginTop:getMarginTop(2).marginTop}]}>
                        <Text style={[{color:"#3280E4", fontWeight:'bold'}, styles.boldFont, fontSizeH4()]}>UPLOAD DOCUMENTS</Text>
                    </View>
                    <View style={[{borderColor: colorBase,}]}/>
                    <RoundButton 
                        title={(this.state.attachedImage.length === 0)? "View All" : `View All (${this.state.attachedImage.length})`}
                        onPress={()=>this.setState({documentsModal: !this.state.documentsModal})}
                        gradient={['#3280E4', '#3280E4']}
                        style={[getWidthnHeight(30, 4), getMarginTop(1),getMarginLeft(3)]}
                    />
                </View>
            }
            {(travelAttachment || stayAttachment) &&
            <View style ={[{borderColor: '#C4C4C4', borderWidth: 1, alignItems: 'center'}, getWidthnHeight(95)]}>
                <View style={[{flexDirection: 'row'}, getWidthnHeight(95)]}>
                    <TouchableOpacity onPress = {() => this.pickfile()}>
                        <View style={[{flexDirection: 'row', borderWidth: 0, borderColor: 'red', justifyContent: 'flex-start', alignItems: 'center'}, getWidthnHeight(25)]}>
                            <View style = {[{flexDirection:'row'},getMarginLeft(2), getMarginVertical(1)]}>
                                <FontAwesome name={'plus-circle'} size={20} color={(submitAttachment && attachedImageError)? '#EB3A32': '#3280E4'}/>
                                <Text style={[{color:(submitAttachment && attachedImageError)? '#EB3A32': '#3280E4', textDecorationLine:'underline', fontWeight:'700'}, styles.boldFont, getMarginLeft(2), fontSize_H3()]}>Add File</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {(!this.state.attachedImageError) && (
                        <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={{justifyContent: 'center'}} horizontal style={[getWidthnHeight(65), getMarginTop(0.5), getMarginRight(2)]}>
                            <View style={[{borderColor: 'red', borderWidth: 0}]}>
                                <Text style={[fontSizeH4()]}>{this.state.selectedAttachment.name}</Text>  
                            </View>
                        </ScrollView>
                    )
                    }
                </View>
                <View style={[{flexDirection:'row', justifyContent: 'space-evenly'}, getWidthnHeight(95), getMarginTop(0.5)]}>
                    <View style={[getWidthnHeight(42, 7)]}>
                        <CustomTextInput 
                            placeholder={' File Name '}
                            value={this.state.fileName}
                            prefillEnable={(editAttachment)? true : false}
                            inactiveTitleFontSize={fontSizeH4().fontSize + 1}
                            inactiveTitleHeight={getWidthnHeight(undefined, 3).height}
                            activeTitleFontSize={fontSizeH4().fontSize - 3}
                            onChangeText={(fileName) => {
                                this.setState({fileName: fileName.trimLeft()}, () => {
                                    const {fileName} = this.state;
                                    if(fileName === ''){
                                        this.setState({fileNameError: true})
                                    }else {
                                        this.setState({fileNameError: false})
                                    }
                                })
                            }}
                            containerStyle={[{
                                borderColor: (submitAttachment && fileNameError)? 'red' : '#C4C4C4',
                                borderStyle: (submitAttachment && fileNameError)? 'dashed' : 'solid',
                                borderWidth: (submitAttachment && fileNameError)? 2 : 1, borderRadius: 1,
                                justifyContent: 'center', alignItems: 'stretch'
                            }, getWidthnHeight(42, 7)]}
                            textInputStyle={[{borderColor: 'black', borderWidth: 0, fontSize: fontSizeH4().fontSize + 3}]}
                            inactiveTitleColor='dimgrey'
                            activeTitleColor={colorTitle}
                        />
                    </View>
                    <View style={[{
                            borderColor: (submitAttachment && attachmentError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: 1,
                            borderStyle: (submitAttachment && attachmentError)? 'dashed' : 'solid', borderWidth: (submitAttachment && attachmentError)? 2 : 1,
                        }, getWidthnHeight(42, 7)]}>
                        <Dropdown
                            containerStyle={[{justifyContent: 'center', borderColor: 'grey', borderWidth: 0, paddingLeft: 0, borderRadius: 10,}, getWidthnHeight(42, 7)]}
                            inputContainerStyle={[{borderBottomWidth:0, marginTop:4,alignSelf:'center'}, getWidthnHeight(40, 7)]}
                            label={'Attachment Type'}
                            data={attachmentType}
                            valueExtractor={({id})=> id}
                            labelExtractor={({name})=> name}
                            onChangeText ={(id, index, data)=>{
                                const attachmentName = data[index]['name'];
                                this.setState({attachmentName, attachmentID: id, attachmentError: false})
                            }}
                            value={attachmentName}
                            baseColor = {(attachmentName)? colorTitle : 'grey'}
                            pickerStyle={[getMarginLeft(3), getWidthnHeight(40), getMarginTop(10)]}
                            //dropdownOffset={{ 'top': 25 }}
                            fontSize = {fontSizeH4().fontSize - 1}
                        />
                    </View> 
                </View>  
                <View style={[{alignItems: 'center', justifyContent: 'center', flexDirection: 'row'},getMarginVertical(1.3)]}>
                    <View style={[{borderColor: 'red', borderWidth: 0, alignItems: 'flex-end', justifyContent: 'center'}, getWidthnHeight(30)]}/>
                    <View style={[{alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(35)]}>
                        <TouchableOpacity onPress={() => (editAttachment)? this.saveDocumentChanges() : this.checkDocumentsError()} style={[{flexDirection:'row', justifyContent: 'center', }]}>
                            <View style={[{justifyContent: 'center', alignItems: 'center', backgroundColor:'#3280E4',borderRightWidth:2, borderRightColor:'white', borderTopLeftRadius:10, borderBottomLeftRadius:10}, getWidthnHeight(4,5)]}/>
                            <View style={[{ justifyContent: 'center', alignItems: 'center', backgroundColor:'#3280E4'}, getWidthnHeight(20,5)]}>
                                <Text style = {[{color:'white', fontWeight:"bold", fontSize: fontSizeH4().fontSize + 1}, styles.boldFont]}>{(editAttachment)? 'DONE' : 'ADD'}</Text>
                            </View>
                            <View style={[{justifyContent: 'center', alignItems: 'center', backgroundColor:'#3280E4',borderLeftWidth:2, borderLeftColor:'white', borderTopRightRadius:10, borderBottomRightRadius:10}, getWidthnHeight(4,5)]}/>
                        </TouchableOpacity>
                    </View>  
                    <View style={[{borderColor: 'red', borderWidth: 0, alignItems: 'flex-end', justifyContent: 'center'}, getWidthnHeight(30)]}>
                        <TouchableHighlight 
                            style={[{
                                alignItems: 'center', justifyContent: 'center', borderWidth: 0, borderColor: 'black', 
                                width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, backgroundColor: '#DBE8F8',
                                borderRadius: getWidthnHeight(7).width}, getMarginRight(4)]} 
                            underlayColor="#3280E4"
                            onPress={() => this.clearDocuments()}
                        >
                            <AntdesignIcons name='delete' size={getWidthnHeight(4.5).width}/>
                        </TouchableHighlight>
                    </View>
                </View> 
            </View>
            }
        {/* <View style={[{flexDirection: 'row'}, getWidthnHeight(100, 10)]}>
            {
                (this.state.uploadDocument.map((item) => {
                    console.log("IMAGE ITEM: ", item)
                    const pathURI = item[0]['uri'];
                    const pathName = item[0]['name']
                    const path = `${pathURI}/${pathName}`
                    console.log("IMAGE PATH: ", pathURI)
                    return (
                        <View style={{width: 50, height: 50, borderColor: 'red', borderWidth: 1}}>
                            <Image source={{uri : pathURI}} style={{width: 50, height: 50}} resizeMode="contain" />
                        </View>
                    )
                }))
            }
        </View> */}
            <View style = {[{borderWidth:0, borderColor:'#487DCB', backgroundColor:'#DCDCDC'}, getWidthnHeight(95,0.2), getMarginTop(1.5)]}/>
            <View style={[getWidthnHeight(95, 7), getMarginTop(1.5)]}>
                <CustomTextInput 
                    placeholder={' Comments '}
                    value={this.state.comments}
                    inactiveTitleFontSize={fontSizeH4().fontSize + 1}
                    inactiveTitleHeight={getWidthnHeight(undefined, 3).height}
                    activeTitleFontSize={fontSizeH4().fontSize - 3}
                    onChangeText={(comments) => {
                        this.setState({comments: comments.trimLeft()}, () => {
                            const {comments} = this.state;
                            if(comments === ''){
                                this.setState({commentsError: true})
                            }else {
                                this.setState({commentsError: false})
                            }
                        })
                    }}
                    containerStyle={[{
                        borderColor: (submitClaim && commentsError)? 'red' : '#C4C4C4',
                        borderStyle: (submitClaim && commentsError)? 'dashed' : 'solid',
                        borderWidth: (submitClaim && commentsError)? 2 : 1, borderRadius: 1,
                        justifyContent: 'center', alignItems: 'stretch'
                    }, getWidthnHeight(95, 7)]}
                    textInputStyle={[{borderColor: 'black', borderWidth: 0, fontSize: fontSizeH4().fontSize + 3}]}
                    inactiveTitleColor='dimgrey'
                    activeTitleColor={colorTitle}
                />
            </View>
            <View style = {[{borderWidth:0, borderColor:'#487DCB', backgroundColor:'white'}, getWidthnHeight(94.4,1), getMarginTop(1), getMarginLeft(3)]}/>
            </View>
            </ScrollView>
            <View style={{borderTopWidth: 1, borderColor: '#C4C4C4'}}>
                <View style={[{alignItems: 'center', justifyContent: 'center', borderTopWidth: 0, borderColor: '#C4C4C4'},getMarginVertical(1)]}>
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <TouchableOpacity onPress={() => this.checkAllErrors()} style={[{flexDirection:'row', justifyContent: 'center', }]}>
                            <View style={[{justifyContent: 'center', alignItems: 'center', backgroundColor:'#42B883',borderRightWidth:2, borderRightColor:'white', borderTopLeftRadius:10, borderBottomLeftRadius:10}, getWidthnHeight(4,5)]}/>
                            <View style={[{ justifyContent: 'center', alignItems: 'center', backgroundColor:'#42B883'}, getWidthnHeight(23,5)]}>
                                <Text style = {[{color:'white', fontWeight:"bold", paddingHorizontal:4}, styles.boldFont]}>UPDATE</Text>
                            </View>
                            <View style={[{justifyContent: 'center', alignItems: 'center', backgroundColor:'#42B883',borderLeftWidth:2, borderLeftColor:'white', borderTopRightRadius:10, borderBottomRightRadius:10}, getWidthnHeight(4,5)]}/>
                        </TouchableOpacity>
                    </View>  
                </View> 
            </View>
            </KeyboardAvoidingView>
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
            {(this.state.enableAlert)?
                <AlertBox 
                    title={this.state.alertTitle}
                    visible={this.state.enableAlert}
                    onDecline={() => this.setState({enableAlert: false})}
                    titleStyle={{color: 'black'}}
                    color={this.state.alertColor}
                />
            :
                null
            }
            {(this.state.apiError)?
                <AlertBox 
                    title={'Something went wrong'}
                    subtitle={`Error Code: ${errorCode}${apiCode}`}
                    visible={this.state.apiError}
                    onDecline={() => this.setState({apiError: false})}
                    titleStyle={{color: 'black'}}
                    color={false}
                />
                :
                null
            }
        </View>    
    )}
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bigbluebox: {
        marginLeft:"2.5%",
        marginRight:'2.5%',
        marginTop:'2%',
        height:getWidthnHeight(undefined,15).height,
        borderTopLeftRadius:10,
        borderTopRightRadius:10
    },
    multicolorsmallbox: {
        marginLeft:"1.5%",
        marginTop:'2.5%',
        height:getWidthnHeight(undefined,7).height,
      // width : getWidthnHeight(29.5).width,
    },
    avatar: {
        borderRadius: 75,
        width: 150,
        height: 150,
    },
    triangleCorner: {
        marginTop:getMarginTop(0.9).marginTop,
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderRightWidth: 9,
        borderTopWidth: 9,
        borderLeftWidth: 9,
        borderRightColor: "transparent",
        borderLeftColor:"transparent",
        borderTopColor: "#307FE4",
    }, 
    flatlistcontainer:{
        width:getWidthnHeight(89).width,
        height:getWidthnHeight(undefined,20).height,
        backgroundColor: '#FFFFFF',
        borderWidth:0,
        borderColor: '#C4C4C4',
        marginTop:getMarginTop(2.5).marginTop,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: {
                    width: 0,
                    height: 50,
                },
                zIndex: 10
            },
            android: {
                elevation: 7,
            }
        }),
        shadowOpacity: 0.3,
        shadowRadius: 40,
        borderColor: 'black',
        borderWidth: 0
    }, 
    triangleCornerl: {
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderRightWidth: 40,
        borderTopWidth: 40,
        borderRightColor: "transparent",
        borderTopColor: "#307FE4",
    },
    box:{
        left:0,
        height:45,
        width:'80%',
        borderRadius:10,
    },   
    Dropbox:{
        borderWidth: 1,
        left:0,
        width:getWidthnHeight(35).width,
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black',
        borderColor: '#C4C4C4',
        marginLeft:'2%',
        marginTop:getMarginTop(1.5).marginTop
    },
    InputBox:{
        borderWidth: 1,
        left:0,
        width:getWidthnHeight(35).width,
        height:52,
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black',
        borderColor: '#C4C4C4',
        marginLeft:'2%',
        marginTop:getMarginTop(1.5).marginTop
    },
    bigbox:{
        marginTop:'1%',
        width: wp(95),
        backgroundColor: '#FFFFFF',
        borderWidth:1,
        borderColor: '#C4C4C4',
    },
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
});
