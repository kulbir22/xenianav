import React, {Component} from 'react';
import {View, Text, TextInput, Animated, TouchableOpacity, StyleSheet, Keyboard, ScrollView, Platform} from 'react-native';
import DatePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

import { getWidthnHeight, getMarginLeft, fontSizeH4 } from './width';

class AnimateDateLabel extends Component {

    constructor(props){
        super(props)
        this.state = {
            animateLabel: new Animated.Value(0),
            fontWeight: 'normal'
        }
    }

    static getDerivedStateFromProps(props, state){
        if(props.date === ''){
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
        const {date} = this.props;
        if(!date){
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

    render(){
        const {
            placeholder = "Date of Birth", date = moment(moment().valueOf()).utc().toDate(), containerStyle, minDate = '2012-01', maxDate = `${moment().year()}-12`,
            onDateChange = () => {}, slideVertical = [0, getWidthnHeight(undefined, -3.5).height], disabled = false,
            placeholderScale = [1, 0.75], slideHorizontal= [0, getWidthnHeight(-2).width], titleStyle = null,
            placeholderColor = ['#C4C4C4', '#0B8EE8'], containerColor = ['#C4C4C4', '#0B8EE8'], dateIcon = null,
            containerBorderWidth = [1, 2], mode = "date", format = "YYYY-MM-DD", style = null, titleContainer = null, 
            minuteInterval = 1, display = 'default', styleBox = {}, androidMode, onPress, is24Hour = false,
            value = '', showFromDatePicker = false, togglePicker = () => {}
        } = this.props;
        const {animateLabel, fontWeight} = this.state;
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
                            onPress={() => togglePicker()}
                        >
                            <View style={[style]}>
                                <Text style={[{color: value? '#000000' : '#C4C4C4', fontSize: (fontSizeH4().fontSize + 2)}]}>{value || 'Select Date'}</Text>
                            </View>
                        </TouchableOpacity>
                        {(showFromDatePicker) && (
                            <DatePicker
                                testID="dateTimePicker"
                                minuteInterval={minuteInterval}
                                disabled={disabled}
                                display={display}
                                value={date}
                                dateFormat={format}
                                is24Hour={is24Hour}
                                mode={mode}
                                minimumDate={minDate}
                                maximumDate={maxDate}
                                onChange={(e, date) => {
                                    this.onFocus();
                                    onDateChange(e, date);
                                    Keyboard.dismiss();
                                }}
                                style={{...Platform.select({ios: styleBox})}}
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