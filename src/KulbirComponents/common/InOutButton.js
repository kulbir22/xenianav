import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Arrow from 'react-native-vector-icons/Feather';
import {getWidthnHeight, fontSizeH4} from './width';

class InOutButton extends Component{
    constructor(props){
        super(props)
            this.state = {

            }
    }
    render(){
        const {title, onPress, gradient, style, textBoxStyle, disabled = false} = this.props;
        return (
            <TouchableOpacity disabled={disabled} onPress={onPress}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <LinearGradient 
                        start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                        colors={gradient}
                        style={[styles.button, style]}>
                        <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, textBoxStyle]}>
                            <Text style={[
                                styles.boldFont, {color:'white', textAlign: 'center', borderColor: 'white', 
                                borderWidth: 0, textAlign: 'right', fontWeight: 'bold', fontSize: (fontSizeH4().fontSize + 2)}
                            ]}>
                                {title}
                            </Text>
                        </View>
                    </LinearGradient>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = {
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        shadowColor: '#000000',
    },
    boldFont: {
        ...Platform.select({
            android: {
                fontFamily: ''
            }
        })
    },
}

export {InOutButton};