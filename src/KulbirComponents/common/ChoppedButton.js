import React, {Component} from 'react';
import {View, Text, StyleSheet, Platform, Animated, PanResponder, Keyboard, TouchableOpacity} from 'react-native';
import {getWidthnHeight, fontSizeH4} from './width';

class ChoppedButton extends Component{
    constructor(props){
        super(props)
        this.state = {
            startAnimation: true,
            animateLeftBox: new Animated.Value(0),
            animateMiddleBox: new Animated.Value(0),
            animateRightBox: new Animated.Value(0)
        }
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => false,
            onPanResponderGrant: (evt, gestureState) => {
                //console.log("PRESSED BUTTON")
                this.startButtonAnimation();
            },
            onPanResponderRelease: (evt, gestureState) => {
                //console.log("BUTTON RELEASED")
                this.props.onPress();
                this.endButtonAnimation();
            },
        })
    }

    startButtonAnimation(){
        const {animateLeftBox, animateMiddleBox, animateRightBox, startAnimation} = this.state;
        Animated.sequence([
            Animated.timing(animateLeftBox, {
                toValue: 1,
                duration: 100
            }),
            Animated.timing(animateMiddleBox, {
                toValue: 1,
                duration: 100
            }),
            Animated.timing(animateRightBox, {
                toValue: 1,
                duration: 100
            })
        ]).start();
    }

    endButtonAnimation(){
        const {animateLeftBox, animateMiddleBox, animateRightBox} = this.state;
        Keyboard.dismiss();
        console.log("ENDING")
        Animated.sequence([
            Animated.timing(animateRightBox, {
                toValue: 0,
                duration: 100
            }),
            Animated.timing(animateMiddleBox, {
                toValue: 0,
                duration: 100
            }),
            Animated.timing(animateLeftBox, {
                toValue: 0,
                duration: 100
            }),
        ]).start();
    }

    render(){
        const {animateLeftBox, animateMiddleBox, animateRightBox} = this.state;
        const {
            leftBoxSize = {width: getWidthnHeight(6).width, height: getWidthnHeight(undefined, 6).height}, 
            middleBoxSize = {width: getWidthnHeight(25).width, height: getWidthnHeight(undefined, 6).height}, 
            rightBoxSize = {width: getWidthnHeight(6).width, height: getWidthnHeight(undefined, 6).height},
            title = "SUBMIT", titleStyle = null, buttonColor = "#039FFD", underlayColor = "#EA304F"
        } = this.props;
        const animateLeftStyle = {
            width: animateLeftBox.interpolate({
                inputRange: [0, 1],
                outputRange: [0, leftBoxSize.width]
            })
        }
        const animateMiddleStyle = {
            width: animateMiddleBox.interpolate({
                inputRange: [0, 1],
                outputRange: [0, middleBoxSize.width]
            })
        }
        const animateRightStyle = {
            width: animateRightBox.interpolate({
                inputRange: [0, 1],
                outputRange: [0, rightBoxSize.width]
            })
        }
        return (
            <View {...this._panResponder.panHandlers} style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}]}>
                <View style={[{
                    backgroundColor: buttonColor, borderTopLeftRadius: getWidthnHeight(1.5).width, 
                    borderBottomLeftRadius: getWidthnHeight(1.5).width, borderRightWidth: getWidthnHeight(0.6).width,
                    borderRightColor: '#FFFFFF', overflow: 'hidden'}, leftBoxSize
                ]}>
                    <Animated.View style={[{backgroundColor: underlayColor, height: leftBoxSize.height}, animateLeftStyle]}/>    
                </View>
                <View style={[{backgroundColor: buttonColor, alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}, middleBoxSize]}>
                    <Animated.View style={[{alignSelf: 'flex-start', position: 'absolute', backgroundColor: underlayColor, height: middleBoxSize.height}, animateMiddleStyle]}/>
                    <Text style={[{letterSpacing: 2, fontSize: fontSizeH4().fontSize + 2, fontWeight: 'bold'}, titleStyle, styles.boldFont]}>{title}</Text>
                </View>
                <View style={[{
                    backgroundColor: buttonColor, borderTopRightRadius: getWidthnHeight(1.5).width, 
                    borderBottomRightRadius: getWidthnHeight(1.5).width, borderLeftWidth: getWidthnHeight(0.6).width,
                    borderLeftColor: '#FFFFFF', overflow: 'hidden'}, rightBoxSize]}>
                    <Animated.View style={[{backgroundColor: underlayColor, height: rightBoxSize.height}, animateRightStyle]}/>        
                </View>
            </View>
        );
    }
}

const BasicChoppedButton = (
    {
        leftBoxSize = {width: getWidthnHeight(6).width, height: getWidthnHeight(undefined, 6).height}, 
        middleBoxSize = {width: getWidthnHeight(25).width, height: getWidthnHeight(undefined, 6).height}, 
        rightBoxSize = {width: getWidthnHeight(6).width, height: getWidthnHeight(undefined, 6).height},
        title = "SUBMIT", titleStyle = null, buttonColor = "#039FFD", onPress = () => {}
    }
    ) => {
        return (
            <TouchableOpacity 
                activeOpacity={0.7}
                style={[{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
                }]}
                onPress={onPress}
            >
                <>
                    <View style={[{
                        backgroundColor: buttonColor, borderTopLeftRadius: getWidthnHeight(1.5).width, 
                        borderBottomLeftRadius: getWidthnHeight(1.5).width, borderRightWidth: getWidthnHeight(0.6).width,
                        borderRightColor: '#FFFFFF', overflow: 'hidden'}, leftBoxSize
                    ]}>
                        <Animated.View style={[{height: leftBoxSize.height}]}/>    
                    </View>
                    <View style={[{backgroundColor: buttonColor, alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}, middleBoxSize]}>
                        <Animated.View style={[{alignSelf: 'flex-start', position: 'absolute', height: middleBoxSize.height}]}/>
                        <Text style={[{letterSpacing: 2, fontSize: fontSizeH4().fontSize + 2, fontWeight: 'bold'}, titleStyle, styles.boldFont]}>{title}</Text>
                    </View>
                    <View style={[{
                        backgroundColor: buttonColor, borderTopRightRadius: getWidthnHeight(1.5).width, 
                        borderBottomRightRadius: getWidthnHeight(1.5).width, borderLeftWidth: getWidthnHeight(0.6).width,
                        borderLeftColor: '#FFFFFF', overflow: 'hidden'}, rightBoxSize]}>
                        <Animated.View style={[{height: rightBoxSize.height}]}/>        
                    </View>
                </>
            </TouchableOpacity>
        );
    }

const styles = StyleSheet.create({
    boldFont: {
        ...Platform.select(
            {
                android: {
                    fontFamily: ''
                }
            }
        )
    }
})

export {ChoppedButton, BasicChoppedButton};