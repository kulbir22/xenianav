import React, { Component } from 'react';
import { Platform, StyleSheet, Image, Animated} from 'react-native';
import {Text, View, TouchableOpacity, ImageBackground, Linking, FlatList} from 'react-native';
import ActionModal from 'react-native-modal';
import Arrow from 'react-native-vector-icons/FontAwesome';
import {fontSizeH4, getMarginBottom, getMarginHorizontal, getMarginLeft, getMarginTop, getMarginVertical, getWidthnHeight} from './width';

class AppUpdate extends Component{
    constructor(props){
        super(props)
            this.state = {
                errorCode: null,
                astronautCalled: false,
                animateImage1: new Animated.Value(0),
                animateImage2: new Animated.Value(0),
                animateOpacity: new Animated.Value(1),
                animateScale: new Animated.Value(0),
                animateRocket: new Animated.Value(0),
                later: false,
                dummyUpdates: ['App Update UI', 'Manage Travel', 'Login Page', 'Dashboard Notifications', 'App Update UI', 'Manage Travel', 'Login Page', 'Dashboard Notifications'],
                updateNow: false,
                updateLater: false
            }
    }

    getInsideRocket(){
        const {animateImage1, animateImage2, animateOpacity} = this.state;
        this.setState({updateNow: true})
        Animated.stagger(300, [
            Animated.parallel([
                Animated.timing(animateImage1, {
                    toValue: 1,
                    duration: 400
                }),
                Animated.timing(animateImage2, {
                    toValue: 1,
                    duration: 400
                })
            ]),
            Animated.timing(animateOpacity, {
                toValue: 0,
                duration: 200
            })
        ]).start(() => {
            this.setState({astronautCalled: true}, () => {
                const {animateScale, animateRocket} = this.state;
                Animated.stagger(300, [
                    Animated.timing(animateScale, {
                        toValue: 1,
                        duration: 500
                    }),
                    Animated.timing(animateRocket, {
                        toValue: 1,
                        duration: 1000
                    })
                ]).start(async({finished}) => {
                    if(finished){
                        if(Platform.OS === "android"){
                            this.props.androidURL();
                        }else if(Platform.OS === "ios"){
                            this.props.iOSURL();
                        }
                        this.props.onDecline();
                    }
                })
            })
        })
    }

    postPoneLaunch(){
        this.setState({later: true, updateLater: true}, () => {
            const {animateImage1, animateImage2, animateOpacity} = this.state;
            Animated.parallel([
                Animated.timing(animateImage1, {
                    toValue: 1,
                    duration: 1000
                }),
                Animated.timing(animateImage2, {
                    toValue: 1,
                    duration: 1000
                })
            ]).start(({finished}) => {
                if(finished){
                    this.props.onDecline();
                }
            })
        })
    }

    renderItem({item}){
        console.log("ITEMS: ", item)
        return(
            <View style={[{flexDirection: 'row', alignItems: 'center'}, getMarginVertical(1)]}>
                <Arrow name="arrow-circle-right" size={Math.floor(getWidthnHeight(5).width)} color="#40394A"/>
                <Text style={[{marginLeft: 10}, fontSizeH4()]}>{item}</Text>
            </View>
        )
    }

    render(){
        const {animateImage1, animateImage2, animateOpacity, astronautCalled, animateScale, animateRocket, later, updateNow, updateLater} = this.state;
        const {title, subtitle, visible, onDecline, featureList} = this.props;
        const animateAstronaut1 = {
            transform: [{
                translateX: animateImage1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, getMarginLeft(20).marginLeft]
                })
            }]
        }
        const animateAstronaut2 = {
            transform: [{
                translateX: animateImage2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, getMarginLeft(-18).marginLeft]
                })
            }]
        }
        const animateAstranautOpacity = {
            opacity: animateOpacity
        }
        const animateFire = {
            opacity: animateOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0]
            }),
            transform: [{
                scale: animateScale
            }]
        }
        const removeAstronaut1 = {
            transform: [{
                translateX: animateImage1.interpolate({
                    inputRange: [0, 0.2, 1],
                    outputRange: [0, getWidthnHeight(10).width , getWidthnHeight(-100).width]
                })
            }]
        }
        const removeAstronaut2 = {
            transform: [{
                translateX: animateImage2.interpolate({
                    inputRange: [0, 0.2, 1],
                    outputRange: [0, getWidthnHeight(-10).width, getWidthnHeight(100).width]
                })
            }]
        }
        const rocketStyle = {
            transform: [{
                translateY: animateRocket.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, (-1) * getWidthnHeight(undefined, 70).height]
                })
            }]
        }
    return (
        <ActionModal 
            isVisible={visible}
            style={{justifyContent: 'center', alignItems: 'center'}}
            onBackdropPress={onDecline}
            animationIn="bounceInLeft"
            animationInTiming={800}
            animationOut="slideOutRight"
            animationOutTiming={500}
        >   
            <View style={[{backgroundColor: 'transparent', borderRadius: 10, alignItems: 'center'}, getWidthnHeight(95)]}>
                <View style={[{backgroundColor: 'white', alignItems: 'center', justifyContent: 'space-between', borderRadius: 10}, getWidthnHeight(95, 55)]}>
                    <View style={[{borderRadius: 10, overflow: 'hidden', alignItems: 'center'}, getWidthnHeight(95)]}>
                        <ImageBackground source={require('../../Image/landscape.jpg')} resizeMode="contain" style={[{borderRadius: 10, borderWidth: 0, borderColor: 'red', alignItems: 'center', justifyContent: 'flex-end'}, getMarginTop(-2), getWidthnHeight(95, 25)]}/>
                    </View>
                    <View style={[StyleSheet.absoluteFill]}>
                        <View style={[{alignItems: 'center', justifyContent: 'flex-end'}, getWidthnHeight(95, 25), getMarginTop(-2)]}>
                            <View>
                                <Animated.Image source={require('../../Image/rocket.png')} resizeMode="contain" style={[{borderColor: 'red', borderWidth: 0}, getWidthnHeight(14, 15), rocketStyle]}/>
                            </View>
                            <View style={[{alignItems: 'center', borderWidth: 0, borderColor: 'red', position: 'absolute'}]}>
                                {(astronautCalled) && (
                                    <View style={[{transform: [{translateY: getMarginTop(4).marginTop}]}]}>
                                        <Animated.Image source={require('../../Image/fire.png')} resizeMode="contain" style={[{borderColor: 'red', borderWidth: 0}, getWidthnHeight(5, 10), animateFire, rocketStyle]}/>
                                    </View>
                                )}
                            </View>
                            
                            <View style={[{position: 'absolute'}]}>
                                <Animated.View style={[{flexDirection: 'row', borderWidth: 0, borderColor: 'white', justifyContent: 'space-between'}, getWidthnHeight(60), animateAstranautOpacity]}>
                                    <View style={[getMarginBottom(-3), getMarginLeft(3)]}>
                                        <Animated.Image resizeMode="contain" source={require('../../Image/astronaut.png')} style={[getWidthnHeight(10, 15), (later)? removeAstronaut1 : animateAstronaut1]}/>
                                    </View>
                                    <View style={[getMarginBottom(-3), getMarginLeft(0)]}>
                                        <Animated.Image resizeMode="contain" source={require('../../Image/astronaut2.png')} style={[getWidthnHeight(10, 15), (later)? removeAstronaut2 : animateAstronaut2]}/>
                                    </View>
                                </Animated.View>
                            </View>
                        </View>
                    </View>
                    <View style={[{alignItems: 'center'}, getWidthnHeight(95)]}>
                        <View style={[{borderColor: 'red', borderWidth: 0, alignItems: 'center'}, getWidthnHeight(95, 25), getMarginBottom(1)]}>
                            <View style={[{flexDirection: 'row', justifyContent: 'space-between'}, getWidthnHeight(95), getMarginBottom(1)]}>
                                <Text style={[{fontWeight: 'bold'}, styles.boldFont, fontSizeH4(), getMarginHorizontal(2)]}>{title.toUpperCase()}</Text>
                                <Text style={[{fontWeight: 'bold'}, styles.boldFont, fontSizeH4(), getMarginHorizontal(2)]}>{subtitle}</Text>
                            </View>
                            <View style={[getWidthnHeight(90, 21.5)]}>
                                <Animated.FlatList 
                                    data={featureList}
                                    renderItem={this.renderItem}
                                />
                            </View>
                        </View>
                        <View style={[{flexDirection: 'row', justifyContent: 'space-between'}, getWidthnHeight(70), getMarginBottom(1)]}>
                            <TouchableOpacity activeOpacity={0.7} onPress={() => (!updateNow)? this.postPoneLaunch() : null}>
                                <View style={[{alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF475A', borderRadius: getWidthnHeight(undefined, 5).height}, getWidthnHeight(30, 5)]}>
                                    <Text style={[{color: '#FFFFFF', fontWeight: '700'}, styles.boldFont, fontSizeH4()]}>LATER</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.7} onPress={() => (!updateLater)? this.getInsideRocket() : null}>
                                <View style={[{alignItems: 'center', justifyContent: 'center', backgroundColor: '#42B883', borderRadius: getWidthnHeight(undefined, 5).height}, getWidthnHeight(30, 5)]}>
                                    <Text style={[{color: '#FFFFFF', fontWeight: '700'}, styles.boldFont, fontSizeH4()]}>UPDATE NOW</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </ActionModal>
    )}
};

const styles = {
    boldFont: {
        ...Platform.select({
            android: {
                fontFamily: ''
            }
        })
    }
}

export {AppUpdate};