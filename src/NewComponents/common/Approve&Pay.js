import React, {Component} from 'react';
import { View, Text, TouchableOpacity, Keyboard } from 'react-native';
import Modal from 'react-native-modal';
import AlertIcon from 'react-native-vector-icons/Foundation';
import moment from 'moment';
import {getWidthnHeight, getMarginHorizontal, getMarginTop, getMarginLeft, fontSizeH3, fontSizeH4, fontSizeH2, fontSize_H3, getMarginVertical, getMarginBottom,} from './width';
import {CustomTextInput} from './CustomTextInput';
import {DateTimePicker} from './DateTimePicker';
import {DismissKeyboard} from './DismissKeyboard';

const colorTitle = '#0B8EE8';

class Approve_Pay extends Component {
    constructor(props){
        super(props)
        let year = `${moment().year()}`;
        let month = `${moment().month() + 1}`;
        month = (month < 10)? `0${month}` : month;
        const currentDate = `${year}-${month}-${moment().date()}`;
        const currentTime = "12:00 AM";
        const currentDateTime = `${currentDate} ${currentTime}`;
        const utcTimeStamp = moment(currentDateTime, "YYYY-MM-DD hh:mm A").utc().toDate();
        this.state = {
            fromDate: moment().format("YYYY-MM-DD"),
            fromTimeStamp: moment().valueOf(),
            fromTime: '12:00 AM',
            fromMinDate: utcTimeStamp,
            showFromDatePicker: false,
            utr: '',
            utrError:  true,
            date: '',
            dateError: true,
            submit: false,
            alphaNumeric: false,
            checkError: function(){
                return (this.utrError === false && this.dateError === false)
            }
        }
    }

    componentDidMount(){
        const {utrValue = '', utrDate = ''} = this.props;
        if(utrValue){
            this.setState({utr: utrValue})
            if(utrValue){
                this.setState({utrError: false})
            }else{
                this.setState({utrError: true})
            }
        }
        if(utrDate){
            this.setState({date: utrDate, dateError: false})
        }
    }

    submitForm(){
        const {approvePay, toggle} = this.props;
        const {utr, date} = this.state;
        const checkError = this.state.checkError();
        this.setState({submit: true})
        if(checkError){
            toggle(utr, date);
            approvePay();
        }
    }

    render(){
        const {utr, utrError, date, dateError, submit, fromDate, fromMinDate, fromTime, fromTimeStamp, showFromDatePicker} = this.state;
        const {containerStyle, isVisible, toggle, subContainer, utrValue = ''} = this.props;
        return (
            <View>
                <Modal 
                    isVisible={isVisible}
                    onBackdropPress={() => toggle(utr, date)}
                    animationIn="bounceInLeft"
                    animationInTiming={800}
                    animationOut="slideOutRight"
                    animationOutTiming={500}
                >
                    <View style={[containerStyle]}>
                        <DismissKeyboard>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-between'}}>
                            <View style={[{
                                backgroundColor: '#01937C', borderTopLeftRadius: getWidthnHeight(undefined, 1).height, 
                                borderTopRightRadius: getWidthnHeight(undefined, 1).height}, getWidthnHeight(90, 1)]}/>
                            <View style={[{
                                borderBottomLeftRadius: getWidthnHeight(undefined, 1).height,
                                borderBottomRightRadius: getWidthnHeight(undefined, 1).height}, subContainer]}>
                                <View style={[{alignItems: 'center'}]}>
                                    <Text style={[getMarginHorizontal(2), {fontSize: fontSizeH4().fontSize + 1}]}>UTR No.</Text>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <CustomTextInput 
                                            placeholder={' Type here '}
                                            value={this.state.utr}
                                            prefillEnable={(utrValue)? true : false}
                                            inactiveTitleFontSize={fontSizeH4().fontSize + 1}
                                            inactiveTitleHeight={getWidthnHeight(undefined, 3).height}
                                            activeTitleFontSize={fontSizeH4().fontSize - 3}
                                            onChangeText={(utr) => {
                                                this.setState({utr: utr.trimLeft()}, () => {
                                                    const {utr} = this.state;
                                                    if(utr){
                                                        this.setState({utrError: false})
                                                    }else{
                                                        this.setState({utrError: true})
                                                    }
                                                })
                                            }}
                                            containerStyle={[{
                                                borderColor: (submit && utrError)? 'red' : '#C4C4C4',
                                                borderStyle: (submit && utrError)? 'dashed' : 'solid',
                                                borderWidth: (submit && utrError)? 2 : 1,
                                                justifyContent: 'center', alignItems: 'stretch'
                                            }, getWidthnHeight(50, 6)]}
                                            textInputStyle={[{borderColor: 'black', borderWidth: 0, fontSize: fontSizeH4().fontSize + 2}]}
                                            inactiveTitleColor='dimgrey'
                                            activeTitleColor={colorTitle}
                                        />
                                        {/* {<View style={[{
                                            borderColor: '#C4C4C4', borderWidth: 1, width: getWidthnHeight(9).width, alignItems: 'center', justifyContent: 'center',
                                            height: getWidthnHeight(9).width, borderRadius: getWidthnHeight(9).width, }, getMarginHorizontal(2)]}>
                                            <Text style={[fontSizeH4()]}>{utr.length}</Text>
                                        </View>} */}
                                    </View>
                                </View>
                                <View style={[{alignItems: 'center'}]}>
                                    <Text style={[getMarginHorizontal(2), {fontSize: fontSizeH4().fontSize + 1}]}>Payment Date</Text>
                                    {/* <DateSelector 
                                        containerStyle={[{
                                            borderColor: (submit && dateError)? 'red' : '#C4C4C4', justifyContent: 'center',
                                            borderStyle: (submit && dateError)? 'dashed' : 'solid', borderWidth: (submit && dateError)? 2 : 1,
                                            }, getWidthnHeight(37, 6), getMarginTop(1.5), getMarginLeft(0)]}
                                        //style={[(travelDateTime === '')? {borderWidth: 0, borderColor: 'green', width: getWidthnHeight(42).width} : {width: getWidthnHeight(37).width}]}
                                        style={[{borderWidth: 0, borderColor: 'green', width: getWidthnHeight(37).width}]}
                                        date={this.state.date}
                                        maxDate={moment().toDate()}
                                        dateFont={{fontSize: (fontSizeH4().fontSize + 1)}}
                                        androidMode='default'
                                        mode='date'
                                        placeholder='Date'
                                        format='DD-MM-YYYY' 
                                        onDateChange={(date) => {
                                            this.setState({date: date, dateError: false})
                                        }} 
                                    /> */}
                                    <View style={[{borderColor: 'red', borderWidth: 0}, getWidthnHeight(37, 6)]}>
                                        <TouchableOpacity 
                                            onPress={() => this.setState({showFromDatePicker: !showFromDatePicker})}
                                        >
                                            <View 
                                                style={[{
                                                    alignItems: 'center', justifyContent: 'center', 
                                                    borderColor: (submit && dateError)? 'red' : '#C4C4C4', justifyContent: 'center',
                                                    borderStyle: (submit && dateError)? 'dashed' : 'solid', borderWidth: (submit && dateError)? 2 : 1
                                                }, getWidthnHeight(37, 6)]}>
                                                <Text style={[{color: (date)? '#000000' : '#C4C4C4', fontSize: (fontSizeH4().fontSize + 2)}]}>{date || 'Select Date'}</Text>
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
                                                maxDate={fromMinDate}
                                                onDateChange={(event, newDate) => {
                                                    if(event.type === "dismissed"){
                                                        this.setState({showFromDatePicker: !showFromDatePicker})
                                                        return;
                                                    }
                                                    this.setState({showFromDatePicker: !showFromDatePicker})
                                                    const fromTimeStamp = event.nativeEvent.timestamp;
                                                    this.setState({
                                                        date: moment(newDate).format("YYYY-MM-DD"), fromTimeStamp,
                                                        showToDatePicker: false, dateError: false
                                                    }, () => {});
                                                    Keyboard.dismiss();
                                                }} 
                                            />
                                        )}
                                    </View> 
                                </View>
                                <TouchableOpacity onPress={() => this.submitForm()}>
                                    <View style={[{backgroundColor: '#01937C', borderRadius: 10, alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(30, 6)]}>
                                        <Text style={{color: 'white'}}>SUBMIT</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        </DismissKeyboard>
                    </View>
                </Modal>
            </View>
        );
    }
}

export {Approve_Pay};