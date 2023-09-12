import React, {Component} from 'react';
import {View, TextInput, PanResponder, Animated} from 'react-native';
import {IOS_StatusBar, WaveHeader, statusBarGradient, getWidthnHeight} from '../NewComponents/common';
export default class TestInputText extends Component {

    constructor (props) {
        super(props);
        this.state = {
            animation: new Animated.ValueXY(),
            windowWidth: null,
            windowHeight: null,
            width: null,
            height: null
        }
        this.state.animation.addListener((value) => {
            //console.log("LISTENER: ", value)
            this._position = value;
        })
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderGrant: (e, gestureState) => {
                console.log("POSITION: ", this.state.animation)
                //this.state.animation.extractOffset();
                this.state.animation.setOffset({
                    x: this._position.x,
                    y: this._position.y
                })
                this.state.animation.setValue({
                    x: 0,
                    y: 0
                })
            },
            // onPanResponderMove: (e, {dx, dy}) => {
            //     this.state.animation.setValue({
            //         x: dx,
            //         y: dy
            //     })
            // }
            onPanResponderMove: Animated.event([
                null,
                {
                    dx: this.state.animation.x,
                    dy: this.state.animation.y
                }
            ]),
            onPanResponderRelease: (e, gestureState) => {
                this.state.animation.setValue({
                    x: (this._position.x < 0)? 0 : this._position.x,
                    y: (this._position.y < 0)? 0 : this._position.y
                })
            }
        })
    }

    windowDimensions(e){
        this.setState({
            windowWidth: Math.floor(e.nativeEvent.layout.width),
            windowHeight: Math.floor(e.nativeEvent.layout.height)
        }, () => console.log("@@@ DIMENSIONS: ", this.state.windowWidth, this.state.windowHeight));
    }

    boxDimensions(e){
        this.setState({
            width: Math.floor(e.nativeEvent.layout.width),
            height: Math.floor(e.nativeEvent.layout.height)
        }, () => console.log("### DIMENSIONS: ", this.state.width, this.state.height));
    }
  
    render () {
        const {animation} = this.state;
        const animatedStyle = {
            transform: this.state.animation.getTranslateTransform()
        }
        return (
            <View style={{flex: 1, alignItems: 'center'}}>
                <View>
                    <IOS_StatusBar color={statusBarGradient} barStyle="light-content"/>
                    <WaveHeader
                        wave={Platform.OS ==="ios" ? false : false} 
                        menu='white'
                        title='Test Pan Handler'
                    />
                </View>
                <View onLayout={this.windowDimensions.bind(this)} style={[{flex: 1, overflow: 'hidden'}, getWidthnHeight(100)]}>
                    <Animated.View onLayout={this.boxDimensions.bind(this)} {...this._panResponder.panHandlers} style={[{
                        backgroundColor: 'black', borderRadius: getWidthnHeight(10).width, 
                        width: Math.floor(getWidthnHeight(20).width), height: Math.floor(getWidthnHeight(20).width)}, animatedStyle]}
                    />
                </View>
            </View>
        )
    }
  
  }