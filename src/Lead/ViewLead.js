import React, { Component } from 'react';
import {
  StyleSheet,
  Text, TouchableOpacity,
  View, Image, Dimensions,
  ActivityIndicator, Alert,
  SafeAreaView, ScrollView,
  PermissionsAndroid, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import RNBackgroundDownloader from 'react-native-background-downloader';
import RNFS, {exists} from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import EditIcon from 'react-native-vector-icons/Feather';
import KeyboardShift from '../KeyboardShift';
import moment from 'moment';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {extractBaseURL, getLeadDownloadAPI} from '../api/BaseURL';
import {
    CommonModal, IOS_StatusBar, getWidthnHeight, getMarginTop, FloatingTitleTextInputField, 
    WaveHeader, RoundButton, getMarginVertical, Loader, DownloadModal, Spinner, getMarginLeft
} from '../NewComponents/common';
import { Linking } from 'react-native';
import { error } from 'pdf-lib';

const colorBase = '#25A2F9';
const modalColor = '#1079D5';
let downloading = null;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        Prospect_name:'',
        button_value:'',
        leadIndustryOptions_id:'',
        leadSourceOptions_id:'',
        eadSourceOptions:[],
        leadIndustryOptions:[],
        service_description:'',
        name_of_prospect:'',
        address_location:'',
        business_type:'',
        contact_person_name:'',
        contact_person_email:'',
        contact_person_mobile_number:'',
        contact_person_alternate_mobile_number:'',
        services_required:'',
        lead_idLeadView:'',
        statusLeadView:'',
        loading: false,
        commentsLeadView:'',
        hodId:'',
        user_id:'',
        is_completed:'',
        baseURL: null,
        errorCode: null,
        apiCode: null,
        commonModal: false,
        commentsError: true,
        buttonPressed: false,
        fileName: '',
        fullFileName: '',
        downloadLink: null,
        secretToken: null,
        downloadModal: false,
        downloading: '0%',
        fileSize: null,
        percent: 0,
        checkFile: false
    };
    this.props.navigation.setOptions({
        title: 'View Lead'
    })
  }


    async componentDidMount(){
        const {navigation} = this.props;
        this._unsubscribe = navigation.addListener("focus", async() => {
            await extractBaseURL().then((baseURL) => {
                console.log("@@@###!!! BASEURL: ", baseURL)
                this.setState({baseURL}, () => {
                    this.Viewlead()
                })
            })
        })
        if(Platform.OS === 'android'){
            this.getAndroidStoragePermission();
        }else if(Platform.OS === 'ios'){
            this.get_iOS_StoragePermission();
        }
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

    downloadAttachment(){
        const {fileName, downloadLink, secretToken, loading} = this.state;
        const {view_lead} = this.props.route.params;
        if(!secretToken || !downloadLink || loading){
            return;
        }
        this.showLoader();
        //const downloadDir = RNFS.DownloadDirectoryPath;
        let downloadDir = null;
        if(Platform.OS === 'android'){
            downloadDir = RNFetchBlob.fs.dirs.DownloadDir;
        }else if(Platform.OS === 'ios'){
            downloadDir = RNFS.DocumentDirectoryPath;
        }
        console.log("&&&& %%%%% ^^^^^DOWNLOAD", downloadDir)
        const downloadPath = `${downloadDir}/${view_lead.lead_code}-${fileName}`;
        this.setState({fullFileName: `${view_lead.lead_code}-${fileName}`}, () => {
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
        })
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

    async checkExistingDownloads(){
        const {loading} = this.state;
        if(loading){
            this.setState({downloadModal: true})
            return;
        }
        let lostTasks = await RNBackgroundDownloader.checkForExistingDownloads();
        console.log("$$$$ ANY DOWNLOADS: ", lostTasks)
        if(lostTasks.length == 0){
            this.downloadAttachment();
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

    async generateDownloadLink(fileName){
        await getLeadDownloadAPI(fileName).then((link) => {
            this.setState({downloadLink: link}, () => console.log("%%%%%% @@@@@@ DOWNLOAD LINK: ", this.state.downloadLink))
        })
    }

    componentWillUnmount(){
        this._unsubscribe();
    }

    checkError(){
        this.setState({buttonPressed: true})
        const {commentsError} = this.state;
        if(commentsError){
            Alert.alert("Comments field is required")
        }else{
            this.Approve_lead();
        }
    }

    Approve_lead=async()=>{
        const {baseURL} = this.state;
        const _this = this;
        this.showLoader();
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_four=permissions_fir.success.secret_token;
        var user_id=permissions_fir.success.user.id;
        this.setState({user_id:user_id})
        var data = new FormData();
        data.append("lead_id", this.state.lead_idLeadView);
        data.append("status", this.state.statusLeadView);
        data.append("comments", this.state.commentsLeadView);
        data.append("hod_id", this.state.hodId);
    
        console.log("&&^^^** API URL: ", `${baseURL}/lead-approval`)
        console.log("lead_id",this.state.lead_idLeadView)
        console.log("status",this.state.statusLeadView)
        console.log("comments",this.state.commentsLeadView)
        console.log("hod_id",this.state.hodId)
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        
        xhr.addEventListener("readystatechange", function() {
        if(this.readyState !== 4) {
            return;
        }if(xhr.status == 200){
            _this.hideLoader();
            console.log("@$@#@#$&& SUCCESS: ", this.responseText);
            var json_obj = JSON.parse(xhr.responseText);
            var msg = json_obj.success;
            Alert.alert(msg);
            _this.setState({commentsLeadView:'', commentsError: true, buttonPressed: false})
            _this.props.navigation.navigate(_this.props.route.params.screen, { reload: true })
        }else if(xhr.status == 403){
            console.log("@#@#@#@ ERROR: ", this.responseText);
            var json_obj = JSON.parse(xhr.responseText);
            var msg = json_obj.error;
            Alert.alert(msg);
            _this.hideLoader();
        }else {
            console.log("@****@ ERROR: ", this.responseText);
            _this.enableModal(xhr.status, "089");
        }
        });
        
        xhr.open("POST", `${baseURL}/lead-approval`);
        xhr.setRequestHeader("Authorization", "Bearer " + permissions_four);
        
        xhr.send(data);
    }

    onDecline(){
        this.setState({commonModal: false})
    }
  
    enableModal(status, apiCode){
        this.setState({errorCode: status})
        this.setState({apiCode})
        this.setState({commonModal: true})
    }

    hideLoader = () => {
        this.setState({ loading: false });
    }

    showLoader = () => {
        this.setState({ loading: true });
    }

    Viewlead=async()=>{
        const context=this;
        const {view_lead} = this.props.route.params;
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_four=permissions_fir.success.secret_token;
        var user_id=permissions_fir.success.user.id;
        this.setState({user_id:user_id})
        var hodId = (context.props.route.params.hodId);
        var ViewLead = (context.props.route.params.view_lead); 
        this.setState({lead_idLeadView:ViewLead.id})
        this.setState({hodId:hodId})
        this.setState({is_completed:ViewLead.is_completed})
        this.setState({fileName: view_lead.file_name}, async () => {
            const {fileName} = this.state;
            if(fileName){
                this.generateDownloadLink(fileName);
            }
        })
    }

  render (){
        const {errorCode, apiCode, buttonPressed, commentsError, secretToken, loading, downloadModal, fullFileName, percent, user_id} = this.state;
        const {screen} = this.props.route.params;
        const context=this;
        // console.log("USERID & HODID: ", this.props.canApprove, this.props.view_lead.is_completed, this.props.view_lead.status)
        let status = [{value: 'all',}, {value: 'Today Tasks',}, {value: 'Delayed Tasks',},{value: 'Upcoming Tasks', },{value: "This Week's Tasks",},{value: "This Month's Tasks",},];
        var ViewLead = (context.props.route.params.view_lead); 
        const priority = ViewLead.priority;
        let priorityLabel = null;
        let priorityColor = null;
        if(priority === 0){
            priorityLabel = 'Low';
            priorityColor = '#3181c4';
        }else if(priority === 1){
            priorityLabel = 'Normal';
            priorityColor = '#f57f20';
        }else if(priority === 2){
            priorityLabel = 'Critical'
            priorityColor = '#ee282c';
        }
        console.log("^^^&&&$$$ PROPS CHECK FOR LEAD: ", context.props.route.params.view_lead);
        //console.log("IOS PATH: ", RNFetchBlob.fs.dirs.DownloadDir)
        var hodId = (context.props.route.params.hodId); 
        var userId = (context.props.route.params.userId);
        var canApprove = (context.props.route.params.canApprove);
        var name = (context.props.route.params.view_lead.lead_executives !== null ? context.props.route.params.view_lead.lead_executives.fullname : "--");
        var Comment = (context.props.route.params.view_lead.comments);
        var employeeFullname = (context.props.route.params.employeeFullname !== null ? context.props.route.params.employeeFullname : "--");
        let gradient = ['#0E57CF', '#25A2F9'];
        let dueDateTime = null;
        let dueTime12Hr = null;
        let dueDateTime12Hr = null
        if(ViewLead.due_date){
            dueDateTime = ViewLead.due_date.split(' ')
            dueTime12Hr = (moment(dueDateTime[1], ['HH:mm:ss']).format('hh:mm A'))
            dueDateTime12Hr = `${dueDateTime[0]}   ${dueTime12Hr}`
        }
        let prebidDateTime = null;
        let prebidTime12Hr = null;
        let prebidDateTime12Hr = null
        if(ViewLead.prebid === 1){
            prebidDateTime = ViewLead.prebid_date.split(' ')
            prebidTime12Hr = (moment(prebidDateTime[1], ['HH:mm:ss']).format('hh:mm A'))
            prebidDateTime12Hr = `${prebidDateTime[0]}   ${prebidTime12Hr}`
        }
        if(user_id){
            console.log("PERMISSION CHECK: ", user_id, ViewLead.status)
        }
  return (

    <KeyboardShift>
            {()=>(
                <View style={{flex: 1, backgroundColor:'white'}}>
                  <IOS_StatusBar barStyle="light-content"/>
                    {/* {<Loader
                        visible={loading}
                        onPress={this.hideLoader}
                    />} */}
                    <DownloadModal 
                        visible={downloadModal}
                        fileName={fullFileName}
                        percent={percent}
                        onBackdropPress={() => this.setState({downloadModal: false})}
                    />
                <View style={{flex: 1}}>
                <View style={[{alignItems: 'center'}, getWidthnHeight(100)]}>
                    <View style={[{alignItems:'center', backgroundColor: 'white', borderColor: 'red', borderWidth: 0}, getWidthnHeight(90), getMarginVertical(1.5)]}>    
                        <Text style={[{color:colorBase, textAlign: 'center', fontWeight: 'bold'}, styles.boldFont]}>{(ViewLead.name_of_prospect)? ViewLead.name_of_prospect + " " + `(${ViewLead.lead_code})` : `-- (${ViewLead.lead_code})`}</Text> 
                    </View>
                </View>
                <SafeAreaView style={[styles.MainContainer, getMarginTop(0)]}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{marginTop: 10, alignItems: 'center'}}>
                            <View style={[{borderWidth: 0, borderColor: 'black', justifyContent: 'center'}, getWidthnHeight(90)]}>
                                {(ViewLead.file_name)?
                                    <View style={[{alignItems: 'center'}, getMarginVertical(1), getWidthnHeight(90)]}>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text style={{borderBottomWidth: 0, borderBottomColor: 'black'}}>Click to </Text>
                                            <TouchableOpacity onPress={() => (secretToken)? this.checkExistingDownloads() : null}>
                                                <Text style={{color: (secretToken && !loading)? colorBase: 'dimgrey', borderBottomWidth: 1, borderBottomColor: (secretToken && !loading)? colorBase: 'dimgrey'}}>Download</Text>
                                            </TouchableOpacity>
                                            <Text style={{borderBottomWidth: 0, borderBottomColor: 'black'}}> Attachment</Text>
                                        </View>
                                    </View>
                                :
                                    <View style={{alignItems: 'center'}}>
                                        <Text>No attachment found</Text>
                                    </View>
                                }
                                {(ViewLead.status == '3' && user_id == 35)?
                                    <View style={{position: 'absolute', alignSelf: 'flex-end'}}>
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('LeadEdit', {view_lead: ViewLead, screen: screen})}>
                                            <EditIcon name='edit' size={20} color='#e5314e'/>
                                        </TouchableOpacity>
                                    </View>
                                :
                                    null
                                }
                            </View> 
                            <View style={[{borderWidth: 0, borderColor: 'red', justifyContent: 'space-evenly', 
                                height: (ViewLead.source.source_name === 'Others')? getWidthnHeight(undefined, 33).height : getWidthnHeight(undefined, 25).height}, getWidthnHeight(90)]}>
                                <View style={{flexDirection:'row',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:'#c4c4c4'}}>
                                    <Text style={{color:'#c4c4c4'}}>Business Type</Text>
                                    <Text>{ViewLead.business_type == 1 ? "Government" : "Corporate"}</Text>
                                </View>
                                <View style={{flexDirection:'row',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:'#c4c4c4'}}>
                                    <Text style={{color:'#c4c4c4'}}>Source</Text>
                                    <Text>{ViewLead.source.source_name}</Text>
                                </View>
                                {(ViewLead.source.source_name === 'Others')?
                                    <View style={{flexDirection:'row',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:'#c4c4c4'}}>
                                        <Text style={{color:'#c4c4c4'}}>Other Source</Text>
                                        <Text>{ViewLead.other_sources}</Text>
                                    </View>
                                :
                                    null
                                }
                                <View style={{flexDirection:'row',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:'#c4c4c4'}}>
                                    <Text style={{color:'#c4c4c4'}}>Industry</Text>
                                    <Text>{ViewLead.industry == null ? (ViewLead.other_industry)? ViewLead.other_industry : '--' : ViewLead.industry.industry_name }</Text>
                                </View>
                                <View style={{flexDirection:'row',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:'#c4c4c4'}}>
                                    <Text style={{color:'#c4c4c4'}}>Due Date</Text>
                                    <Text>{(ViewLead.due_date)? dueDateTime12Hr : '--'}</Text>
                                </View>
                            </View>

                            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                <Text style={[{fontWeight: 'bold'}, styles.boldFont]}>Priority:  </Text>
                                <Text style={[{color: priorityColor, fontWeight: 'bold'}, styles.boldFont]}>{priorityLabel}</Text>
                            </View>

                            <View style={[{borderColor:'#c4c4c4',borderWidth:1,borderRadius:10,marginTop: 20, alignItems: 'center', justifyContent: 'space-between'}, getWidthnHeight(90)]}>
                                <View style={[{backgroundColor:colorBase,flexDirection:'column',justifyContent:'center',alignItems:'center',borderTopLeftRadius:10, borderTopRightRadius: 10}, getWidthnHeight(90)]}>
                                    <Text style={{color:'white'}}>CONTACT PERSON DETAILS</Text>
                                </View>
                                <View style={[{justifyContent: 'space-evenly'}, getWidthnHeight(85)]}>
                                    <View style={[{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#c4c4c4', alignItems: 'center'}, getWidthnHeight(undefined, 5)]}>
                                        <Image source={require('../Image/grayUser.png')} style={{ width: 10, height: 13, marginLeft: 0}} />
                                        <Text style={{paddingLeft: 20}} numberOfLines = {1} >{ViewLead.contact_person_name == null ? '--' : ViewLead.contact_person_name}</Text>
                                    </View>
                                    <View style={[{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#c4c4c4', alignItems: 'center'}, getWidthnHeight(undefined, 5)]}>
                                        <Image source={require('../Image/grayMail.png')} style={{ width: 14, height: 10.5, marginLeft: 0}} />
                                        <Text style={{paddingLeft: 15}} numberOfLines = {1} >{ViewLead.email == null ? '--' : ViewLead.email}</Text>
                                    </View>
                                    <View style={[{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#c4c4c4', alignItems: 'center'}, getWidthnHeight(undefined, 5)]}>
                                        <Image source={require('../Image/grayPhone.png')} style={{ width: 8, height: 14, marginLeft: 0}} />
                                        <Text style={{paddingLeft: 20}} numberOfLines = {1} >{ViewLead.contact_person_no == null ? '--' : ViewLead.contact_person_no}</Text>
                                    </View>
                                    {(ViewLead.alternate_contact_no)?
                                        <View style={[{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#c4c4c4', alignItems: 'center'}, getWidthnHeight(undefined, 5)]}>
                                            <Image source={require('../Image/grayPhone.png')} style={{ width: 8, height: 14, marginLeft: 0}} />
                                            <Text style={{paddingLeft: 20}} numberOfLines = {1} >{ViewLead.alternate_contact_no} - Alternate</Text>
                                        </View>
                                    :
                                    null
                                    }
                                    <View style={[{flexDirection:'row',borderBottomWidth:0,borderBottomColor:'#c4c4c4', alignItems: 'center'}, getWidthnHeight(undefined, 5)]}>
                                        <Image source={require('../Image/grayLocation.png')} style={{ width: 10, height: 13, marginLeft: 0}} />
                                        <Text style={{paddingLeft: 20}} numberOfLines = {2} >{ViewLead.address_location == null ? '--' : ViewLead.address_location}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={[{marginTop: 20, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between'}, getWidthnHeight(90)]}>
                                <View>
                                    <Text style={{color:'#c4c4c4'}}>PreBid: </Text>
                                    <Text>{(ViewLead.prebid === 0)? 'No' : 'Yes'}</Text>
                                </View>
                                <View>
                                    <Text style={{color:'#c4c4c4'}}>PreBid Date: </Text>
                                    <Text>{(ViewLead.prebid === 1)? prebidDateTime12Hr : '--'}</Text>
                                </View>
                            </View>

                            <View style={[{borderWidth: 0, borderColor: 'red', justifyContent: 'space-evenly'}, getWidthnHeight(90)]}>
                                <View style={[{flexDirection:'row',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:'#c4c4c4', alignItems: 'flex-end'}, getWidthnHeight(undefined, 6)]}>
                                    <Text style={{color:'#c4c4c4'}}>Tenure</Text>
                                    <Text>{(ViewLead.tenure)? ViewLead.tenure : '--'}</Text>
                                </View>
                            
                                <View style={[{flexDirection:'row',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:'#c4c4c4', alignItems: 'flex-end'}, getWidthnHeight(undefined, 6)]}>
                                    <Text style={{color:'#c4c4c4'}}>Volume</Text>
                                    <Text>{(ViewLead.volume)? ViewLead.volume : '--'}</Text>
                                </View>
                            
                                <View style={[{flexDirection:'row',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:'#c4c4c4', alignItems: 'flex-end'}, getWidthnHeight(undefined, 6)]}>
                                    <Text style={{color:'#c4c4c4'}}>Value</Text>
                                    <Text>{(ViewLead.value)? ViewLead.value : '--'}</Text>
                                </View>
                                
                                <View style={[{flexDirection:'row',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:'#c4c4c4', alignItems: 'flex-end', marginBottom: 20}, getWidthnHeight(undefined, 6)]}>
                                    <Text style={{color:'#c4c4c4'}}>EMD Amount</Text>
                                    <Text>{(ViewLead.emd_amount)? ViewLead.emd_amount : '--'}</Text>
                                </View>
                            </View>

                            <View style={[{marginVertical: 10, alignItems: 'flex-start', borderColor: 'red', borderWidth: 0}, getWidthnHeight(90)]}>
                                <Text style={{color:'#c4c4c4'}}>Service Required</Text>
                                <Text numberOfLines = {10}>{(ViewLead.service_required)? ViewLead.service_required : '--'}</Text>
                            </View>
                            <View style={[{marginVertical: 10, alignItems: 'flex-start', borderColor: 'red', borderWidth: 0}, getWidthnHeight(90)]}>
                                <Text style={{color:'#c4c4c4'}}>Service Description</Text>
                                    <Text numberOfLines = {10}>{ViewLead.service_description}</Text>
                            </View>

                            <TouchableOpacity style={[{borderColor: 'green', borderWidth: 0, marginHorizontal: 10, marginTop: 10, alignItems: 'center'}, getWidthnHeight(50)]} onPress={() => {
                                //context.props.navigation.navigate("LeadComments",{Comment:Comment,name:employeeFullname})
                                console.log("@@@TOUCHED", Comment, employeeFullname, ViewLead.lead_code)
                                this.props.navigation.navigate('LeadComments', {Comment:Comment,name:employeeFullname, screen: this.props.route.params, leadCode: ViewLead.lead_code})
                            }}>
                                <Text style={{color:colorBase,textDecorationLine: 'underline',fontSize:11}}>VIEW PREVIOUS COMMENTS</Text>
                            </TouchableOpacity>
                            <View style={{alignItems: 'center'}}>
                                <View style={{marginVertical: 10,flexDirection:'column',justifyContent:'center',alignItems:'center',borderBottomWidth:3,borderBottomColor:colorBase,width:60}}/> 
                            </View>
                            {(canApprove == true) && ((ViewLead.is_completed == 1 ) || (ViewLead.status == 3)) ?
                                <View>
                                    <FloatingTitleTextInputField
                                        attrName = 'addnewcomments'
                                        title = 'Add New Comments'
                                        value={this.state.commentsLeadView}
                                        titleActiveColor = {colorBase}
                                        titleInactiveColor = 'dimgrey'
                                        updateMasterState = {(attrName, commentsLeadView) => {
                                        this.setState({commentsLeadView})
                                        if(commentsLeadView === ''){
                                            this.setState({commentsError: true})
                                        }else{
                                            this.setState({commentsError: false})
                                        }
                                        console.log("ATTRNAME: ", attrName)
                                        }}
                                        textInputStyles = {[{ // here you can add additional TextInput styles
                                        color: 'black',
                                        fontSize: 14,
                                        borderColor: (buttonPressed && commentsError)? 'red' : 'grey',
                                        borderStyle: (buttonPressed && commentsError)? 'dashed' : 'solid',
                                        borderWidth: (buttonPressed && commentsError)? 2 : 1
                                        }, getWidthnHeight(undefined, 10)]}
                                        containerStyle = {[getWidthnHeight(90, 12)]}
                                    />
                                    {/* {<RedBox
                                        placeholder={"Add New Comments"}
                                        onChangeText={commentsLeadView => this.setState({commentsLeadView})}
                                        value={this.state.commentsLeadView}
                                        style={[getWidthnHeight(90, 12)]}
                            />} */}
                                </View>
                            :null}            
                        </View>
                    </ScrollView>
                    {(canApprove == true) && ((ViewLead.is_completed == 1 ) || (ViewLead.status == 3)) ?
                        <View style={[{justifyContent:'space-between', alignItems: 'center', borderWidth: 0, borderTopColor: '#e5314e'}, getWidthnHeight(100, 7)]}>
                            <View style={[{height: 1, borderTopWidth: 1, borderTopColor: colorBase}, getWidthnHeight(70)]}/>
                            <View style={[{flexDirection:'row',justifyContent:'space-around', alignItems: 'center'}, getWidthnHeight(100, 6)]}>
                            <RoundButton 
                                title="REJECT"
                                onPress={()=>this.setState({statusLeadView:4}, () => this.checkError())}
                                gradient={['#B81010', '#E43636']}
                                style={[getWidthnHeight(30, 5)]}
                            />
                            <RoundButton 
                                title="APPROVE"
                                onPress={()=>this.setState({statusLeadView:5}, () => this.checkError())}
                                gradient={['#099E22', '#16CB34']}
                                style={[getWidthnHeight(30, 5)]}
                            />
                            </View>
                        </View>
                    :null}
                </SafeAreaView>
                <View 
                    style={[{backgroundColor: (loading)? 'rgba(0, 0, 0, 0.5)' : 'transparent'
                    }, StyleSheet.absoluteFill]} 
                    pointerEvents={(loading)? 'auto' : 'none'}
                >
                    {(loading) ?
                        <Spinner loading={loading} style={[styles.loadingStyle, getWidthnHeight(45, 10), getMarginLeft(3)]} color='rgb(19,111,232)'/>
                    : null}
                </View>
                </View>
                <CommonModal 
                    title="Something went wrong"
                    subtitle= {`Error Code: ${errorCode}${apiCode}`}
                    visible={this.state.commonModal}
                    onDecline={this.onDecline.bind(this)}
                    buttonColor={['#0E57CF', '#25A2F9']}
                />
                </View>
                )}
            </KeyboardShift>
    );
}

}
const styles = StyleSheet.create({
    MainContainer:{
        flex: 1,
        alignItems: 'center',
        backgroundColor:'white',
        paddingLeft:20,
        paddingRight:20,
        borderTopLeftRadius:0,
        borderTopRightRadius:0,
    },
    container: {
        flex: 0,
        flexDirection:'column',
        left:'0%',
        width:wp('100%'),
        height:hp('90%'),
    },
    boldFont: {
        ...Platform.select({
        android: {
            fontFamily: ''
        }
        })
    },
    loader: {
        ...Platform.select({
            ios: {
            zIndex: 1,
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
    }
});

export default (App);
