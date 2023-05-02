import React, { Component } from 'react';
import {
  StyleSheet, Text, View, PermissionsAndroid,
   Dimensions, ScrollView, Alert,
  TouchableOpacity, Platform, ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import RNBackgroundDownloader from 'react-native-background-downloader';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS, { exists } from 'react-native-fs';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {
    IOS_StatusBar, getWidthnHeight, getMarginTop, WaveHeader, getMarginVertical, Spinner, getMarginBottom, 
    getMarginLeft, DownloadModal
} from '../KulbirComponents/common';
import {getLeadAttachmentDownloadAPI} from '../api/BaseURL';
import { color } from 'react-native-reanimated';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const colorBase = '#25A2F9';

export default class App extends Component {
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
        fileName: '',
        fullFileName: '',
        downloadLink: null,
        secretToken: null,
        loading: false,
        leadCode: null,
        fileSize: null,
        downloadModal: false,
        percent: 0,
        checkFile: false
    };
    this.props.navigation.setOptions({
        title: 'Lead Comments'
    })
  }

async componentDidMount(){
    const leadCode = this.props.route.params.leadCode;
    if(Platform.OS === 'android'){
        this.getAndroidStoragePermission();
    }else if(Platform.OS === 'ios'){
        this.get_iOS_StoragePermission();
    }
    this.setState({leadCode})
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

async generateDownloadLink(fileName, number){
    this.setState({fileName})
    await getLeadAttachmentDownloadAPI(fileName).then((link) => {
        this.setState({downloadLink: link}, () => {
            const {downloadLink} = this.state;
            console.log("%%%%%% @@@@@@ DOWNLOAD LINK: ", downloadLink)
            if(downloadLink){
                this.downloadAttachment(number);
            }
        })
    })
}

hideLoader = () => {
    this.setState({ loading: false });
}

showLoader = () => {
    this.setState({ loading: true });
}

async downloadAttachment(number){
    const {fileName, downloadLink, secretToken, leadCode, loading} = this.state;
    if(!secretToken || !downloadLink || loading){
        return;
    }
    this.showLoader();

    let downloadDir = null;
    if(Platform.OS === 'android'){
        downloadDir = RNFetchBlob.fs.dirs.DownloadDir;
    }else if(Platform.OS === 'ios'){
        downloadDir = RNFS.DocumentDirectoryPath;
    }
    const downloadPath = `${downloadDir}/C${number}_${leadCode}-${fileName}`;
    this.setState({fullFileName: `C${number}_${leadCode}-${fileName}`}, () => {
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
    console.log("$$$$ ANY DOWNLOADS: ", lostTasks)
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

  render (){
        const context=this;
        const {secretToken, loading, percent, downloadModal, fullFileName} = this.state;
        const leadCode = this.props.route.params.leadCode;
        //console.log(this.state.leadSourceOptions_id)
        let status = [{value: 'all',}, {value: 'Today Tasks',}, {value: 'Delayed Tasks',},{value: 'Upcoming Tasks', },{value: "This Week's Tasks",},{value: "This Month's Tasks",},];

        var Comment = (context.props.route.params.Comment);
        var Name = (context.props.route.params.name);
        let gradient = ['#0E57CF', '#25A2F9'];
  return (
            <View style={{height:viewportHeight,width:viewportWidth,backgroundColor:'#e6e6e6'}}>
                <IOS_StatusBar barStyle="light-content"/>

                <DownloadModal 
                    visible={downloadModal}
                    fileName={fullFileName}
                    percent={percent}
                    onBackdropPress={() => this.setState({downloadModal: false})}
                />
                <View style={[styles.MainContainer, getMarginTop(0), getWidthnHeight(100)]}>
                    <View>
                    <View style={[{flexDirection: 'row', justifyContent: 'center', borderWidth: 0, borderColor: 'black'}, getMarginTop(2)]}>
                        <Text style={[{fontWeight: 'bold'}, styles.boldFont]}>Lead Code: </Text>
                        <Text style={[{color: colorBase, fontWeight: 'bold'}, styles.boldFont]}>{leadCode}</Text>
                    </View>
                    <ScrollView contentContainerStyle={{alignItems: 'center'}} style={[{borderColor: 'red', borderWidth: 0}, getMarginTop(2), getWidthnHeight(100)]}>
                        {Comment.map((item, key) => {
                        let DateTime = item.created_at.split(' ');
                        let time12Hr = (moment(DateTime[1], ['HH:mm:ss']).format('hh:mm A'));
                        let date = (moment(DateTime[0], ['YYYY-MM-DD']).format('DD-MM-YYYY'));
                        let serialNo = key + 1;
                        console.log("### COMMENTS: ",item)
                        return(
                            <View style={[{flexDirection:'row', justifyContent: 'space-evenly', marginVertical: 0, borderColor: 'red', borderWidth: 0}, getMarginBottom(4), getWidthnHeight(90)]}>
                                <View style={{flex: 0, alignItems: 'center', justifyContent: 'flex-start', borderColor: 'red', borderWidth: 0}}>
                                    <View style={{borderColor: colorBase,borderWidth:1,borderRadius:75,height:40,width:40,alignItems:'center', justifyContent: 'center'}}>
                                        <Text>{`${serialNo}`}</Text>
                                    </View>
                                </View>
                                <View style={{flex: 2.5, justifyContent: 'center', borderColor: 'green', borderWidth: 0}}>
                                    <View style={[getMarginLeft(10)]}>
                                        <View>
                                            <Text style={{color: colorBase,fontStyle: 'italic',}}>{`${date} - ${time12Hr}`}</Text>
                                        </View>
                                        <Text style={{fontWeight:'bold', flex: 2}}>{item.user_employee?.fullname}</Text>
                                        <View style={{borderWidth: 0, borderColor: 'black'}}>
                                            <Text>{item.comments}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{flex: 1, justifyContent: 'center'}}>
                                {(item.attachment)?
                                    <View style={[{alignItems: 'center', justifyContent: 'center'}, getMarginVertical(0)]}>
                                        <TouchableOpacity style={{borderColor: 'red', borderWidth: 0, height: getWidthnHeight(undefined, 4).height, justifyContent: 'center'}} onPress={() => (secretToken)? this.checkExistingDownloads(item.attachment, serialNo) : null}>
                                            <Text style={{fontSize: 10, color: (secretToken && !loading)? colorBase: 'dimgrey', borderBottomWidth: 1, borderBottomColor: (secretToken && !loading)? colorBase: 'dimgrey'}}>Download File</Text>
                                        </TouchableOpacity>
                                    </View>
                                :
                                    <View style={{alignItems: 'center'}}>
                                        <Text>--</Text>
                                    </View>
                                }
                                </View>
                            </View>
                        );
                        })}
                    </ScrollView>
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
                </View>
            </View>
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
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10
    },
    container: {
        flexDirection:'column',
        width:wp('100%'),
        height:hp('90%'),
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
    }
});
