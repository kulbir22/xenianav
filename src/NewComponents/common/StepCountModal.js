import React, { Component } from 'react';
import { 
    Text, View, TouchableOpacity, Platform, FlatList
} from 'react-native';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ActionModal from 'react-native-modal';
import {
    getWidthnHeight, fontSizeH4, getMarginHorizontal, getMarginTop, getMarginVertical, fontSizeH2, fontSizeH3, 
} from './width';
import { DateTimePicker } from './DateTimePicker';
import { GradientBox } from './GradientBox';

const COLOR1 = "#039FFD";
const COLOR2 = "#EA304F";
class StepCountModal extends Component {
    constructor(props){
        super(props)
        let year = `${moment().year()}`;
        let month = `${moment().month() + 1}`;
        month = (month < 10)? `0${month}` : month;
        let initialDate = '1';
        initialDate = (initialDate < 10)? `0${initialDate}` : initialDate;
        let currentDate = `${year}-${month}-${initialDate}`;
        currentDate = moment(currentDate, "YYYY-MM-DD").subtract(5, 'month').format("YYYY-MM-DD");
        const currentTime = "12:00 AM";
        const currentDateTime = `${currentDate} ${currentTime}`;
        const utcTimeStamp = moment(currentDateTime, "YYYY-MM-DD hh:mm A").utc().toDate();

        this.state = {
            submit: false,
            date: moment().toDate(),
            //FROM DATE PICKER
            showFromDatePicker: false,
            fromDate: (this.props.defaultDate1)? this.props.defaultDate1 : moment().format("YYYY-MM-DD"),
            fromDateError: false,
            toDate: (this.props.defaultDate2)? this.props.defaultDate2 : moment().format("YYYY-MM-DD"),
            toDateError: false,
            fromTimeStamp: (this.props.defaultDate1)? moment(this.props.defaultDate1).valueOf() : moment().valueOf(),
            toTimeStamp: (this.props.defaultDate2)? moment(this.props.defaultDate2).valueOf() : moment().valueOf(),
            fromMinDate: utcTimeStamp,
            //TO DATE PICKER
            showToDatePicker: false,
            toMinDate: utcTimeStamp,
            //FROM TIME PICKER
            showFromTimePicker: false,
            fromTimeError: false,
            fromTime: '12:00 AM',
            //TO TIME PICKER
            showToTimePicker: false,
            toTimeError: false,
            toTime: '11:59 PM'
        }
    }

    componentDidMount(){
        this.startSearch();
    }

    startSearch(){
        this.setState({submit: true}, () => {
            const {
                fromDate, fromDateError, fromTime, fromTimeError,
                toDate, toDateError, toTime, toTimeError
            } = this.state;
            if(fromDate && !fromDateError && fromTime && !fromTimeError && toDate && !toDateError && toTime && !toTimeError){

                const fromDateTime = `${fromDate} 12:00 AM`;
                const startTimeStamp = moment(fromDateTime, "YYYY-MM-DD hh:mm A").utc().toDate().toISOString()

                const toDateTime = `${toDate} 11:59 PM`;
                const endTimeStamp = moment(toDateTime, "YYYY-MM-DD hh:mm A").utc().toDate().toISOString()
                console.log("\n\n", fromDate, fromTime, startTimeStamp, "\n\n", toDate, toTime, endTimeStamp)
                this.props.generateLogs(startTimeStamp, endTimeStamp);
            }else{
                alert("Please fill the highlighted fields in RED.")
            }
        })
    }

    render(){
        const { visible, onDecline = () => {}, data = [] } = this.props;
        const { 
            submit, fromDateError, showFromDatePicker, date, fromDate, fromMinDate, 
            toDateError, showToDatePicker, toDate,
            showFromTimePicker, fromTimeError, fromTime,
            showToTimePicker, toTimeError, toTime, fromTimeStamp, toTimeStamp
        } = this.state;
        console.log("MAX DATE: ", typeof fromTimeStamp, typeof toTimeStamp, moment().month()) //2022-09-27T07:00:02.216Z - 2022-07-31T18:30:00.000Z
        //console.log("### REQUIRED DATE TIME FORMAT: ", Date.parse("2022-09-27"))
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
        let fromMaxDate = moment(`${maxCompiledDate} ${fromTime}`, "YYYY-MM-DD hh:mm A").utc().toDate();
        let toMaxDate = moment(`${maxCompiledDate} ${toTime}`, "YYYY-MM-DD hh:mm A").utc().toDate();
        return(
            <ActionModal 
                isVisible={visible}
                style={[{alignItems: 'center'}]}
                onBackdropPress={() => onDecline()}
                backdropOpacity={0.7}
            >
                <View 
                    style={[{
                        justifyContent: 'flex-start', borderWidth: 0, borderColor: 'red',
                        backgroundColor: 'white', borderRadius: getWidthnHeight(5).width, overflow: 'hidden'
                    }, getWidthnHeight(95, 70)]}
                >
                    <GradientBox
                        start={{x: 0, y: 0}} 
                        end={{x: 1, y: 0}}
                        colors={[COLOR2, COLOR1]}
                        containerStyle={[{width: '100%'}, getWidthnHeight(undefined, 6)]}
                    />
                    <View 
                        style={[{
                            flex: 1, backgroundColor: 'white', borderRadius: 10, alignItems: 'center', 
                            borderWidth: 0.5, borderColor: 'white', justifyContent: 'flex-start'
                        }, getWidthnHeight(95)]}
                    > 
                        {/* <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}]}>
                            <Ionicons name='list' color='#000000' size={getWidthnHeight(10).width}/>
                            <Text style={[{color: '#000000', paddingLeft: 10, fontSize: fontSizeH4().fontSize + 8}]}>Choose Date</Text>       
                        </View>  */}
                        <View style={[{flexDirection: 'row', justifyContent: 'space-evenly'}, getWidthnHeight(90), getMarginTop(3)]}>
                            <View style={[{borderColor: 'red', borderWidth: 0}, getWidthnHeight(40, 7)]}>
                                <TouchableOpacity 
                                    onPress={() => this.setState({showFromDatePicker: !showFromDatePicker})}
                                >
                                    <View 
                                        style={[{
                                            alignItems: 'center', justifyContent: 'center', borderRadius: 5, borderColor: (submit && fromDateError)? 'red' : '#C4C4C4', 
                                            borderWidth: (submit && fromDateError)? 2 : 1, borderStyle: (submit && fromDateError)? 'dashed' : 'solid'
                                        }, getWidthnHeight(40, 7)]}>
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
                                                showToDatePicker: false, fromDateError: false
                                            }, () => this.startSearch());
                                        }} 
                                    />
                                )}
                                <View style={styles.forDate}>
                                    <Text style={[{fontSize: (fontSizeH4().fontSize - 4), color: '#1363DF', fontWeight: 'bold', textAlign: 'center'}, styles.boldFont]}>From Date</Text>
                                </View>
                            </View>  
                            {/* <View style={[getWidthnHeight(40, 7)]}>
                                <TouchableOpacity 
                                    onPress={() => this.setState({showFromTimePicker: !showFromTimePicker})}
                                >
                                    <View 
                                        style={[{
                                            alignItems: 'center', justifyContent: 'center', borderRadius: 5, borderColor: (submit && fromTimeError)? 'red' : '#C4C4C4', 
                                            borderWidth: (submit && fromTimeError)? 2 : 1, borderStyle: (submit && fromTimeError)? 'dashed' : 'solid'
                                        }, getWidthnHeight(40, 7)]}>
                                        <Text style={[{color: 'white', fontSize: (fontSizeH4().fontSize + 2)}]}>{fromTime || 'Select Time'}</Text>
                                    </View>
                                </TouchableOpacity>
                                {(showFromTimePicker) && (
                                    <DateTimePicker 
                                        styleBox={{flex: 1}}
                                        //display={(Platform.OS === 'android')? "default" : "clock"}
                                        minuteInterval={(Platform.OS === 'android')? 1 : 5}
                                        date={fromMaxDate}
                                        androidMode='default'
                                        mode={'time'}
                                        is24Hour={false}
                                        placeholder='Select Time'
                                        format='hh:mm A'
                                        //minDate={fromMinDate}
                                        //maxDate={fromMaxDate}
                                        onDateChange={(event, newTime) => {
                                            const { toTime } = this.state;
                                            const time = moment(newTime).format("hh:mm A");
                                            // console.log("@@@ FROM TIME: ", typeof time, time, event.nativeEvent)
                                            if(toTime){
                                                var beginningTime = moment(time, 'hh:mm A');
                                                var endTime = moment(toTime, 'hh:mm A');
                                                if(beginningTime.isAfter(endTime)){
                                                    this.setState({toTime: time, toTimeError: false, showToTimePicker: false}, () => this.setState({showToTimePicker: false}))
                                                }
                                            }
                                            this.setState({fromTime: time, fromTimeError: false, showFromTimePicker: false}, () => this.setState({showFromTimePicker: false}))
                                        }} 
                                    />
                                )}
                                <View style={styles.forDate}>
                                    <Text style={[{fontSize: (fontSizeH4().fontSize - 4), color: '#1363DF', fontWeight: 'bold', textAlign: 'center'}, styles.boldFont]}>From Time</Text>
                                </View>
                            </View>   */}
                            <View style={[getWidthnHeight(40, 7)]}>
                                <TouchableOpacity 
                                    disabled={(fromDateError)? fromDateError : false} 
                                    onPress={() => this.setState({showToDatePicker: !showToDatePicker})}
                                >
                                    <View 
                                        style={[{
                                            alignItems: 'center', justifyContent: 'center', borderRadius: 5, borderColor: (submit && toDateError)? 'red' : '#C4C4C4', 
                                            borderWidth: (submit && toDateError)? 2 : 1, borderStyle: (submit && toDateError)? 'dashed' : 'solid'
                                        }, getWidthnHeight(40, 7)]}>
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
                                            }, () => this.startSearch());
                                        }} 
                                    />
                                )}
                                <View style={styles.forDate}>
                                    <Text style={[{fontSize: (fontSizeH4().fontSize - 4), color: '#1363DF', fontWeight: 'bold', textAlign: 'center'}, styles.boldFont]}>To Date</Text>
                                </View>
                            </View> 
                        </View>
                        {/* <View style={[{flexDirection: 'row', justifyContent: 'space-evenly'}, getWidthnHeight(90)]}>
                            <View style={[getWidthnHeight(40, 7)]}>
                                <TouchableOpacity 
                                    disabled={(fromDateError)? fromDateError : false} 
                                    onPress={() => this.setState({showToDatePicker: !showToDatePicker})}
                                >
                                    <View 
                                        style={[{
                                            alignItems: 'center', justifyContent: 'center', borderRadius: 5, borderColor: (submit && toDateError)? 'red' : '#C4C4C4', 
                                            borderWidth: (submit && toDateError)? 2 : 1, borderStyle: (submit && toDateError)? 'dashed' : 'solid'
                                        }, getWidthnHeight(40, 7)]}>
                                        <Text style={[{color: 'white', fontSize: (fontSizeH4().fontSize + 2)}]}>{toDate || 'Select Date'}</Text>
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
                                            });
                                        }} 
                                    />
                                )}
                                <View style={styles.forDate}>
                                    <Text style={[{fontSize: (fontSizeH4().fontSize - 4), color: '#1363DF', fontWeight: 'bold', textAlign: 'center'}, styles.boldFont]}>To Date</Text>
                                </View>
                            </View>   
                            <View style={[getWidthnHeight(40, 7)]}>
                                <TouchableOpacity 
                                    onPress={() => this.setState({showToTimePicker: !showToTimePicker})}
                                >
                                    <View 
                                        style={[{
                                            alignItems: 'center', justifyContent: 'center', borderRadius: 5, borderColor: (submit && toTimeError)? 'red' : '#C4C4C4', 
                                            borderWidth: (submit && toTimeError)? 2 : 1, borderStyle: (submit && toTimeError)? 'dashed' : 'solid'
                                        }, getWidthnHeight(40, 7)]}>
                                        <Text style={[{color: 'white', fontSize: (fontSizeH4().fontSize + 2)}]}>{toTime || 'Select Time'}</Text>
                                    </View>
                                </TouchableOpacity>
                                {(showToTimePicker) && (
                                    <DateTimePicker 
                                        styleBox={{flex: 1}}
                                        //display={(Platform.OS === 'android')? "default" : "clock"}
                                        minuteInterval={(Platform.OS === 'android')? 1 : 5}
                                        date={toMaxDate}
                                        androidMode='default'
                                        mode='time'
                                        is24Hour={false}
                                        placeholder='Select Time'
                                        format='hh:mm A'
                                        //minDate={fromMinDate}
                                        //maxDate={moment().toDate()}
                                        onDateChange={(event, newTime) => {
                                            const { fromTime } = this.state;
                                            const time = moment(newTime).format("hh:mm A");
                                            console.log("### TO TIME: ", fromTime, typeof time, time)
                                            var beginningTime = moment(fromTime, 'hh:mm A');
                                            var endTime = moment(time, 'hh:mm A');
                                            if(endTime.isAfter(beginningTime)){
                                                this.setState({toTime: time, toTimeError: false}, () => this.setState({showToTimePicker: false}))
                                            }
                                            this.setState({showToTimePicker: false})
                                        }} 
                                    />
                                )}
                                <View style={styles.forDate}>
                                    <Text style={[{fontSize: (fontSizeH4().fontSize - 4), color: '#1363DF', fontWeight: 'bold', textAlign: 'center'}, styles.boldFont]}>To Time</Text>
                                </View>
                            </View>  
                        </View> */}
                        {/* <TouchableOpacity
                            activeOpacity={0.6}
                            style={[{backgroundColor: '#1089FF', borderRadius: 5}, getMarginTop(3)]}
                            onPress={() => this.startSearch()}
                        >
                            <Text style={[{color: 'white', paddingVertical: getMarginTop(1.5).marginTop, paddingHorizontal: getMarginHorizontal(5).marginHorizontal, fontSize: fontSizeH4().fontSize + 5}]}>Submit</Text>
                        </TouchableOpacity> */}
                        <View 
                            style={[{
                                alignItems: (data.length > 0)? 'flex-start' : 'center', width: '100%', flex: 1, 
                                borderColor: 'red', borderWidth: 0, paddingVertical: getMarginTop(1).marginTop,
                                justifyContent: (data.length > 0)? 'flex-start' : 'center'
                            }, getMarginVertical(1)]}
                        >
                            {(data.length > 0)? (
                                <FlatList 
                                    data={data}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({item, index}) => {
                                        return (
                                            <View style={[{alignItems: 'flex-start', padding: getMarginTop(2).marginTop, borderWidth: 0, borderColor: 'black'}, getWidthnHeight(95)]}>
                                                <Text style={{fontSize: fontSizeH4().fontSize + 2}}>{`${item.day}, ${moment(item.date).format("MMMM DD")}`}</Text>
                                                <Text style={{fontSize: fontSizeH4().fontSize - 4}}>{item.time}</Text>
                                                <Text style={[{fontWeight: 'bold', fontSize: fontSizeH4().fontSize + 2}, getMarginTop(1)]}>{item.value} steps</Text>
                                            </View>
                                        );
                                    }}
                                />
                            )
                            :
                                <Text style={{fontSize: fontSizeH3().fontSize - 5, color: '#C4C4C4'}}>
                                    {(submit)? 'No Results Found' : 'Click "Submit" to search'}
                                </Text>
                            }
                        </View>
                    </View>  
                </View>
            </ActionModal>
        );
    }
}

const styles = {
    forDate: {
        position: 'absolute',
        backgroundColor: 'white',
        justifyContent: 'center', 
        //alignSelf: 'center', 
        borderColor: 'black', 
        borderWidth: 0, 
        marginTop: -6, 
        width: 50, 
        height: 16,
        marginLeft: 10,
    },
  };

export { StepCountModal };