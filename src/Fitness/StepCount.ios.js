import React, { Component } from "react";
import { 
    View, Text, Alert, PermissionsAndroid, SafeAreaView, TouchableOpacity, Linking, RefreshControl, Image,
    NativeAppEventEmitter
} from 'react-native';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { FlatList } from "react-native-gesture-handler";
import AppleHealthKit, {
    HealthValue, HealthKitPermissions, HealthInputOptions
} from 'react-native-health';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from "moment";
import { 
    fontSizeH2, getMarginTop, getWidthnHeight, WaveHeader, StepCountModal, IOS_StatusBar, 
    fontSizeH4, fontSizeH3, GradientBorder, getMarginHorizontal, GradientCircularProgress, getMarginLeft 
} from '../KulbirComponents/common';

    const COLOR1 = "#039FFD";
    const COLOR2 = "#EA304F";

    let year = `${moment().year()}`;
    let month = `${moment().month() + 1}`;
    month = (month < 10)? `0${month}` : month;
    let todaysDate = moment().date();
    todaysDate = (todaysDate < 10)? `0${todaysDate}` : todaysDate;
    const startWeekDate = moment().startOf('weeks').format("YYYY-MM-DD");
    const endWeekDate = moment().endOf('weeks').format("YYYY-MM-DD");
    const currentDate = `${year}-${month}-${todaysDate}`;
    const startTime = "12:00 AM";
    const currentDateTime = `${startWeekDate} ${startTime}`;
    const startTimeStamp = moment(currentDateTime, "YYYY-MM-DD hh:mm A").utc().toDate().toISOString();
    // const endDateTime = `${year}-${month}-${todaysDate} 11:59 PM`;
    const endDateTime = `${endWeekDate} 11:59 PM`;
    const endTimeStamp = moment(endDateTime, "YYYY-MM-DD hh:mm A").utc().toDate().toISOString();
    const dayIndex = moment().weekday();
    const daysInWeek = moment.weekdays();

    let dates = [];
    for (i = 0; i <= 6; i++) {
        if (i === 0) {
            dates.push(startWeekDate);
        } else if (i > 0 && i < 6) {
            dates.push(moment(startWeekDate).add(i, 'day').format('YYYY-MM-DD'));
        } else if (i === 6) {
            dates.push(endWeekDate);
        }
    }

    const tableData = daysInWeek.map((day, index) => {
        return {id: index, day: day, date: dates[index]};
    });

class StepCount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            steps: [],
            startDate: startTimeStamp,
            endDate: endTimeStamp,
            checkCurrentData: false,
            presentData: {},
            selected: null,
            manualSelect: {},
            requestPermission: false,
            showModal: false,
            customSteps: [],
            refreshing: false,
            maxValue: 1,
            monthlyData: [],
            weeklyData: [],
            selectedIndex: 0,
            progress: 0,
            filteredData: [],
            defaultDate1: '',
            defaultDate2: ''
        };
    }

    componentDidMount() {
        this.checkAuthorization();
    }

    getDay(date) {
        const momentDate = moment(date);
        return momentDate.day();
    }

    initializeData(){
        try{
            const { maxValue } = this.state;
            const daysInMonth = moment().daysInMonth();
            const currentYear = moment().year();
            const currentMonth = (moment().month() + 1);
            let daysArray = [];
            for(let i = 0; i <= (daysInMonth - 1); i++){
                const date = ((i+1) < 10)? `0${i+1}` : i+1;
                const createDate = `${currentYear}-${currentMonth}-${date}`;
                // const dayNum = moment(createDate, "YYYY-MM-DD").day();
                const dayNum = this.getDay(createDate);
                const dayName = daysInWeek[dayNum];
                daysArray[i] = {
                    date: createDate,
                    day: dayName,
                    value: 0
                }
            }
            // daysArray[10]['value'] = 1575;
            // daysArray[16]['value'] = 5750;
            this.setState({monthlyData: daysArray.map((item) => item)}, () => {
                const day = daysArray[0]['day'];
                const dayIndex = daysInWeek.findIndex((item) => item === day);
                let addStartArray = [];
                if(day !== daysInWeek[0]){
                    for(let i = 0; i < dayIndex ; i++){
                        const createDate = moment(daysArray[0]['date']).subtract(i + 1, ((i + 1) > 1)? 'days' : 'day').format("YYYY-MM-DD")
                        const dayNum = this.getDay(createDate);
                        const dayName = daysInWeek[dayNum];
                        addStartArray[i] = {
                            date: createDate,
                            day: dayName,
                            value: 0
                        }
                    }
                    addStartArray = addStartArray.reverse();
                    daysArray.unshift(...addStartArray);
                }
                const endDay = daysArray[daysArray.length - 1]['day'];
                const endDayIndex = daysInWeek.findIndex((item) => item === endDay);
                let addEndArray = [];
                if(endDay !== daysInWeek[daysInWeek.length - 1]){
                    for(let i = 0; i < endDayIndex ; i++){
                        const createDate = moment(daysArray[daysArray.length - 1]['date']).add(i + 1, ((i + 1) > 1)? 'days' : 'day').format("YYYY-MM-DD")
                        const dayNum = this.getDay(createDate);
                        const dayName = daysInWeek[dayNum];
                        addEndArray[i] = {
                            date: createDate,
                            day: dayName,
                            value: 0
                        }
                    }
                    daysArray.push(...addEndArray)
                }
                const { weeklyData, breakIndexValue }  = this.weeklyDataFunction(daysArray, maxValue);
                const currentIndex = weeklyData.findIndex((item, index) => {
                    const data = item.model.find((subItem) => {
                        return (subItem.date === moment().format("YYYY-MM-DD"));
                    })
                    if(data){
                        return index
                    }
                })
                //console.log("&&&### SEARCHED DATE: ", currentIndex);
                this.setState({steps: daysArray, weeklyData, selectedIndex: currentIndex}, () => {
                    this.getCount();
                })
            });
        }catch(error){
            Alert.alert("Initialize Data: ", JSON.stringify(error));
        }
    }

    weeklyDataFunction(daysArray, maxValue){
        try{
            const breakPoint = daysInWeek[0];
            let breakIndexValue = [];
            let weeklyData = [];
            for(let i = 0; i < daysArray.length; i++){
                if(daysArray[i]['day'] === breakPoint){
                    breakIndexValue.push(i);
                }
            }
            for(let i = 0; i < breakIndexValue.length; i++){
                if(i < (breakIndexValue.length - 0)){
                    const data = daysArray.slice(breakIndexValue[i], breakIndexValue[i + 1])
                    weeklyData[i] = {
                        model: data.map((item, index) => {
                            const currentDate = moment().format("YYYY-MM-DD");
                            const isSame = moment(item.date).isSame(currentDate);
                            //console.log("@@@ ITEM VALUE: ", item.value)
                            let percentHeight = 0;
    
                            if(typeof maxValue === "number" && maxValue >= 0){
                                percentHeight = Math.floor((item.value/maxValue) * 23);
                            }
                            percentHeight = (percentHeight === 0)? 23 : percentHeight;
                            //console.log("### PERCENT HEIGHT: ", percentHeight, typeof percentHeight, item.value,'/',maxValue, " = ", item.value/maxValue)
                            return {ui: (
                                <View 
                                    key={`K${index + 1}`}
                                    style={[{
                                        alignItems: 'center', padding: getWidthnHeight(1).width, borderColor: 'black', borderWidth: 0.5, justifyContent: 'space-evenly'
                                    }, getWidthnHeight(undefined, 37)]}
                                >
                                    <View style={[{alignItems: 'center'}]}>
                                        <View style={[{
                                            width: getWidthnHeight(11).width, height: getWidthnHeight(11).width, borderRadius: getWidthnHeight(5.5).width,
                                            alignItems: 'center', justifyContent: 'center', backgroundColor: (isSame)? '#0E49B5' : 'transparent',
                                        }]}>
                                            <GradientBorder 
                                                start={{x: 1, y: 1}}
                                                end={{x: 0, y: 1}}
                                                colors={[COLOR2, (isSame)? 'white' : COLOR1]}
                                                containerStyle={{
                                                    width: getWidthnHeight(10).width, height: getWidthnHeight(10).width, borderRadius: getWidthnHeight(5).width,
                                                    borderColor: '#C4C4C4', borderWidth: 1.5, alignItems: 'center', justifyContent: 'center'
                                                }}
                                                title={moment(item.date, "YYYY-MM-DD").format("DD")}
                                                titleStyle={{color: (isSame)? 'white' : 'black', fontSize: fontSizeH4().fontSize + 2}}
                                            />
                                        </View>
                                        <Text style={{color: 'black', fontSize: fontSizeH4().fontSize - 3}}>{item.day.substring(0, 3).toUpperCase()}</Text>
                                    </View>
                                    <View style={[{width: '100%', backgroundColor: '#E2E3E3', alignItems: 'center', justifyContent: 'flex-end'}, getWidthnHeight(undefined, 27)]}>
                                        <View 
                                            style={[{
                                                backgroundColor: 'transparent', paddingBottom: getMarginTop(1).marginTop,
                                                alignItems: 'center', justifyContent: 'flex-end'
                                            }, getWidthnHeight(6, 23)]}
                                        >
                                            {/* {(item.value === 0) && <Text style={{color: 'black', textAlign: 'center'}}>{Math.floor(item.value)}</Text>} */}
                                            {((String(item.value).length > 4) && (item.value > 0)) && (
                                                <View style={{alignItems: 'center', transform: [{rotate: '0deg'}]}}>
                                                    <Text 
                                                        style={{
                                                            textAlign: 'center', color: 'black', width: getWidthnHeight(15).width,
                                                            fontSize: (fontSizeH4().fontSize - 3)
                                                        }}
                                                    >
                                                        {Math.floor(item.value)}
                                                    </Text>
                                                </View>
                                            )}
                                            {((String(item.value).length > 3) && (String(item.value).length < 5) && (item.value > 0)) && (
                                                <View style={{alignItems: 'center', transform: [{rotate: '0deg'}]}}>
                                                    <Text 
                                                        style={{
                                                            textAlign: 'center', color: 'black', width: getWidthnHeight(15).width,
                                                            fontSize: (fontSizeH4().fontSize - 2)
                                                        }}
                                                    >
                                                        {Math.floor(item.value)}
                                                    </Text>
                                                </View>
                                            )}
                                            {(((String(item.value).length < 4) || (item.value === 0))) && (
                                                <View style={{alignItems: 'center', transform: [{rotate: '0deg'}]}}>
                                                    <Text 
                                                        style={{
                                                            textAlign: 'center', color: 'black', width: getWidthnHeight(15).width,
                                                            fontSize: fontSizeH4().fontSize
                                                        }}
                                                    >
                                                        {Math.floor(item.value)}
                                                    </Text>
                                                </View>
                                            )}
                                            <View style={[{
                                                backgroundColor: (item.value > 0)? '#018383' : '#FED049',
                                                alignItems: 'center', justifyContent: 'flex-start'
                                            }, getWidthnHeight(6, (item.value === 0)? 1 : percentHeight)]}>
                                                {/* {((String(10000).length > 3) && String(10000).length > 3)&& (
                                                    <View style={{alignItems: 'center', transform: [{rotate: '270deg'}, {translateX: getWidthnHeight(-7).width}]}}>
                                                        <Text 
                                                            style={[{
                                                                textAlign: 'right', color: 'white', width: getWidthnHeight(15).width, borderWidth: 0, borderColor: 'black',
                                                                fontSize: fontSizeH4().fontSize - 1
                                                            }]}
                                                        >
                                                            {Math.floor(item.value)}
                                                        </Text>
                                                    </View>
                                                )} */}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            ), date: item.date};
                        }),
                        id: `${i}`
                    }
                }
            }
            return { weeklyData, breakIndexValue }
        }catch(error){
            Alert.alert("WEEKLY FUNCTION", JSON.stringify(error))
        }
    }

    checkAuthorization(){
        const permissions = {
            permissions: {
                read: [AppleHealthKit.Constants.Permissions.StepCount],
                write: [AppleHealthKit.Constants.Permissions.StepCount],
            }
        };
        AppleHealthKit.isAvailable((err, available) => {
            if (err) {
                console.log('error initializing Healthkit: ', err)
                return
            }
            console.log('### Healthkit Status: ', available)
        })
        AppleHealthKit.initHealthKit(permissions, (error, result) => {
        /* Called after we receive a response from the system */
        
            if (error) {
                console.log('[ERROR] Cannot initialize!');
                return;
            }
        
            /* Can now read or write to HealthKit */
            const testDate = "2021-03-22T17:00:00.000-0300";
            console.log('### RESULT: ', result);
            this.initializeData();
        })
        NativeAppEventEmitter.addListener('healthKit:StepCount:setup:success', (response) => {
            console.log("###SET UP SUCCESS: ", response);
        })
        NativeAppEventEmitter.addListener('healthKit:StepCount:new', (response) => {
            console.log("### NEW: ", response);
        })
        NativeAppEventEmitter.addListener('healthKit:StepCount:setup:failure', (response) => {
            console.log("###SETUP FAILURE: ", response);
        })
        NativeAppEventEmitter.addListener('healthKit:StepCount:failure', (response) => {
            console.log("### FAILURE: ", response);
        })
    }

    async getCount(){
        try{
            const { steps, selectedIndex } = this.state;
            const startDate = moment(`${steps[0]['date']} 12:00 AM`, "YYYY-MM-DD hh:mm A").utc().toDate().toISOString();
            const endDate = moment(`${steps[this.state.steps.length - 1]['date']} 11:59 PM`, "YYYY-MM-DD hh:mm A").utc().toDate().toISOString();
            // console.log(
            //     "TIMESTAMP: ", moment(startDate).format("YYYY-MM-DD hh:mm A"), moment(endDate).format("YYYY-MM-DD hh:mm A")
            // );
            let createData = [];
            this.fetchFitnessData(startDate, endDate, false, (data) => {
                createData = data;
                const check = createData.find((item) => {
                    return moment(item.date).isSame(moment().format("YYYY-MM-DD"));
                })
                let maxValue = Math.max(...createData.map((item) => item.value));
                if(typeof maxValue === "number" && maxValue >= 0){
                    maxValue = (maxValue === 0)? 1 : maxValue;
                    this.setState({maxValue})
                    //console.log("^^^^^^ MAX VALUE: ", maxValue);
                }else{
                    maxValue = 1;
                    this.setState({maxValue: maxValue})
                }
                const reverseData = createData.map((item) => item).reverse();
                //console.log("\n\n&&& DAILY STEPS: ", createData)
                this.setState({steps: reverseData}, () => {
                    const newData = createData.map((item) => item)
                    const { weeklyData, breakIndexValue } = this.weeklyDataFunction(newData, maxValue)
                    this.setState({weeklyData}, () => {
                        console.log("\n\n&&& WEEKLY DATA: ", this.state.weeklyData)
                    });
                })
                if(check){
                    const day = this.getDay(check.date);
                    this.setState({ 
                        checkCurrentData: !!check, 
                        presentData: {
                            date: moment(check.date).format("DD MMM, YYYY"),
                            value: check.value
                        }, 
                        selected: tableData[day]['id'],
                        progress: Math.floor((check.value/maxValue) * 100)
                    })
                }
                //console.log("$$$### SLICE: ", selectedIndex)
                this.scrollRef.scrollToIndex({
                    animated: true,
                    index: selectedIndex
                })
            })
        }catch(error){
            console.log("GET COUNT ERROR: ", error);
            Alert.alert("Get Count: ", JSON.stringify(error));
        }
    }

    async fetchFitnessData(startDate, endDate, filter = false, callBack){
        const { steps } = this.state;
        const opt = {
            startDate, // required ISO8601Timestamp
            endDate, // required ISO8601Timestamp
            unit: 'day'
        };
        AppleHealthKit.getDailyStepCountSamples(opt, (error, response) => {
            if (error) {
                console.log('@@@[ERROR] Cannot grant permissions!', error, opt.startDate);
                Alert.alert("Daily Step Permission: ", JSON.stringify(error));
                return;
            }
            const res = response;
            const data = res.map((item => item));
            //console.log("#### RES: ", res)
            const startTime = moment(opt.startDate).format("hh:mm A");
            const endTime = moment(opt.endDate).format("hh:mm A");
            if(!filter){
                for(let i = 0; i < data.length; i++){
                    const date = data[i]['date'];
                    const index = steps.findIndex((item) => {
                        //console.log("!### FOR: ", item.date, date, moment(item.date).isSame(date))
                        return moment(item.date).isSame(date);
                    })
                    if(index > -1){
                        steps[index]['value'] = data[i]['value'];
                    }
                    //console.log("!@#!@#@#: ", date, index)
                }
                const createData = steps.map((item, index) => {
                    return { ...item, time: `${startTime} - ${endTime}`, id: `${index}`, value: Math.floor(item.value)}
                })
                callBack(createData);
            }else{
                const createData = data.map((item, index) => {
                    const dayNum = this.getDay(item.date);
                    const dayName = daysInWeek[dayNum];
                    return { ...item, day: dayName, time: `${startTime} - ${endTime}`, id: `${index}`, value: Math.floor(item.value)}
                })
                callBack(createData);
            }
        })
    }

    setSelectedIndex(event){
        const viewSize = event.nativeEvent.layoutMeasurement.width;
        const contentOffset = event.nativeEvent.contentOffset.x;
        const selectedIndex = Math.floor(contentOffset / viewSize);
        this.setState({selectedIndex}, () => {
            this.scrollRef.scrollToIndex({
                animated: true,
                index: this.state.selectedIndex
            })
        });
    }

    getItemLayout(data, index){
        return {length: getWidthnHeight(100).width, offset: getWidthnHeight(100).width * index, index}
    }

    async filterFunction(startDate, endDate){
        this.fetchFitnessData(startDate, endDate, true, (createData) => {
            this.setState({filteredData: createData}, () => {
                const { filteredData, maxValue } = this.state;
                const length = filteredData.length;
                let date = '';
                let value = 0;
                if(length === 0){
                    if(this.state.presentData?.date?.length > 12){
                        this.setState({defaultDate1: '', defaultDate2: ''}, () => this.resetFunction())
                    }
                    return;
                }
                const date1 = moment(startDate).format("DD MMM, YYYY");
                const date2 = moment(endDate).format("DD MMM, YYYY");
                date = `${date1} - ${date2}`
                for(let i = 0; i < length; i++){
                    value += filteredData[i]['value'];
                }
                const presentData = {
                    date,
                    value
                }
                this.setState({
                    presentData, progress: Math.floor((presentData.value/maxValue) * 100),
                    defaultDate1: moment(startDate).format("YYYY-MM-DD"),
                    defaultDate2: moment(endDate).format("YYYY-MM-DD")
                })
                //console.log("### FILTERED DATA: ", presentData);
            })
        });
    }

    resetFunction(){
        this.initializeData()
    }

    render() {
        const { 
            steps, progress, presentData, selected, manualSelect, selectedIndex,
            showModal, refreshing, monthlyData, weeklyData, filteredData,
            defaultDate1, defaultDate2
        } = this.state;
        console.log('EXTRACT DATE: ', Object.keys(presentData).length);
        let gradient = ['#039FFD', '#EA304F'];
        return (
            <View style={{flex: 1}}>
                <IOS_StatusBar color={gradient} barStyle="light-content"/>
                <SafeAreaView style={{flex: 1}}>
                    <WaveHeader
                        wave={false} 
                        menuState={false}
                        menu='white'
                        title='Fitness'
                        filter={
                            (Object.keys(presentData).length > 0)? (
                                <TouchableOpacity 
                                    activeOpacity={0.7}
                                    onPress={() => this.setState({showModal: true})}
                                >
                                    <Ionicons name="list" color={'white'} size={getWidthnHeight(10).width}/>
                                </TouchableOpacity>
                            ) : null
                        }
                    />
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}>
                        {/* PRESENT DATA */}
                        {(steps.length > 0) && (
                            <View style={[{alignItems: 'center', justifyContent: 'center'}, getMarginTop(3)]}>
                                <AnimatedCircularProgress
                                    size={Math.floor(getWidthnHeight(45).width)}
                                    width={getWidthnHeight(2.5).width}
                                    fill={progress}
                                    tintColor={COLOR1}
                                    backgroundColor="#D1D2D4"
                                >
                                    {() => (
                                        <View style={{alignItems: 'center', borderWidth: 0, borderColor: 'red', flex: 1, justifyContent: 'space-evenly'}}>
                                            <View style={{position: 'absolute'}}>
                                                <Image 
                                                    source={require('../Image/steps.png')}
                                                    resizeMode="contain"
                                                    style={[{width: getWidthnHeight(6).width, height: getWidthnHeight(10).width}, getMarginTop(-5)]}
                                                />
                                            </View>
                                            <Text style={[{fontSize: fontSizeH2().fontSize + 5}]}>
                                                {Math.floor((Object.keys(presentData).length > 0)? presentData.value : 0)}
                                            </Text>
                                            <View style={{position: 'absolute'}}>
                                                <Text style={[{fontSize: fontSizeH4().fontSize + 2, textAlign: 'center', borderColor: 'red', borderWidth: 0}, getMarginTop(6), getWidthnHeight(20)]}>
                                                    steps
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                </AnimatedCircularProgress>
                            </View>
                        )}
                        <View 
                            style={[{
                                borderColor: 'red', borderWidth: 0, alignItems: 'center', justifyContent: 'center'
                            }, getMarginTop(2), getWidthnHeight(100, 6)]}
                        >
                            {(Object.keys(presentData).length > 0) && (
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text 
                                        style={[{
                                            fontSize: fontSizeH4().fontSize + 4, paddingHorizontal: getMarginLeft(2).marginLeft,
                                            fontWeight: 'bold', textAlignVertical: 'center'
                                        }]}
                                    >
                                        {presentData?.date}
                                    </Text>
                                    <TouchableOpacity style={[getMarginLeft(2)]} onPress={() => {this.resetFunction()}}>
                                        <Ionicons name="reload-circle" color={'black'} size={getWidthnHeight(10).width}/>
                                    </TouchableOpacity>
                                </View>
                            )}
                            {/* <Text style={{fontSize: fontSizeH4().fontSize - 4}}>{presentData?.time}</Text> */}
                        </View>
                        <View 
                            style={[{
                                flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                                borderTopColor: '#C4C4C4C', borderTopWidth: 0.5
                                }, getMarginTop(2)
                            ]}
                        >
                            <View style={[getMarginTop(3)]}>
                                <FlatList 
                                    ref={(scroll) => this.scrollRef = scroll}
                                    data={weeklyData}
                                    horizontal
                                    scrollEventThrottle={16}
                                    showsHorizontalScrollIndicator={false}
                                    getItemLayout={this.getItemLayout.bind(this)}
                                    onMomentumScrollEnd={this.setSelectedIndex.bind(this)}
                                    pagingEnabled
                                    keyExtractor={(item) => item.id}
                                    renderItem={({item, index}) => {
                                        // console.log("##### UI: ", item.model)
                                        const model = item.model.map((subItem) => {
                                            return (
                                                <>
                                                    {subItem.ui}
                                                </>
                                            );
                                        })
                                        return (
                                            <View 
                                                style={[{
                                                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', borderColor: 'red', borderWidth: 0
                                                }, getWidthnHeight(100)]} 
                                                key={index}
                                            >
                                                {model}
                                            </View>
                                        );
                                    }}
                                />
                            </View>
                        </View>
                        {(weeklyData.length > 0) && (
                            <View style={[{alignItems: 'center'}, getMarginTop(2)]}>
                                <Text style={{fontSize: fontSizeH3().fontSize - 5, fontWeight: 'bold'}}>Number of Steps</Text>
                            </View>
                        )}
                        <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}, getMarginTop(1)]}>
                            {weeklyData.map((item, index) => {
                                return (
                                    <TouchableOpacity 
                                        key={index}
                                        style={{paddingVertical: getMarginTop(1.5).marginTop, borderColor: 'red', borderWidth: 0}}
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            if(index === selectedIndex){
                                                return;
                                            }
                                            this.setState({selectedIndex: index}, () => {
                                                this.scrollRef.scrollToIndex({
                                                    animated: true,
                                                    index: this.state.selectedIndex
                                                })
                                            })
                                        }}
                                    >
                                        <View style={[{
                                            backgroundColor: (selectedIndex === index)? '#0E49B5' : '#C4C4C4',
                                            width: getWidthnHeight(7).width, height: getWidthnHeight(1).width,
                                            borderRadius: getWidthnHeight(2.5).width
                                        }, getMarginHorizontal(1.5)]}/>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </View>
                    {(showModal) && (
                        <StepCountModal 
                            visible={showModal}
                            onDecline={() => this.setState({showModal: false})}
                            generateLogs={(startDate, endDate) => {
                                this.filterFunction(startDate, endDate)
                            }}
                            data={filteredData}
                            defaultDate1={defaultDate1}
                            defaultDate2={defaultDate2}
                            resetFunction={() => this.resetFunction()}
                        />
                    )}
                </SafeAreaView>
            </View>
        );
    }
}

export default StepCount;