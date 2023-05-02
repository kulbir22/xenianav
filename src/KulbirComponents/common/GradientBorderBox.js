import React from 'react';
import { Platform } from 'react-native';
import {View, Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import {getWidthnHeight, fontSizeH4, getMarginTop} from './width';

const GradientBorderBox = ({title = null, titleStyle,  subTitle = null, subTitleStyle, onPress = null, gradient, style, innerBoxStyle, locations}) => {
    return(
        <TouchableOpacity activeOpacity={(onPress)? 0.7 : 1} onPress={onPress}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <LinearGradient 
                    start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                    colors={gradient}
                    style={[styles.button, style]}>
                    <View style={[{
                        backgroundColor: 'white', alignItems: 'center', borderColor: 'black', 
                        borderWidth: 0, justifyContent: 'center'}, innerBoxStyle]}>
                        {(title)?
                            <Text style={[{fontWeight: '700', fontSize: fontSizeH4().fontSize + 4}, styles.boldFont, getMarginTop(-1), titleStyle]}>{title}</Text>
                        :
                            null
                        }
                        {(subTitle)?
                            // <LinearTextGradient
                            //     style={[styles.linearStyle]}
                            //     locations={locations}
                            //     colors={gradient}
                            //     start={{ x: 0, y: 0 }}
                            //     end={{ x: 1, y: 0 }}>
                            //     <Text style={[{fontWeight: 'bold', fontSize: fontSizeH4().fontSize + 2}, styles.boldFont, subTitleStyle]}>{subTitle}</Text>
                            // </LinearTextGradient>
                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                <MaskedView maskElement={<Text style={[{fontWeight: 'bold', fontSize: fontSizeH4().fontSize + 2}, styles.boldFont, subTitleStyle]}>{subTitle}</Text>}>
                                    <LinearGradient 
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        colors={gradient}
                                    >
                                        <Text style={[{opacity: 0, fontWeight: 'bold', fontSize: fontSizeH4().fontSize + 2}, styles.boldFont, subTitleStyle]}>{subTitle}</Text>
                                    </LinearGradient>
                                </MaskedView>
                            </View>
                        :
                            null
                        }
                    </View>
                </LinearGradient>
            </View>
        </TouchableOpacity>
    )
}

const styles = {
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000000',
    },
    boldFont: {
        ...Platform.select({
            android: {
                fontFamily: ''
            }
        })
    },
    linearStyle: {
        fontSize: fontSizeH4().fontSize
    }
}

export {GradientBorderBox};