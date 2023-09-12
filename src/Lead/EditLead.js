import React, { Component } from 'react';
import {
  StyleSheet, Text,
  TouchableOpacity, View, Image,
  Dimensions, ActivityIndicator,
  ScrollView, Keyboard, Platform,
  PermissionsAndroid
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActionModal from 'react-native-modal';
import {connect} from 'react-redux';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import RNBackgroundDownloader from 'react-native-background-downloader';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS, {exists} from 'react-native-fs';
import ImagePicker from 'react-native-image-picker';
import { Dropdown } from 'react-native-material-dropdown';
import DocumentPicker from 'react-native-document-picker';
import NewsPaper from '../Components/NewsPaper';
import {extractBaseURL, getLeadDownloadAPI} from '../api/BaseURL';
import KeyboardShift from '../KeyboardShift';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Close from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { values } from 'pdf-lib';
import { Alert } from 'react-native';
import {
  CommonModal, IOS_StatusBar, getMarginTop, getMarginBottom, getWidthnHeight, getMarginLeft,
  FloatingTitleTextInputField, getMarginVertical, DateSelector, DateTimePicker, Spinner,
  TimePicker, RoundButton, RadioEnable, RadioDisable, AlertBox, DownloadModal, fontSizeH4
} from '../NewComponents/common';
import {cameraFile, show_HideTimePicker, prebidTime} from '../store/redux/reducer';

//const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const colorBase = '#25A2F9';
const colorTitle = '#0B8EE8';

class App extends Component {
  constructor(props) {
    super(props);
    this.myTextInput = React.createRef();
    let year = `${moment().year()}`;
    let month = `${moment().month() + 1}`;
    month = (month < 10)? `0${month}` : month;
    let initialDate = '1';
    initialDate = (initialDate < 10)? `0${initialDate}` : initialDate;
    let currentDate = `${year}-${month}-${initialDate}`;
    console.log("!!@@@ DATE: ", currentDate)
    currentDate = moment(currentDate, "YYYY-MM-DD").subtract(1, 'month').format("YYYY-MM-DD");
    // const currentYear = moment(currentDate, "YYYY-MM-DD").format("YYYY");
    // if(year !== currentYear){
    //     currentDate = `${year}-${month}-${initialDate}`
    //     console.log("***&&& DATE2: ", currentDate, year, currentYear)
    // }
    const currentTime = "12:00 AM";
    const currentDateTime = `${currentDate} ${currentTime}`;
    const utcTimeStamp = moment(currentDateTime, "YYYY-MM-DD hh:mm A").utc().toDate();
    this.state = {
        fromDate: moment().format("YYYY-MM-DD"),
        fromDateError: true,
        fromTimeStamp: moment().valueOf(),
        fromTime: '12:00 AM',
        fromMinDate: utcTimeStamp,
        showFromDatePicker: false,
        fromDate2: moment().format("YYYY-MM-DD"),
        fromDateError2: true,
        fromTimeStamp2: moment().valueOf(),
        showFromDatePicker2: false,
        loading: false,
        Prospect_name:'',
        button_value: null,
        leadIndustryOptions_id:'',
        other_industry: '',
        leadSourceOptions_id: 1,
        leadSourceOptions:[],
        leadIndustryOptions:[],
        service_description:'',
        name_of_prospect:'',
        address_location:'',
        business_type: 1,
        contact_person_name:'',
        contact_person_email:'',
        contact_person_mobile_number:'',
        contact_person_alternate_mobile_number:'',
        services_required:'',
        singleFileOBJ:'',
        attachmentOBJ: '',
        dateTime:'',
        radioComponentStatus:true,
        container:'newsPaper',
        otherSource:'',
        Time:'',
        leadIndustryOptionsId:[],
        StartingDateTimeValue: null,
        ToDateValue: null,
        ToTimeValue: null,
        isStartingDateTimePickerVisible: false,
        isToDatePickerVisible: false,
        isToTimePickerVisible: false,
        dateOrTimeValue: '',
        datePickerVisible: false, 
        timePickerVisible: false,
        LeadTime:'',
        file:'',
        chooseFileStatus:true,
        chooseFileView:true,
        path: null,
        image:'',
        status:'false',
        baseURL: null,
        errorCode: null,
        apiCode: null,
        commonModal: false,
        dimensions: undefined,
        data: null,
        slideAnimationDialog: false,
        radioPreBidStatus: false,
        tenure: '',
        volume: '',
        value: '',
        emdAmount: '',
        timePicker: false,
        prebidDate: '',
        prebidTimeValue: '',
        preBidTimeState: false,
        dateNTime: '',
        preBidDatenTime: '',
        dueTimeError: true,
        prebidDateError: true,
        prebidTimeError: true,
        serviceDescriptionError: true,
        newComments: '',
        nameProspectError: true,
        industryIDError: true,
        nameError: true,
        mobileNumberError: true,
        altNumberError: true,
        addressError: true,
        serviceRequiredError: true,
        tenureError: true,
        volumeError: true,
        valueError: true,
        emdAmountError: true,
        newCommentsError: true,
        prebidNumber: 0,
        leadListId: '',
        noImagePresent: function(){
          return (this.nameProspectError === false && this.industryIDError === false && this.nameError === false && this.mobileNumberError === false && 
            this.altNumberError === false && this.emailError === false && this.addressError === false && this.serviceRequiredError === false && 
            this.tenureError === false && this.volumeError === false && this.valueError === false && this.emdAmountError === false && 
            this.serviceDescriptionError === false && this.newCommentsError === false)
        },
        imagePresent: function(){
          return (this.serviceRequiredError === false && this.tenureError === false && this.volumeError === false && this.valueError === false && 
            this.emdAmountError === false && this.serviceDescriptionError === false && this.newCommentsError === false)
        },
        savePressed: false,
        otherIndustryError: true,
        email: true,
        emailError: true,
        enableAlert: false,
        alertTitle: null,
        alertColor: false,
        show_is_completed: false,
        saveAsDraftPressed: false,
        apiError: null,
        fileName: '',
        fullFileName: '',
        downloadLink: null,
        secretToken: null,
        editable: false,
        selectPriority: 0,
        priorityLabel: 'Low',
        fileSize: null,
        percent: 0,
        checkFile: false,
        downloadModal: false
    };
    this.props.navigation.setOptions({
      title: 'Edit Lead'
    })
  }
  
  selectPhotoTapped() {
    const options = {
        quality: 0.5,
        maxWidth: 400,
        maxHeight: 400,
        cameraType:'front',
        storageOptions: {
        waitUntilSaved: true,
        cameraRoll: true,
        skipBackup : true,
      },
    };
    ImagePicker.launchCamera(options, (response)  => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = {uri:response.uri,type:response.type,name:response.fileName};
        console.log(source)
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          singleFileOBJ: source,
          file_sec: response.data
        });
      }
    });
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

  goverment = () => {
    this.setState({button_value:0}); 
    this.setState({business_type:1});

  };
  corporate = () => {
    this.setState({button_value:1});
    this.setState({business_type:2});
    
  };


 async componentDidMount(){
  const {navigation} = this.props;
  const { view_lead } = this.props.route.params;
  this._unsubscribe = navigation.addListener("focus", async() => {
    await extractBaseURL().then((baseURL) => {
      this.setState({baseURL}, () => this.dropdown_api())
    })
    
    if(this.props.file?.uri){
      const filePath = this.props.file.uri
      const splitArray = filePath.split('Camera/')
      const fileData = {type: 'image/jpeg', name: splitArray[1], uri: filePath}
      
      console.log("OBJECT ASSIGN: ", Object.assign({}, fileData))
      this.setState({data: filePath}, () => {
        if(this.state.data){
          this.props.cameraFile(null)
        }
        console.log("FILE: ", this.state.data)
      })
      this.setState({singleFileOBJ: fileData}, () => {
        console.log("FILE DATA: ", this.state.singleFileOBJ)
      })
    }
    // if(this.state.chooseFileStatus=='false'){
    // this.imageUrl();
    // }
  })
  if(Platform.OS === 'android'){
      this.getAndroidStoragePermission();
  }else if(Platform.OS === 'ios'){
      this.get_iOS_StoragePermission();
  }
  await this.editLead();
  this.props.show_HideTimePicker({'fromTime': null, 'toTime': null});
  this.props.prebidTime({'fromTime': null, 'toTime': null});
  const user_token= await AsyncStorage.getItem('user_token');
  const permissions_fir= JSON.parse(user_token);
  this.setState({secretToken: permissions_fir.success.secret_token});
  // if(view_lead.file_name){
  //   this.setState({nameProspectError: false, industryIDError: false, nameError: false, mobileNumberError: false,
  //     altNumberError: false, emailError: false, addressError: false
  //   })
  // }
  this.setState({fileName: view_lead.file_name}, async () => {
      const {fileName} = this.state;
      if(fileName){
          this.generateDownloadLink(fileName);
      }
  })
 }

 async extractLink(){
  await extractBaseURL().then((baseURL) => {
    this.setState({baseURL}, () => console.log("EXTRACT LINK: ", this.state.baseURL))
  })
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

  editLead(){
    const {view_lead} = this.props.route.params;
    console.log("INDUSTRY PROP: ", view_lead.industry_id)
    this.setState({leadListId: view_lead.id}, () => console.log("&&&&&&& EDIT LEAD ID: ", this.state.leadListId))
    this.setState({singleFileOBJ: (view_lead.file_name)? view_lead.file_name : ''})
    this.setState({name_of_prospect: (view_lead.name_of_prospect)? view_lead.name_of_prospect : ''}, () => {
      if(view_lead.name_of_prospect){
        this.setState({nameProspectError: false})
      }
    })
    this.setState({business_type: view_lead.business_type, leadSourceOptions_id: view_lead.source_id}, () => {
      console.log("SOURCE: ", this.state.leadSourceOptions_id)
      if(this.state.leadSourceOptions_id === 1){
        this.setState({otherSource: '', container: 'newsPaper'})
      }else if(this.state.leadSourceOptions_id === 2){
        this.setState({otherSource: '', container: 'Website'})
      }else if(this.state.leadSourceOptions_id === 3){
        this.setState({otherSource: '', container: 'Friend'})
      }else{
        this.setState({otherSource: view_lead.other_sources, container: 'Other'})
      }
    })
    
    this.setState({other_industry: (view_lead.other_industry)? view_lead.other_industry : ''}, () => (view_lead.other_industry)? this.setState({otherIndustryError: false}) : null)
    this.setState({contact_person_name:(view_lead.contact_person_name ? view_lead.contact_person_name : '')}, () => (view_lead.contact_person_name)? this.setState({nameError: false}): null)
    this.setState({contact_person_mobile_number:(view_lead.contact_person_no ? view_lead.contact_person_no : '')}, () => (view_lead.contact_person_no)? this.setState({mobileNumberError: false}) : null)
    this.setState({contact_person_alternate_mobile_number:(view_lead.alternate_contact_no ? view_lead.alternate_contact_no : '')}, () => (view_lead.alternate_contact_no)? this.setState({altNumberError: false}) : null)
    this.setState({contact_person_email:(view_lead.email ? view_lead.email : '')}, () => (view_lead.email)? this.setState({emailError: false}) : null)
    this.setState({address_location:(view_lead.address_location ? view_lead.address_location : '')}, () => (view_lead.address_location)? this.setState({addressError: false}) : null)
    this.setState({dateNTime:(view_lead.due_date ? view_lead.due_date : '')}, () => {
      if(view_lead.due_date !== null){
        this.convertTime12Hr(this.state.dateNTime);
      }
    })
    this.setState({services_required:(view_lead.service_required ? view_lead.service_required : '')}, () => (view_lead.service_required)? this.setState({serviceRequiredError: false}) : null)
    this.setState({prebidNumber: view_lead.prebid}, () => {
      if(this.state.prebidNumber === 0){
        this.setState({radioPreBidStatus: false})
      }else{
        this.setState({radioPreBidStatus: true})
        this.setState({preBidDatenTime: view_lead.prebid_date})
        this.prebidTime12Hr(view_lead.prebid_date)
      }
    })
    this.setState({selectPriority: view_lead.priority}, () => {
      const {selectPriority} = this.state;
      if(selectPriority === 0){
        this.setState({priorityLabel: 'Low'})
      }else if(selectPriority === 1){
        this.setState({priorityLabel: 'Normal'})
      }else if(selectPriority === 2){
        this.setState({priorityLabel: 'Critical'})
      }
    })
    this.setState({tenure: (view_lead.tenure)? String(view_lead.tenure) : '', volume: (view_lead.volume)? String(view_lead.volume) : '', value: (view_lead.value)? String(view_lead.value) : '', emdAmount: (view_lead.emd_amount)? String(view_lead.emd_amount) : ''}, () => {
      //console.log("TENURE: ", typeof this.state.tenure, "VOLUME: ", typeof this.state.volume, "VALUE: ", typeof this.state.value, "EMD AMOUNT: ", typeof this.state.emdAmount)
      if(view_lead.tenure) this.setState({tenureError: false})
      if(view_lead.volume) this.setState({volumeError: false})
      if(view_lead.value) this.setState({valueError: false})
      if(view_lead.emd_amount) this.setState({emdAmountError: false})
    })
    this.setState({service_description:(view_lead.service_description ? view_lead.service_description : '')}, () => {
      if(view_lead.service_description) this.setState({serviceDescriptionError: false})
    })
  }

  convertTime12Hr(dateNTime){
    const splitData = dateNTime.split(' ');
    this.setState({dateTime: splitData[0]}, () => console.log("DATE: ", this.state.dateTime))
    this.setState({dateOrTimeValue: moment(splitData[1], ["HH:mm:ss"]).format("hh:mm A"), dueTimeError: false}, () => console.log("TIME: ", this.state.dateOrTimeValue))
  }

  prebidTime12Hr(prebid_date){
    const splitData = prebid_date.split(' ');
    this.setState({prebidDate: splitData[0], prebidDateError: false}, () => console.log("PREBID DATE: ", this.state.prebidDate))
    this.setState({prebidTimeValue: moment(splitData[1], ["HH:mm:ss"]).format("hh:mm A"), prebidTimeError: false}, () => console.log("PREBID TIME: ", this.state.prebidTimeValue))
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

imageUrl(){
  const context=this;
  var image = (this.state.status==true?context.props.route.params.image:'blank.jpg');
  console.log("image",image)
  var name = (this.state.status==true?"capture.jpg":'')
  const _this=this;
  const file={uri:image,name:name, type: 'image/jpg'}
  _this.setState({singleFileOBJ:file}, () => console.log("### SingleFileOBJ: ", this.state.singleFileOBJ))
  _this.setState({status:true})
}

dropdown_api=async()=>{
    const {baseURL, leadIndustryOptions_id} = this.state;
    //console.log("*****naveen", baseURL)
    const context=this;
    const _this = this;
    this.showLoader();
    var user_token= await AsyncStorage.getItem('user_token');
    //var permissions= await AsyncStorage.getItem('permissions');
    var permissions_fir= JSON.parse(user_token);
    var permissions_four=permissions_fir.success.secret_token;
    //var user_permission= permissions_fir.success.user.permissions;
    //console.log("^^^^DATA - URL: ", permissions_fir)
    var data = new FormData();

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function() {
  if(xhr.readyState !== 4) {
    return;
  }if(xhr.status === 200){
    var json_obj = JSON.parse(xhr.responseText);
    const industry_id = _this.props.route.params.view_lead.industry_id;
    _this.hideLoader();
        var leadSourceOptions = json_obj.success.leadSourceOptions;
        var leadIndustryOptions = json_obj.success.leadIndustryOptions;
        // console.log("json_obj 200",leadIndustryOptions);
        context.state.leadSourceOptions.push({leadSourceOptions});
        context.state.leadIndustryOptions.push({leadIndustryOptions});
        _this.setState({leadIndustryOptionsId:leadIndustryOptions, leadIndustryOptions_id: (industry_id)? industry_id : ''}, () => {
        console.log("%%%%%%%%INDUSTRY ID: ", _this.state.leadIndustryOptions_id)
        const {leadIndustryOptions_id} = _this.state;
        if(leadIndustryOptions_id){
          _this.setState({industryIDError: false})
        }
      })
  }
  else{
    _this.hideLoader();
    _this.setState({apiError: 'Something went wrong'}, () => {
      _this.enableModal(xhr.status, "073");
    })
  }
});

xhr.open("GET", `${baseURL}/create-lead`);
xhr.setRequestHeader("Authorization", "Bearer " + permissions_four);
xhr.send(data);
  }

  store_lead=async()=>{
    const {
      baseURL, show_is_completed, singleFileOBJ, leadListId, leadSourceOptions_id, 
      business_type, service_description, newComments, nameProspectError, loading
    } = this.state;
    if(loading){
      return;
    }
    const {view_lead, screen} = this.props.route.params;
    const context=this;
    const _this = this;
  this.showLoader();
  const industryID = String(this.state.leadIndustryOptions_id)
  const updateLeadID = String(leadListId)
  console.log("$$$$$$$$$$$$ API BASE URL: ", `${baseURL}/update-lead`, leadSourceOptions_id, business_type, service_description, newComments, leadListId)
  var user_token= await AsyncStorage.getItem('user_token');
  var permissions_fir= JSON.parse(user_token);
  var permissions_four=permissions_fir.success.secret_token;
    var data = new FormData();
data.append("sources", this.state.leadSourceOptions_id);
data.append("other_sources", this.state.otherSource);
data.append("service_description", this.state.service_description);
data.append("name_of_prospect", this.state.name_of_prospect);
data.append("contact_person_name", this.state.contact_person_name);
data.append("contact_person_mobile", this.state.contact_person_mobile_number);
data.append("industry_id", industryID);
data.append("priority", this.state.selectPriority);
data.append("other_industry", this.state.other_industry);
data.append("due_date", this.state.dateNTime);
data.append("prebid", this.state.prebidNumber);
data.append("prebid_date", this.state.preBidDatenTime);
data.append("tenure", this.state.tenure);
data.append("volume", this.state.volume);
data.append("value", this.state.value);
data.append("lead_id", updateLeadID);
data.append("emd_amount", this.state.emdAmount);
data.append("business_type", this.state.business_type);
data.append("address_location", this.state.address_location);
data.append("contact_person_email", this.state.contact_person_email);
data.append("contact_person_alternate", this.state.contact_person_alternate_mobile_number);
data.append("service_required", this.state.services_required); 
data.append("attachment", this.state.attachmentOBJ)
data.append("comments", this.state.newComments)

if(!view_lead.file_name){
  data.append("file_name", this.state.singleFileOBJ); 
}

if(show_is_completed === true){
  console.log("###### is_completed",show_is_completed)
  data.append("is_completed", "1")
}
console.log("@@@@@@ BEFORE SUCCESS: ", _this.state.preBidDatenTime)
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function() {
  if (xhr.readyState !== 4) {
    return;
  }
if (xhr.status === 200) {
  var json_obj = JSON.parse(xhr.responseText);
  var msg = json_obj.success.message;
  _this.hideLoader();
  Alert.alert(msg)
  //_this.setState({enableAlert: true, alertTitle: msg, alertColor: false})
  //Alert.alert(msg);
  console.log("^^^^^^SUCCESS: ", json_obj, _this.state.show_is_completed);
  _this.props.navigation.navigate(screen, {reload: true});
// _this.setState({service_description:'', prebidNumber: 0, tenure: '', attachmentOBJ: null})
// _this.setState({name_of_prospect:'', prebidDateError: true, volume: '', newCommentsError: true})
// _this.setState({contact_person_name:'', radioPreBidStatus: false, value: ''})
// _this.setState({contact_person_mobile_number:'', container: 'newsPaper'})
// _this.setState({leadIndustryOptions_id:'', leadSourceOptions_id: 1})
// _this.setState({dateTime:'', dateOrTimeValue: null, dateNTime: '', show_is_completed: false})
// _this.setState({prebidDate:'', prebidTimeValue: null, preBidDatenTime: null})
// _this.setState({address_location:'', data: null, dueTimeError: true, email: true})
// _this.setState({contact_person_email:'', otherSource: '', prebidTimeError: true})
// _this.setState({contact_person_alternate_mobile_number:'', emdAmount: ''})
// _this.setState({services_required:'', savePressed: false})
// _this.setState({singleFileOBJ:null, serviceDescriptionError: true, other_industry: ''})
}else if(xhr.status == 400){
  var error = JSON.parse(xhr.responseText);
  console.log("RESPONSE ERROR 400: ", `${baseURL}/update-lead`, leadSourceOptions_id, business_type, service_description, newComments, leadListId)
  console.log("API ERROR", error)
  _this.setState({enableAlert: true, alertTitle: error.message, alertColor: false})
  //Alert.alert(error.message)
  _this.hideLoader();
}
else{
  var error = JSON.parse(xhr.responseText);
  _this.hideLoader();
  const message = String(error.error)
  console.log("%%%%%% ^^^^^^EDIT LEAD ERROR: ", message)
  console.log("RESPONSE ERROR ELSE CASE: ", `${baseURL}/update-lead`, leadSourceOptions_id, business_type, service_description, newComments, leadListId)
  _this.setState({apiError: message}, () => {
    _this.enableModal(xhr.status, "076");
  })
  // console.log("^^^^^&&&&& UPDATE LEAD FAILED: ", error)
  // if(error == '{"validation_error":{"sources":["The sources field is required."],"service_description":["The services description field is required."]}}'){
  //   alert("1) Sources : The sources field is required\n 2) Service Description : The services description field is required");
  // }
  //_this.myTextInput.current.value='';
}
});

xhr.open("POST", `${baseURL}/update-lead`);
xhr.setRequestHeader("Authorization", "Bearer " + permissions_four);
xhr.setRequestHeader("Accept", "application/json");
xhr.send(data);
  }

  async SingleFilePicker() {
    const {loading} = this.state;
    if(loading){
      return;
    }
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      
      });
        console.log("res",res)
      this.setState({ singleFileOBJ: res });
 
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        this.setState({singleFileOBJ: null})
        this.setState({enableAlert: true, alertTitle: 'Cancelled', alertColor: false})
        //Alert.alert('Cancelled');
      } else {
        this.setState({enableAlert: true, alertTitle: 'Unknown Error: ' + JSON.stringify(err), alertColor: false})
        //Alert.alert('Unknown Error: ' + JSON.stringify(err));
        console.log(JSON.stringify(err))
        throw err;
      }
    }
  }

  async attachmentPicker() {
    const {loading} = this.state;
    if(loading){
      return;
    }
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      
      });
        console.log("res",res)
      this.setState({ attachmentOBJ: res });
 
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        this.setState({attachmentOBJ: ''})
        this.setState({enableAlert: true, alertTitle: 'Cancelled', alertColor: false})
        //Alert.alert('Cancelled');
      } else {
        this.setState({enableAlert: true, alertTitle: 'Unknown Error: ' + JSON.stringify(err), alertColor: false})
        //Alert.alert('Unknown Error: ' + JSON.stringify(err));
        console.log(JSON.stringify(err))
        throw err;
      }
    }
  }

  saveStartingDateTime = (value) => { 
    console.log("saveStartingDateTime - value:", value); 
    this.setState({
        StartingDateTimeValue: value,
    });
}; 

saveEndingDate = (value) => { 
    console.log("saveEndingDate - value:", value);
    this.setState({
        ToDateValue: value,
    });
}; 

saveEndingTime = (value) => {
    console.log("saveEndingTime - value:", value);
    this.setState({
        ToTimeValue: value,
    });
};

setTimings(){
    const {fromTime} = this.props;
    const {dateOrTimeValue, dateTime, dueTimeError} = this.state;
    this.setState({dateOrTimeValue: fromTime, dueTimeError: false}, () => this.props.show_HideTimePicker({'fromTime': null, 'toTime': null}))
    this.setState({dateNTime: dateTime + " " + moment(dateOrTimeValue, ["h:mm A"]).format("HH:mm:ss")}, () => console.log("DATE N TIME: ", this.state.dateNTime))
}

setPreBidTimings(){
    const {setPreBid} = this.props;
    const {prebidTimeValue, prebidDate, prebidTimeError} = this.state;
    this.setState({prebidTimeValue: setPreBid, prebidTimeError: false}, () => this.props.prebidTime({'fromTime': null, 'toTime': null}))
    this.setState({preBidDatenTime: prebidDate + " " + moment(prebidTimeValue, ["h:mm A"]).format("HH:mm:ss")}, () => console.log("PREBID DATE N TIME: ", this.state.preBidDatenTime))
}

async saveAsDraft(){
  const {
    newCommentsError, contact_person_email, emailError, leadIndustryOptions_id, otherIndustryError,
    dateTime, dateOrTimeValue, radioPreBidStatus, prebidDate, prebidTimeValue, contact_person_mobile_number,
    mobileNumberError, contact_person_alternate_mobile_number, altNumberError, loading
  } = this.state;
  if(loading){
    return;
  }
  this.setState({saveAsDraftPressed: true, show_is_completed: false})
  console.log("#### AFTER")
  const message = "Please fill the fields highlighted in RED";
  if(newCommentsError){
    this.setState({enableAlert: true, alertTitle: message, alertColor: true})
    console.log("@1")
  }else if(leadIndustryOptions_id === 33 && otherIndustryError){
    this.setState({enableAlert: true, alertTitle: message, alertColor: true})
    console.log("@2")
  }else if(contact_person_email && emailError){
    this.setState({enableAlert: true, alertTitle: "Invalid Email!", alertColor: false})
    console.log("@3")
  }else if(dateTime !== '' && !dateOrTimeValue){
    this.setState({enableAlert: true, alertTitle: message, alertColor: true})
  }else if(radioPreBidStatus && prebidDate === ''){
    this.setState({enableAlert: true, alertTitle: message, alertColor: true})
  }else if(prebidDate !== '' && !prebidTimeValue){
    this.setState({enableAlert: true, alertTitle: message, alertColor: true})
  }else if(contact_person_mobile_number.length > 0 && contact_person_mobile_number.length < 10 && mobileNumberError){
    this.setState({enableAlert: true, alertTitle: "Mobile Number must contain 10-digits", alertColor: false})
  }else if(contact_person_alternate_mobile_number.length > 0 && contact_person_alternate_mobile_number.length < 10 && altNumberError){
    this.setState({enableAlert: true, alertTitle: "ALT-Mobile Number must contain 10-digits", alertColor: false})
  }else{
    this.store_lead();
  }
  Keyboard.dismiss();
}

// imagePresent: function(){
//   return (!this.serviceRequiredError && !this.tenureError && !this.volumeError && !this.valueError && 
//     !this.emdAmountError && !this.serviceDescriptionError && !this.newCommentsError)
// },
checkBlanks(){
  const {
    name_of_prospect, other_industry, contact_person_name, newComments,
    address_location, services_required, service_description, loading,
    tenure, volume, value, emdAmount
  } = this.state;
  const {view_lead} = this.props.route.params;
  if(loading){
    return;
  }
  this.setState({
    name_of_prospect: name_of_prospect.trim(), other_industry: other_industry.trim(),
    contact_person_name: contact_person_name.trim(), address_location: address_location.trim(),
    services_required: services_required.trim(), service_description: service_description.trim(),
    newComments: newComments.trim()
  }, () => {
    const {
      name_of_prospect, other_industry, contact_person_name, address_location, 
      services_required, service_description, newComments, show_is_completed
    } = this.state;
    if(!name_of_prospect){
      this.setState({nameProspectError: true})
    }
    if(!other_industry){
      this.setState({otherIndustryError: true})
    }
    if(!contact_person_name){
      this.setState({nameError: true})
    }
    if(!address_location){
      this.setState({addressError: true})
    }
    if(!services_required){
      this.setState({serviceRequiredError: true})
    }
    if(!service_description){
      this.setState({serviceDescriptionError: true})
    }
    if(!newComments){
      this.setState({newCommentsError: true})
    }
  })
}

async store_lead_button(){
  // this.apply_leave();
  const {
    leadIndustryOptions_id, otherIndustryError, dateTime, contact_person_mobile_number,
    dateOrTimeValue, prebidDate, prebidTimeValue, contact_person_alternate_mobile_number,
    radioPreBidStatus, singleFileOBJ, emailError, mobileNumberError, altNumberError, loading,
    contact_person_email
  } = this.state;
  if(loading){
    return;
  }
  const {view_lead} = this.props.route.params;
  this.setState({savePressed: true})
  console.log("#### AFTER")
  let checkError = null;
  if(view_lead.file_name){
    checkError = this.state.imagePresent();
    console.log("IMAGE FILE PRESENT: ", checkError)
  }else if(!view_lead.file_name){
    checkError = this.state.noImagePresent();
    console.log("NO IMAGE ATTACHED: ", checkError)
  }
  const message = "Please fill the fields highlighted in RED";
  if(leadIndustryOptions_id === 33 && otherIndustryError){
    this.setState({enableAlert: true, alertTitle: message, alertColor: true})
    console.log("@1")
  }else if(emailError && contact_person_email){
    this.setState({enableAlert: true, alertTitle: "Invalid Email Address!", alertColor: true})
    console.log("@2")
  }else if(dateTime !== '' && !dateOrTimeValue){
    this.setState({enableAlert: true, alertTitle: message, alertColor: true})
    console.log("@3")
  }else if(radioPreBidStatus && prebidDate === ''){
    this.setState({enableAlert: true, alertTitle: message, alertColor: true})
    console.log("@4")
  }else if(prebidDate !== '' && !prebidTimeValue){
    this.setState({enableAlert: true, alertTitle: message, alertColor: true})
    console.log("@5")
  }else if(contact_person_mobile_number.length > 0 && contact_person_mobile_number.length < 10 && mobileNumberError){
    this.setState({enableAlert: true, alertTitle: "Mobile Number must contain 10-digits", alertColor: false})
    console.log("@6")
  }else if(contact_person_alternate_mobile_number.length > 0 && contact_person_alternate_mobile_number.length < 10 && altNumberError){
    this.setState({enableAlert: true, alertTitle: "ALT-Mobile Number must contain 10-digits", alertColor: false})
    console.log("@7")
  }else{
    if(checkError){
      this.store_lead();
    }
    else {
      this.setState({enableAlert: true, alertTitle: message, alertColor: true})
    }
  }
  Keyboard.dismiss();
}

dropDownValueChange(value){
  console.log("value",value)
 
  // this.setState({name_of_prospect:""})
  this.setState({leadIndustryOptions_id:''})
}

chooseFile = () => {
  this.setState({chooseFileView:true})
   console.log("chooseFile")
};
takeAPicture = () => {
  this.setState({chooseFileView:false})
  console.log("takeAPicture")
};
onLayout = (event) => {
  if(this.state.dimensions){
      return;
    }
    let width = Math.round(event.nativeEvent.layout.width)
    let height = Math.round(event.nativeEvent.layout.height)
    this.setState({dimensions: {width, height}}, () => console.log("BUBBLE DIMENSIONS: ", this.state.dimensions))
}

  render (){
        const {errorCode, apiCode, dimensions, slideAnimationDialog, prebidDate, dateTime, dateOrTimeValue, savePressed, 
        serviceDescriptionError, otherIndustryError, dueTimeError, prebidTimeError, prebidDateError, email,
        leadIndustryOptions_id, contact_person_email, newCommentsError, name_of_prospect, otherSource, other_industry,
        contact_person_name, contact_person_mobile_number, contact_person_alternate_mobile_number, address_location, emailError,
        services_required, tenure, volume, value, emdAmount, service_description, nameProspectError, nameError, mobileNumberError,
        altNumberError, addressError, serviceRequiredError, industryIDError, tenureError, volumeError, valueError, emdAmountError,
        saveAsDraftPressed, apiError, loading, secretToken, singleFileOBJ, editable, selectPriority, priorityLabel, fullFileName,
        percent, downloadModal, fromDate, fromDateError, fromMinDate, fromTime, fromTimeStamp, showFromDatePicker, fromDate2, 
        fromDateError2, fromTimeStamp2, showFromDatePicker2
        } = this.state;
        let asda = 12123132;
        console.log("@@@@@ NUMBER LENGTH: ", asda.toString().length)
        const {view_lead} = this.props.route.params;
        let priorityLevel = [{level: 'Low',value: 0}, {level: 'Normal',value: 1},{level: 'Critical',value: 2 }];
        let gradient = ['#0E57CF', '#25A2F9'];
        console.log("^^^@@@ CHECK LEAD STATUS: ", view_lead.status)
        const leadStatus = view_lead.status;
        let scrollHeight = null;
        if(this.state.dimensions){
            let screen = getWidthnHeight(undefined, 100)
            let buttonHeight = getWidthnHeight(undefined, 5)
            scrollHeight = {height: screen.height - dimensions.height - buttonHeight.height - 50}
        }
        const circleWidth = getWidthnHeight(60);
        const circleHeight = {height: circleWidth.width}

        const currentYear = `${moment().year()}`;
        const currentMonth = `${moment().month() + 1}`;
        let maxDate = moment(`${currentYear}-${currentMonth}`, "YYYY-MM").format("YYYY-MM");
        let maxMonth = moment(maxDate, "YYYY-MM").format("MM");
        let maxYear = moment(maxDate, "YYYY-MM").format("YYYY");
        let maxMonthDays = moment(`${maxYear}-${maxMonth}`, "YYYY-MM").daysInMonth();
        __DEV__ && console.log("###^^^ MAX DATE1: ", maxDate, maxYear, "-", maxMonth, "-", maxMonthDays)
        // if(currentYear !== maxYear){
        //     __DEV__ && console.log("***&&&^^^ UNEQUAL YEARS: ", typeof currentYear, currentYear, typeof maxYear, maxYear);
        //     maxDate = moment(`${currentYear}-${currentMonth}`, "YYYY-MM").format("YYYY-MM");
        //     maxMonth = moment(maxDate, "YYYY-MM").format("MM");
        //     maxYear = moment(maxDate, "YYYY-MM").format("YYYY");
        //     maxMonthDays = moment(`${maxYear}-${maxMonth}`, "YYYY-MM").daysInMonth();
        // }
        const maxCompiledDate = moment(`${maxYear}-${maxMonth}-${maxMonthDays}`, "YYYY-MM-DD").format("YYYY-MM-DD");
        __DEV__ && console.log("@@@^^^ CURRENT & MAX YEAR: ", currentYear, maxYear, maxCompiledDate)
        let fromMaxDate = moment(`${maxCompiledDate} ${fromTime}`, "YYYY-MM-DD hh:mm A").utc().toDate();
        // let toMaxDate = moment(`${maxCompiledDate} ${toTime}`, "YYYY-MM-DD hh:mm A").utc().toDate();

      return (  
          <KeyboardShift>
            {()=>(
            <View style={{flex: 1,backgroundColor:'#EEEDED'}}>
                <IOS_StatusBar barStyle="light-content"/>

                <DownloadModal 
                    visible={downloadModal}
                    fileName={fullFileName}
                    percent={percent}
                    onBackdropPress={() => this.setState({downloadModal: false})}
                />

            <ActionModal 
              isVisible={slideAnimationDialog}
              style={{justifyContent: 'center', alignItems: 'center'}}
              onBackdropPress={() => this.setState({slideAnimationDialog: false})}
            >
              <View style={[{alignItems: 'center', backgroundColor: 'white', borderRadius: 10, justifyContent: 'center'}, getWidthnHeight(80, 60)]}>
                <Image source={{uri: `${this.state.data}`}} style={[{alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(70, 50)]}/>
              </View>
            </ActionModal>
            
            <View style={[{alignItems: 'center'}, getWidthnHeight(100), getMarginVertical(2)]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={[{fontWeight: 'bold'}, styles.boldFont]}>Note:  </Text>
                <Text>To</Text>
                <Text style={[{fontWeight: 'bold', color: colorBase}, styles.boldFont]}> Complete </Text>
                <Text>Lead, Fields with </Text>
                <Image source={require('../Image/asterisk.png')} style={{width: 15, height: 15}}/>
                <Text>  are mandatory</Text>
              </View>
            </View>
                    
              <View style={[styles.MainContainer, getMarginTop(0)]} onLayout={this.onLayout}>
                <View style={{flex: 1, alignItems: 'center'}}>
              <View style={[{flexDirection: 'row'}, getMarginVertical(2)]}>
                <Text style={[{fontWeight: 'bold'}, styles.boldFont]}>Lead Code: </Text>
                <Text style={{color: colorBase}}>{view_lead.lead_code}</Text>
              </View>
              {/* {<Loader
                visible={loading}
                onPress={this.hideLoader}
              />} */}
              <ScrollView persistentScrollbar={true} style={[{borderColor: 'green', borderWidth: 0}, getMarginTop(0), getWidthnHeight(100)]}>
              {(view_lead.file_name)?
                  <View style={[{alignItems: 'center'}, getMarginBottom(2.5), getWidthnHeight(100)]}>
                      <View style={{flexDirection: 'row'}}>
                          <Text style={{borderBottomWidth: 0, borderBottomColor: 'black'}}>Click to </Text>
                          <TouchableOpacity onPress={() => (secretToken)? this.checkExistingDownloads() : null}>
                            <Text style={{color: (secretToken && !loading)? colorBase: 'dimgrey', borderBottomWidth: 1, borderBottomColor: (secretToken && !loading)? colorBase: 'dimgrey'}}>Download</Text>
                          </TouchableOpacity>
                          <Text style={{borderBottomWidth: 0, borderBottomColor: 'black'}}> Attachment</Text>
                      </View>
                  </View>
              :
                <View style={[getMarginBottom(2.5)]}>
                    {this.state.chooseFileStatus === true ? 
                        <View style={[{flexDirection:'row',justifyContent:'space-around',top:0,paddingBottom:20}, getMarginTop(0)]}>
                            <RadioEnable title="Choose File" onPress={()=>{this.setState({chooseFileStatus:true, data: null, singleFileOBJ: null}) || this.chooseFile()}}/> 
                            <RadioDisable title="Take a Picture" onPress={()=>{this.setState({chooseFileStatus:false, singleFileOBJ: null}) || this.takeAPicture()}}/>
                        </View>
                    :
                        <View style={[{flexDirection:'row',justifyContent:'space-around',top:0,paddingBottom:20}, getMarginTop(0)]}>
                            <RadioDisable title="Choose File" onPress={()=>{this.setState({chooseFileStatus:true, data: null, singleFileOBJ: null}) || this.chooseFile()}}/>
                            <RadioEnable title="Take a Picture" onPress={()=>{this.setState({chooseFileStatus:false, singleFileOBJ: null})|| this.takeAPicture()}}/>
                        </View>
                    }
        
                    <View style={{justifyContent:'center',alignItems:'center',left:0}}>
                        {(this.state.data)? 
                          <TouchableOpacity onPress={() => this.setState({slideAnimationDialog: true})} style={{marginBottom: 15}}>
                            <Text style={{color: '#E5214E'}}>Click to View Image</Text>
                          </TouchableOpacity>
                        :
                        null
                        }  
                        {this.state.chooseFileView === true ?
                            <TouchableOpacity activeOpacity={0.5} style={[styles.button, getWidthnHeight(80)]} onPress={this.SingleFilePicker.bind(this)}>
                            {this.state.singleFileOBJ ? 
                                <Text numberOfLines={1} style={{color:'white',width:'100%',height:'100%',textAlign:'center'}}>{this.state.singleFileOBJ.name}</Text>
                            : 
                                <View style={{flexDirection:'row'}}>
                                    <Image source={require('../Image/white_icon/upload.png')} style={{ width: 20, height: 20, marginLeft: 0,bottom:0 }} />
                                    <Text style={{color:'white'}}>  Choose file</Text>
                                </View>
                            }
                            </TouchableOpacity>
                        :
                            <TouchableOpacity activeOpacity={0.5} style={[styles.button, getWidthnHeight(80)]} onPress={() => {
                              const {loading} = this.state;
                              if(loading){
                                return;
                              }
                              this.props.navigation.navigate('camera', {imageQuality: 1, width: 500, height: 600, rearCamera: true})
                            }}>
                                {this.state.singleFileOBJ ? 
                                    <Text numberOfLines={1} style={{color:'white',width:'100%',height:'100%',textAlign:'center'}}>{this.state.singleFileOBJ.name}</Text>
                                :
                                    <View style={{flexDirection:'row'}}>
                                        <Image source={require('../Image/white_icon/upload.png')} style={{ width: 20, height: 20, marginLeft: 0,bottom:0 }} />
                                        <Text style={{color:'white'}}>Take a picture</Text>
                                    </View>
                                }
                            </TouchableOpacity> 
                        }
                    </View>
                </View>
              }
              

            <View style={[{ borderWidth: 0, borderColor: 'black', alignItems: 'center'}, getMarginBottom(2.5), getWidthnHeight(100, 7)]}>
              <FloatingTitleTextInputField
                  attrName = 'nameofprospect'
                  title = 'Name of Prospect'
                  value = {name_of_prospect}
                  valueProp = {(name_of_prospect)? name_of_prospect : view_lead.name_of_prospect}
                  titleActiveColor = {colorTitle}
                  titleInactiveColor = 'dimgrey'
                  updateMasterState = {(attrName, name_of_prospect) => {
                    const {view_lead} = this.props.route.params;
                    this.setState({name_of_prospect})
                    if(name_of_prospect === '' && !view_lead.file_name){
                      this.setState({nameProspectError: true})
                    }else {
                      this.setState({nameProspectError: false})
                    }
                    console.log("ATTRNAME: ", attrName)
                  }}
                  textInputStyles = {[{ // here you can add additional TextInput styles
                    color: 'black',
                    fontSize: 14,
                    borderColor: (!view_lead.file_name && savePressed && nameProspectError)? 'red' : 'grey',
                    borderStyle: (!view_lead.file_name && savePressed && nameProspectError)? 'dashed' : 'solid',
                    borderWidth: (!view_lead.file_name && savePressed && nameProspectError)? 2 : 1,
                  }, getWidthnHeight(undefined, 7)]}
                  containerStyle = {[getWidthnHeight(90, 10)]}
                  otherTextInputProps = {{editable: (loading)? false : true}}
              />
              {(!view_lead.file_name)?
                <View style={[{position: 'absolute', alignSelf: 'flex-start', borderWidth: 0, borderColor: 'red'}, getWidthnHeight(7)]}>
                  <Image source={require('../Image/asterisk.png')} style={{width: 10, height: 10, alignSelf: 'flex-end', backgroundColor: 'white', borderRadius: 5}}/>
                </View>
              :
                null
              }
            </View>

       {this.state.radioComponentStatus == true ? 
            <View style={{flexDirection:'row',justifyContent:'space-around',top:0, borderColor: 'black', borderWidth: 0}}> 
                <RadioEnable title="Government" 
                  //onPress={()=>{this.setState({radioComponentStatus:true}) || this.goverment()}}
                /> 
                <RadioDisable title="Corporate" 
                  //onPress={()=>{this.setState({radioComponentStatus:false}) || this.corporate()}}
                />
            </View>
        :
            <View style={{flexDirection:'row',justifyContent:'space-around',top:0, borderColor: 'black', borderWidth: 0}}> 
                <RadioDisable title="Government" 
                  //onPress={()=>{this.setState({radioComponentStatus:true})}}
                /> 
                <RadioEnable title="Corporate" 
                  //onPress={()=>{this.setState({radioComponentStatus:false})}}
                />
            </View>
        }

        <View style={[{borderWidth: 0, borderColor: 'black', alignItems: 'center'}, getMarginVertical(2)]}>
          <View style={[{borderWidth: 1, borderColor: 'grey', alignItems: 'center', borderRadius: 10, justifyContent: 'space-evenly'}, getWidthnHeight(90, 15)]}>
            <Text style={[{color: colorBase, fontWeight: 'bold', textAlign: 'center'}, getWidthnHeight(50)]}>Selected Source:</Text>
            <View style={[{borderWidth: 0, borderColor: 'grey',flexDirection:'row',justifyContent:'center',}, getWidthnHeight(90, 9)]}>
            {this.state.container == 'newsPaper' ? 
                <NewsPaper 
                    title={"NEWS PAPER"} 
                    source={require('../Image/newspaperBlue.png')} 
                    style={{backgroundColor:colorBase,borderColor:colorBase,}} 
                    TextStyle={{color:'white',}} 
                    circle={{ backgroundColor:'white',borderColor:colorBase}}
                    //onPress={()=>{}} 
                /> 
                : 
                <NewsPaper 
                    title={"NEWS PAPER"} 
                    source={require('../Image/newspaperBlack.png')} 
                    style={{backgroundColor:'white',borderColor:'#c4c4c4',}} 
                    TextStyle={{color:'#c4c4c4',}} 
                    circle={{ backgroundColor:'#c4c4c4',borderColor:'#c4c4c4',}}
                    //onPress={()=>{this.setState({container:'newsPaper', leadSourceOptions_id:1, otherSource: ''}, () => console.log("$$$$$$ SOURCE: ", this.state.leadSourceOptions_id))}} 
                />
            }
         
            {this.state.container == 'Website' ? 
                <NewsPaper 
                    title={"WEBSITE"} 
                    source={require('../Image/globeBlue.png')} 
                    style={{backgroundColor:colorBase,borderColor:colorBase,}} 
                    TextStyle={{color:'white',}} 
                    circle={{ backgroundColor:'white',borderColor:colorBase}}
                    //onPress={()=>{}} 
                /> 
                : 
                <NewsPaper 
                    title={"WEBSITE"} 
                    source={require('../Image/globeBlack.png')} 
                    style={{backgroundColor:'white',borderColor:'#c4c4c4',}} 
                    TextStyle={{color:'#c4c4c4',}} 
                    circle={{ backgroundColor:'#c4c4c4',borderColor:'#c4c4c4',}}
                    //onPress={()=>{this.setState({container:'Website', leadSourceOptions_id:2, otherSource: ''}, () => console.log("$$$$$$ SOURCE: ", this.state.leadSourceOptions_id))}} 
                />
            }

            {this.state.container == 'Friend' ? 
                <NewsPaper 
                    title={"FRIEND"} 
                    source={require('../Image/friendsBlue.png')} 
                    style={{backgroundColor:colorBase,borderColor:colorBase,}} 
                    TextStyle={{color:'white',}} 
                    circle={{ backgroundColor:'white',borderColor:colorBase}}
                    //onPress={()=>{}} 
                /> 
                : 
                <NewsPaper 
                    title={"FRIEND"} 
                    source={require('../Image/friendsBlack.png')} 
                    style={{backgroundColor:'white',borderColor:'#c4c4c4',}} 
                    TextStyle={{color:'#c4c4c4',}} 
                    circle={{ backgroundColor:'#c4c4c4',borderColor:'#c4c4c4',}}
                    //onPress={()=>{this.setState({container:'Friend', leadSourceOptions_id:3, otherSource: ''}, () => console.log("$$$$$$ SOURCE: ", this.state.leadSourceOptions_id))}} 
                />
            }

            {this.state.container == 'Other' ? 
                <NewsPaper 
                    title={"OTHERS"} 
                    source={require('../Image/menuBlue.png')} 
                    style={{backgroundColor:colorBase,borderColor:colorBase,}} 
                    TextStyle={{color:'white',}} 
                    circle={{ backgroundColor:'white',borderColor:colorBase}}
                    //onPress={()=>{}} 
                /> 
                : 
                <NewsPaper 
                    title={"OTHERS"} 
                    source={require('../Image/menuBlack.png')} 
                    style={{backgroundColor:'white',borderColor:'#c4c4c4',}} 
                    TextStyle={{color:'#c4c4c4',}} 
                    circle={{ backgroundColor:'#c4c4c4',borderColor:'#c4c4c4',}}
                    //onPress={()=>{this.setState({container:'Other', leadSourceOptions_id:4}, () => console.log("$$$$$$ SOURCE: ", this.state.leadSourceOptions_id))}} 
                />
            }
            </View>
          </View>
        </View>
       
        { this.state.container == 'Other' ?
          <View style={[{alignItems: 'center'},getWidthnHeight(100), getMarginBottom(2)]}>
                <FloatingTitleTextInputField
                    attrName = 'othersource'
                    title = 'Other Source'
                    value = {otherSource}
                    valueProp = {(otherSource)? otherSource : view_lead.other_sources}
                    titleActiveColor = {colorTitle}
                    titleInactiveColor = 'dimgrey'
                    updateMasterState = {(attrName, otherSource) => {
                        this.setState({otherSource})
                        console.log("ATTRNAME: ", otherSource)
                    }}
                    textInputStyles = {[{ // here you can add additional TextInput styles
                        color: 'black',
                        fontSize: 14,
                        borderColor: 'grey',
                        borderStyle: 'solid',
                        borderWidth: 1,
                    }, getWidthnHeight(undefined, 7)]}
                    otherTextInputProps={{editable: editable}}
                    containerStyle = {[{borderColor: 'black', borderWidth: 0,borderRadius: 10}, getWidthnHeight(90, 7)]}
                />
          </View>
        :null
        }

        <View style={[styles.box, getMarginBottom(2.5), getWidthnHeight(100, 7)]}>
          <View style={[{
            flexDirection: 'row', alignItems: 'center', borderRadius: 10, justifyContent: 'space-evenly',
            borderColor: (!view_lead.file_name && savePressed && industryIDError)? 'red' : 'grey',
            borderStyle: (!view_lead.file_name && savePressed && industryIDError)? 'dashed' : 'solid',
            borderWidth: (!view_lead.file_name && savePressed && industryIDError)? 2 : 1}, getWidthnHeight(90)]}>
            <Dropdown
                containerStyle={[{
                  justifyContent: 'center', paddingLeft: 10,
                  width: (leadIndustryOptions_id)? getWidthnHeight(80).width : getWidthnHeight(90).width 
                }, getWidthnHeight(undefined, 7)]}
                //  maxLength = {12}
                inputContainerStyle={{borderBottomWidth: 0,fontSize:hp(2) }}
                label={'Select Industry'}
                data={this.state.leadIndustryOptionsId}
                valueExtractor={({id})=> id}
                labelExtractor={({industry_name})=> industry_name}
                onChangeText={leadIndustryOptions_id => this.setState({ leadIndustryOptions_id, industryIDError: false }, () => {
                  console.log("INDUSTRY: ", typeof this.state.leadIndustryOptions_id, this.state.leadIndustryOptions_id)
                  if(this.state.leadIndustryOptions_id !== 33){
                    this.setState({other_industry: '', otherIndustryError: true})
                  }
                  })
                }
                value={leadIndustryOptions_id}
                //  baseColor = '#e5314e'
                baseColor = {(leadIndustryOptions_id)? colorTitle : 'grey'}
                disabled={(loading)? true : false}
                //  selectedItemColor='#aaa'
                //  textColor='#aaa'
                //  itemColor='#aaa'
            />
            {(leadIndustryOptions_id)?
              <TouchableOpacity onPress={() => this.setState({leadIndustryOptions_id: '', industryIDError: true, other_industry: '', otherIndustryError: true})}>
                <Close name="close" size={20}/>
              </TouchableOpacity>
            :
              null
            }
          </View>
          {(!view_lead.file_name)?
            <View style={[{position: 'absolute', alignSelf: 'flex-start', borderWidth: 0, borderColor: 'red'}, getWidthnHeight(7)]}>
              <Image source={require('../Image/asterisk.png')} style={{width: 10, height: 10, alignSelf: 'flex-end', backgroundColor: 'white', borderRadius: 5}}/>
            </View>
          :
            null
          }
        </View>

        {(this.state.leadIndustryOptions_id === 33)?
          <View style={[{alignItems:'center'}, getWidthnHeight(100), getMarginBottom(2.5)]}> 
            <FloatingTitleTextInputField
                attrName = 'otherindustry'
                title = 'Other Industry'
                value = {other_industry}
                valueProp = {(other_industry)? other_industry : view_lead.other_industry}
                titleActiveColor = {colorTitle}
                titleInactiveColor = 'dimgrey'
                updateMasterState = {(attrName, other_industry) => {
                  this.setState({other_industry})
                  if(other_industry === ''){
                    this.setState({otherIndustryError: true})
                  }else{
                    this.setState({otherIndustryError: false})
                  }
                  console.log("ATTRNAME: ", attrName)
                }}
                textInputStyles = {[{ // here you can add additional TextInput styles
                  color: 'black',
                  fontSize: 14,
                  borderColor: ((saveAsDraftPressed || (!view_lead.file_name && savePressed)) && otherIndustryError)? 'red' : 'grey',
                  borderStyle: ((saveAsDraftPressed || (!view_lead.file_name && savePressed)) && otherIndustryError)? 'dashed' : 'solid',
                  borderWidth: ((saveAsDraftPressed || (!view_lead.file_name && savePressed)) && otherIndustryError)? 2 : 1,
                }, getWidthnHeight(undefined, 7)]}
                containerStyle = {[{borderColor: 'red', borderWidth: 0, marginVertical: 0}, getWidthnHeight(90, 7)]}
                otherTextInputProps = {{editable: (loading)? false : true}}
            />
          </View>
        : null
        }

        <View style={[{alignItems:'center'}, getWidthnHeight(100), getMarginBottom(2.5)]}> 
            <View style={[{justifyContent: 'space-evenly', flexDirection: 'row', borderColor: 'black', borderWidth: 0}, getWidthnHeight(100)]}>
                <View>
                    <FloatingTitleTextInputField
                        attrName = 'contactname'
                        title = 'Contact Name'
                        value = {contact_person_name}
                        valueProp = {(contact_person_name)? contact_person_name : view_lead.contact_person_name}
                        titleActiveColor = {colorTitle}
                        titleInactiveColor = 'dimgrey'
                        updateMasterState = {(attrName, contact_person_name) => {
                          this.setState({contact_person_name})
                          if(contact_person_name === '' && !view_lead.file_name){
                            this.setState({nameError: true})
                          }else{
                            this.setState({nameError: false})
                          }
                          console.log("ATTRNAME: ", attrName)
                        }}
                        textInputStyles = {[{ // here you can add additional TextInput styles
                          color: 'black',
                          fontSize: 14,
                          borderColor: (!view_lead.file_name && savePressed && nameError)? 'red' : 'grey',
                          borderStyle: (!view_lead.file_name && savePressed && nameError)? 'dashed' : 'solid',
                          borderWidth: (!view_lead.file_name && savePressed && nameError)? 2 : 1,
                        }, getWidthnHeight(undefined, 7)]}
                        containerStyle = {[{borderColor: 'red', borderWidth: 0, marginVertical: 0}, getWidthnHeight(43, 7)]}
                        otherTextInputProps = {{editable: (loading)? false : true}}
                    />
                    {(!view_lead.file_name)?
                      <View style={[{position: 'absolute', alignSelf: 'flex-start', borderWidth: 0, borderColor: 'red', marginLeft: -2}, getWidthnHeight(7)]}>
                        <Image source={require('../Image/asterisk.png')} style={{width: 10, height: 10, alignSelf: 'flex-start', backgroundColor: 'white', borderRadius: 5}}/>
                      </View>
                    :
                      null
                    }
                </View>
                <View>
                  <FloatingTitleTextInputField
                      attrName = 'contactnumber'
                      title = 'Contact Number'
                      value = {contact_person_mobile_number}
                      valueProp = {(contact_person_mobile_number)? contact_person_mobile_number : view_lead.contact_person_no}
                      keyboardType = 'numeric'
                      titleActiveColor = {colorTitle}
                      titleInactiveColor = 'dimgrey'
                      updateMasterState = {(attrName, contact_person_mobile_number) => {
                        const number = contact_person_mobile_number.replace(/[^0-9]/g, '')
                        this.setState({contact_person_mobile_number: number})
                        if(number === '' && !view_lead.file_name){
                          this.setState({mobileNumberError: true})
                        }
                        if(number.toString().length === 10){
                          this.setState({mobileNumberError: false})
                        }else if(number.toString().length > 0 && number.toString().length < 10){
                          this.setState({mobileNumberError: true})
                        }
                        console.log("ATTRNAME: ", attrName)
                      }}
                      textInputStyles = {[{ // here you can add additional TextInput styles
                        color: 'black',
                        fontSize: 14,
                        borderColor: (((saveAsDraftPressed && contact_person_mobile_number.length > 0 && contact_person_mobile_number.length < 10) || (!view_lead.file_name && savePressed)) && mobileNumberError)? 'red' : 'grey',
                        borderStyle: (((saveAsDraftPressed && contact_person_mobile_number.length > 0 && contact_person_mobile_number.length < 10) || (!view_lead.file_name && savePressed)) && mobileNumberError)? 'dashed' : 'solid',
                        borderWidth: (((saveAsDraftPressed && contact_person_mobile_number.length > 0 && contact_person_mobile_number.length < 10) || (!view_lead.file_name && savePressed)) && mobileNumberError)? 2 : 1,
                      }, getWidthnHeight(undefined, 7)]}
                      containerStyle = {[{borderColor: 'red', borderWidth: 0, marginVertical: 0}, getWidthnHeight(43, 7)]}
                      otherTextInputProps = {{maxLength: 10, editable: (loading)? false : true}}
                  />
                  {(!view_lead.file_name)?
                    <View style={[{position: 'absolute', alignSelf: 'flex-start', borderWidth: 0, borderColor: 'red', marginLeft: -2}, getWidthnHeight(7)]}>
                      <Image source={require('../Image/asterisk.png')} style={{width: 10, height: 10, alignSelf: 'flex-start', backgroundColor: 'white', borderRadius: 5}}/>
                    </View>
                  :
                    null
                  }
                </View>
            </View> 
        </View>

        <View style={[{alignItems: 'center', borderColor: 'red', borderWidth: 0}, getWidthnHeight(100, 7), getMarginBottom(2.5)]}>
            <FloatingTitleTextInputField
                attrName = 'alternatenumber'
                title = 'Alternate Contact Number'
                value = {contact_person_alternate_mobile_number}
                valueProp = {(contact_person_alternate_mobile_number)? contact_person_alternate_mobile_number : view_lead.alternate_contact_no}
                keyboardType = 'numeric'
                titleActiveColor = {colorTitle}
                titleInactiveColor = 'dimgrey'
                updateMasterState = {(attrName, contact_person_alternate_mobile_number) => {
                  const number = contact_person_alternate_mobile_number.replace(/[^0-9]/g, '')
                  this.setState({contact_person_alternate_mobile_number: number})
                  if(number === '' && !view_lead.file_name){
                    this.setState({altNumberError: true})
                  }else if(number.toString().length === 10){
                    this.setState({altNumberError: false})
                  }else if(number.toString().length > 0 && number.toString().length < 10){
                    this.setState({altNumberError: true})
                  }
                  console.log("ATTRNAME: ", attrName)
                }}
                textInputStyles = {[{ // here you can add additional TextInput styles
                  color: 'black',
                  fontSize: 14,
                  borderColor: (((saveAsDraftPressed && contact_person_alternate_mobile_number.length > 0 && contact_person_alternate_mobile_number.length < 10) || (!view_lead.file_name && savePressed)) && altNumberError)? 'red' : 'grey',
                  borderStyle: (((saveAsDraftPressed && contact_person_alternate_mobile_number.length > 0 && contact_person_alternate_mobile_number.length < 10) || (!view_lead.file_name && savePressed)) && altNumberError)? 'dashed' : 'solid',
                  borderWidth: (((saveAsDraftPressed && contact_person_alternate_mobile_number.length > 0 && contact_person_alternate_mobile_number.length < 10) || (!view_lead.file_name && savePressed)) && altNumberError)? 2 : 1,
                }, getWidthnHeight(undefined, 7)]}
                containerStyle = {[{borderColor: 'red', borderWidth: 0, marginVertical: 0}, getWidthnHeight(60, 7)]}
                otherTextInputProps = {{maxLength: 10, editable: (loading)? false : true}}
            />
            {(!view_lead.file_name)?
              <View style={[{position: 'absolute', alignSelf: 'flex-start', borderWidth: 0, borderColor: 'red'}, getWidthnHeight(22)]}>
                <Image source={require('../Image/asterisk.png')} style={{width: 10, height: 10, alignSelf: 'flex-end', backgroundColor: 'white', borderRadius: 5}}/>
              </View>
            :
              null
            }
        </View>

        <View style={[{alignItems: 'center'}, getWidthnHeight(100)]}>
            <FloatingTitleTextInputField
                attrName = 'emailAddress'
                title = 'Email Address'
                value = {contact_person_email}
                valueProp = {(contact_person_email)? contact_person_email : view_lead.email}
                titleActiveColor = {colorTitle}
                titleInactiveColor = 'dimgrey'
                updateMasterState = {(attrName, contact_person_email) => {
                  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                  if(re.test(String(contact_person_email).toLowerCase())){
                    this.setState({email: true, emailError: false}, () => console.log("ATTRNAME1: ", this.state.email, this.state.emailError, contact_person_email))
                  }else{
                    this.setState({email: false, emailError: true}, () => {
                      console.log("ATTRNAME2: ", this.state.email, this.state.emailError, contact_person_email)
                    if(contact_person_email === '' && !view_lead.file_name){
                      this.setState({emailError: true}, () => console.log("IMAGE FALSE: ", this.state.emailError))
                    }else if(contact_person_email === '' && view_lead.file_name){
                      this.setState({emailError: false}, () => console.log("IMAGE TRUE: ", this.state.emailError))
                    }
                    })
                  }
                  this.setState({contact_person_email})
                }}
                textInputStyles = {[{ // here you can add additional TextInput styles
                  color: (this.state.email)? '#0AD159' : 'red',
                  fontSize: 14,
                  borderColor: (((saveAsDraftPressed && contact_person_email) || (!view_lead.file_name && savePressed)) && emailError)? 'red' : 'grey',
                  borderStyle: (((saveAsDraftPressed && contact_person_email) || (!view_lead.file_name && savePressed)) && emailError)? 'dashed' : 'solid',
                  borderWidth: (((saveAsDraftPressed && contact_person_email) || (!view_lead.file_name && savePressed)) && emailError)? 2 : 1,
                }, getWidthnHeight(undefined, 7)]}
                containerStyle = {[{borderColor: 'red', borderWidth: 0, marginVertical: 0}, getWidthnHeight(90, 7)]}
                otherTextInputProps = {{editable: (loading)? false : true}}
            />
            {(!view_lead.file_name)?
              <View style={[{position: 'absolute', alignSelf: 'flex-start', borderWidth: 0, borderColor: 'red'}, getWidthnHeight(7)]}>
                <Image source={require('../Image/asterisk.png')} style={{width: 10, height: 10, alignSelf: 'flex-end', backgroundColor: 'white', borderRadius: 5}}/>
              </View>
            :
              null
            }
        </View>

        <View style={[{alignItems: 'center'}, getWidthnHeight(100), getMarginVertical(2.5)]}>
            <FloatingTitleTextInputField
                attrName = 'addressLocation'
                title = 'Address Location'
                value = {address_location}
                valueProp = {(address_location)? address_location : view_lead.address_location}
                titleActiveColor = {colorTitle}
                titleInactiveColor = 'dimgrey'
                updateMasterState = {(attrName, address_location) => {
                  this.setState({address_location})
                  if(address_location === '' && !view_lead.file_name){
                    this.setState({addressError: true})
                  }else{
                    this.setState({addressError: false})
                  }
                  console.log("ATTRNAME: ", attrName)
                }}
                textInputStyles = {[{ // here you can add additional TextInput styles
                  color: 'black',
                  fontSize: 14,
                  borderColor: ((!view_lead.file_name && savePressed) && addressError)? 'red' : 'grey',
                  borderStyle: ((!view_lead.file_name && savePressed) && addressError)? 'dashed' : 'solid',
                  borderWidth: ((!view_lead.file_name && savePressed) && addressError)? 2 : 1,
                }, getWidthnHeight(undefined, 7)]}
                containerStyle = {[{borderColor: 'red', borderWidth: 0, marginVertical: 0}, getWidthnHeight(90, 7)]}
                otherTextInputProps = {{editable: (loading)? false : true}}
            />
            {(!view_lead.file_name)?
              <View style={[{position: 'absolute', alignSelf: 'flex-start', borderWidth: 0, borderColor: 'red'}, getWidthnHeight(7)]}>
                <Image source={require('../Image/asterisk.png')} style={{width: 10, height: 10, alignSelf: 'flex-end', backgroundColor: 'white', borderRadius: 5}}/>
              </View>
            :
              null
            }
        </View>

        {(this.state.timePicker)?
        <TimePicker 
            show={(loading)? false : this.state.timePicker}
            timeDifference={2}
            onBackdropPress={() => this.setState({timePicker: false})}
        />
        : null
        }

        {(this.props.fromTime)? this.setTimings() : null}

        <View style={[{alignItems:'center', borderColor: 'black', borderWidth: 0}, getWidthnHeight(100,7), getMarginBottom(2.5)]}> 
            <View style={{alignItems: 'center',borderColor: 'red', borderWidth: 0}}>
                <View style={[{justifyContent: (dateTime)? 'space-between' : 'center', flexDirection: 'row',borderColor: 'red', borderWidth: 0}, getWidthnHeight(90, 7)]}>
                    {/* <DateSelector 
                        containerStyle={[{borderWidth: 1, borderColor: 'grey', borderRadius: 10, justifyContent: 'center'}, getWidthnHeight(43, 7)]}
                        style={[(dateTime === '')? {borderWidth: 0, borderColor: 'green', width: getWidthnHeight(43).width} : {fontSize: 12, width: getWidthnHeight(35).width}]}
                        date={this.state.dateTime}
                        clearDate={(dateTime === '')? false : true}
                        onPress={() => this.setState({dateTime: '', dueTimeError: true, dateOrTimeValue: '', dateNTime: ''})}
                        dateFont={{fontSize: 14}}
                        androidMode='default'
                        mode='date'
                        placeholder='Due Date'
                        format='YYYY-MM-DD'
                        onDateChange={(date) => {this.setState({dateTime: date})}}
                        disabled={(loading)? true : false} 
                    /> */}
                    <View style={{alignItems: 'flex-start'}}>
                        <View 
                            style={[{
                                alignItems: 'center', justifyContent: 'space-evenly', borderRadius: 10, 
                                borderColor: '#C4C4C4', borderWidth: 1, flexDirection: 'row'
                                }, getWidthnHeight(43, 7)
                            ]}
                        >
                            <TouchableOpacity 
                                onPress={() => this.setState({showFromDatePicker: !showFromDatePicker})}
                            >
                                <View 
                                    style={[{
                                        alignItems: 'center', justifyContent: 'center', borderWidth: 0, borderColor: 'red',
                                        paddingHorizontal: getWidthnHeight(2).width
                                    }, getWidthnHeight(undefined, 7)]}>
                                    <Text style={[{color: (!!dateTime)? '#000000' : '#C4C4C4', fontSize: (fontSizeH4().fontSize + 2)}]}>{dateTime || 'Select Date'}</Text>
                                </View>
                            </TouchableOpacity>
                            {(!!dateTime) && (
                                <TouchableOpacity
                                    onPress={() => this.setState({
                                            dateTime: '', dueTimeError: true, dateOrTimeValue: null, dateNTime: '',
                                            fromTimeStamp: moment().valueOf(), fromDateError: true
                                        })
                                    }
                                >
                                    <MaterialCommunityIcons color={'red'} name='close-box' size={getWidthnHeight(7).width}/>
                                </TouchableOpacity>
                            )}
                            {(showFromDatePicker) && (
                                <DateTimePicker 
                                    styleBox={{flex: 1}}
                                    disabled={(loading)? true : false}
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
                                            dateTime: moment(newDate).format("YYYY-MM-DD")
                                        }, () => {});
                                        Keyboard.dismiss();
                                    }} 
                                />
                            )}
                        </View> 
                        <View style={styles.forDate}>
                            <Text style={[{fontSize: (fontSizeH4().fontSize - 4), color: colorBase, fontWeight: 'bold', textAlign: 'center'}, styles.boldFont]}>Due Date</Text>
                        </View>
                    </View>
                    {(dateTime !== '') ? 
                        <TouchableOpacity style={[styles.TimeBox, getWidthnHeight(43, 7), {
                          borderColor: ((saveAsDraftPressed || savePressed) && dueTimeError)? 'red' : 'grey',
                          borderStyle: ((saveAsDraftPressed || savePressed) && dueTimeError)? 'dashed' : 'solid',
                          borderWidth: ((saveAsDraftPressed || savePressed) && dueTimeError)? 2 : 1,
                        }]}
                        onPress={() => {this.setState({timePicker: true})}}>
                        {(this.state.dateOrTimeValue)?
                        <Text style={{textAlign: 'center', textAlignVertical: 'center'}}>{this.state.dateOrTimeValue}</Text>
                        :
                        <Text style={{textAlign: 'center', textAlignVertical: 'center'}}>Due Time</Text>
                        }
                        </TouchableOpacity>
                    :
                        null
                    }
                </View>
            </View>
        </View>

       <View style={[{alignItems: 'center', borderColor: 'green', borderWidth: 0}, getWidthnHeight(100), getMarginBottom(2.5)]}>
            <FloatingTitleTextInputField
                attrName = 'servicesRequired'
                title = 'Services Required'
                value = {services_required}
                valueProp = {(services_required)? services_required : view_lead.service_required}
                titleActiveColor = {colorTitle}
                titleInactiveColor = 'dimgrey'
                updateMasterState = {(attrName, services_required) => {
                  this.setState({services_required})
                  console.log("ATTRNAME: ", attrName)
                  if(services_required === ''){
                    this.setState({serviceRequiredError: true})
                  }else{
                    this.setState({serviceRequiredError: false})
                  }
                }}
                textInputStyles = {[{ // here you can add additional TextInput styles
                  color: 'black',
                  fontSize: 14,
                  borderColor: (savePressed && serviceRequiredError)? 'red' : 'grey',
                  borderStyle: (savePressed && serviceRequiredError)? 'dashed' : 'solid',
                  borderWidth: (savePressed && serviceRequiredError)? 2 : 1,
                }, getWidthnHeight(undefined, 7)]}
                containerStyle = {[{borderColor: 'red', borderWidth: 0, marginVertical: 0}, getWidthnHeight(90, 7)]}
                otherTextInputProps = {{editable: (loading)? false : true}}
            />
            <View style={[{position: 'absolute', alignSelf: 'flex-start', borderWidth: 0, borderColor: 'red'}, getWidthnHeight(7)]}>
              <Image source={require('../Image/asterisk.png')} style={{width: 10, height: 10, alignSelf: 'flex-end', backgroundColor: 'white', borderRadius: 5}}/>
            </View>
        </View>

        <View style={[{alignItems: 'center'}, getWidthnHeight(100), getMarginBottom(2.5)]}>
            <Dropdown
                containerStyle={[{
                  justifyContent: 'center', paddingLeft: 10,
                  width: getWidthnHeight(50).width,
                  borderColor: 'grey', borderWidth: 1,
                  borderRadius: 10
                }, getWidthnHeight(undefined, 7)]}
                //  maxLength = {12}
                inputContainerStyle={{borderBottomWidth: 0,fontSize:hp(2) }}
                label={'Select Priority'}
                data={priorityLevel}
                valueExtractor={({value})=> value}
                labelExtractor={({level})=> level}
                onChangeText={(selectPriority, index, data) => {
                  this.setState({ selectPriority }, () => console.log("@@@ PRIORITY LABEL: ", this.state.selectPriority))
                  console.log("ARG @@@@@: ", index, data[index]['level'])
                  this.setState({priorityLabel: data[index]['level']})
                }}
                disabled={(loading)? true : false}
                value={priorityLabel}
                //  baseColor = '#e5314e'
                baseColor = {colorTitle}
                //  selectedItemColor='#aaa'
                //  textColor='#aaa'
                //  itemColor='#aaa'
            />
        </View>

        <View style={[{alignItems: 'center'}, getWidthnHeight(100), getMarginBottom(2.5)]}>
          <View style={[{alignItems: 'center', justifyContent: 'space-evenly',borderWidth: 1, borderColor: 'grey', borderRadius: 10}, getWidthnHeight(90, 10)]}>
            <View style={[{alignItems: 'center'}, getWidthnHeight(90)]}>
              <Text style={[{color: colorBase, textAlign: 'center', fontWeight: 'bold'}, getWidthnHeight(40)]}>Pre Bid:</Text>
            </View>
            <View style={[getWidthnHeight(90)]}>
              {this.state.radioPreBidStatus === true ? 
                  <View style={{flexDirection:'row',justifyContent:'space-around',borderColor: 'black', borderWidth: 0}}>
                      <RadioDisable title="No" onPress={()=>{
                          this.setState({radioPreBidStatus:false, prebidDate: '', 
                          prebidTimeValue: '', prebidDateError: true, prebidTimeError: true, prebidNumber: 0})
                      }}/> 
                      <RadioEnable title="Yes" onPress={()=>{
                          this.setState({radioPreBidStatus:true, prebidNumber: 1})
                      }}/>
                  </View>
              :
                  <View style={{flexDirection:'row',justifyContent:'space-around',borderColor: 'black', borderWidth: 0}}> 
                      <RadioEnable title="No" onPress={()=>{
                          this.setState({radioPreBidStatus:false, prebidDate: '', 
                          prebidTimeValue: '', prebidDateError: true, prebidTimeError: true,prebidNumber: 0})
                      }}/> 
                      <RadioDisable title="Yes" onPress={()=>{
                          this.setState({radioPreBidStatus:true, prebidNumber: 1})
                      }}/> 
                  </View>
              }
            </View>
          </View>
        </View> 

        {(this.state.preBidTimeState)?
        <TimePicker 
            show={(loading)? false : this.state.preBidTimeState}
            timeDifference={2}
            prebidTimeValue={true}
            onBackdropPress={() => this.setState({preBidTimeState: false})}
        />
        : null
        }

        {(this.props.setPreBid)? this.setPreBidTimings() : null}

        {this.state.radioPreBidStatus === true ?     
            <View style={[{alignItems:'center', borderColor: 'black', borderWidth: 0}, getWidthnHeight(100,7), getMarginBottom(2.5)]}> 
                <View style={{alignItems: 'center',borderColor: 'red', borderWidth: 0}}>
                    <View style={[{justifyContent: (!prebidDateError)? 'space-between' : 'center', flexDirection: 'row',borderColor: 'red', borderWidth: 0}, getWidthnHeight(90, 7)]}>
                        {/* <DateSelector 
                            containerStyle={[{
                              borderWidth: 1, borderRadius: 10, justifyContent: 'center',
                              borderColor: ((saveAsDraftPressed || savePressed) && prebidDateError)? 'red' : 'grey',
                              borderStyle: ((saveAsDraftPressed || savePressed) && prebidDateError)? 'dashed' : 'solid', 
                              borderWidth: ((saveAsDraftPressed || savePressed) && prebidDateError)? 2 : 1,
                            }, getWidthnHeight(43, 7)]}
                            style={[getWidthnHeight(43)]}
                            date={this.state.prebidDate}
                            androidMode='default'
                            mode='date'
                            placeholder='PreBid Date'
                            format='YYYY-MM-DD'
                            onDateChange={(date) => {this.setState({prebidDate: date, prebidDateError: false})}} 
                            disabled={(loading)? true : false}
                        /> */}
                        <View style={[{borderColor: 'red', borderWidth: 0}, getWidthnHeight(43, 7)]}>
                            <TouchableOpacity 
                                onPress={() => this.setState({showFromDatePicker2: !showFromDatePicker2})}
                            >
                                <View 
                                    style={[{
                                        alignItems: 'center', justifyContent: 'center', borderRadius: 10, 
                                        borderColor: ((saveAsDraftPressed || savePressed) && prebidDateError)? 'red' : 'grey',
                                        borderStyle: ((saveAsDraftPressed || savePressed) && prebidDateError)? 'dashed' : 'solid', 
                                        borderWidth: ((saveAsDraftPressed || savePressed) && prebidDateError)? 2 : 1,
                                    }, getWidthnHeight(43, 7)]}>
                                    <Text style={[{color: (prebidDate)? '#000000' : '#C4C4C4', fontSize: (fontSizeH4().fontSize + 0)}]}>{prebidDate || 'Select Date'}</Text>
                                </View>
                            </TouchableOpacity>
                            {(showFromDatePicker2) && (
                                <DateTimePicker 
                                    styleBox={{flex: 1}}
                                    disabled={(loading)? true : false}
                                    date={moment(fromTimeStamp2).utc().toDate()}
                                    androidMode='default'
                                    mode='date'
                                    is24Hour={false}
                                    placeholder='Select Date'
                                    format='YYYY-MM-DD'
                                    minDate={fromMinDate}
                                    maxDate={fromMaxDate}
                                    onDateChange={(event, newDate) => {
                                        if(event.type === "dismissed"){
                                            this.setState({showFromDatePicker2: !showFromDatePicker2})
                                            return;
                                        }
                                        this.setState({showFromDatePicker2: !showFromDatePicker2})
                                        const prebidTimeStamp = event.nativeEvent.timestamp;
                                        this.setState({
                                            fromDate2: moment(newDate).format("YYYY-MM-DD"), fromTimeStamp2: prebidTimeStamp,
                                            fromDateError2: false, prebidDate: moment(newDate).format("YYYY-MM-DD"),
                                            prebidDateError: false
                                        }, () => {});
                                        Keyboard.dismiss();
                                    }} 
                                />
                            )}
                            <View style={styles.forDate}>
                                <Text style={[{fontSize: (fontSizeH4().fontSize - 4), color: colorBase, fontWeight: 'bold', textAlign: 'center'}, styles.boldFont]}>PreBid Date</Text>
                            </View>
                        </View> 
                        {(!prebidDateError)?
                            <TouchableOpacity style={[styles.TimeBox, getWidthnHeight(43, 7), {
                              borderColor: ((saveAsDraftPressed || savePressed) && prebidTimeError)? 'red' : 'grey',
                              borderStyle: ((saveAsDraftPressed || savePressed) && prebidTimeError)? 'dashed' : 'solid',
                              borderWidth: ((saveAsDraftPressed || savePressed) && prebidTimeError)? 2 : 1,
                            }]}
                                onPress={() => {this.setState({preBidTimeState: true})}}>
                                {(this.state.prebidTimeValue)?
                                <Text style={{textAlign: 'center', textAlignVertical: 'center'}}>{this.state.prebidTimeValue}</Text>
                                :
                                <Text style={{textAlign: 'center', textAlignVertical: 'center'}}>PreBid Time</Text>
                                }
                            </TouchableOpacity>
                        :
                            null
                        }
                    </View>
                </View>
            </View>
        :
            null
        }

        <View style={[{alignItems: 'center'}, getWidthnHeight(100), getMarginBottom(2.5)]}>
          <View style={[{flexDirection: 'row', justifyContent: 'space-between', borderWidth: 0, borderColor: 'grey', borderRadius: 10}, getWidthnHeight(90)]}>
            <View style={{}}>
              <FloatingTitleTextInputField
                  attrName = 'tenureinmonths'
                  title = 'Tenure in Months'
                  value = {tenure}
                  valueProp = {(tenure)? tenure : view_lead.tenure}
                  titleActiveColor = {colorTitle}
                  titleInactiveColor = 'dimgrey'
                  keyboardType='numeric'
                  updateMasterState = {(attrName, number) => {
                    const tenure = number.replace(/[^0-9]/g, '')
                    this.setState({tenure})
                    if(tenure === ''){
                      this.setState({tenureError: true})
                    }else{
                      this.setState({tenureError: false})
                    }
                    console.log("ATTRNAME: ", attrName, typeof tenure, tenure)
                  }}
                  textInputStyles = {[{ // here you can add additional TextInput styles
                    color: 'black',
                    fontSize: 14,
                    paddingLeft: 10,
                    borderColor: (savePressed && tenureError)? 'red' : 'grey',
                    borderStyle: (savePressed && tenureError)? 'dashed' : 'solid',
                    borderWidth: (savePressed && tenureError)? 2 : 1,
                  }, getWidthnHeight(undefined, 7)]}
                  containerStyle = {[{borderColor: 'red', borderWidth: 0, marginVertical:0}, getWidthnHeight(43, 7)]}
                  otherTextInputProps = {{editable: (loading)? false : true}}
              />
              <View style={[{position: 'absolute', alignSelf: 'flex-start', borderWidth: 0, borderColor: 'red', marginLeft: -2}, getWidthnHeight(7)]}>
                <Image source={require('../Image/asterisk.png')} style={{width: 10, height: 10, alignSelf: 'flex-start', backgroundColor: 'white', borderRadius: 5}}/>
              </View>
            </View>

            <View>
              <FloatingTitleTextInputField
                  attrName = 'volume'
                  title = 'Volume'
                  value = {volume}
                  valueProp = {(volume)? volume : view_lead.volume}
                  titleActiveColor = {colorTitle}
                  titleInactiveColor = 'dimgrey'
                  keyboardType='numeric'
                  updateMasterState = {(attrName, number) => {
                    const volume = number.replace(/[^0-9]/g, '')
                    this.setState({volume})
                    if(volume === ''){
                      this.setState({volumeError: true})
                    }else{
                      this.setState({volumeError: false})
                    }
                    console.log("ATTRNAME: ", attrName)
                  }}
                  textInputStyles = {[{ // here you can add additional TextInput styles
                    color: 'black',
                    fontSize: 14,
                    paddingLeft: 10,
                    borderColor: (savePressed && volumeError)? 'red' : 'grey',
                    borderStyle: (savePressed && volumeError)? 'dashed' : 'solid',
                    borderWidth: (savePressed && volumeError)? 2 : 1,
                  }, getWidthnHeight(undefined, 7)]}
                  containerStyle = {[{borderColor: 'red', borderWidth: 0, marginVertical: 0}, getWidthnHeight(43, 7)]}
                  otherTextInputProps = {{editable: (loading)? false : true}}
              />
              <View style={[{position: 'absolute', alignSelf: 'flex-start', borderWidth: 0, borderColor: 'red', marginLeft: -2}, getWidthnHeight(7)]}>
                <Image source={require('../Image/asterisk.png')} style={{width: 10, height: 10, alignSelf: 'flex-start', backgroundColor: 'white', borderRadius: 5}}/>
              </View>
            </View>
          </View>
        </View> 

        <View style={[{alignItems: 'center'}, getWidthnHeight(100), getMarginBottom(2.5)]}>
          <View style={[{flexDirection: 'row', justifyContent: 'space-between', borderWidth: 0, borderColor: 'grey', borderRadius: 10}, getWidthnHeight(90)]}>
            <View>
              <FloatingTitleTextInputField
                  attrName = 'value'
                  title = {`Value (${"\u20B9"})`}
                  value = {value}
                  valueProp = {(value)? value : view_lead.value}
                  titleActiveColor = {colorTitle}
                  titleInactiveColor = 'dimgrey'
                  keyboardType='numeric'
                  updateMasterState = {(attrName, number) => {
                    const value = number.replace(/[^0-9]/g, '')
                    this.setState({value})
                    if(value === ''){
                      this.setState({valueError: true})
                    }else{
                      this.setState({valueError: false})
                    }
                    console.log("ATTRNAME: ", attrName)
                  }}
                  textInputStyles = {[{ // here you can add additional TextInput styles
                    color: 'black',
                    fontSize: 14,
                    paddingLeft: 10,
                    borderColor: (savePressed && valueError)? 'red' : 'grey',
                    borderStyle: (savePressed && valueError)? 'dashed' : 'solid',
                    borderWidth: (savePressed && valueError)? 2 : 1,
                  }, getWidthnHeight(undefined, 7)]}
                  containerStyle = {[{borderColor: 'red', borderWidth: 0, marginVertical: 0}, getWidthnHeight(43, 7)]}
                  otherTextInputProps = {{editable: (loading)? false : true}}
              />
              <View style={[{position: 'absolute', alignSelf: 'flex-start', borderWidth: 0, borderColor: 'red', marginLeft: -2}, getWidthnHeight(7)]}>
                <Image source={require('../Image/asterisk.png')} style={{width: 10, height: 10, alignSelf: 'flex-start', backgroundColor: 'white', borderRadius: 5}}/>
              </View>
            </View>

            <View>
              <FloatingTitleTextInputField
                  attrName = 'emdamount'
                  title = 'EMD Amount'
                  value = {emdAmount}
                  valueProp = {(emdAmount)? emdAmount : view_lead.emd_amount}
                  titleActiveColor = {colorTitle}
                  titleInactiveColor = 'dimgrey'
                  keyboardType='numeric'
                  updateMasterState = {(attrName, number) => {
                    const emdAmount = number.replace(/[^0-9]/g, '')
                    this.setState({emdAmount})
                    if(emdAmount === ''){
                      this.setState({emdAmountError: true})
                    }else{
                      this.setState({emdAmountError: false})
                    }
                    console.log("ATTRNAME: ", attrName)
                  }}
                  textInputStyles = {[{ // here you can add additional TextInput styles
                    color: 'black',
                    fontSize: 14,
                    paddingLeft: 10,
                    borderColor: (savePressed && emdAmountError)? 'red' : 'grey',
                    borderStyle: (savePressed && emdAmountError)? 'dashed' : 'solid',
                    borderWidth: (savePressed && emdAmountError)? 2 : 1,
                  }, getWidthnHeight(undefined, 7)]}
                  containerStyle = {[{borderColor: 'red', borderWidth: 0, marginVertical: 0}, getWidthnHeight(43, 7)]}
                  otherTextInputProps = {{editable: (loading)? false : true}}
              />
              <View style={[{position: 'absolute', alignSelf: 'flex-start', borderWidth: 0, borderColor: 'red', marginLeft: -2}, getWidthnHeight(7)]}>
                <Image source={require('../Image/asterisk.png')} style={{width: 10, height: 10, alignSelf: 'flex-start', backgroundColor: 'white', borderRadius: 5}}/>
              </View>
            </View>
          </View>
        </View> 

        <View style={[{borderColor: 'green', borderWidth: 0, alignItems: 'center'}, getWidthnHeight(100), getMarginBottom(2.5)]}>
          <FloatingTitleTextInputField
              attrName = 'servicesDescription'
              title = 'Services Description'
              value = {service_description}
              valueProp = {(service_description)? service_description : view_lead.service_description}
              titleActiveColor = {colorTitle}
              titleInactiveColor = 'dimgrey'
              updateMasterState = {(attrName, service_description) => {
                this.setState({service_description})
                if(service_description === ''){
                  this.setState({serviceDescriptionError: true})
                }else {
                  this.setState({serviceDescriptionError: false})
                }
                console.log("ATTRNAME: ", attrName)
              }}
              textInputStyles = {[{ // here you can add additional TextInput styles
                color: 'black',
                fontSize: 14,
                borderColor: (savePressed && serviceDescriptionError)? 'red' : 'grey',
                borderStyle: (savePressed && serviceDescriptionError)? 'dashed' : 'solid',
                borderWidth: (savePressed && serviceDescriptionError)? 2 : 1,
              }, getWidthnHeight(undefined, 7)]}
              containerStyle = {[{borderColor: 'red', borderWidth: 0, marginVertical: 0}, getWidthnHeight(90, 7)]}
              otherTextInputProps = {{editable: (loading)? false : true}}
          />
          <View style={[{position: 'absolute', alignSelf: 'flex-start', borderWidth: 0, borderColor: 'red'}, getWidthnHeight(7)]}>
            <Image source={require('../Image/asterisk.png')} style={{width: 10, height: 10, alignSelf: 'flex-end', backgroundColor: 'white', borderRadius: 5}}/>
          </View>
        </View>
        
        <View style={[{alignItems: 'center'}, getWidthnHeight(100), getMarginBottom(2.5)]}>
            <TouchableOpacity activeOpacity={0.5} style={[styles.button, getWidthnHeight(80)]} onPress={this.attachmentPicker.bind(this)}>
                {this.state.attachmentOBJ ? 
                    <Text numberOfLines={1} style={{color:'white',width:'100%',height:'100%',textAlign:'center'}}>{this.state.attachmentOBJ.name}</Text>
                : 
                    <View style={{flexDirection:'row'}}>
                        <Image source={require('../Image/white_icon/upload.png')} style={{ width: 20, height: 20, marginLeft: 0,bottom:0 }} />
                        <Text style={{color:'white'}}>  Choose file</Text>
                    </View>
                }
            </TouchableOpacity>
        </View>

        <View style={[{borderColor: 'green', borderWidth: 0, alignItems: 'center'}, getWidthnHeight(100), getMarginBottom(2.5)]}>
          <FloatingTitleTextInputField
              attrName = 'addnewcomments'
              title = 'Add New Comments'
              value = {this.state.newComments}
              titleMargin = {{paddingBottom: 10}}
              titleActiveColor = {colorTitle}
              titleInactiveColor = 'dimgrey'
              updateMasterState = {(attrName, newComments) => {
                this.setState({newComments})
                if(newComments === ''){
                  this.setState({newCommentsError: true})
                }else {
                  this.setState({newCommentsError: false})
                }
                console.log("ATTRNAME: ", attrName)
              }}
              textInputStyles = {[{ // here you can add additional TextInput styles
                color: 'black',
                fontSize: 14,
                borderWidth: 0,
                borderColor: 'red'
              }, getWidthnHeight(undefined, 8)]}
              containerStyle = {[{
                borderWidth: 0, marginVertical: 0, justifyContent: 'center',
                borderColor: ((saveAsDraftPressed || savePressed) && newCommentsError)? 'red' : 'grey',
                borderStyle: ((saveAsDraftPressed || savePressed) && newCommentsError)? 'dashed' : 'solid',
                borderWidth: ((saveAsDraftPressed || savePressed) && newCommentsError)? 2 : 1,
                borderRadius: 10
              }, getWidthnHeight(90, 11)]}
              otherTextInputProps = {{multiline: true, editable: (loading)? false : true}}
              updateUI = {String(true)}
          />
          <View style={[{position: 'absolute', alignSelf: 'flex-start', borderWidth: 0, borderColor: 'red'}, getWidthnHeight(7)]}>
            <Image source={require('../Image/asterisk.png')} style={{width: 10, height: 10, alignSelf: 'flex-end', backgroundColor: 'white', borderRadius: 5}}/>
          </View>
        </View>
        
        </ScrollView>
        <View style={[{justifyContent:'space-evenly',alignItems:'center', backgroundColor: 'transparent', borderColor: '#E5214E', borderTopWidth: 0}, getWidthnHeight(100, 7)]}>
            <View style={[{borderTopWidth: 1, borderColor: colorBase}, getWidthnHeight(80)]}/>
            {(leadStatus == 3)?
              <View style={[{alignItems: 'center'}, getWidthnHeight(90)]}>
                <RoundButton 
                  title="Save"
                  onPress={()=> {
                    this.setState({show_is_completed: true, saveAsDraftPressed: false}, async() => {
                      await this.checkBlanks();
                      this.store_lead_button();
                    })
                  }}
                  gradient={['#0E57CF', '#25A2F9']}
                  style={[getWidthnHeight(35, 5)]}
                />
              </View>
            :
              <View style={[{flexDirection: 'row', justifyContent: 'space-evenly'}, getWidthnHeight(90)]}>
                  <RoundButton 
                    title="Save As Draft"
                    onPress={()=> {
                      this.setState({show_is_completed: false, savePressed: false}, async() => {
                        await this.checkBlanks();
                        this.saveAsDraft();
                      })
                    }}
                    gradient={['#0E57CF', '#25A2F9']}
                    style={[getWidthnHeight(35, 5)]}
                  />
                  <RoundButton 
                    title="Complete"
                    onPress={()=> {
                      this.setState({show_is_completed: true, saveAsDraftPressed: false}, async() => {
                        await this.checkBlanks();
                        this.store_lead_button();
                      })
                    }}
                    gradient={['#0E57CF', '#25A2F9']}
                    style={[getWidthnHeight(35, 5)]}
                  />
              </View>
            }
        </View>
              </View>
              <View 
                  style={[{backgroundColor: (loading)? 'rgba(0, 0, 0, 0.5)' : 'transparent'
                  }, StyleSheet.absoluteFill]} 
                  pointerEvents={(loading)? 'auto' : 'none'}
              >
                  {(loading) ?
                      <Spinner loading={loading} style={[styles.loadingStyle, getWidthnHeight(45, 10), getMarginLeft(3)]} color='rgb(19,111,232)'/>
                  : null}
              </View>
        <CommonModal 
          title={apiError}
          subtitle= {`Error Code: ${errorCode}${apiCode}`}
          visible={this.state.commonModal}
          onDecline={this.onDecline.bind(this)}
          buttonColor={['#0E57CF', '#25A2F9']}
        />
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
        </View> 
    </View>
    )}
    </KeyboardShift>
    
    );
}

}
const styles = StyleSheet.create({
  MainContainer:{
    backgroundColor:'white',
    borderTopLeftRadius:40,
    borderTopRightRadius:40,
    flex: 1,
    borderWidth: 0,
    borderColor: 'yellow',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  button: {
    flexDirection:'row',
    justifyContent:'center',
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:colorBase,
    borderRadius:10,
    borderWidth: 0,
  },
  PictureButton: {
    width:'88%',
    flexDirection:'row',
    justifyContent:'center',
    marginLeft:0,
    marginRight:0,
    marginBottom: 0,
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:0,
    paddingRight:0,
    backgroundColor:'#e5314e',
    borderRadius:1,
    borderWidth: 0,
    // borderColor: 'rgb(19,111,232)',
    elevation: 0,
  },
  container: {
    flex: 0,
    flexDirection:'column',
    left:'0%',
    width:wp('100%'),
    height:hp('90%'),

  },
  image:{
    top:0,
    left: 0,
    bottom:0,
    backgroundColor:'white',
    width: 10,
    height: 14,
  },
  box:{
    borderWidth: 0,
    borderColor:'#c4c4c4',
    borderRadius:10,
    left:0,
    height:50,
    width:'90%',
    alignItems: 'center'
 },
 TimeBox:{
    borderWidth:1,
    borderColor:'grey',
    borderRadius:10,
    justifyContent: 'center'
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

const mapStateToProps = ({reduxState}) => {
    // console.log("##@@!! MAP STATE TO PROPS: ", reduxState.cameraFile)
    return {
        file: reduxState.cameraFile,
        fromTime: reduxState.timePicker.fromTime,
        setPreBid: reduxState.preBid.fromTime
    }
}

const appComponent = (App);
export default connect(mapStateToProps, {cameraFile, show_HideTimePicker, prebidTime})(appComponent);