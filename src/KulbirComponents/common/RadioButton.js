import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {getWidthnHeight} from './width';

const RadioEnable = ({title, onPress, outerCircle, innerCircle, containerStyle, textContainerStyle}) => {
    return(
        <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
        <View style={[{flexDirection: 'row', justifyContent: 'space-evenly', borderWidth: 0, borderColor: 'black'}, getWidthnHeight(40), containerStyle]}>
            <View style={[{width: 32, height: 32, borderWidth: 5, borderColor: 'rgba(16, 121, 213, 0.50)', borderRadius: 32, justifyContent: 'center', alignItems: 'center'}, outerCircle]}>
                <View style={[{width: 18, height: 18, borderRadius: 20, backgroundColor: '#1079D5'}, innerCircle]}/>
            </View>
            <View style={[{justifyContent: 'center'}, textContainerStyle]}>
                <Text style={{textAlignVertical: 'center'}}>{title}</Text>
            </View>
        </View>
        </TouchableOpacity>
    )
}

const RadioDisable = ({title, onPress, outerCircle, containerStyle, textContainerStyle}) => {
    return(
        <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
        <View style={[{flexDirection: 'row', justifyContent: 'space-evenly', borderWidth: 0, borderColor: 'black'}, getWidthnHeight(40), containerStyle]}>
            <View style={[{width: 32, height: 32, borderWidth: 10, borderColor: 'rgba(157, 157, 157, 0.50)', borderRadius: 32, justifyContent: 'center', alignItems: 'center'}, outerCircle]}/>
            <View style={[{justifyContent: 'center'}, textContainerStyle]}>
                <Text style={{textAlignVertical: 'center'}}>{title}</Text>
            </View>
        </View>
        </TouchableOpacity>
    )
}

export {RadioEnable, RadioDisable};
