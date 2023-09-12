import React, {Component} from 'react';
import { Alert } from 'react-native';
import {View, Text, TextInput, Animated} from 'react-native';
import { event } from 'react-native-reanimated';
import {getWidthnHeight, fontSizeH4, getMarginTop, getMarginLeft} from './width';

class CustomTextInput extends Component {
    constructor(props){
        super(props)
        this.state = {
            slidePlaceholder: false,
            animateTitle: new Animated.Value(0),
            inactiveTitleY: null,
            inactiveTitleHeight: null
        }
    }
    componentDidMount(){
        const {slidePlaceholder} = this.state;
        const {value} = this.props;
        if(value){
            this.onFocus();
        }
    }
    onAbsoluteLayout(event){
        console.log("### LAYOUT: ", event.nativeEvent.layout)
        if(this.state.inactiveTitleY){
            return;
        }
        this.setState({
            inactiveTitleY: Math.round(event.nativeEvent.layout.y),
            inactiveTitleHeight: Math.floor(event.nativeEvent.layout.height)
        }, () => {
            console.log("TITLE POSITION: ", this.state.inactiveTitleY, this.state.inactiveTitleHeight)
        })
    }
    onFocus(){
        const {slidePlaceholder} = this.state;
        if(!slidePlaceholder){
            this.setState({slidePlaceholder: true}, () => {
                const {animateTitle} = this.state;
                Animated.timing(animateTitle, {
                    toValue: 1,
                    duration: 200
                }).start();
            })
        }
    }
    onBlur(){
        const {slidePlaceholder} = this.state;
        const {value} = this.props;
        if(slidePlaceholder && !value){
            this.setState({slidePlaceholder: false}, () => {
                const {animateTitle} = this.state;
                Animated.timing(animateTitle, {
                    toValue: 0,
                    duration: 200
                }).start();
            })
        }
    }
    returnAnimatedStyle(){
        const{animateTitle, inactiveTitleY, inactiveTitleHeight, slidePlaceholder} = this.state;
        const {inactiveTitleFontSize, activeTitleFontSize} = this.props;
        const translateYaxis = (-1)*(inactiveTitleY + (inactiveTitleHeight / 2));
        const animateVertically = animateTitle.interpolate({
            inputRange: [0, 1],
            outputRange: [0, translateYaxis]
        })
        return {
            transform: [
                {
                    translateY: animateVertically
                }
            ],
            marginLeft: (slidePlaceholder)? getMarginLeft(1).marginLeft : getMarginLeft(1.5).marginLeft,
            fontSize: animateTitle.interpolate({
                inputRange: [0, 1],
                outputRange: [inactiveTitleFontSize, activeTitleFontSize]
            }),
        }
    }
    render(){
        const {slidePlaceholder, inactiveTitleY} = this.state;
        const {
            placeholder, value, onChangeText, textInputStyle, containerStyle, autoFocus=false,
            inactiveTitleColor, activeTitleColor,inactiveTitleFontSize, activeTitleFontSize,
            editable=true, prefillEnable=false, maxLength=null, ref, keyboardType = 'default'
        } = this.props;
        return (
            <View style={containerStyle}>
                {(prefillEnable) && this.onFocus()}
                <Animated.Text style={[{
                    backgroundColor: (slidePlaceholder || value)? 'white' : 'transparent', position: 'absolute', textAlign: (slidePlaceholder)? 'center' : 'left',
                    borderWidth: 0, borderColor: 'green', alignSelf: 'flex-start', 
                    color: (slidePlaceholder)? activeTitleColor : inactiveTitleColor,
                    //fontSize: (slidePlaceholder)? activeTitleFontSize : inactiveTitleFontSize,
                    }, (inactiveTitleY)? this.returnAnimatedStyle() : null]} onLayout={this.onAbsoluteLayout.bind(this)}>
                        {(slidePlaceholder)? placeholder : placeholder.trim()}
                </Animated.Text>
                <TextInput 
                    //placeholder={placeholder}
                    ref={ref}
                    value={value}
                    maxLength={maxLength}
                    onChangeText={onChangeText}
                    onFocus={() => this.onFocus()}
                    onBlur={() => this.onBlur()}
                    autoFocus={autoFocus}
                    keyboardType={keyboardType}
                    editable={editable}
                    style={[{paddingHorizontal: getMarginLeft(2).marginLeft}, textInputStyle]}
                />
            </View>
        )
    }
}

export {CustomTextInput};