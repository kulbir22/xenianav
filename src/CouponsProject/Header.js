import React, {Component} from 'react';
import {
    View, Text, Image, TouchableOpacity, Dimensions, Keyboard, ImageBackground, 
    TouchableWithoutFeedback, Animated, Linking, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Actions} from 'react-native-router-flux';
import Gradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Upload from 'react-native-vector-icons/MaterialCommunityIcons';
import {getWidthnHeight, getMarginRight, getMarginTop, getMarginLeft} from '../NewComponents/common';
import {MenuIcon} from '../NewComponents/common';
import {fetchBaseURL} from '../api/BaseURL';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';

const calculate = Dimensions.get('window')
const COLOR1 = "#039FFD";
const COLOR2 = "#EA304F";

class Header extends Component {
    state = {
        margin: null,
        baseURL: null,
        testServer: false,
    };

    componentDidMount(){
        this.extractLink();
    }

    extractLink(){
        AsyncStorage.getItem('receivedBaseURL').then((baseURL) => {
            this.setState({baseURL}, () => {
                const {baseURL} = this.state;
                const check  = baseURL.includes('bpo')
                //console.log("HEADER LINK TEST: ", baseURL, check)
                if(check){
                    this.setState({testServer: true})
                }else{
                    this.setState({testServer: false})
                }
            })
        })
    }

    fontSizeH3 = () => {
        const getWidth = calculate.width;
        let font_Size = null;
        if(getWidth <= 360){
            font_Size = {fontSize: 18}
            return font_Size;
        } else {
            font_Size = {fontSize: 24}
            return font_Size;
        }
    }


    newdesignfontSizeH3 = () => {
        const getWidth = calculate.width;
        let font_Size = null;
        if(getWidth <= 360){
            font_Size = {fontSize: 14}
            return font_Size;
        } else {
            font_Size = {fontSize: 18}
            return font_Size;
        }
    }

    render(){
        const {
            logo = null, menu, title, menuState = true, size = null, titleAlign = 'flex-start',
            logoSize = null, logoBG = null, backIconColor = '#FFFFFF'
        } = this.props;
        const {testServer} = this.state;
        let menuDimensions = null;
        if(size){
            menuDimensions = getWidthnHeight(100, 10);
        }else {
            menuDimensions = getWidthnHeight(100, 10);
        }
        return (
            <View>
                <View style={[{alignItems: 'center', borderColor: 'red', borderWidth: 0}, (size)? size : getWidthnHeight(100, 8)]}>
                    <Gradient 
                        start={{x: 0, y: 1}} end={{x: 1, y: 1.5}}
                        colors={[COLOR1, COLOR2]}
                        style={{flex: 1}}>
                        {(logo)?
                            <View style={[{justifyContent: 'center', flexDirection: 'row', borderColor: 'white', borderWidth: 0}, (size)? size : getWidthnHeight(100, 8)]}>
                                <View style={{alignItems: 'center', justifyContent: 'center', borderColor: 'white', borderWidth: 0, flex: 1}}>
                                    <TouchableOpacity onPress={() => Actions.drawerOpen()} style={[styles.imageStyle, {width: getWidthnHeight(16).width, height: getWidthnHeight(12).width}]}>
                                        <MenuIcon boundary={menuDimensions} color={menu} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{borderColor: 'yellow', borderWidth: 0, alignItems: 'center', justifyContent: 'center', flex: 3}}>
                                    <View style={[{alignItems: 'center', justifyContent: 'center'}, logoBG]}>
                                        <Image resizeMode="contain" source={logo} style={[logoSize]}/>
                                    </View>
                                </View>
                                <View style={{flex: 1, justifyContent: (Platform.OS === 'android')? 'flex-end' : 'center', borderColor: 'yellow', borderWidth: 0, alignItems: 'center'}}>
                                    {(testServer) &&
                                        <Text style={{fontSize: 8, textAlign: 'center', textAlignVertical: 'center', color: 'white'}}>Test Server</Text>
                                    }
                                </View>
                            </View>
                        :
                            null
                        }
                        {(menuState)?
                            <View style={[{justifyContent: 'center', flexDirection: 'row', borderColor: 'white', borderWidth: 0}, (size)? size : getWidthnHeight(100, 8)]}>
                                <View style={{alignItems: 'center', justifyContent: 'center', borderColor: 'black', borderWidth: 0, flex: 1}}>
                                    <TouchableOpacity onPress={() => {
                                            Keyboard.dismiss();
                                            Actions.drawerOpen()
                                        }} style={[styles.imageStyle, {width: getWidthnHeight(16).width, height: getWidthnHeight(12).width}]}>
                                        <MenuIcon boundary={menuDimensions} color={menu} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{borderColor: 'yellow', borderWidth: 0, alignItems: titleAlign, justifyContent: 'center', flex: 3}}>
                                    <Text style={[styles.screenTitle, {borderColor: 'white', borderWidth: 0, color: 'white', fontWeight: 'bold',textAlign: 'center', textAlignVertical: 'center'}, styles.boldFont, this.newdesignfontSizeH3()]}>{title}</Text>
                                </View>
                                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                    <View style={{justifyContent: 'center'}}>
                                        {(testServer) &&
                                            <Text style={{fontSize: 8, textAlign: 'center', textAlignVertical: 'center', color: 'white'}}>Test Server</Text>
                                        }
                                    </View>
                                </View>
                            </View>
                        :
                            <View style={[{justifyContent: 'center', flexDirection: 'row', borderColor: 'white', borderWidth: 0}, (size)? size : getWidthnHeight(100, 8)]}>
                                <View style={{alignItems: 'center', justifyContent: 'center', borderColor: 'white', borderWidth: 0, flex: 1}}>
                                    <TouchableOpacity 
                                        onPress={() => {
                                            Keyboard.dismiss();
                                            Actions.pop();
                                        }} 
                                        style={[
                                            styles.imageStyle, {width: 40, height: 40, borderColor: 'white', borderWidth: 0
                                    }]}>
                                        <Ionicons name="arrow-back" size={getWidthnHeight(8).width} color={backIconColor}/>
                                    </TouchableOpacity>
                                </View>
                                <View style={{borderColor: 'yellow', borderWidth: 0, alignItems: titleAlign, justifyContent: 'center', flex: 3}}>
                                    <Text style={[{borderColor: 'white', borderWidth: 0, color: 'white', fontWeight: 'bold',textAlign: 'center', textAlignVertical: 'center'}, styles.boldFont, this.newdesignfontSizeH3()]}>{title}</Text>
                                </View>
                                <View style={{flex: 1, justifyContent: 'center'}}>
                                    {(testServer) &&
                                        <Text style={{fontSize: 8, textAlign: 'center', textAlignVertical: 'center', color: 'white'}}>Test Server</Text>
                                    }
                                </View>
                            </View>
                        }
                    </Gradient>
                </View>
            </View>
            
        );
    }
}

const styles = {
    imageStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 0,
        borderColor: 'black',
        borderWidth: 0,
        ...Platform.select({
            ios: {
                zIndex: 1
            }
        })
    },
    screenTitle: {
        ...Platform.select({
            ios: {
                flex: 0
            },
            android: {
            flex: 1,
            }
        }),
    },
    boldFont: {
        ...Platform.select({
            android: {
                fontFamily: ''
            }
        })
    }
}

export {Header};