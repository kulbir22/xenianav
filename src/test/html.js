import React, {Component} from 'react';
import { PanResponder, StyleSheet } from 'react-native';
import {Text, View, ScrollView, TouchableWithoutFeedback,Platform, Image, PermissionsAndroid, Alert, Animated, Easing, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {Header, SearchIcon, getWidthnHeight, Spinner, CommonModal, IOS_StatusBar, pdfSheet, WaveHeader, getMarginTop, getMarginLeft, Slider} from '../NewComponents/common';
const AnimateGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimateTouch = Animated.createAnimatedComponent(TouchableOpacity);
const name = 'Kulbir Singh';
const icon =(  <View style={{justifyContent: 'center', alignItems: 'center', width: 80, height: 80, borderRadius: 80, borderColor: '#BA135D', borderWidth: 6, backgroundColor: '#FFF5AB'}}>
                    <View style={{width: 60, height: 60, borderWidth: 6, borderColor: '#233E8B', borderRadius: 60, justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{width: 40, height: 40, borderWidth: 6, borderColor: 'tomato', borderRadius: 40, justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{width: 20, height: 20, borderWidth: 6, borderColor: '#185ADB', borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}>
                                <View style={{borderRadius: 10, backgroundColor: 'cyan', width: 10, height: 10}}/>
                            </View>
                        </View>
                    </View>
                </View>
            )
class HTMLView extends Component {
    constructor(props){
    super(props)
        this.state = {
            animated: new Animated.Value(0),
            heads: [
                {
                    image: icon,
                    animation: new Animated.ValueXY(),
                    text: 'Drag Me',
                    id: 0
                },
                {
                    image: icon,
                    animation: new Animated.ValueXY(),
                    id: 1
                },
                {
                    image: icon,
                    animation: new Animated.ValueXY(),
                    id: 2
                },
                {
                    image: icon,
                    animation: new Animated.ValueXY(),
                    id: 3
                },
            ],
            animateLiquid: new Animated.Value(0),
            animateGlow: new Animated.Value(0),
            animateSlider: new Animated.Value(0),
            slide: 1
        };
        // this._panResponder = PanResponder.create({
        //     onStartShouldSetPanResponder: () => true,
        //     onMoveShouldSetPanResponder: () => true,
        //     onPanResponderGrant: (e, gestureState) => {
        //         this.state.heads.map(({animation}) => {
        //             animation.extractOffset();
        //             animation.setValue({x: 0, y: 0})
        //         })
        //     },
        //     onPanResponderMove: (e, {dx, dy}) => {
        //         this.state.heads[0].animation.setValue({
        //             x: dx,
        //             y: dy
        //         })
        //         this.state.heads.slice(1).map(({animation}, index) => {
        //             Animated.sequence([
        //                 Animated.delay(index * 10),
        //                 Animated.spring(animation, {
        //                     toValue: {x: dx, y: dy}
        //                 })
        //             ]).start();
        //         })
        //     }
        // })
    }

    startAnimation(){
        const {animated} = this.state;
        Animated.timing(this.state.animated, {
            toValue: 1,
            duration: 500
        }).start();
    }

    componentDidMount(){
        // const {animateLiquid, animateGlow} = this.state;
        // Animated.stagger(500, [
        //     Animated.timing(animateLiquid, {
        //         toValue: 1,
        //         duration: 1000
        //     }),
        //     Animated.loop(
        //         Animated.timing(animateGlow, {
        //             toValue: 1,
        //             duration: 2000,
        //             //easing: Easing.elastic(1)
                    
        //         })
        //     )
        // ]).start()
    }

    render(){
        const {heads, animateLiquid, animateGlow, animateSlider} = this.state;
        //const check = heads.slice(0, 1)
        // console.log(
        //     "\nSPLICE ARRAY1: ", heads.slice(1),  "\nSPLICE ARRAY2: ", heads
        // )
        // "\nSPLICE ARRAY2: ", heads.slice(0).reverse(),
        //     "\nSPLICE ARRAY3: ", heads.slice(1), "\nSPLICE ARRAY4: ", heads.slice(1).reverse()
        let gradient = ['#0E57CF', '#25A2F9'];
        const interpolated = this.state.animated.interpolate({
            inputRange: [0, 3000],
            outputRange: ['rgb(237, 119, 64)', 'rgb(46, 145, 232)']
        })
        const animatedStyle = {
            backgroundColor: interpolated
        }
        // const animatedStyle = {
        //     width: animateLiquid.interpolate({
        //         inputRange: [0, 1],
        //         outputRange: [0, getWidthnHeight(50).width]
        //     }),
        //     backgroundColor: interpolated
        // }
        const animatedGlowStyle = {
            marginLeft: animateGlow.interpolate({
                inputRange: [0, 1],
                outputRange: [0, getWidthnHeight(60).width]
            })
        }
        let testArray = [];
        let dummyData = ['1', '2', '3'];
        let dummyData2 = ['4', '5', '6']
        testArray.push(dummyData);
        testArray.push(dummyData2);
        console.log("DUMMY TEST ARRAY: ", testArray)
        const testObj = {
            error: 'Internal server error',
            validationError: 'Please fill all fields'
        };
        //console.log("TEST OBJECT: ", testObj.prototype.hasOwnProperty('error'))
        return (
            <View style={[{backgroundColor: 'white', flex: 1}, getWidthnHeight(100)]}>
                <IOS_StatusBar color={gradient} barStyle="light-content"/>
                <WaveHeader
                    wave={Platform.OS ==="ios" ? false : false} 
                    //logo={require('../Image/Logo-164.png')}
                    menu='white'
                    title='Animate'
                />
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ScrollView
                        style={{flex: 1, opacity: 1}}
                        scrollEventThrottle={16}
                        onScroll={Animated.event([
                            {
                                nativeEvent: {
                                    contentOffset: {
                                        y: this.state.animated
                                    }
                                }
                            }
                        ])
                        }
                    >
                        <Animated.View style={[styles.box, animatedStyle]}/>
                    </ScrollView>
                    {/* {this.state.heads.slice(0).reverse().map((item, index, items) => {
                        const pan = (index === items.length - 1)? this._panResponder.panHandlers : {};
                        return (
                            <Animated.View {...pan} key={index} style={[{
                                transform: item.animation.getTranslateTransform()
                            }, styles.heads]}>
                                {item.image}
                            </Animated.View>
                        )
                    })} */}
                    {/* {<View style={[{alignItems: 'flex-start'}, getWidthnHeight(80)]}>
                        <View style={[{height: 20, borderRadius: 20}]}>
                            <AnimateGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#16C363', '#66DE93']} style={[{borderRadius: 20, height: 20}, animatedStyle]}/>
                        </View>
                        <Animated.View style={[{height: 20, position: 'absolute'}, animatedGlowStyle]}>
                            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['transparent', 'rgba(255, 255, 255, 0.65)']} style={[{height: 20, width: 60, borderRadius: 20}, getMarginLeft(-13)]}/>
                        </Animated.View>
                    </View>
                    <View style={[{alignItems: 'flex-start'}, getWidthnHeight(80), getMarginTop(10)]}>
                        <View style={[{height: 20, borderRadius: 20}]}>
                            <AnimateGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#16C363', '#66DE93']} style={[{borderRadius: 20, height: 20}, animatedStyle]}/>
                        </View>
                        <Animated.View style={[{height: 20, position: 'absolute'}, animatedGlowStyle]}>
                            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['transparent', 'rgba(255, 255, 255, 0.65)', 'transparent']} style={[{height: 20, width: 60, borderRadius: 40}, getMarginLeft(-13)]}/>
                        </Animated.View>
                    </View>} */}
                    {/* {<Slider color={'#26DA7B'} onSlide={(sliderState) => console.log("SLIDER STATE: ", sliderState)}/>} */}

                </View>
            </View>
        );
    }
}

const styles = {
    box: {
        width: getWidthnHeight(100).width,
        height: 3000,
        backgroundColor: 'tomato',
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    heads: {
        width: 80,
        height: 80,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    },
    linearGradient: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 95,
        borderBottomLeftRadius:25,
        borderBottomRightRadius: 25
    },
}

export default HTMLView;
