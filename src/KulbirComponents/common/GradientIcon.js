import React from 'react';
import {View, Text, Platform} from 'react-native';
import { LinearTextGradient } from 'react-native-text-gradient';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { getWidthnHeight } from './width';

const GradientIcon = (
    {
        start = {x: 0, y: 0}, end = {x: 0.15, y: 0},
        colors = ["#039FFD", "#EA304F"],
        containerStyle = getWidthnHeight(7),
        icon=(<IonIcons name={'location-sharp'} style={{backgroundColor: 'transparent'}} size={getWidthnHeight(5).width}/>),
        hiddenIcon=(<IonIcons name={'location-sharp'} style={{opacity: 0}} size={getWidthnHeight(5).width}/>)
    }
) => {
    return (
        <View style={[containerStyle]}>
            <MaskedView maskElement={icon}>
                <LinearGradient 
                    start={start} 
                    end={end}
                    colors={colors}
                >
                    <View style={{opacity: 0}}>
                        {icon}
                    </View>
                </LinearGradient>
            </MaskedView>
        </View>
    );
}

export {GradientIcon};