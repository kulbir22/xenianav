import React, {Component} from 'react';
import { 
    Text, View, TouchableOpacity, Platform, Image, PermissionsAndroid, Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FileViewer from "react-native-file-viewer";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import moment from 'moment';
import WebView from 'react-native-webview';
import LinearGradient from 'react-native-linear-gradient';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from 'react-native-push-notification';
import RNBackgroundDownloader from 'react-native-background-downloader';
import RNFS, {exists} from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import {Dropdown} from 'react-native-material-dropdown';
import Complete from 'react-native-vector-icons/MaterialCommunityIcons';

import { selectDrawerItem } from '../store/redux/reducer';
import {
    getWidthnHeight, Spinner, CommonModal, IOS_StatusBar, DownloadModal, WaveHeader, getMarginTop, 
    SalaryHTML, getMarginVertical, GradientIcon, fontSizeH4, statusBarGradient
} from '../KulbirComponents/common';
import {extractBaseURL} from '../api/BaseURL';

const monthList = [
    {"month": "January", "id": '01'}, {"month": "February", "id": '02'},
    {"month": "March", "id": '03'}, {"month": "April", "id": '04'},
    {"month": "May", "id": '05'}, {"month": "June", "id": '06'},
    {"month": "July", "id": '07'}, {"month": "August", "id": '08'},
    {"month": "September", "id": '09'}, {"month": "October", "id": '10'},
    {"month": "November", "id": '11'}, {"month": "December", "id": '12'}
];

class SalarySlip extends Component {
    constructor(props){
        super(props)
            this.state = {
                date: null,
                month: null,
                target: null,
                achieved: null,
                id: null,
                empData: [],
                monthID: '', 
                yearID: '',
                error: false,
                arrayLength: 0,
                loading: false,
                option: [{"name": "DAILY", "id": 1}, {"name": "MONTHLY", "id": 2}],
                dropdownValue: "",
                name: null,
                leftOver: null,
                empCode: null,
                dimensions: undefined,
                baseURL: null,
                errorCode: null,
                apiCode: null,
                commonModal: false,
                monthList: monthList,
                yearsList: this.yearList(),
                update: false,
                pdfFilePath: null,
                updateField: false,
                wait: false,
                status: false,
                empID: null,
                secretToken: null,
                downloadLink: null,
                empName: '',
                fileName: '',
                fileSize: null,
                downloadModal: false,
                percent: 0,
                downloadComplete: false,
                downloadPath: ''
            }
            this.props.navigation.setOptions({
                title: 'Salary Slip'
            })
    }

    async componentDidMount(){
        const {navigation} = this.props;
        if(Platform.OS === 'android'){
            this.getAndroidStoragePermission();
        }else if(Platform.OS === 'ios'){
            this.get_iOS_StoragePermission();
        } 
        await this.extractLink();
        const user_token= await AsyncStorage.getItem('user_token');
        const permissions_fir= JSON.parse(user_token);
        this.setState({
            secretToken: permissions_fir.success.secret_token,
            empCode: permissions_fir.success.user.employee_code,
            empName: permissions_fir.success.user.employee.fullname,
            empID: String(permissions_fir.success.user.id)
        }, () => {
            const {empCode, empName, monthID, yearID} = this.state;
            console.log("%%%%%%%", empName, empCode)
        });
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
                    onPress: () => {
                        this.props.selectDrawerItem('Home');
                        this.props.navigation.goBack();
                    }
                }]
                );
            }
        }catch (err) {
            console.warn(err);
        }
    }

    // async createPDF() {
    //     let options = {
    //       html: SalaryHTML('Vishal Sundriyal'),
    //       fileName: 'Vishal',
    //       directory: 'Documents',
    //     };
    
    //     let file = await RNHTMLtoPDF.convert(options)
    //     // console.log(file.filePath);
    //     if(Platform.OS === 'android'){
    //         Alert.alert("Download Complete!", `Internal Storage/Documents: Vishal.pdf`)
    //     }else if(Platform.OS === 'ios'){
    //         Alert.alert("Download Complete!", `On My iPhone/xenia: ${"\n\n"} Vishal.pdf`)
    //     }
        
    // }

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
                    if(response === RESULTS.GRANTED){
                        console.log("@@@ MEDIA PERMISSION GRANTED")
                    }else{
                        this.props.selectDrawerItem('Home');
                        this.props.navigation.goBack();
                    }   
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

   //========== DOWNLOAD SALARY SLIP PDF ==========\\
   
    downloadPDF(){
        let downloadDir = null;
        this.showLoader();
        const {empName, empCode, downloadLink, secretToken, empID, monthID, yearID} = this.state;
        const fileName = `${empName}(${empCode})Salary-slip-${monthID}-${yearID}.pdf`;
        this.setState({fileName})
        const newDownloadLink = `${downloadLink}?user_id=${empID}&month=${monthID}&year=${yearID}`
        if(Platform.OS === 'android'){
            downloadDir = RNFetchBlob.fs.dirs.DownloadDir;
        }else if(Platform.OS === 'ios'){
            downloadDir = RNFS.DocumentDirectoryPath;
        }
        console.log("@@@ ^^^^^DOWNLOAD LINK", newDownloadLink)
        const downloadPath = `${downloadDir}/${fileName}`;
        this.setState({ downloadPath })
        RNFetchBlob.config({
            path: downloadPath
        })
        .fetch('POST', newDownloadLink, {
            'Accept': 'application/json',
            'Authorization': `Bearer ${secretToken}`,
        })
        .then((file) => {
            let status = file.info().status;
            console.log("@@@@@ PDF SAVED TO: ", file, "\n\n", file.info())
            this.hideLoader();
            if(status === 200){
                this.setState({downloadComplete: true})
            }else if(status !== 200){
                this.setState({downloadComplete: false})
                exists(downloadPath).then((checkFile) => {
                    console.log("##### CHECK FILE: ", checkFile)
                    if(checkFile){
                        RNFS.unlink(downloadPath).then(() => {
                            console.log("@@@@@@ %%%%%% FILE DELETED")
                        }).catch((error) => {
                            console.log(error.message)
                        })
                    }
                })
                alert("Salary Slip Unavailable")
            }
        }).catch(() => {
            console.log("&&&&& ERROR PDF")
            this.hideLoader();
        })
    }

    pushLocalNotification(){
        console.log("@@@@ Push Notification function called")
        PushNotification.localNotification({
            /* Android Only Properties */
            title: "My Notification Title", // (optional)
            message: "My Notification Message", // (required)
        });
    }

    async extractLink(){
        await extractBaseURL().then((baseURL) => {
            this.setState({
                baseURL, downloadLink: `${baseURL}/salary-slip`
            }, () => console.log("EXTRACT LINK: ", this.state.baseURL, this.state.downloadLink))
        })
    }

    yearList() {
        let startYear = 2020;
        let endYear = moment().year();
        let id = 1;
        const yearsList = [];
        while ( startYear <= endYear ) {
            yearsList.push({"year": startYear++, "id": id++});
        }  
        return yearsList;
    }

    UNSAFE_componentWillUnmount(){
        this._unsubscribe().remove();
    }

    onDecline(){
        this.setState({commonModal: false})
    }
      
    enableModal(status, apiCode){
        this.setState({errorCode: status})
        this.setState({apiCode})
        this.setState({commonModal: true})
    }

    showLoader = () => {
        this.setState({ loading: true });
    }
    
    hideLoader = () => {
        this.setState({ loading: false });
    }

    onButtonPress(){
        if(this.state.monthID === null || this.state.yearID === null){
            this.setState({error: true})
            return;
        }
        if(this.state.monthID !== null && this.state.yearID !== null){
            this.setState({error: false});
            this.getSalarySlip();  
        }
    }

    renderError(){
        return (
            <View style={{alignItems: 'center', marginTop: 15, marginBottom: -15}}>
                <Text style={{fontSize: 10, color: 'red'}}>***Both fields are required***</Text>
            </View>
        );
    }

    bubbleLayout = (event) => {
        if(this.state.dimensions){
            return;
        }
        let width = Math.round(event.nativeEvent.layout.width)
        let height = Math.round(event.nativeEvent.layout.height)
        let bubble = event.nativeEvent.layout
        this.setState({dimensions: {width, height}}, () => console.log("BUBBLE DIMENSIONS: ", this.state.dimensions, bubble))
    }

    render(){
        const {
            type, id, target, achieved, arrayLength, name, dimensions, errorCode, apiCode, month, yearID, update,
            downloadPath, fullFileName, percent, baseURL, empID, monthID, secretToken, fileName, downloadComplete
        } = this.state

        //console.log("MONTHS: ", SalaryHTML)
        // const page1 = PDFPage.create()
        // .setMediaBox(200, 200)
        // .drawText("This text is using the font Franklin Gothic Medium!", {
        //     x: 5,
        //     y: 235,
        //     color: "#F62727",
        //     fontName: "Franklin Gothic Medium"
        // });
        let bubbleMargin = null;

        if(dimensions){
            bubbleMargin = {marginTop: (-1) * (Math.round(dimensions.height/2) + 1)}
        }
        let user = this.props.employer;
        let gradient = null;
        let borderColor = null;
        let searchButton = null;
        searchButton = {backgroundColor: 'rgb(19,111,232)'}
        gradient = ['#0E57CF', '#25A2F9']
        borderColor = 'rgb(19,111,232)';
        
        return (
            <View style={[{backgroundColor: 'white', flex: 1}, getWidthnHeight(100)]}>
                <IOS_StatusBar color={statusBarGradient} barStyle="light-content"/>

                <View style={[{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginHorizontal: 15}, getWidthnHeight(90)]}>
                        
                        <Dropdown
                            value={this.state.dropdownValue}
                            data={this.state.yearsList}
                            label="Select Year"
                            labelExtractor={({year}) => year}
                            valueExtractor={({id}) => id}
                            inputContainerStyle={{borderBottomWidth: 0}}
                            labelFontSize={12}
                            itemTextStyle={{fontSize: 16}}
                            fontSize={16}
                            containerStyle={[{borderColor: borderColor, borderBottomWidth: 1}, getWidthnHeight(35)]}
                            pickerStyle={[{marginHorizontal: 10}, getWidthnHeight(30), getMarginTop(13.4)]}
                            onChangeText={(id, index, data) => {
                                const yearID = String(data[index]['year'])
                                this.setState({yearID, downloadComplete: false}, () => {
                                    const {monthID, yearID} = this.state;
                                    if(monthID && yearID){
                                        this.downloadPDF();
                                    }
                                    console.log("Selected Year: ", this.state.yearID, typeof this.state.yearID)
                                });
                                if(this.state.month && this.state.yearID){
                                    this.setState({update: true})
                                }  
                                this.setState({arrayLength: 0})
                                this.setState({empData: []})
                                }
                            }
                        />

                        <Dropdown
                            value={this.state.dropdownValue}
                            data={this.state.monthList}
                            label="Select Month"
                            labelExtractor={({month}) => month}
                            valueExtractor={({id}) => id}
                            inputContainerStyle={{borderBottomWidth: 0}}
                            labelFontSize={12}
                            itemTextStyle={{fontSize: 16}}
                            fontSize={16}
                            containerStyle={[{borderColor: borderColor, borderBottomWidth: 1}, getWidthnHeight(35)]}
                            pickerStyle={[{marginHorizontal: 10}, getWidthnHeight(30), getMarginTop(13.4)]}
                            onChangeText={(id, index, data) => {
                                const monthID = data[index]['id']
                                console.log("TEST MONTH: ", id, monthID)
                                this.setState({monthID, downloadComplete: false}, () => {
                                    const {monthID, yearID} = this.state;
                                    if(monthID && yearID){
                                        this.downloadPDF();
                                    }
                                });
                                this.setState({month: data[index]['month']})
                                console.log('Set MonthID: ', this.state.monthID, this.state.month)
                                if(this.state.month && this.state.yearID){
                                    this.setState({update: true})
                                }
                                this.setState({arrayLength: 0})
                                this.setState({empData: []})
                                }
                            }
                        />

                        {/* {<View>
                            <TouchableOpacity onPress={() => this.onButtonPress()}>
                                <SearchIcon style={{marginTop: 25}} color={gradient}/>
                            </TouchableOpacity>
                        </View>} */}

                </View>

                {(this.state.error) ? this.renderError() : null}

                <View style={{marginVertical: 30, alignItems: 'center'}}>
                    <LinearGradient 
                        start={{x: -0.5, y: 1.5}} 
                        end={{x:0.8, y: 0.0}} 
                        colors={gradient} 
                        style={[styles.linearGradient, getWidthnHeight(28)]}/>
                </View>

                <View style={{backgroundColor: 'lightgrey', flex: 1, marginTop: 10, alignItems: 'center'}}>
                    {/*Salary Slip*/}
                    {(downloadComplete) ?
                        <View 
                            style={[{
                                alignItems: 'center', backgroundColor: 'white', justifyContent: 'center', borderRadius: 10
                                }, getMarginTop(10)
                            ]}
                        >
                            <View style={[{alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(80), getMarginVertical(2)]}>
                                <Complete name="check-underline-circle-outline" size={30} color="#0BB04F" style={{backgroundColor: 'white', borderRadius: 30}}/>
                                <Text style={[{fontWeight: 'bold'}, styles.boldFont]}>Download Complete!</Text>
                                {(Platform.OS === 'android')?
                                    <Text>File available in Downloads folder</Text>
                                :
                                    <Text>On My iPhone/xenia:</Text>
                                }
                                    <Text>{fileName}</Text>
                                <TouchableOpacity style={[{alignItems: 'center'}, getMarginTop(2)]} onPress={() => { FileViewer.open(downloadPath) }} activeOpacity={0.5}>
                                    <GradientIcon
                                        start={{x: 0, y: 0}}
                                        end={{x: 0.7, y: 0}}
                                        containerStyle={[{borderWidth: 0, borderColor: 'red', alignItems: 'center'}, getWidthnHeight(10)]}
                                        icon={<Ionicons name="folder-open-sharp" size={getWidthnHeight(10).width}/>}
                                        colors={["#F58634", "#FFB830"]}
                                    />
                                    <Text style={[fontSizeH4()]}>View File</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        :
                        <View style={[{flex: 1, alignItems: 'center'}, getMarginTop(10)]}>
                            <Text>No Data Available</Text>
                        </View>
                    }      

                        {(this.state.loading) ? <Spinner loading={this.state.loading} style={styles.loadingStyle}/> : null}

                        <View style={{backgroundColor: 'transparent', position: 'absolute', alignItems: 'center', marginTop: -10}}>
                            <View style={{marginTop: 10, backgroundColor: 'transparent', height: 2}}>
                                <View style={{alignItems: 'center', backgroundColor: 'transparent', height: 2}}>
                                    <LinearGradient 
                                        start={{x: -0.5, y: 1.5}} 
                                        end={{x:0.8, y: 0.0}} 
                                        colors={['#0E57CF', '#0E57CF']} 
                                        style={[styles.lineGradient, getWidthnHeight(100)]}/>
                                </View>
                            </View>
                        
                            <View style={[styles.bubble, getWidthnHeight(80, 3.5), bubbleMargin]} onLayout={this.bubbleLayout}>
                                {
                                    (!update) ?
                                        <Text style={{color: 'gray', backgroundColor: 'transparent', fontSize: 12}}>NO DATA FOUND</Text>
                                    :   <Text style={{color: 'gray', backgroundColor: 'transparent', fontSize: 12}}>Salary Slip for {`${month.toUpperCase()}, ${yearID}`}</Text>
                                }
                            </View>
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
        );
    }
}

const styles = {
    forDate: {
        position: 'absolute',
        backgroundColor: 'white',
        alignItems: 'flex-start',  
        borderColor: 'black', 
        borderWidth: 0, 
        marginTop: -7, 
        width: 57, 
        height: 16,
        marginLeft: 10,
    },
    linearGradient: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 3,
      width: 100,
      borderRadius: 50
    },
    lineGradient: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 1,
      width: 420,
      borderRadius: 50,
      backgroundColor: 'transparent'
    },
    bubble: {
        //position: 'absolute',
        backgroundColor: 'white', 
        borderWidth: 1, 
        borderColor: '#0E57CF', 
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center'
        //marginTop: -2
    },
    iconStyle: {
        position: 'absolute',
        alignSelf: 'flex-end',
        marginTop: 25,
        marginRight: 0,
        width: 70,
        height: 50,
        borderColor: 'black',
        borderWidth: 0
    },
    dropDown: {
        width: 370,
        marginTop: 20,
        marginHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    titleBackground: {
        fontSize: 16, 
        fontWeight: 'bold', 
        alignSelf: 'center', 
        marginBottom: 10,
    },
    titleContainer: {
        backgroundColor: 'white', 
        borderRadius: 5, 
        alignSelf: 'center', 
        borderWidth: 1, 
        borderColor: '#E72828' 
    },
    loadingStyle: {
        shadowOffset: null, 
        shadowColor: 'black', 
        shadowOpacity: null, 
        shadowRadius: 10, 
        elevation: 5,
        backgroundColor: 'white',
        height: 60,
        borderRadius:5
    },
    boldFont: {
        ...Platform.select({
            android: {
                fontFamily: ''
            }
        })
    }
};

export default connect(null, { selectDrawerItem })(SalarySlip);
