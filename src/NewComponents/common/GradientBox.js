import React from 'react';
import {View, Text, Platform} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { getWidthnHeight, fontSizeH4 } from './width';

const GradientBox = (
    {
        start = {x: 0, y: 0}, end = {x: 0, y: 1.5},
        colors = ["#6243AB", "#000000"],
        containerStyle=getWidthnHeight(90, 10),
        title = '', titleStyle = {}
    }
) => {
    return (
        <View>
            <LinearGradient 
                start={start} end={end}
                colors={colors}
                style={[containerStyle]}    
            >
                {(!!title) && <Text style={[{textAlign: 'center'}, titleStyle]}>{title.replace(/^\w/, (c) => c.toUpperCase())}</Text>}
            </LinearGradient>
        </View>
    );
}

const GradientBorder = (
    {
        start = {x: 0, y: 0}, end = {x: 0.15, y: 0},
        colors = ["#039FFD", "#EA304F"],
        containerStyle=getWidthnHeight(90, 10),
        title = '', 
        titleStyle = {}
    }
) => {
    return (
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <MaskedView maskElement={<View style={[{backgroundColor: 'transparent'}, containerStyle]}/>}>
                <LinearGradient 
                    start={start} end={end}
                    colors={colors}
                >
                    <View style={[{opacity: 0}, containerStyle]}/>
                </LinearGradient>
            </MaskedView>
            <Text style={[{textAlign: 'center', position: 'absolute'}, titleStyle]}>{title}</Text>
        </View>
    );
}

const GradientCircularProgress = (
    {
        start = {x: 0, y: 0}, end = {x: 0.15, y: 0},
        colors = ["#039FFD", "#EA304F"],
        progressComponent,
        containerStyle=getWidthnHeight(90, 10),
        title = '', 
        titleStyle = {}
    }
) => {
    return (
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <MaskedView maskElement={<View style={[{backgroundColor: 'transparent'}]}>{progressComponent}</View>}>
                <LinearGradient 
                    start={start} 
                    end={end}
                    colors={colors}
                >
                    <View style={[{opacity: 0}]}>{progressComponent}</View>
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

export { GradientBox, GradientBorder, GradientCircularProgress };