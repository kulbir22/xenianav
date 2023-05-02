import React, {Component} from 'react';
import {
  StyleSheet,
  Text, KeyboardAvoidingView, TouchableOpacity,
  View, Image, Dimensions, Alert, ScrollView, Keyboard,
  TextInput, Platform, ActivityIndicator, Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchableDropdown from 'react-native-searchable-dropdown';
import DocumentPicker from 'react-native-document-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { Dropdown } from 'react-native-material-dropdown';
import {extractBaseURL, login} from '../../api/BaseURL';
import {
    CommonModal, IOS_StatusBar, WaveHeader, getWidthnHeight, TimePicker, Spinner, getMarginTop, getMarginLeft, fontSizeH4,
    fontSizeH3, AnimatedTextInput, getMarginHorizontal, RadioEnable, RadioDisable, getMarginBottom, DateTimePicker
} from '../../KulbirComponents/common';

const colorTitle = '#039FFD';

    class ApplyLeave extends Component {
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
            const currentYear = moment(currentDate, "YYYY-MM-DD").format("YYYY");
            if(year !== currentYear){
                currentDate = `${year}-${month}-${initialDate}`
                console.log("***&&& DATE2: ", currentDate, year, currentYear)
            }
            const currentTime = "12:00 AM";
            const currentDateTime = `${currentDate} ${currentTime}`;
            const utcTimeStamp = moment(currentDateTime, "YYYY-MM-DD hh:mm A").utc().toDate();
            this.state = {
                fromDate: moment().format("YYYY-MM-DD"),
                fromTimeStamp: moment().valueOf(),
                fromTime: '12:00 AM',
                fromMinDate: utcTimeStamp,
                showFromDatePicker: false,
                toDate: moment().format("YYYY-MM-DD"),
                toTimeStamp: moment().valueOf(),
                toTime: '11:59 PM',
                toMinDate: utcTimeStamp,
                showToDatePicker: false,
                singleFileOBJ: '',
                loading: false,
                leave_types:[],
                leaveID:'1',
                leaveName: '',
                countryID: 1,
                countryCode: "91",
                states_Value:null,
                stateName: '',
                cities_Value:null,
                cityName: '',
                departments_Value:null,
                departmentName: '',
                employees_Value:null,
                employeeName: '',
                from_time:'',
                to_time:'',
                number_of_days:'',
                countries:[],
                states:[],
                cities:[],
                departments:[],
                employees:[],
                value:'',
                value_sec:'',
                value_thrd: '',
                replacement_id:'',
                excluded_dates:'',
                included_dates:'',
                fileInput:'',
                types1: [{label: 'First Half', value: 0}, {label: 'Second Half', value: 1}],
                value1: 0,
                value1Index: 0,
                value1_1: 0,
                value1_1Index: 0,
                types2: [{label: 'First Half', value: 0}, {label: 'Second Half', value: 1},],
                value2: 0,
                value2Index: 0,
                types3: [{label: 'First Half', value: 0}, {label: 'Second Half', value: 1},],
                value3: 0,
                value3Index: 0,
                show: false,
                show_sec: true,
                leaveType: 1,
                button_value: 1,
                num: 200,
                leave_data:'',
                mandatory:'0',
                depart:'',
                typeleave:'',
                countryName: 'India',
                visit_location_a:'',
                visit_location_b:'',
                visit_location_c:'',
                replacement_person_a:'',
                replacement_person_b:'',
                business_type:'1',
                leave_half: 1,
                baseURL: null,
                errorCode: null,
                apiCode: null,
                commonModal: false,
                setDate: moment().valueOf(),
                showTimer: false,
                scrollHeight: undefined,
                visibleHeight: null,
                countryError: false,
                stateError: true,
                cityError: true,
                mobileError: true,
                departmentError: true,
                empNameError: true,
                reasonError: true,
                handoverError: true,
                shortTimingsError: true,
                fullError: function(){
                    return (
                        this.countryError === false && this.stateError === false && this.cityError === false && 
                        this.mobileError === false && this.departmentError === false && this.empNameError === false && 
                        this.reasonError === false && this.handoverError === false && this.checkBox === true
                    )
                },
                halfError: function(){
                    return (
                        this.countryError === false && this.stateError === false && this.cityError === false && 
                        this.mobileError === false && this.departmentError === false && this.empNameError === false && 
                        this.reasonError === false && this.checkBox === true
                    )
                },
                shortError: function(){
                    return (
                        this.countryError === false && this.stateError === false && this.cityError === false && 
                        this.mobileError === false && this.departmentError === false && this.empNameError === false &&
                        this.reasonError === false && this.shortTimingsError === false && this.checkBox === true
                    )
                },
                buttonPressed: false,
                timePicker: false,
                animateTimings: new Animated.Value(0),
                checkBox: false,
                maxDateLimit: '',
                fromDateError: false,
                toDateError: false,
                leaveBalance: ''
            }
        }

    onDecline(){
        this.setState({commonModal: false})
    }

    hideLoader = () => {
        this.setState({ loading: false });
    }

    showLoader = () => {
        this.setState({ loading: true });
    }

    componentDidMount(){
        this.initialize();
    }

    async initialize(){
        await this.extractLink();
        this.ShowHideComponent_half();
    }

    async extractLink(){
        await extractBaseURL().then((baseURL) => {
            this.setState({baseURL}, () => console.log("EXTRACT LINK: ", this.state.baseURL))
        })
    }

    between_leave_holidays=async()=>{
        const { baseURL } = this.state;
        const context=this;
        const _this = this;
        const leaveType = (this.state.leaveType === 1)? 'Half' : 'Full';
        this.showLoader();
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_four=permissions_fir.success.secret_token;
        var data = new FormData();
        console.log(this.state.fromDate)
        data.append("from_date", this.state.fromDate);
        data.append("to_date", this.state.toDate);
        data.append("secondary_leave_type", leaveType );
        data.append("user_id", permissions_fir.success.user.id);

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function() {
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status === 200) {
                // console.log(this.responseText);
                _this.hideLoader();
                console.log(this.responseText);
                var json_obj = JSON.parse(xhr.responseText);
                var number_of_days = json_obj.success.number_of_days;
                var excluded_dates = json_obj.success.excluded_dates;
                var included_dates = json_obj.success.included_dates;
                const leaveBalance = json_obj.success.leave_balance;
                console.log(number_of_days)
                context.setState({number_of_days:number_of_days, leaveBalance})
                context.setState({excluded_dates:excluded_dates})
                context.setState({included_dates:included_dates})
            }
            else{
                _this.hideLoader();
                Alert.alert(`Error Code: ${xhr.status}015`, xhr.responseText);
            }
        });
        xhr.open("POST", `${baseURL}/ewf/between-leave-holidays`);
        xhr.setRequestHeader("Authorization", "Bearer " + permissions_four);
        xhr.setRequestHeader("Content-Type", "multipart/form-data");

        xhr.send(data);
    }

    apply_leave_post=async()=>{
        const {baseURL, employees_Value, singleFileOBJ, checkBox} = this.state;
        const context=this;
        const _this = this;
        this.showLoader();
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_four=permissions_fir.success.secret_token;
        var fileInput= "";
        // console.log("##$$@@%%", this.state.toDate)
        // console.log("##$$@@%%", this.state.fromDate)
        // console.log("##$$@@%%", this.state.value_thrd)
        // console.log("##$$@@%%", this.state.value_sec)
        // console.log("##$$@@%%", this.state.number_of_days)
        // console.log("##$$@@%%", this.state.leaveType)
        // console.log("##$$@@%%", this.state.leave_half)
        // console.log("##$$@@%%", this.state.to_time)
        // console.log("##$$@@%%", this.state.countries_Value)
        // console.log("##$$@@%%", this.state.states_Value)
        // console.log("##$$@@%%", this.state.cities_Value)
        // console.log("##$$@@%%", this.state.value)
        // console.log("##$$@@%%", this.state.excluded_dates)
        // console.log("##$$@@%%", this.state.included_dates)
        var data = new FormData();
        data.append("to_date", this.state.toDate);
        data.append("from_date", this.state.fromDate);
        data.append("reason", this.state.value_thrd);
        data.append("number_of_days", this.state.number_of_days);
        data.append("leave_type", this.state.leaveType);
        data.append("leave_duration", this.state.leave_half);
        data.append("excluded_dates", this.state.excluded_dates);
        data.append("included_dates", this.state.included_dates);
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", async function() {
            if(xhr.readyState !== 4) {
            return;
            }
            if(this.status === 200) {
                _this.hideLoader();
                _this.setToDefault();
                console.log("@@@ ### $$$ ", this.responseText);
                const parsedData = JSON.parse(this.responseText);
                Alert.alert(parsedData.status.replace(/^\w/, (c) => c.toUpperCase()), parsedData.message);
            }else if(this.status === 400){
                _this.hideLoader();
                _this.setToDefault();
                const parsedData = JSON.parse(this.responseText);
                Alert.alert(parsedData.status.replace(/^\w/, (c) => c.toUpperCase()), parsedData.message)
            }else if(this.status === 403){
                _this.hideLoader();
                const parsedData = JSON.parse(this.responseText);
                const validationError = parsedData.validation_error;
                const missingList = Object.keys(validationError);
                let singleLine = '';
                missingList.forEach((text, index) => {
                    singleLine += `${index + 1}. ${validationError[text]} ${((missingList.length - 1) !== index) ? "\n" : ""}`
                })
                Alert.alert(parsedData.status.replace(/^\w/, (c) => c.toUpperCase()), singleLine);
            }else {
                _this.hideLoader();
                await _this.setToDefault();
                Alert.alert(`Error Code: ${xhr.status}018`, xhr.responseText)
            }
        });

        xhr.open("POST", `${baseURL}/ewf/apply-leave`);
        xhr.setRequestHeader("Authorization", "Bearer " + permissions_four);
        xhr.setRequestHeader("Content-Type", "multipart/form-data");

        xhr.send(data);
    }

    setToDefault(){
        this.setState({
            from_time: null, to_time: null, value: '', value_sec: '', value_thrd: '', leaveID: '1', leaveName: 'Casual Leave',
            departmentName: '', employeeName: '', employees_Value: null, departments_Value: null, checkBox: false,
            states_Value: null, stateName: '', cities_Value: null, cityName: '', singleFileOBJ: ''
        })
    }

    ShowHideComponent_half = () => {
        Keyboard.dismiss();
        this.setState({ 
            show: false , show_sec: true, leaveType: 1, value_sec:'', button_value:1, number_of_days: '', leave_half: 1, 
            handoverError: true, fromDate: moment().format("YYYY-MM-DD"), toDate: moment().format("YYYY-MM-DD") 
        }, async() => {
            this.between_leave_holidays();
        });
    };

    ShowHideComponent_full = () => {
        Keyboard.dismiss();
        this.setState({ 
            show: false , show_sec: false, leaveType: 0, button_value:2, number_of_days: '', leave_half: 0, value_sec:'',
            fromDate: moment().format("YYYY-MM-DD"), toDate: moment().format("YYYY-MM-DD") 
        }, () => this.between_leave_holidays());
        if (this.state.show == true) {
            this.setState({ show: false });
        }
        if (this.state.show_sec == true) {
            this.setState({ show_sec: false });
        }
    };
 
    first_half = () => {
        this.setState({leave_half: 1});
        this.setState({business_type:1});
    };

    second_half = () => {
        this.setState({leave_half: 2});
        this.setState({business_type:2});
    };

    async confirmEntries(){
        const {reasonError} = this.state;
        this.setState({buttonPressed: true})
        if(this.state.leaveType === 1){
            if(!reasonError){
                //alert("HALF LEAVE");
                this.apply_for_leave_button();
            }else{
                Alert.alert("Please fill the fields highlighted in RED");
                console.log("^^^%%%***@@@ Half Error")
            }
        }else if(this.state.leaveType === 0){
            if(!reasonError){
                //alert("FULL LEAVE");
                this.apply_for_leave_button();
            }else{
                Alert.alert("Please fill the fields highlighted in RED")
                console.log("^^^%%%***@@@ Full Error")
            }
        }
    }

    async apply_for_leave_button(){
        await this.apply_leave_post();
        this.resetError();
    }

    resetError(){
        this.setState({
            stateError: true, cityError: true, mobileError: true, departmentError: true, empNameError: true,
            reasonError: true, shortTimingsError: true, handoverError: true, buttonPressed: false
        })
    }

    renderScreenHeader(){
        return (
        <WaveHeader
            wave={Platform.OS ==="ios" ? false : false} 
            //logo={require('../Image/Logo-164.png')}
            menu='white'
            title='Apply Leave'
            //version={`Version ${this.state.deviceVersion}`}
        />
        );
    }

    showTimePicker(){
        this.setState({showTimer: true})
    }

    animateTimingsFunction(){
        const {animateTimings} = this.state;
        Animated.timing(animateTimings, {
            toValue: 1,
            duration: 500
        }).start();
    }

    async SingleFilePicker() {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            this.setState({ singleFileOBJ: res }, () => Keyboard.dismiss());
        }catch (err) {
            Keyboard.dismiss();
            if (DocumentPicker.isCancel(err)) {
                Alert.alert('Canceled');
            } else {
                Alert.alert('Unknown Error: ' + JSON.stringify(err));
                console.log(JSON.stringify(err))
                throw err;
            }
        }
    }

    render (){
        const {
            leave_data,number_of_days,employees,employeeName,button_value,departmentName, errorCode, apiCode,
            stateError, cityError, mobileError, departmentError, empNameError, reasonError, buttonPressed,
            leaveBalance, handoverError, loading, animateTimings, checkBox, stateName, cityName, maxDateLimit, 
            fromDateError, toDateError, countryName, countryID, countryError, countryCode, showFromDatePicker, 
            fromDate, fromMinDate, fromTimeStamp, fromTime, showToDatePicker, toDate, toTimeStamp, toTime
        } = this.state;

        let toMinDate = moment(`${fromDate} ${fromTime}`, "YYYY-MM-DD hh:mm A").utc().toDate();
        const currentYear = `${moment().year()}`;
        const currentMonth = `${moment().month() + 1}`;
        let maxDate = moment(`${currentYear}-${currentMonth}`, "YYYY-MM").add(1, 'month').format("YYYY-MM");
        let maxMonth = moment(maxDate, "YYYY-MM").format("MM");
        let maxYear = moment(maxDate, "YYYY-MM").format("YYYY");
        let maxMonthDays = moment(`${maxYear}-${maxMonth}`, "YYYY-MM").daysInMonth();
        __DEV__ && console.log("###^^^ MAX DATE1: ", maxDate, maxYear, "-", maxMonth, "-", maxMonthDays)
        if(currentYear !== maxYear){
            __DEV__ && console.log("***&&&^^^ UNEQUAL YEARS: ", typeof currentYear, currentYear, typeof maxYear, maxYear);
            maxDate = moment(`${currentYear}-${currentMonth}`, "YYYY-MM").format("YYYY-MM");
            maxMonth = moment(maxDate, "YYYY-MM").format("MM");
            maxYear = moment(maxDate, "YYYY-MM").format("YYYY");
            maxMonthDays = moment(`${maxYear}-${maxMonth}`, "YYYY-MM").daysInMonth();
        }
        const maxCompiledDate = moment(`${maxYear}-${maxMonth}-${maxMonthDays}`, "YYYY-MM-DD").format("YYYY-MM-DD");
        __DEV__ && console.log("@@@^^^ CURRENT & MAX YEAR: ", currentYear, maxYear, maxCompiledDate)
        let fromMaxDate = moment(`${maxCompiledDate} ${fromTime}`, "YYYY-MM-DD hh:mm A").utc().toDate();
        let toMaxDate = moment(`${maxCompiledDate} ${toTime}`, "YYYY-MM-DD hh:mm A").utc().toDate();

        let currentDate = `${moment().year()}-${moment().month() + 1}-${moment().date()}`;
        const minAppDate = moment(currentDate, "YYYY-MM-DD").subtract(1, 'M').format("YYYY-MM-DD");
        const maxAppDate = moment(currentDate, "YYYY-MM-DD").add(1, 'M').endOf("month").format("YYYY-MM-DD");
        console.log("### DATE: ", minAppDate, maxAppDate, )
        const totalHeight = getWidthnHeight(undefined, 100)
        const context=this;
        let user = this.props.employer;
        console.log("***EMPLOYER: ", user, number_of_days)
        let gradient = null;
        let borderColor = null;
        let searchButton = null;
        let scrollViewHeight = null;
        searchButton = {backgroundColor: 'rgb(19,111,232)'}
        gradient = ['#039FFD', '#EA304F'];
        borderColor = {borderColor: 'rgb(19,111,232)'}
        //const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 80;
        //console.log("##### MOMENT TIMINGS: ", this.props.fromTime, this.props.toTime, shortTimingsError)
        const animatedStyle = {
            transform: [
                {
                    translateX: animateTimings.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, getWidthnHeight(-4).width]
                    })    
                },
                {
                    translateY: animateTimings.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, getWidthnHeight(undefined, -3).height]
                    })    
                },
                {
                    scale: animateTimings.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0.7]
                    })
                }
            ]
        }
    return(
        <View style={{flex: 1}}>
            <IOS_StatusBar color={gradient} barStyle="light-content"/>
            
            <View style = {{flex: 1}}>
                <View style={{flex: 1, backgroundColor: '#F6F6F6', alignItems: 'center'}}>
                    <View style={[{
                        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: 'white', 
                        marginTop: '5%', shadowColor: '#000000', shadowOpacity: 0.5, shadowRadius: 3, elevation: 5, shadowOffset: {width: 0, height: 0}
                    }, getWidthnHeight(93, 13)]}>
                        {/* <View style={{alignItems: 'center'}}>
                            <View style={[styles.leaveBar, {backgroundColor: '#0960BD'}]}>
                                {(leave_data === '') ? (
                                    <ActivityIndicator size="large" color="white" />
                                )
                                :
                                    <Text style={[{color: '#FFFFFF', fontSize: (fontSizeH3().fontSize - 5)}]}>{leave_data.total_leaves}</Text>
                                }
                            </View>
                            <Text style={[{color: 'grey'}, fontSizeH4()]}>TOTAL</Text>
                        </View> */}
                        <View style={{alignItems: 'center'}}>
                            <View style={[styles.leaveBar, {backgroundColor: '#50CB93'}]}>
                                {(leaveBalance === '') ? (
                                    <ActivityIndicator size="large" color="white" />
                                )
                                :
                                    <Text style={[{color: '#FFFFFF', fontSize: (fontSizeH3().fontSize - 5)}]}>{leaveBalance}</Text>
                                }
                            </View>
                            <Text style={[{color: 'grey'}, fontSizeH4()]}>BALANCE</Text>
                        </View>
                        {/* <View style={{alignItems: 'center'}}>
                            <View style={[styles.leaveBar, {backgroundColor: '#FEA82F'}]}>
                                {(leave_data === '') ? (
                                    <ActivityIndicator size="large" color="white" />
                                )
                                :
                                    <Text style={[{color: '#FFFFFF', fontSize: (fontSizeH3().fontSize - 5)}]}>{leave_data.paid_count}</Text>
                                }
                            </View>
                            <Text style={[{color: 'grey'}, fontSizeH4()]}>PAID</Text>
                        </View> */}
                        {/* <View style={{alignItems: 'center'}}>
                            <View style={[styles.leaveBar, {backgroundColor: '#00BBF0'}]}>
                                {(leave_data === '') ? (
                                    <ActivityIndicator size="large" color="white" />
                                )
                                :
                                    <Text style={[{color: '#FFFFFF', fontSize: (fontSizeH3().fontSize - 5)}]}>{leave_data.unpaid_count}</Text>
                                }
                            </View>
                            <Text style={[{color: 'grey'}, fontSizeH4()]}>UNPAID</Text>
                        </View> */}
                    </View>
                    <View style={[{
                        alignItems: 'center', flex: 1
                    }, getWidthnHeight(93)]}>
                        <KeyboardAvoidingView contentContainerStyle={{flex: 1}} behavior={(Platform.OS === 'ios')? "padding" : null} keyboardVerticalOffset={(Platform.OS === 'ios')? 240 : null}> 
                        <View style={[{
                            flex: 1, alignItems: 'center', backgroundColor:'white', borderWidth: 0, borderColor: 'green', flex: 1, justifyContent: 'space-between', marginTop: '5%',
                            shadowColor: '#000000', shadowOpacity: 0.5, shadowRadius: 3, elevation: 5, shadowOffset: {width: 0, height: 0}
                        }, getMarginBottom(2)]}>
                        <ScrollView keyboardShouldPersistTaps="handled" bounces={false} showsVerticalScrollIndicator={false} persistentScrollbar={true} contentContainerStyle={[{alignItems: 'center', marginBottom: '3%'}]} style={[{ marginTop: '5%'}, getWidthnHeight(93)]} > 
                            <View style={[{flex: 1, alignItems: 'center', backgroundColor: 'white'}]}>
                                <View style={{
                                    flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', width: getWidthnHeight(93).width
                                }}>
                                    {/* <View style={[{alignItems: 'center', borderWidth: 1,borderColor: '#C4C4C4'}, getWidthnHeight(42, 6.5)]}>
                                        <Dropdown
                                            containerStyle={[{textOverflow:'hidden', borderColor: '#C4C4C4', borderWidth: 0}, getWidthnHeight(42), getMarginTop(-1)]}
                                            inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getWidthnHeight(42)]}
                                            //dropdownPosition={-5}
                                            //itemTextStyle={[getMarginTop(-1)]}
                                            //style={[getMarginTop(-1)]}
                                            data={leaveType}
                                            valueExtractor={({id})=> id}
                                            label={"Leave type"}
                                            fontSize={fontSizeH4().fontSize + 2}
                                            labelFontSize={fontSizeH4().fontSize - 3}
                                            labelTextStyle={[getMarginLeft(1.5), getMarginTop(0)]}
                                            baseColor="#039FFD"
                                            //value={this.state.typeleave}
                                            value={leaveType[0]['name']}
                                            labelExtractor={({name})=> name}
                                            // placeholder={'Select leave type'}
                                            onChangeText={(leaveID, index, data) => this.setState({ leaveID, leaveName: data[index]['name'] }, () => Keyboard.dismiss())}
                                        />
                                    </View>  */}
                                    <View style={[styles.leaveSelection, {borderColor: 'red', borderWidth: 0, justifyContent: 'center'}]}>
                                            <TouchableOpacity activeOpacity={0.6} 
                                                style={[{
                                                    alignItems: 'center', justifyContent: 'center'}, button_value === 1 ? styles.button_value_sec :styles.button_value_one 
                                                ]} 
                                                onPress={() => this.ShowHideComponent_half()}
                                            >
                                                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                                    <Text style={[{color: (button_value === 1)? 'white' : 'black'}, fontSizeH4()]}>
                                                        Half
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity activeOpacity={0.6} 
                                                style={[{
                                                    alignItems: 'center', justifyContent: 'center'}, button_value === 2 ? styles.button_value_sec :styles.button_value_one 
                                                ]} 
                                                onPress={() => this.ShowHideComponent_full()}
                                            >
                                                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                                    <Text style={[{color: (button_value === 2)? 'white' : 'black'}, fontSizeH4()]}>
                                                        Full
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                    </View>
                                </View>

                                <TimePicker 
                                    show={this.state.timePicker}
                                    timeDifference={2}
                                    onBackdropPress={() => this.setState({timePicker: false}, () => Keyboard.dismiss())}
                                    onSubmit={(fromTime, toTime) => {
                                        Keyboard.dismiss();
                                        this.animateTimingsFunction();
                                        this.setState({from_time: fromTime, to_time: toTime, shortTimingsError: false});
                                    }}
                                />

                                {/* {(this.state.show && !this.state.show_sec) &&
                                    <View style={[{marginVertical: '5%', borderColor: 'red', borderWidth: 0, alignItems: 'center'}, getWidthnHeight(100)]}>
                                        <View style={[{alignItems: 'center'}, getWidthnHeight(93)]}>
                                        {(!this.state.from_time) ?
                                            <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}, getWidthnHeight(93)]}>
                                                <TouchableOpacity onPress={() => this.setState({timePicker: true}, () => Keyboard.dismiss())} style={[getWidthnHeight(42)]}>
                                                    <View style={[{
                                                        alignItems: 'flex-start',borderRadius: 10, justifyContent: 'center',
                                                        borderColor: (buttonPressed && shortTimingsError) ? 'red' : '#C4C4C4',
                                                        borderWidth: (buttonPressed && shortTimingsError)? 2 : 1, borderRadius: 1,
                                                        borderStyle: (buttonPressed && shortTimingsError)? 'dashed' : 'solid'
                                                    }, getWidthnHeight(42, 6)]}>
                                                        <Text style={[{
                                                            alignItems: 'center', justifyContent: 'center', paddingLeft: 10,
                                                            textAlignVertical: 'center', fontSize: (fontSizeH4().fontSize + 3), textAlign: 'center', 
                                                            color: '#C4C4C4'
                                                        }]}>
                                                            From Time
                                                        </Text>
                                                    </View> 
                                                </TouchableOpacity>  
                                                <View style={[{
                                                    alignItems: 'flex-start',borderRadius: 1, justifyContent: 'center',
                                                    borderColor: (buttonPressed && shortTimingsError) ? 'red' : '#C4C4C4',
                                                    borderWidth: (buttonPressed && shortTimingsError)? 2 : 1, borderRadius: 1,
                                                    borderStyle: (buttonPressed && shortTimingsError)? 'dashed' : 'solid'
                                                }, getWidthnHeight(42, 6)]}>
                                                    <Text style={[{
                                                        alignItems: 'center', justifyContent: 'center', paddingLeft: 10,
                                                        textAlignVertical: 'center', fontSize: (fontSizeH4().fontSize + 3), textAlign: 'center', 
                                                        color: '#C4C4C4'
                                                    }]}>
                                                        To Time
                                                    </Text>
                                                </View>  
                                            </View>             
                                        : 
                                            <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}, getWidthnHeight(93)]}>
                                                <TouchableOpacity onPress={() => this.setState({timePicker: true}, () => Keyboard.dismiss())} style={[getWidthnHeight(42)]}>
                                                    <View style={[{
                                                        alignItems: 'flex-start',borderRadius: 10, justifyContent: 'center',
                                                        borderColor: (buttonPressed && shortTimingsError) ? 'red' : '#C4C4C4',
                                                        borderWidth: 1, borderRadius: 1,
                                                        }, getWidthnHeight(42, 6)]}>
                                                        <Text style={[{
                                                            alignItems: 'center', justifyContent: 'center', paddingLeft: '3%',
                                                            textAlignVertical: 'center', fontSize: (fontSizeH4().fontSize + 3), textAlign: 'center', 
                                                            color: 'black'}]}
                                                        >
                                                            {this.state.from_time}
                                                        </Text>
                                                        <Animated.View style={[{position: 'absolute', marginHorizontal: '5%'}, animatedStyle]}>
                                                            <Text style={[{
                                                                alignItems: 'center', justifyContent: 'center',
                                                                textAlignVertical: 'center', textAlign: 'center', 
                                                                color: '#039FFD', backgroundColor: '#FFFFFF'}, fontSizeH4()]}
                                                            >From Time</Text>
                                                        </Animated.View>
                                                    </View>  
                                                </TouchableOpacity> 
                                                <View style={[{
                                                    alignItems: 'flex-start',borderRadius: 1, justifyContent: 'center',
                                                    borderColor: (buttonPressed && shortTimingsError) ? 'red' : '#C4C4C4',
                                                    borderWidth: 1, borderRadius: 1,
                                                    }, getWidthnHeight(42, 6)]}>
                                                    <Text style={[{
                                                        alignItems: 'center', justifyContent: 'center', paddingLeft: '3%',
                                                        textAlignVertical: 'center', fontSize: (fontSizeH4().fontSize + 3), textAlign: 'center', 
                                                        color: 'black'}]}
                                                    >
                                                        {this.state.to_time}
                                                    </Text>
                                                    <Animated.View style={[{position: 'absolute', marginHorizontal: '6%'}, animatedStyle]}>
                                                        <Text style={[{
                                                            alignItems: 'center', justifyContent: 'center',
                                                            textAlignVertical: 'center', fontSize: (fontSizeH4().fontSize), textAlign: 'center', 
                                                            color: '#039FFD', backgroundColor: '#FFFFFF'}]}
                                                        >To Time</Text>
                                                    </Animated.View>
                                                </View>  
                                            </View>
                                        }
                                        </View>
                                    </View>
                                } */}

                                {(this.state.show_sec && !this.state.show) && (
                                    <View style={[{flexDirection:'row',alignItems:'center',justifyContent: 'center', borderColor: 'black', borderWidth: 0, marginVertical: '5%'}, getWidthnHeight(86)]}>
                                        {this.state.business_type== 1 ?
                                            <RadioEnable 
                                                title="First Half"
                                                containerStyle={{borderWidth: 0, borderColor: 'black', justifyContent: 'center'}}
                                                outerCircle={{width: getWidthnHeight(8).width, height: getWidthnHeight(8).width, borderRadius: getWidthnHeight(8).width}}
                                                innerCircle={{width: getWidthnHeight(4.5).width, height: getWidthnHeight(4.5).width, borderRadius: getWidthnHeight(4.5).width}}
                                                textContainerStyle={[getMarginLeft(2)]}
                                            />
                                            :
                                            <RadioDisable 
                                                title="First Half" 
                                                onPress={() => {
                                                    Keyboard.dismiss();
                                                    context.first_half();
                                                }}
                                                containerStyle={{borderWidth: 0, borderColor: 'black', justifyContent: 'center'}}
                                                outerCircle={{width: getWidthnHeight(8).width, height: getWidthnHeight(8).width, borderRadius: getWidthnHeight(8).width}}
                                                textContainerStyle={[getMarginLeft(2)]}
                                            />
                                        }

                                        {this.state.business_type== 2 ?
                                            <RadioEnable 
                                                title="Second Half"
                                                containerStyle={{borderWidth: 0, borderColor: 'black', justifyContent: 'center'}}
                                                outerCircle={{width: getWidthnHeight(8).width, height: getWidthnHeight(8).width, borderRadius: getWidthnHeight(8).width}}
                                                innerCircle={{width: getWidthnHeight(4.5).width, height: getWidthnHeight(4.5).width, borderRadius: getWidthnHeight(4.5).width}}
                                                textContainerStyle={[getMarginLeft(2)]}
                                            />
                                            :
                                            <RadioDisable 
                                                title="Second Half" 
                                                onPress={() => {
                                                    Keyboard.dismiss();
                                                    context.second_half();
                                                }}
                                                containerStyle={{borderWidth: 0, borderColor: 'black', justifyContent: 'center'}}
                                                outerCircle={{width: getWidthnHeight(8).width, height: getWidthnHeight(8).width, borderRadius: getWidthnHeight(8).width}}
                                                textContainerStyle={[getMarginLeft(2)]}
                                            />
                                        }
                                    </View>
                                )}
                
                                {(this.state.leaveType == 1) &&   
                                    <View style={[{flexDirection:'row', justifyContent: 'space-evenly', alignItems: 'center'}, getWidthnHeight(93)]}>
                                        {/* <View style={{justifyContent: 'center'}}>
                                            <DatePicker
                                                customStyles={{dateInput: {borderWidth: 0}}}
                                                style={[{borderColor: '#C4C4C4', borderWidth: 1, paddingVertical: '2%'}, getWidthnHeight(42, 6)]}
                                                date={this.state.fromDate}
                                                mode="date"
                                                placeholder="From Date"
                                                format="YYYY-MM-DD"
                                                minDate={minAppDate}
                                                maxDate={(maxDateLimit)? maxDateLimit : maxAppDate}
                                                confirmBtnText="Confirm"
                                                cancelBtnText="Cancel"
                                                onDateChange={(date) => {this.setState({fromDate: date, toDate: date}, () => {
                                                    Keyboard.dismiss();
                                                    this.between_leave_holidays();
                                                })}}
                                            />
                                        </View> */}
                                        <View style={[{borderColor: 'red', borderWidth: 0}, getWidthnHeight(42, 6)]}>
                                            <TouchableOpacity 
                                                onPress={() => this.setState({showFromDatePicker: !showFromDatePicker})}
                                            >
                                                <View 
                                                    style={[{
                                                        alignItems: 'center', justifyContent: 'center', borderRadius: 5, 
                                                        borderColor: '#C4C4C4', borderWidth: 1
                                                    }, getWidthnHeight(42, 6)]}>
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
                                                        const fromTimeStamp = event.nativeEvent.timestamp;
                                                        this.setState({
                                                            fromDate: moment(newDate).format("YYYY-MM-DD"), fromTimeStamp,
                                                            showToDatePicker: false, fromDateError: false,
                                                            toDate: moment(newDate).format("YYYY-MM-DD"), toDateError: false, 
                                                            toTimeStamp: fromTimeStamp, showToDatePicker: false
                                                        }, () => this.betweenLeaveHolidays());
                                                        Keyboard.dismiss();
                                                    }} 
                                                />
                                            )}
                                            <View style={styles.forDate}>
                                                <Text style={[{fontSize: (fontSizeH4().fontSize - 4), color: '#1363DF', fontWeight: 'bold', textAlign: 'center'}, styles.boldFont]}>From Date</Text>
                                            </View>
                                        </View> 
                                        <View style={[getWidthnHeight(42, 6)]}>
                                            <TouchableOpacity 
                                                disabled={true} 
                                                onPress={() => this.setState({showToDatePicker: !showToDatePicker})}
                                            >
                                                <View 
                                                    style={[{
                                                        alignItems: 'center', justifyContent: 'center', borderRadius: 5, borderColor: '#C4C4C4', 
                                                        borderWidth: 1
                                                    }, getWidthnHeight(42, 6)]}>
                                                    <Text style={[{color: '#000000', fontSize: (fontSizeH4().fontSize + 2)}]}>{toDate || 'Select Date'}</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <View style={styles.forDate}>
                                                <Text style={[{fontSize: (fontSizeH4().fontSize - 4), color: '#1363DF', fontWeight: 'bold', textAlign: 'center'}, styles.boldFont]}>To Date</Text>
                                            </View>
                                        </View>
                                        {/* <View style={{justifyContent: 'center'}}>
                                            <DatePicker
                                                customStyles={{dateInput: {borderWidth: 0}}}
                                                style={[{borderColor: '#C4C4C4', borderWidth: 1, paddingVertical: '2%'}, getWidthnHeight(42, 6)]}
                                                date={this.state.toDate}
                                                mode="date"
                                                placeholder="To Date"
                                                format="YYYY-MM-DD"
                                                minDate={this.state.fromDate}
                                                maxDate={this.state.fromDate}
                                                confirmBtnText="Confirm"
                                                cancelBtnText="Cancel"
                                                onDateChange={() => Keyboard.dismiss()}
                                            />
                                        </View> */}
                                    </View>
                                }

                                {(this.state.leaveType === 0) &&
                                    <View style={[{flexDirection:'row', justifyContent: 'space-evenly', alignItems: 'center', marginTop: '5%'}, getWidthnHeight(93)]}>
                                        <View style={[{borderColor: 'red', borderWidth: 0}, getWidthnHeight(42, 6)]}>
                                            <TouchableOpacity 
                                                onPress={() => this.setState({showFromDatePicker: !showFromDatePicker})}
                                            >
                                                <View 
                                                    style={[{
                                                        alignItems: 'center', justifyContent: 'center', borderRadius: 5, 
                                                        borderColor: '#C4C4C4', borderWidth: 1
                                                    }, getWidthnHeight(42, 6)]}>
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
                                                        }, () => this.betweenLeaveHolidays());
                                                        Keyboard.dismiss();
                                                    }} 
                                                />
                                            )}
                                            <View style={styles.forDate}>
                                                <Text style={[{fontSize: (fontSizeH4().fontSize - 4), color: '#1363DF', fontWeight: 'bold', textAlign: 'center'}, styles.boldFont]}>From Date</Text>
                                            </View>
                                        </View> 
                                        <View style={[getWidthnHeight(42, 6)]}>
                                            <TouchableOpacity 
                                                onPress={() => this.setState({showToDatePicker: !showToDatePicker})}
                                            >
                                                <View 
                                                    style={[{
                                                        alignItems: 'center', justifyContent: 'center', borderRadius: 5, borderColor: '#C4C4C4', 
                                                        borderWidth: 1
                                                    }, getWidthnHeight(42, 6)]}>
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
                                                        }, () => this.betweenLeaveHolidays());
                                                    }} 
                                                />
                                            )}
                                            <View style={styles.forDate}>
                                                <Text style={[{fontSize: (fontSizeH4().fontSize - 4), color: '#1363DF', fontWeight: 'bold', textAlign: 'center'}, styles.boldFont]}>To Date</Text>
                                            </View>
                                        </View>
                                    </View>
                                }
                
                                <View style={{alignItems: 'center', marginTop: '5%'}}>
                                    <View style={[{backgroundColor: '#E1F2F9', alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(40, 4)]}>
                                        <Text style={{textAlignVertical: 'center', fontSize: (fontSizeH4().fontSize + 3)}}>Number of Days</Text>
                                    </View>
                                    {(number_of_days === '') ? (
                                        <ActivityIndicator size="large" color="#FEA82F" />
                                    )
                                    :
                                        <Text style={[fontSizeH3()]}>{number_of_days}</Text>
                                    }
                                </View>

                                <View style={[{height: 1, backgroundColor: 'rgba(196, 196, 196, 0.25)', marginTop: '2%', marginBottom: '3%'}, getWidthnHeight(86)]}/>
                
                                {/* <View style={[{alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}, getWidthnHeight(93)]}>
                                    <Text style={[{color: 'rgb(19,111,232)', marginLeft: '3%', fontWeight: 'bold'}, styles.boldFont, fontSizeH4()]}>LOCATION</Text>
                                    <Dropdown
                                        containerStyle={[{borderColor: '#C4C4C4', borderWidth: 0, justifyContent: 'center'}, getWidthnHeight(20, 4), getMarginRight(1.5)]}
                                        inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getWidthnHeight(20), getMarginTop(-2)]}
                                        labelFontSize={fontSizeH4().fontSize - 3}
                                        labelTextStyle={[getMarginLeft(1.5), getMarginTop(0)]}
                                        data={this.state.countries}
                                        valueExtractor={({id})=> id}
                                        labelExtractor={({name})=> name}
                                        onChangeText={(id, index, data) => {
                                            this.setState({
                                                countryName: data[index]['name'], countryID: id, countryError: false
                                            }, () => {
                                                const countryIndex = this.state.countries.findIndex((item) => {
                                                    return (countryID === item.id)
                                                })
                                                this.setState({countryCode: this.state.countries[countryIndex]['phone_code']});
                                            })
                                            Keyboard.dismiss();
                                        }}
                                        value={countryName}
                                        baseColor = {(countryName)? colorTitle : '#C4C4C4'}
                                        //pickerStyle={[getMarginLeft(4), getWidthnHeight(42), getMarginTop(10)]}
                                        fontSize = {(countryName)? fontSizeH4().fontSize + 2 : fontSizeH4().fontSize}
                                    />
                                </View>

                                <View style={{
                                    flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', width: getWidthnHeight(93).width, marginVertical: '3%'
                                }}>
                                    <Dropdown
                                        containerStyle={[{
                                            borderWidth: (buttonPressed && stateError)? 2 : 1, borderColor: (buttonPressed && stateError)? 'red' : '#C4C4C4',
                                            borderStyle: (buttonPressed && stateError)? 'dashed' : 'solid', borderRadius: 1, justifyContent: 'center'}, getWidthnHeight(42, 6.5)]}
                                        inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getWidthnHeight(42)]}
                                        label={"State"}
                                        disabled={(this.state.leaveType === 'Full' && !toDate)? true : false}
                                        labelFontSize={fontSizeH4().fontSize - 3}
                                        labelTextStyle={[getMarginLeft(1.5), getMarginTop(0)]}
                                        data={this.state.states}
                                        valueExtractor={({id})=> id}
                                        labelExtractor={({name})=> name}
                                        onChangeText={async(states_Value, index, data) => {
                                            this.setState({ states_Value, stateName: data[index]['name'] });
                                            this.setState({cities: []});
                                            this.setState({cityError: true})
                                            this.setState({stateError: false});
                                            await this.cities();
                                            Keyboard.dismiss();
                                        }}
                                        value={stateName}
                                        baseColor={(this.state.states_Value)? "#039FFD" : '#C4C4C4'}
                                        fontSize={fontSizeH4().fontSize + 2}
                                    />
                                    <Dropdown
                                        containerStyle={[{
                                            borderWidth: (buttonPressed && cityError)? 2 : 1, borderColor: (buttonPressed && cityError)? 'red' : '#C4C4C4',
                                            borderStyle: (buttonPressed && cityError)? 'dashed' : 'solid', borderRadius: 1, justifyContent: 'center'}, getWidthnHeight(42, 6.5)]}
                                        inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getWidthnHeight(42)]}
                                        data={this.state.cities}
                                        value={cityName}
                                        valueExtractor={({id})=> id}
                                        label={"City"}
                                        fontSize={fontSizeH4().fontSize + 2}
                                        labelFontSize={fontSizeH4().fontSize - 3}
                                        labelTextStyle={[getMarginLeft(1.5), getMarginTop(0)]}
                                        baseColor={(this.state.cities_Value)? "#039FFD" : '#C4C4C4'}
                                        labelExtractor={({name})=> name}
                                        // placeholder={'Select leave type'}
                                        onChangeText={(cities_Value, index, data) => {
                                            Keyboard.dismiss();
                                            this.setState({ cities_Value, cityName: data[index]['name'] })
                                            this.setState({cityError: false})
                                        }}
                                    />
                                </View> 

                                <View style={[{height: 1, backgroundColor: 'rgba(196, 196, 196, 0.25)', marginVertical: '3%'}, getWidthnHeight(86)]}/>
                    
                                <View style={[styles.pagecomponent_ten, {marginTop: '3%'}]}>
                                    <View style={[styles.country_code, getWidthnHeight(13, 6.5)]}>
                                        <Text style={[{color:'white',textAlign:'center', textAlignVertical: 'center', fontSize: (fontSizeH4().fontSize + 3)}]}>+{countryCode}</Text>
                                    </View>
                                    <View>
                                        <AnimatedTextInput 
                                            placeholder=" Mobile Number "
                                            placeholderColor={['#C4C4C4', '#0B8EE8']}
                                            value={this.state.value}
                                            keyboardType="numeric"
                                            maxLength={10}
                                            slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                            slideHorizontal={[0, getWidthnHeight(-2).width]}
                                            placeholderScale={[1, 0.75]}
                                            autoFocus={false}
                                            onChangeText={(number) => {
                                                this.setState({ value: number.replace(/[^0-9]/g, '') }, () => {
                                                    const {value} = this.state;
                                                    if(value.length === 10){
                                                        this.setState({mobileError: false})
                                                    }else if(value === ''){
                                                        this.setState({value: '', mobileError: true}, () => Keyboard.dismiss())
                                                    }else if(value.length < 10){
                                                        this.setState({mobileError: true})
                                                    }
                                                })
                                            }}
                                            clearText={() => this.setState({value: '', mobileError: true})}
                                            containerColor={[(buttonPressed && mobileError)? 'red' : '#C4C4C4', (buttonPressed && mobileError)? 'red' : '#C4C4C4']}
                                            containerBorderWidth={[(buttonPressed && mobileError)? 2 : 1, 1]}
                                            containerStyle={[{
                                                borderRadius: 1, justifyContent: 'center', borderStyle: (buttonPressed && mobileError)? 'dashed' : 'solid',
                                            }, getWidthnHeight(40, 6.5)]}
                                            style={[{
                                                borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2),
                                                color: (mobileError)? 'red' : 'black'
                                            }, getWidthnHeight(30, 6.5), getMarginHorizontal(1.5)]}
                                            iconSize={Math.floor(getWidthnHeight(5).width)}
                                            iconColor={'#C4C4C4'}
                                        />
                                    </View>
                                </View> 

                                <View style={[{height: 1, backgroundColor: 'rgba(196, 196, 196, 0.25)', marginTop: '6%', marginBottom: '4%'}, getWidthnHeight(86)]}/>

                                <View style={{alignItems: 'center'}}>
                                    <View style={[{alignItems: 'flex-start'}, getWidthnHeight(93)]}>
                                        <Text style={[{color: 'rgb(19,111,232)', marginLeft: '3%', fontWeight: 'bold'}, styles.boldFont, fontSizeH4()]}>REPLACEMENT</Text>
                                    </View>

                                    <View style={{
                                        flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', width: getWidthnHeight(93).width, marginVertical: '3%'
                                    }}>
                                        <Dropdown
                                            containerStyle={[{borderRadius: 1, borderStyle: (buttonPressed && departmentError)? 'dashed' : 'solid', borderWidth: (buttonPressed && departmentError)? 2 : 1,
                                            borderColor: (buttonPressed && departmentError) ? 'red' : '#C4C4C4', justifyContent: 'center'}, getWidthnHeight(42, 6.5)]}
                                            inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getWidthnHeight(42)]}
                                            data={this.state.departments}
                                            value={departmentName}
                                            valueExtractor={({id})=> id}
                                            label={"Department*"}
                                            disabled={(this.state.leaveType === 'Full' && !toDate)? true : false}
                                            fontSize={fontSizeH4().fontSize + 2}
                                            labelFontSize={fontSizeH4().fontSize - 3}
                                            labelTextStyle={[getMarginLeft(1.5), getMarginTop(0)]}
                                            baseColor={(this.state.departments_Value)? "#039FFD" : '#C4C4C4'}
                                            labelExtractor={({name})=> name}
                                            // placeholder={'Select leave type'}
                                            onChangeText={async(id, index, data) => {
                                                //console.log("DEPARTMENT: ", id, data[index]['name'])
                                                this.setState({ 
                                                    departments_Value: id, departmentName: data[index]['name'],
                                                    employees: [], employees_Value: null, employeeName: '',
                                                    departmentError: false, empNameError: true
                                                })
                                                await this.leave_replacement_availability();
                                                Keyboard.dismiss();
                                            }}
                                        />
                                        <Dropdown
                                            containerStyle={[{borderRadius: 1, borderStyle: (buttonPressed && empNameError)? 'dashed' : 'solid', borderWidth: (buttonPressed && empNameError)? 2 : 1,
                                            borderColor: (buttonPressed && empNameError) ? 'red' : '#C4C4C4', justifyContent: 'center'}, getWidthnHeight(42, 6.5)]}
                                            inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getWidthnHeight(42)]}
                                            data={employees}
                                            value={employeeName}
                                            valueExtractor={({user_id}) => user_id}
                                            labelExtractor={({fullname})=> fullname }
                                            label={"Employee*"}
                                            fontSize={fontSizeH4().fontSize + 2}
                                            labelFontSize={fontSizeH4().fontSize - 3}
                                            labelTextStyle={[getMarginLeft(1.5), getMarginTop(0)]}
                                            baseColor={(this.state.employees_Value)? "#039FFD" : '#C4C4C4'}
                                            onChangeText={(user_id, index, data) => {
                                                Keyboard.dismiss();
                                                this.setState({ employees_Value: user_id, employeeName: data[index]['fullname'] }, () => console.log("@@@@EMPLOYEE ID: ", this.state.employees_Value))
                                                this.setState({empNameError: false})
                                                console.log("####EMPLOYEES: ", this.state.employees_Value, data[index]['fullname'])
                                            }}
                                        />
                                    </View>
                                    
                                    <View style={[{alignItems: 'flex-start'}, getWidthnHeight(86)]}>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <TouchableOpacity activeOpacity={0.7} style={{}} onPress={() => this.setState({checkBox: !this.state.checkBox}, () => Keyboard.dismiss())}>
                                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                    {(checkBox) && 
                                                        <MaterialCommunityIcons name='checkbox-marked' size={getWidthnHeight(7).width} color='rgb(19,111,232)'/>
                                                    }
                                                    {(!checkBox) && 
                                                        <MaterialCommunityIcons name='checkbox-blank' size={getWidthnHeight(7).width} color={(buttonPressed && !checkBox)? 'red' : 'rgba(146, 146, 146, 0.5)'}/>
                                                    }
                                                    <Text style={[{color: 'grey', fontStyle: 'italic', fontSize: (fontSizeH4().fontSize)}, getMarginLeft(2)]}>I have handed over my Duties/Responsibilities</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                
                                    <View style={[{height: 1, backgroundColor: 'rgba(196, 196, 196, 0.25)', marginTop: '3%', marginBottom: '1%'}, getWidthnHeight(86)]}/>
                                </View>

                                <View style={{marginVertical: '5%'}}>
                                    <View style={[{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, getWidthnHeight(93)]}>
                                        <View style={[getWidthnHeight(42)]}>
                                            <TouchableOpacity activeOpacity={0.6} onPress={this.SingleFilePicker.bind(this)}>
                                                <View style={[{flexDirection: 'row', alignItems: 'center', marginLeft: '5%'}]}>
                                                    <MaterialCommunityIcons name='file-upload' size={getWidthnHeight(8).width} color='rgb(19,111,232)'/>
                                                    <Text style={[{color: 'rgb(19,111,232)'}, fontSizeH4()]}>UPLOAD FILE</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={[{alignItems: 'flex-end'}, getWidthnHeight(42)]}>
                                            <TouchableOpacity 
                                                style={{marginRight: '7%'}} 
                                                activeOpacity={0.6} 
                                                onPress={() => this.setState({singleFileOBJ: ''}, () => Keyboard.dismiss())}
                                            >
                                                <View style={[{flexDirection: 'row', alignItems: 'center', marginLeft: '5%'}]}>
                                                    <MaterialCommunityIcons name='delete' size={getWidthnHeight(9).width} color={(this.state.singleFileOBJ === '')? '#C4C4C4' : '#CD113B'}/>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    {(this.state.singleFileOBJ !== '') && 
                                        <View style={[{alignItems: 'center', marginTop: '2%'}, getWidthnHeight(93)]}>
                                            <Text numberOfLines={1} style={{color: 'rgb(19,111,232)',textAlign:'center'}}>
                                                {this.state.singleFileOBJ.name}
                                            </Text>
                                        </View>
                                    }
                                </View>

                                {(this.state.leaveType == 'Full') &&   
                                    <View style={{flexDirection:'column', marginTop: '5%', marginBottom: '3%', alignItems: 'center'}}>
                                        <AnimatedTextInput 
                                            placeholder=" Handover Task*"
                                            placeholderColor={['#C4C4C4', '#0B8EE8']}
                                            value={this.state.value_sec}
                                            multiline={true}
                                            maxLength={190}
                                            numberOfLines={4}
                                            slideVertical={[0, getWidthnHeight(undefined, -5).height]}
                                            slideHorizontal={[0, getWidthnHeight(-3).width]}
                                            placeholderScale={[1, 0.75]}
                                            autoFocus={false}
                                            onChangeText={(value_sec) => {
                                                this.setState({ value_sec: value_sec.trimLeft() }, () => {
                                                    const {value_sec} = this.state;
                                                    if(value_sec !== ''){
                                                        this.setState({handoverError: false})
                                                    }else{
                                                        this.setState({value_sec: '', handoverError: true}, () => Keyboard.dismiss())
                                                    }
                                                })
                                            }}
                                            clearText={() => this.setState({value_sec: '', handoverError: true})}
                                            containerColor={[(buttonPressed && handoverError)? 'red' : '#C4C4C4', (buttonPressed && handoverError)? 'red' : '#C4C4C4']}
                                            containerBorderWidth={[(buttonPressed && handoverError)? 2 : 1, 1]}
                                            containerStyle={[{
                                                borderRadius: 1, justifyContent: 'center', borderStyle: (buttonPressed && handoverError)? 'dashed' : 'solid',
                                            }, getWidthnHeight(86, 10)]}
                                            style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(86, 10), getMarginHorizontal(1.5)]}
                                            // iconSize={Math.floor(getWidthnHeight(5).width)}
                                            // iconColor={'#C4C4C4'}
                                        />
                                    </View>
                                } */}
                                <View style={{flexDirection:'column', marginTop: '3%', marginBottom: '5%', alignItems: 'center'}}>
                                    <AnimatedTextInput 
                                        placeholder="Reason for Leave*"
                                        placeholderColor={['#C4C4C4', '#0B8EE8']}
                                        value={this.state.value_thrd}
                                        multiline={true}
                                        maxLength={190}
                                        numberOfLines={4}
                                        slideVertical={[0, getWidthnHeight(undefined, -5).height]}
                                        slideHorizontal={[0, getWidthnHeight(-3.5).width]}
                                        placeholderScale={[1, 0.75]}
                                        autoFocus={false}
                                        onChangeText={(value_thrd) => {
                                            this.setState({ value_thrd: value_thrd.trimLeft() }, () => {
                                                const {value_thrd} = this.state;
                                                if(value_thrd !== ''){
                                                    this.setState({reasonError: false})
                                                }else{
                                                    this.setState({value_thrd: '', reasonError: true}, () => Keyboard.dismiss())
                                                }
                                            })
                                        }}
                                        clearText={() => this.setState({value_thrd: '', reasonError: true})}
                                        containerColor={[(buttonPressed && reasonError)? 'red' : '#C4C4C4', (buttonPressed && reasonError)? 'red' : '#C4C4C4']}
                                        containerBorderWidth={[(buttonPressed && reasonError)? 2 : 1, 1]}
                                        containerStyle={[{
                                            borderRadius: 1, justifyContent: 'center', borderStyle: (buttonPressed && reasonError)? 'dashed' : 'solid',
                                        }, getWidthnHeight(86, 10)]}
                                        style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(86, 10), getMarginHorizontal(1.5)]}
                                        // iconSize={Math.floor(getWidthnHeight(5).width)}
                                        // iconColor={'#C4C4C4'}
                                    />
                                </View>
                            </View>
                        </ScrollView>  
                        <View style={[{backgroundColor: 'white', alignItems: 'center', justifyContent: 'space-between'}, getWidthnHeight(93)]}>
                            {/* {<View style={[{position: 'absolute', height: 1.5, backgroundColor: 'rgba(19,111,232,0.6)'}, getWidthnHeight(80)]}/>} */}
                            <View style={[{alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(93, 7)]}>
                                <TouchableOpacity activeOpacity={0.6} style={[{flexDirection: 'row', alignItems:'center', justifyContent: 'center'}, getWidthnHeight(40, 5.5)]} onPress={()=>{
                                    Keyboard.dismiss();
                                    this.confirmEntries();
                                }}>
                                    <View style={[{
                                        backgroundColor: 'rgb(19,111,232)', borderRightWidth: 2, borderRightColor: '#FFFFFF', borderTopLeftRadius: getWidthnHeight(2).width,
                                        borderBottomLeftRadius: getWidthnHeight(2).width
                                    }, getWidthnHeight(5, 5.5)]}/>
                                    <View style={[{backgroundColor: 'rgb(19,111,232)', alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(30, 5.5)]}>
                                        <Text style={{fontSize: (fontSizeH4().fontSize + 2), color:'white'}}>APPLY LEAVE</Text>
                                    </View>
                                    <View style={[{
                                        backgroundColor: 'rgb(19,111,232)', borderLeftWidth: 2, borderLeftColor: '#FFFFFF', borderTopRightRadius: getWidthnHeight(2).width,
                                        borderBottomRightRadius: getWidthnHeight(2).width
                                        }, getWidthnHeight(5, 5.5)]}/>
                                </TouchableOpacity>
                            </View>
                        </View> 
                        </View>
                        </KeyboardAvoidingView>
                    </View>
                </View>
                <View 
                    style={[{
                        backgroundColor: (loading)? 'rgba(0, 0, 0, 0.5)' : 'transparent', alignItems: 'center', justifyContent: 'center'
                    }, StyleSheet.absoluteFill]} 
                    pointerEvents={(loading)? 'auto' : 'none'}
                >
                    {(loading) &&
                        <Spinner loading={loading} style={[styles.loadingStyle, getWidthnHeight(45, 10), getMarginLeft(3)]} color='rgb(19,111,232)'/>
                    }
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
}

const styles = StyleSheet.create({
    leaveBar: {
        width: getWidthnHeight(15).width, 
        height: getWidthnHeight(15).width, 
        borderRadius: getWidthnHeight(10).width,
        alignItems: 'center',
        justifyContent: 'center',
    },
    leaveSelection: {
        flexDirection: 'row',
        alignItems: 'center',
        width: getWidthnHeight(42).width,
        height: getWidthnHeight(undefined, 6.5).height,
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
    pagecomponent_ten: {
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'transparent',
        // shadowOffset:{  width: 100,  height: 100,  },
        shadowColor: '#330000',
        shadowOpacity: 0,
        // shadowRadius: 0,
        elevation: 0,
        borderWidth: 0,
        borderColor: 'black'
    },
    country_code:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'rgb(19,111,232)',
    },
    button_value_one:{
        width: getWidthnHeight(28).width,
        height: getWidthnHeight(undefined, 6.5).height,
        backgroundColor:'#E1F2F9',
    },
    button_value_sec:{
        width: getWidthnHeight(28).width,
        height: getWidthnHeight(undefined, 6.5).height,
        backgroundColor:'rgb(19,111,232)',
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
    }
});

export default ApplyLeave;