import React from 'react';
import {View, Text, Platform} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { getWidthnHeight, fontSizeH4 } from './width';

const GradientText = ({
    title = "Test", style = null, gradient = ["#039FFD", "#EA304F"]
}) => {
    const {linearStyle} = styles;
    return (
        <View>
            <Text>{title}</Text>
        </View>
    );
};

const MaskedGradientText = (
    {
        start = {x: 0, y: 0}, end = {x: 0.15, y: 0},
        colors = ["#039FFD", "#EA304F"],
        title = "Gradient Text", titleStyle={color: '#000000', fontSize: (fontSizeH4().fontSize)}
    }
) => {
    return (
        <View>
            <MaskedView maskElement={<Text style={[{backgroundColor: 'transparent'}, titleStyle, styles.boldFont]}>{title}</Text>}>
                <LinearGradient 
                    start={start} end={end}
                    colors={colors}>
                        <Text style={[{opacity: 0}, titleStyle, styles.boldFont]}>{title}</Text>
                </LinearGradient>
            </MaskedView>
        </View>
    );
}

const styles = {
    linearStyle: { 
        fontWeight: "bold", 
        fontSize: 40,
        ...Platform.select(
            {
                android: {
                    fontFamily: ''
                }
            }
        ) 
    },
    boldFont: {
        ...Platform.select(
            {
                android: {
                    fontFamily: ''
                }
            }
        )
    }
};

export {GradientText, MaskedGradientText};