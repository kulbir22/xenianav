import React, {Component} from 'react';
import {
    StyleSheet, Text, TouchableOpacity, View, Image,
    Dimensions, Alert, ScrollView, Keyboard
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from 'react-native-button';
import LeaveSectionDesign from '../LeaveSectionDesign';
import Dialog, {
    DialogTitle, DialogContent, SlideAnimation 
} from 'react-native-popup-dialog';
import moment from 'moment';
import {extractBaseURL} from '../api/BaseURL';
import {
    CommonModal, IOS_StatusBar, WaveHeader, DateSelector, getWidthnHeight, getMarginTop, 
    getMarginBottom, statusBarGradient, getMarginLeft, Spinner, DateTimePicker, fontSizeH4
} from '../NewComponents/common';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const now = moment();
const timeStamp = now.valueOf();
const EWF = "Elite Workforce";
export default class Leaves extends Component {

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
            fromDateError: false,
            fromTimeStamp: moment().valueOf(),
            fromTime: '12:00 AM',
            fromMinDate: utcTimeStamp,
            showFromDatePicker: false,
            toDate: moment().format("YYYY-MM-DD"),
            toDateError: false,
            toTimeStamp: moment().valueOf(),
            toTime: '11:59 PM',
            toMinDate: utcTimeStamp,
            showToDatePicker: false,
            loading: false,
            token:'',
            final_data:'',
            final_data_sec:'',
            language:'',
            language_sec:'',
            tvf:[],
            tvl:[],
            data:[],
            counter_data:'',
            pic_name_data:'',
            emp_code:'',
            leaves:[],
            message:[],
            msg:[],
            xyz:'',
            slideAnimationDialog: false,
            employee:[],
            sender:[],
            name:'',
            data_found:'1',
            mandatory:'0',
            baseURL: null,
            errorCode: null,
            apiCode: null,
            commonModal: false
        }
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

    async showLeaves(){
        this.showLoader();
        const userObj= await AsyncStorage.getItem('user_token');
        const parsedData = JSON.parse(userObj);
        const secretToken= parsedData.success.secret_token;
        const name = parsedData.success.user.employee.fullname;
        this.setState({name: name}, () => {
            const { baseURL } = this.state;
            const projectName = parsedData.success.project;
            const apiLink = (projectName === EWF)? `${baseURL}/ewf/applied-leaves` : `${baseURL}/applied-leaves`;
            const formData = new FormData();
            formData.append("from_date", this.state.fromDate);
            formData.append("to_date", this.state.toDate);
            __DEV__ && console.log("$$$@@@### API DATA: ", formData, apiLink, projectName)
            axios.post(apiLink, 
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${secretToken}`
                }
            }).then((response) => {
                this.hideLoader();
                if(response.status === 204){
                    Alert.alert("No Records Found");
                    return;
                }
                console.log("()()$$^^### LEAVE RESPONSE: ", response.data)
                const success = response.data?.success;
                const leaves = success?.leaves;
                const message = leaves?.messages;
                this.setState({mandatory:'0', leaves: (leaves)? leaves : []})
            }).catch((error) => {
                this.hideLoader();
                console.log("$$##@@!! ERROR RESPONSE: ", error)
                if(error.response?.data){
                    Alert.alert("Error", JSON.stringify(error.response.data))
                }else if(error.response?._response){
                    Alert.alert("Error", JSON.stringify(error.response._response))
                }
            })
        }) 
    }

    conditional = (t) => {
        if(t=="Approved"){
            return "Approved"
        }
        if(t=="Inprogress"){
            return "In-progress"
        }
        if(t=="Rejected"){
            return "Rejected"
        }
        if(t=="Cancelled"){
            return "Cancelled"
        }
    }

    conditional_next=(t)=>{
        if(t=="Approved"){
            return "Approved"
        }
        if(t=="Inprogress"){
            return "Inprogress"
        }
        if(t=="Rejected"){
            return "Rejected"
        }
        if(t=="Cancelled"){
            return "Cancelled"
        }
    }

    detailPage=async()=>{
        const {leaves,message,msg,xyz, baseURL}= this.state;
        console.log("xyz detailPage",xyz, baseURL)
        const context=this;
        const _this = this;
        this.showLoader();
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_four=permissions_fir.success.secret_token;
        var data = new FormData();
        data.append("applied_leave_id", this.state.xyz);
        data.append("leave_approval_id", "0");

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function() {
            if(this.readyState !== 4) {
                return;
            }
            if(this.status === 200){
                _this.hideLoader();
                var adf = JSON.parse(xhr.responseText);
                var xyz = adf.success.leave_detail.id;
                console.log("xyz",xyz);
                //  context.props.navigation.navigate("AppliedLeaveDetailPage",{data:xhr.responseText});
                //  context.props.navigation.navigate("AppliedLeaveDetailPage",{xyz:xyz});
                AppliedLeaveDetailPage({data: xhr.responseText, xyz: xyz, employer: _this.props.employer})
            } else {
                _this.hideLoader();
                //_this.enableModal(xhr.status, "012");
            }
          });

        xhr.open("POST", `${baseURL}/leave-detail`);
        xhr.setRequestHeader("Authorization", "Bearer " + permissions_four);
        xhr.setRequestHeader("Content-Type", "multipart/form-data");
        xhr.send(data);
    }

    async componentDidMount(){
        await extractBaseURL().then((baseURL) => {
            this.setState({baseURL}, () => {
                this.showLeaves();
            })
        })
    }

    search(){
        this.showLeaves();
    }
 
    render (){
        const { 
            leaves, errorCode, apiCode, loading, showFromDatePicker, fromDate, fromMinDate, 
            fromTimeStamp, fromTime, showToDatePicker, toDate, toTimeStamp, toTime, fromDateError
        } = this.state;
        const context=this;
        
        let searchButton = {backgroundColor: 'rgb(19,111,232)'}
        let gradient = ['#039FFD', '#EA304F'];
        let borderColor = {borderColor: 'rgb(19,111,232)'}
        
        //console.log("YEAR / MONTH: ", typeof moment().month(), ", " , moment().year(), moment().daysInMonth())
        let toMinDate = moment(`${fromDate} ${fromTime}`, "YYYY-MM-DD hh:mm A").utc().toDate();
        const currentYear = `${moment().year()}`;
        const currentMonth = `${moment().month() + 1}`;
        let maxDate = moment(`${currentYear}-${currentMonth}`, "YYYY-MM").add(1, 'month').format("YYYY-MM");
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
        let toMaxDate = moment(`${maxCompiledDate} ${toTime}`, "YYYY-MM-DD hh:mm A").utc().toDate();
        return(
            <View>
                <IOS_StatusBar color={gradient} barStyle="light-content"/>
                <View>
                    <View style={[{height:'100%',top:'0%',backgroundColor:'white'}, getMarginTop(0)]}>
                        <View style={{alignItems:'center',}}>
                            <LeaveSectionDesign/>
                        </View>
                        <View style={[{alignItems: 'center'}, getWidthnHeight(100), getMarginBottom(2)]}>
                            <View style={[styles.date_component, getWidthnHeight(90, 12)]}>
                                <Text style={{backgroundColor:'white',color:'rgb(19,111,232)'}}>    Search for Particular Date    </Text>
                                <View 
                                    style={[{
                                        flexDirection:'row',borderColor: 'black', borderWidth: 0, justifyContent: 'space-evenly', alignItems: 'center'
                                        }, getWidthnHeight(90), getMarginTop(1)
                                    ]}
                                >

                                    <View style={[{flexDirection:'row', justifyContent: 'space-evenly', alignItems: 'center'}, getWidthnHeight(75)]}>
                                        <View style={[{borderColor: 'red', borderWidth: 0}, getWidthnHeight(35, 6)]}>
                                            <TouchableOpacity 
                                                onPress={() => this.setState({showFromDatePicker: !showFromDatePicker})}
                                            >
                                                <View 
                                                    style={[{
                                                        alignItems: 'center', justifyContent: 'center', borderRadius: 5, 
                                                        borderColor: '#C4C4C4', borderWidth: 1
                                                    }, getWidthnHeight(35, 6)]}>
                                                    <Text style={[{color: '#000000', fontSize: (fontSizeH4().fontSize + 2)}]}>{fromDate || 'Select Date'}</Text>
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
                                                        const { toTimeStamp } = this.state;
                                                        const fromTimeStamp = event.nativeEvent.timestamp;
                                                        //console.log('From Date: ', fromTimeStamp, ">", toTimeStamp, "=", fromTimeStamp > toTimeStamp)
                                                        if(toTimeStamp){
                                                            if(fromTimeStamp > toTimeStamp){
                                                                this.setState({
                                                                    toDate: moment(newDate).format("YYYY-MM-DD"), toDateError: false, 
                                                                    toTimeStamp: fromTimeStamp, showToDatePicker: false
                                                                }, () => {});
                                                            }
                                                        }
                                                        this.setState({
                                                            fromDate: moment(newDate).format("YYYY-MM-DD"), fromTimeStamp,
                                                            showToDatePicker: false, fromDateError: false,
                                                        }, () => {});
                                                        Keyboard.dismiss();
                                                    }} 
                                                />
                                            )}
                                            <View style={styles.forDate}>
                                                <Text style={[{fontSize: (fontSizeH4().fontSize - 4), color: '#1363DF', fontWeight: 'bold', textAlign: 'center'}, styles.boldFont]}>From Date</Text>
                                            </View>
                                        </View> 
                                        <View style={[getWidthnHeight(35, 6)]}>
                                            <TouchableOpacity 
                                                onPress={() => this.setState({showToDatePicker: !showToDatePicker})}
                                            >
                                                <View 
                                                    style={[{
                                                        alignItems: 'center', justifyContent: 'center', borderRadius: 5, borderColor: '#C4C4C4', 
                                                        borderWidth: 1
                                                    }, getWidthnHeight(35, 6)]}>
                                                    <Text style={[{color: '#000000', fontSize: (fontSizeH4().fontSize + 2)}]}>{toDate || 'Select Date'}</Text>
                                                </View>
                                            </TouchableOpacity>
                                            {(showToDatePicker) && (
                                                <DateTimePicker 
                                                    styleBox={{flex: 1}}
                                                    date={moment(toTimeStamp).utc().toDate()}
                                                    disabled={(fromDateError)? true : false}
                                                    androidMode='default'
                                                    mode='date'
                                                    is24Hour={false}
                                                    placeholder='Select Date'
                                                    format='YYYY-MM-DD'
                                                    minDate={toMinDate}
                                                    maxDate={toMaxDate}
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
                                                        }, () => {});
                                                    }} 
                                                />
                                            )}
                                            <View style={styles.forDate}>
                                                <Text style={[{fontSize: (fontSizeH4().fontSize - 4), color: '#1363DF', fontWeight: 'bold', textAlign: 'center'}, styles.boldFont]}>To Date</Text>
                                            </View>
                                        </View>
                                    </View>
                                
                                    <TouchableOpacity  onPress={()=>this.search()}>
                                      <Image
                                        source={require('../Image/search.png')}
                                        style={{ width: getWidthnHeight(10).width, height: getWidthnHeight(10).width }}
                                      />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
            
                        <View style={styles.pagecomponent_thrd}>
                          <ScrollView style={{width:'100%'}}>
                          {this.state.mandatory == 0 ?
                          <View>
                          {leaves.map((item) => {
                          return (
                            
                              <View>
                              
                                    <View style={{flexDirection:'row',margin:20,marginTop:'3%',marginLeft:'3%',backgroundColor:'transparent'}}>
                                    
                                    <View style={[
                                      (this.conditional_next(item.secondary_final_status)=="Approved")?styles.Approved:styles.sc,
                                      (this.conditional_next(item.secondary_final_status)=="Inprogress")?styles.Approved_sec:styles.sc,
                                      (this.conditional_next(item.secondary_final_status)=="Rejected")?styles.Approved_thrd:styles.sc,
                                      (this.conditional_next(item.secondary_final_status)=="Cancelled")?styles.Approved_frth:styles.sc,
                                      ]}>
                                    <TouchableOpacity onPress={()=>this.setState({xyz:item.id})}>
                                    <Text style={{margin:5,fontSize:12}}> From: {item.from_date}     To:  {item.to_date}</Text>
                                    <Text style={{margin:5,fontSize:12}}> Leave Type  :  {item.leave_type.name}</Text>
                                    <Text style={{margin:5,fontSize:12}}> Applied At  :  {item.created_at}</Text>  
                                    <Text style={{margin:5,fontSize:12}}> No. of days  :  {item.number_of_days}</Text>
                                    </TouchableOpacity>
                                    </View>

                                    <View style={{top:'9%',left:'10%'}}>
                                    <TouchableOpacity onPress={() => {
                                      this.setState({
                                        slideAnimationDialog: true,
                                      });
                                    }} >
                                    <Text style={[
                                      (this.conditional(item.secondary_final_status)=="Approved")?styles.Approved_first:styles.Approved.Deflt,
                                      (this.conditional(item.secondary_final_status)=="In-progress")?styles.In_Progress:styles.Approved.Deflt,
                                      (this.conditional(item.secondary_final_status)=="Rejected")?styles.rejected:styles.Approved.Deflt,
                                      (this.conditional(item.secondary_final_status)=="Cancelled")?styles.cancelled:styles.Approved.Deflt,
                                    ]}>   {item.secondary_final_status.substring(0,1)}</Text>
                                    </TouchableOpacity>
                                    </View>
                                  
                                    </View>
                                  
                                  </View>
                                )
                        })}
                    </View>
                    :
                    <View style={{flexDirection:'row',justifyContent:'center',top:'0%'}}>
                      <Text style={{color:'gray',fontSize:20}}>No data </Text>
                    </View>
                    
                    }
                          </ScrollView>
                        </View>
                    </View>
                    <View 
                        style={[{
                          backgroundColor: (loading)? 'rgba(0, 0, 0, 0.5)' : 'transparent', alignItems: 'center', justifyContent: 'center'
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
        );
    }
}

const styles = StyleSheet.create({
    Approved_first: { 
        left:'0%',backgroundColor:'#78b341',borderRadius:25,height:50,width:50,
        color:'white',fontSize:25,paddingTop:5,paddingLeft:2,overflow: "hidden"
    },
    In_Progress: { 
        left:'0%',backgroundColor:'#cc6600',borderRadius:25,height:50,width:50,
        color:'white',fontSize:25,paddingTop:5,paddingLeft:2,overflow: "hidden"
    },
    rejected:{ 
        left:'0%',backgroundColor:'#c11418',borderRadius:25,height:50,width:50,
        color:'white',fontSize:25,paddingTop:5,paddingLeft:2,overflow: "hidden"
    },
    cancelled: { 
        left:'0%',backgroundColor:'#adadad',borderRadius:25,height:50,width:50,
        color:'white',fontSize:25,paddingTop:5,paddingLeft:2,overflow: "hidden"
    },
    Approved_Deflt:{
        backgroundColor:'black',borderRadius:12,height:50,width:50,color:'white'
    },
    Approved:{
        width:'75%',
        backgroundColor:'transparent',
        borderRadius: 10,
        borderTopWidth: 1.5,
        borderBottomWidth:1.5,
        borderRightWidth:1.5,
        borderLeftWidth:5.5,
        borderColor: '#78b341',
    },
    Approved_sec:{
        width:'75%',
        backgroundColor:'transparent',
        borderRadius: 10,
        borderTopWidth: 1.5,
        borderBottomWidth:1.5,
        borderRightWidth:1.5,
        borderLeftWidth:5.5,
        borderColor: '#cc6600',
    },
    Approved_thrd:{
        width:'75%',
        backgroundColor:'transparent',
        borderRadius: 10,
        borderTopWidth: 1.5,
        borderBottomWidth:1.5,
        borderRightWidth:1.5,
        borderLeftWidth:5.5,
        borderColor: '#c11418',
    },
    Approved_frth:{
        width:'75%',
        backgroundColor:'transparent',
        borderRadius: 10,
        borderTopWidth: 1.5,
        borderBottomWidth:1.5,
        borderRightWidth:1.5,
        borderLeftWidth:5.5,
        borderColor: '#adadad',
        overflow: "hidden"
    },
    pagecomponent_sec: {
        flexDirection:'row',
        flex:0,
        bottom:'5%',
        marginTop:0,
        marginLeft:15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'transparent',
        borderRadius: 10,
        borderTopWidth: 1.5,
        borderBottomWidth:1.5,
        borderRightWidth:1.5,
        borderLeftWidth:1.5,
        borderColor: 'transparent',
        width:viewportWidth/1.1,
        height: '10%',
        // shadowOffset:{  width: 100,  height: 100,  },
        shadowColor: '#330000',
        shadowOpacity: 0,
        // shadowRadius: 0,
        elevation: 5,
    },
    pagecomponent_thrd: {
        flex:0.7,
        bottom:2,
        marginTop:0,
        marginLeft:5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'transparent',
        // borderRadius: 10,
        // borderTopWidth: 1.5,
        // borderBottomWidth:1.5,
        // borderRightWidth:1.5,
        // borderLeftWidth:1.5,
        borderColor: 'transparent',
        width:viewportWidth/1.03,
        // shadowOffset:{  width: 100,  height: 100,  },
        shadowColor: 'transparent',
        shadowOpacity: 0,
        // shadowRadius: 0,
        elevation: 0,
    },
    date_component: {
        flexDirection:'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor:'transparent',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgb(19,111,232)',
        // shadowOffset:{  width: 100,  height: 100,  },
        shadowColor: '#330000',
        shadowOpacity: 0,
        // shadowRadius: 0,
        elevation: 0,
    },
    card_view: {
        marginBottom:0,
        top:'0.8%',
        left:'30%',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomEndRadius: 0,
        backgroundColor:'#3280e4',
        width:'40%',
        height: '4.9%',
        // shadowOffset:{  width: 100,  height: 100,  },
        // shadowColor: '#330000',
        shadowOpacity: 0,
        // shadowRadius: 0,
    },
    button: {
        width:'20%',
        color: '#DCE4EF',
        marginLeft:0,
        marginBottom: 0,
        paddingTop:0,
        paddingBottom:0,
        paddingLeft:0,
        paddingRight:0,
        backgroundColor:'rgb(19,111,232)',
        borderRadius:10,
        borderWidth: 1,
        borderColor: 'transparent',
        elevation: 0,
    },
    scroll: {
        margin:5,
        width:'70%',
        backgroundColor:'transparent',
        borderRadius: 10,
        borderTopWidth: 1.5,
        borderBottomWidth:1.5,
        borderRightWidth:1.5,
        borderLeftWidth:1.5,
        borderColor: 'green',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
        borderWidth: 0,
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
});
