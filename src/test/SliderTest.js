import React, {Component} from 'react';
import {Animated, View, TouchableOpacity, StyleSheet} from 'react-native';
import {getWidthnHeight, getMarginLeft, getMarginTop} from '../NewComponents/common';

const AnimateTouch = Animated.createAnimatedComponent(TouchableOpacity);

class SliderTest extends Component {
    constructor(props){
        super(props)
            this.state = {
                animateSlider: new Animated.Value(0),
                animateBackGround: new Animated.Value(0),
            };
    }

    static getDerivedStateFromProps(props, prevState){
        //console.log("SLIDER TEST PROPS: ", props, prevState)
        const value = props.value;
        const delay = props.delay;
        const animateSlider = prevState.animateSlider;
        const animateBackGround = prevState.animateBackGround;
        if(!value){
            Animated.parallel([
                Animated.timing(animateSlider, {
                    toValue: 0,
                    duration: delay
                }),
                Animated.timing(animateBackGround, {
                    toValue: 0,
                    duration: delay
                })
            ]).start();
        }else{
            Animated.parallel([
                Animated.timing(animateSlider, {
                    toValue: 1,
                    duration: delay
                }),
                Animated.timing(animateBackGround, {
                    toValue: 1,
                    duration: delay
                })
            ]).start();
        }
    }

    slider(){
        const {onSlide, value} = this.props;
        if(!value){
            onSlide(true);
        }else{
            onSlide(false);
        }
    }

    render(){
        const {animateSlider, animateBackGround} = this.state;
        const {activeColor = '#26DA7B', title = [], value, inactiveColor = 'grey', buttonColor = 'white', buttonBorderColor = 'rgba(196, 196, 196, 0.5)'} = this.props;
        const sliderAnimation = {
            transform: [{
                translateX: animateSlider.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, getWidthnHeight(6).width]
                })
            }]
        }
        const backgroundInterpolate = {
            backgroundColor: animateBackGround.interpolate({
                inputRange: [0, 0.3, 1],
                outputRange: ['transparent', 'transparent', activeColor]
            }),
            width: animateBackGround.interpolate({
                inputRange: [0, 1],
                outputRange: [0, getWidthnHeight(11).width]
            })
        }
        const colorStyle = {
            backgroundColor: animateBackGround.interpolate({
                inputRange: [0, 0.7, 1],
                outputRange: [inactiveColor, inactiveColor, 'transparent']
            })
        }
        return (
            <View style={{alignItems: 'center'}}>
                <AnimateTouch activeOpacity={0.9} onPress={() => this.slider()} style={[{borderRadius: getWidthnHeight(11).width, backgroundColor: colorStyle.backgroundColor, justifyContent: 'center', alignItems: 'center'}, getWidthnHeight(11, 2.5)]}>
                    <Animated.View style={[StyleSheet.absoluteFill, {borderRadius: getWidthnHeight(11).width, height: getWidthnHeight(undefined, 2.5).height}, getMarginLeft(0), backgroundInterpolate]} />
                    <Animated.View style={[{
                        width: getWidthnHeight(6).width, height: getWidthnHeight(6).width, borderRadius: getWidthnHeight(6).width, alignSelf: 'flex-start',
                        backgroundColor: buttonColor, shadowColor: '#000', elevation: 4, shadowRadius: getWidthnHeight(6).width, alignItems: 'center', 
                        justifyContent: 'center', borderColor: buttonBorderColor, borderWidth: 1}, getMarginLeft(-0.1), sliderAnimation]}/>
                </AnimateTouch>
                {(title.length === 2) &&
                    <View>
                        <Animated.Text style={[getMarginTop(0.5)]}>
                            {(!value) && title[0]}
                            {(value) && title[1]}
                        </Animated.Text>
                    </View>
                }
            </View>
        );
    }
}

export {SliderTest};