import React, {Component} from 'react';
import {View, Text, TextInput} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {getWidthnHeight, fontSizeH4} from './width';

const COLOR1 = "#039FFD";
const COLOR2 = "#EA304F";

class OTPInput extends Component {
    constructor(props){
        super(props)
    }

    render(){
        const {
            containerStyle = null, value = '', onFocus = () => {}, onBlur = () => {}, editable =  true,
            keyboardType = 'numeric', onChangeText = () => {}, fontSize = fontSizeH4().fontSize,
            textBoxStyle = null
        } = this.props;
        return (
            <View style={[{backgroundColor: 'white'}, containerStyle]}>
                <TextInput 
                    value={value}
                    editable={editable}
                    maxLength={1}
                    keyboardType={keyboardType}
                    onChangeText={onChangeText}
                    onFocus={() => onFocus()}
                    onBlur={() => {
                        if(value === ''){
                            onBlur();
                        }
                    }}
                    style={[{alignItems: 'center', justifyContent: 'center', fontSize: fontSize, textAlign: 'center', textAlignVertical: 'center'}, textBoxStyle]}
                />
            </View>
        );
    }
}

export {OTPInput};