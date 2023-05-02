import React, { Component } from 'react';
import { Platform, StyleSheet, Image, Animated} from 'react-native';
import {Text, View, TouchableOpacity, ImageBackground, Linking, FlatList} from 'react-native';
import ActionModal from 'react-native-modal';
import { Svg, Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import {fontSizeH3, fontSizeH4, getMarginBottom, getMarginHorizontal, getMarginLeft, getMarginTop, getMarginVertical, getWidthnHeight} from './width';

class WelcomeModal extends Component{
    constructor(props){
        super(props)
            this.state = {
            }
    }

    render(){
        const { title, subtitle, visible, onDecline, designation, profilePic} = this.props;
        const mainWidth = getWidthnHeight(90).width;
        const subWidth = getWidthnHeight(23).width;
    return (
        <ActionModal 
            isVisible={visible}
            style={{justifyContent: 'center', alignItems: 'center'}}
            onBackdropPress={onDecline}
            animationIn="bounceInLeft"
            animationInTiming={800}
            animationOut="slideOutRight"
            animationOutTiming={500}
        >   
            <View style={[{backgroundColor: 'transparent', borderRadius: 10, alignItems: 'center'}, getWidthnHeight(95)]}>
                <View style={[{backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', borderRadius: 10}, getWidthnHeight(95)]}>
                    <View style={[{alignItems: 'center'}, getMarginVertical(5)]}>
                        <View 
                            style={[{
                                width: getWidthnHeight(30).width, height: getWidthnHeight(30).width, backgroundColor: 'white', borderRadius: getWidthnHeight(15).width,
                                alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#C4C4C4'
                            }]}
                        >
                            <Image source={profilePic} style={{width: getWidthnHeight(28).width, height: getWidthnHeight(28).width, borderColor: 'white', borderWidth: 0, borderRadius: getWidthnHeight(18).width}}/>
                        </View>
                        <Text style={[{color: 'black'}, getMarginTop(1), fontSizeH3()]}>{title}</Text>
                        <View style={{backgroundColor: '#E9007F', alignItems: 'center', justifyContent: 'center', borderRadius: 50}}>
                            <Text style={[{color: 'white', fontSize: (fontSizeH4().fontSize + 1)}, getMarginVertical(1), getMarginHorizontal(6)]}>{designation}</Text>
                        </View>
                        <Text style={[{color: 'black', textAlign: 'center', fontSize: (fontSizeH4().fontSize + 1)}, getMarginTop(2), getMarginHorizontal(4)]}>{subtitle}</Text>
                    </View>
                </View>
            </View>
        </ActionModal>
    )}
};

const styles = {
    boldFont: {
        ...Platform.select({
            android: {
                fontFamily: ''
            }
        })
    }
}

export {WelcomeModal};