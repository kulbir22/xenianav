import React from "react";
import {Animated, View} from 'react-native';
import {getWidthnHeight} from './width';

const Explosion = ({
    innerCircle, inner1, inner2, outer, fireCrackerColor, rocketAnimation
}) => {
    return (
        <Animated.View style={[rocketAnimation, {borderColor: 'cyan', borderWidth: 0, width: getWidthnHeight(20).width, height: getWidthnHeight(20).width, alignItems: 'center', justifyContent: 'center'}]}>
            {/* OUTER RING */}
            <Animated.View style={[{ position: 'absolute', backgroundColor: 'transparent',
                borderColor: fireCrackerColor, borderWidth: 5, width: getWidthnHeight(20).width, height: getWidthnHeight(20).width,
                borderRadius: getWidthnHeight(20).width, borderStyle: 'dotted', alignItems: 'center', justifyContent: 'center'
            }, outer]}/>
            {/* INNER 1st RING */}
            <Animated.View style={[{ position: 'absolute', backgroundColor: 'transparent',
                borderColor: fireCrackerColor, borderWidth: 5, width: getWidthnHeight(15).width, height: getWidthnHeight(15).width,
                borderRadius: getWidthnHeight(15).width, borderStyle: 'dotted', alignItems: 'center', justifyContent: 'center'
            }, inner1]}/>
            {/* INNER 2nd RING */}
            <Animated.View style={[{ position: 'absolute', backgroundColor: 'transparent',
                borderColor: fireCrackerColor, borderWidth: 5, width: getWidthnHeight(10).width, height: getWidthnHeight(10).width,
                borderRadius: getWidthnHeight(10).width, borderStyle: 'dotted', alignItems: 'center', justifyContent: 'center'
            }, inner2]}/>
            {/* INNER CIRCLE */}
            <Animated.View style={[{borderColor: fireCrackerColor, borderWidth: 0,  
                backgroundColor: fireCrackerColor, width: getWidthnHeight(5).width, height: getWidthnHeight(5).width,
                borderRadius: getWidthnHeight(5).width, alignItems: 'center', justifyContent: 'center'
            }, innerCircle]}/>
        </Animated.View>
    )
}

export {Explosion};