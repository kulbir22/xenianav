import React, {Component} from 'react';
import {View, Text, TextInput, Animated, TouchableOpacity, StyleSheet, Keyboard, ScrollView} from 'react-native';
import Close from 'react-native-vector-icons/AntDesign';
import {number, string, func, array, bool} from 'prop-types';
import {getWidthnHeight, getMarginLeft, getMarginHorizontal, getMarginVertical, fontSizeH4} from './width';

class AnimatedTextInput extends Component {

    constructor(props){
        super(props)
        this.state = {
            animateLabel: new Animated.Value(0),
            fontWeight: 'normal'
        }
    }

    static getDerivedStateFromProps(props, state){
        if(props.value === ''){
            const animateLabel = state.animateLabel;
            Animated.timing(animateLabel, {
                toValue: 0,
                duration: 200
            }).start();
        }else{
            const animateLabel = state.animateLabel;
            Animated.timing(animateLabel, {
                toValue: 1,
                duration: 200
            }).start();
        }
        return null;
    }

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
            containerBorderWidth = [1, 2], keyboardType = 'default', editable = true, maxLength = 300, autoCapitalize = "none",
            secureTextEntry = false, mandatory = false
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
            paddingHorizontal: (mandatory)? getWidthnHeight(2).width : 0
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
                            secureTextEntry={secureTextEntry}
                            numberOfLines={numberOfLines}
                            autoFocus={autoFocus}
                            value={value}
                            editable={editable}
                            keyboardType={keyboardType}
                            autoCapitalize={autoCapitalize}
                            onChangeText={(textValue) => {
                                //console.log("TEXT VALUE: ", textValue, value)
                                if(textValue === ''){
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
                        {mandatory ? (
                            <Animated.Text style={[{textAlignVertical: 'center', color: '#C4C4C4', zIndex: 1, backgroundColor: 'white', fontWeight: fontWeight}, getMarginLeft(1), placeholderStyle]}>{placeholder}<Text style={[{fontSize: fontSizeH4().fontSize + 5}]}>*</Text></Animated.Text>
                        )
                        :
                        (
                            <Animated.Text style={[{textAlignVertical: 'center', color: '#C4C4C4', zIndex: 1, backgroundColor: 'white', fontWeight: fontWeight}, getMarginLeft(1), placeholderStyle]}> {placeholder} </Animated.Text>
                        )}
                    </View>
                </Animated.View>
            </View>
        );
    }
}

class AdjustableHeightTextInput extends Component {

    constructor(props){
        super(props)
        this.state = {
            animateLabel: new Animated.Value(0),
            fontWeight: 'normal',
            height: getWidthnHeight(undefined, 6.5).height,
        }
    }

    static getDerivedStateFromProps(props, state){
        if(props.value === ''){
            const animateLabel = state.animateLabel;
            Animated.timing(animateLabel, {
                toValue: 0,
                duration: 200,
            }).start();
        }
        return null;
    }

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
            placeholder = "Type here", value, onChangeText, style = null, containerStyle = null, iconSize = null, multiline = false,
            iconColor = "black", autoFocus = false, slideVertical = [0, getWidthnHeight(undefined, -3.5).height],
            clearText = () => {}, placeholderScale = [1, 0.75], slideHorizontal= [0, getWidthnHeight(-2).width],
            placeholderColor = ['#C4C4C4', '#0B8EE8'], containerColor = ['#C4C4C4', '#0B8EE8'], numberOfLines = 1,
            containerBorderWidth = [1, 2], keyboardType = 'default', editable = true, maxLength = 300,
            returnKeyType = "done", onContentSizeChange = () => {}
        } = this.props;
        const {animateLabel, fontWeight, height, inputText} = this.state;
        let dimensions = null;
        if(style){
            style.filter((item) => {
                if(item.hasOwnProperty('height')){
                    dimensions = item;
                }
            })
        }
        let heightDifference = 0;
        if(dimensions){
            if(dimensions.height > height){
                heightDifference = dimensions.height - height
            }
        }else{
            heightDifference = 0;
        }
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
        //const newStyle = {(multiline)? {height: (height > getWidthnHeight(undefined, 15).height)? getWidthnHeight(undefined, 15).height : (height < dimensions.height)? dimensions.height : height} : undefined}
        return (
            <View>
                <Animated.View style={[
                    containerStyle, {top: 0, left: 0, borderColor: animateContainer.color, borderWidth: animateContainer.borderWidth}, 
                ]}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TextInput
                            ref={(ref) => (this.textRef = ref)}
                            maxLength={maxLength}
                            multiline={multiline}
                            numberOfLines={numberOfLines}
                            autoFocus={autoFocus}
                            defaultValue={value}
                            value={value}
                            editable={editable}
                            keyboardType={keyboardType}
                            returnKeyType={returnKeyType}
                            onChangeText={(textValue) => {
                                //console.log("TEXT VALUE: ", textValue, value)
                                if(textValue === ''){
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
                            onContentSizeChange={(event) => this.setState({height: event.nativeEvent.contentSize.height})}
                            style={[style, 
                                {height:
                                    (height > getWidthnHeight(undefined, 13).height)? 
                                        getWidthnHeight(undefined, 13).height
                                    :
                                        (height < dimensions.height)? 
                                            dimensions.height
                                        : 
                                            height
                                ,
                                lineHeight: 21,
                                minHeight: dimensions.height,
                                maxHeight: getWidthnHeight(undefined, 13).height
                                }
                            ]}
                            //style={[style, {textAlignVertical: 'center', minHeight: dimensions.height, maxHeight: getWidthnHeight(undefined, 13).height, margin: 20, padding: 20}]}
                        />
                        {(iconSize && value !== '') && (
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
                    <View pointerEvents='none' style={[{position: 'absolute', overflow: 'visible', borderColor: 'red', borderWidth: 0, height: dimensions.height}]}>
                        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                            <Animated.Text style={[{textAlignVertical: 'center', color: '#C4C4C4', zIndex: 1, backgroundColor: 'white', fontWeight: fontWeight}, getMarginLeft(1), placeholderStyle]}> {placeholder} </Animated.Text>
                        </View>
                    </View>
                </Animated.View>
            </View>
        );
    }
}

export {AnimatedTextInput, AdjustableHeightTextInput};