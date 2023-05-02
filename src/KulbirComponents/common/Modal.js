import React, {useState, useRef, useEffect} from 'react';
import useStateWithCallback from 'use-state-with-callback';
import Svg, {Path} from 'react-native-svg';
import {Button, Text, View, StyleSheet,TouchableOpacity, FlatList, TouchableHighlight, Animated, Image, TouchableWithoutFeedback} from 'react-native';
//import {TouchableHighlight} from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import {
    getMarginTop, getMarginLeft, getMarginRight, fontSize_H3, getWidthnHeight, fontSizeH4, 
    getMarginVertical, getMarginBottom, getMarginHorizontal, fontSizeH3
} from './width';
import {GradientIcon} from './GradientIcon';
import {Spinner} from './Spinner';
import Icons from 'react-native-vector-icons/Fontisto';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntdesignIcons from 'react-native-vector-icons/AntDesign';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { ScrollView } from 'react-native-gesture-handler';
import { Platform } from 'react-native';
import RouteIcon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
const AnimateTouchHighLight = Animated.createAnimatedComponent(TouchableHighlight);

function ItineraryModal({data, isvisible, toggle, style, title, textboxtitle, inputbgStyle,
  iconname_1, iconsize_1, iconcolor_1, iconbgColor_1, textboxplaceholder_1, travelTotal,
  boxcontainerStyle_1, iconname_2, iconsize_2, iconcolor_2, iconbgColor_2, showSpinner,
  textboxplaceholder_2, boxcontainerStyle_2, iconfirst, deleteItinerary, editTravelData
}) {
    const [animation] = useState(new Animated.Value(0));
    const [textBoxAnimation] = useState(new Animated.Value(0));
    const [isModalVisible, setModalVisible] = useState(true);
    const [dataItem, setDataItem] = useState([])
    const [id, setid] = useStateWithCallback(0, () => {
        if(id){
            Animated.stagger(100, [
                Animated.timing(animation, {
                    toValue: 1,
                    duration: 300
                }),
                Animated.timing(textBoxAnimation, {
                    toValue: 1,
                    duration: 200
                })
            ]).start()
        }
    });
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const tsetdown = (item) => {
        animation.setValue(0);
        textBoxAnimation.setValue(0);
        setid(item.id);
        console.log("SELECT ITEM: ", item)
    }

    const tsetup = () => {
        Animated.stagger(100, [
            Animated.timing(textBoxAnimation, {
                toValue: 0,
                duration: 200
            }),
            Animated.timing(animation, {
                toValue: 0,
                duration: 300
            })
        ]).start(() => setid(''));
        
    }
      

    const renderItem = ({ item, index }) => {
    const fromCityLength = item.from.length;
    const toCityLength = item.to.length; 
    //console.log("INDEX: ", index, data, "\n\n\n", fromCityLength, toCityLength)
    const rotateXInterpolate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg']
    })
    const arrowOpacity = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
    })
    const animatedStyle = {
        transform: [{
        rotateX: rotateXInterpolate
        }]
    }
    const heightInterpolate = {
        height: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [getWidthnHeight(undefined, 15).height, getWidthnHeight(undefined, 27).height]
        })
    }
    const textBoxInterpolate = {
        opacity: textBoxAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        }),
        transform: [{
            scale: textBoxAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1]
            })
        }]
    }
    const conveyanceInterpolate = {
        opacity: animation
    }
    const iconPosition = {
        top: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, getWidthnHeight(undefined, 12).height]
        })
        // transform: [{
        //     translateY: animation.interpolate({
        //         inputRange: [0, 1],
        //         outputRange: [0, getWidthnHeight(undefined, 12).height]
        //     })
        // }]
    }
    const serialNumber = (index + 1);
    //console.log("@@@ ICON SIZE: ", getWidthnHeight(5.5).width)
        return(
            <View style={[{borderWidth: 0, borderColor: 'red', alignItems: 'center'}, getMarginVertical(2), getWidthnHeight(90)]}>
            {(id !== item.id)?
                <View style={[styles.flatlistcontainer]}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={[{borderWidth: 0, borderColor: 'red'}, getWidthnHeight(11, 5)]}>
                            <View style={[styles.triangleCorner]}/>
                        </View>
                        <View style={[getMarginLeft(-10), getWidthnHeight(10)]}>
                            <Text style={[{color:'white', borderColor: 'red', borderWidth: 0}, fontSizeH4()]}>{(serialNumber < 10)? `0${serialNumber}` : serialNumber}</Text>
                        </View>
                        <View style={[{flexDirection: 'row', justifyContent: 'space-between', borderWidth: 0, borderColor: 'black', alignItems: 'center'}, getWidthnHeight(73)]}>
                            <Text style={[{color:'#3180E5', fontWeight:'700'}, fontSize_H3(), styles.boldFont]}>{item.date}</Text>
                            <TouchableOpacity onPress={() => tsetdown(item)} style={[{borderWidth: 0, borderColor: 'red', alignItems: 'center'}, getWidthnHeight(10, 4)]}>
                                    <Animated.View style={[getMarginTop(0), getMarginLeft(0)]}>   
                                        <Icons name='angle-down' color={'#3180E5'} size={getWidthnHeight(4).width}/>
                                    </Animated.View>
                            </TouchableOpacity>               
                        </View>
                    </View>
                    
                    <View style={[{flexDirection: 'row', borderWidth: 0, borderColor: 'black', alignItems: 'center'}, getWidthnHeight(85, 5)]}>
                        <View style={{alignItems: 'center', flexDirection: 'row', width: getWidthnHeight(9).width, height: getWidthnHeight(9).width, borderColor: 'black', borderWidth: 0, justifyContent: 'flex-end'}}>
                            <View style={[{borderTopWidth: 3, borderLeftWidth: 3, borderBottomWidth: 3, borderColor: 'black'}, getWidthnHeight(3.5, 3)]}/>
                            <View style={[{borderColor: 'black', borderTopWidth: 0, justifyContent: 'flex-end'}, getWidthnHeight(4, 3.8), getMarginLeft(-2)]}>
                                <View style={[{borderWidth: 0, borderColor: 'red'}]}>
                                    <View style={styles.arrow}/>
                                </View>
                            </View>
                        </View>                        
                        <View style={{justifyContent: 'space-between'}}>
                            <Text style={[{color:'black'}, fontSizeH4(), getMarginLeft(1)]}>{item.from}</Text>
                            <Text style={[{color:'black'}, fontSizeH4(), getMarginLeft(1)]}>{item.to}</Text>
                        </View>
                    </View>
                    <View style={[{borderColor: 'black', borderWidth: 0, height: getWidthnHeight(8).width, alignItems: 'flex-end'}, getWidthnHeight(85), getMarginTop(1)]}>
                        <View style={[{flexDirection:'row', justifyContent: 'space-evenly', borderColor: 'red', borderWidth: 0, height: getWidthnHeight(8).width}, getWidthnHeight(20)]}>
                            <TouchableHighlight underlayColor="#3280E4" onPress= {() => editTravelData(item, index)} 
                                style={{width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, backgroundColor: '#DBE8F8',
                                borderRadius: getWidthnHeight(7).width, borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center',
                                marginTop:getMarginTop(0).marginTop, alignItems: 'center'}}
                            >
                                <View style={[getMarginTop(0.6)]}>   
                                    <FontAwesomeIcons name='edit' size={getWidthnHeight(4.5).width}/>
                                </View> 
                            </TouchableHighlight>
                            <TouchableHighlight underlayColor="#3280E4" onPress= {() => deleteItinerary(index)} 
                                style={{width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, backgroundColor: '#DBE8F8',
                                borderRadius: getWidthnHeight(7).width, borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center',
                                marginTop:getMarginTop(0).marginTop, alignItems: 'center'}}
                            >
                                <View style={[{alignItems:'center'}]}>   
                                    <AntdesignIcons name='delete' size={getWidthnHeight(4.5).width}/>
                                </View> 
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            :
            <Animated.View style={[styles.flatlistcontainer, heightInterpolate]}>
                <View>
                    <View style={{flexDirection: 'row'}}>
                        <View style={[{borderWidth: 0, borderColor: 'red'}, getWidthnHeight(11, 5)]}>
                            <View style={[styles.triangleCorner]}/>
                        </View>
                        <View style={[getMarginLeft(-10), getWidthnHeight(10)]}>
                            <Text style={[{color:'white', borderColor: 'red', borderWidth: 0}, fontSizeH4()]}>{(serialNumber < 10)? `0${serialNumber}` : serialNumber}</Text>
                        </View>
                        <View style={[{flexDirection: 'row', justifyContent: 'space-between', borderWidth: 0, borderColor: 'black', alignItems: 'center'}, getWidthnHeight(73)]}>
                            <Text style={[{color:'#3180E5', fontWeight:'700'}, fontSize_H3(), styles.boldFont]}>{item.date}</Text>
                            <TouchableOpacity onPress={() => {
                                tsetup();
                                }} style={[{borderWidth: 0, borderColor: 'red', alignItems: 'center'}, getMarginRight(0), getWidthnHeight(10, 4)]}>
                                <Animated.View style={[getMarginTop(0), getMarginLeft(0), animatedStyle]}>   
                                    <Icons name='angle-down' color={'#3180E5'} size={getWidthnHeight(4).width}/>
                                </Animated.View> 
                            </TouchableOpacity>               
                        </View>
                    </View>
                    
                    <View style={[{flexDirection: 'row', borderWidth: 0, borderColor: 'black', alignItems: 'center'}, getWidthnHeight(85, 5)]}>
                        <View style={{alignItems: 'center', flexDirection: 'row', width: getWidthnHeight(9).width, height: getWidthnHeight(9).width, borderColor: 'black', borderWidth: 0, justifyContent: 'flex-end'}}>
                            <View style={[{borderTopWidth: 3, borderLeftWidth: 3, borderBottomWidth: 3, borderColor: 'black'}, getWidthnHeight(3.5, 3)]}/>
                            <View style={[{borderColor: 'black', borderTopWidth: 0, justifyContent: 'flex-end'}, getWidthnHeight(4, 3.8), getMarginLeft(-2)]}>
                                <View style={[{borderWidth: 0, borderColor: 'red'}]}>
                                    <View style={styles.arrow}/>
                                </View>
                            </View>
                        </View>                        
                        <View style={{justifyContent: 'space-between'}}>
                            <Text style={[{color:'black'}, fontSizeH4(), getMarginLeft(1)]}>{item.from}</Text>
                            <Text style={[{color:'black'}, fontSizeH4(), getMarginLeft(1)]}>{item.to}</Text>
                        </View>
                    </View>
                    <View> 
                    <Animated.View style={[{borderColor: 'black', borderWidth: 0, height: getWidthnHeight(8).width, alignItems: 'flex-end'}, iconPosition, getWidthnHeight(85), getMarginTop(1)]}>
                        <View style={[{flexDirection:'row', justifyContent: 'space-evenly', borderColor: 'red', borderWidth: 0, height: getWidthnHeight(8).width}, getWidthnHeight(20)]}>
                            <TouchableHighlight underlayColor="#3280E4" onPress={() => editTravelData(item, index)}
                                style={[{width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, backgroundColor: '#DBE8F8',
                                borderRadius: getWidthnHeight(7).width, borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center',
                                marginTop:getMarginTop(0).marginTop, alignItems: 'center', borderColor: 'black'}]}
                            >
                                <Animated.View style={[getMarginTop(0.6)]}>   
                                    <FontAwesomeIcons name='edit' size={getWidthnHeight(4.5).width}/>
                                </Animated.View> 
                            </TouchableHighlight>
                            <TouchableHighlight underlayColor="#3280E4" onPress= {() => deleteItinerary(index)} 
                                style={{width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, backgroundColor: '#DBE8F8',
                                borderRadius: getWidthnHeight(7).width, borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center',
                                marginTop:getMarginTop(0).marginTop, alignItems: 'center', borderColor: 'black'}}
                            >
                                <View style={[{alignItems:'center'}]}>   
                                    <AntdesignIcons name='delete' size={getWidthnHeight(4.5).width}/>
                                </View> 
                            </TouchableHighlight>
                        </View>
                    </Animated.View>
                    <View style={[getMarginTop(-4)]}>
                        <Animated.View style={[conveyanceInterpolate]}>
                            <View style = {[{borderWidth: 0, borderColor: 'black',height: getWidthnHeight(7).width}, getWidthnHeight(85)]}>
                                <View style = {[{flexDirection:'row', borderWidth: 0, borderColor: 'black'}, getMarginLeft(4)]}>
                                    <Text style = {[{color:'#565656', fontWeight:'600'},fontSize_H3(), styles.boldFont]}>{textboxtitle}</Text>
                                    <View style={[inputbgStyle]}>
                                        <Text style = {[{color:'#565656', fontWeight:'600', fontStyle:'italic'}, fontSize_H3(), styles.boldFont]}>{item.conveyance}</Text>
                                    </View>
                                </View>
                            </View> 
                        </Animated.View>
                    </View>
                        <View style ={[{flexDirection:"row", justifyContent: 'center', borderColor: 'black', borderWidth: 0}, getMarginTop(0)]}>
                            <View style = {[{borderColor: 'red', borderWidth: 0, alignItems: 'center'},getWidthnHeight(40)]}>
                                <Animated.View style={[{borderRadius: 10}, getWidthnHeight(35, 7), textBoxInterpolate, boxcontainerStyle_1]}>
                                    <View style={{flexDirection:'row', flex: 1,justifyContent: 'space-evenly', alignItems: 'center'}}>    
                                        <View style={[{
                                            borderWidth:0, borderColor: 'black', backgroundColor:'#DBE8F8', justifyContent:'center', width: getWidthnHeight(10).width, 
                                            height: getWidthnHeight(10).width, borderRadius: getWidthnHeight(10).width}, iconbgColor_1]}>
                                            <View style={[{alignItems:'center'}]}>   
                                                <RouteIcon name={iconname_1} size={iconsize_1} color={iconcolor_1}/>
                                            </View> 
                                        </View>    
                                        <View>
                                            <Text style = {[{color:'#FFFEFF', fontWeight:'600'},fontSizeH4(), styles.boldFont]}>{textboxplaceholder_1}</Text>
                                            <Text style = {[{color:'#FFFEFF', fontWeight:'bold'},fontSizeH4(), styles.boldFont]}>{(item.distance)? `${item.distance} Km` : '--'}</Text>
                                        </View>
                                    </View>
                                </Animated.View>
                            </View>
                            <View style = {[{borderColor: 'red', borderWidth: 0, alignItems: 'center'},getWidthnHeight(40)]}>
                                <Animated.View style={[{borderRadius: 10}, getWidthnHeight(35, 7), textBoxInterpolate, boxcontainerStyle_2]}>
                                    <View style={{flexDirection:'row', flex: 1,justifyContent: 'space-evenly', alignItems: 'center'}}>    
                                        <View style={[{
                                            borderWidth:0, borderColor: 'black', backgroundColor:'#DBE8F8', justifyContent:'center', width: getWidthnHeight(10).width, 
                                            height: getWidthnHeight(10).width, borderRadius: getWidthnHeight(10).width}, iconbgColor_2]}>
                                            <View style={[{alignItems:'center'}]}>   
                                                <RouteIcon name={iconname_2} size={iconsize_2} color={iconcolor_2}/>
                                            </View> 
                                        </View>    
                                        <View>
                                            <Text style = {[{color:'#FFFEFF', fontWeight:'600'},fontSizeH4(), styles.boldFont]}>{textboxplaceholder_2}</Text>
                                            <Text style = {[{color:'#FFFEFF', fontWeight:'bold'},fontSizeH4(), styles.boldFont]}>{`${"\u20B9"} ${item.amount}/-`}</Text>
                                        </View>
                                    </View>
                                </Animated.View>
                            </View>
                        </View>
                    </View>
                </View>
                
            </Animated.View>
        }
        </View>
        )}
    
  
      return (
        <View>
            <Modal 
                isVisible={isvisible}
                onBackdropPress={toggle}
            >    
                <View style={styles.container}>
                    <View style={[{flexDirection:'row' ,borderTopLeftRadius:12, borderTopRightRadius:12, alignItems:'flex-start'},style,getWidthnHeight(90, 7)]}>
                          <Text style={[{fontSize: (fontSizeH4().fontSize + 5), color:'white', fontWeight:'600',}, styles.boldFont, getMarginLeft(6), getMarginTop(1.3)]}>{title}</Text>
                          <View style={[{backgroundColor:'white', borderRadius:30, marginLeft:getMarginLeft(35).marginLeft, marginTop:getMarginTop(-2).marginTop}]}>
                              <TouchableOpacity onPress={toggle}>
                                  <Icons name="close" color={'#3180E5'} size={getWidthnHeight(8).width}/>
                              </TouchableOpacity>
                          </View>
                    </View>
                    <View style={{flex: 1}}>
                        <View style={[{flexDirection: 'row', borderColor: 'red', borderWidth: 0, justifyContent: 'center', backgroundColor: '#FF5D6E'}, getWidthnHeight(90), getMarginTop(1)]}>
                            <Text style={[{fontWeight: 'bold', color: 'white'}, styles.boldFont, fontSizeH4()]}>Travel Total: </Text>
                            <Text style={[{fontWeight: 'bold', color: 'white'}, styles.boldFont, fontSizeH4()]}>{`${"\u20B9"} ${travelTotal}/-`}</Text>
                        </View>
                        <ScrollView style={[getMarginBottom(1)]}> 
                            <FlatList
                                data={data}
                                initialNumToRender = {data.length}
                                renderItem={renderItem}
                                keyExtractor={item => item.id}
                            />
                        </ScrollView>
                        <View 
                            style={[{backgroundColor: (showSpinner)? 'rgba(0, 0, 0, 0.5)' : 'transparent', borderTopLeftRadius:0,
                            borderTopRightRadius: 0}, StyleSheet.absoluteFill]} 
                            pointerEvents={(showSpinner)? 'auto' : 'none'}
                        >
                            {(showSpinner) ?
                                <Spinner loading={showSpinner} style={[styles.loadingStyle, getWidthnHeight(45, 10)]} color='rgb(19,111,232)'/>
                            : null}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
      );
    }

    // STAY MODAL
    function StayModal({data, isvisible, toggle, style, title, textboxtitle, inputbgStyle,
        iconname_1, iconsize_1, iconcolor_1, iconbgColor_1, textboxplaceholder_1, stayTotal,
        boxcontainerStyle_1, iconname_2, iconsize_2, iconcolor_2, iconbgColor_2, showSpinner,
        textboxplaceholder_2, boxcontainerStyle_2, iconfirst, deleteItinerary, editStayData,
        status = false
    }) {
            const [animation] = useState(new Animated.Value(0));
            const [textBoxAnimation] = useState(new Animated.Value(0));
            const [isModalVisible, setModalVisible] = useState(true);
            const [dataItem, setDataItem] = useState([])
            const [id, setid] = useStateWithCallback('', () => {
                if(id){
                    Animated.stagger(100, [
                        Animated.timing(animation, {
                            toValue: 1,
                            duration: 300
                        }),
                        Animated.timing(textBoxAnimation, {
                            toValue: 1,
                            duration: 200
                        })
                    ]).start()
                }
            });
            const toggleModal = () => {
                setModalVisible(!isModalVisible);
            };
      
            const tsetdown = (item) => {
                animation.setValue(0);
                textBoxAnimation.setValue(0);
                setid(item.id);
                console.log("SELECT ITEM: ", item)
            }
        
            const tsetup = () => {
                Animated.stagger(100, [
                    Animated.timing(textBoxAnimation, {
                        toValue: 0,
                        duration: 200
                    }),
                    Animated.timing(animation, {
                        toValue: 0,
                        duration: 300
                    })
                ]).start(() => setid(''));
                
            }
            
      
            const renderItem = ({ item, index }) => {
            //console.log("INDEX: ", index, data)
            let changeBackground = null;
            let showButton = true;
            if(status){
                if(item.status === 'back'){
                    changeBackground = {
                        backgroundColor: 'rgba(243, 139, 160, 0.5)',
                    }
                }
                if((item.status === 'new' || item.status === 'back') && item.uniqueID && index === 0){
                    showButton = false;
                }
            }
            const rotateXInterpolate = animation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '180deg']
            })
            const arrowOpacity = animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1]
            })
            const animatedStyle = {
                transform: [{
                rotateX: rotateXInterpolate
                }]
            }
            const heightInterpolate = {
                height: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [getWidthnHeight(undefined, 15).height, getWidthnHeight(undefined, 23.5).height]
                })
            }
            const textBoxInterpolate = {
                opacity: textBoxAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1]
                }),
                transform: [{
                    scale: textBoxAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1]
                    })
                }]
            }
            const iconPosition = {
                transform: [{
                    translateY: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, getWidthnHeight(undefined, 9).height]
                    })
                }]
            }
            const serialNumber = (index + 1);
                return(
                    <View style={[{borderWidth: 0, borderColor: 'red', alignItems: 'center'}, getMarginVertical(2), getWidthnHeight(90)]}>
                    {(id !== item.id)?
                        <View style={[styles.flatlistcontainer]}>
                            <View style={[{flex: 1}, changeBackground]}>
                            <View style={{flexDirection: 'row'}}>
                                <View style={[{borderWidth: 0, borderColor: 'red'}, getWidthnHeight(11, 5)]}>
                                    <View style={[styles.triangleCorner]}/>
                                </View>
                                <View style={[getMarginLeft(-10), getWidthnHeight(10)]}>
                                    <Text style={[{color:'white', borderColor: 'red', borderWidth: 0}, fontSizeH4()]}>{(serialNumber < 10)? `0${serialNumber}` : serialNumber}</Text>
                                </View>
                                <View style={[{flexDirection: 'row', justifyContent: 'space-between', borderWidth: 0, borderColor: 'black', alignItems: 'center'}, getWidthnHeight(73)]}>
                                    <Text style={[{color:'#3180E5', fontWeight:'700'}, fontSize_H3(), styles.boldFont]}>{item.date}</Text>
                                    <TouchableOpacity onPress={() => tsetdown(item)} style={[{borderWidth: 0, borderColor: 'red', alignItems: 'center'}, getWidthnHeight(10, 4)]}>
                                            <Animated.View style={[getMarginTop(0), getMarginLeft(0)]}>   
                                                <Icons name='angle-down' color={'#3180E5'} size={getWidthnHeight(4).width}/>
                                            </Animated.View>
                                    </TouchableOpacity>               
                                </View>
                            </View>
                            
                            <View>
                                <Text style={[{color:'black'}, fontSizeH4(), getMarginLeft(5)]}>{item.state}</Text>
                                <View style={{flexDirection: 'row', borderColor: 'black', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center'}}>
                                    <View style={[{
                                        backgroundColor: 'black', width: getWidthnHeight(2).width, height: getWidthnHeight(2).width, 
                                        justifyContent: 'center', borderRadius: getWidthnHeight(3).width}, getMarginLeft(5)]}
                                    />
                                    <Text style={[{color:'black', borderColor: 'black', borderWidth: 0}, fontSizeH4(), getMarginLeft(2)]}>{item.city}</Text>
                                </View>
                            </View>
                            <View style={[{borderColor: 'black', borderWidth: 0, height: getWidthnHeight(8).width, alignItems: 'flex-end'}, getWidthnHeight(85), getMarginTop(1)]}>
                                <View style={[{flexDirection:'row', marginRight: (showButton)? 0 : getMarginRight(2).marginRight, justifyContent: (showButton)? 'space-evenly' : 'flex-end', borderColor: 'red', borderWidth: 0, height: getWidthnHeight(8).width}, getWidthnHeight(20)]}>
                                    <TouchableHighlight underlayColor="#3280E4" onPress= {() => editStayData(item, index)} 
                                        style={{width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, backgroundColor: '#DBE8F8',
                                        borderRadius: getWidthnHeight(7).width, borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center',
                                        marginTop:getMarginTop(0).marginTop, alignItems: 'center'}}
                                    >
                                        <View style={[getMarginTop(0.6)]}>   
                                            <FontAwesomeIcons name='edit' size={getWidthnHeight(4.5).width}/>
                                        </View> 
                                    </TouchableHighlight>
                                    {(showButton)?
                                        <TouchableHighlight underlayColor="#3280E4" onPress= {() => deleteItinerary(index)} 
                                            style={{width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, backgroundColor: '#DBE8F8',
                                            borderRadius: getWidthnHeight(7).width, borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center',
                                            marginTop:getMarginTop(0).marginTop, alignItems: 'center'}}
                                        >
                                            <View style={[{alignItems:'center'}]}>   
                                                <AntdesignIcons name='delete' size={getWidthnHeight(4.5).width}/>
                                            </View> 
                                        </TouchableHighlight>
                                    :
                                        null
                                    }
                                </View>
                            </View>
                        </View>
                        </View>
                    :
                        <Animated.View style={[styles.flatlistcontainer, heightInterpolate]}>
                            <View style={[{flex: 1}, changeBackground]}>
                            <View style={{flexDirection: 'row'}}>
                                <View style={[{borderWidth: 0, borderColor: 'red'}, getWidthnHeight(11, 5)]}>
                                    <View style={[styles.triangleCorner]}/>
                                </View>
                                <View style={[getMarginLeft(-10), getWidthnHeight(10)]}>
                                    <Text style={[{color:'white', borderColor: 'red', borderWidth: 0}, fontSizeH4()]}>{(serialNumber < 10)? `0${serialNumber}` : serialNumber}</Text>
                                </View>
                                <View style={[{flexDirection: 'row', justifyContent: 'space-between', borderWidth: 0, borderColor: 'black', alignItems: 'center'}, getWidthnHeight(73)]}>
                                    <Text style={[{color:'#3180E5', fontWeight:'700'}, fontSize_H3(), styles.boldFont]}>{item.date}</Text>
                                    <TouchableOpacity onPress={() => {
                                        tsetup();
                                        }} style={[{borderWidth: 0, borderColor: 'red', alignItems: 'center'}, getMarginRight(0), getWidthnHeight(10, 4)]}>
                                        <Animated.View style={[getMarginTop(0), getMarginLeft(0), animatedStyle]}>   
                                            <Icons name='angle-down' color={'#3180E5'} size={getWidthnHeight(4).width}/>
                                        </Animated.View> 
                                    </TouchableOpacity>               
                                </View>
                            </View>
                            <View>
                                <Text style={[{color:'black'}, fontSizeH4(), getMarginLeft(5)]}>{item.state}</Text>
                                <View style={{flexDirection: 'row', borderColor: 'black', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center'}}>
                                    <View style={[{
                                        backgroundColor: 'black', width: getWidthnHeight(2).width, height: getWidthnHeight(2).width, 
                                        justifyContent: 'center', borderRadius: getWidthnHeight(3).width}, getMarginLeft(5)]}
                                    />
                                    <Text style={[{color:'black', borderColor: 'black', borderWidth: 0}, fontSizeH4(), getMarginLeft(2)]}>{item.city}</Text>
                                </View>
                            </View>
                            <Animated.View style={[{borderColor: 'black', borderWidth: 0, height: getWidthnHeight(8).width, alignItems: 'flex-end'}, iconPosition, getWidthnHeight(85), getMarginTop(1)]}>
                                <View style={[{flexDirection:'row', marginRight: (showButton)? 0 : getMarginRight(2).marginRight, justifyContent: (showButton)? 'space-evenly' : 'flex-end', borderColor: 'red', borderWidth: 0, height: getWidthnHeight(8).width}, getWidthnHeight(20)]}>
                                    <TouchableHighlight underlayColor="#3280E4" onPress={() => editStayData(item, index)}
                                        style={[{width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, backgroundColor: '#DBE8F8',
                                        borderRadius: getWidthnHeight(7).width, borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center',
                                        marginTop:getMarginTop(0).marginTop, alignItems: 'center', borderColor: 'black'}]}
                                    >
                                            <Animated.View style={[getMarginTop(0.6)]}>   
                                                <FontAwesomeIcons name='edit' size={getWidthnHeight(4.5).width}/>
                                            </Animated.View> 
                                    </TouchableHighlight>
                                    {(showButton)?
                                        <TouchableHighlight underlayColor="#3280E4" onPress= {() => deleteItinerary(index)} 
                                            style={{width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, backgroundColor: '#DBE8F8',
                                            borderRadius: getWidthnHeight(7).width, borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center',
                                            marginTop:getMarginTop(0).marginTop, alignItems: 'center', borderColor: 'black'}}
                                        >
                                            <View style={[{alignItems:'center'}]}>   
                                                <AntdesignIcons name='delete' size={getWidthnHeight(4.5).width}/>
                                            </View> 
                                        </TouchableHighlight>
                                    :
                                        null
                                    }
                                </View>
                            </Animated.View>
                            <View style ={[{flexDirection:"row", justifyContent: 'center'}, getMarginTop(-3)]}>
                                <View style = {[{borderColor: 'red', borderWidth: 0, alignItems: 'center'},getWidthnHeight(40)]}>
                                    <Animated.View style={[{borderRadius: 10}, getWidthnHeight(35, 7), textBoxInterpolate, boxcontainerStyle_1]}>
                                        <View style={{flexDirection:'row', flex: 1,justifyContent: 'space-evenly', alignItems: 'center'}}>    
                                            <View style={[{
                                                borderWidth:0, borderColor: 'black', backgroundColor:'#DBE8F8', justifyContent:'center', width: getWidthnHeight(10).width, 
                                                height: getWidthnHeight(10).width, borderRadius: getWidthnHeight(10).width}, iconbgColor_1]}>
                                                <View style={[{alignItems:'center'}]}>   
                                                    <RouteIcon name={iconname_1} size={iconsize_1} color={iconcolor_1}/>
                                                </View> 
                                            </View>    
                                            <View>
                                                <Text style = {[{color:'#FFFEFF', fontWeight:'600'},fontSizeH4(), styles.boldFont]}>{textboxplaceholder_1}</Text>
                                                <Text style = {[{color:'#FFFEFF', fontWeight:'bold'},fontSizeH4(), styles.boldFont]}>{`${"\u20B9"} ${item.calcStayRate}/-`}</Text>
                                            </View>
                                        </View>
                                    </Animated.View>
                                </View>
                                <View style = {[{borderColor: 'red', borderWidth: 0, alignItems: 'center'},getWidthnHeight(40)]}>
                                    <Animated.View style={[{borderRadius: 10}, getWidthnHeight(35, 7), textBoxInterpolate, boxcontainerStyle_2]}>
                                        <View style={{flexDirection:'row', flex: 1,justifyContent: 'space-evenly', alignItems: 'center'}}>    
                                            <View style={[{
                                                borderWidth:0, borderColor: 'black', backgroundColor:'#DBE8F8', justifyContent:'center', width: getWidthnHeight(10).width, 
                                                height: getWidthnHeight(10).width, borderRadius: getWidthnHeight(10).width}, iconbgColor_2]}>
                                                <View style={[{alignItems:'center'}]}>   
                                                    <RouteIcon name={iconname_2} size={iconsize_2} color={iconcolor_2}/>
                                                </View> 
                                            </View>    
                                            <View>
                                                <Text style = {[{color:'#FFFEFF', fontWeight:'600'},fontSizeH4(), styles.boldFont]}>{textboxplaceholder_2}</Text>
                                                <Text style = {[{color:'#FFFEFF', fontWeight:'bold'},fontSizeH4(), styles.boldFont]}>{`${"\u20B9"} ${item.calcFoodExpense}/-`}</Text>
                                            </View>
                                        </View>
                                    </Animated.View>
                                </View>
                            </View>
                            </View>
                        </Animated.View>
                    }
                    </View>
                )}
            return (
            <View>
                <Modal 
                    isVisible={isvisible}
                    onBackdropPress={toggle}
                >    
                    <View style={styles.container}>
                        <View style={[{flexDirection:'row' ,borderTopLeftRadius:12, borderTopRightRadius:12, alignItems:'flex-start'},style,getWidthnHeight(90, 7)]}>
                                <Text style={[{fontSize: (fontSizeH4().fontSize + 5), color:'white', fontWeight:'600',}, styles.boldFont, getMarginLeft(6), getMarginTop(1.3)]}>{title}</Text>
                                <View style={[{backgroundColor:'white', borderRadius:30, marginLeft:getMarginLeft(35).marginLeft, marginTop:getMarginTop(-2).marginTop}]}>
                                    <TouchableOpacity onPress={toggle}>
                                        <Icons name="close" color={'#3180E5'} size={getWidthnHeight(8).width}/>
                                    </TouchableOpacity>
                                </View>
                        </View>
                        <View style={{flex: 1}}>
                            <View style={[{flexDirection: 'row', borderColor: 'red', borderWidth: 0, justifyContent: 'center', backgroundColor: '#FF5D6E'}, getWidthnHeight(90), getMarginTop(1)]}>
                                <Text style={[{fontWeight: 'bold', color: 'white'}, styles.boldFont, fontSizeH4()]}>Stay Total: </Text>
                                <Text style={[{fontWeight: 'bold', color: 'white'}, styles.boldFont, fontSizeH4()]}>{`${"\u20B9"} ${stayTotal}/-`}</Text>
                            </View>
                            <ScrollView style={[getMarginBottom(1)]}>
                                <FlatList
                                    data={data}
                                    initialNumToRender = {data.length}
                                    renderItem={renderItem}
                                    keyExtractor={item => item.id}
                                />
                            </ScrollView>
                            <View 
                                style={[{backgroundColor: (showSpinner)? 'rgba(0, 0, 0, 0.5)' : 'transparent', borderBottomLeftRadius: 12,
                                borderBottomRightRadius: 12}, StyleSheet.absoluteFill]} 
                                pointerEvents={(showSpinner)? 'auto' : 'none'}
                            >
                                {(showSpinner) ?
                                    <Spinner loading={showSpinner} style={[styles.loadingStyle, getWidthnHeight(45, 10)]} color='rgb(19,111,232)'/>
                                : null}
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
            );
        }

    function ItineraryDescriptionModal({data, isvisible, toggle, style, title, textboxtitle, inputbgStyle,
        iconname_1, iconsize_1, iconcolor_1, iconbgColor_1, textboxplaceholder_1, travelTotal, status = false,
        boxcontainerStyle_1, iconname_2, iconsize_2, iconcolor_2, iconbgColor_2, showSpinner, editTravelData,
        textboxplaceholder_2, boxcontainerStyle_2, deleteItinerary, receivedTravelData = []
    }) {
        const [animation] = useState(new Animated.Value(0));
        const [textBoxAnimation] = useState(new Animated.Value(0));
        const [isModalVisible, setModalVisible] = useState(true);
        const [dataItem, setDataItem] = useState([])
        const [id, setid] = useStateWithCallback(0, () => {
            if(id){
                Animated.stagger(100, [
                    Animated.timing(animation, {
                        toValue: 1,
                        duration: 300
                    }),
                    Animated.timing(textBoxAnimation, {
                        toValue: 1,
                        duration: 200
                    })
                ]).start()
            }
        });
        const toggleModal = () => {
            setModalVisible(!isModalVisible);
        };
    
        const tsetdown = (item) => {
            animation.setValue(0);
            textBoxAnimation.setValue(0);
            setid(item.id);
            console.log("SELECT ITEM: ", item)
        }
    
        const tsetup = () => {
            Animated.stagger(100, [
                Animated.timing(textBoxAnimation, {
                    toValue: 0,
                    duration: 200
                }),
                Animated.timing(animation, {
                    toValue: 0,
                    duration: 300
                })
            ]).start(() => setid(''));
            
        }
        
    
        const renderItem = ({ item, index }) => {
        let changeBackground = null;
        let showButton = true;
        if(status){
            if(item.status === 'back'){
                changeBackground = {
                    backgroundColor: 'rgba(243, 139, 160, 0.5)',
                }
            }
            if(item.status === 'new' && item.uniqueID && index === 0){
                showButton = false;
            }
        }
        //console.log("INDEX: ", index, data, "\n\n\n", fromCityLength, toCityLength)
        const rotateXInterpolate = animation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg']
        })
        const arrowOpacity = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        })
        const animatedStyle = {
            transform: [{
            rotateX: rotateXInterpolate
            }]
        }
        const heightInterpolate = {
            height: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [getWidthnHeight(undefined, 15).height, getWidthnHeight(undefined, 30).height]
            })
        }
        const textBoxInterpolate = {
            opacity: textBoxAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1]
            }),
            transform: [{
                scale: textBoxAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1]
                })
            }]
        }
        const conveyanceInterpolate = {
            opacity: animation
        }
        const iconPosition = {
            top: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, getWidthnHeight(undefined, 15).height]
            })
            // transform: [{
            //     translateY: animation.interpolate({
            //         inputRange: [0, 1],
            //         outputRange: [0, getWidthnHeight(undefined, 12).height]
            //     })
            // }]
        }
        const serialNumber = (index + 1);
        //console.log("@@@ ICON SIZE: ", getWidthnHeight(5.5).width)
            return(
                <View style={[{borderWidth: 0, borderColor: 'red', alignItems: 'center'}, getMarginVertical(2), getWidthnHeight(90)]}>
                {(id !== item.id)?
                    <View style={[styles.flatlistcontainer]}>
                        <View style={[changeBackground]}>
                        <View style={[{flexDirection: 'row'}]}>
                            <View style={[{borderWidth: 0, borderColor: 'red'}, getWidthnHeight(11, 5)]}>
                                <View style={[styles.triangleCorner]}/>
                            </View>
                            <View style={[getMarginLeft(-10), getWidthnHeight(10)]}>
                                <Text style={[{color:'white', borderColor: 'red', borderWidth: 0}, fontSizeH4()]}>{(serialNumber < 10)? `0${serialNumber}` : serialNumber}</Text>
                            </View>
                            <View style={[{flexDirection: 'row', justifyContent: 'space-between', borderWidth: 0, borderColor: 'black', alignItems: 'center'}, getWidthnHeight(73)]}>
                                <Text style={[{color:'#3180E5', fontWeight:'700'}, fontSize_H3(), styles.boldFont]}>{item.date}</Text>
                                <TouchableOpacity onPress={() => tsetdown(item)} style={[{borderWidth: 0, borderColor: 'red', alignItems: 'center'}, getWidthnHeight(10, 4)]}>
                                    <Animated.View style={[getMarginTop(0), getMarginLeft(0)]}>   
                                        <Icons name='angle-down' color={'#3180E5'} size={getWidthnHeight(4).width}/>
                                    </Animated.View>
                                </TouchableOpacity>               
                            </View>
                        </View>
                        
                        <View style={[{flexDirection: 'row', borderWidth: 0, borderColor: 'black', alignItems: 'center'}, getWidthnHeight(85, 5)]}>
                            <View style={{alignItems: 'center', flexDirection: 'row', width: getWidthnHeight(9).width, height: getWidthnHeight(9).width, borderColor: 'black', borderWidth: 0, justifyContent: 'flex-end'}}>
                                <View style={[{borderTopWidth: 3, borderLeftWidth: 3, borderBottomWidth: 3, borderColor: 'black'}, getWidthnHeight(3.5, 3)]}/>
                                <View style={[{borderColor: 'black', borderTopWidth: 0, justifyContent: 'flex-end'}, getWidthnHeight(4, 3.8), getMarginLeft(-2)]}>
                                    <View style={[{borderWidth: 0, borderColor: 'red'}]}>
                                        <View style={styles.arrow}/>
                                    </View>
                                </View>
                            </View>                        
                            <View style={{justifyContent: 'space-between'}}>
                                <Text style={[{color:'black'}, fontSizeH4(), getMarginLeft(1)]}>{item.from}</Text>
                                <Text style={[{color:'black'}, fontSizeH4(), getMarginLeft(1)]}>{item.to}</Text>
                            </View>
                        </View>
                        <View style={[{borderColor: 'black', borderWidth: 0, height: getWidthnHeight(8).width, alignItems: 'flex-end'}, getWidthnHeight(85), getMarginTop(1)]}>
                            <View style={[{flexDirection:'row', marginRight: (showButton)? 0 : getMarginRight(2).marginRight, justifyContent: (showButton)? 'space-evenly' : 'flex-end', borderColor: 'red', borderWidth: 0, height: getWidthnHeight(8).width}, getWidthnHeight(20)]}>
                                <TouchableHighlight underlayColor="#3280E4" onPress= {() => editTravelData(item, index)} 
                                    style={{width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, backgroundColor: '#DBE8F8',
                                    borderRadius: getWidthnHeight(7).width, borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center',
                                    marginTop:getMarginTop(0).marginTop, alignItems: 'center'}}
                                >
                                    <View style={[getMarginTop(0.6)]}>   
                                        <FontAwesomeIcons name='edit' size={getWidthnHeight(4.5).width}/>
                                    </View> 
                                </TouchableHighlight>
                                {(showButton)?
                                    <TouchableHighlight underlayColor="#3280E4" onPress= {() => deleteItinerary(index)} 
                                        style={{width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, backgroundColor: '#DBE8F8',
                                        borderRadius: getWidthnHeight(7).width, borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center',
                                        marginTop:getMarginTop(0).marginTop, alignItems: 'center'}}
                                    >
                                        <View style={[{alignItems:'center'}]}>   
                                            <AntdesignIcons name='delete' size={getWidthnHeight(4.5).width}/>
                                        </View> 
                                    </TouchableHighlight>
                                :
                                    null
                                }
                            </View>
                        </View>
                    </View>
                    </View>
                :
                <Animated.View style={[styles.flatlistcontainer, heightInterpolate]}>
                    <View style={[{flex: 1}, changeBackground]}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={[{borderWidth: 0, borderColor: 'red'}, getWidthnHeight(11, 5)]}>
                                <View style={[styles.triangleCorner]}/>
                            </View>
                            <View style={[getMarginLeft(-10), getWidthnHeight(10)]}>
                                <Text style={[{color:'white', borderColor: 'red', borderWidth: 0}, fontSizeH4()]}>{(serialNumber < 10)? `0${serialNumber}` : serialNumber}</Text>
                            </View>
                            <View style={[{flexDirection: 'row', justifyContent: 'space-between', borderWidth: 0, borderColor: 'black', alignItems: 'center'}, getWidthnHeight(73)]}>
                                <Text style={[{color:'#3180E5', fontWeight:'700'}, fontSize_H3(), styles.boldFont]}>{item.date}</Text>
                                <TouchableOpacity onPress={() => {
                                    tsetup();
                                    }} style={[{borderWidth: 0, borderColor: 'red', alignItems: 'center'}, getMarginRight(0), getWidthnHeight(10, 4)]}>
                                    <Animated.View style={[getMarginTop(0), getMarginLeft(0), animatedStyle]}>   
                                        <Icons name='angle-down' color={'#3180E5'} size={getWidthnHeight(4).width}/>
                                    </Animated.View> 
                                </TouchableOpacity>               
                            </View>
                        </View>
                        
                        <View style={[{flexDirection: 'row', borderWidth: 0, borderColor: 'black', alignItems: 'center'}, getWidthnHeight(85, 5)]}>
                            <View style={{alignItems: 'center', flexDirection: 'row', width: getWidthnHeight(9).width, height: getWidthnHeight(9).width, borderColor: 'black', borderWidth: 0, justifyContent: 'flex-end'}}>
                                <View style={[{borderTopWidth: 3, borderLeftWidth: 3, borderBottomWidth: 3, borderColor: 'black'}, getWidthnHeight(3.5, 3)]}/>
                                <View style={[{borderColor: 'black', borderTopWidth: 0, justifyContent: 'flex-end'}, getWidthnHeight(4, 3.8), getMarginLeft(-2)]}>
                                    <View style={[{borderWidth: 0, borderColor: 'red'}]}>
                                        <View style={styles.arrow}/>
                                    </View>
                                </View>
                            </View>                        
                            <View style={{justifyContent: 'space-between'}}>
                                <Text style={[{color:'black'}, fontSizeH4(), getMarginLeft(1)]}>{item.from}</Text>
                                <Text style={[{color:'black'}, fontSizeH4(), getMarginLeft(1)]}>{item.to}</Text>
                            </View>
                        </View>
                        <View> 
                            <Animated.View style={[{borderColor: 'black', borderWidth: 0, height: getWidthnHeight(8).width, alignItems: 'flex-end'}, iconPosition, getWidthnHeight(85), getMarginTop(1)]}>
                                <View style={[{flexDirection:'row', marginRight: (showButton)? 0 : getMarginRight(2).marginRight, justifyContent: (showButton)? 'space-evenly' : 'flex-end', borderColor: 'red', borderWidth: 0, height: getWidthnHeight(8).width}, getWidthnHeight(20)]}>
                                    <TouchableHighlight underlayColor="#3280E4" onPress={() => editTravelData(item, index)}
                                        style={[{width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, backgroundColor: '#DBE8F8',
                                        borderRadius: getWidthnHeight(7).width, borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center',
                                        marginTop:getMarginTop(0).marginTop, alignItems: 'center', borderColor: 'black'}]}
                                    >
                                        <Animated.View style={[getMarginTop(0.6)]}>   
                                            <FontAwesomeIcons name='edit' size={getWidthnHeight(4.5).width}/>
                                        </Animated.View> 
                                    </TouchableHighlight>
                                    {(showButton)?
                                        <TouchableHighlight underlayColor="#3280E4" onPress= {() => deleteItinerary(index)} 
                                            style={{width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, backgroundColor: '#DBE8F8',
                                            borderRadius: getWidthnHeight(7).width, borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center',
                                            marginTop:getMarginTop(0).marginTop, alignItems: 'center', borderColor: 'black'}}
                                        >
                                            <View style={[{alignItems:'center'}]}>   
                                                <AntdesignIcons name='delete' size={getWidthnHeight(4.5).width}/>
                                            </View> 
                                        </TouchableHighlight>
                                    :
                                        null
                                    }
                                </View>
                            </Animated.View>
                            <View style={[getMarginTop(-4)]}>
                                <Animated.View style={[conveyanceInterpolate]}>
                                    <View style = {[{borderWidth: 0, borderColor: 'black',height: getWidthnHeight(7).width}, getWidthnHeight(85)]}>
                                        <View style = {[{flexDirection:'row', borderWidth: 0, borderColor: 'black'}, getMarginLeft(4)]}>
                                            <Text style = {[{color:'#565656', fontWeight:'600'},fontSize_H3(), styles.boldFont]}>{textboxtitle}</Text>
                                            <View style={[inputbgStyle]}>
                                                <Text style = {[{color:'#565656', fontWeight:'600', fontStyle:'italic'}, fontSize_H3(), styles.boldFont]}>{item.conveyance}</Text>
                                            </View>
                                        </View>
                                    </View> 
                                </Animated.View>
                            </View>
                            <View style ={[{flexDirection:"row", justifyContent: 'center', borderColor: 'black', borderWidth: 0}, getMarginTop(0)]}>
                                <View style = {[{borderColor: 'red', borderWidth: 0, alignItems: 'center'},getWidthnHeight(40)]}>
                                    <Animated.View style={[{borderRadius: 10}, getWidthnHeight(35, 7), textBoxInterpolate, boxcontainerStyle_1]}>
                                        <View style={{flexDirection:'row', flex: 1,justifyContent: 'space-evenly', alignItems: 'center'}}>    
                                            <View style={[{
                                                borderWidth:0, borderColor: 'black', backgroundColor:'#DBE8F8', justifyContent:'center', width: getWidthnHeight(10).width, 
                                                height: getWidthnHeight(10).width, borderRadius: getWidthnHeight(10).width}, iconbgColor_1]}>
                                                <View style={[{alignItems:'center'}]}>   
                                                    <RouteIcon name={iconname_1} size={iconsize_1} color={iconcolor_1}/>
                                                </View> 
                                            </View>    
                                            <View>
                                                <Text style = {[{color:'#FFFEFF', fontWeight:'600'},fontSizeH4(), styles.boldFont]}>{textboxplaceholder_1}</Text>
                                                <Text style = {[{color:'#FFFEFF', fontWeight:'bold'},fontSizeH4(), styles.boldFont]}>{(item.distance)? `${item.distance} Km` : '--'}</Text>
                                            </View>
                                        </View>
                                    </Animated.View>
                                </View>
                                <View style = {[{borderColor: 'red', borderWidth: 0, alignItems: 'center'},getWidthnHeight(40)]}>
                                    <Animated.View style={[{borderRadius: 10}, getWidthnHeight(35, 7), textBoxInterpolate, boxcontainerStyle_2]}>
                                        <View style={{flexDirection:'row', flex: 1,justifyContent: 'space-evenly', alignItems: 'center'}}>    
                                            <View style={[{
                                                borderWidth:0, borderColor: 'black', backgroundColor:'#DBE8F8', justifyContent:'center', width: getWidthnHeight(10).width, 
                                                height: getWidthnHeight(10).width, borderRadius: getWidthnHeight(10).width}, iconbgColor_2]}>
                                                <View style={[{alignItems:'center'}]}>   
                                                    <RouteIcon name={iconname_2} size={iconsize_2} color={iconcolor_2}/>
                                                </View> 
                                            </View>    
                                            <View>
                                                <Text style = {[{color:'#FFFEFF', fontWeight:'600'},fontSizeH4(), styles.boldFont]}>{textboxplaceholder_2}</Text>
                                                <Text style = {[{color:'#FFFEFF', fontWeight:'bold'},fontSizeH4(), styles.boldFont]}>{`${"\u20B9"} ${item.amount}/-`}</Text>
                                            </View>
                                        </View>
                                    </Animated.View>
                                </View>
                            </View>
                            <Animated.View style={[getMarginHorizontal(4), getMarginTop(0.5), conveyanceInterpolate]}>
                                <Text style={[fontSize_H3()]} numberOfLines={1}>Description: {item.description}</Text>
                            </Animated.View>
                        </View>
                    </View>
                </Animated.View>
            }
            </View>
            )}
        
    
        return (
            <View>
                <Modal 
                    isVisible={isvisible}
                    onBackdropPress={toggle}
                >    
                    <View style={styles.container}>
                        <View style={[{flexDirection:'row' ,borderTopLeftRadius:12, borderTopRightRadius:12, alignItems:'flex-start'}, style, getWidthnHeight(90, 7)]}>
                            <Text style={[{fontSize: (fontSizeH4().fontSize + 5), color:'white', fontWeight:'600',}, styles.boldFont, getMarginLeft(6), getMarginTop(1.3)]}>{title}</Text>
                            <View style={[{backgroundColor:'white', borderRadius:30, marginLeft:getMarginLeft(35).marginLeft, marginTop:getMarginTop(-2).marginTop}]}>
                                <TouchableOpacity onPress={toggle}>
                                    <Icons name="close" color={'#3180E5'} size={getWidthnHeight(8).width}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{flex: 1}}>
                            <View style={[{flexDirection: 'row', borderColor: 'red', borderWidth: 0, justifyContent: 'center', backgroundColor: '#FF5D6E'}, , getWidthnHeight(90), getMarginTop(1)]}>
                                <Text style={[{fontWeight: 'bold', color: 'white'}, styles.boldFont, fontSizeH4()]}>Travel Total: </Text>
                                <Text style={[{fontWeight: 'bold', color: 'white'}, styles.boldFont, fontSizeH4()]}>{`${"\u20B9"} ${travelTotal}/-`}</Text>
                            </View>
                            <ScrollView style={[getMarginBottom(1)]}> 
                                <FlatList
                                    data={data}
                                    initialNumToRender = {data.length}
                                    renderItem={renderItem}
                                    keyExtractor={item => item.id}
                                />
                            </ScrollView>
                            <View 
                                style={[{backgroundColor: (showSpinner)? 'rgba(0, 0, 0, 0.5)' : 'transparent', borderTopLeftRadius:0,
                                borderTopRightRadius: 0}, StyleSheet.absoluteFill]} 
                                pointerEvents={(showSpinner)? 'auto' : 'none'}
                            >
                                {(showSpinner) ?
                                    <Spinner loading={showSpinner} style={[styles.loadingStyle, getWidthnHeight(45, 10)]} color='rgb(19,111,232)'/>
                                : null}
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

    function DocumentsModal({data, isvisible, toggle, style, title, status = false,
        showSpinner, deleteItinerary, editDocuments, downloadImage
    }) {
        const renderItem = ({ item, index }) => {
        const serialNumber = (index + 1);
        let changeBackground = null;
        let showButton = true;
        let showDownload = false;
        if(status){
            if(item.status === 'back'){
                changeBackground = {
                    backgroundColor: 'rgba(243, 139, 160, 0.5)',
                }
            }
            if((item.status === 'new' || item.status === 'back') && item.uniqueID && index === 0){
                showButton = false;
            }
            if((item.status === 'new' || item.status === 'back') && item.uniqueID){
                showDownload = true;
            }
        }
        //console.log("@@@ ICON SIZE: ", getWidthnHeight(5.5).width)
            return(
                <View style={[{borderWidth: 0, borderColor: 'red', alignItems: 'center'}, getMarginVertical(2), getWidthnHeight(90)]}>
                    <View style={[styles.flatlistcontainer, getWidthnHeight(85, 17)]}>
                        <View style={[{flex: 1}, changeBackground]}>
                            <View style={{flexDirection: 'row'}}>
                                <View style={[{borderWidth: 0, borderColor: 'red'}, getWidthnHeight(11, 5)]}>
                                    <View style={[styles.triangleCorner]}/>
                                </View>
                                <View style={[{position: 'absolute'}, getMarginLeft(1), getWidthnHeight(10)]}>
                                    <Text style={[{color:'white', borderColor: 'red', borderWidth: 0}, fontSizeH4()]}>{(serialNumber < 10)? `0${serialNumber}` : serialNumber}</Text>
                                </View>
                                <ScrollView horizontal>
                                <View style={[{
                                    flexDirection: 'row', justifyContent: 'space-between', width: (showDownload)? getWidthnHeight(62).width : getWidthnHeight(73).width, 
                                    borderWidth: 0, borderColor: 'red', borderColor: 'black'}, getMarginTop(0.5), getWidthnHeight(undefined, 3.5)
                                ]}>
                                    <Text style={[{color:'#3180E5', fontWeight:'700'}, fontSize_H3(), styles.boldFont]}>{item.fileTitle}</Text>               
                                </View>
                                </ScrollView>
                                {(showDownload) &&
                                    <View style={[{borderWidth: 0, borderColor: 'red', alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(11)]}>
                                        <TouchableHighlight underlayColor="#3280E4" onPress= {() => downloadImage(item.name, serialNumber)} 
                                            style={{width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, backgroundColor: '#DBE8F8',
                                            borderRadius: getWidthnHeight(7).width, borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center',
                                            marginTop:getMarginTop(0).marginTop, alignItems: 'center'}}
                                        >
                                            <View style={[getMarginTop(0.6)]}>   
                                                <FontAwesomeIcons name='download' size={getWidthnHeight(4.5).width}/>
                                            </View> 
                                        </TouchableHighlight>
                                    </View>
                                }
                            </View>
                            
                            <View style={[{flexDirection: 'row', borderWidth: 0, borderColor: 'black', alignItems: 'center'}, getWidthnHeight(85)]}>                       
                                <View style={[{justifyContent: 'space-between'}, getMarginLeft(5)]}>
                                    <ScrollView contentContainerStyle={{justifyContent: 'center'}} showsHorizontalScrollIndicator={false} horizontal style={[{borderWidth: 0, borderColor: 'black'}, getWidthnHeight(75, 3)]}>
                                        <Text numberOfLines={1} style={[{color:'black', borderWidth: 0, borderColor: 'black'}, fontSizeH4(), getMarginLeft(1)]}>File Name: {item.name}</Text>
                                    </ScrollView>
                                    <Text numberOfLines={1} style={[{color:'black'}, fontSizeH4(), getMarginLeft(1)]}>{(item.type)? `File Type: ${item.type}` : 'File Type: --'}</Text>
                                    <Text numberOfLines={1} style={[{color:'black'}, fontSizeH4(), getMarginLeft(1)]}>{`Conveyance: ${item.attachmentName}`}</Text>
                                </View>
                            </View>
                            <View style={[{borderColor: 'black', borderWidth: 0, height: getWidthnHeight(8).width, alignItems: 'flex-end'}, getWidthnHeight(85), getMarginTop(0)]}>
                                <View style={[{flexDirection:'row', marginRight: (showButton)? 0 : getMarginRight(2).marginRight, justifyContent: (showButton)? 'space-evenly' : 'flex-end', borderColor: 'red', borderWidth: 0, height: getWidthnHeight(8).width}, getWidthnHeight(20)]}>
                                    <TouchableHighlight underlayColor="#3280E4" onPress= {() => editDocuments(item, index)} 
                                        style={{width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, backgroundColor: '#DBE8F8',
                                        borderRadius: getWidthnHeight(7).width, borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center',
                                        marginTop:getMarginTop(0).marginTop, alignItems: 'center'}}
                                    >
                                        <View style={[getMarginTop(0.6)]}>   
                                            <FontAwesomeIcons name='edit' size={getWidthnHeight(4.5).width}/>
                                        </View> 
                                    </TouchableHighlight>
                                    {(showButton) &&
                                        <TouchableHighlight underlayColor="#3280E4" onPress= {() => deleteItinerary(index)} 
                                            style={{width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, backgroundColor: '#DBE8F8',
                                            borderRadius: getWidthnHeight(7).width, borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center',
                                            marginTop:getMarginTop(0).marginTop, alignItems: 'center'}}
                                        >
                                            <View style={[{alignItems:'center'}]}>   
                                                <AntdesignIcons name='delete' size={getWidthnHeight(4.5).width}/>
                                            </View> 
                                        </TouchableHighlight>
                                    }
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            )}
        
    
        return (
            <View>
                <Modal 
                    isVisible={isvisible}
                    onBackdropPress={toggle}
                >    
                    <View style={styles.container}>
                        <View style={[{flexDirection:'row' ,borderTopLeftRadius:12, borderTopRightRadius:12, alignItems:'flex-start'},style,getWidthnHeight(90, 7)]}>
                            <Text style={[{fontSize: (fontSizeH4().fontSize + 5), color:'white', fontWeight:'600',}, styles.boldFont, getMarginLeft(6), getMarginTop(1.3)]}>{title}</Text>
                            <View style={[{backgroundColor:'white', borderRadius:30, marginLeft:getMarginLeft(35).marginLeft, marginTop:getMarginTop(-2).marginTop}]}>
                                <TouchableOpacity onPress={toggle}>
                                    <Icons name="close" color={'#3180E5'} size={getWidthnHeight(8).width}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{flex: 1}}>
                            <ScrollView style={[getMarginVertical(1)]}> 
                                <FlatList
                                    data={data}
                                    initialNumToRender = {data.length}
                                    renderItem={renderItem}
                                    keyExtractor={item => item.id}
                                />
                            </ScrollView>
                            <View 
                                style={[{backgroundColor: (showSpinner)? 'rgba(0, 0, 0, 0.5)' : 'transparent', borderTopLeftRadius:0,
                                borderTopRightRadius: 0}, StyleSheet.absoluteFill]} 
                                pointerEvents={(showSpinner)? 'auto' : 'none'}
                            >
                                {(showSpinner) ?
                                    <Spinner loading={showSpinner} style={[styles.loadingStyle, getWidthnHeight(45, 10)]} color='rgb(19,111,232)'/>
                                : null}
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

    function FamilyDetailsModal({
        data, editFamilyData = () => {}, isvisible = false, toggle  = () => {}, colorTheme='#0B8EE8', dobBG='#FFA400', arrowColor='grey', deleteFamilyDetail = () => {},
        title = 'Family Members', showSpinner = false, nominee = false, disableEdit = false
    }){
        const [animation] = useState(new Animated.Value(0));
        const [textBoxAnimation] = useState(new Animated.Value(0));
        const [slideAnimation] = useState(new Animated.Value(0));
        const [id, setid] = useStateWithCallback(0, () => {
            if(id){
                Animated.parallel([
                    Animated.timing(animation, {
                        toValue: 1,
                        duration: 200
                    }),
                    Animated.stagger(100, [
                        Animated.timing(textBoxAnimation, {
                            toValue: 1,
                            duration: 200
                        }),
                        Animated.timing(slideAnimation, {
                            toValue: 1,
                            duration: 200
                        }),
                    ])
                ]).start()
            }
        });
      
        const expandCard = (item) => {
            animation.setValue(0);
            textBoxAnimation.setValue(0);
            setid(item.id);
            console.log("SELECT ITEM: ", item)
        }
      
        const collapseCard = () => {
            Animated.stagger(100, [
                Animated.stagger(100, [
                    Animated.timing(slideAnimation, {
                        toValue: 0,
                        duration: 200
                    }),
                    Animated.timing(textBoxAnimation, {
                        toValue: 0,
                        duration: 200
                    }),
                ]),
                Animated.timing(animation, {
                    toValue: 0,
                    duration: 200
                })
            ]).start(() => setid(''));
            
        }
            
        const renderItem = ({ item, index }) => {
            const rotateXInterpolate = animation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '180deg']
            })
            const animatedStyle = {
                transform: [{
                    rotateX: rotateXInterpolate
                }]
            }
            const heightInterpolate = {
                height: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [getWidthnHeight(undefined, 13).height, getWidthnHeight(undefined, 19).height]
                })
            }
            const textBoxInterpolate = {
                height: textBoxAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, getWidthnHeight(undefined, 6).height]
                })
            }
            const slideText = {
                transform: [
                    {
                        translateY: slideAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [getWidthnHeight(undefined, -10).height, 0]
                        })
                    }
                ]
            }
            const serialNumber = (index + 1);
            const locationIcon = (<IonIcons name={'location-sharp'} style={{backgroundColor: 'transparent'}} size={getWidthnHeight(5).width}/>);
            const locationIconOpacity = (<IonIcons name={'location-sharp'} style={{opacity: 0}} size={getWidthnHeight(5).width}/>);
            const cardIcon = (<FontAwesome5 name={'id-card'} style={{backgroundColor: 'transparent'}} size={getWidthnHeight(5).width}/>);
            const cardIconOpacity = (<FontAwesome5 name={'id-card'} style={{opacity: 0}} size={getWidthnHeight(5).width}/>);
            let familyDownload = [];
            let nomineeDownload = [];
            console.log("FAMILY MODAL: ", item);
            if(item.hasOwnProperty('aadharAttachment')){
                if(item.aadharAttachment.length > 0){
                    familyDownload = item.aadharAttachment.map((name, index) => {
                        return {id: `${index + 1}`, name: name}
                    })
                }
            }
            if(item.hasOwnProperty('nomineeAttachment')){
                if(item.nomineeAttachment.length > 0){
                    nomineeDownload = item.nomineeAttachment.map((name, index) => {
                        return {id: `${index + 1}`, name: name}
                    })
                }
            }
            return(
                <View style={[{borderWidth: 0, borderColor: 'red', alignItems: 'center'}, getMarginVertical(2), getWidthnHeight(90)]}>
                {(id !== item.id)?
                    <View style={[styles.flatlistcontainer, getWidthnHeight(undefined, 13)]}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={[{borderWidth: 0, borderColor: 'red'}, getWidthnHeight(11, 5)]}>
                                <View style={[styles.triangleCorner]}/>
                            </View>
                            <View style={[getMarginLeft(-10), getWidthnHeight(10)]}>
                                <Text style={[{color:'white', borderColor: 'red', borderWidth: 0}, fontSizeH4()]}>{(serialNumber < 10)? `0${serialNumber}` : serialNumber}</Text>
                            </View>
                            <View style={[{flexDirection: 'row', justifyContent: 'space-between', borderWidth: 0, borderColor: 'black', alignItems: 'center'}, getWidthnHeight(73)]}>
                                <Text style={[{color:'black', fontSize: fontSizeH3().fontSize - 5}, styles.boldFont]}>{(nominee)? item.nomineeName : item.name}</Text>
                                <TouchableOpacity onPress={() => expandCard(item)} style={[{borderWidth: 0, borderColor: 'red', alignItems: 'center'}, getWidthnHeight(10, 4)]}>
                                        <Animated.View style={[getMarginTop(0), getMarginLeft(0)]}>   
                                            <Icons name='angle-down' color={arrowColor} size={getWidthnHeight(4).width}/>
                                        </Animated.View>
                                </TouchableOpacity>               
                            </View>
                        </View>
                        
                        <View style={[{flexDirection: 'row', borderWidth: 0, borderColor: 'black', alignItems: 'center'}, getWidthnHeight(85), getMarginBottom(0.5)]}>
                            <View style={[{alignItems: 'center', flexDirection: 'row', borderColor: 'black', borderWidth: 0}, getMarginLeft(5)]}>
                                <Text style={[{color: colorTheme, fontWeight: 'bold'}, fontSizeH4(), styles.boldFont]}>{(nominee)? item.nomineeRelation : item.relation}</Text>
                                {(nominee) ?
                                    null
                                :
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={[fontSizeH4(), getMarginLeft(5)]}>Residing Together:</Text>
                                        <Text style={[{backgroundColor: colorTheme, color: 'white', borderRadius: getWidthnHeight(1).width}, fontSizeH4(), getMarginLeft(2)]}>  {item.residing}  </Text>
                                    </View>
                                }
                            </View>
                        </View>
                        {(disableEdit === false) &&
                            <View style={[{borderColor: 'black', borderWidth: 0, height: getWidthnHeight(8).width, alignItems: 'flex-end'}, getWidthnHeight(85), getMarginTop(0)]}>
                                <View style={[{flexDirection:'row', justifyContent: 'space-evenly', borderColor: 'red', borderWidth: 0}, getWidthnHeight(22)]}>
                                    <TouchableHighlight underlayColor="#3280E4" onPress= {() => {editFamilyData(item, index); toggle();}} 
                                        style={{width: getWidthnHeight(8).width, height: getWidthnHeight(8).width, backgroundColor: '#DBE8F8',
                                        borderRadius: getWidthnHeight(4).width, borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center',
                                        marginTop:getMarginTop(0).marginTop, alignItems: 'center'}}
                                    >
                                        <View style={[getMarginTop(0.6)]}>   
                                            <FontAwesomeIcons name='edit' color={colorTheme} size={getWidthnHeight(4.5).width}/>
                                        </View> 
                                    </TouchableHighlight>
                                    <TouchableHighlight underlayColor='rgb(224, 36, 1)' onPress= {() => deleteFamilyDetail(index)} 
                                        style={{width: getWidthnHeight(8).width, height: getWidthnHeight(8).width, backgroundColor: 'rgba(224, 36, 1, 0.2)',
                                        borderRadius: getWidthnHeight(4).width, borderWidth:0, justifyContent:'center',
                                        marginTop:getMarginTop(0).marginTop, alignItems: 'center'}}
                                    >
                                        <View style={[{alignItems:'center'}]}>   
                                            <IonIcons name='trash' color="#E02401" size={getWidthnHeight(5).width}/>
                                        </View> 
                                    </TouchableHighlight>
                                </View>
                            </View>
                        }
                    </View>
                :
                    <Animated.View style={[styles.flatlistcontainer, heightInterpolate]}>
                        <View>
                            <View style={{flexDirection: 'row'}}>
                                <View style={[{borderWidth: 0, borderColor: 'red'}, getWidthnHeight(11, 5)]}>
                                    <View style={[styles.triangleCorner]}/>
                                </View>
                                <View style={[getMarginLeft(-10), getWidthnHeight(10)]}>
                                    <Text style={[{color:'white', borderColor: 'red', borderWidth: 0}, fontSizeH4()]}>{(serialNumber < 10)? `0${serialNumber}` : serialNumber}</Text>
                                </View>
                                <View style={[{flexDirection: 'row', justifyContent: 'space-between', borderWidth: 0, borderColor: 'black', alignItems: 'center'}, getWidthnHeight(73)]}>
                                    <Text style={[{color:'black', fontSize: fontSizeH3().fontSize - 5}, styles.boldFont]}>{(nominee)? item.nomineeName : item.name}</Text>
                                    <TouchableOpacity onPress={() => collapseCard()} style={[{borderWidth: 0, borderColor: 'red', alignItems: 'center'}, getWidthnHeight(10, 4)]}>
                                            <Animated.View style={[getMarginTop(0), getMarginLeft(0), animatedStyle]}>   
                                                <Icons name='angle-down' color={arrowColor} size={getWidthnHeight(4).width}/>
                                            </Animated.View>
                                    </TouchableOpacity>               
                                </View>
                            </View>
                            
                            <View style={[{flexDirection: 'row', borderWidth: 0, borderColor: 'black', alignItems: 'center'}, getWidthnHeight(85), getMarginBottom(0.5)]}>
                                <View style={[{alignItems: 'center', flexDirection: 'row', borderColor: 'black', borderWidth: 0}, getMarginLeft(5)]}>
                                    <Text style={[{color: colorTheme, fontWeight: 'bold'}, fontSizeH4(), styles.boldFont]}>{(nominee)? item.nomineeRelation : item.relation}</Text>
                                    {(nominee) ?
                                        null
                                    :
                                        <View style={{flexDirection: 'row'}}>
                                            <Text style={[fontSizeH4(), getMarginLeft(5)]}>Residing Together:</Text>
                                            <Text style={[{backgroundColor: colorTheme, color: 'white', borderRadius: getWidthnHeight(1).width}, fontSizeH4(), getMarginLeft(2)]}>  {item.residing}  </Text>
                                        </View>
                                    }
                                </View>
                            </View>
                            <View style={{overflow: 'hidden'}}>
                                <Animated.View style={[{borderColor: 'cyan', borderWidth: 0, overflow: 'hidden'}, textBoxInterpolate]}>
                                    <Animated.View style={[slideText]}>
                                        <View style={[{flexDirection: 'row', alignItems: 'center', borderColor: 'red', borderWidth: 0}]}>
                                            <View style={[getMarginLeft(4)]}>
                                                <GradientIcon
                                                    start={{x: 0.3, y: 0}}
                                                    end={{x: 0.7, y: 0}}
                                                    containerStyle={[{borderWidth: 0, borderColor: 'red'}, getWidthnHeight(5), getMarginRight(3)]}
                                                    icon={locationIcon}
                                                    hiddenIcon={locationIconOpacity}
                                                    colors={["#039FFD", "#EA304F"]}
                                                />
                                            </View>
                                            <ScrollView 
                                                style={[{borderWidth: 0, borderColor: 'red'}, getMarginRight(3)]}
                                                horizontal 
                                                showsHorizontalScrollIndicator={false}
                                            >
                                                {(!nominee)?
                                                    <Text style={[fontSizeH4()]}>
                                                        {`${item.cityName}, ${item.stateName}`}
                                                    </Text>
                                                :
                                                    <Text style={[fontSizeH4()]}>{item.nomineeAddress}</Text>
                                                }
                                            </ScrollView>
                                        </View>
                                        <View style={[{flexDirection: 'row', alignItems: 'center', borderColor: 'black', borderWidth: 0}, getMarginTop(0.3)]}>
                                            <View style={[getMarginLeft(4)]}>
                                                <GradientIcon
                                                    start={{x: 0, y: 0}}
                                                    end={{x: 0.7, y: 0}}
                                                    containerStyle={[{borderWidth: 0, borderColor: 'red'}, getWidthnHeight(8)]}
                                                    icon={cardIcon}
                                                    hiddenIcon={cardIconOpacity}
                                                    colors={["#039FFD", "#EA304F"]}
                                                />
                                            </View>
                                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                <Text style={[fontSizeH4()]}>{(nominee)? item.nomineeAadhar : item.aadharNumber}</Text>
                                                {(familyDownload.length > 0  && title === 'Family Members') &&
                                                    <View style={[{flexDirection: 'row'}, getMarginLeft(2)]}>
                                                        <FlatList 
                                                            data={familyDownload}
                                                            horizontal
                                                            keyExtractor={(subKey) => subKey.id}
                                                            renderItem={({item}) => {
                                                                return (
                                                                    <TouchableOpacity activeOpacity={0.5}
                                                                        onPress={() => {}}
                                                                        style={[getMarginRight(3)]}
                                                                    >
                                                                        <FontAwesomeIcons name='download' color='#C4C4C4' size={getWidthnHeight(4.5).width}/>
                                                                    </TouchableOpacity>
                                                                );
                                                            }}
                                                        />
                                                    </View>
                                                }
                                                {(nomineeDownload.length > 0 && title === 'Nominees') &&
                                                    <View style={[{flexDirection: 'row'}, getMarginLeft(2)]}>
                                                        <FlatList 
                                                            data={nomineeDownload}
                                                            horizontal
                                                            keyExtractor={(subKey) => subKey.id}
                                                            renderItem={({item}) => {
                                                                return (
                                                                    <TouchableOpacity activeOpacity={0.5}
                                                                        onPress={() => {}}
                                                                        style={[getMarginRight(3)]}
                                                                    >
                                                                        <FontAwesomeIcons name='download' color='#C4C4C4' size={getWidthnHeight(4.5).width}/>
                                                                    </TouchableOpacity>
                                                                );
                                                            }}
                                                        />
                                                    </View>
                                                }
                                            </View>
                                        </View>
                                    </Animated.View>
                                </Animated.View>
                            </View>
                            <Animated.View style={[{flexDirection: 'row', borderColor: 'black', borderWidth: 0, height: getWidthnHeight(8).width, overflow: 'hidden'}, getWidthnHeight(85), getMarginTop(0)]}>
                                <View style={[{flex: 1, borderWidth: 0, borderColor: 'red', overflow: 'hidden'}]}>
                                    <Animated.View style={[{
                                        backgroundColor: '#FFB740', borderRadius: getWidthnHeight(1).width, 
                                        borderColor: 'green', borderWidth: 0, flex: 1, alignItems: 'center',
                                        justifyContent: 'center'
                                    }, getWidthnHeight(25), getMarginLeft(4), slideText]}>
                                        <Text style={[{color: '#FFFFFF', fontSize: (fontSizeH4().fontSize + 1)}]}>{moment((nominee)? item.nomineeDOB : item.dob).format("DD MMM, YYYY")}</Text>
                                    </Animated.View>
                                </View>
                                {(disableEdit === false) &&
                                    <View style={[{flexDirection:'row', justifyContent: 'space-evenly', borderColor: 'red', borderWidth: 0}, getWidthnHeight(22)]}>
                                        <TouchableHighlight underlayColor="#3280E4" onPress= {() => {editFamilyData(item, index); toggle();}} 
                                            style={{width: getWidthnHeight(8).width, height: getWidthnHeight(8).width, backgroundColor: '#DBE8F8',
                                            borderRadius: getWidthnHeight(4).width, borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center',
                                            marginTop:getMarginTop(0).marginTop, alignItems: 'center'}}
                                        >
                                            <View style={[getMarginTop(0.6)]}>   
                                                <FontAwesomeIcons name='edit' color={colorTheme} size={getWidthnHeight(4.5).width}/>
                                            </View> 
                                        </TouchableHighlight>
                                        <TouchableHighlight underlayColor='rgb(224, 36, 1)' onPress= {() => deleteFamilyDetail(index)} 
                                            style={{width: getWidthnHeight(8).width, height: getWidthnHeight(8).width, backgroundColor: 'rgba(224, 36, 1, 0.2)',
                                            borderRadius: getWidthnHeight(4).width, borderWidth:0, justifyContent:'center',
                                            marginTop:getMarginTop(0).marginTop, alignItems: 'center'}}
                                        >
                                            <View style={[{alignItems:'center'}]}>   
                                                <IonIcons name='trash' color="#E02401" size={getWidthnHeight(5).width}/>
                                            </View> 
                                        </TouchableHighlight>
                                    </View>
                                }
                            </Animated.View>
                        </View>
                        
                    </Animated.View>
            }
            </View>
            )}
          
        
            return (
                <View>
                    <Modal 
                        isVisible={isvisible}
                        onBackdropPress={toggle}
                    >    
                        <View style={styles.container}>
                            <View style={[{flexDirection:'row' ,borderTopLeftRadius:12, borderTopRightRadius:12, alignItems:'center', justifyContent: 'space-between', backgroundColor: colorTheme}, getWidthnHeight(90, 7)]}>
                                <Text style={[{fontSize: (fontSizeH4().fontSize + 7), color:'white', fontWeight:'600'}, getMarginLeft(5), styles.boldFont]}>{title}</Text>
                                <View style={[{backgroundColor:'white', borderRadius:30, marginTop:getMarginTop(-6).marginTop}, getMarginRight(5)]}>
                                    <TouchableOpacity 
                                        style={{
                                            width: getWidthnHeight(8).width, height: getWidthnHeight(8).width, borderRadius: getWidthnHeight(4).width,
                                            alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'
                                        }} 
                                        onPress={toggle}>
                                        <IonIcons name="close" color={'#3180E5'} size={getWidthnHeight(6.5).width}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{flex: 1}}>
                                <ScrollView style={[getMarginBottom(1)]}> 
                                    <FlatList
                                        data={data}
                                        initialNumToRender = {data.length}
                                        renderItem={renderItem}
                                        keyExtractor={item => `${item.id}`}
                                    />
                                </ScrollView>
                                <View 
                                    style={[{backgroundColor: (showSpinner)? 'rgba(0, 0, 0, 0.5)' : 'transparent', borderTopLeftRadius:0,
                                    borderTopRightRadius: 0}, StyleSheet.absoluteFill]} 
                                    pointerEvents={(showSpinner)? 'auto' : 'none'}
                                >
                                    {(showSpinner) ?
                                        <Spinner loading={showSpinner} style={[styles.loadingStyle, getWidthnHeight(45, 10)]} color='rgb(19,111,232)'/>
                                    : null}
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            );
        }

    const styles = StyleSheet.create({
        container:{
            width:getWidthnHeight(90).width,
            height:getWidthnHeight(undefined,60).height,
            backgroundColor: '#EEEEEE',
            borderWidth:0,
            borderColor: '#C4C4C4',
            alignItems:'center',
            borderRadius:12
        },
        flatlistcontainer:{
            width:getWidthnHeight(85).width,
            height:getWidthnHeight(undefined,15).height,
            backgroundColor: '#FFFFFF',
            borderWidth:0,
            borderColor: '#C4C4C4',
            ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: {
                    width: 0,
                    height: 5,
                },
                zIndex: 10
            },
            android: {
                elevation: 7,
            }
            }),
            shadowOpacity: 0.3,
            shadowRadius: 5,
            borderColor: 'black',
            borderWidth: 0
        }, 
        triangleCorner: {
            width: 0,
            height: 0,
            backgroundColor: "transparent",
            borderStyle: "solid",
            borderRightWidth: 40,
            borderTopWidth: 40,
            borderRightColor: "transparent",
            borderTopColor: "#307FE4",
        }, 
        boldFont: {
            ...Platform.select({
            android: {
                fontFamily: ''
            }
            })
        },
        arrow: {
            width: 0,
            height: 0,
            backgroundColor: "transparent",
            borderStyle: "solid",
            borderRightWidth: getWidthnHeight(2.3).width,
            borderTopWidth: getWidthnHeight(2.3).width,
            borderRightColor: "black",
            borderTopColor: "transparent",
            transform: [{
                rotate: '-45deg'
            }]
        },
        loadingStyle: {
            flexDirection:'row', 
            backgroundColor: '#EFEFEF',
            alignItems: 'center',
            justifyContent: 'center',
            //position: 'absolute', 
            borderRadius: 10,      
            shadowOffset:{width: 0,  height: 5},
            shadowColor: '#000000',
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 10,
            borderColor: 'red',
            borderWidth: 0
        },
    });
  

export {
    ItineraryModal, StayModal, ItineraryDescriptionModal, DocumentsModal,
    FamilyDetailsModal
};