import React, {Component} from "react";
import { View, Text, Platform, StyleSheet, Animated, Image, Easing, TouchableOpacity } from "react-native";
import Modal from 'react-native-modal';
import {Svg, G, Defs, Stop, LinearGradient, Path, Styles} from "react-native-svg";
import GradientBackground from 'react-native-linear-gradient';
import Sound from "react-native-sound";
import UnMute from 'react-native-vector-icons/Octicons';
import Mute from 'react-native-vector-icons/Ionicons';
import {getWidthnHeight, getMarginLeft, getMarginTop, fontSizeH4, getMarginRight} from './width';
import {HotAirBalloon} from './HotAirBalloon';
import {Explosion} from './Explosion';

const RocketTrail = Animated.createAnimatedComponent(GradientBackground);

class SelfBirthday extends Component {
    constructor(props){
        super(props)
        this.state = {
            animateBox1: new Animated.Value(0),
            animateBox2: new Animated.Value(0),
            animateBox3: new Animated.Value(0),
            animateBox4: new Animated.Value(0),
            animateBalloon1: new Animated.Value(1),
            animateBalloon2: new Animated.Value(1),
            animateBalloon3: new Animated.Value(1),
            animateBalloon4: new Animated.Value(1),
            animateRocket1: new Animated.Value(0),
            animateRocket2: new Animated.Value(0),
            animateRocket3: new Animated.Value(0),
            animateRocket4: new Animated.Value(0),
            outerRingAnimation: new Animated.Value(0),
            inner1Animation: new Animated.Value(0),
            inner2Animation: new Animated.Value(0),
            innerCircle: new Animated.Value(0),
            fireCrackerColor1: '', 
            fireCrackerColor2: '', 
            fireCrackerColor3: '',
            fireCrackerColor4: '',
            outerRingAnimation2: new Animated.Value(0),
            inner1Animation2: new Animated.Value(0),
            inner2Animation2: new Animated.Value(0),
            innerCircle2: new Animated.Value(0),
            animateAirPlane: new Animated.Value(0),
            animateUserImage: new Animated.Value(0),
            animateCloud: new Animated.Value(0),
            mute: false,
            music: null
        }
    }

    componentDidMount(){
        this.playMusic();
        this.flyingAirplane();
        this.balloonBox1_4();
        this.fireCrackerColor();
    }

    playMusic(){
        let music = new Sound('happy_bday.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
              console.log('failed to load the sound', error);
              return;
            }
            // loaded successfully
            //console.log('duration in seconds: ' + music.getDuration() + 'number of channels: ' + music.getNumberOfChannels());
           
            // Play the sound with an onEnd callback
            music.play((success) => {
              if (success) {
                console.log('successfully finished playing');
              } else {
                console.log('playback failed due to audio decoding errors');
              }
            });
        });
        this.setState({music})
    }

    flyingAirplane(){
        const {animateAirPlane, animateUserImage, animateCloud} = this.state;
        Animated.loop(
                Animated.sequence([
                    Animated.timing(animateAirPlane, {
                        toValue: 1,
                        duration: 10000
                    }),
                    Animated.timing(animateAirPlane, {
                        toValue: 2,
                        duration: 1
                    }),
                    Animated.delay(300),
                    Animated.timing(animateAirPlane, {
                        toValue: 3,
                        duration: 4000
                    })
                ])
        ).start();
        Animated.loop(
            Animated.sequence([
                Animated.timing(animateUserImage, {
                    toValue: 1,
                    duration: 2000
                }),
                Animated.timing(animateUserImage, {
                    toValue: 0,
                    duration: 2000
                })
            ])
        ).start();
        Animated.loop(
            Animated.sequence([
                Animated.timing(animateCloud, {
                    toValue: 1,
                    duration: 25000,
                    easing: Easing.ease
                })
            ])
        ).start();
    }

    fireCrackerColor(){
        const fireCrackerR1 = Math.floor((Math.random() * 256))
        const fireCrackerG1 = Math.floor((Math.random() * 256))
        const fireCrackerB1 = Math.floor((Math.random() * 256))
        const fireCrackerR2 = Math.floor((Math.random() * 256))
        const fireCrackerG2 = Math.floor((Math.random() * 256))
        const fireCrackerB2 = Math.floor((Math.random() * 256))
        const fireCrackerR3 = Math.floor((Math.random() * 256))
        const fireCrackerG3 = Math.floor((Math.random() * 256))
        const fireCrackerB3 = Math.floor((Math.random() * 256))
        const fireCrackerR4 = Math.floor((Math.random() * 256))
        const fireCrackerG4 = Math.floor((Math.random() * 256))
        const fireCrackerB4 = Math.floor((Math.random() * 256))
        const fireCrackerColor1 = `rgb(${fireCrackerR1}, ${fireCrackerG1}, ${fireCrackerB1})`
        const fireCrackerColor2 = `rgb(${fireCrackerR2}, ${fireCrackerG2}, ${fireCrackerB2})`
        const fireCrackerColor3 = `rgb(${fireCrackerR3}, ${fireCrackerG3}, ${fireCrackerB3})`
        const fireCrackerColor4 = `rgb(${fireCrackerR4}, ${fireCrackerG4}, ${fireCrackerB4})`
        this.setState({fireCrackerColor1, fireCrackerColor2, fireCrackerColor3, fireCrackerColor4}, () => this.launchRockets());
    }

    launchRockets(){
        const {
            animateRocket1, animateRocket2, animateRocket3, animateRocket4,
            outerRingAnimation, inner1Animation, inner2Animation, innerCircle,
            outerRingAnimation2, inner1Animation2, inner2Animation2, innerCircle2,
        } = this.state;
        Animated.loop(
            Animated.stagger(1000, [
                Animated.sequence([
                    Animated.timing(animateRocket2, {
                        toValue: 1,
                        duration: 2000
                    }),
                    Animated.stagger(1000, [
                        Animated.stagger(500, [
                            Animated.timing(innerCircle2, {
                                toValue: 2,
                                duration: 1000
                            }),
                            Animated.timing(inner2Animation2, {
                                toValue: 2,
                                duration: 1000
                            }),
                            Animated.timing(inner1Animation2, {
                                toValue: 2,
                                duration: 1000
                            }),
                            Animated.timing(outerRingAnimation2, {
                                toValue: 2,
                                duration: 1000
                            })
                        ])
                    ])
                ]),
                Animated.sequence([
                    Animated.timing(animateRocket1, {
                        toValue: 1,
                        duration: 2000
                    }),
                    Animated.stagger(1000, [
                        Animated.stagger(500, [
                            Animated.timing(innerCircle, {
                                toValue: 2,
                                duration: 1000
                            }),
                            Animated.timing(inner2Animation, {
                                toValue: 2,
                                duration: 1000
                            }),
                            Animated.timing(inner1Animation, {
                                toValue: 2,
                                duration: 1000
                            }),
                            Animated.timing(outerRingAnimation, {
                                toValue: 2,
                                duration: 1000
                            })
                        ])
                    ])
                ])
            ])
        ).start();
    }

    balloonBox1_4(){
        const {animateBox1, animateBox2, animateBox3, animateBox4} = this.state;
        Animated.stagger(100, [
            Animated.parallel([
                Animated.timing(animateBox1, {
                    toValue: 1,
                    duration: 3000
                }),
                Animated.timing(animateBox4, {
                    toValue: 1,
                    duration: 3000
                }),
            ]),
            Animated.parallel([
                Animated.timing(animateBox2, {
                    toValue: 1,
                    duration: 3000
                }),
                Animated.timing(animateBox3, {
                    toValue: 1,
                    duration: 3000
                }),
            ])
        ]).start(({finished}) => {
            const {animateBalloon1, animateBalloon2, animateBalloon3, animateBalloon4} = this.state;
            if(finished){
                Animated.loop(
                    Animated.parallel([
                        Animated.sequence([
                            Animated.timing(animateBalloon1, {
                                toValue: 0,
                                duration: 2500
                            }),
                            Animated.timing(animateBalloon1, {
                                toValue: 1,
                                duration: 2500
                            }),
                        ]),
                        Animated.sequence([
                            Animated.timing(animateBalloon2, {
                                toValue: 0,
                                duration: 2500
                            }),
                            Animated.timing(animateBalloon2, {
                                toValue: 1,
                                duration: 2500
                            }),
                        ]),
                        Animated.sequence([
                            Animated.timing(animateBalloon3, {
                                toValue: 0,
                                duration: 2500
                            }),
                            Animated.timing(animateBalloon3, {
                                toValue: 1,
                                duration: 2500
                            }),
                        ]),
                        Animated.sequence([
                            Animated.timing(animateBalloon4, {
                                toValue: 0,
                                duration: 2500
                            }),
                            Animated.timing(animateBalloon4, {
                                toValue: 1,
                                duration: 2500
                            }),
                        ])
                    ])
                ).start();
            }
        })
    }

    render(){
        const {
            animateUserImage,
            animateBox1, animateBox2, animateBox3, animateBox4, animateAirPlane,
            animateBalloon1, animateBalloon2, animateBalloon3, animateBalloon4,
            animateRocket1, animateRocket2, animateRocket3, animateRocket4,
            outerRingAnimation, inner1Animation, inner2Animation, innerCircle,
            outerRingAnimation2, inner1Animation2, inner2Animation2, innerCircle2,
            fireCrackerColor1, fireCrackerColor2, fireCrackerColor3, fireCrackerColor4,
            animateCloud, mute, music
        } = this.state;
        const {visible, onDecline, userImage, gender = "male", userName} = this.props;
        //console.log("CHECK RESULT: ", 2%2)
        let imageUploaded = false;
        if(!userImage.uri.includes('userPic')){
            imageUploaded = true;
        }
        console.log("##### CHECK IMAGE", userImage.uri.includes('userPic'));
        const boxAnimation1 = {
            transform: [
                {
                    translateX: animateBox1.interpolate({
                        inputRange: [0, 1],
                        outputRange: [(-1)*getMarginLeft(20).marginLeft, getMarginLeft(10).marginLeft],
                    })
                }
            ]
        }
        const balloonAnimation1 = {
            transform: [
                {
                    translateX: animateBalloon1.interpolate({
                        inputRange: [0, 1],
                        outputRange: [(-1)*getMarginLeft(2).marginLeft, getMarginLeft(2).marginLeft],
                    })
                }
            ],
            //opacity: 0.3
        }
        const boxAnimation2 = {
            transform: [
                {
                    translateX: animateBox2.interpolate({
                        inputRange: [0, 1],
                        outputRange: [getMarginLeft(90).marginLeft, getMarginLeft(65).marginLeft]
                    })
                },
                {
                    translateY: getMarginTop(8).marginTop
                }
            ]
        }
        const balloonAnimation2 = {
            transform: [
                {
                    translateX: animateBalloon2.interpolate({
                        inputRange: [0, 1],
                        outputRange: [getMarginLeft(2).marginLeft, (-1)*getMarginLeft(2).marginLeft]
                    })
                }
            ],
            //opacity: 0.3
        }
        const boxAnimation3 = {
            transform: [
                {
                    translateX: getMarginLeft(2).marginLeft
                },
                {
                    translateY: animateBox3.interpolate({
                        inputRange: [0, 1],
                        outputRange: [getMarginTop(70).marginTop, getMarginTop(25).marginTop]
                    })
                }
            ]
        }
        const balloonAnimation3 = {
            transform: [
                {
                    translateY: animateBalloon3.interpolate({
                        inputRange: [0, 1],
                        outputRange: [getMarginTop(2).marginTop, (-1)*getMarginTop(2).marginTop]
                    })
                }
            ],
            //opacity: 0.4
        }
        const boxAnimation4 = {
            transform: [
                {
                    translateY: animateBox4.interpolate({
                        inputRange: [0, 1],
                        outputRange: [getMarginTop(60).marginTop, getMarginTop(43).marginTop],
                    })
                }
            ]
        }
        const balloonAnimation4 = {
            transform: [
                {
                    translateX: getMarginLeft(50).marginLeft
                },
                {
                    translateY: animateBalloon4.interpolate({
                        inputRange: [0, 1],
                        outputRange: [(-1)*getMarginTop(2).marginTop, getMarginTop(2).marginTop]
                    })
                }
            ],
            //opacity: 0.2
        }
        const rocketAnimation1 = {
            height: animateRocket1.interpolate({
                inputRange: [0, 1],
                outputRange: [getMarginTop(30).marginTop, 0]
            }),
            transform: [
                {
                    translateY: animateRocket1.interpolate({
                        inputRange: [0, 1],
                        outputRange: [getMarginTop(60).marginTop, getMarginTop(-15).marginTop]
                    })
                },
                {
                    translateX: getMarginLeft(65).marginLeft
                }
            ]
        }
        const rocketAnimation3 = {
            height: animateRocket1.interpolate({
                inputRange: [0, 1],
                outputRange: [getMarginTop(30).marginTop, 0]
            }),
            transform: [
                {
                    translateY: animateRocket1.interpolate({
                        inputRange: [0, 1],
                        outputRange: [getMarginTop(60).marginTop, getMarginTop(25).marginTop]
                    })
                },
                {
                    translateX: getMarginLeft(5).marginLeft
                }
            ]
        }
        const innerCircleAnimation = {
            transform: [
                {
                    scale: innerCircle.interpolate({
                        inputRange: [0, 2],
                        outputRange: [0, 1]
                    })
                }
            ],
            opacity: innerCircle.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [0, 1, 0]
            })
        }
        const inner2ndRingAnimation = {
            transform: [
                {
                    scale: inner2Animation.interpolate({
                        inputRange: [0, 2],
                        outputRange: [0, 1]
                    })
                }
            ],
            opacity: inner2Animation.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [0, 1, 0]
            })
        }
        const inner1stRingAnimation = {
            transform: [
                {
                    scale: inner1Animation.interpolate({
                        inputRange: [0, 2],
                        outputRange: [0, 1]
                    })
                }
            ],
            opacity: inner1Animation.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [0, 1, 0]
            })
        }
        const outerCircleAnimation = {
            transform: [
                {
                    scale: outerRingAnimation.interpolate({
                        inputRange: [0, 2],
                        outputRange: [0, 1]
                    })
                }
            ],
            opacity: outerRingAnimation.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [0, 1, 0]
            })
        }

        const rocketAnimation2 = {
            height: animateRocket2.interpolate({
                inputRange: [0, 1],
                outputRange: [getMarginTop(25).marginTop, 0]
            }),
            transform: [
                {
                    translateY: animateRocket2.interpolate({
                        inputRange: [0, 1],
                        outputRange: [getMarginTop(60).marginTop, getMarginTop(0).marginTop]
                    })
                },
                {
                    translateX: getMarginLeft(0).marginLeft
                }
            ]
        }
        const rocketAnimation4 = {
            height: animateRocket2.interpolate({
                inputRange: [0, 1],
                outputRange: [getMarginTop(25).marginTop, 0]
            }),
            transform: [
                {
                    translateY: animateRocket2.interpolate({
                        inputRange: [0, 1],
                        outputRange: [getMarginTop(60).marginTop, getMarginTop(15).marginTop]
                    })
                },
                {
                    translateX: getMarginLeft(60).marginLeft
                }
            ]
        }
        const innerCircleAnimation2 = {
            transform: [
                {
                    scale: innerCircle2.interpolate({
                        inputRange: [0, 2],
                        outputRange: [0, 1.5]
                    })
                }
            ],
            opacity: innerCircle2.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [0, 1, 0]
            })
        }
        const inner2ndRingAnimation2 = {
            transform: [
                {
                    scale: inner2Animation2.interpolate({
                        inputRange: [0, 2],
                        outputRange: [0, 1.5]
                    })
                }
            ],
            opacity: inner2Animation2.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [0, 1, 0]
            })
        }
        const inner1stRingAnimation2 = {
            transform: [
                {
                    scale: inner1Animation2.interpolate({
                        inputRange: [0, 2],
                        outputRange: [0, 1.5]
                    })
                }
            ],
            opacity: inner1Animation2.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [0, 1, 0]
            })
        }
        const outerCircleAnimation2 = {
            transform: [
                {
                    scale: outerRingAnimation2.interpolate({
                        inputRange: [0, 2],
                        outputRange: [0, 1.5]
                    })
                }
            ],
            opacity: outerRingAnimation2.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [0, 1, 0]
            })
        }
        const airplaneAnimatedStyle = {
            transform: [
                {
                    translateX: animateAirPlane.interpolate({
                        inputRange: [0, 1],
                        outputRange: [getMarginLeft(-20).marginLeft, getMarginLeft(92).marginLeft],
                        extrapolate: 'clamp'
                    })
                },
                {
                    translateY: animateAirPlane.interpolate({
                        inputRange: [0, 1, 2, 3],
                        outputRange: [getMarginTop(5).marginTop, getMarginTop(5).marginTop, getMarginTop(47).marginTop, getMarginTop(47).marginTop],
                    })
                },
                {
                    scaleX: animateAirPlane.interpolate({
                        inputRange: [0, 1, 2],
                        outputRange: [1, 1, -1],
                        extrapolate: 'clamp'
                    })
                },
                {
                    scale: animateAirPlane.interpolate({
                        inputRange: [0, 1, 2],
                        outputRange: [1, 1, 1.7],
                        extrapolate: 'clamp'
                    })
                }
            ],
            marginLeft: animateAirPlane.interpolate({
                inputRange: [0, 1, 2, 3],
                outputRange: [0, 0, getMarginLeft(12).marginLeft, getMarginLeft(-120).marginLeft]
            })
        }
        const userImageAnimatedStyle ={
            transform: [
                {
                    scale: animateUserImage.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1]
                    })
                }
            ]
        }
        const cloudAnimation = {
            transform: [
                {
                    translateX: animateCloud.interpolate({
                        inputRange: [0, 1],
                        outputRange: [getMarginLeft(-20).marginLeft, getMarginLeft(90).marginLeft]
                    })
                },
                {
                    translateY: getMarginTop(12).marginTop
                }
            ],
            //opacity: 0.7
        }
        return (
            <View>
                <Modal
                    isVisible={visible}
                    style={{justifyContent: 'center', alignItems: 'center'}}
                    onBackdropPress={() => {
                        music.release();
                        onDecline();
                    }}
                    animationIn="bounceInDown"
                    animationInTiming={800}
                    animationOut="slideOutRight"
                    animationOutTiming={500}
                >
                    <GradientBackground 
                        start={{x: 0.5, y: 0.1}} end={{x: 0.5, y: 0.9}}
                        //colors={["rgba(255, 211, 132, 0.4)", "rgba(245, 171, 201, 0.8)"]}
                        colors={["rgba(101, 201, 207, 0.5)", "rgba(255, 211, 132, 0.7)"]}
                        style={[{backgroundColor: 'white', borderRadius: getWidthnHeight(5).width, overflow: 'hidden', alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(90, 60)]}>
                        <View style={[{flex: 1, borderWidth: 0, borderColor: 'red'}, getWidthnHeight(90)]}>
                            <View style={{position: 'absolute', alignSelf: 'flex-end'}}>
                                <View style={[getMarginRight(0), getMarginTop(0)]}>
                                    <TouchableOpacity 
                                        activeOpacity={0.5}
                                        style={{
                                            borderColor: 'white', borderWidth: 0, width: getWidthnHeight(15).width, height: getWidthnHeight(10).width,
                                            alignItems: 'center', justifyContent: 'center'
                                        }} 
                                        onPress={() => this.setState({mute: !this.state.mute}, () => {
                                            const {mute, music} = this.state;
                                            if(mute){
                                                music.setVolume(0);
                                            }else{
                                                music.setVolume(1);
                                            }
                                        })}>
                                        {(!mute) && (
                                            <UnMute name="unmute" size={getWidthnHeight(7).width} color="#000"/>
                                        )}
                                        {(mute) && (
                                            <Mute name="volume-mute-sharp" size={getWidthnHeight(7).width} color="#000"/>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{position: 'absolute'}}>
                                <Animated.Image resizeMode="contain" source={require('../../Image/blimp.png')} style={[airplaneAnimatedStyle, {width: getWidthnHeight(15).width, height: getWidthnHeight(15).width, borderWidth: 0, borderColor: 'red'}]}/>
                            </View>
                            <View style={{position: 'absolute'}}>
                                <Animated.Image resizeMode="contain" source={require('../../Image/Cloud3.png')} style={[cloudAnimation, {width: getWidthnHeight(15).width, height: getWidthnHeight(15).width, borderWidth: 0, borderColor: 'red'}]}/>
                            </View>
                            <Image 
                                resizeMode="contain" 
                                source={require('../../Image/Cloud5.png')} 
                                style={{borderColor: 'red', borderWidth: 0, width: getWidthnHeight(30).width, height: getWidthnHeight(20).width}}/>
                            <Image 
                                resizeMode="contain" 
                                source={require('../../Image/Cloud2.png')} 
                                style={[{borderColor: 'red', borderWidth: 0, alignSelf: 'flex-end', width: getWidthnHeight(25).width, height: getWidthnHeight(20).width}, getMarginTop(-5)]}/>
                            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                                <Image 
                                    resizeMode="contain" 
                                    source={require('../../Image/Cloud2.png')} 
                                    style={[{
                                        transform: [{translateX: getMarginLeft(-5).marginLeft}, {scaleX: -1}, {scale: 0.7}], opacity: 0.4, borderColor: 'red', 
                                        borderWidth: 0, width: getWidthnHeight(30).width, height: getWidthnHeight(20).width}, getMarginTop(3)]}/>
                                <Image 
                                    resizeMode="contain" 
                                    source={require('../../Image/Cloud5.png')} 
                                    style={[{
                                        transform: [{translateX: getMarginLeft(7).marginLeft}], opacity: 0.4, borderColor: 'red', borderWidth: 0, 
                                        alignSelf: 'flex-end', width: getWidthnHeight(25).width, height: getWidthnHeight(20).width}, getMarginTop(12)]}/>
                            </View>
                            <Animated.View style={[{borderColor: 'red', borderWidth: 0, position: 'absolute'}, getWidthnHeight(15, 12), boxAnimation1]}>
                                <Animated.View style={[{borderColor: 'red', borderWidth: 0}, getWidthnHeight(15, 12), balloonAnimation1]}>
                                    <HotAirBalloon 
                                        color1={"#008DB3"}
                                        color2={"#E6E6E6"}
                                        color3={"#008DB3"}
                                        basketColor={"#FFAB73"}
                                    />
                                </Animated.View>
                            </Animated.View>
                            <Animated.View style={[{borderColor: 'red', borderWidth: 0, position: 'absolute'}, getWidthnHeight(27, 17), boxAnimation2]}>
                                <Animated.View style={[{borderColor: 'red', borderWidth: 0}, getWidthnHeight(27, 17), balloonAnimation2]}>
                                    <HotAirBalloon 
                                        color1={"#008DB3"}
                                        color2={"#FFC55C"}
                                        color3={"#28DF99"}
                                        basketColor={"#FFAB73"}
                                    />
                                </Animated.View>
                            </Animated.View>
                            <Animated.View style={[{borderColor: 'red', borderWidth: 0, position: 'absolute'}, getWidthnHeight(27, 18), boxAnimation3]}>
                                <Animated.View style={[{borderColor: 'red', borderWidth: 0}, getWidthnHeight(33, 18), balloonAnimation3]}>
                                    <HotAirBalloon 
                                        color3={"#54436B"}
                                        color2={"#EAD3CB"}
                                        color1={"#845460"}
                                        basketColor={"#FFAB73"}
                                    />
                                </Animated.View>
                            </Animated.View>
                            <Animated.View style={[{borderColor: 'red', borderWidth: 0, position: 'absolute'}, getWidthnHeight(23, 15), boxAnimation4]}>
                                <Animated.View style={[{borderColor: 'red', borderWidth: 0}, getWidthnHeight(23, 15), balloonAnimation4]}>
                                    <HotAirBalloon 
                                        color1={"#E9007F"}
                                        color2={"#FFC55C"}
                                        color3={"#A275E3"}
                                        basketColor={"#FF8A5C"}
                                    />
                                </Animated.View>
                            </Animated.View>
                        </View>
                        <View pointerEvents={'none'} style={[{backgroundColor: 'rgba(255,255,255,0)'}, StyleSheet.absoluteFill]}>
                            {(fireCrackerColor1 !== '') && 
                                <View style={[{position: 'absolute'}]}>
                                    <Animated.View style={[{alignItems: 'center', borderColor: 'red', borderWidth: 0, transform: [{rotate: '40deg'}]}]}>
                                        <Animated.View style={[{borderColor: 'red', borderWidth: 0}]}>
                                            <View style={[{alignItems: 'center'}, getMarginTop(5)]}>
                                                <Explosion 
                                                    fireCrackerColor={fireCrackerColor1}
                                                    innerCircle={innerCircleAnimation}
                                                    inner1={inner1stRingAnimation}
                                                    inner2={inner2ndRingAnimation}
                                                    outer={outerCircleAnimation}
                                                    rocketAnimation={rocketAnimation1}
                                                />
                                                <RocketTrail 
                                                    start={{x: 0.5, y: 0.1}} end={{x: 0.5, y: 0.9}}
                                                    colors={[fireCrackerColor1, "transparent"]} 
                                                    style={[{marginTop: getMarginTop(-4).marginTop}, getWidthnHeight(0.5), rocketAnimation1]}/>
                                            </View>
                                        </Animated.View>
                                    </Animated.View>
                                </View>
                            }
                            {(fireCrackerColor2 !== '') && 
                                <View style={[{position: 'absolute'}]}>
                                    <Animated.View style={[{alignItems: 'center', borderColor: 'red', borderWidth: 0, transform: [{rotate: '-40deg'}]}]}>
                                        <Animated.View style={[{borderColor: 'red', borderWidth: 0}]}>
                                            <View style={[{alignItems: 'center'}, getMarginTop(5)]}>
                                                <Explosion 
                                                    fireCrackerColor={fireCrackerColor2}
                                                    innerCircle={innerCircleAnimation2}
                                                    inner1={inner1stRingAnimation2}
                                                    inner2={inner2ndRingAnimation2}
                                                    outer={outerCircleAnimation2}
                                                    rocketAnimation={rocketAnimation2}
                                                />
                                                <RocketTrail 
                                                    start={{x: 0.5, y: 0.1}} end={{x: 0.5, y: 0.9}}
                                                    colors={[fireCrackerColor2, "transparent"]} 
                                                    style={[{marginTop: getMarginTop(-4).marginTop}, getWidthnHeight(0.5), rocketAnimation2]}/>
                                            </View>
                                        </Animated.View>
                                    </Animated.View>
                                </View>
                            }
                            {(fireCrackerColor3 !== '') && 
                                <View style={[{position: 'absolute'}]}>
                                    <Animated.View style={[{alignItems: 'center', borderColor: 'red', borderWidth: 0}]}>
                                        <Animated.View style={[{borderColor: 'red', borderWidth: 0}]}>
                                            <View style={[{alignItems: 'center'}, getMarginTop(17)]}>
                                                <Explosion 
                                                    fireCrackerColor={fireCrackerColor3}
                                                    innerCircle={innerCircleAnimation}
                                                    inner1={inner1stRingAnimation}
                                                    inner2={inner2ndRingAnimation}
                                                    outer={outerCircleAnimation}
                                                    rocketAnimation={rocketAnimation3}
                                                />
                                                <RocketTrail 
                                                    start={{x: 0.5, y: 0.1}} end={{x: 0.5, y: 0.9}}
                                                    colors={[fireCrackerColor3, "transparent"]} 
                                                    style={[{marginTop: getMarginTop(-4).marginTop}, getWidthnHeight(0.5), rocketAnimation3]}/>
                                            </View>
                                        </Animated.View>
                                    </Animated.View>
                                </View>
                            }
                            {(fireCrackerColor4 !== '') && 
                                <View style={[{position: 'absolute'}]}>
                                    <Animated.View style={[{alignItems: 'center', borderColor: 'red', borderWidth: 0}]}>
                                        <Animated.View style={[{borderColor: 'red', borderWidth: 0}]}>
                                            <View style={[{alignItems: 'center'}, getMarginTop(18)]}>
                                                <Explosion 
                                                    fireCrackerColor={fireCrackerColor4}
                                                    innerCircle={innerCircleAnimation2}
                                                    inner1={inner1stRingAnimation2}
                                                    inner2={inner2ndRingAnimation2}
                                                    outer={outerCircleAnimation2}
                                                    rocketAnimation={rocketAnimation4}
                                                />
                                                <RocketTrail 
                                                    start={{x: 0.5, y: 0.1}} end={{x: 0.5, y: 0.9}}
                                                    colors={[fireCrackerColor4, "transparent"]} 
                                                    style={[{marginTop: getMarginTop(-4).marginTop}, getWidthnHeight(0.5), rocketAnimation4]}/>
                                            </View>
                                        </Animated.View>
                                    </Animated.View>
                                </View>
                            }
                        </View>
                        <View pointerEvents={'none'} style={[{backgroundColor: 'rgba(255,255,255,0)', alignItems: 'center', justifyContent: 'center'}, StyleSheet.absoluteFill]}>
                            <Animated.View style={[userImageAnimatedStyle]}>
                                <View style={[{alignItems: 'center'}]}>
                                    {(imageUploaded) && (
                                        <Image 
                                            source={userImage} 
                                            style={{
                                                borderWidth: 2, borderColor: 'white', position: 'absolute', width: getWidthnHeight(25).width, 
                                                height: getWidthnHeight(25).width, borderRadius: getWidthnHeight(20).width
                                        }}/>
                                    )}
                                    {(!imageUploaded && gender.toLowerCase() === 'male') && (
                                        <Image 
                                            style={{
                                                resizeMode: "contain", borderColor: 'white', borderRadius: 0, 
                                                width: getWidthnHeight(25).width, height: getWidthnHeight(25).width, position: 'absolute'}} 
                                            source={require('../../Image/groom.png')}
                                        />
                                    )}
                                    {(!imageUploaded && gender.toLowerCase() === 'female') && (
                                        <Image 
                                            style={{
                                                resizeMode: "contain", borderColor: 'white', borderRadius: 0, 
                                                width: getWidthnHeight(25).width, height: getWidthnHeight(25).width, position: 'absolute'}} 
                                            source={require('../../Image/bride.png')}
                                        />
                                    )}
                                </View>
                                <View style={[{alignItems: 'center'}, getMarginTop(12)]}>
                                    <Image resizeMode="contain" source={require('../../Image/HappyBirthday1.png')} style={[{width: getWidthnHeight(40).width, height: getWidthnHeight(20).width, borderWidth: 0, borderColor: 'red'}]}/>                            
                                    <Text style={[{fontWeight: 'bold'}, fontSizeH4(), styles.boldFont]}>{userName}</Text>
                                </View>
                            </Animated.View>
                        </View>
                    </GradientBackground>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    boldFont: {
        ...Platform.select(
            {
                android: {
                    fontFamily: ''
                }
            }
        )
    }
})

export {SelfBirthday};