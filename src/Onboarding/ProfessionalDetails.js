import React, {Component} from 'react';
import {
    View, Text, ImageBackground, Animated, Keyboard, ScrollView,  TextInput, TouchableHighlight,
    FlatList, Alert, Platform, StyleSheet, KeyboardAvoidingView, TouchableOpacity,
    BackHandler, SafeAreaView, StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import RNBackgroundDownloader from 'react-native-background-downloader';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS, { exists } from 'react-native-fs';
import LinearGradient from 'react-native-linear-gradient';
import DocumentPicker from 'react-native-document-picker';
import { Dropdown } from 'react-native-element-dropdown';
import ImagePicker from 'react-native-image-crop-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Delete from 'react-native-vector-icons/Ionicons';
import {fetchBaseURL} from '../api/BaseURL';
import {
    getWidthnHeight, IOS_StatusBar, getMarginTop, fontSizeH4, fontSizeH3, AnimatedTextInput, getMarginHorizontal,
    DismissKeyboard, OTPInput, ChoppedButton, getMarginVertical, getMarginLeft, getMarginBottom, MaskedGradientText,
    SearchableDropDown, Slider, getMarginRight, CheckList, Attachments, ScreensModal, Spinner,
    DownloadModal, GradientIcon
} from '../NewComponents/common';

const COLOR1 = "#039FFD";
const COLOR2 = "#EA304F";
const colorTitle = "#0B8EE8";
const downloadColor = "#F98404";
const bankPassbook = 'passbook';
const aadharCard = 'aadhar';
const panCard = 'pan';
const updatedCV = 'cv';
const degrees = 'certificates';
const passportCopy = 'passportCopy';
const medical = 'medical';
const idProof = 'idProof';
const photoGraph = 'passport_size_photograph';
const signature = 'signature';
const mb1 = '1048576'; //1 MB

class ProfessionalDetails extends Component{
    constructor(props){
        super(props)
        this.state = {
            submit: false,
            bankID: null,
            bankName: '',
            bankError: true,
            name: '',
            nameError: true,
            bankAC: '',
            bankACError: true,
            confirmBankAC: '',
            confirmBankACError: true,
            ifsc: '',
            ifscError: true,
            confirmIFSC: '',
            confirmIFSCError: true,
            passbookAttachment: null,
            passbookError: true,
            aadharNumber: '',
            aadharNumberError: true,
            aadharName: '',
            aadharNameError: true,
            aadharAttachment: [],
            aadharAttachmentError: true,
            panNumber: '',
            panNumberError: true,
            panName: '',
            panNameError: true,
            panAttachment: null,
            panAttachmentError: true,
            previousEPF: false,
            uan: '',
            uanError: true,
            cvAttachment: '',
            cvError: true,
            certificateAttachment: '',
            certificateError: true,
            passportAttachment: '',
            passportError: true,
            medicalAttachment: '',
            medicalError: true,
            idAttachment: '',
            idError: true,
            photoGraphAttachment: '',
            photoGraphError: true,
            signatureAttachment: '',
            signatureError: true,
            iAgree: false,
            noError: function(){
                // console.log("### NO ERROR: ", (
                //     this.bankError === false && this.nameError === false && this.bankACError === false && this.confirmBankACError === false && this.ifscError === false && 
                //     this.confirmIFSCError === false && this.passbookError === false && this.aadharNumberError === false && this.aadharNameError === false && 
                //     this.aadharAttachmentError === false && this.panNumberError === false && this.panNameError === false && this.panAttachmentError === false && 
                //     ((this.previousEPF)? this.uanError === false : true) && ((this.iAgree)? true : false)
                // ),
                // "\nBANK: ", this.bankError , "\nNAME: ", this.nameError , "\nBANKAC: ", this.bankACError , "\nCONFIRM BANK: ", this.confirmBankACError , "\nIFSC: ", this.ifscError , 
                // "\nCONFIRM IFSC", this.confirmIFSCError , "\nPASSBOOK: ", this.passbookError , "\nAADHAR NUMBER: ", this.aadharNumberError , "\nAADHAR NAME: ", this.aadharNameError , 
                // "\nAADHAR ATTACHMENT: ", this.aadharAttachmentError , "\nPAN NUMBER: ", this.panNumberError , "\nPAN NAME", this.panNameError , "\nPAN ATTACHMENT: ", this.panAttachmentError , 
                // "\nUAN: ", ((this.previousEPF)? this.uanError === false : false) , "\nI AGREE: ", ((this.iAgree)? false : true)
                // )
                return (
                    this.bankError === false && this.nameError === false && this.bankACError === false && this.confirmBankACError === false && this.ifscError === false && 
                    this.confirmIFSCError === false && this.passbookError === false && this.aadharNumberError === false && this.aadharNameError === false && 
                    this.aadharAttachmentError === false && ((this.previousEPF)? this.uanError === false : true) && ((this.iAgree)? true : false)
                );
            },
            checkPan: function(){
                return (this.panNumberError === false || this.panNameError === false || this.panAttachmentError === false)
            },
            noPanError: function(){
                return (this.panNumberError === false && this.panNameError === false && this.panAttachmentError === false)
            },
            screens: [
            ],
            showScreensList: false,
            uploadDocuments: [],
            documentsList: [],
            baseURL: null,
            documentDetails: [],
            loading: false,
            viewAttachments: false,
            attachmentData: [],
            cancelCheque: null,
            aadharArray: [],
            panCardFile: null,
            activatePan: false,
            cloneDocumentsList: [],
            secretToken: null,
            downloadModal: false,
            percent: 0,
            fullFileName: '',
            checkFile: false,
            fileSize: null,
            downloadFileName: '',
            deleteIndex: null,
            removeAttachment: null,
            oldAadharAttachment: [],
            attachedCertificates: []
        };
        const previousData = JSON.parse(this.props.route.params.apiData);
        if(previousData.sectionData.oldData){
            this.showLoader();
        }
    }

    componentDidMount(){
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.handleBackButton());
        AsyncStorage.getItem('onboardingToken').then((secretToken) => {
            this.setState({secretToken})
        });
        fetchBaseURL().then((baseURL) => {
            const apiData = JSON.parse(this.props.route.params.apiData);
            this.setState({baseURL, screens: apiData.sectionData.links.pageLinks}, () => {})
            const updatedList = apiData.sectionData.dropdown.documents.map((item) => {
                const oldData = item.old_value;
                let notEmpty = false;
                if(Array.isArray(oldData)){
                    if(oldData.length > 0){
                        notEmpty = true;
                    }
                }else{
                    notEmpty = Boolean(oldData);
                }
                return {...item, blank: notEmpty? false : true}
            })
            const index = updatedList.findIndex((item) => {
                return (item.type_name === "educational_degrees_certificates_multiple")
            })
            this.setState({
                documentsList: updatedList, cloneDocumentsList: JSON.stringify(updatedList), attachedCertificates: updatedList[index]['old_value']
            }, () => {
                const {documentsList, attachedCertificates} = this.state;
                const documentDetails = {};
                //console.log("&&&&& OLD CERTIFICATES: ", attachedCertificates);
                documentsList.forEach((item) => {
                    Object.assign(documentDetails, {[item.type_name]: ''})
                })
                this.setState({documentDetails}, () => {
                    console.log("ONBOARDING URL: ", documentsList, "\n\n\n", this.state.documentDetails)
                    if(apiData.sectionData.oldData){
                        this.fillOldData();
                    }
                })
            })
        })
    }

    handleBackButton = () => {
        //ToastAndroid.show('Not Allowed', ToastAndroid.SHORT)
        if(this.props.route.name === "ProfessionalDetails"){
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
        const professionalData = apiData.sectionData.oldData.professional;
        this.setState({
            bankID: professionalData.bank_name, bankName: professionalData.bank, bankError: false, name: professionalData.account_holder_name, nameError: false,
            bankAC: professionalData.account_number, bankACError: false, confirmBankAC: professionalData.confirm_account_number, confirmBankACError: false,
            ifsc: professionalData.ifsc_code, ifscError: false, confirmIFSC: professionalData.confirm_ifsc_code, confirmIFSCError: false, passbookError: false, 
            cancelCheque: professionalData.cancel_cheque, aadharArray: professionalData.adhaar_card_file, panCardFile: professionalData.pan_card_file,
            aadharNumber: professionalData.adhaar_number, aadharNumberError: false, aadharName: professionalData.name_on_adhaar, aadharNameError: false,
            oldAadharAttachment: professionalData.adhaar_card_file, aadharAttachmentError: (professionalData.adhaar_card_file.length > 0)? false : true, 
            panAttachmentError: (professionalData.pan_number)? false : true, panName: professionalData.name_on_pan, panNameError: (professionalData.name_on_pan)? false : true, 
            panNumber: professionalData.pan_number, panNumberError: (professionalData.pan_number)? false : true, previousEPF: (professionalData.has_epf === "No")? false : true, 
            uan: (!professionalData.uan_number)? '' : professionalData.uan_number, uanError: (!professionalData.uan_number)? true : false,
            iAgree: (apiData.sectionData.dropdown.iAgree === 1)? true : false
        }, () => this.hideLoader())
    }

    showLoader(){
        this.setState({loading: true})
    }

    hideLoader(){
        this.setState({loading: false})
    }

    onSubmit(){
        const {documentDetails, documentsList, bankAC, confirmBankAC, ifsc, confirmIFSC, baseURL, secretToken, oldAadharAttachment} = this.state;
        const checkPanError = this.state.checkPan();
        this.setState({submit: true, activatePan: (checkPanError)? checkPanError : false}, async() => {
            if(bankAC !== confirmBankAC){
                alert("Bank account number mismatch");
                return;
            }
            if(ifsc !== confirmIFSC){
                alert("Bank IFSC code mismatch");
                return;
            }
            const mandatoryFields = documentsList.filter((item) => {
                if(!item.extension && item.blank){
                    return item
                }
            })
            const indexOf = mandatoryFields.findIndex((item) => {
                return (item.blank === true);
            })
            if(indexOf > -1){
                alert("Please fill the fields highlighted in RED");
                return;
            }else{
                const checkError = this.state.noError();
                let noPanError = this.state.noPanError();
                let professionalDetails = null;
                if(checkError && noPanError){
                    const apiData = JSON.parse(this.props.route.params.apiData);
                    const sendData = new FormData();
                    professionalDetails = {
                        bank_name: this.state.bankID,
                        bank: this.state.bankName,
                        account_holder_name: this.state.name,
                        account_number: this.state.bankAC,
                        confirm_account_number: this.state.confirmBankAC,
                        ifsc_code: this.state.ifsc,
                        confirm_ifsc_code: this.state.confirmIFSC,
                        adhaar_number: this.state.aadharNumber,
                        name_on_adhaar: this.state.aadharName,
                        pan_number: this.state.panNumber,
                        name_on_pan: this.state.panName,
                        has_epf: (this.state.previousEPF)? "Yes" : "No",
                        uan_number: this.state.uan,
                        cancel_cheque: this.state.passbookAttachment,
                        adhaar_card_file: this.state.aadharAttachment,
                        pan_card_file: this.state.panAttachment
                    }
                    const agreeTerms = (this.state.iAgree)? 1 : 0;
                    sendData.append('id', apiData.draftId);
                    sendData.append('page', apiData.currentPage);
                    sendData.append('project_id', apiData.projectId);
                    sendData.append('next', apiData.sectionData.links.next.page);
                    sendData.append('documentsData[signature_declaration]', agreeTerms);
                    if(Boolean(apiData.sectionData.oldData)){
                        const oldPassbook = apiData.sectionData.oldData.professional.cancel_cheque;
                        //const oldAadhar = apiData.sectionData.oldData.professional.adhaar_card_file;
                        const oldPanCard = apiData.sectionData.oldData.professional.pan_card_file;
                        if(Boolean(oldPassbook)){
                            sendData.append(`professional[cancel_cheque_old_filename]`, oldPassbook)
                        }
                        if(oldAadharAttachment.length > 0){
                            oldAadharAttachment.forEach((fileName) => {
                                sendData.append(`professional[adhaar_card_file_old_filename][]`, fileName)
                            })
                        }
                        //console.log("$$$### OLD ADHAAR ATTACHMENT: ", oldAadharAttachment, oldAadharAttachment.length, sendData)
                        if(Boolean(oldPanCard)){
                            sendData.append(`professional[pan_card_file_old_filename]`, oldPanCard)
                        }
                    }
                    Object.keys(professionalDetails).forEach((name, index) => {
                        if(name === "adhaar_card_file"){
                            let data = [];
                            data = professionalDetails[name];
                            if(data.length > 0){
                                data.forEach((item) => {
                                    sendData.append(`professional[${name}][]`, item)
                                })
                            }else{
                                sendData.append(`professional[${name}][]`, "")
                            }
                        }else if(name === "pan_card_file" || name === "cancel_cheque"){
                            let data = [];
                            data = professionalDetails[name];
                            if(data.length > 0){
                                data.forEach((item) => {
                                    sendData.append(`professional[${name}]`, item)
                                })
                            }else{
                                sendData.append(`professional[${name}]`, "")
                            }
                        }else{
                            sendData.append(`professional[${name}]`, professionalDetails[name])
                        }
                    })
                    const documentsArray = Object.keys(documentDetails);
                    //const test = ['updated_cv'];
                    this.searchItemName(documentsArray, (dataItem) => {
                        const dataItemName = Object.keys(dataItem);
                        //console.log("!@#$%!@#!@: ", dataItemName, "\n\n", dataItem);
                        dataItemName.forEach((name, index) => {
                            const {documentsList} = this.state;
                            const findIndex = documentsList.findIndex((item) => {
                                return (item.type_name === name)
                            })
                            if(findIndex > -1){
                                const oldData = documentsList[findIndex]['old_value'];
                                const multiple = documentsList[findIndex]['multiple'];
                                //console.log("!@#!@#!@# ", oldData)
                                let notEmpty = false;
                                if(Array.isArray(oldData)){
                                    if(oldData.length > 0){
                                        notEmpty = true;
                                    }
                                }else{
                                    notEmpty = Boolean(oldData);
                                }
                                if(notEmpty){
                                    if(multiple){
                                        oldData.forEach((fileName) => {
                                            sendData.append(`documents[${name}_old_filename][]`, fileName)
                                        })
                                    }else{
                                        sendData.append(`documents[${name}_old_filename]`, oldData)
                                    }
                                }
                                if(multiple){
                                    const searchArray = dataItem[name];
                                    if(searchArray.length > 0){
                                        searchArray.forEach((content) => {
                                            sendData.append(`documents[${name}][]`, content)
                                        })
                                    }else{
                                        sendData.append(`documents[${name}][]`, dataItem[name])
                                    }
                                }else{
                                    sendData.append(`documents[${name}]`, dataItem[name])
                                }
                            }
                        })
                    });
                    this.showLoader();
                    console.log("&&&&&&&& BASEURL: ", `${baseURL}/onboarding/submit-onboarding`, "\n\nDATA: ", JSON.stringify(sendData, null, 4));
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
                        console.log("&^&^&^ SUCCESS ###$$$^^^ ", parsedData)
                        if(parsedData.status === 1){
                            alert(parsedData.message);
                            console.log("^^^ @@@ SUCCESS ACHIEVED: ", "\n", parsedData.sectionData.links.next, "\n", parsedData.sectionData.links.currentPage)
                            this.props.navigation.navigate(parsedData.sectionData.links.currentPage.key,{apiData: JSON.stringify(parsedData)});
                        }else if(parsedData.status === 0){
                            Alert.alert(parsedData.message, `${parsedData.errors}`);
                        }
                    }).catch((error) => {
                        this.hideLoader();
                        console.log("%%% ERROR: ", error, error.response)
                        if(error.response){
                            const status = error.response.status;
                            console.log("%%% ERROR2: ", error.response)
                            Alert.alert("ERROR", `Error Code: ${status}605`);
                        }else{
                            alert(`${error}, API CODE: 605`);
                        }
                    })
                }else{
                    alert("Please fill the fields highlighted in RED.");
                    return;
                }
            }
        })
    }

    searchItemName(documentsName, callBack){
        const {uploadDocuments, documentDetails} = this.state;
        for(let i = 0; i < documentsName.length; i++){
            const index = uploadDocuments.findIndex((item) => {
                if(item.length > 0){
                    return (item[0]['documentName'] === documentsName[i])
                }else if(typeof item === 'object'){
                    return(item.documentName === documentsName[i])
                }
            })
            if(index > -1){
                documentDetails[documentsName[i]] = uploadDocuments[index];
            }
            if(i === (documentsName.length - 1)){
                callBack(documentDetails);
            }
        }
    }

    dismissKeyboard(){
        Keyboard.dismiss();
    }

    async addAttachment(name){
        try {
            if(name === aadharCard){
                let checkSize = 0;
                const res = await DocumentPicker.pickMultiple({
                    type: [DocumentPicker.types.pdf],
                });
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
                    //console.log("^^^ AADHAR", res)
                    this.setState({aadharAttachment: res, aadharAttachmentError: false}, () => {
                        //console.log("@@@ AADHAR", this.state.aadharAttachment)
                    })
                }
            }else{
                const res = await DocumentPicker.pick({
                    type: [DocumentPicker.types.pdf],
                })
                console.log("^^^ PASSBOOK: ", res, name, bankPassbook)
                if(res[0].size > mb1){
                    alert(`File size is too large, recommended size is 1MB.`);
                    return;
                }else{
                    if(name === bankPassbook){
                        this.setState({passbookAttachment: res, passbookError: false}, () => {
                            console.log("PASSBOOK", this.state.passbookAttachment)
                        })
                    }else if(name === panCard){
                        this.setState({panAttachment: res, panAttachmentError: false}, () => {
                            //console.log("PAN", this.state.panAttachment)
                        })
                    }
                }
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
            // User cancelled the picker, exit any dialogs or menus and move on
            }
        }
    }

    async addDocuments(item, index){
        const {uploadDocuments, documentsList} = this.state;
        if(item.type_name === signature || item.type_name === photoGraph){
            ImagePicker.openPicker({
                width: item.preview_width,
                height: item.preview_height,
                cropping: true,
                compressImageQuality: 0.5
            }).then((image) => {
                const sizeLimit = `${item.size}${item.size_type}`;
                //console.log("@!@!@ IMAGE SIZE: ", sizeLimit);
                if(sizeLimit === '1MB'){
                    if(image.size > mb1){
                        alert(`File size is too large, recommended size is ${sizeLimit}`)
                        return;
                    }
                }else if(sizeLimit === '100KB'){
                    if(image.size > '100000'){
                        alert(`File size is too large, recommended size is ${sizeLimit}`)
                        return;
                    }
                }
                const splitString = image.path.split('com.xenia/files/Pictures/');
                const fileName = splitString[1];
                const imageOBJ = Object.assign(image, {
                    documentName: item.type_name, type: image.mime, uri: image.path,
                    name: fileName
                });
                let checkIndex = null;
                const updateItem =  documentsList.map((data, i) => {
                    if(i === index){
                        return {...data, blank: false}
                    }else{
                        return data
                    }
                })
                checkIndex = uploadDocuments.findIndex((data) => {
                    return (item.type_name === data.documentName);
                })
                if(checkIndex > -1){
                    uploadDocuments.splice(checkIndex, 1, imageOBJ);
                }else{
                    uploadDocuments.push(imageOBJ);
                }
                this.setState({uploadDocuments, documentsList: updateItem}, () => {
                    const {uploadDocuments, documentsList} = this.state;
                    console.log("ADDED IMAGE: ", uploadDocuments, "\n", splitString);
                });
            }).catch((err) => {
                //alert(err)
            })
        }else{
            try {
                let res = '';
                const sizeLimit = `${item.size}${item.size_type}`;
                if(item.multiple){
                    console.log("@@@^^^ITS AN ARRAY")
                    res = await DocumentPicker.pickMultiple({
                        type: [DocumentPicker.types.pdf],
                    })
                    const newIndex = res.findIndex((data) => {
                        if(sizeLimit === '1MB'){
                            if(data.size > mb1){
                                alert(`File size is too large, recommended size is ${sizeLimit}`)
                                return (data.size > mb1);
                            }
                        }else if(sizeLimit === '100KB'){
                            if(data.size > '100000'){
                                alert(`File size is too large, recommended size is ${sizeLimit}`)
                                return (data.size > '100000');
                            }
                        }
                    })
                    if(newIndex > -1){
                        return;
                    }else{
                        const eduCertificates = res.map((list) => {
                            return {...list, documentName: item.type_name}
                        })
                        console.log("%%%%%% CERTIFICATES: ", eduCertificates)
                        let checkIndex = null;
                        checkIndex = uploadDocuments.findIndex((data) => {
                            if(data.length > 0){
                                return (item.type_name === data[0]['documentName'])
                            }else if(typeof data === "object"){
                                return (item.type_name === data.documentName);
                            }
                        })
                        if(checkIndex > -1){
                            uploadDocuments.splice(checkIndex, 1, eduCertificates);
                        }else{
                            uploadDocuments.push(eduCertificates);
                        }
                    }
                }else{
                    res = await DocumentPicker.pick({
                        type: [DocumentPicker.types.pdf],
                    })
                    console.log("###@@@@ ITS AN OBJECT: ", res)
                    if(sizeLimit === '1MB'){
                        if(res.size > mb1){
                            alert(`File size is too large, recommended size is ${sizeLimit}`)
                            return;
                        }
                    }else if(sizeLimit === '100KB'){
                        if(res.size > '100000'){
                            alert(`File size is too large, recommended size is ${sizeLimit}`)
                            return;
                        }
                    }
                    const pdfFile = Object.assign(res[0], {documentName: item.type_name});
                    let checkIndex = null;
                    checkIndex = uploadDocuments.findIndex((data) => {
                        return (item.type_name === data.documentName);
                    })
                    if(checkIndex > -1){
                        uploadDocuments.splice(checkIndex, 1, pdfFile);
                    }else{
                        uploadDocuments.push(pdfFile);
                    }
                }
                //console.log("@!@!@ IMAGE RES: ", typeof res, res);
                const updateItem =  documentsList.map((data, i) => {
                    if(i === index){
                        return {...data, blank: false}
                    }else{
                        return data
                    }
                })
                this.setState({uploadDocuments, documentsList: updateItem}, () => {
                    const {uploadDocuments, documentsList} = this.state;
                    console.log("ADDED PDF FILE: ", uploadDocuments);
                });
            } catch (err) {
                if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
                }
            }
        }
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
        const downloadPath = `${downloadDir}/S2_${downloadFileName}`;
        this.setState({fullFileName: `S2_${downloadFileName}`}, () => {
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
            Alert.alert("Error!", `Unable to Download File.\nError Code: 613`)
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

    updateAttachment(updateData){
        const {removeAttachment} = this.state;
        if(removeAttachment === 'adhaar'){
            this.setState({oldAadharAttachment: updateData}, () => {
                const {oldAadharAttachment, aadharAttachment} = this.state;
                if(oldAadharAttachment.length === 0 && aadharAttachment.length === 0){
                    this.setState({aadharAttachmentError: true})
                }
            })
        }else{
            this.setState({attachedCertificates: updateData}, () => {
                const {attachedCertificates, documentsList, uploadDocuments, deleteIndex} = this.state;
                const typeName = documentsList[deleteIndex]['type_name'];
                let data = [];
                uploadDocuments.forEach((item) => {
                    if(item.length > 0 && item[0]['documentName'] === typeName){
                        data = item;
                        return;
                    }
                })
                if(data.length === 0 && attachedCertificates.length === 0){
                    documentsList[deleteIndex]['blank'] = true;
                    this.setState({documentsList})
                }
                console.log("### UPDATE ATTACHMENT: ", data, data.length, typeName)
            })
        }
    }

    render(){
        const {
            submit, bankID, bankName, bankError, name, nameError, bankAC, bankACError, confirmBankAC, confirmBankACError, loading,
            ifsc, ifscError, confirmIFSC, confirmIFSCError, aadharNumber, aadharNumberError, aadharName, aadharNameError, baseURL,
            aadharAttachment, aadharAttachmentError, panNumber, panNumberError, panName, panNameError, panAttachment, panAttachmentError,
            uan, uanError, cvAttachment, cvError, certificateAttachment, certificateError, passportAttachment, passportError,
            medicalAttachment, medicalError, idAttachment, idError, photoGraphAttachment, photoGraphError, signatureAttachment,
            signatureError, screens, showScreensList, passbookAttachment, passbookError, previousEPF, iAgree, documentsList,
            viewAttachments, attachmentData, cloneDocumentsList, downloadModal, percent, fullFileName, deleteIndex, secretToken,
            removeAttachment, oldAadharAttachment, attachedCertificates, activatePan
        } = this.state;
        const apiData = JSON.parse(this.props.route.params.apiData);
        const projectName = apiData.projectName;
        const designation = apiData.designationName;
        const bankList = apiData.sectionData.dropdown.banks;
        // console.log("@#@#@ BANK LIST: ", JSON.stringify(apiData.sectionData.dropdown.banks, null, 4));
        let professionalDetails = null;
        if(apiData.sectionData.oldData){
            professionalDetails = apiData.sectionData.oldData.professional;
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
                                                    title={"PROFESSIONAL DETAILS"}
                                                    titleStyle={[{fontWeight: 'bold', color: '#000000', fontSize: (fontSizeH4().fontSize)}, styles.boldFont]}
                                                    start={{x: 0, y: 0}}
                                                    end={{x: 0.7, y: 0}}
                                                    colors={["#039FFD", "#EA304F"]}
                                                />
                                            </View>
                                            <View style={[{flexDirection: 'row', justifyContent: 'space-evenly'}, getWidthnHeight(93), getMarginTop(1)]}>
                                                <View style={[{
                                                    borderColor: (submit && bankError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: getWidthnHeight(1).width,
                                                    borderStyle: (submit && bankError)? 'dashed' : 'solid', borderWidth: (submit && bankError)? 2 : 1,
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
                                                        value={+bankID}
                                                    />
                                                </View>
                                            </View>
                                            <View style={[{alignItems: 'center'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                <View>
                                                    <AnimatedTextInput 
                                                        placeholder=" Name as per Bank Passbook* "
                                                        placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                        value={name}
                                                        slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                        slideHorizontal={[0, getWidthnHeight(-5.5).width]}
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
                                                        style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(87, 6.5), getMarginHorizontal(2)]}
                                                    />
                                                </View>
                                                <View style={[{flexDirection: 'row', justifyContent: 'space-evenly'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                    <AnimatedTextInput 
                                                        placeholder=" Bank A/C No* "
                                                        placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                        value={bankAC}
                                                        keyboardType={'numeric'}
                                                        maxLength={18}
                                                        slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                        slideHorizontal={[0, getWidthnHeight(-3).width]}
                                                        placeholderScale={[1, 0.75]}
                                                        autoFocus={false}
                                                        onChangeText={(value) => {
                                                            this.setState({ bankAC: value.replace(/[^0-9]/g, '') }, () => {
                                                                const {bankAC} = this.state;
                                                                if(bankAC !== '' && bankAC.length >= 9){
                                                                    this.setState({bankACError: false})
                                                                }else if(bankAC === ''){
                                                                    this.setState({bankACError: true}, () => Keyboard.dismiss())
                                                                }else if(bankAC.length < 9){
                                                                    this.setState({bankACError: true})
                                                                }
                                                            })
                                                        }}
                                                        clearText={() => this.setState({bankAC: '', bankACError: true})}
                                                        containerColor={[(submit && bankACError)? 'red' : '#C4C4C4', (submit && bankACError)? 'red' : '#C4C4C4']}
                                                        containerBorderWidth={[(submit && bankACError)? 2 : 1, 1]}
                                                        containerStyle={[{
                                                            borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && bankACError)? 'dashed' : 'solid',
                                                        }, getWidthnHeight(42, 6.5)]}
                                                        style={[{
                                                            borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2),
                                                            color: (bankAC.length >= 9)? 'black' : 'red'
                                                        }, getWidthnHeight(40, 6.5), getMarginHorizontal(2)]}
                                                    />
                                                    <AnimatedTextInput 
                                                        placeholder=" Confirm Bank A/C No*"
                                                        placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                        value={confirmBankAC}
                                                        editable={(bankACError)? false : true}
                                                        keyboardType={'numeric'}
                                                        maxLength={18}
                                                        slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                        slideHorizontal={[0, getWidthnHeight(-4.5).width]}
                                                        placeholderScale={[1, 0.75]}
                                                        autoFocus={false}
                                                        onChangeText={(value) => {
                                                            this.setState({ confirmBankAC: value.replace(/[^0-9]/g, '') }, () => {
                                                                const {confirmBankAC} = this.state;
                                                                if(confirmBankAC === ''){
                                                                    this.setState({confirmBankACError: true}, () => Keyboard.dismiss())
                                                                }
                                                                if((bankAC === confirmBankAC) && (confirmBankAC.length >= 9)){
                                                                    this.setState({confirmBankACError: false})
                                                                }
                                                                if(confirmBankAC.length < 9){
                                                                    this.setState({confirmBankACError: true})
                                                                }
                                                            })
                                                        }}
                                                        clearText={() => this.setState({confirmBankAC: '', confirmBankACError: true})}
                                                        containerColor={[(submit && confirmBankACError)? 'red' : '#C4C4C4', (submit && confirmBankACError)? 'red' : '#C4C4C4']}
                                                        containerBorderWidth={[(submit && confirmBankACError)? 2 : 1, 1]}
                                                        containerStyle={[{
                                                            borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && confirmBankACError)? 'dashed' : 'solid',
                                                        }, getWidthnHeight(42, 6.5)]}
                                                        style={[{
                                                            borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2),
                                                            color: (bankAC === confirmBankAC)? 'black' : 'red'
                                                        }, getWidthnHeight(40, 6.5), getMarginHorizontal(2)]}
                                                    />
                                                </View>
                                            </View>
                                            <View style={[{flexDirection: 'row', justifyContent: 'space-evenly'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                <AnimatedTextInput 
                                                    placeholder=" IFSC Code* "
                                                    placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                    value={ifsc}
                                                    slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                    slideHorizontal={[0, getWidthnHeight(-2).width]}
                                                    placeholderScale={[1, 0.75]}
                                                    autoFocus={false}
                                                    maxLength={11}
                                                    autoCapitalize={"characters"}
                                                    onChangeText={(text) => {
                                                        const regEx = /^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/;
                                                        this.setState({ ifsc: text.replace(/[^a-zA-Z0-9]/gi,'') }, () => {
                                                            const {ifsc} = this.state;
                                                            if(ifsc === ''){
                                                                this.setState({ifsc: '', ifscError: true}, () => Keyboard.dismiss())
                                                            }
                                                            if(regEx.test(ifsc)){
                                                                this.setState({ifscError: false})
                                                            }else{
                                                                this.setState({ifscError: true})
                                                            }
                                                        })
                                                    }}
                                                    clearText={() => this.setState({ifsc: '', ifscError: true})}
                                                    containerColor={[(submit && ifscError)? 'red' : '#C4C4C4', (submit && ifscError)? 'red' : '#C4C4C4']}
                                                    containerBorderWidth={[(submit && ifscError)? 2 : 1, 1]}
                                                    containerStyle={[{
                                                        borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && ifscError)? 'dashed' : 'solid',
                                                    }, getWidthnHeight(42, 6.5)]}
                                                    style={[{
                                                        borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2),
                                                        color: (ifscError)? 'red' : 'black'
                                                    }, getWidthnHeight(40, 6.5), getMarginHorizontal(2)]}
                                                />
                                                <AnimatedTextInput 
                                                    placeholder=" Confirm IFSC Code* "
                                                    placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                    value={confirmIFSC}
                                                    editable={(!ifscError)? true : false}
                                                    slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                    slideHorizontal={[0, getWidthnHeight(-3.5).width]}
                                                    placeholderScale={[1, 0.75]}
                                                    autoFocus={false}
                                                    maxLength={11}
                                                    autoCapitalize={"characters"}
                                                    onChangeText={(text) => {
                                                        const regEx = /^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/;
                                                        this.setState({ confirmIFSC: text.replace(/[^a-z0-9]/gi,'') }, () => {
                                                            const {confirmIFSC} = this.state;
                                                            if(confirmIFSC === ''){
                                                                this.setState({confirmIFSC: '', confirmIFSCError: true}, () => Keyboard.dismiss())
                                                            }
                                                            if(regEx.test(confirmIFSC)){
                                                                this.setState({confirmIFSCError: false})
                                                            }else{
                                                                this.setState({confirmIFSCError: true})
                                                            }
                                                        })
                                                    }}
                                                    clearText={() => this.setState({confirmIFSC: '', confirmIFSCError: true})}
                                                    containerColor={[(submit && confirmIFSCError)? 'red' : '#C4C4C4', (submit && confirmIFSCError)? 'red' : '#C4C4C4']}
                                                    containerBorderWidth={[(submit && confirmIFSCError)? 2 : 1, 1]}
                                                    containerStyle={[{
                                                        borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && confirmIFSCError)? 'dashed' : 'solid',
                                                    }, getWidthnHeight(42, 6.5)]}
                                                    style={[{
                                                        borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2),
                                                        color: (ifsc === confirmIFSC)? 'black' : 'red'
                                                    }, getWidthnHeight(40, 6.5), getMarginHorizontal(2)]}
                                                />
                                            </View>
                                            <View style={[{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, getWidthnHeight(85), getMarginTop(2)]}>
                                                <View>
                                                    <Text style={[{color: 'grey', paddingBottom: getMarginTop(1).marginTop}, fontSizeH4()]}>Cancel Cheque / Bank Pass Book Copy (pdf)*</Text>
                                                    {(professionalDetails) &&
                                                        <View style={[{flexDirection: 'row', justifyContent: 'space-between'}, getWidthnHeight(15)]}>
                                                            <TouchableOpacity onPress={() => {
                                                                console.log("PRINT CANCEL CHEQUE: ", professionalDetails.cancel_cheque, null, 'cancel_cheque');
                                                                this.checkExistingDownloads(professionalDetails.cancel_cheque, null, 'cancel_cheque');
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
                                                        this.addAttachment(bankPassbook)
                                                    }}
                                                >
                                                    {(passbookError)?
                                                        <View style={[{
                                                            width: getWidthnHeight(13).width, height: getWidthnHeight(13).width, 
                                                            backgroundColor: 'rgba(11, 142, 232, 0.2)', alignItems: 'center', justifyContent: 'center',
                                                            borderRadius: getWidthnHeight(1).width, borderWidth: (submit && passbookError)? 2 : 0,
                                                            borderColor: (submit && passbookError)? 'red' : 'transparent',
                                                            borderStyle: (submit && passbookError)? 'dashed' : null
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
                                            <View style={[{flexDirection: 'row', justifyContent: 'space-evenly'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                <View>
                                                    <AnimatedTextInput 
                                                        placeholder=" Aadhar Number* "
                                                        placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                        value={aadharNumber}
                                                        slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                        slideHorizontal={[0, getWidthnHeight(-3).width]}
                                                        placeholderScale={[1, 0.75]}
                                                        keyboardType={'numeric'}
                                                        maxLength={12}
                                                        autoFocus={false}
                                                        onChangeText={(value) => {
                                                            const aadharValue = value.replace(/[^0-9]/g, '');
                                                            this.setState({ aadharNumber: aadharValue}, () => {
                                                                const {aadharNumber} = this.state;
                                                                if(aadharNumber !== '' && aadharNumber.length === 12){
                                                                    this.setState({aadharNumberError: false})
                                                                }else if(aadharNumber === ''){
                                                                    this.setState({aadharNumber: '', aadharNumberError: true}, () => Keyboard.dismiss())
                                                                }else if(aadharNumber.length < 12){
                                                                    this.setState({aadharNumberError: true})
                                                                }
                                                            })
                                                        }}
                                                        clearText={() => this.setState({aadharNumber: '', aadharNumberError: true})}
                                                        containerColor={[(submit && aadharNumberError)? 'red' : '#C4C4C4', (submit && aadharNumberError)? 'red' : '#C4C4C4']}
                                                        containerBorderWidth={[(submit && aadharNumberError)? 2 : 1, 1]}
                                                        containerStyle={[{
                                                            borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && aadharNumberError)? 'dashed' : 'solid',
                                                        }, getWidthnHeight(42, 6.5)]}
                                                        style={[{
                                                            borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2),
                                                            color: (aadharNumberError)? 'red' : 'black'
                                                        }, getWidthnHeight(40, 6.5), getMarginHorizontal(1)]}
                                                    />
                                                </View>
                                                <View>
                                                    <AnimatedTextInput 
                                                        placeholder=" Name on Aadhar* "
                                                        placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                        value={aadharName}
                                                        slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                        slideHorizontal={[0, getWidthnHeight(-3.3).width]}
                                                        placeholderScale={[1, 0.75]}
                                                        autoFocus={false}
                                                        autoCapitalize={'words'}
                                                        onChangeText={(name) => {
                                                            const text = name.replace(/[^A-Za-z ]/gi,'')
                                                            this.setState({ aadharName: text.trimLeft()}, () => {
                                                                const {aadharName} = this.state;
                                                                if(aadharName !== ''){
                                                                    this.setState({aadharNameError: false})
                                                                }else{
                                                                    this.setState({aadharName: '', aadharNameError: true}, () => Keyboard.dismiss())
                                                                }
                                                            })
                                                        }}
                                                        clearText={() => this.setState({aadharName: '', aadharNameError: true})}
                                                        containerColor={[(submit && aadharNameError)? 'red' : '#C4C4C4', (submit && aadharNameError)? 'red' : '#C4C4C4']}
                                                        containerBorderWidth={[(submit && aadharNameError)? 2 : 1, 1]}
                                                        containerStyle={[{
                                                            borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && aadharNameError)? 'dashed' : 'solid',
                                                        }, getWidthnHeight(42, 6.5)]}
                                                        style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(40, 6.5), getMarginHorizontal(1)]}
                                                    />
                                                </View>
                                            </View>
                                            <View style={[{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, getWidthnHeight(85), getMarginTop(2)]}>
                                                <View style={{alignItems: 'flex-start'}}>
                                                    <Text style={[{color: 'grey'}, fontSizeH4()]}>Aadhar Card (Self Attested)*</Text>
                                                    {(oldAadharAttachment.length === 0)?
                                                        <Text style={[{color: 'grey'}, fontSizeH4()]}>(Front and Back)(pdf)</Text>
                                                    :
                                                        <View style={{flexDirection: 'row'}}>
                                                            <Text style={[{color: 'grey'}, fontSizeH4()]}>(Front and Back)(pdf)</Text>
                                                            <TouchableOpacity onPress={() => {
                                                                this.setState({
                                                                    viewAttachments: true, deleteIndex: null, removeAttachment: 'adhaar'
                                                                })
                                                            }}>
                                                                <Text style={[{color: colorTitle}, fontSizeH4(), getMarginLeft(1)]}>(Tap to view)</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    }
                                                </View>
                                                <TouchableOpacity
                                                    activeOpacity={0.5}
                                                    onPress={() => {
                                                        this.addAttachment(aadharCard)
                                                    }}
                                                >
                                                    {(aadharAttachmentError)?
                                                        <View style={[{
                                                            width: getWidthnHeight(13).width, height: getWidthnHeight(13).width, 
                                                            backgroundColor: 'rgba(11, 142, 232, 0.2)', alignItems: 'center', justifyContent: 'center',
                                                            borderRadius: getWidthnHeight(1).width, borderWidth: (submit && aadharAttachmentError)? 2 : 0,
                                                            borderColor: (submit && aadharAttachmentError)? 'red' : 'transparent',
                                                            borderStyle: (submit && aadharAttachmentError)? 'dashed' : null
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
                                            <View style={[{flexDirection: 'row', justifyContent: 'space-evenly'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                <View>
                                                    <AnimatedTextInput 
                                                        placeholder=" PAN Number* "
                                                        placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                        value={panNumber}
                                                        slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                        slideHorizontal={[0, getWidthnHeight(-3).width]}
                                                        placeholderScale={[1, 0.75]}
                                                        maxLength={10}
                                                        autoFocus={false}
                                                        autoCapitalize={'characters'}
                                                        onChangeText={(value) => {
                                                            const regEx = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/;
                                                            this.setState({ panNumber: value.replace(/[^a-zA-Z0-9]/gi,'')}, () => {
                                                                const {panNumber} = this.state;
                                                                if(panNumber !== ''){
                                                                    //this.setState({panNumberError: false})
                                                                }else{
                                                                    this.setState({panNumber: '', panNumberError: true}, () => Keyboard.dismiss())
                                                                }
                                                                if(regEx.test(panNumber)){
                                                                    this.setState({panNumberError: false})
                                                                }else{
                                                                    this.setState({panNumberError: true})
                                                                }
                                                            })
                                                        }}
                                                        clearText={() => this.setState({panNumber: '', panNumberError: true})}
                                                        containerColor={[(activatePan && panNumberError)? 'red' : '#C4C4C4', (activatePan && panNumberError)? 'red' : '#C4C4C4']}
                                                        containerBorderWidth={[(activatePan && panNumberError)? 2 : 1, 1]}
                                                        containerStyle={[{
                                                            borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (activatePan && panNumberError)? 'dashed' : 'solid',
                                                        }, getWidthnHeight(42, 6.5)]}
                                                        style={[{
                                                            borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2),
                                                            color: (panNumberError)? 'red' : 'black'
                                                        }, getWidthnHeight(40, 6.5), getMarginHorizontal(1)]}
                                                    />
                                                </View>
                                                <View>
                                                    <AnimatedTextInput 
                                                        placeholder=" Name on PAN* "
                                                        placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                        value={panName}
                                                        slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                        slideHorizontal={[0, getWidthnHeight(-3.3).width]}
                                                        placeholderScale={[1, 0.75]}
                                                        autoFocus={false}
                                                        autoCapitalize={'words'}
                                                        onChangeText={(name) => {
                                                            const text = name.replace(/[^A-Za-z ]/gi,'');
                                                            this.setState({ panName: text.trimLeft()}, () => {
                                                                const {panName} = this.state;
                                                                if(panName !== ''){
                                                                    this.setState({panNameError: false})
                                                                }else{
                                                                    this.setState({panName: '', panNameError: true}, () => Keyboard.dismiss())
                                                                }
                                                            })
                                                        }}
                                                        clearText={() => this.setState({panName: '', panNameError: true})}
                                                        containerColor={[(activatePan && panNameError)? 'red' : '#C4C4C4', (activatePan && panNameError)? 'red' : '#C4C4C4']}
                                                        containerBorderWidth={[(activatePan && panNameError)? 2 : 1, 1]}
                                                        containerStyle={[{
                                                            borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (activatePan && panNameError)? 'dashed' : 'solid',
                                                        }, getWidthnHeight(42, 6.5)]}
                                                        style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(40, 6.5), getMarginHorizontal(1)]}
                                                    />
                                                </View>
                                            </View>
                                            <View style={[{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, getWidthnHeight(85), getMarginTop(2)]}>
                                                <View>
                                                    <Text style={[{color: 'grey', paddingBottom: getMarginTop(1).marginTop}, fontSizeH4()]}>PAN Card (Self Attested)*</Text>
                                                    {(professionalDetails && (professionalDetails.pan_card_file !== 'null' || professionalDetails.pan_card_file !== null || professionalDetails.pan_card_file!== '')) &&
                                                        <View style={[{flexDirection: 'row', justifyContent: 'space-between'}, getWidthnHeight(15)]}>
                                                            <TouchableOpacity onPress={() => {
                                                                this.checkExistingDownloads(professionalDetails.pan_card_file, null, 'pan_card');
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
                                                        this.addAttachment(panCard)
                                                    }}
                                                >
                                                    {(panAttachmentError)?
                                                        <View style={[{
                                                            width: getWidthnHeight(13).width, height: getWidthnHeight(13).width, 
                                                            backgroundColor: 'rgba(11, 142, 232, 0.2)', alignItems: 'center', justifyContent: 'center',
                                                            borderRadius: getWidthnHeight(1).width, borderWidth: (activatePan && panAttachmentError)? 2 : 0,
                                                            borderColor: (activatePan && panAttachmentError)? 'red' : 'transparent',
                                                            borderStyle: (activatePan && panAttachmentError)? 'dashed' : null
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
                                            {/* <View style={[{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}, getWidthnHeight(85), getMarginTop(2)]}>
                                                <Text style={[{color: 'grey'}, fontSizeH4()]}>Has EPF in last organisation</Text>
                                                <View style={[{borderColor: 'red', borderWidth: 0}]}>
                                                    <Slider 
                                                        activeColor={colorTitle} 
                                                        //inactiveColor={'red'}
                                                        //buttonColor={'red'}
                                                        // buttonBorderColor={'blue'}
                                                        value={previousEPF}
                                                        onSlide={(previousEPF) => this.setState({previousEPF})}
                                                        delay={300}
                                                    />
                                                </View>
                                            </View> */}
                                            {/* {(previousEPF) &&
                                                <View style={[{alignItems: 'center'}, getWidthnHeight(93), getMarginTop(2)]}>
                                                    <AnimatedTextInput 
                                                        placeholder=" UAN Number "
                                                        placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                        value={uan}
                                                        keyboardType={'numeric'}
                                                        maxLength={12}
                                                        slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                        slideHorizontal={[0, getWidthnHeight(-3).width]}
                                                        placeholderScale={[1, 0.75]}
                                                        autoFocus={false}
                                                        onChangeText={(number) => {
                                                            this.setState({ uan: number.trimLeft() }, () => {
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
                                                        }, getWidthnHeight(87, 6.5)]}
                                                        style={[{
                                                            borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2),
                                                            color: (uanError)? 'red' : 'black'
                                                        }, getWidthnHeight(85, 6.5), getMarginHorizontal(1)]}
                                                    />
                                                </View>
                                            } */}
                                            <View style={[{backgroundColor: 'rgba(196, 196, 196, 0.5)', height: 1}, getWidthnHeight(87), getMarginTop(3)]}/>
                                            <View style={[{alignSelf: 'flex-start'}, getMarginLeft(3), getMarginTop(2)]}>
                                                <MaskedGradientText
                                                    title={"UPLOAD DOCUMENTS"}
                                                    titleStyle={[{fontWeight: 'bold', color: '#000000', fontSize: (fontSizeH4().fontSize)}, styles.boldFont]}
                                                    start={{x: 0, y: 0}}
                                                    end={{x: 0.4, y: 0}}
                                                    colors={["#039FFD", "#EA304F"]}
                                                />
                                                <View style={[getMarginTop(1), getMarginRight(2)]}>
                                                    <Text numberOfLines={2} style={{fontSize: fontSizeH4().fontSize - 2, textAlign: 'justify'}}>
                                                        (Allowed file format: jpg, jpeg, png, pdf. File size must be less than 1 MB.)
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={[{borderColor: 'red', borderWidth: 0}, getMarginTop(1), getWidthnHeight(85)]}>
                                                <FlatList 
                                                    data={documentsList}
                                                    keyExtractor={(item) => `${item.name}`}
                                                    renderItem={({item, index}) => {
                                                        const {cloneDocumentsList} = this.state;
                                                        let showButtons = false;
                                                        const cloneData = JSON.parse(cloneDocumentsList);
                                                        if(cloneData[index]){
                                                            showButtons = true;
                                                        }
                                                        if(item?.extension){
                                                            return null;
                                                        }
                                                        //console.log("DATA LIST: ", documentsList);
                                                        return (
                                                            <View style={[{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderColor: 'red', borderWidth: 0}, getWidthnHeight(85), getMarginTop(2)]}>
                                                                <View>
                                                                    {(item.extension)?
                                                                        <Text style={[{color: 'grey', paddingBottom: getMarginTop(1).marginTop}, fontSizeH4(), getWidthnHeight(70)]}>{`${item.name} (${item.mime_type})(optional)`}</Text>
                                                                    :
                                                                        <Text style={[{color: 'grey', paddingBottom: getMarginTop(1).marginTop}, fontSizeH4(), getWidthnHeight(70)]}>{`${item.name} (${item.mime_type})*`}</Text>
                                                                    }
                                                                    {((Array.isArray(item.old_value) && item.old_value.length > 0) && showButtons) &&
                                                                        <TouchableOpacity 
                                                                            onPress={() => {
                                                                                this.setState({
                                                                                    viewAttachments: true, deleteIndex: index, removeAttachment: null
                                                                                })
                                                                            }}
                                                                        >
                                                                            <Text style={[{color: colorTitle}, fontSizeH4()]}>(Tap to view)</Text>
                                                                        </TouchableOpacity>
                                                                    }
                                                                    {(Boolean(item.old_value) && showButtons && !item.multiple) &&
                                                                        <View>
                                                                            <TouchableOpacity 
                                                                                onPress={() => {
                                                                                    this.checkExistingDownloads(item.old_value, item.id, null);
                                                                                }}
                                                                            >
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
                                                                        this.addDocuments(item, index)
                                                                    }}
                                                                >
                                                                    {(item.blank)?
                                                                        <View style={[{
                                                                            width: getWidthnHeight(13).width, height: getWidthnHeight(13).width, 
                                                                            backgroundColor: 'rgba(11, 142, 232, 0.2)', alignItems: 'center', justifyContent: 'center',
                                                                            borderRadius: getWidthnHeight(1).width, borderWidth: (submit && item.blank && !item.extension)? 2 : 0,
                                                                            borderColor: (submit && item.blank && !item.extension)? 'red' : 'transparent',
                                                                            borderStyle: (submit && item.blank && !item.extension)? 'dashed' : null
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
                                                        )
                                                    }}
                                                />
                                            </View>
                                            <View style={[{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between'}, getWidthnHeight(85), getMarginTop(2)]}>
                                                <TouchableOpacity 
                                                    onPress={() => {
                                                        this.setState({iAgree: !iAgree})
                                                    }}
                                                >
                                                    <View style={{
                                                        alignItems: 'flex-start', justifyContent: 'flex-start',
                                                        width: getWidthnHeight(10).width, height: getWidthnHeight(12).width
                                                    }}>
                                                        {(iAgree)? 
                                                            <MaterialCommunityIcons name="checkbox-marked" size={getWidthnHeight(7).width} color={colorTitle}/>
                                                        :
                                                            <MaterialCommunityIcons 
                                                                name='checkbox-blank' 
                                                                color={(submit &&!iAgree)? 'red' : 'rgba(146, 146, 146, 0.5)'} 
                                                                size={getWidthnHeight(7).width}
                                                            />
                                                        }
                                                    </View>
                                                </TouchableOpacity>
                                                <Text numberOfLines={5} style={{flex: 1, fontSize: fontSizeH4().fontSize - 2, textAlign: 'justify'}}>
                                                    I affirm that I have read, understood and agreed all the employment detail / requirements thoroughly. I
                                                    hereby willingly give  my consent and  assign my above uploaded signature on employment agreement,
                                                    PF / ESI and other forms.
                                                </Text>
                                            </View>
                                            <View style={[getWidthnHeight(86), getMarginTop(2)]}>
                                                <Text numberOfLines={2} style={{flex: 1, fontSize: fontSizeH4().fontSize - 2, textAlign: 'justify'}}>
                                                    (Signature should be done on white peace of paper, take a picture and upload the image.)
                                                </Text>
                                            </View>
                                            <View style={[getWidthnHeight(86), getMarginTop(1)]}>
                                                <Text numberOfLines={2} style={{flex: 1, fontSize: fontSizeH4().fontSize - 2, textAlign: 'justify'}}>
                                                    (Your uploaded signature will be used on PF, ESI and Contract forms as required.)
                                                </Text>
                                            </View>
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
                                                    data={(removeAttachment)? oldAadharAttachment : attachedCertificates}
                                                    documentsList={documentsList}
                                                    cloneDocumentsList={cloneDocumentsList}
                                                    deleteIndex={deleteIndex}
                                                    apiData={this.props.route.params.apiData}
                                                    baseURL={baseURL}
                                                    downloadColor={downloadColor}
                                                    secretToken={secretToken}
                                                    staticValue={removeAttachment}
                                                    updateDocuments={(cloneData) => this.setState({cloneDocumentsList: cloneData})}
                                                    updateAttachment={(updateData) => this.updateAttachment(updateData)}
                                                    downloadAttachment={(attachment, docID, document) => {
                                                        const {deleteIndex, removeAttachment} = this.state;
                                                        if(removeAttachment){
                                                            this.checkExistingDownloads(attachment, docID, document);
                                                        }else{
                                                            this.checkExistingDownloads(attachment, docID, document)
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
    }
})

export default ProfessionalDetails;