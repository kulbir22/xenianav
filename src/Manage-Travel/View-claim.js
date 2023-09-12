import React from 'react';
import {
    StyleSheet, Text, TouchableOpacity, Platform,
    TouchableHighlight, View, PermissionsAndroid,
    FlatList, ScrollView, Animated, Image, KeyboardAvoidingView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ListItem, Avatar} from 'react-native-elements';
import {
    AlertBox, getWidthnHeight, WaveHeader, getMarginTop, getMarginLeft, CustomTextInput, Spinner, Approve_Pay, DownloadModal, IOS_StatusBar,
    statusBarGradient, Circle, fontSize_H3, fontSizeH4, getMarginRight, getMarginVertical, getMarginBottom, getMarginHorizontal} from '../NewComponents/common'
import LinearGradient from 'react-native-linear-gradient';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import CheckBox from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-material-dropdown';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import moment from 'moment';
import axios from 'axios';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import RNBackgroundDownloader from 'react-native-background-downloader';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS, { exists } from 'react-native-fs';
import {extractBaseURL, getClaimDocumentAttachmentAPI} from '../api/BaseURL';
import { Alert } from 'react-native';

const colorBase = '#25A2F9';
const colorTitle = '#0B8EE8';
const message = "Please fill the fields highlighted in RED"

export default class View_claim extends React.Component {
    constructor(props) {
    super(props);
        this.state = {
            remark:'',
            index:'0',
            twoindex:'0',
            status:'',
            position:'',
            activecircle:false,
            activecirclehod:false,
            activecircleauditor:false,
            activecirclemd:false,
            activecircleauditor2:false,
            animateItinerary: new Animated.Value(0),
            itineraryFullHeight: false,
            animateStay: new Animated.Value(0),
            stayFullHeight: false,
            animateDocuments: new Animated.Value(0),
            documentsFullHeight: false,
            animateProgressBar: new Animated.Value(0),
            animateProgressBG: new Animated.Value(0),
            comments: '',
            commentsError: true,
            submitClaim: false,
            baseURL: null,
            loading: false,
            alertTitle: '',
            alertColor: false,
            apiError: false,
            errorCode: null,
            apiCode: null,
            enableAlert: false,
            checkBox: false,
            allTravelCheckBox: false,
            allStayCheckBox: false,
            allDocumentsCheckBox: false,
            selectedTravel: null,
            claimTravel: [],
            claimStay: [],
            claimDocuments: [],
            sendBackTravel: [],
            sendBackStay: [],
            sendBackDocuments: [],
            sendBackData: false,
            submitApprovePay: false,
            utr: '',
            utrDate: '',
            profilePictureLink: '',
            secretToken: null,
            downloadLink: null,
            downloadFileName: '',
            fullFileName: '',
            fileSize: null,
            downloadModal: false,
            percent: 0,
            checkFile: false
        };
        this.props.navigation.setOptions({
            title: 'View Claim'
        })
    }

    async componentDidMount(){
        const {animateProgressBar, animateProgressBG} = this.state;
        if(Platform.OS === 'android'){
            this.getAndroidStoragePermission();
        }else if(Platform.OS === 'ios'){
            this.get_iOS_StoragePermission();
        }
        Animated.sequence([
            Animated.timing(animateProgressBar, {
                toValue: 1,
                duration: 2000
            }),
            Animated.loop(
                Animated.sequence([
                    Animated.timing(animateProgressBG, {
                        toValue: 1,
                        duration: 2000
                    }),
                    Animated.delay(1000),
                    Animated.spring(animateProgressBG, {
                        toValue: 0,
                        duration: 500
                    }),
                ])
            )
        ]).start()
        this.getTravel();
        this.getStay();
        this.getDocuments();
        await extractBaseURL().then((baseURL) => {
            this.setState({baseURL}, () => console.log("EXTRACT LINK AMAN: ", this.state.baseURL))
        })
        const userDetails = await AsyncStorage.getItem('userObj');
        const userObj = JSON.parse(userDetails);
        const profilePicture = userObj.success.user.employee.profile_picture;
        const commonText = 'profile-pics';
        const breakLink = profilePicture.split(commonText);
        const link = `${breakLink[0]}${commonText}`
        this.setState({profilePictureLink: link}, () => console.log("PROFILE PICTURE LINK: ", this.state.profilePictureLink))
        this.setState({secretToken: userObj.success.secret_token});
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
        const {downloadFileName, downloadLink, secretToken, loading} = this.state;
        console.log("BEFORE: ", secretToken, "\n\n", loading)
        if(!secretToken || !downloadLink || loading){
            return;
        }
        console.log("AFTER")
        this.showLoader();
    
        let downloadDir = null;
        if(Platform.OS === 'android'){
            downloadDir = RNFetchBlob.fs.dirs.DownloadDir;
        }else if(Platform.OS === 'ios'){
            downloadDir = RNFS.DocumentDirectoryPath;
        }
        const downloadPath = `${downloadDir}/V${number}_${downloadFileName}`;
        this.setState({fullFileName: `V${number}_${downloadFileName}`}, () => {
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
                                        this.setState({loading: false, downloadModal: false, fullFileName: ''})
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
            console.log('Download canceled due to error: ', error);
            this.setState({downloadModal: false, percent: 0, fullFileName: ''})
            this.hideLoader();
            Alert.alert("Error!", "Unable to Download File")
        });
    }

    async checkExistingDownloads(attachment, serialNo){
        const {loading} = this.state;
        if(loading){
            this.setState({downloadModal: true})
            return;
        }
        let lostTasks = await RNBackgroundDownloader.checkForExistingDownloads();
        console.log("$$$$### ANY DOWNLOADS: ", lostTasks, attachment, serialNo)
        if(lostTasks.length == 0){
            this.generateDownloadLink(attachment, serialNo)
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

    getTravel(){
        const {claim} = this.props.route.params;
        const claimTravel = claim.claims.claim_details.map((item) => {
            return {...item, checkBox: false}
        })
        this.setState({claimTravel}, () => console.log("### UNCHECK CLAIM TRAVEL: ", this.state.claimTravel[0]))
    }

    getStay(){
        const {claim} = this.props.route.params;
        let claimStay = [];
        if(claim.claims.claim_stay.length > 0){
            claimStay = claim.claims.claim_stay.map((item) => {
                return {...item, checkBox: false}
            })
        }
        this.setState({claimStay}, () => console.log("### UNCHECK CLAIM STAY: ", this.state.claimStay))
    }

    getDocuments(){
        const {claim} = this.props.route.params;
        let claimDocuments = [];
        if(claim.claims.claim_attachments.length > 0){
            claimDocuments = claim.claims.claim_attachments.map((item) => {
                return {...item, checkBox: false}
            })
        }
        this.setState({claimDocuments}, () => console.log("### UNCHECK CLAIM DOCUMENTS: ", this.state.claimDocuments))
    }

    travelCheck(checkTravel){
        const claimTravel = this.state.claimTravel.map((item, index) => {
            if(checkTravel === index && item.checkBox === false){  
                return {...item, checkBox: true}
            }else if(checkTravel === index && item.checkBox === true){
                return {...item, checkBox: false}
            }else{
                return {...item}
            }
        })
        this.setState({claimTravel}, () => {
            const {claimTravel} = this.state;
            let countFalse = 0;
            let countTrue = 0;
            for(let i = 0; i < claimTravel.length; i++){
                console.log(`\nCLAIM TRAVEL ${i + 1}: `, claimTravel[i])
                if(claimTravel[i]['checkBox'] === false){
                    countFalse += 1;
                }
                if(claimTravel[i]['checkBox'] === true){
                    countTrue += 1;
                }
            }
            console.log("### CHECK FALSE TRAVEL: ",  countFalse, "/", this.state.claimTravel.length)
            console.log("### CHECK TRUE TRAVEL: ",  countTrue, "/", this.state.claimTravel.length)
            if(countFalse === claimTravel.length){
                this.setState({allTravelCheckBox: false})
            }else if(countTrue === claimTravel.length){
                this.setState({allTravelCheckBox: true})
            }
        })
    }

    stayCheck(checkStay){
        const claimStay = this.state.claimStay.map((item, index) => {
            if(checkStay === index && item.checkBox === false){  
                return {...item, checkBox: true}
            }else if(checkStay === index && item.checkBox === true){
                return {...item, checkBox: false}
            }else{
                return {...item}
            }
        })
        this.setState({claimStay}, () => {
            const {claimStay} = this.state;
            let countFalse = 0;
            let countTrue = 0;
            for(let i = 0; i < claimStay.length; i++){
                console.log(`\nCLAIM STAY ${i + 1}: `, claimStay[i])
                if(claimStay[i]['checkBox'] === false){
                    countFalse += 1;
                }else if(claimStay[i]['checkBox'] === true){
                    countTrue += 1;
                }
            }
            console.log("### CHECK CLAIM STAY: ",  countFalse, "/", this.state.claimStay.length)
            if(countFalse === claimStay.length){
                this.setState({allStayCheckBox: false})
            }else if(countTrue === claimStay.length){
                this.setState({allStayCheckBox: true})
            }
        })
    }

    documentCheck(checkDocument){
        const claimDocuments = this.state.claimDocuments.map((item, index) => {
            if(checkDocument === index && item.checkBox === false){  
                return {...item, checkBox: true}
            }else if(checkDocument === index && item.checkBox === true){
                return {...item, checkBox: false}
            }else{
                return {...item}
            }
        })
        this.setState({claimDocuments}, () => {
            const {claimDocuments} = this.state;
            let countFalse = 0;
            let countTrue = 0;
            for(let i = 0; i < claimDocuments.length; i++){
                console.log(`\nCLAIM DOCUMENTS ${i + 1}: `, claimDocuments[i])
                if(claimDocuments[i]['checkBox'] === false){
                    countFalse += 1;
                }else if(claimDocuments[i]['checkBox'] === true){
                    countTrue += 1;
                }
            }
            console.log("### CHECK CLAIM DOCUMENTS: ",  countFalse, "/", this.state.claimDocuments.length)
            if(countFalse === claimDocuments.length){
                this.setState({allDocumentsCheckBox: false})
            }else if(countTrue === claimDocuments.length){
                this.setState({allDocumentsCheckBox: true})
            }
        })
    }

    showLoader(){
        this.setState({loading: true})
    }

    hideLoader(){
        this.setState({loading: false})
    }

    settwoindex=(value) => {
        const {twoindex} = this.state;
        this.setState({twoindex:value}, ()=>console.log(twoindex))
    }

    setindex=(value) => {
        const {index} = this.state;
        this.setState({index:value}, ()=>console.log(index))
    }

    renderItineraryItem = ({item, index}) => {
        const {manager} = this.props.route.params;
        const managerDetails = manager.user_role;
        let userRole = null;
        let managerID = null;
        if(managerDetails){
            userRole = managerDetails.user_role;
            managerID = managerDetails.manager_id;
        }
        let approvalData = [];
        approvalData = manager.approved_by_managers;
        let auditorStatus = '';
        let sendBack = false;
        if(approvalData.length === 2){
            const climberID = approvalData[1]['climber_user_id']
            auditorStatus = approvalData[1]['status'];
            if(auditorStatus === 'new' && managerID === climberID){
                sendBack = true;
            }
        }
        const changeBackground = {
            backgroundColor: (item.checkBox)? 'rgba(243, 139, 160, 0.5)' : 'white'
        }
        const conveyanceName = (item.expense_types.islocal === 0)? item.expense_types.name : `${item.expense_types.name} [Rs.${item.expense_types.price_per_km}/km]`;
        // console.log("RENDER ITINERARY", item)
        return(
            <View style={[{alignItems: 'center'}, getMarginTop(-1), getWidthnHeight(95)]}>
            <View style={[styles.flatlistcontainer, getWidthnHeight(90, 23)]}>
                <View style={[{flex: 1}, changeBackground]}>
                <View style={{flexDirection: 'row'}}>
                    <View style={[styles.triangleCornerl]}/>
                    <View style = {[{ position: 'absolute'}]}>
                        <Text style={[{fontSize:(fontSizeH4().fontSize - 1), color:'white',textAlignVertical:'center'}, getMarginLeft(1), getMarginTop(0.5)]}>{(index < 9)? `0${index + 1}` : (index + 1)}</Text>                
                    </View>
                    {(sendBack)?
                        <View style={[{flexDirection: 'row', borderWidth: 0, borderColor: 'black', justifyContent: 'space-between', alignItems: 'center'}, getWidthnHeight(75)]}>
                            <View style={[{borderWidth: 0, borderColor: 'red', justifyContent: 'center'}, getWidthnHeight(60, 5)]}>
                                <Text style={[{flex: 1, fontWeight:'bold', textAlignVertical: 'center'}, getMarginTop(0), getMarginLeft(0)]}>{moment(item.expense_date).format("DD-MM-YYYY")}</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.travelCheck(index)}>
                                {(item.checkBox) && 
                                    <Image source={require('../Image/checked.png')} style={{width: getWidthnHeight(6).width, height: getWidthnHeight(6).width}}/>
                                }
                                {(!item.checkBox) && 
                                    <Image source={require('../Image/unchecked.png')} style={{width: getWidthnHeight(6).width, height: getWidthnHeight(6).width}}/>
                                }
                            </TouchableOpacity>
                        </View>
                    :
                        <View style={[{borderWidth: 0, borderColor: 'red', justifyContent: 'center'}, getWidthnHeight(60, 5)]}>
                            <Text style={[{flex: 1, fontWeight:'bold', borderWidth: 0, borderColor: 'green', textAlignVertical: 'center'}, getMarginTop(0), getMarginLeft(0)]}>{moment(item.expense_date).format("DD-MM-YYYY")}</Text>
                        </View>
                    }
                </View>
                <View style={[{flexDirection: 'row', borderWidth: 0, borderColor: 'black', alignItems: 'center'}, getWidthnHeight(85, 5)]}>
                    <View style={{alignItems: 'center', flexDirection: 'row', width: getWidthnHeight(9).width, height: getWidthnHeight(9).width, borderColor: 'black', borderWidth: 0, justifyContent: 'flex-end'}}>
                        <View style={[{borderTopWidth: 3, borderLeftWidth: 3, borderBottomWidth: 3, borderColor: 'black'}, getWidthnHeight(3.5, 3)]}/>
                        <View style={[{borderColor: 'black', borderTopWidth: 0, justifyContent: 'flex-end'}, getWidthnHeight(4, 3.8), getMarginLeft(-2)]}>
                            <View style={[{borderWidth: 0, borderColor: 'red'}]}>
                                <View style={styles.arrow}/>
                            </View>
                        </View>
                    </View>                        
                    <View style={{justifyContent: 'space-between'}}>
                        <Text style={[{color:'black'}, fontSizeH4(), getMarginLeft(1)]}>{item.from_city.name}</Text>
                        <Text style={[{color:'black'}, fontSizeH4(), getMarginLeft(1)]}>{item.to_city.name}</Text>
                    </View>
                </View>
                <View style = {[{alignItems:'flex-start', flexDirection:'row'}, getMarginLeft(2.2), getMarginTop(0.5)]}>
                    <Text style = {[{color:'#565656', fontWeight:'bold'}, styles.boldFont, fontSize_H3() ]}> Conveyance: </Text>
                    <View style={{backgroundColor:'#DAE7F7'}}>
                        <Text style = {[{color:'#565656', fontWeight:'600', fontStyle:'italic'},fontSize_H3() ]}>{" " + conveyanceName + " "}</Text>
                    </View>
                </View>
                <View style ={[{flexDirection:"row", justifyContent: 'space-evenly', borderColor: 'black', borderWidth: 0}, getWidthnHeight(90), getMarginTop(1.5)]}>
                    <View style = {[{borderColor: 'red', borderWidth: 0, alignItems: 'center'}]}>
                        <View style={[{borderRadius: 10, backgroundColor: '#E83A31'}, getWidthnHeight(85/2.5, 7)]}>
                            <View style={{flexDirection:'row', flex: 1,justifyContent: 'space-evenly', alignItems: 'center'}}>    
                                <View style={[{
                                    borderWidth:0, borderColor: 'black', backgroundColor:'#F48D88', justifyContent:'center', width: getWidthnHeight(8).width, 
                                    height: getWidthnHeight(8).width, borderRadius: getWidthnHeight(8).width}]}>
                                    <View style={[{alignItems:'center'}]}>   
                                        <FontAwesome name='route' size={getWidthnHeight(4.5).width} color={'white'}/>
                                    </View> 
                                </View>    
                                <View>
                                    <Text style = {[{color:'#FFFEFF', fontWeight:'600'},fontSizeH4(), styles.boldFont]}>Distance</Text>
                                    <Text style = {[{color:'#FFFEFF', fontWeight:'bold'},fontSizeH4(), styles.boldFont]}>{(item.distance_in_km)? `${item.distance_in_km} Km` : '--'}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style = {[{borderColor: 'red', borderWidth: 0, alignItems: 'center'}]}>
                        <View style={[{borderRadius: 10, backgroundColor: '#E58F1E'}, getWidthnHeight(85/2.5, 7)]}>
                            <View style={{flexDirection:'row', flex: 1,justifyContent: 'space-evenly', alignItems: 'center'}}>    
                                <View style={[{
                                    borderWidth:0, borderColor: 'black', backgroundColor:'#EAA74E', justifyContent:'center', width: getWidthnHeight(8).width, 
                                    height: getWidthnHeight(8).width, borderRadius: getWidthnHeight(8).width}]}>
                                    <View style={[{alignItems:'center'}]}>   
                                        <FontAwesome name={'money-bill-alt'} size={getWidthnHeight(4.5).width} color={'white'}/>
                                    </View> 
                                </View>    
                                <View>
                                    <Text style = {[{color:'#FFFEFF', fontWeight:'600'},fontSizeH4(), styles.boldFont]}>Expected Cost</Text>
                                    <Text style = {[{color:'#FFFEFF', fontWeight:'bold'},fontSizeH4(), styles.boldFont]}>{`${"\u20B9"} ${item.amount}/-`}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            </View>
            </View>
        )
    }

    renderStayItem = ({item, index}) => {
        const {manager} = this.props.route.params;
        const managerDetails = manager.user_role;
        let userRole = null;
        let managerID = null;
        if(managerDetails){
            userRole = managerDetails.user_role;
            managerID = managerDetails.manager_id;
        }
        let approvalData = [];
        approvalData = manager.approved_by_managers;
        let auditorStatus = '';
        let sendBack = false;
        if(approvalData.length === 2){
            const climberID = approvalData[1]['climber_user_id']
            auditorStatus = approvalData[1]['status'];
            if(auditorStatus === 'new' && managerID === climberID){
                sendBack = true;
            }
        }
        const changeBackground = {
            backgroundColor: (item.checkBox)? 'rgba(243, 139, 160, 0.5)' : 'white'
        }
        const date1 = moment(item.from_date, "YYYY-MM-DD");
        const date2 = moment(item.to_date, "YYYY-MM-DD");
        const days = date2.diff(date1, 'days');
        console.log("### RENDER DAYS: ", days, item.from_date)
        return(
            <View style={[{alignItems: 'center'}, getMarginTop(-1), getWidthnHeight(95)]}>
            <View style={[styles.flatlistcontainer, getWidthnHeight(90, 17)]}>
                <View style={[{flex: 1}, changeBackground]}>
                    <View style={[styles.triangleCornerl]}/>
                    <View style = {[{position: 'absolute'}, getMarginLeft(1)]}>
                        <Text style={[{fontSize:(fontSizeH4().fontSize - 1), color:'white',textAlignVertical:'center'}]}>{(index < 9)? `0${index + 1}` : (index + 1)}</Text>                
                    </View>
                    <View style={[{flexDirection: 'row'}, getMarginTop(-4), getMarginLeft(4)]}>
                        <View style={[{borderColor: 'red', borderWidth: 0}, getWidthnHeight(75)]}>
                            <Text numberOfLines={1} style={[{color:'black'}, fontSizeH4(), getMarginLeft(5)]}>{item.state.name}</Text>
                            <View style={{flexDirection: 'row', borderColor: 'black', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center'}}>
                                <View style={[{
                                    backgroundColor: 'black', width: getWidthnHeight(2).width, height: getWidthnHeight(2).width, 
                                    justifyContent: 'center', borderRadius: getWidthnHeight(3).width}, getMarginLeft(5)]}
                                />
                                <Text numberOfLines={1} style={[{color:'black', borderColor: 'black', borderWidth: 0}, fontSizeH4(), getMarginLeft(2)]}>{item.city.name}</Text>
                            </View>
                        </View>
                        {(sendBack) &&
                            <View style={[{flexDirection: 'row', borderWidth: 0, borderColor: 'black', justifyContent: 'space-between', alignItems: 'center'}]}>
                                <TouchableOpacity onPress={() => this.stayCheck(index)}>
                                    {(item.checkBox) && 
                                        <Image source={require('../Image/checked.png')} style={{width: getWidthnHeight(6).width, height: getWidthnHeight(6).width}}/>
                                    }
                                    {(!item.checkBox) && 
                                        <Image source={require('../Image/unchecked.png')} style={{width: getWidthnHeight(6).width, height: getWidthnHeight(6).width}}/>
                                    }
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                    <View style = {[{alignItems:'center', flexDirection:'row'}, getMarginLeft(2.2), getMarginTop(1)]}>
                        <Text style = {[{color:'#565656', fontWeight: 'bold'}, styles.boldFont, fontSize_H3() ]}> Date(s): </Text>
                        <View style={{backgroundColor:'#DAE7F7'}}>
                            <Text style = {[{color:'#565656', fontStyle:'italic'}, fontSizeH4() ]}> {moment(item.from_date).format("DD-MM-YYYY")} </Text>
                        </View>
                        <Text style = {[{color:'#565656', fontWeight: 'bold', fontSize: fontSize_H3().fontSize - 3}, styles.boldFont]}> To </Text>
                        <View style={{backgroundColor:'#DAE7F7'}}>
                            <Text style = {[{color:'#565656', fontStyle:'italic'}, fontSizeH4() ]}> {moment(item.to_date).format("DD-MM-YYYY")} </Text>
                        </View>
                    </View>
                <View style ={[{flexDirection:"row", justifyContent: 'space-evenly', borderColor: 'red', borderWidth: 0, alignItems: 'center'}, getMarginTop(1.5), getWidthnHeight(90)]}>
                    <View>  
                        <View>
                            <View>
                                <View style={[{flexDirection:'row',backgroundColor:'#E83A31', borderRadius: 5, alignItems: 'center', justifyContent: 'center'},getWidthnHeight(75/3, 5)]}>    
                                    <View style={[{width: getWidthnHeight(8).width, height: getWidthnHeight(8).width, borderRadius: getWidthnHeight(8).width/2, justifyContent:'center', backgroundColor:'#F48D88'}]}>
                                        <View style={[{alignItems:'center'}]}>   
                                            <FontAwesome name='home' size={getWidthnHeight(4).width} color={'white'}/>
                                        </View> 
                                    </View>    
                                    <View style ={[getMarginLeft(1)]}>
                                        <Text style = {[{color:'#FFFEFF', fontSize: fontSizeH4().fontSize - 4} ]}>Stay Exp</Text>
                                        <Text style = {[{color:'#FFFEFF', fontWeight:'bold'},styles.boldFont, fontSizeH4() ]}>{`${"\u20B9"} ${item.rate_per_night * ((days === 0)? 1 : days)}/-`}</Text>
                                    </View>
                                </View>
                            </View>
                        </View> 
                    </View>
                    <View>
                        <View>
                            <View style={[{flexDirection:'row', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor:'#E58F1E'},getWidthnHeight(75/3, 5)]}>    
                                <View style={[{width: getWidthnHeight(8).width, height: getWidthnHeight(8).width, borderRadius: getWidthnHeight(8).width/2, backgroundColor:'#DBE8F8', justifyContent:'center', backgroundColor:'#EAA74E'}]}>
                                    <View style={[{alignItems:'center'}]}>   
                                        <FontAwesome name={'money-bill-alt'} size={getWidthnHeight(4).width} color={'white'}/>
                                    </View> 
                                </View>    
                                <View style ={[getMarginLeft(1)]}>
                                    <Text style = {[{color:'#FFFEFF', fontSize: fontSizeH4().fontSize - 4 }]}>{'DA'}</Text>
                                    <Text style = {[{color:'#FFFEFF', fontWeight:'bold'},styles.boldFont, fontSizeH4() ]}>{`${"\u20B9"} ${item.da * ((days === 0)? 1 : (days + 1))}/-`}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View>
                        <View>
                            <View style={[{flexDirection:'row', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor:'#00C9DA'},getWidthnHeight(75/3, 5)]}>    
                                <View style={[{width: getWidthnHeight(8).width, height: getWidthnHeight(8).width, borderRadius: getWidthnHeight(8).width/2, justifyContent:'center', backgroundColor:'#72DDE7'}]}>
                                    <View style={[{alignItems:'center'}]}>   
                                        <FontAwesome name={'money-bill-alt'} size={getWidthnHeight(4).width} color={'white'}/>
                                    </View> 
                                </View>    
                                <View style ={[getMarginLeft(1)]}>
                                    <Text style = {[{color:'#FFFEFF', fontSize: fontSizeH4().fontSize - 4}]}>{'Total'}</Text>
                                    <Text style = {[{color:'#FFFEFF', fontWeight:'bold'},styles.boldFont, fontSizeH4() ]}>{`${"\u20B9"} ${(item.rate_per_night * ((days === 0)? 1 : (days))) + (item.da * ((days === 0)? 1 : (days + 1)))}/-`}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                </View>
            </View>
            </View>
        )
    }


    renderdocument = ({item, index}) => {
        const {manager} = this.props.route.params;
        const managerDetails = manager.user_role;
        let userRole = null;
        let managerID = null;
        if(managerDetails){
            userRole = managerDetails.user_role;
            managerID = managerDetails.manager_id;
        }
        let approvalData = [];
        approvalData = manager.approved_by_managers;
        let auditorStatus = '';
        let sendBack = false;
        if(approvalData.length === 2){
            const climberID = approvalData[1]['climber_user_id']
            auditorStatus = approvalData[1]['status'];
            if(auditorStatus === 'new' && managerID === climberID){
                sendBack = true;
            }
        }
        const changeBackground = {
            backgroundColor: (item.checkBox)? 'rgba(243, 139, 160, 0.5)' : 'white'
        }
        const conveyanceName = (item.attachment_types.islocal === 0)? item.attachment_types.name : `${item.attachment_types.name} [Rs.${item.attachment_types.price_per_km}/km]`;
        console.log("DOCUMENTS: ", item)
        return(
            <View style={[{alignItems: 'center'}, getMarginTop(-1)]}>
                <View style={[styles.flatlistcontainer, getWidthnHeight(undefined,17)]}>
                    <View style={[{flex: 1}, changeBackground]}>
                    <View style={[styles.triangleCornerl]}/>
                    <View style={{position: 'absolute'}}>
                        <View style={[{flexDirection:'row'}]}>
                            <Text style={[{color:'white'}, fontSizeH4(), getMarginLeft(1)]}>{(index < 9)? `0${index + 1}` : (index + 1)}</Text>
                            <ScrollView horizontal style={[getWidthnHeight(70, 4), getMarginLeft(5)]}>
                                <Text style={[{color:'black', fontWeight:'bold', borderWidth: 0, borderColor: 'black'}, getMarginRight(2), styles.boldFont, getMarginTop(1)]}>{item.name.replace(/^\w/, (c) => c.toUpperCase())}</Text>
                            </ScrollView>
                            {(sendBack) && 
                                <View style={[{borderWidth: 0, borderColor: 'black', alignItems: 'flex-end'}, getMarginTop(0.5)]}>
                                    <TouchableOpacity onPress={() => this.documentCheck(index)}>
                                        {(item.checkBox) && 
                                            <Image source={require('../Image/checked.png')} style={{width: getWidthnHeight(6).width, height: getWidthnHeight(6).width}}/>
                                        }
                                        {(!item.checkBox) && 
                                            <Image source={require('../Image/unchecked.png')} style={{width: getWidthnHeight(6).width, height: getWidthnHeight(6).width}}/>
                                        }
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                    </View>
                    <View style={[getWidthnHeight(89), {alignItems: 'center'}]}>
                        <ScrollView showsHorizontalScrollIndicator={false} horizontal style={[getWidthnHeight(80, 4)]}>
                            <View style={[{borderColor: 'red', borderWidth: 0}]}>
                                <Text style = {[{color:'#565656'},fontSize_H3()]}>File Name: {item.attachment}</Text>
                            </View>
                        </ScrollView>
                        <View style={[{alignItems: 'flex-start'}, getWidthnHeight(80)]}>
                            <Text style = {[{color:'#565656'},fontSize_H3()]}>{conveyanceName}</Text>
                        </View>
                        <View style={[{alignSelf: 'flex-end'}, getMarginRight(2)]}>
                            <TouchableHighlight underlayColor="#3280E4" onPress= {() => this.checkExistingDownloads(item.attachment, (index + 1))} style={{width: getWidthnHeight(8).width,height: getWidthnHeight(8).width,borderRadius: getWidthnHeight(8).width, borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center'}}>
                                <View style={[{alignItems:'center'}]}>   
                                    <FontAwesomeIcons name='download' size={getWidthnHeight(5).width}/>
                                </View> 
                            </TouchableHighlight>    
                        </View>
                    </View>
                    </View>
                </View>
            </View>
        )
    }

    checkEntireTravel(){
        const  claimTravel = this.state.claimTravel.map((item) => {
            return {...item, checkBox: true}
        })
        this.setState({claimTravel})
    }

    uncheckEntireTravel(){
        const  claimTravel = this.state.claimTravel.map((item) => {
            return {...item, checkBox: false}
        })
        this.setState({claimTravel})
    }

    checkEntireStay(){
        const  claimStay = this.state.claimStay.map((item) => {
            return {...item, checkBox: true}
        })
        this.setState({claimStay})
    }

    uncheckEntireStay(){
        const claimStay = this.state.claimStay.map((item) => {
            return {...item, checkBox: false}
        })
        this.setState({claimStay})
    }

    checkEntireDocuments(){
        const claimDocuments = this.state.claimDocuments.map((item) => {
            return {...item, checkBox: true}
        })
        this.setState({claimDocuments})
    }

    uncheckEntireDocuments(){
        const claimDocuments = this.state.claimDocuments.map((item) => {
            return {...item, checkBox: false}
        })
        this.setState({claimDocuments})
    }

    itineraryScrollToTop(){
        this.scrollItinerary.scrollToIndex({animated: true, index: 0})
    }

    itineraryHeight(){
        const {animateItinerary, itineraryFullHeight} = this.state;
        if(!itineraryFullHeight){
            Animated.parallel([
                Animated.timing(animateItinerary, {
                    toValue: 1,
                    duration: 500
                })
            ]).start(() => {
                this.setState({itineraryFullHeight: true})
            })
        }else{
            this.itineraryScrollToTop();
            Animated.parallel([
                Animated.timing(animateItinerary, {
                    toValue: 0,
                    duration: 500
                })
            ]).start(() => {
                this.setState({itineraryFullHeight: false})
            })
        }
    }
  
    Itinerary = () => {
        const {animateItinerary, itineraryFullHeight, allTravelCheckBox, allStayCheckBox, allDocumentsCheckBox} = this.state;
        const {claim, manager} = this.props.route.params;
        const managerDetails = manager.user_role;
        let userRole = null;
        let managerID = null;
        if(managerDetails){
            userRole = managerDetails.user_role;
            managerID = managerDetails.manager_id;
        }
        const itineraryLength = claim.claims.claim_details.length;
        const stayArrayLength = claim.claims.claim_stay.length;
        const documentArrayLength = claim.claims.claim_attachments.length;
        let total_itenerary_amount = 0;
        let approvalData = [];
        approvalData = manager.approved_by_managers;
        let auditorStatus = '';
        let sendBack = false;
        if(approvalData.length === 2){
            const climberID = approvalData[1]['climber_user_id']
            auditorStatus = approvalData[1]['status'];
            if(auditorStatus === 'new' && managerID === climberID){
                sendBack = true;
            }
        }
        claim.claims.claim_details.forEach(item => {
            total_itenerary_amount += item.amount
        });
        const interpolateHeight = animateItinerary.interpolate({
            inputRange: [0, 1],
            outputRange: [(sendBack)? getWidthnHeight(undefined, 33).height : getWidthnHeight(undefined, 30).height, getWidthnHeight(undefined, 47).height]
        })
        const animatedStyle = {
            height: interpolateHeight
        }
        return (
            <View style={[getWidthnHeight(100), {alignItems: 'center'}]}>
                <View style = {[{flexDirection:'row',  marginTop:getMarginTop(1.2).marginTop, alignItems:'center'}, getWidthnHeight(95,5)]}>  
                    <LinearGradient start={{x: 0, y: 0}} end={{x: 0.4, y: 0}} colors={['#0255BF','#1968CF', '#2C7BE0']} style={[{ borderWidth: 0, borderColor: 'red', justifyContent:'center', alignItems:'center'},getWidthnHeight(95/3,5)]}>
                        <View style={[{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}, getWidthnHeight(95/3, 5)]}>
                            <TouchableHighlight style={[{borderWidth: 0, borderColor: 'red', justifyContent: 'center'}]} underlayColor="transparent" onPress= {() => this.setindex('0')}>
                                <Text style={[{textAlign:'center', color:'white'}, fontSizeH4()]}>Itinerary</Text>
                            </TouchableHighlight>
                            {(sendBack) &&
                                <View style={[{flexDirection: 'row', borderColor: 'red', borderWidth: 0, alignItems: 'center', justifyContent: 'center'}]}>
                                    <TouchableOpacity style={[{borderWidth: 0, borderColor: 'white', width: getWidthnHeight(6).width, height: getWidthnHeight(6).width}, getMarginHorizontal(1)]}
                                        onPress={() => this.setState({allTravelCheckBox: !this.state.allTravelCheckBox}, () => {
                                            const {allTravelCheckBox} = this.state;
                                            if(allTravelCheckBox){
                                                this.checkEntireTravel();
                                            }else{
                                                this.uncheckEntireTravel();
                                            }
                                        })}>
                                        {(allTravelCheckBox) && 
                                            <CheckBox name="checkbox-marked" size={getWidthnHeight(6).width} color="white"/>
                                        }
                                        {(!allTravelCheckBox) && 
                                            <CheckBox name="checkbox-blank" size={getWidthnHeight(6).width} color="white"/>
                                        }
                                    </TouchableOpacity>
                                </View>
                            }   
                        </View> 
                    </LinearGradient>
                    <TouchableHighlight style={[{borderWidth: 0, borderColor: 'red', justifyContent: 'center', backgroundColor:'#DAE7F7', alignItems: 'center'}]} underlayColor="#DAE7F7" onPress= {() => this.setindex('1')}>
                        <View style={[{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}, getWidthnHeight(95/3, 5)]}>
                            <Text style={[{textAlign:'center'}, fontSizeH4]}>Stay</Text>
                            {(sendBack && stayArrayLength > 0) &&
                                <View style={[{flexDirection: 'row', borderColor: 'red', borderWidth: 0, alignItems: 'center', justifyContent: 'center'}]}>
                                    <View style={[{borderWidth: 0, borderColor: 'white', width: getWidthnHeight(6).width, height: getWidthnHeight(6).width}, getMarginHorizontal(1)]}>
                                        {(allStayCheckBox) && 
                                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                                <View style={{position: 'absolute', backgroundColor: '#1968CF', width: getWidthnHeight(4).width, height: getWidthnHeight(4).width}}/>
                                                <CheckBox name="checkbox-marked" size={getWidthnHeight(6).width} color="white"/>
                                            </View>
                                        }
                                        {(!allStayCheckBox) && 
                                            <CheckBox name="checkbox-blank" size={getWidthnHeight(6).width} color="white"/>
                                        }
                                    </View>
                                </View>
                            }
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={[{borderWidth: 0, borderColor: 'red', justifyContent: 'center', alignItems: 'center', backgroundColor:'#DAE7F7'}]} underlayColor="#DAE7F7" onPress= {() => this.setindex('2')}>        
                        <View style={[{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}, getWidthnHeight(95/3, 5)]}>
                            <Text style={[{textAlign:'center'}, fontSizeH4()]}>Documents</Text>
                            {(sendBack && documentArrayLength > 0) &&
                                <View style={[{flexDirection: 'row', borderColor: 'red', borderWidth: 0, alignItems: 'center', justifyContent: 'center'}]}>
                                    <View style={[{borderWidth: 0, borderColor: 'white', width: getWidthnHeight(6).width, height: getWidthnHeight(6).width}, getMarginHorizontal(1)]}>
                                        {(allDocumentsCheckBox) && 
                                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                                <View style={{position: 'absolute', backgroundColor: '#1968CF', width: getWidthnHeight(4).width, height: getWidthnHeight(4).width}}/>
                                                <CheckBox name="checkbox-marked" size={getWidthnHeight(6).width} color="white"/>
                                            </View>
                                        }
                                        {(!allDocumentsCheckBox) && 
                                            <CheckBox name="checkbox-blank" size={getWidthnHeight(6).width} color="white"/>
                                        }
                                    </View>
                                </View>
                            }
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={[{flexDirection: 'row', borderBottomColor: '#1968CF', borderBottomWidth: 1}, getWidthnHeight(95)]}>
                    <View style={[{position: 'absolute', alignItems: 'center', justifyContent: 'flex-start', borderColor: 'red', borderWidth: 0, transform: [{translateY: -(getWidthnHeight(undefined, 1).height)}]}, getWidthnHeight(95/3, 2)]}>
                        <View style = {[styles.triangleCorner]}/>
                    </View>
                    <View style={[getWidthnHeight(95/3)]}/>
                    <View style={[getWidthnHeight(95/3)]}/>
                </View>
                <Animated.View style = {[{
                    borderTopWidth:0, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor:'#1968CF', alignItems: 'center'
                    }, getWidthnHeight(95), (itineraryLength > 1)? animatedStyle : (sendBack)? getWidthnHeight(undefined, 37) : getWidthnHeight(undefined, 33)]}>   
                    <View style={[getMarginVertical(1)]}>
                        {this.state.claimTravel.length > 0 ? 
                            <FlatList
                                ref={(ref) => this.scrollItinerary = ref}
                                nestedScrollEnabled ={(itineraryFullHeight)? true : false}
                                scrollEnabled={(itineraryFullHeight)? true : false}
                                data={this.state.claimTravel}
                                initialNumToRender = {this.state.claimTravel.length}
                                renderItem={this.renderItineraryItem}
                                keyExtractor={item => item.id}
                                ListFooterComponent = {() => {
                                    return(
                                        <View style ={[{alignItems:'center', justifyContent:'center',marginVertical:'4%'}]}>
                                            <Text style = {[{textAlign:'center', backgroundColor: '#DAE7F7'},fontSize_H3(), getWidthnHeight(35)]}>Total Itinerary Cost</Text>
                                            <Text style = {[{textAlign:'center', fontWeight:'bold'}, styles.boldFont, fontSize_H3()]}>{`${"\u20B9"} ${total_itenerary_amount}/-`}</Text>
                                        </View>
                                    )
                                }}
                            />
                        :
                            null
                        }
                    </View>
                </Animated.View>
                {(itineraryLength > 1) &&
                    <TouchableOpacity style={[getWidthnHeight(20, 5), {borderColor: 'red', borderWidth: 0, alignItems: 'center', justifyContent: 'center'}, getMarginTop(-2.5)]} 
                        onPress={() => this.itineraryHeight()}>
                        <View style={[{
                            width: getWidthnHeight(8).width, height: getWidthnHeight(8).width, borderRadius: getWidthnHeight(8).width, 
                            backgroundColor: '#1968CF', alignItems: 'center', justifyContent: 'center'}]}>
                                {(!itineraryFullHeight)?
                                    <Animated.View>
                                        <Text style={[{color: 'white', textAlign: 'center', textAlignVertical: 'center'}]}>{`+${itineraryLength - 1}`}</Text>
                                    </Animated.View>
                                :
                                    <Animated.View style={[{borderWidth: 0, borderColor: 'white'}]}>
                                        <FontAwesomeIcons name='angle-up' size={getWidthnHeight(5).width} color={'white'}/>
                                    </Animated.View>
                                }
                        </View>
                    </TouchableOpacity>
                }
            </View>
        )
    };
  
    stayScrollToTop(){
        this.scrollStay.scrollToIndex({animated: true, index: 0})
    }

    stayHeight(){
        const {animateStay, stayFullHeight} = this.state;
        if(!stayFullHeight){
            Animated.timing(animateStay, {
                toValue: 1,
                duration: 500
            }).start(() => {
                this.setState({stayFullHeight: true})
            })
        }else{
            this.stayScrollToTop();
            Animated.timing(animateStay, {
                toValue: 0,
                duration: 500
            }).start(() => {
                this.setState({stayFullHeight: false})
            })
        }
    }
  
    Stay = () => {
        const {animateStay, stayFullHeight, allTravelCheckBox, allStayCheckBox, allDocumentsCheckBox} = this.state;
        let total_stay_amount = 0;
        const {claim, manager} = this.props.route.params;
        const managerDetails = manager.user_role;
        let userRole = null;
        let managerID = null;
        if(managerDetails){
            userRole = managerDetails.user_role;
            managerID = managerDetails.manager_id;
        }
        const stayArrayLength = claim.claims.claim_stay.length;
        const documentArrayLength = claim.claims.claim_attachments.length;
        let approvalData = [];
        approvalData = manager.approved_by_managers;
        let auditorStatus = '';
        let sendBack = false;
        if(approvalData.length === 2){
            const climberID = approvalData[1]['climber_user_id']
            auditorStatus = approvalData[1]['status'];
            if(auditorStatus === 'new' && managerID === climberID){
                sendBack = true;
            }
        }
        claim.claims.claim_stay.forEach(item => {
            const date1 = moment(item.from_date, "YYYY-MM-DD")
            const date2 = moment(item.to_date, "YYYY-MM-DD")
            const days = date2.diff(date1, 'days')
            total_stay_amount += (item.rate_per_night * ((days === 0)? 1 : days)) + (item.da * ((days === 0)? 1 : (days + 1)))
        });
        const interpolateHeight = animateStay.interpolate({
            inputRange: [0, 1],
            outputRange: [getWidthnHeight(undefined, 22).height, getWidthnHeight(undefined, 47).height]
        })
        const animatedStyle = {
            height: interpolateHeight
        }
        const rotateIcon = {
            transform: [{
                rotateX: animateStay.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg']
                })
            }]
        }
        console.log("TRAVEL STAY: ", claim.claims.claim_stay)
        return (
            <View style={[getWidthnHeight(100), {alignItems: 'center'}]}>
                <View style = {[{flexDirection:'row',  marginTop:getMarginTop(1.2).marginTop, alignItems:'center'}, getWidthnHeight(95,5)]}>
                    <TouchableHighlight underlayColor="#DAE7F7" onPress= {() => this.setindex('0')} style={[{ borderWidth: 0, borderColor: 'red', backgroundColor:'#DAE7F7',justifyContent:'center', alignItems:'center'}]}>
                        <View style={[{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}, getWidthnHeight(95/3,5)]}>
                            <Text style={[{textAlign:'center'}, fontSizeH4()]}>Itinerary</Text>
                            {(sendBack) &&
                                <View style={[{flexDirection: 'row', borderColor: 'red', borderWidth: 0, alignItems: 'center', justifyContent: 'center'}]}>
                                    <View style={[{borderWidth: 0, borderColor: 'white', width: getWidthnHeight(6).width, height: getWidthnHeight(6).width}, getMarginHorizontal(1)]}>
                                        {(allTravelCheckBox) && 
                                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                                <View style={{position: 'absolute', backgroundColor: '#1968CF', width: getWidthnHeight(4).width, height: getWidthnHeight(4).width}}/>
                                                <CheckBox name="checkbox-marked" size={getWidthnHeight(6).width} color="white"/>
                                            </View>
                                        }
                                        {(!allTravelCheckBox) && 
                                            <CheckBox name="checkbox-blank" size={getWidthnHeight(6).width} color="white"/>
                                        }
                                    </View>
                                </View>
                            } 
                        </View>
                    </TouchableHighlight>  
                    <LinearGradient start={{x: 0, y: 0}} end={{x: 0.4, y: 0}} colors={['#0255BF','#1968CF', '#2C7BE0']} style={[{ borderWidth:0, borderColor: 'red',justifyContent:'center', alignItems:'center'},getWidthnHeight(95/3,5)]}>
                        <View style={[{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}, getWidthnHeight(95/3,5)]}>
                            <TouchableHighlight style={{ borderWidth: 0, borderColor: 'red'}} underlayColor="transparent" onPress= {() => this.setindex('1')}>
                                <Text style={{textAlign:'center', color:'white'}}>Stay</Text>
                            </TouchableHighlight> 
                            {(sendBack && stayArrayLength > 0) &&
                                <View style={[{flexDirection: 'row', borderColor: 'red', borderWidth: 0, alignItems: 'center', justifyContent: 'center'}]}>
                                    <TouchableOpacity style={[{borderWidth: 0, borderColor: 'white', width: getWidthnHeight(6).width, height: getWidthnHeight(6).width}, getMarginHorizontal(1)]} 
                                        onPress={() => this.setState({allStayCheckBox: !this.state.allStayCheckBox}, () => {
                                            const {allStayCheckBox} = this.state;
                                            if(allStayCheckBox){
                                                this.checkEntireStay();
                                            }else{
                                                this.uncheckEntireStay();
                                            }})}>
                                        {(allStayCheckBox) && 
                                            <CheckBox name="checkbox-marked" size={getWidthnHeight(6).width} color="white"/>
                                        }
                                        {(!allStayCheckBox) && 
                                            <CheckBox name="checkbox-blank" size={getWidthnHeight(6).width} color="white"/>
                                        }
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                    </LinearGradient>
                        <TouchableHighlight underlayColor="#DAE7F7" onPress= {() => this.setindex('2')} style={[{ borderWidth: 0, borderColor: 'red', backgroundColor:'#DAE7F7',justifyContent:'center', alignItems:'center'}]}>
                            <View style={[{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}, getWidthnHeight(95/3,5)]}>
                                <Text style={[{textAlign:'center'}, fontSizeH4()]}>Documents</Text>
                                {(sendBack && documentArrayLength > 0) &&
                                    <View style={[{flexDirection: 'row', borderColor: 'red', borderWidth: 0, alignItems: 'center', justifyContent: 'center'}]}>
                                        <View style={[{borderWidth: 0, borderColor: 'white', width: getWidthnHeight(6).width, height: getWidthnHeight(6).width}, getMarginHorizontal(1)]}>
                                            {(allDocumentsCheckBox) && 
                                                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                                    <View style={{position: 'absolute', backgroundColor: '#1968CF', width: getWidthnHeight(4).width, height: getWidthnHeight(4).width}}/>
                                                    <CheckBox name="checkbox-marked" size={getWidthnHeight(6).width} color="white"/>
                                                </View>
                                            }
                                            {(!allDocumentsCheckBox) && 
                                                <CheckBox name="checkbox-blank" size={getWidthnHeight(6).width} color="white"/>
                                            }
                                        </View>
                                    </View>
                                }
                            </View>
                        </TouchableHighlight>
                </View>
                <View style={[{flexDirection: 'row', borderBottomColor: '#1968CF', borderBottomWidth: 1}, getWidthnHeight(95)]}>
                    <View style={[getWidthnHeight(95/3)]}/>
                    <View>
                        <View style={[{position: 'absolute', alignItems: 'center', justifyContent: 'flex-start', borderColor: 'red', borderWidth: 0, transform: [{translateY: -(getWidthnHeight(undefined, 1).height)}]}, getWidthnHeight(95/3, 2)]}>
                            <View style = {[styles.triangleCorner]}/>
                        </View>
                    </View>
                    <View style={[getWidthnHeight(95/3)]}/>
                </View>
                <Animated.View style = {[{
                    borderTopWidth:0, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor:'#1968CF'
                    , alignItems: 'center'}, getWidthnHeight(95), (stayArrayLength > 1)? animatedStyle : getWidthnHeight(undefined, 27)
                ]}>
                    <View style={[getMarginVertical(1)]}>
                        {this.state.claimStay != null ?
                            <FlatList
                                ref={(ref) => this.scrollStay = ref}
                                nestedScrollEnabled={(stayFullHeight)? true : false}
                                scrollEnabled={(stayFullHeight)? true : false}
                                data={this.state.claimStay}
                                initialNumToRender = {this.state.claimStay.length}
                                renderItem={this.renderStayItem}
                                keyExtractor={item => item.id}
                                ListFooterComponent = {() => {
                                    return(
                                        <View style={[{borderWidth: 0, borderColor: 'red', alignItems: 'center', justifyContent: 'center'}, (claim.claims.claim_stay.length === 0)? getWidthnHeight(90, 26): null]}>
                                            <View style ={{alignItems:'center', justifyContent:'center', marginVertical:'3%'}}>
                                                <Text style = {[{textAlign:'center', backgroundColor: '#DAE7F7'},fontSize_H3(), getWidthnHeight(30)]}>Total Stay Cost</Text>
                                                <Text style = {[{textAlign:'center', fontWeight:'bold'}, styles.boldFont, fontSize_H3()]}>{`${"\u20B9"} ${total_stay_amount}/-`}</Text>
                                            </View>
                                        </View>
                                )}}
                            />
                        : 
                            null
                        }
                    </View>
                </Animated.View>
                {(stayArrayLength > 1) && 
                    <TouchableOpacity 
                        style={[getWidthnHeight(20, 5), {borderColor: 'red', borderWidth: 0, alignItems: 'center', justifyContent: 'center'}, getMarginTop(-2.5)]} 
                        onPress={() => this.stayHeight()}>
                        <View style={[{
                            width: getWidthnHeight(8).width, height: getWidthnHeight(8).width, borderRadius: getWidthnHeight(8).width, 
                            backgroundColor: '#1968CF', alignItems: 'center', justifyContent: 'center'}]}>
                                {(!stayFullHeight)?
                                    <Text style={[{color: 'white', textAlign: 'center', textAlignVertical: 'center'}]}>{`+${stayArrayLength - 1}`}</Text>
                                :
                                    <Animated.View>
                                        <FontAwesomeIcons name='angle-up' size={getWidthnHeight(5).width} color={'white'}/>
                                    </Animated.View>
                                }
                        </View>
                    </TouchableOpacity>
                }
            </View>
        )
    };

    documentScrollToTop(){
        this.scrollDocuments.scrollToIndex({animated: true, index: 0})
    }

    documentsHeight(){
        const {animateDocuments, documentsFullHeight} = this.state;
        if(!documentsFullHeight){
            Animated.timing(animateDocuments, {
                toValue: 1,
                duration: 500
            }).start(() => {
                this.setState({documentsFullHeight: true})
            })
        }else{
            this.documentScrollToTop();
            Animated.timing(animateDocuments, {
                toValue: 0,
                duration: 500
            }).start(() => {
                this.setState({documentsFullHeight: false})
            })
        }
    }
  
    Documents = () => {
        const {claim, manager} = this.props.route.params;
        const {animateDocuments, documentsFullHeight, allTravelCheckBox, allStayCheckBox, allDocumentsCheckBox} = this.state;
        const managerDetails = manager.user_role;
        let userRole = null;
        let managerID = null;
        if(managerDetails){
            userRole = managerDetails.user_role;
            managerID = managerDetails.manager_id;
        }
        const stayArrayLength = claim.claims.claim_stay.length;
        const documentArrayLength = claim.claims.claim_attachments.length;
        let approvalData = [];
        approvalData = manager.approved_by_managers;
        let auditorStatus = '';
        let sendBack = false;
        if(approvalData.length === 2){
            const climberID = approvalData[1]['climber_user_id']
            auditorStatus = approvalData[1]['status'];
            if(auditorStatus === 'new' && managerID === climberID){
                sendBack = true;
            }
        }
        const interpolateHeight = animateDocuments.interpolate({
            inputRange: [0, 1],
            outputRange: [getWidthnHeight(undefined, 25).height, getWidthnHeight(undefined, 40).height]
        })
        const animatedStyle = {
            height: interpolateHeight
        }
        return (
            <View style={[getWidthnHeight(100), {alignItems: 'center'}]}>
                <View style = {[{flexDirection:'row',  marginTop:getMarginTop(1.2).marginTop, alignItems:'center'}, getWidthnHeight(95,5)]}>
                    <TouchableHighlight underlayColor="#DAE7F7" onPress= {() => this.setindex('0')} style={[{ borderWidth: 0, borderColor: 'red', backgroundColor:'#DAE7F7',justifyContent:'center', alignItems:'center'}]}>
                        <View style={[{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}, getWidthnHeight(95/3,5)]}>
                            <Text style={[{textAlign:'center'}, fontSizeH4()]}>Itinerary</Text>
                            {(sendBack) &&
                                <View style={[{flexDirection: 'row', borderColor: 'red', borderWidth: 0, alignItems: 'center', justifyContent: 'center'}]}>
                                    <View style={[{borderWidth: 0, borderColor: 'white', width: getWidthnHeight(6).width, height: getWidthnHeight(6).width}, getMarginHorizontal(1)]}>
                                        {(allTravelCheckBox) && 
                                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                                <View style={{position: 'absolute', backgroundColor: '#1968CF', width: getWidthnHeight(4).width, height: getWidthnHeight(4).width}}/>
                                                <CheckBox name="checkbox-marked" size={getWidthnHeight(6).width} color="white"/>
                                            </View>
                                        }
                                        {(!allTravelCheckBox) && 
                                            <CheckBox name="checkbox-blank" size={getWidthnHeight(6).width} color="white"/>
                                        }
                                    </View>
                                </View>
                            }
                        </View> 
                    </TouchableHighlight>
                        <TouchableHighlight underlayColor="#DAE7F7" onPress= {() => this.setindex('1')} style={[{ borderWidth: 0, borderColor: 'red', backgroundColor:'#DAE7F7',justifyContent:'center', alignItems:'center'}]}>
                            <View style={[{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}, getWidthnHeight(95/3,5)]}>
                                <Text style={[{textAlign:'center'}, fontSizeH4()]}>Stay</Text>
                                {(sendBack && stayArrayLength > 0) &&
                                    <View style={[{flexDirection: 'row', borderColor: 'red', borderWidth: 0, alignItems: 'center', justifyContent: 'center'}]}>
                                        <View style={[{borderWidth: 0, borderColor: 'white', width: getWidthnHeight(6).width, height: getWidthnHeight(6).width}, getMarginHorizontal(1)]}>
                                            {(allStayCheckBox) && 
                                                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                                    <View style={{position: 'absolute', backgroundColor: '#1968CF', width: getWidthnHeight(4).width, height: getWidthnHeight(4).width}}/>
                                                    <CheckBox name="checkbox-marked" size={getWidthnHeight(6).width} color="white"/>
                                                </View>
                                            }
                                            {(!allStayCheckBox) && 
                                                <CheckBox name="checkbox-blank" size={getWidthnHeight(6).width} color="white"/>
                                            }
                                        </View>
                                    </View>
                                }
                            </View> 
                        </TouchableHighlight>
                    <LinearGradient start={{x: 0, y: 0}} end={{x: 0.4, y: 0}} colors={['#0255BF','#1968CF', '#2C7BE0']} style={[{ borderWidth: 0, borderColor: 'red',justifyContent:'center', alignItems:'center'},getWidthnHeight(95/3,5)]}>
                        <View style={[{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}, getWidthnHeight(95/3,5)]}>
                            <TouchableHighlight underlayColor="transparent" onPress= {() => this.setindex('2')}>
                                    <Text style={[{textAlign:'center', color:'white'}, fontSizeH4()]}>Documents</Text>
                            </TouchableHighlight>
                            {(sendBack && documentArrayLength > 0) &&
                                <View style={[{flexDirection: 'row', borderColor: 'red', borderWidth: 0, alignItems: 'center', justifyContent: 'center'}]}>
                                    <TouchableOpacity style={[{borderWidth: 0, borderColor: 'white', width: getWidthnHeight(6).width, height: getWidthnHeight(6).width}, getMarginHorizontal(1)]} 
                                        onPress={() => this.setState({allDocumentsCheckBox: !this.state.allDocumentsCheckBox}, () => {
                                            const {allDocumentsCheckBox} = this.state;
                                            if(allDocumentsCheckBox){
                                                this.checkEntireDocuments();
                                            }else{
                                                this.uncheckEntireDocuments();
                                            }})}>
                                        {(allDocumentsCheckBox) && 
                                            <CheckBox name="checkbox-marked" size={getWidthnHeight(6).width} color="white"/>
                                        }
                                        {(!allDocumentsCheckBox) && 
                                            <CheckBox name="checkbox-blank" size={getWidthnHeight(6).width} color="white"/>
                                        }
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                    </LinearGradient>
                </View>
                <View style={[{flexDirection: 'row', borderBottomColor: '#1968CF', borderBottomWidth: 1}, getWidthnHeight(95)]}>
                    <View style={[getWidthnHeight(95/3)]}/>
                    <View style={[getWidthnHeight(95/3)]}/>
                    <View>
                        <View style={[{position: 'absolute', alignItems: 'center', justifyContent: 'flex-start', borderColor: 'red', borderWidth: 0, transform: [{translateY: -(getWidthnHeight(undefined, 1).height)}]}, getWidthnHeight(95/3, 2)]}>
                            <View style = {[styles.triangleCorner]}/>
                        </View>
                    </View>
                </View>
                <Animated.View style = {[{borderTopWidth:0, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor:'#1968CF'}, getWidthnHeight(95), (documentArrayLength > 1)? animatedStyle : getWidthnHeight(undefined, 22)]}>
                    {(documentArrayLength > 0) &&
                    <View style={[getMarginVertical(1)]}>
                        <FlatList
                            ref={(ref) => this.scrollDocuments = ref}
                            nestedScrollEnabled={(documentsFullHeight)? true : false}
                            scrollEnabled={(documentsFullHeight)? true : false}
                            // data={this.state.DATA}
                            // initialNumToRender = {this.state.DATA.length}
                            data={this.state.claimDocuments}
                            initialNumToRender = {this.state.claimDocuments.length}
                            renderItem={this.renderdocument}
                            keyExtractor={item => item.id}
                            ListFooterComponent = {() => <View style ={[getWidthnHeight(95,2)]}/>}
                        />
                    </View>
                    }
                </Animated.View>
                {(documentArrayLength > 1) && 
                    <TouchableOpacity 
                        style={[getWidthnHeight(20, 5), {borderColor: 'red', borderWidth: 0, alignItems: 'center', justifyContent: 'center'}, getMarginTop(-2.5)]} 
                        onPress={() => this.documentsHeight()}>
                        <View style={[{
                            width: getWidthnHeight(8).width, height: getWidthnHeight(8).width, borderRadius: getWidthnHeight(8).width, 
                            backgroundColor: '#1968CF', alignItems: 'center', justifyContent: 'center'}]}>
                                {(!documentsFullHeight)?
                                    <Text style={[{color: 'white', textAlign: 'center', textAlignVertical: 'center'}]}>{`+${documentArrayLength - 1}`}</Text>
                                :
                                    <Animated.View>
                                        <FontAwesomeIcons name='angle-up' size={getWidthnHeight(5).width} color={'white'}/>
                                    </Animated.View>
                                }
                        </View>
                    </TouchableOpacity>
                }
            </View>
        )
    };



    colorbox = (color, title, amount, width) => {
        return(
            <View style= {[{backgroundColor:color, justifyContent: 'space-evenly'},styles.multicolorsmallbox, getWidthnHeight(width)]}>
                <Text style = {[{fontStyle:'normal',textAlign:'center', color:'white'}, fontSizeH4(), getMarginTop(0)]}>
                    {title}
                </Text>
                <Text style = {[{fontWeight:'bold',textAlign:'center', color:'white', fontSize: fontSizeH4().fontSize + 3}, getMarginTop(0)]}>
                    {amount}
                </Text>
            </View>
        )        
    }

    pre_approval_amount = () => {
        const {claim} = this.props.route.params;
        let itineraryTotal = 0;
        claim.claims.claim_details.forEach((item) => {
            itineraryTotal += item.amount;
        })
        let stayTotal = 0;
        let totalStayAmount = null;
        claim.claims.claim_stay.forEach((item) => {
            const date1 = moment(item.from_date, "YYYY-MM-DD");
            const date2 = moment(item.to_date, "YYYY-MM-DD");
            const days = date2.diff(date1, 'days');
            const nightStayTotal = (item.rate_per_night * ((days === 0)? 1 : days));
            const daTotal = (item.da * ((days === 0)? 1 : (days + 1)));
            stayTotal += nightStayTotal + daTotal;
        })
        if(stayTotal === 0){
            totalStayAmount = '--';
        }else{
            totalStayAmount = `${"\u20B9"} ${stayTotal}/-`;
        }
        let imprestTaken = claim.claims.imprest_taken;
        let imprestAmount = null;
        if(!imprestTaken){
            imprestAmount = '--';
        }else{
            imprestAmount = `${"\u20B9"} ${imprestTaken}/-`;
        }
        // console.log("ITINERARY TOTAL: ", itineraryTotal)
        return (
            <View style={[getWidthnHeight(100), {alignItems: 'center'}]}>
                <View style = {[{flexDirection:'row',  marginTop:getMarginTop(1).marginTop, justifyContent:'center', alignItems:'center', borderBottomColor: '#1968CF', borderBottomWidth: 0}, getWidthnHeight(95,5)]}>  
                    <LinearGradient start={{x: 0, y: 0}} end={{x: 0.7, y: 0}} colors={['#0255BF','#1968CF', '#2C7BE0']} style={[{ borderWidth:0, flex:0.5,justifyContent:'center', alignItems:'center'},getWidthnHeight(undefined,5)]}>
                        <TouchableHighlight underlayColor="transparent" onPress= {() => this.settwoindex('0')}>
                            <Text style={[{textAlign:'center', color:'white'}]}> Pre-Approval Amount </Text>    
                        </TouchableHighlight>
                    </LinearGradient>
                    <TouchableHighlight underlayColor="#DAE7F7" onPress= {() => this.settwoindex('1')} style={[{ borderWidth:0, flex:0.5, backgroundColor:'#DAE7F7',justifyContent:'center', alignItems:'center'},getWidthnHeight(undefined,5)]}>
                        <Text style={{textAlign:'center'}}> Bank Details </Text> 
                    </TouchableHighlight>
                </View>
                <View style = {[{borderWidth:1, borderColor:'#1968CF'}, getWidthnHeight(95, 10), getMarginTop(0)]}>
                    <View style={[getWidthnHeight(95/2), {alignItems: 'center', borderColor: 'blue', borderWidth: 0, position: 'absolute'}, getMarginTop(-1)]}>
                        <View style = {[styles.triangleCorner, {borderTopColor: '#1968CF'}]}/>
                    </View>
                    <View style = {[{flexDirection:'row', justifyContent: 'space-evenly'}]}>
                        {this.colorbox('#EB3A32', 'Itinerary', `${"\u20B9"} ${itineraryTotal}/-` , 30)}
                        {this.colorbox('#E68F1B', 'Stay', totalStayAmount, 30)}
                        {this.colorbox('#00B7D9', 'Imprest', imprestAmount, 30)}
                    </View>  
                </View>
            </View>
        )
    };
  
  
    bank_details = () => {
        const {claim} = this.props.route.params;
        return (
            <View style={[getWidthnHeight(100), {alignItems: 'center'}]}>
                <View style = {[{flexDirection:'row',  marginTop:getMarginTop(1.2).marginTop, justifyContent:'center', alignItems:'center'}, getWidthnHeight(95,5)]}>
                    <TouchableHighlight underlayColor="#DAE7F7" onPress= {() => this.settwoindex('0')} style={[{ borderWidth:0, flex:0.5, backgroundColor:'#DAE7F7',justifyContent:'center', alignItems:'center'},getWidthnHeight(undefined,5)]}>
                        <Text style={[{textAlign:'center'}]}> Pre-Approval Amount </Text>    
                    </TouchableHighlight>
                    <LinearGradient start={{x: 0, y: 0}} end={{x: 0.7, y: 0}} colors={['#0255BF','#1968CF', '#2C7BE0']} style={[{ borderWidth:0, flex:0.5,justifyContent:'center', alignItems:'center'},getWidthnHeight(undefined,5)]}>
                        <TouchableHighlight underlayColor="transparent" onPress= {() => this.settwoindex('1')}>
                            <Text style={{textAlign:'center', color:'white'}}> Bank Details </Text> 
                        </TouchableHighlight>
                    </LinearGradient>
                </View>
                <View style = {[{borderWidth:1, borderColor:'#1968CF', alignItems: 'center'}, getWidthnHeight(95, 18)]}>
                    <View style={[getWidthnHeight(95), {alignItems: 'flex-end'}]}>
                        <View style={[getWidthnHeight(95/2), {alignItems: 'center', borderColor: 'blue', borderWidth: 0, position: 'absolute'}, getMarginTop(-1)]}>
                            <View style = {[styles.triangleCorner, {borderTopColor: '#1968CF'}]}/>
                        </View>
                    </View>
                    <View style = {{flexDirection:'row'}}>
                        {this.colorbox('#EB3A32', 'BANK NAME', claim.claims.bank, 45)}
                        {this.colorbox('#E68F1B', 'IFSC', claim.claims.ifsc, 45)}
                    </View>  
                    {this.colorbox('#00B7D9', 'ACCOUNT NUMBER', claim.claims.account_no, 90)}
                </View>
            </View>
        )
    };

    status = ()=>{
        const {claim, manager} = this.props.route.params;
        const authorities = claim.claims.authorities;
        const length = manager.approved_by_managers.length;
        let hodStatus = '';
        let auditorStatus = '';
        let authorityStatus = '';
        let payeeStatus = '';
        for(let i = 0; i < length; i++){
            const climberID = manager.approved_by_managers[i]['climber_user_id'];
            const authorityID = authorities[i]['manager_id'];
            const userRole = authorities[i]['user_role'];
            if(climberID === authorityID && userRole === 'HOD'){
                hodStatus = manager.approved_by_managers[i]['status']
            }else if(climberID === authorityID && userRole === 'Auditor'){
                auditorStatus = manager.approved_by_managers[i]['status']
            }else if(climberID === authorityID && userRole === 'Authority'){
                authorityStatus = manager.approved_by_managers[i]['status']
            }else if(climberID === authorityID && userRole === 'Payee'){
                payeeStatus = manager.approved_by_managers[i]['status']
            }
        }
        // console.log("### ALL STATUS: ", length, hodStatus, auditorStatus, authorityStatus, payeeStatus)
        return(
        <View style = {[{flexDirection:'row', alignItems: 'center', justifyContent: 'space-evenly'}, getMarginTop(2), getWidthnHeight(100)]}>
            {(hodStatus === 'new')?
                <View>
                    <View style={[{
                        backgroundColor:'white', borderRadius:(getWidthnHeight(17).width), borderColor:'#3181E4', alignItems: 'center', justifyContent: 'center',
                        width: getWidthnHeight(17).width, height: getWidthnHeight(17).width}, this.state.activecirclehod ? {borderWidth: 2}:{ borderWidth:0}, 
                    ]}>  
                        <Circle position = {'HOD'} status = {hodStatus} activecircle={this.state.activecircle}/>
                    </View>
                    <View style = {[{ borderWidth:0, borderColor:'#3280E4', borderRadius:8, alignItems: 'center', justifyContent: 'center'},getWidthnHeight(undefined,3)]}>
                        <View style = {{alignItems:'center', justifyContent:'center'}}>
                            <Text style={[{color:"#DBE8F8", fontSize: fontSizeH4().fontSize - 1}]}>HOD</Text>
                        </View>
                    </View>
                </View>
            :
                <View>
                    <View style={[{
                        backgroundColor:'white', borderRadius:(getWidthnHeight(17).width), borderColor:'#3181E4', alignItems: 'center', justifyContent: 'center',
                        width: getWidthnHeight(17).width, height: getWidthnHeight(17).width}, this.state.activecirclehod ? {borderWidth: 2}:{ borderWidth:0}, 
                    ]}>  
                        <Circle position = {'HOD'} status = {hodStatus} activecircle={this.state.activecircle}/>
                    </View>                
                    <View style = {[{ borderWidth: 0, borderColor:'#3280E4', borderRadius:8, alignItems: 'center', justifyContent: 'center'},getWidthnHeight(undefined,3)]}>
                        <View style = {{alignItems:'center', justifyContent:'center'}}>
                            <Text style={[{color:"#3280E4", fontSize: fontSizeH4().fontSize - 1}]}>HOD</Text>
                        </View>
                    </View> 
                </View>
            }       
            <FontAwesome name={'angle-right'} size={getWidthnHeight(7).width} color = {'#DBE8F8'} style={[getMarginTop(-2)]}/> 
            {(auditorStatus === 'new' || auditorStatus === '')?
                <View>
                    <View style={[{
                            backgroundColor:'white', borderRadius:(getWidthnHeight(17).width), borderColor:'#3181E4', alignItems: 'center', justifyContent: 'center',
                            width: getWidthnHeight(17).width, height: getWidthnHeight(17).width}, this.state.activecircleauditor ? {borderWidth: 2}:{ borderWidth:0}, 
                    ]}>
                        <Circle position = {'AUDITOR'} status = {auditorStatus} activecircle={this.state.activecircle}/>
                    </View>
                    <View style = {[{ borderWidth:0, borderColor:'#3280E4', borderRadius:8, alignItems: 'center', justifyContent: 'center'},getWidthnHeight(undefined,3)]}>
                        <View style = {{alignItems:'center', justifyContent:'center'}}>
                            <Text style={[{color:"#DBE8F8",fontSize: fontSizeH4().fontSize - 1}]}>AUDITOR</Text>
                        </View>
                    </View>
                </View>
            :
                <View>
                    <View style={[{
                            backgroundColor:'white', borderRadius:(getWidthnHeight(17).width), borderColor:'#3181E4', alignItems: 'center', justifyContent: 'center',
                            width: getWidthnHeight(17).width, height: getWidthnHeight(17).width}, this.state.activecircleauditor ? {borderWidth: 2}:{ borderWidth:0}, 
                    ]}>
                        <Circle position = {'AUDITOR'} status = {auditorStatus} activecircle={this.state.activecircle}/>
                    </View> 
                    <View style = {[{ borderWidth: 0, borderColor:'#3280E4', borderRadius:8, alignItems: 'center', justifyContent: 'center'},getWidthnHeight(undefined,3)]}>
                        <View style = {{alignItems:'center', justifyContent:'center'}}>
                            <Text style={[{color:"#3280E4",fontSize: fontSizeH4().fontSize - 1}]}>AUDITOR</Text>
                        </View>
                    </View> 
                </View>
            }
            <FontAwesome name={'angle-right'} size={getWidthnHeight(7).width} color = {'#DBE8F8'} style={[getMarginTop(-2)]}/> 
            {(authorityStatus === 'new' || authorityStatus === '')?
                <View>
                    <View style={[{
                            backgroundColor:'white', borderRadius:(getWidthnHeight(17).width), borderColor:'#3181E4', alignItems: 'center', justifyContent: 'center',
                            width: getWidthnHeight(17).width, height: getWidthnHeight(17).width}, this.state.activecirclemd ? {borderWidth: 2}:{ borderWidth:0}, 
                    ]}>
                        <Circle position = {'MD SIR'} status = {authorityStatus} activecircle={this.state.activecircle}/>
                    </View>
                    <View style = {[{ borderWidth:0, borderColor:'#3280E4', borderRadius:8, alignItems: 'center', justifyContent: 'center'},getWidthnHeight(undefined,3)]}>
                        <View style = {{alignItems:'center', justifyContent:'center'}}>
                            <Text style={[{color:"#DBE8F8",fontSize: fontSizeH4().fontSize - 1}]}>MD SIR</Text>
                        </View>
                    </View>
                </View>
            :
                <View>
                    <View style={[{
                            backgroundColor:'white', borderRadius:(getWidthnHeight(17).width), borderColor:'#3181E4', alignItems: 'center', justifyContent: 'center',
                            width: getWidthnHeight(17).width, height: getWidthnHeight(17).width}, this.state.activecirclemd ? {borderWidth: 2}:{ borderWidth:0}, 
                    ]}>
                        <Circle position = {'MD SIR'} status = {authorityStatus} activecircle={this.state.activecircle}/>
                    </View>
                    <View style = {[{ borderWidth: 0, borderColor:'#3280E4', borderRadius:8, alignItems: 'center', justifyContent: 'center'},getWidthnHeight(undefined,3)]}>
                        <View style = {{alignItems:'center', justifyContent:'center'}}>
                            <Text style={[{color:"#3280E4",fontSize: fontSizeH4().fontSize - 1}]}>MD SIR</Text>
                        </View>
                    </View> 
                </View>
            }
            <FontAwesome name={'angle-right'} size={getWidthnHeight(7).width} color = {'#DBE8F8'} style={[getMarginTop(-2)]}/> 
            {(payeeStatus === 'new' || payeeStatus === '')?
                <View>
                    <View style={[{
                        backgroundColor:'white', borderRadius:(getWidthnHeight(17).width), borderColor:'#3181E4', alignItems: 'center', justifyContent: 'center',
                        width: getWidthnHeight(17).width, height: getWidthnHeight(17).width}, this.state.activecircleauditor2 ? {borderWidth: 2}:{ borderWidth:0}, 
                    ]}>
                        <Circle position = {'PAYEE'} status={payeeStatus} activecircle={this.state.activecircle}/>
                    </View>
                    <View style = {[{ borderWidth:0, borderColor:'#3280E4', borderRadius:8, alignItems: 'center', justifyContent: 'center'},getWidthnHeight(undefined,3)]}>
                        <View style = {{alignItems:'center', justifyContent:'center'}}>
                            <Text style={[{color:"#DBE8F8",fontSize: fontSizeH4().fontSize - 1}]}>PAYEE</Text>
                        </View>
                    </View>
                </View>
            :
                <View>
                    <View style={[{
                        backgroundColor:'white', borderRadius:(getWidthnHeight(17).width), borderColor:'#3181E4', alignItems: 'center', justifyContent: 'center',
                        width: getWidthnHeight(17).width, height: getWidthnHeight(17).width}, this.state.activecircleauditor2 ? {borderWidth: 2}:{ borderWidth:0}, 
                    ]}>
                        <Circle position = {'PAYEE'} status={payeeStatus} activecircle={this.state.activecircle}/>
                    </View>
                    <View style = {[{ borderWidth: 0, borderColor:'#3280E4', borderRadius:8, alignItems: 'center', justifyContent: 'center'},getWidthnHeight(undefined,3)]}>
                        <View style = {{alignItems:'center', justifyContent:'center'}}>
                            <Text style={[{color:"#3280E4",fontSize: fontSizeH4().fontSize - 1}]}>PAYEE</Text>
                        </View>
                    </View> 
                </View>
            }
        </View>  
        );
    }

    async submitClaimRequest(title){
        try{
            const {
                baseURL, comments, commentsError, claimTravel, 
                claimStay, claimDocuments, sendBackData, utr, utrDate
            } = this.state;
            //console.log("&&& %%% UTR: ", utr, utrDate,)
            //return;
            const {claim} = this.props.route.params;
            const stayData = claim.claims.claim_stay;
            const documentsData = claim.claims.claim_attachments;
            if(commentsError){
                this.setState({enableAlert: true, alertTitle: message, alertColor: true})
                return;
            }
            let sendBackTravel = [];
            let sendBackStay = [];
            let sendBackDocuments = [];
            let stringifyTravelSendBack = null;
            let stringifyStaySendBack = null;
            let stringifyDocumentsSendBack = null;
            const serverData = new FormData();
            if(sendBackData){
                for(let i = 0; i < claimTravel.length; i++){
                    if(claimTravel[i]['checkBox'] === true){
                        sendBackTravel.push(claimTravel[i]['id'])
                    }   
                }
                if(stayData.length > 0){
                    for(let i = 0; i < claimStay.length; i++){
                        if(claimStay[i]['checkBox'] === true){
                            sendBackStay.push(claimStay[i]['id'])
                        }   
                    }
                }
                if(documentsData.length > 0){
                    for(let i = 0; i < claimDocuments.length; i++){
                        if(claimDocuments[i]['checkBox'] === true){
                            sendBackDocuments.push(claimDocuments[i]['id'])
                        }   
                    }
                }
                if(sendBackTravel.length > 0 || sendBackStay.length > 0 || sendBackDocuments.length > 0){
                    if(sendBackTravel.length > 0){
                        stringifyTravelSendBack = JSON.stringify(sendBackTravel)
                        serverData.append('claim_details', stringifyTravelSendBack)
                    }
                    if(sendBackStay.length > 0){
                        stringifyStaySendBack = JSON.stringify(sendBackStay)
                        serverData.append(' claim_stays', stringifyStaySendBack)
                    }
                    if(sendBackDocuments.length > 0){
                        stringifyDocumentsSendBack = JSON.stringify(sendBackDocuments)
                        serverData.append('claim_attachments', stringifyDocumentsSendBack)
                    }
                }else{
                    alert('Please select the details you would like to send back.');
                    return;
                }
            }
            // console.log("\nCLAIM ID: ", claim.claims.id, "\nSENDBACK TRAVEL: ", stringifyTravelSendBack, 
            // "\nSENDBACK STAY: ", stringifyStaySendBack, "\nSENDBACK DOCUMENTS: ", stringifyDocumentsSendBack
            // )
            //return;
            const claimID = claim.claims.id;
            this.showLoader();
            var user_token= await AsyncStorage.getItem('user_token');
            var permissions_fir= JSON.parse(user_token);
            var permissions_four=permissions_fir.success.secret_token;
            serverData.append('action_type', title)
            serverData.append('comments', comments)
            if(utr && utrDate){
                serverData.append('utr', utr);
            }
            console.log("\n$$$@@@CLAIM ID: ", `${baseURL}/travel/claim-view/${claimID}`, "\n\n", serverData, "\n\n", `Bearer ${permissions_four}`)
            axios.post(`${baseURL}/travel/claim-view/${claimID}`,
            serverData,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${permissions_four}`,
                    'Content-Type': 'multipart/form-data'
                }
            }).then((response) => {
                this.hideLoader();
                const parsedData = (response.data)
                console.log("^^^###%%% SUCCESS: ", parsedData.data);
                Alert.alert("", parsedData.data);
                this.props.navigation.goBack()
            }).catch((error) => {
                this.hideLoader()
                console.log("@@@ ERROR: ", error)
                if(error.response){
                    console.log("### @@@ RESPONSE: ", error.response)
                    const status = error.response.status;
                    this.enableModal(status, '126')
                }else{
                    alert(`${error}, API CODE: 126`)
                }
            })
        }catch(error){
            console.log("@@!!!## ERROR: ", error);
        }
    }

    enableModal(status, apiCode){
        this.setState({errorCode: status})
        this.setState({apiCode})
        this.setState({apiError: true})
    }

    render() {
        const {color, loading, submitApprovePay, profilePictureLink, downloadModal, fullFileName, percent} = this.state;
        const {dateTime, animateProgressBar, animateProgressBG, submitClaim, commentsError, errorCode, apiCode} = this.state;
        const {claim, manager} = this.props.route.params;
        let totalTravelAmount = 0;
        claim.claims.claim_details.forEach((item) => {
            totalTravelAmount = Number(totalTravelAmount) + Number(item.amount);
        })
        let totalStayAmount = 0;
        claim.claims.claim_stay.forEach((item) => {
            const fromDate = moment(item.from_date).format("DD-MM-YYYY");
            const toDate = moment(item.to_date).format("DD-MM-YYYY");
            const date1 = moment(fromDate, "DD-MM-YYYY");
            const date2 = moment(toDate, "DD-MM-YYYY");
            const days = date2.diff(date1, 'days');
            totalStayAmount = Number(totalStayAmount) + Number(item.da) * ((days === 0)? 1 : (days + 1)) + Number(item.rate_per_night) * ((days === 0)? 1 : days);
            console.log('Compile Number of Days: ', typeof days, days);
        })
        const totalAmount = totalTravelAmount + totalStayAmount;
        const managerDetails = manager.user_role;
        let userRole = null;
        let managerID = null;
        if(managerDetails){
            userRole = managerDetails.user_role;
            managerID = managerDetails.manager_id;
        }
        // console.log("@@@### PROPS: ", manager.approved_by_managers, userRole);
        let countApproved = 0;
        let rejectedByUserID = null;
        let approvalData = [];
        let amountPaid = false;
        approvalData = manager.approved_by_managers
        approvalData.forEach((item) => {
            // console.log("APPROVED BY MANAGERS: ", approvalData)
            if(item.status === "approved"){
                countApproved += 1;
            }
            if(item.status === "rejected"){
                rejectedByUserID = item.climber_user_id;
            }
            if(item.status === "paid"){
                amountPaid = true;
            }
            if(item.status === 'new'){

            }
        })
        let show = false;
        if(approvalData.length === 1){
            const climberID = approvalData[0]['climber_user_id']
            if(approvalData[0]['status'] === "new" && managerID === climberID){
                show = true;
            }
        }else if(approvalData.length === 2){
            const climberID = approvalData[1]['climber_user_id']
            if(approvalData[1]['status'] === "new" && managerID === climberID){
                show = true;
            }
        }else if(approvalData.length === 3){
            const climberID = approvalData[2]['climber_user_id']
            if(approvalData[2]['status'] === "new" && managerID === climberID){
                show = true;
            }
        }else if(approvalData.length === 4){
            const climberID = approvalData[3]['climber_user_id']
            if(approvalData[3]['status'] === "new" && managerID === climberID){
                show = true;
            }
        }
        let processWidth = 0;
        if(countApproved === 0){
            processWidth = getWidthnHeight(0).width;
        }else if(countApproved === 1){
            processWidth = getWidthnHeight(95/4).width;
        }else if(countApproved === 2){
            processWidth = getWidthnHeight(95/2).width;
        }else if(countApproved === 3){
            processWidth = getWidthnHeight(95/1.3).width;
        }
        if(rejectedByUserID){
            let totalDistance = 0;
            const index = claim.claims.authorities.findIndex((item) => {
                return rejectedByUserID === item.manager_id;
            })
            totalDistance = (index + 1);
            if(totalDistance === 1){
                processWidth = getWidthnHeight(95/4).width;
            }else if(totalDistance === 3){
                processWidth = getWidthnHeight(95/1.3).width;
            }
        }
        if(amountPaid){
            processWidth = getWidthnHeight(95).width;
        }
        const animateProgressBarStyle = {
            width: animateProgressBar.interpolate({
                inputRange: [0, 1],
                outputRange: [0, processWidth]
            })
        }
        const animateProgressBGStyle = {
            width: animateProgressBG.interpolate({
                inputRange: [0, 1],
                outputRange: [0, processWidth],
                extrapolate: 'clamp'
            }),
            bottom: 0,
            backgroundColor: animateProgressBG.interpolate({
                inputRange: [0, 0.2, 1],
                outputRange: ['transparent', (rejectedByUserID)? '#C81912' : '#006A71', (rejectedByUserID)? '#FF0000' : '#28DF99']
            }),
        }
    return (
            <View style = {{flex: 1, backgroundColor: 'white'}}>
                <View>
                    <IOS_StatusBar color={statusBarGradient} barStyle="light-content"/>
                    {/* <WaveHeader
                            wave={Platform.OS ==="ios" ? false : false} 
                            //logo={require('../Image/Logo-164.png')}
                            menu='white'
                            title='View Claim'
                            headerType = {'small'}
                            menuState = {false}
                            //version={`Version ${this.state.deviceVersion}`}
                    /> */}
                </View>
                <DownloadModal 
                    visible={downloadModal}
                    fileName={fullFileName}
                    percent={percent}
                    onBackdropPress={() => this.setState({downloadModal: false})}
                />
            <View style={{flex: 1}}>
            <KeyboardAvoidingView style={{flex: 1}} behavior={(Platform.OS === 'ios')? "padding" : null} keyboardVerticalOffset={(Platform.OS === 'ios')? 120 : null}> 
            <ScrollView contentContainerStyle={{alignItems: 'center'}}>
                <View style={[getWidthnHeight(100), {alignItems: 'center'}]}>
                <View style ={[{backgroundColor:'#DBE8F8', borderRadius:10},styles.bigbluebox, getWidthnHeight(95,5.5)]}>
                    <View style = {{flexDirection:'row', alignItems: 'center', flex: 1, justifyContent: 'center'}}>  
                        <Text style = {[{fontWeight:'700', color:'#000', textAlignVertical: 'center'}, fontSize_H3()]}>{claim.claims.travel.user.employee.first_name.replace(/^\w/, (c) => c.toUpperCase())+" "+claim.claims.travel.user.employee.last_name.replace(/^\w/, (c) => c.toUpperCase())} </Text>  
                        <View style={{width: getWidthnHeight(6).width,height: getWidthnHeight(6).width,borderRadius: getWidthnHeight(6).width/2, borderWidth:0, backgroundColor:'#3381E5', justifyContent:'center', marginLeft:getMarginLeft(1).marginLeft}}>  
                            <View style={{alignItems:'center', justifyContent: 'center', marginLeft:getMarginLeft(0.5).marginLeft, }}>   
                                <FontAwesomeIcons name='angle-right' size={getWidthnHeight(5).width} color={'white'}/>
                            </View>
                        </View>
                        <Text style = {[getMarginLeft(1)]}>{" "+claim.claims.claim_code+" "}</Text>
                    </View>  
                </View>
            {/* {<View>    
                <LinearGradient start={{x: 0, y: 0}} end={{x: 0.4, y: 0}} colors={['#0255BF','#1968CF', '#2C7BE0']} style = {[styles.bigbluebox]}> 
                    <View>  
                    <View style = {[{flexDirection:'row'}]}>  
                        <View style = {[getMarginTop(3.5), getMarginLeft(50)]}>
                            <FontAwesomeIcons name ='plane' size = {50} color = {'#4087E3'}/>
                        </View>
                        <View style = {[getMarginTop(-1.3), getMarginLeft(4)]}>
                            <FontAwesomeIcons name ='plane' size = {130} color = {'#4087E3'}/>
                        </View>
                    </View>
                    <View style ={[getMarginTop(-15), getMarginLeft(5)]}>
                        <Text style = {[{fontWeight:'700', color:'white', fontSize:16, fontStyle:'italic'}]}>Have to go for service Delivery Work </Text>
                        <View style = {{flexDirection:'row', marginTop:getMarginTop(1).marginTop}}>
                            <View style={{width: '6%',height: 21,borderRadius: 21/2, borderWidth:0, backgroundColor:'white', justifyContent:'center', marginTop:getMarginTop(0.5).marginTop}}>  
                                <View style={{alignItems:'center'}}>   
                                    <FontAwesome name='map-marked-alt' size={13} color={'#3280E2'}/>
                                </View>
                            </View>
                            <Text style = {[{fontWeight:'700', color:'white'}, fontSize_H3, getMarginTop(0.2)]}> SD </Text>
                            <Text style = {[{color:'white'}, fontSizeH4, getMarginTop(0.2)]}>(Existing Client - Aarti Drugs LTD) </Text>
                        </View>
                    </View>
                    </View>
                    <View style = {[{flexDirection:'row'}, getMarginLeft(4.5),getMarginTop(1)]}>
                        <Text style = {[{fontWeight:'700', color:'white'},fontSize_H3]}> TC -  </Text>
                        <Text style = {[{fontWeight:'700',color:'white'},fontSizeH4]}>123412341234 </Text>
                        <TouchableHighlight underlayColor="#3280E4" onPress= {() =>console.log("Pressed")} style={{width: '8.5%',height: 30,borderRadius: 30/2, borderWidth:0, backgroundColor:'white', justifyContent:'center',marginLeft:getMarginLeft(37).marginLeft, marginTop:getMarginTop(-0.5).marginTop}}>
                            <View style={[{alignItems:'center'}]}>   
                                <FontAwesomeIcons name='eye' size={16} color={'#3580E5'}/>
                            </View> 
                        </TouchableHighlight>
                    </View>  
                </LinearGradient>
            </View> } */}
            
                    {(this.state.twoindex === '0')?
                        this.pre_approval_amount() 
                    : 
                        this.bank_details()
                    }   
                        
                    <Text style = {[{textAlign:"center", textDecorationLine:'underline', fontWeight:'700'}, getMarginTop(1), fontSize_H3()]}>Claimed Details</Text>  

                    {(this.state.index === '0')?
                        this.Itinerary() 
                    : 
                        (this.state.index === '1')?
                            this.Stay()
                        : 
                            this.Documents()
                    }

            <View style = {[{alignItems:'center', justifyContent:'center'}, getMarginTop(2), getMarginBottom(1)]}>
                <View style = {[{borderWidth:1, borderColor:'#487DCB',backgroundColor:'#DAE7F7', alignItems:'center', justifyContent:'center'}, getWidthnHeight(50,10)]}>
                    <Text style = {[{fontSize: fontSizeH4().fontSize + 2}]}>Total Amount To Be Paid</Text>
                    <Text style = {[fontSizeH4()]}>(Itinerary + Stay)</Text>
                    <Text style = {[{fontWeight:'bold', fontSize: fontSizeH4().fontSize + 5}, styles.boldFont]}>{`${"\u20B9"} ${totalAmount}/-`}</Text>
                </View>  
            </View>
            <View style = {[{borderWidth:0, borderColor:'#487DCB', backgroundColor:'#DCDCDC'}, getWidthnHeight(95,0.2), getMarginVertical(1)]}/>
            <Text style={[{textAlign:'left', color:"#3280E5",fontWeight:'700'},fontSize_H3()]}>APPROVAL STATUS</Text>
            <View style = {{alignItems:'center', justifyContent: 'center', borderColor: 'black', borderWidth: 0}}>
                {this.status(this.state.status)}
                <View style={[{backgroundColor: '#D1D2D4', borderRadius: 10}, getWidthnHeight(95, 1), getMarginVertical(1)]}>
                    <View style={{width: processWidth, borderWidth: 0, borderColor: 'purple', flex: 1, borderRadius: 10}}>
                        <Animated.View style={[{borderRadius: 10, backgroundColor: '#FFDF6B', height: getWidthnHeight(undefined, 1).height, }, animateProgressBarStyle]}>   
                            <View style={StyleSheet.absoluteFill}>
                                <Animated.View style={[{position: 'absolute', top: 0, left: 0, borderRadius: 10}, animateProgressBGStyle]} />
                            </View>
                        </Animated.View>
                    </View>
                </View>
            </View>
            <View style = {[{alignItems: 'center'}, getWidthnHeight(95), getMarginTop(1)]}>
                <Text style={[{textDecorationLine: 'underline', fontSize: fontSizeH4().fontSize + 3, fontWeight: 'bold', color: '#CD113B'}, styles.boldFont]}>COMMENTS:</Text>
            </View>
            {(claim.claims.comments.length > 0) &&
                claim.claims.comments.map((item, index) => {
                    // console.log("USER NAME: ", item.user_employee.fullname)
                    return (
                        <View style={[{alignItems: 'flex-start'}, getWidthnHeight(95)]} >
                            <ListItem key={index} style={[{borderColor: 'grey', borderBottomWidth: 0.5}, getWidthnHeight(95)]}>
                                <Avatar avatarStyle={{borderRadius: getWidthnHeight(15).width}} size={getWidthnHeight(15).width} source={{uri: `${profilePictureLink}/${item.user_employee.profile_picture}`}}/>
                                <ListItem.Content>
                                    <ListItem.Title 
                                        style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold',
                                        borderWidth: 0, borderColor: 'red'
                                        }, styles.boldFont, getWidthnHeight(70)]}
                                    >
                                        {item.user_employee.fullname.toUpperCase()}
                                    </ListItem.Title>
                                    <ListItem.Subtitle
                                        style={[{borderWidth: 0, borderColor: 'red', fontSize: fontSize_H3().fontSize + 2}, getWidthnHeight(70)]}
                                    >
                                        {item.comments}
                                    </ListItem.Subtitle>
                                    <ListItem.Subtitle
                                        style={[{borderWidth: 0, borderColor: 'red', fontSize: fontSizeH4().fontSize - 2}, getMarginTop(1), getWidthnHeight(70)]}
                                    >
                                        {moment(item.created_at).format("DD-MM-YYYY hh:mm A")}
                                    </ListItem.Subtitle>
                                </ListItem.Content>
                            </ListItem>
                        </View>
                    )
                })
            }
            <View style = {[{alignItems: 'center'}, getWidthnHeight(95), getMarginTop(2), getMarginBottom(1)]}>
                <Text style={[{textDecorationLine: 'underline', fontSize: fontSizeH4().fontSize + 3, fontWeight: 'bold', color: '#CD113B'}, styles.boldFont]}>TRAVEL LOGS:</Text>
            </View>
            {(claim.claims.logs.length > 0) &&
                claim.claims.logs.map((item, index) => {
                    return (
                        <View style={[{alignItems: 'flex-start', borderColor: 'grey', borderBottomWidth: 0.5}, getWidthnHeight(95)]} >
                            <ListItem key={index} style={[{borderColor: 'grey', borderBottomWidth: 0}, getWidthnHeight(95)]}>
                                <ListItem.Content>
                                    <ListItem.Title 
                                        style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold',
                                        borderWidth: 0, borderColor: 'red'
                                        }, styles.boldFont, getWidthnHeight(70)]}
                                    >
                                        {item.employee.fullname.toUpperCase()}
                                    </ListItem.Title>
                                    <ListItem.Subtitle
                                        style={[{borderWidth: 0, borderColor: 'red', fontSize: fontSize_H3().fontSize + 2}, getWidthnHeight(90)]}
                                    >
                                        {item.remarks.replace(/^\w/, (c) => c.toUpperCase())}
                                    </ListItem.Subtitle>
                                    <ListItem.Subtitle
                                        style={[{borderWidth: 0, borderColor: 'red', fontSize: fontSizeH4().fontSize - 2}, getMarginTop(1), getWidthnHeight(70)]}
                                    >
                                        {moment(item.created_at).format("DD-MM-YYYY hh:mm A")}
                                    </ListItem.Subtitle>
                                </ListItem.Content>
                            </ListItem>
                        </View>
                    )
                })
            }
            {(userRole  && show) && 
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
            }
            <View style = {[{borderWidth:0, borderColor:'#487DCB', backgroundColor:'white'}, getWidthnHeight(94.4,1), getMarginTop(1), getMarginLeft(3)]}/>
            </View>
            </ScrollView>
            {(userRole === "HOD" && show) &&
            <View style={[{justifyContent: 'space-evenly'}, getWidthnHeight(100, 7)]}>
                <View style={[{borderColor: '#487DCB', borderWidth: 0, backgroundColor: '#DCDCDC'}, getWidthnHeight(100, 0.2)]}/>
                <View style={[{flexDirection: 'row', justifyContent: 'space-evenly'}, getWidthnHeight(100)]}>
                    <View style={[{alignItems: 'center', justifyContent: 'center'}]}>
                        <TouchableOpacity onPress={() => this.setState({submitClaim: true}, () => this.submitClaimRequest('reject'))} style={[{flexDirection:'row', justifyContent: 'center', }]}>
                        <View style={[{justifyContent: 'center', alignItems: 'center', backgroundColor:'#CD113B',borderRightWidth:2, borderRightColor:'white', borderTopLeftRadius:5, borderBottomLeftRadius:5}, getWidthnHeight(4,5)]}/>
                            <View style={[{ justifyContent: 'center', alignItems: 'center', backgroundColor:'#CD113B'}, getWidthnHeight(20,5)]}>
                                <Text style = {[{color:'white', fontWeight:"bold"}, styles.boldFont]}>REJECT</Text>
                            </View>
                            <View style={[{justifyContent: 'center', alignItems: 'center', backgroundColor:'#CD113B',borderLeftWidth:2, borderLeftColor:'white', borderTopRightRadius:5, borderBottomRightRadius:5}, getWidthnHeight(4,5)]}/>
                        </TouchableOpacity>
                    </View>
                    <View style={[{alignItems: 'center', justifyContent: 'center'}]}>
                        <TouchableOpacity onPress={() => this.setState({submitClaim: true}, () => this.submitClaimRequest('approve'))} style={[{flexDirection:'row', justifyContent: 'center', }]}>
                        <View style={[{justifyContent: 'center', alignItems: 'center', backgroundColor:'#42B883',borderRightWidth:2, borderRightColor:'white', borderTopLeftRadius:5, borderBottomLeftRadius:5}, getWidthnHeight(4,5)]}/>
                            <View style={[{ justifyContent: 'center', alignItems: 'center', backgroundColor:'#42B883'}, getWidthnHeight(20,5)]}>
                                <Text style = {[{color:'white', fontWeight:"bold"}, styles.boldFont]}>APPROVE</Text>
                            </View>
                            <View style={[{justifyContent: 'center', alignItems: 'center', backgroundColor:'#42B883',borderLeftWidth:2, borderLeftColor:'white', borderTopRightRadius:5, borderBottomRightRadius:5}, getWidthnHeight(4,5)]}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            }
            {(userRole === "Auditor" && show && approvalData.length === 2) &&
            <View style={[{justifyContent: 'space-evenly'}, getWidthnHeight(100, 7)]}>
                <View style={[{borderColor: '#487DCB', borderWidth: 0, backgroundColor: '#DCDCDC'}, getWidthnHeight(100, 0.2)]}/>
                <View style={[{flexDirection: 'row', justifyContent: 'space-evenly'}, getWidthnHeight(100)]}>
                    <View style={[{alignItems: 'center', justifyContent: 'center'}]}>
                        <TouchableOpacity onPress={() => this.setState({submitClaim: true, sendBackData: true}, () => this.submitClaimRequest('send_it_back'))} style={[{flexDirection:'row', justifyContent: 'center', }]}>
                        <View style={[{justifyContent: 'center', alignItems: 'center', backgroundColor:'#F7B71D',borderRightWidth:2, borderRightColor:'white', borderTopLeftRadius:5, borderBottomLeftRadius:5}, getWidthnHeight(4,5)]}/>
                            <View style={[{ justifyContent: 'center', alignItems: 'center', backgroundColor:'#F7B71D'}, getWidthnHeight(20,5)]}>
                                <Text style = {[{color:'white', fontWeight:"bold"}, styles.boldFont]}>SENDBACK</Text>
                            </View>
                            <View style={[{justifyContent: 'center', alignItems: 'center', backgroundColor:'#F7B71D',borderLeftWidth:2, borderLeftColor:'white', borderTopRightRadius:5, borderBottomRightRadius:5}, getWidthnHeight(4,5)]}/>
                        </TouchableOpacity>
                    </View>
                    <View style={[{alignItems: 'center', justifyContent: 'center'}]}>
                        <TouchableOpacity onPress={() => this.setState({submitClaim: true, sendBackData: false}, () => this.submitClaimRequest('approve'))} style={[{flexDirection:'row', justifyContent: 'center', }]}>
                        <View style={[{justifyContent: 'center', alignItems: 'center', backgroundColor:'#42B883',borderRightWidth:2, borderRightColor:'white', borderTopLeftRadius:5, borderBottomLeftRadius:5}, getWidthnHeight(4,5)]}/>
                            <View style={[{ justifyContent: 'center', alignItems: 'center', backgroundColor:'#42B883'}, getWidthnHeight(20,5)]}>
                                <Text style = {[{color:'white', fontWeight:"bold"}, styles.boldFont]}>APPROVE</Text>
                            </View>
                            <View style={[{justifyContent: 'center', alignItems: 'center', backgroundColor:'#42B883',borderLeftWidth:2, borderLeftColor:'white', borderTopRightRadius:5, borderBottomRightRadius:5}, getWidthnHeight(4,5)]}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            }
            {(userRole === "Authority" && show) &&
            <View style={[{justifyContent: 'space-evenly'}, getWidthnHeight(100, 7)]}>
                <View style={[{borderColor: '#487DCB', borderWidth: 0, backgroundColor: '#DCDCDC'}, getWidthnHeight(100, 0.2)]}/>
                <View style={[{flexDirection: 'row', justifyContent: 'space-evenly'}, getWidthnHeight(100)]}>
                    <View style={[{alignItems: 'center', justifyContent: 'center'}]}>
                        <TouchableOpacity onPress={() => this.setState({submitClaim: true}, () => this.submitClaimRequest('reject'))} style={[{flexDirection:'row', justifyContent: 'center', }]}>
                        <View style={[{justifyContent: 'center', alignItems: 'center', backgroundColor:'#CD113B',borderRightWidth:2, borderRightColor:'white', borderTopLeftRadius:5, borderBottomLeftRadius:5}, getWidthnHeight(4,5)]}/>
                            <View style={[{ justifyContent: 'center', alignItems: 'center', backgroundColor:'#CD113B'}, getWidthnHeight(20,5)]}>
                                <Text style = {[{color:'white', fontWeight:"bold"}, styles.boldFont]}>REJECT</Text>
                            </View>
                            <View style={[{justifyContent: 'center', alignItems: 'center', backgroundColor:'#CD113B',borderLeftWidth:2, borderLeftColor:'white', borderTopRightRadius:5, borderBottomRightRadius:5}, getWidthnHeight(4,5)]}/>
                        </TouchableOpacity>
                    </View>
                    <View style={[{alignItems: 'center', justifyContent: 'center'}]}>
                        <TouchableOpacity onPress={() => this.setState({submitClaim: true}, () => this.submitClaimRequest('approve'))} style={[{flexDirection:'row', justifyContent: 'center', }]}>
                        <View style={[{justifyContent: 'center', alignItems: 'center', backgroundColor:'#42B883',borderRightWidth:2, borderRightColor:'white', borderTopLeftRadius:5, borderBottomLeftRadius:5}, getWidthnHeight(4,5)]}/>
                            <View style={[{ justifyContent: 'center', alignItems: 'center', backgroundColor:'#42B883'}, getWidthnHeight(20,5)]}>
                                <Text style = {[{color:'white', fontWeight:"bold"}, styles.boldFont]}>APPROVE</Text>
                            </View>
                            <View style={[{justifyContent: 'center', alignItems: 'center', backgroundColor:'#42B883',borderLeftWidth:2, borderLeftColor:'white', borderTopRightRadius:5, borderBottomRightRadius:5}, getWidthnHeight(4,5)]}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            }
            {(userRole === "Auditor" && show && approvalData.length === 4) &&
            <View style={[{justifyContent: 'space-evenly'}, getWidthnHeight(100, 7)]}>
                <View style={[{borderColor: '#487DCB', borderWidth: 0, backgroundColor: '#DCDCDC'}, getWidthnHeight(100, 0.2)]}/>
                <View style={[{flexDirection: 'row', justifyContent: 'space-evenly'}, getWidthnHeight(100)]}>
                    <View style={[{alignItems: 'center', justifyContent: 'center'}]}>
                        <TouchableOpacity onPress={() => {
                            const {commentsError} = this.state;
                            if(commentsError){
                                this.setState({submitClaim: true, enableAlert: true, alertTitle: message, alertColor: true})
                            }else{
                                this.setState({submitApprovePay: true})
                            }
                        }} style={[{flexDirection:'row', justifyContent: 'center'}]}>
                        <View style={[{justifyContent: 'center', alignItems: 'center', backgroundColor:'#42B883',borderRightWidth:2, borderRightColor:'white', borderTopLeftRadius:5, borderBottomLeftRadius:5}, getWidthnHeight(4,5)]}/>
                            <View style={[{ justifyContent: 'center', alignItems: 'center', backgroundColor:'#42B883'}, getWidthnHeight(30,5)]}>
                                <Text style = {[{color:'white', fontWeight:"bold"}, styles.boldFont]}>{"APPROVE & PAY"}</Text>
                            </View>
                            <View style={[{justifyContent: 'center', alignItems: 'center', backgroundColor:'#42B883',borderLeftWidth:2, borderLeftColor:'white', borderTopRightRadius:5, borderBottomRightRadius:5}, getWidthnHeight(4,5)]}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            }
            </KeyboardAvoidingView>
                <View 
                    style={[{backgroundColor: (loading)? 'rgba(0, 0, 0, 0.5)' : 'transparent'}, StyleSheet.absoluteFill]} 
                    pointerEvents={(loading)? 'auto' : 'none'}
                >
                    {(loading) ?
                        <Spinner loading={loading} style={[styles.loadingStyle, getWidthnHeight(45, 10)]} color='rgb(19,111,232)'/>
                    : null}
                </View>
            </View>
            {(this.state.apiError) &&
                <AlertBox 
                    title={'Something went wrong'}
                    subtitle={`Error Code: ${errorCode}${apiCode}`}
                    visible={this.state.apiError}
                    onDecline={() => this.setState({apiError: false, alertTitle: '', alertColor: false})}
                    titleStyle={{color: 'black'}}
                    color={false}
                />
            }
            {(this.state.enableAlert) &&
                <AlertBox 
                    title={this.state.alertTitle}
                    visible={this.state.enableAlert}
                    onDecline={() => this.setState({enableAlert: false, alertTitle: '', alertColor: false})}
                    titleStyle={{color: 'black'}}
                    color={this.state.alertColor}
                />
            }
            {(submitApprovePay) &&
                <Approve_Pay 
                    isVisible={submitApprovePay}
                    toggle={(utrValue = '', date = '') => {
                        this.setState({submitApprovePay: false})
                        if(utrValue){
                            this.setState({utr: utrValue})
                        }
                        if(date){
                            this.setState({utrDate: date})
                        }
                    }}
                    containerStyle={[{
                        backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', 
                        borderRadius: getWidthnHeight(undefined, 1).height}, getWidthnHeight(90, 35)]}
                    subContainer={[{alignItems: 'center', justifyContent: 'space-evenly'}, getWidthnHeight(90, 34)]}
                    approvePay={() => this.setState({submitClaim: true}, () => this.submitClaimRequest('pay_approve'))}
                    utrValue={this.state.utr}
                    utrDate={this.state.utrDate}
                />
            }
            </View>
    )
  }
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
        marginTop:getMarginTop(.8).marginTop,
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
        width:getWidthnHeight(95).width,
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black',
        borderColor: '#C4C4C4',
        marginTop:getMarginTop(1.5).marginTop
        },  
        InputBox:{
        borderWidth: 1,
        left:0,
        width:getWidthnHeight(95).width,
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
        width: wp(94.5),
        height:hp(27),
        backgroundColor: '#FFFFFF',
        borderWidth:1,
        borderColor: '#C4C4C4',
        marginLeft:getMarginLeft(3).marginLeft
        },
        showstatusbox:{
        marginTop:'1%',
        width: wp(95),
        height:hp(10),
        backgroundColor: '#FFFFFF',
        borderWidth:1,
        borderColor: '#C4C4C4',
        },
        arrow: {
            width: 0,
            height: 0,
            backgroundColor: "transparent",
            borderStyle: "solid",
            borderRightWidth: getWidthnHeight(2.3).width,
            borderTopWidth: getWidthnHeight(2.3).width,
            borderRightColor: "black",
            borderTopColor: "transparent",
            transform: [{
                rotate: '-45deg'
            }]
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
