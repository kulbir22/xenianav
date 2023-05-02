import React, { Component } from "react";
import {View, ActivityIndicator, Animated, Easing} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {getWidthnHeight, getMarginTop} from './width';
const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient)

export const DesktopLoader = ({
    scale = 1,
    screenStyle = null,
    baseStyle = null,
    outlineColor = "rgba(44, 57, 75, 0.5)",
    loaderColor = "rgb(19, 111, 232)",
    size = "large",
    loaderScale = 1
}) => {
    return (
        <View style={{alignItems: 'center', transform: [{scale}]}}>
            <View style={[
                getWidthnHeight(30, 9), {alignItems: 'center', justifyContent: 'center', borderWidth: getWidthnHeight(1.05).width, 
                borderColor: outlineColor, borderRadius: getWidthnHeight(3).width
            }, screenStyle]}>
                <ActivityIndicator size={size} color={loaderColor} style={{transform: [{scale: loaderScale}]}}/>     
            </View>
            <View style={[getMarginTop(0.5), getWidthnHeight(40, 0.5), {backgroundColor: outlineColor, borderRadius: getWidthnHeight(3).width}, baseStyle]}/>
        </View>
    );
}

export class BarLoader extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: new Animated.Value(0)
        }
    }

    componentDidMount(){
        this.slideLoader();
    }

    slideLoader(){
        const {loading} = this.state;
        Animated.loop(
            Animated.timing(loading, {
                toValue: 1,
                duration: 2000,
                easing: Easing.ease,
                useNativeDriver: true
            })
        ).start();
    }

    render(){
        const {backgroundColor = '#FF5733'} = this.props;
        const {loading} = this.state;
        const animatedStyle = {
            transform: [
                {
                    translateX: loading.interpolate({
                        inputRange: [0, 1],
                        outputRange: [getWidthnHeight(-50).width, getWidthnHeight(80).width]
                    })
                }
            ],
            // opacity: loading.interpolate({
            //     inputRange: [0, 0.1, 1],
            //     outputRange: [0, 0.5, 1]
            // })
        }
        return (
            <View style={[{backgroundColor: backgroundColor, alignItems: 'flex-start'}, getWidthnHeight(100, 1)]}>
                <AnimatedGradient 
                    start={{x: 0, y: 1}} end={{x: 1, y: 0}}
                    locations={[0.30, 0.70, 1]}
                    colors={['transparent', 'yellow', 'transparent']}
                    style={[getWidthnHeight(50, 1), {borderColor: 'white', borderWidth: 0}, animatedStyle]}/>
            </View>
        );
    }
}