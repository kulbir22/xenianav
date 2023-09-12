import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Arrow from 'react-native-vector-icons/Feather';
import {getWidthnHeight, fontSizeH3} from './width';

class LoginButton extends Component{
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
                        <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderLeftWidth: 3, borderRightWidth: 3, borderColor: 'white'}, textBoxStyle]}>
                            <Text style={[styles.boldFont, {color:'white', textAlign: 'center', fontWeight: 'bold', borderColor: 'white', borderWidth: 0, textAlign: 'right'}, fontSizeH3()]}>{title}</Text>
                            <Arrow name="arrow-right" size={30} color="white" style={{borderColor: 'white', borderWidth: 0,}}/>
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

export {LoginButton};