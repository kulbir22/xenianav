import React, {Component} from 'react';
import {View, Text, TextInput, Animated, TouchableOpacity, StyleSheet, Keyboard, ScrollView, Platform} from 'react-native';
import DatePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

import { DateTimePicker } from './DateTimePicker';
import { getWidthnHeight, getMarginLeft, fontSizeH4 } from './width';

class AnimateDateLabel extends Component {

    constructor(props){
        super(props)
        this.state = {
            animateLabel: new Animated.Value(0),
            fontWeight: 'normal',
            showDatePicker: false
        }
    }

    static getDerivedStateFromProps(props, state){
        if(props.dateValue === ''){
            const animateLabel = state.animateLabel;
            Animated.timing(animateLabel, {
                toValue: 0,
                duration: 200
            }).start();
        }else{
            const animateLabel = state.animateLabel;
            Animated.timing(animateLabel, {
                toValue: 1,
                duration: 200
            }).start();
        }
        return null;
    }

    onFocus(){
        const {dateValue = ''} = this.props;
        if(!dateValue){
            const {animateLabel} = this.state;
            Animated.timing(animateLabel, {
                toValue: 1,
                duration: 200
            }).start();
        }
    }

    onBlur(){
        const {animateLabel} = this.state;
        Animated.timing(animateLabel, {
            toValue: 0,
            duration: 200
        }).start();
    }

    togglePicker(){
        this.setState({showDatePicker: !this.state.showDatePicker})
    }

    render(){
        const {
            placeholder = "Date of Birth", date = moment(moment().valueOf()).utc().toDate(), containerStyle, minDate = '2012-01', maxDate = `${moment().year()}-12`,
            onDateChange = () => {}, slideVertical = [0, getWidthnHeight(undefined, -3.5).height], disabled = false,
            placeholderScale = [1, 0.75], slideHorizontal= [0, getWidthnHeight(-2).width], titleStyle = null,
            placeholderColor = ['#C4C4C4', '#0B8EE8'], containerColor = ['#C4C4C4', '#0B8EE8'], dateIcon = null,
            containerBorderWidth = [1, 2], mode = "date", format = "YYYY-MM-DD", style = null, titleContainer = null, 
            minuteInterval = 1, display = 'default', styleBox = {}, androidMode, onPress, is24Hour = false,
            value = '', dateValue = ''
        } = this.props;
        const {animateLabel, fontWeight, showDatePicker} = this.state;
        const placeholderStyle = {
            transform: [
                {
                    translateX: animateLabel.interpolate({
                        inputRange: [0, 1],
                        outputRange: slideHorizontal
                    })
                },
                {
                    translateY: animateLabel.interpolate({
                        inputRange: [0, 1],
                        outputRange: slideVertical
                    })
                },
                {
                    scale: animateLabel.interpolate({
                        inputRange: [0, 1],
                        outputRange: placeholderScale
                    })
                }
            ],
            color: animateLabel.interpolate({
                inputRange: [0, 1],
                outputRange: placeholderColor
            })
            // fontWeight: animateLabel.interpolate({
            //     inputRange: [0, 1],
            //     outputRange: ['normal', 'bold']
            // }),
        }
        const animateContainer = {
            color: animateLabel.interpolate({
                inputRange: [0, 1],
                outputRange: containerColor
            }),
            borderWidth: animateLabel.interpolate({
                inputRange: [0, 1],
                outputRange: containerBorderWidth
            }),
        }
        return (
            <View>
                <Animated.View style={[containerStyle, {borderColor: animateContainer.color, borderWidth: animateContainer.borderWidth}]}>
                    <View style={{alignItems: 'center'}}>
                        <TouchableOpacity 
                            onPress={() => this.togglePicker()}
                        >
                            <View style={[style]}>
                                <Text style={[{color: dateValue? '#000000' : '#C4C4C4', fontSize: (fontSizeH4().fontSize + 2)}]}>{dateValue}</Text>
                            </View>
                        </TouchableOpacity>
                        {(showDatePicker) && (
                            <DateTimePicker 
                                styleBox={{flex: 1}}
                                date={date}
                                androidMode='default'
                                mode='date'
                                is24Hour={false}
                                placeholder='Select Date'
                                format='YYYY-MM-DD'
                                minDate={minDate}
                                maxDate={maxDate}
                                onDateChange={(event, newDate) => {
                                    if(event.type === "dismissed"){
                                        this.setState({showDatePicker: !showDatePicker})
                                        return;
                                    }
                                    this.setState({showDatePicker: !showDatePicker})
                                    this.onFocus();
                                    const fromTimeStamp = event.nativeEvent.timestamp;
                                    onDateChange(moment(newDate).format("YYYY-MM-DD"), fromTimeStamp, event)
                                    Keyboard.dismiss();
                                }} 
                            />
                        )}
                    </View>
                    <View pointerEvents='none' style={[{position: 'absolute', justifyContent: 'center', borderColor: 'red', borderWidth: 0, alignSelf: 'center'}, titleContainer]}>
                        <Animated.Text style={[{
                            textAlignVertical: 'center', textAlign: 'center', color: '#C4C4C4', zIndex: 1, backgroundColor: 'white', fontWeight: fontWeight
                        }, getMarginLeft(1), placeholderStyle, titleStyle, styles.boldFont]}> {placeholder} </Animated.Text>
                    </View>
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    boldFont:  {
        ...Platform.select(
            {
                android: {
                    fontFamily: ''
                }
            }
        )
    }
})

export {AnimateDateLabel};