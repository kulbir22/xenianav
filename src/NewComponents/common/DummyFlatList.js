import React, {Component} from 'react';
import { Platform } from 'react-native';
import {Animated, View, Text, TouchableWithoutFeedback, TouchableOpacity, Image} from 'react-native';
import {getWidthnHeight, getMarginTop, fontSizeH4, getMarginHorizontal} from './width';

const PADDING = getMarginHorizontal(2.5).marginHorizontal;
const ITEM_SIZE = Math.floor(getWidthnHeight(30).width) + Math.floor(getMarginHorizontal(2.5).marginHorizontal) * 2;
const BounceTouch = Animated.createAnimatedComponent(TouchableWithoutFeedback);

const leaveIcon = (<Image source={require('../../Image/leave32.png')} style={{width: getWidthnHeight(5).width, height: getWidthnHeight(5).width}}/>)
const attendanceIcon = (<Image source={require('../../Image/atten.png')} style={{width: getWidthnHeight(5).width, height: getWidthnHeight(5).width}}/>)
const taskIcon = (<Image source={require('../../Image/task_2.png')} style={{width: getWidthnHeight(5).width, height: getWidthnHeight(5).width}}/>)
const leadIcon = (<Image source={require('../../Image/lead.png')} style={{width: getWidthnHeight(5).width, height: getWidthnHeight(5).width}}/>)

class DummyFlatlist extends Component {
    constructor(props){
        super(props)
        this.state = {
            storeIndex: null,
            animateValue: new Animated.Value(1),
            scrollX: new Animated.Value(0),
        }
    }

    animateIndividual(index){
        const {animateValue, storeIndex} = this.state;
        if(storeIndex !== null){
            return;
        }
        this.setState({storeIndex: index}, () => console.log("ANIMATE INDIVIDUAL: ", this.state.storeIndex))
        Animated.sequence([
            Animated.spring(animateValue, {
                toValue: 1.15,
                friction: 7,
                tension: 250,
                useNativeDriver: true
            }),
            Animated.timing(animateValue, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true
            })
            // Animated.spring(animateValue, {
            //     toValue: 1,
            //     friction: 7,
            //     tension: 250,
            //     useNativeDriver: true
            // })
        ]).start(() => this.setState({storeIndex: null}))
    }

    render(){
    const {appContent, animateScale} = this.props;
    const {scrollX} = this.state;
    return  (
        <Animated.FlatList 
            horizontal
            onScroll={Animated.event([
                {nativeEvent: {
                    contentOffset: {
                        x: scrollX
                    }
                }}
            ],
            {useNativeDriver: true}
            )}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(data) => data.name}
            data={appContent}
            renderItem={({item, index}) => {
                const {storeIndex, animateValue} = this.state;
                const inputRange = [
                    -1,
                    0,
                    ITEM_SIZE * index,
                    ITEM_SIZE * (index + 2)
                ]
                const scale = scrollX.interpolate({
                    inputRange,
                    outputRange: [1, 1, 1, 0]
                })
                const opacityInputRange = [
                    -1,
                    0,
                    ITEM_SIZE * index,
                    ITEM_SIZE * (index + 1)
                ]
                const opacity = scrollX.interpolate({
                    inputRange: opacityInputRange,
                    outputRange: [1, 1, 1, 0]
                })
                return(
                    <TouchableWithoutFeedback onPress={() => this.animateIndividual(index)}>
                        <View>
                            {(storeIndex === index)?
                            <Animated.View style={[{
                                width: Math.floor(getWidthnHeight(30).width), height: Math.floor(getWidthnHeight(30).width), 
                                alignItems: 'center', justifyContent: 'center', backgroundColor: item.color,
                                borderRadius: 10, borderColor: 'black', borderWidth: 0, transform: [{scale: animateValue}],
                                marginHorizontal: Math.floor(getMarginHorizontal(2.5).marginHorizontal), opacity,
                                padding: PADDING, shadowColor: '#000', elevation: 8, shadowOffset: {width: 0, height: 10}, shadowOpacity: 0.3, shadowRadius: 10
                            }, animateScale]}>
                                <View style={{
                                    backgroundColor: 'white', width: Math.floor(getWidthnHeight(13).width), height: Math.floor(getWidthnHeight(13).width), 
                                    borderRadius: Math.floor(getWidthnHeight(10).width), alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {item.icon}
                                </View>
                                <Text style={[{color: 'white', fontWeight: 'bold'}, styles.boldFont, getMarginTop(1), fontSizeH4()]}>{item.name.toUpperCase()}</Text>
                            </Animated.View>
                            :
                            <Animated.View style={[{
                                width: Math.floor(getWidthnHeight(30).width), height: Math.floor(getWidthnHeight(30).width), 
                                alignItems: 'center', justifyContent: 'center', backgroundColor: item.color,
                                borderRadius: 10, borderColor: 'black', borderWidth: 0, transform: [{scale}],
                                marginHorizontal: Math.floor(getMarginHorizontal(2.5).marginHorizontal), opacity,
                                padding: PADDING, shadowColor: '#000', elevation: 8, shadowOffset: {width: 0, height: 10}, shadowOpacity: 0.3, shadowRadius: 10
                            }, animateScale]}>
                                <View style={{
                                    backgroundColor: 'white', width: Math.floor(getWidthnHeight(13).width), height: Math.floor(getWidthnHeight(13).width), 
                                    borderRadius: Math.floor(getWidthnHeight(10).width), alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {item.icon}
                                </View>
                                <Text style={[{color: 'white', fontWeight: 'bold'}, styles.boldFont, getMarginTop(1), fontSizeH4()]}>{item.name.toUpperCase()}</Text>
                            </Animated.View>
                            }
                        </View>
                    </TouchableWithoutFeedback>
            )}}
            contentContainerStyle={[{backgroundColor: '#F8F3F3', borderRadius: 10, padding: PADDING, paddingLeft: PADDING, alignItems: 'center'}]}
            style={[{borderWidth: 0, borderColor: 'black'}]}
        />
    )};

}

const styles = {
    boldFont: {
        ...Platform.select(
            {
                android: {
                    fontFamily: ''
                }
            }
        )
    }
}

export {DummyFlatlist};