import React, {Component} from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import Close from 'react-native-vector-icons/EvilIcons';

class InputText extends Component{
    
    render() {
        const {
            placeholder, editable, style,
            value, onChangeText, clearSearch
        } = this.props;
    return(
        <View style={[styles.container, style]}>
            <TextInput 
                placeholder={placeholder}
                editable={editable}
                style={{borderColor: 'red', borderWidth: 0, flex: 1}}
                value={value}
                onChangeText={onChangeText}
            />
            {(value)?
                <TouchableOpacity onPress={clearSearch}>
                    <Close name='close' size={20}/>
                </TouchableOpacity>
            :
                <View style={{width: 20}}/>
            }
        </View>
    )};
}

const styles = {
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    }
}

export {InputText};