import React, {Component} from 'react';
import {View, Text, TextInput, Animated, StyleSheet, ScrollView, FlatList, TouchableOpacity, Platform} from 'react-native';
import Down from 'react-native-vector-icons/MaterialIcons';
import {getWidthnHeight, getMarginTop, fontSizeH4, getMarginLeft, getMarginHorizontal} from './width';
import {TestDropDown} from '../../test/TestDropDown';

class SearchableModalDropDown extends Component{
    constructor(props){
        super(props)
        this.state = {
            input: '',
            searchInput: '',
            animatePlaceHolder: new Animated.Value(0),
            focus: false,
            showList: false,
            selectedID: null,
            selectedName: ''
        }
    }

    componentDidUpdate(){
        const {value = ''} = this.props;
        if(value === ''){
            this.resetPlaceHolder();
        }else{
            this.movePlaceHolder();
        }
    }

    movePlaceHolder(){
        const {animatePlaceHolder} = this.state;
        Animated.timing(animatePlaceHolder, {
            toValue: 1,
            duration: 200
        }).start();
    }

    resetPlaceHolder(){
        const {animatePlaceHolder} = this.state;
        Animated.timing(animatePlaceHolder, {
            toValue: 0,
            duration: 200
        }).start();
    }

    onBlur(){
        const {animatePlaceHolder, input, showList} = this.state;
        console.log("BLUR")
        if(!input){
            Animated.timing(animatePlaceHolder, {
                toValue: 0,
                duration: 200
            }).start();
        }
    }

    render(){
        const {input, animatePlaceHolder, focus, showList, selectedName, searchInput} = this.state;
        const {
            style, searchStyle, dropDownSize, textBoxSize, placeholder, iconSize = getWidthnHeight(8).width, 
            onChangeText, data, value = '', labelStyle = null, titleColors = ['#C4C4C4', '#039FFD'],
            dropDownBG = ['#E6E6E6', 'white'], dropDownTextStyle = null
        } = this.props;
        const placeholderAnimation = {
            transform: [
                {
                    translateX: animatePlaceHolder.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, getMarginLeft(-2.5).marginLeft]
                    })
                },
                {
                    translateY: animatePlaceHolder.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, getMarginTop(-3.5).marginTop]
                    })
                },
                {
                    scale: animatePlaceHolder.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0.7]
                    })
                }
            ],
            color: animatePlaceHolder.interpolate({
                inputRange: [0, 1],
                outputRange: titleColors
            })
        }
        return (
            <View>
                <View style={[{justifyContent: 'center', borderWidth: 0, borderColor: 'green'}]}>
                    {(!showList) && (
                        <TouchableOpacity style={[]} activeOpacity={0.7} onPress={() => {
                            const {disabled = false} = this.props;
                            if(disabled === false){
                                this.setState({showList: !this.state.showList, searchInput: ''});
                            }
                        }}>
                            <Animated.View style={[style, {justifyContent: 'center'}]}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    {(value === '') && <View style={[searchStyle]}/>}
                                    {(value !== '') && (
                                        <View style={[searchStyle, {justifyContent: 'center'}]}>
                                            <Text 
                                                numberOfLines={1} 
                                                style={[{
                                                    textAlignVertical: 'center', borderWidth: 0, borderColor: 'red', justifyContent: 'center', color: 'black',
                                                    paddingLeft: getMarginHorizontal(2).marginHorizontal, fontSize: (fontSizeH4().fontSize)}, labelStyle
                                            ]}>
                                                {value}
                                            </Text>
                                        </View>
                                    )}
                                    <Down name="arrow-drop-down" size={Math.floor(iconSize)} color="grey" style={{borderWidth: 0, borderColor: 'red'}}/>
                                </View>
                                <View pointerEvents="none" style={[{position: 'absolute'}]}>
                                    <Animated.Text style={[{backgroundColor: '#FFF'}, getMarginLeft(1.5), fontSizeH4(), placeholderAnimation]}> {placeholder} </Animated.Text>
                                </View>
                            </Animated.View>
                        </TouchableOpacity>
                    )}
                    {(showList) && (
                        <View style={[{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, style]}>
                            <TextInput 
                                style={[{paddingHorizontal: getMarginHorizontal(2).marginHorizontal, borderColor: 'red', borderWidth: 0}, fontSizeH4(), searchStyle]}
                                placeholder={placeholder}
                                placeholderTextColor="#C4C4C4"
                                value={searchInput}
                                autoFocus={true}
                                onChangeText={(input) => this.setState({searchInput: input.trimLeft()})}
                            />
                            <TouchableOpacity style={{borderColor: 'red', borderWidth: 0}} onPress={() => this.setState({showList: !this.state.showList, searchInput: ''})}>
                                <Down name="arrow-drop-up" size={Math.floor(iconSize)} color="grey"/>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                {(showList) && (
                    <View>
                            <TestDropDown 
                                selectedItem={(selectedID, selectedName, index, dataList) => this.setState({selectedID, selectedName}, () => {
                                    console.log("SELECTED INDEX: ", this.state.selectedID, this.state.selectedName)
                                    this.movePlaceHolder();
                                    onChangeText(this.state.selectedID, this.state.selectedName, index, dataList);
                                })}
                                dataList={data}
                                searchName={searchInput}
                                dropDownBG={dropDownBG}
                                dropDownTextStyle={dropDownTextStyle}
                                hideDropDown={() => this.setState({showList: !this.state.showList, searchInput: ''})}
                                dropDownSize={dropDownSize}
                                textBoxSize={textBoxSize}
                            />
                    </View>
                )}
            </View>
        )
    }
}

export {SearchableModalDropDown};