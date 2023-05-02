import React from 'react';
import { View, Platform } from 'react-native';
import DatePicker from '@react-native-community/datetimepicker';

const DateTimePicker = ({
    date, 
    minuteInterval = 1,
    display = 'default',
    styleBox = {},
    androidMode, 
    mode, 
    placeholder, 
    format, 
    minDate, 
    maxDate, 
    onDateChange,
    style,
    containerStyle,
    clearDate = false,
    onPress,
    is24Hour = false,
    disabled = false,
}) => {
    return (            
        <View style={[styles.datePicker, containerStyle]}>
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
                onChange={onDateChange}
                style={{...Platform.select({ios: styleBox})}}
            />
        </View>
    );
};

const styles = {
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center'
    },
};

export {DateTimePicker};