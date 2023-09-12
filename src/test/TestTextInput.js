import React, {Component} from 'react';
import {View, Text, TextInput, Animated, TouchableOpacity, StyleSheet, Keyboard, ScrollView} from 'react-native';
import Close from 'react-native-vector-icons/AntDesign';
import {getWidthnHeight, getMarginLeft} from '../NewComponents/common';

class TestTextInput extends Component {

    constructor(props){
        super(props)
        this.state = {
            animateLabel: new Animated.Value(0),
            fontWeight: 'normal'
        }
    }

    // componentDidUpdate(prevProps){
    //     if(this.props.value === ''){
    //         console.log("TEST4")
    //         //this.onBlur();
    //     }
    // }

    onFocus(){
        const {value} = this.props;
        if(!value){
            const {animateLabel} = this.state;
            Animated.timing(animateLabel, {
                toValue: 1,
                duration: 200
            }).start();
        }
    }

    onBlur(){
        const {animateLabel} = this.state;
        Animated.timing(animateLabel, {
            toValue: 0,
            duration: 200
        }).start();
    }

    render(){
        const {
            placeholder = "Type here", value, onChangeText, style, containerStyle, iconSize = null, multiline = false,
            iconColor = 'black', autoFocus = false, slideVertical = [0, getWidthnHeight(undefined, -3.5).height],
            clearText = () => {}, placeholderScale = [1, 0.75], slideHorizontal= [0, getWidthnHeight(-2).width],
            placeholderColor = ['#C4C4C4', '#0B8EE8'], containerColor = ['#C4C4C4', '#0B8EE8'], numberOfLines = 1,
            containerBorderWidth = [1, 2], keyboardType = 'default', editable = true, maxLength = 300
        } = this.props;
        const {animateLabel, fontWeight} = this.state;
        const placeholderStyle = {
            transform: [
                {
                    translateX: animateLabel.interpolate({
                        inputRange: [0, 1],
                        outputRange: slideHorizontal
                    })
                },
                {
                    translateY: animateLabel.interpolate({
                        inputRange: [0, 1],
                        outputRange: slideVertical
                    })
                },
                {
                    scale: animateLabel.interpolate({
                        inputRange: [0, 1],
                        outputRange: placeholderScale
                    })
                },
            ],
            color: animateLabel.interpolate({
                inputRange: [0, 1],
                outputRange: placeholderColor
            }),
            // fontWeight: animateLabel.interpolate({
            //     inputRange: [0, 1],
            //     outputRange: ['normal', 'bold']
            // }),
        }
        const animateContainer = {
            color: animateLabel.interpolate({
                inputRange: [0, 1],
                outputRange: containerColor
            }),
            borderWidth: animateLabel.interpolate({
                inputRange: [0, 1],
                outputRange: containerBorderWidth
            }),
        }
        return (
            <View>
                <Animated.View style={[containerStyle, {borderColor: animateContainer.color, borderWidth: animateContainer.borderWidth}]}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TextInput
                            ref={(ref) => (this.textRef = ref)}
                            maxLength={maxLength}
                            multiline={multiline}
                            numberOfLines={numberOfLines}
                            autoFocus={autoFocus}
                            value={value}
                            editable={editable}
                            keyboardType={keyboardType}
                            onChangeText={(textValue) => {
                                //console.log("TEXT VALUE: ", textValue, value)
                                if(textValue === ''){
                                    Keyboard.dismiss();
                                    this.onBlur();
                                }
                                onChangeText(textValue);
                            }}
                            onFocus={() => this.onFocus()}
                            onBlur={() => {
                                if(value === ''){
                                    this.onBlur();
                                }
                            }}
                            style={style}
                        />
                        {(iconSize && value !== '')&& (
                            <TouchableOpacity 
                                onPress={() => {
                                    this.onBlur();
                                    clearText();
                                    Keyboard.dismiss();
                                }} 
                                style={{
                                    alignItems: 'center', justifyContent: 'center', flex: 1
                            }}>
                                <Close name="close" size={iconSize} color={iconColor}/>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View pointerEvents='none' style={[{position: 'absolute', justifyContent: 'center', borderColor: 'red', borderWidth: 0}]}>
                        <Animated.Text style={[{textAlignVertical: 'center', color: '#C4C4C4', zIndex: 1, backgroundColor: 'white', fontWeight: fontWeight}, getMarginLeft(1), placeholderStyle]}> {placeholder} </Animated.Text>
                    </View>
                </Animated.View>
            </View>
        );
    }
}

export {TestTextInput};