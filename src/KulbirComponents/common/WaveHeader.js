import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, Dimensions, Keyboard, ImageBackground, TouchableWithoutFeedback, Animated, Linking} from 'react-native';
import {connect} from 'react-redux';
import Svg, { Path, LinearGradient, Defs, Stop } from 'react-native-svg';
import {extractBaseURL} from '../../api/BaseURL';
import Gradient from 'react-native-linear-gradient';
import AddIcon from 'react-native-vector-icons/Ionicons';
import Upload from 'react-native-vector-icons/MaterialCommunityIcons';
import {getWidthnHeight, getMarginRight, getMarginTop, getMarginLeft} from './width';
import {MenuIcon} from './MenuIcon';
import {waveHeaderHeight} from '../../actions';
import { Platform } from 'react-native';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';

const calculate = Dimensions.get('window')
const COLOR1 = "#039FFD";
const COLOR2 = "#EA304F";

class WaveHeader extends Component {
    state = {
        waveMargin: null,
        logoDimensions: null,
        margin: null,
        baseURL: null,
        testServer: false,
    };

    componentDidMount(){
        const {updateAvailable} = this.props;
        const dimensions = getWidthnHeight(100, 10)
        this.setState({waveMargin: dimensions.height})
        this.setState({logoDimensions: dimensions})
        //console.log("GET WIDTH n HEIGHT: ", getWidthnHeight(100, 100))
        this.extractLink();
    }

    async extractLink(){
        await extractBaseURL().then((baseURL) => {
          this.setState({baseURL}, () => {
                const {baseURL} = this.state;
                //console.log("HEADER LINK TEST: ", baseURL)
                const check  = baseURL.includes('bpo')
                if(check && baseURL){
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
            logo = null, menu, version, wave, title, menuState = true, createLead = false, headerType = '', size = null,
            goBackTo = null, logoSize = null, logoBG = null, uploadAttachment = false, filter = null
        } = this.props;
        const {waveMargin, logoDimensions, dimensions, margin, testServer} = this.state;
        //console.log("WAVE HEADER: ", Math.floor(getWidthnHeight(2.5).width));
        let menuDimensions = null;
        if(size){
            menuDimensions = getWidthnHeight(100, 10);
        }else {
            menuDimensions = getWidthnHeight(100, 10);
        }
        //let marginTop = null;
        //let logoSize = {width: getWidthnHeight(12).width, height: getWidthnHeight(12).width};
        let titleHeight = null;
        return (
            <View>
            {(headerType == '') &&
            <View style={[{alignItems: 'center', borderColor: 'red', borderWidth: 0}, (size)? size : getWidthnHeight(100, 8)]}>
            <Gradient 
                start={{x: 0, y: 1}} end={{x: 1, y: 1.5}}
                colors={[COLOR1, COLOR2]}
                style={{flex: 1}}>
                {/* {(wave) ?
                <Svg style={[{borderColor: 'red', borderWidth: 0, position: 'relative'}, marginTop, getWidthnHeight(100, 13)]} viewBox="0 0 1440 320">
                    <Defs>
                        <LinearGradient id="path" x1="0" y1="1" x2="1" y2="1">
                        <Stop offset="0" stopColor={COLOR1} stopOpacity="1" />
                        <Stop offset="1" stopColor={COLOR2} stopOpacity="1" />
                    </LinearGradient>
                    </Defs>
                    
                    <Path 
                        fill="url(#path)" 
                        d="M0,160L80,181.3C160,203,320,245,480,224C640,203,800,117,960,106.7C1120,96,1280,160,1360,192L1440,224L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z">
                    </Path>
                </Svg>
                : null
                } */}
            {(logo)?
                <View style={[{justifyContent: 'center', flexDirection: 'row', borderColor: 'white', borderWidth: 0}, (size)? size : getWidthnHeight(100, 8)]}>
                    <View style={{alignItems: 'center', justifyContent: 'center', borderColor: 'white', borderWidth: 0, flex: 1}}>
                        <TouchableOpacity onPress={() => {}} style={[styles.imageStyle, {width: getWidthnHeight(16).width, height: getWidthnHeight(12).width}]}>
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
                            }} style={[styles.imageStyle, {width: getWidthnHeight(16).width, height: getWidthnHeight(12).width}]}>
                            <MenuIcon boundary={menuDimensions} color={menu} />
                        </TouchableOpacity>
                    </View>
                    <View style={{borderColor: 'yellow', borderWidth: 0, alignItems: 'center', justifyContent: 'center', flex: 3}}>
                        <Text style={[styles.screenTitle, {borderColor: 'white', borderWidth: 0, color: 'white', fontWeight: 'bold',textAlign: 'center', textAlignVertical: 'center'}, styles.boldFont, this.newdesignfontSizeH3()]}>{title}</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        {(createLead) &&
                            <TouchableOpacity onPress={() => {}}>
                                <AddIcon name='add-circle-outline' size={30} color='white'/>
                            </TouchableOpacity>
                        }
                        {(uploadAttachment) &&
                            <TouchableOpacity activeOpacity={0.6} onPress={() => {}}>
                                <Upload name='file-upload-outline' size={getWidthnHeight(8).width} color='white'/>
                            </TouchableOpacity>
                        }
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
                                if(goBackTo){
                                    goBackTo();
                                }else{

                                }
                            }} 
                            style={[
                                styles.imageStyle, {width: 40, height: 40, borderColor: 'white', borderWidth: 0
                        }]}>
                            <Image source={require('../../Image/left.png')} style={{width: 25, height: 25}}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{borderColor: 'yellow', borderWidth: 0, alignItems: 'center', justifyContent: 'center', flex: 3}}>
                        <Text style={[{borderColor: 'white', borderWidth: 0, color: 'white', fontWeight: 'bold',textAlign: 'center', textAlignVertical: 'center'}, styles.boldFont, this.newdesignfontSizeH3()]}>{title}</Text>
                    </View>
                    <View style={{flex: 1, justifyContent: 'center', borderWidth: 0, borderColor: 'white', alignItems: 'center'}}>
                        {(filter) &&
                            <>
                                {filter}
                            </>
                        }
                        {(testServer) &&
                            <Text style={{fontSize: 8, textAlign: 'center', textAlignVertical: 'center', color: 'white'}}>Test Server</Text>
                        }
                    </View>
                </View>
            }
            </Gradient>
            </View>}

            {(headerType === 'small') &&
            <View style={[{alignItems: 'center', borderColor: 'red', borderWidth: 0}, getWidthnHeight(100, 8)]}>
            <Gradient 
                start={{x: 0, y: 1}} end={{x: 1, y: 1.5}}
                colors={[COLOR1, COLOR2]}
                style={{flex: 1}}>
                {/* {(wave) ?
                <Svg style={[{borderColor: 'red', borderWidth: 0, position: 'relative'}, marginTop, getWidthnHeight(100, 13)]} viewBox="0 0 1440 320">
                    <Defs>
                        <LinearGradient id="path" x1="0" y1="1" x2="1" y2="1">
                        <Stop offset="0" stopColor={COLOR1} stopOpacity="1" />
                        <Stop offset="1" stopColor={COLOR2} stopOpacity="1" />
                    </LinearGradient>
                    </Defs>
                    
                    <Path 
                        fill="url(#path)" 
                        d="M0,160L80,181.3C160,203,320,245,480,224C640,203,800,117,960,106.7C1120,96,1280,160,1360,192L1440,224L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z">
                    </Path>
                </Svg>
                : null
                } */}
            {(logo)?
                <View style={[{justifyContent: 'center', flexDirection: 'row', borderColor: 'white', borderWidth: 0}, getWidthnHeight(100, 8)]}>
                    <View style={{alignItems: 'center', justifyContent: 'center', borderColor: 'white', borderWidth: 0, flex: 1}}>
                        <TouchableOpacity onPress={() => {}} style={[styles.imageStyle, {width: 70, height: 50}]}>
                            <MenuIcon boundary={menuDimensions} color={menu} />
                        </TouchableOpacity>
                    </View>
                    <View style={{borderColor: 'yellow', borderWidth: 0, alignItems: 'center', justifyContent: 'center', flex: 3}}>
                        <Image source={logo} style={[logoSize]}/>
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
                <View style={[{justifyContent: 'center', flexDirection: 'row', borderColor: 'white', borderWidth: 0, alignItems: 'center'}, getWidthnHeight(100, 8)]}>
                    <View style={{alignItems: 'center', justifyContent: 'center', borderColor: 'white', borderWidth: 0}}>
                        <TouchableOpacity onPress={() => {
                                Keyboard.dismiss();
                            }} 
                            style={[styles.imageStyle, {width: 60, height: 40}]}>
                            <MenuIcon boundary={menuDimensions} color={menu}  headerType={'small'} />
                        </TouchableOpacity>
                    </View>
                    <View style={[{borderColor: 'yellow', borderWidth: 0, justifyContent: 'center'}, getWidthnHeight(60), getMarginLeft(2)]}>
                        <Text style={[{borderColor: 'white', borderWidth: 0, color: 'white', fontWeight: 'bold', textAlignVertical: 'center'}, styles.boldFont, this.newdesignfontSizeH3()]}>{title}</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        {(createLead) &&
                            <TouchableOpacity onPress={() => {}}>
                                <AddIcon name='add-circle-outline' size={30} color='white'/>
                            </TouchableOpacity>
                        }
                        {(uploadAttachment) &&
                            <TouchableOpacity activeOpacity={0.6} onPress={() => {}}>
                                <Upload name='file-upload-outline' size={getWidthnHeight(8).width} color='white'/>
                            </TouchableOpacity>
                        }
                        <View style={{justifyContent: 'center'}}>
                        {(testServer) &&
                            <Text style={{fontSize: 8, textAlign: 'center', textAlignVertical: 'center', color: 'white'}}>Test Server</Text>
                        }
                        </View>
                    </View>
                </View>
            :
            <View style={[{justifyContent: 'center', flexDirection: 'row', borderColor: 'white', borderWidth: 0}, getWidthnHeight(100, 8)]}>
                    <View style={{alignItems: 'center', justifyContent: 'center', borderColor: 'white', borderWidth: 0}}>
                        <TouchableOpacity 
                            onPress={() => {
                                Keyboard.dismiss();
                                if(goBackTo !== null){
                                    goBackTo();
                                }else{

                                }
                            }} 
                            style={[styles.imageStyle, {width: 60, height: 40}]}>
                            <FontAwesomeIcons name={'angle-left'} color={'white'} size={30}/>
                        </TouchableOpacity>
                    </View>
                    <View style={[{borderColor: 'yellow', borderWidth: 0, justifyContent: 'center'}, getWidthnHeight(60), getMarginLeft(2)]}>
                        <Text style={[{borderColor: 'white', borderWidth: 0, color: 'white', fontWeight: 'bold', textAlignVertical: 'center'}, styles.boldFont, this.newdesignfontSizeH3()]}>{title}</Text>
                    </View>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        {(testServer)&&
                            <Text style={{fontSize: 8, textAlign: 'center', textAlignVertical: 'center', color: 'white'}}>Test Server</Text>
                        }
                    </View>
                </View>
            }
            </Gradient>
            </View>}
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
// const WaveHeaderComponent = connect(null, {waveHeaderHeight})(WaveHeader);
// export {WaveHeaderComponent as WaveHeader};

export {WaveHeader};