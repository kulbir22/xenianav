import moment from 'moment';
import React from 'react';
import {
    Dimensions, FlatList, Alert,
    ActivityIndicator, Image, StyleSheet, Text, Platform,
    TouchableOpacity, View, ScrollView, Animated, PlatformColor
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import { extractBaseURL } from '../api/BaseURL';
import { 
    CommonModal, IOS_StatusBar, WaveHeader, getWidthnHeight, statusBarGradient, AnimateDateLabel,
    fontSizeH4, getMarginTop, Spinner, getMarginLeft, getMarginVertical, getMarginBottom
} from '../KulbirComponents/common';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const colorTitle = '#0B8EE8';
const inColor = '#64E291';
const outColor = '#FB3569';
  
const todays = `${moment().year()}-${moment().month() + 1}-${moment().date()}`;

export default class monthlyreport extends React.Component {
    constructor(props) {
        let year = `${moment().year()}`;
        let month = `${moment().month() + 1}`;
        month = (month < 10)? `0${month}` : month;
        let initialDate = '1';
        initialDate = (initialDate < 10)? `0${initialDate}` : initialDate;
        let currentDate = `${year}-${month}-${initialDate}`;
        console.log("!!@@@ DATE: ", currentDate)
        currentDate = moment(currentDate, "YYYY-MM-DD").subtract(1, 'month').format("YYYY-MM-DD");
        const currentYear = moment(currentDate, "YYYY-MM-DD").format("YYYY");
        // if(year !== currentYear){
        //     currentDate = `${year}-${month}-${initialDate}`
        //     console.log("***&&& DATE2: ", currentDate, year, currentYear)
        // }
        const currentTime = "12:00 AM";
        const currentDateTime = `${currentDate} ${currentTime}`;
        const utcTimeStamp = moment(currentDateTime, "YYYY-MM-DD hh:mm A").utc().toDate();
        super(props)
        this.state = {
            fromDate: moment().format("YYYY-MM-DD"),
            fromDateError: false,
            fromTimeStamp: moment().valueOf(),
            fromTime: '12:00 AM',
            fromMinDate: utcTimeStamp,
            showFromDatePicker: false,
            date:todays,
            user_id:'',
            loading: false,
            monthly:'',
            name:'',
            data:[],
            counter_data:'',
            pic_name_data:'',
            s_date:'',
            activeSwitch: [],
            data_sec:'',
            type:null,
            data_self:'',
            baseURL: null,
            errorCode: null,
            apiCode: null,
            commonModal: false,
            animateDate: new Animated.Value(0),
            showDate: true
        };
        this.props.navigation.setOptions({
            title: 'Team Attendance'
        })
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

    componentDidMount(){
        this.animateDateFunction();
        this.team();
    }

    animateDateFunction(show = true){
        const { animateDate } = this.state;
        Animated.timing(animateDate, {
            toValue: (show)? 1 : 0,
            duration: 300
        }).start(({finished}) => {
            if(finished){
                this.setState({showDate: show});
            }
        })
    }

    async extractLink(){
        await extractBaseURL().then((baseURL) => {
            this.setState({baseURL}, () => console.log("EXTRACT LINK: ", this.state.baseURL))
        })
    }

    view_sec=()=>{
        const a="jarwal";
        console.log(a)
    }

    team_one=()=>{
        const a="team";
        this.setState({type:a})
    }

    self_one=()=>{
        const a="self";
        this.setState({type:a})
    }

    team = async () => {
        await this.extractLink();
        const { baseURL, fromDate, type } = this.state;
        this.showLoader();
        const userObj= await AsyncStorage.getItem('userObj');
        const parsedData = JSON.parse(userObj);
        const secretToken = parsedData.success.secret_token;
        console.log("@@@ SECRET TOKEN: ", secretToken)
        axios.post(`${baseURL}/attendance-detail`, {
            "on_date": fromDate,
            "attendance_type": "team"
        },
        {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${secretToken}`
            }
        }).then((response) => {
            this.hideLoader();
            const c = response.data.success.employees;
            const d = response.data.success.attendance_data;
            console.log("@@@ DATA: ", response)
            this.setState({data:c, data_self: d});
            this.animateDateFunction(false);
        }).catch((error) => {
            this.hideLoader();
            if(error.response?.data){
                Alert.alert("*Error", JSON.stringify(error.response.data))
            }else if(error.response?._response){
                Alert.alert("-Error", JSON.stringify(error.response._response))
            }else{
                Alert.alert("Error!", JSON.stringify(error))
            }
        })
    }

    functionCombined() {
        this.team();
    }
    renderHeader(){
        return (
            <WaveHeader
                wave={Platform.OS ==="ios" ? false : false} 
                //logo={require('../Image/Logo-164.png')}
                menu='white'
                title='Team Attendance'
                //version={`Version ${this.state.deviceVersion}`}
            />
        );
    }

    showCalender(){
        const { showDate } = this.state;
        if(showDate){
            this.animateDateFunction(false);
        }else{
            this.animateDateFunction();
        }
    }

    render() {
        const { data, animateDate, loading, fromTimeStamp, fromDate, fromMinDate, fromTime, showFromDatePicker }=this.state;
        //console.log("MAX DATE: ", `${moment().year()}-${moment().month() + 1}-${moment().date()}`)
        // console.log(data)
        const animatedStyle = {
            transform: [
                {
                    translateX: animateDate.interpolate({
                        inputRange: [0, 1],
                        outputRange: [getWidthnHeight(-50).width, getWidthnHeight(-4.5).width]
                    })
                }
            ],
            marginLeft: getMarginLeft(2).marginLeft,
        }
        const currentYear = `${moment().year()}`;
        const currentMonth = `${moment().month() + 1}`;
        let maxDate = moment(`${currentYear}-${currentMonth}`, "YYYY-MM").add(1, 'month').format("YYYY-MM");
        let maxMonth = moment(maxDate, "YYYY-MM").format("MM");
        let maxYear = moment(maxDate, "YYYY-MM").format("YYYY");
        let maxMonthDays = moment(`${maxYear}-${maxMonth}`, "YYYY-MM").daysInMonth();
        const maxCompiledDate = moment(`${maxYear}-${maxMonth}-${maxMonthDays}`, "YYYY-MM-DD").format("YYYY-MM-DD");
        __DEV__ && console.log("@@@^^^ CURRENT & MAX YEAR: ", currentYear, maxYear, maxCompiledDate)
        let fromMaxDate = moment(`${maxCompiledDate} ${fromTime}`, "YYYY-MM-DD hh:mm A").utc().toDate();
        return (
            <View style={{flex: 1, alignItems: 'center'}}>
                <View>
                    <IOS_StatusBar color={statusBarGradient} barStyle="light-content"/>
                </View>
                <View style={{flex: 1, alignItems: 'center'}}>  
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <View style={[{alignItems: 'flex-start', ...Platform.select({ios: {zIndex: 15}})}, getWidthnHeight(100), getMarginBottom(1)]}>
                            <View style={{zIndex: 10, position: 'absolute'}}>
                                <Animated.View style={[{
                                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', 
                                    borderTopRightRadius: getWidthnHeight(10).width, borderBottomRightRadius: getWidthnHeight(10).width
                                    }, styles.dateStyle, getMarginTop(2), getWidthnHeight(60, 9), animatedStyle
                                ]}>
                                    <AnimateDateLabel
                                        containerColor={['#C4C4C4', '#C4C4C4']}
                                        containerBorderWidth={[1 , 1]}
                                        containerStyle={[{
                                            borderRadius: getWidthnHeight(1).width, justifyContent: 'center',
                                            backgroundColor: 'white'
                                        }, getWidthnHeight(40, 6.5), getMarginLeft(4)]}
                                        slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                        slideHorizontal={[0, getWidthnHeight(-15).width]}
                                        style={[{justifyContent: 'center', alignItems: 'center'}, getWidthnHeight(40, 6.5)]}
                                        date={moment(fromTimeStamp).utc().toDate()}
                                        minDate={fromMinDate}
                                        maxDate={fromMaxDate}
                                        showFromDatePicker={showFromDatePicker}
                                        togglePicker={() => this.setState({showFromDatePicker: !showFromDatePicker})}
                                        value={fromDate}
                                        mode="date"
                                        placeholder="Date"
                                        format="YYYY-MM-DD"
                                        onDateChange={(event, newDate) => {
                                            if(event.type === "dismissed"){
                                                this.setState({showFromDatePicker: !showFromDatePicker})
                                                return;
                                            }
                                            this.setState({showFromDatePicker: !showFromDatePicker})
                                            const fromTimeStamp = event.nativeEvent.timestamp;
                                            this.setState({
                                                fromDate: moment(newDate).format("YYYY-MM-DD"), fromTimeStamp,
                                                fromDateError: false,
                                            }, () => this.team());
                                            // this.setState({date: date}, () => this.team())
                                        }}
                                    />
                                    <TouchableOpacity 
                                        style={[{
                                            borderColor: 'black', borderWidth: 0, alignItems: 'center', justifyContent: 'center'
                                        }, getWidthnHeight(10, 8)]} 
                                        onPress={() => {
                                            this.showCalender();
                                        }}
                                    >
                                        <FontAwesome name='angle-double-right' color={colorTitle} size={getWidthnHeight(8).width}/>
                                    </TouchableOpacity>
                                </Animated.View>
                            </View>
                        </View>
                        <Animated.View style={[{flex: 1, zIndex: 5}]}>
                            <FlatList 
                                data={data}
                                keyExtractor={(item) => item.employee_code}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => {
                                    return (
                                        <View style={[{alignItems: 'center'}, getMarginBottom(2)]}>
                                            <LinearGradient 
                                                start={{x: 0, y: 1}} end={{x: 1, y: -1}}
                                                colors={["#292C6D", "#6867AC"]}
                                                style={[{
                                                    alignItems: 'center', justifyContent: 'center', borderRadius: getWidthnHeight(4).width,
                                                    shadowColor: 'black', shadowOpacity: 0.4, shadowRadius: 2, elevation: 3
                                                }, getWidthnHeight(70)]}
                                            >
                                                <View style={{alignItems: 'center', justifyContent: 'space-evenly'}}>
                                                    <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', paddingTop: getMarginTop(1).marginTop}, getWidthnHeight(70)]}>
                                                        <View style={[{alignItems:'center'}]}>
                                                            <Image 
                                                                source={{uri: item.profile_picture}} 
                                                                resizeMode="cover" 
                                                                style={{
                                                                    width: getWidthnHeight(17).width, height: getWidthnHeight(17).width, borderRadius: getWidthnHeight(8.5).width,
                                                                    borderColor: 'white', borderWidth: 2, backgroundColor: 'white'
                                                                }}
                                                            />
                                                        </View>
                                                        <View style={{alignItems: 'center'}}>
                                                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                                {/* <View style={[{backgroundColor: inColor, width: getWidthnHeight(3).width, height: getWidthnHeight(3).width, borderRadius: getWidthnHeight(1.5).width}]}/> */}
                                                                <View style={[{borderColor: 'white', borderWidth: 0}, getWidthnHeight(10)]}>
                                                                    <Text style={[{fontSize: (fontSizeH4().fontSize - 1), color: 'white'}]}>IN:</Text>
                                                                </View>
                                                                <View style={[{backgroundColor: 'white', borderRadius: getWidthnHeight(1).width, alignItems: 'center', justifyContent: 'center'}, getMarginLeft(2), getWidthnHeight(20)]}>
                                                                    <Text style={[{fontSize: (fontSizeH4().fontSize - 1), color: 'black'}]}>{item.attendance_data.first_punch}</Text>
                                                                </View>
                                                            </View>
                                                            <View style={[{flexDirection: 'row', alignItems: 'center'}, getMarginTop(1)]}>
                                                                {/* <View style={[{backgroundColor: outColor, width: getWidthnHeight(3).width, height: getWidthnHeight(3).width, borderRadius: getWidthnHeight(1.5).width}]}/> */}
                                                                <View style={[{borderColor: 'white', borderWidth: 0}, getWidthnHeight(10)]}>
                                                                    <Text style={[{fontSize: (fontSizeH4().fontSize - 1), color: 'white'}]}>OUT:</Text>
                                                                </View>
                                                                <View style={[{backgroundColor: 'white', borderRadius: getWidthnHeight(1).width, alignItems: 'center', justifyContent: 'center'}, getMarginLeft(2), getWidthnHeight(20)]}>
                                                                    <Text style={[{fontSize: (fontSizeH4().fontSize - 1), color: 'white'}]}>{item.attendance_data.last_punch}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <Text style={[{fontSize: (fontSizeH4().fontSize - 1), color: 'white', paddingVertical: getMarginTop(1).marginTop}]}>{item.fullname.toUpperCase()}</Text>
                                                </View>
                                            </LinearGradient>
                                        </View>
                                    );
                                }}
                            />
                        </Animated.View>
                    </View>
                    <View 
                        style={[{
                        backgroundColor: (loading)? 'rgba(0, 0, 0, 0.5)' : 'transparent', alignItems: 'center', justifyContent: 'center', zIndex: 20
                        }, StyleSheet.absoluteFill]} 
                        pointerEvents={(loading)? 'auto' : 'none'}
                    >
                        {(loading) &&
                            <Spinner loading={loading} style={[styles.loadingStyle, getWidthnHeight(45, 10), getMarginLeft(3)]} color='rgb(19,111,232)'/>
                        }
                    </View>
                </View>
            </View>
        )}
    }

const styles = StyleSheet.create({
    dateStyle: {
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOpacity: 0.5,
        elevation: 3,
        ...Platform.select({
            ios: {
                shadowOffset: {
                    width: 0,
                    height: 0
                }
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
        borderWidth: 0,
    }
});
