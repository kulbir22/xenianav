import React from 'react';
import {View, Text, Image,TouchableOpacity} from 'react-native';
import DatePicker from '@react-native-community/datetimepicker';

const DateSelector = ({
    date, 
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
                disabled={disabled}
                value={date}
                dateFormat={format}
                is24Hour={is24Hour}
                mode={mode}
                minimumDate={minDate}
                maximumDate={maxDate}
                onChange={onDateChange}
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

export {DateSelector};