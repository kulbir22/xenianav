import React, {Component} from 'react';
import { 
    View, Text , Platform, StyleSheet, LayoutAnimation, Animated, 
    Image, FlatList, TouchableOpacity, ScrollView
} from 'react-native';
import moment from 'moment';
import GradientBackground from 'react-native-linear-gradient';
import axios from 'axios';
import {Svg, Ellipse, Defs, ClipPath, Circle, Line, G, Polyline, Rect, Polygon, Path, Stop, LinearGradient} from 'react-native-svg';
import {
    getMarginTop, getWidthnHeight, getMarginRight, getMarginLeft, WaveHeader, IOS_StatusBar, GradientText, Spinner,
    statusBarGradient, fontSizeH4, getMarginHorizontal, getMarginVertical, getMarginBottom, fontSizeH2} from '../KulbirComponents/common';
// const timeStamp = moment().valueOf();
// const timeStamp2 = moment(timeStamp).subtract(5, 'minutes');
// const timeStamp3 = moment(timeStamp).subtract(7, 'minutes');
var CustomAnimation = {
    // duration: 800,
    // delete: {
    // type: LayoutAnimation.Types.spring,
    // property: LayoutAnimation.Properties.scaleXY,
    // springDamping: 1.5
    // }
}

//WORKING LINEAR GRADIENT BALLOON

// {<Svg height="150" width="300">
//   <Defs>
//     <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
//       <Stop offset="0" stopColor="#FFD080" stopOpacity="1" />
//       <Stop offset="1" stopColor="red" stopOpacity="1" />
//     </LinearGradient>
//   </Defs>
//   <Ellipse cx="150" cy="75" rx="85" ry="55" fill="url(#grad)" />
// </Svg>}

class Birthdays extends Component {
    constructor(props){
        super(props)
        this.state  = {
            opacity: new Animated.Value(1),
            // notifications: [{
            //     "first_name": "Rani",
            //     "middle_name": null,
            //     "last_name": "Singh",
            //     "birth_date": "1991-08-18",
            //     "profile_picture": "1575354905.jpg",
            //     "gender": "Female"
            // }],
            // shuffledArray: [{
            //     "first_name": "Rani",
            //     "middle_name": null,
            //     "last_name": "Singh",
            //     "birth_date": "1991-08-18",
            //     "profile_picture": "1575354905.jpg",
            //     "gender": "Female"
            // }],
            notifications: [],
            shuffledArray: [],
            animatePaper: new Animated.Value(1),
            selectedID: null,
            showBin: false,
            discardPaper: new Animated.Value(1),
            animateDustBin: new Animated.Value(1),
            closePressed: false,
            hideDustBin: new Animated.Value(1),
            deletePanel: new Animated.Value(1),
            loading: false,
            baseURL: null,
            backgroundColor: '#FFFFFF',
            animateAfterSwipe: new Animated.Value(1),
            notificationSwipe: false,
            balloon1: '',
            balloon2: '',
            balloon3: '',
            balloonArray: function(){
                return([
                    {id: 0, balloon: (
                        <View style={{alignItems: 'center'}}>
                            <View>
                                <Svg width={getWidthnHeight(36).width} height={getWidthnHeight(36).width} style={{borderColor: 'black', borderWidth: 0, justifyContent: 'center'}}>
                                    <Circle r={getWidthnHeight(16).width} cx={getMarginLeft(18).marginLeft} cy={getMarginTop(9.3).marginTop} fill={this.balloon1}/>
                                    <Circle r={getWidthnHeight(5).width} cx={getMarginLeft(12).marginLeft} cy={getMarginTop(6).marginTop} fill="rgba(255, 255, 255, 0.3)"/>
                                </Svg>
                            </View>
                            <View style={{alignItems: 'center'}}>
                                <Image source={require('../Image/Thread.png')} resizeMode="contain" style={[{borderColor: 'red', borderWidth: 0, height: getWidthnHeight(undefined, 20).height}, getMarginTop(-0.5)]}/>
                                <View style={[styles.triangleCorner, {position: 'absolute', borderTopColor: this.balloon1, transform: [{rotate: '45deg'}]}, getMarginTop(-0.4)]} />
                            </View>
                        </View>
                    )},
                    {id: 1, balloon: (
                        <View style={[{alignItems: 'center'}]}>
                            <View>
                                <Svg width={getWidthnHeight(47).width} height={getWidthnHeight(38).width} style={{borderColor: 'black', borderWidth: 0}}>
                                    {/* {<Circle r="80" cx="85" cy="83" fill="crimson"/>} */}
                                    <Ellipse rx={getWidthnHeight(21).width} ry={getMarginTop(8.5).marginTop} cx={getMarginLeft(23).marginLeft} cy={getMarginTop(9).marginTop} fill={this.balloon2}/>
                                    <Ellipse rx={getWidthnHeight(13).width} ry={getMarginTop(2).marginTop} cx={getMarginLeft(23).marginLeft} cy={getMarginTop(4).marginTop} fill="rgba(255, 255, 255, 0.3)"/>
                                </Svg>
                            </View>
                            <View style={{alignItems: 'center'}}>
                                <Image source={require('../Image/Thread.png')} resizeMode="contain" style={[{borderColor: 'red', borderWidth: 0, height: getWidthnHeight(undefined, 20).height}, getMarginTop(-0.7)]}/>
                                <View style={[styles.triangleCorner, {position: 'absolute', borderTopColor: this.balloon2, transform: [{rotate: '45deg'}]}, getMarginTop(-1)]} />
                            </View>
                        </View>
                    )},
                    {id: 2, balloon: (
                        <View style={{alignItems: 'center'}}>
                            <View>
                                <Svg width={getWidthnHeight(35).width} height={getWidthnHeight(48).width} style={{borderColor: 'black', borderWidth: 0}}>
                                    <Ellipse rx={getWidthnHeight(16).width} ry={getMarginTop(10.5).marginTop} cx={getMarginLeft(18).marginLeft} cy={getMarginTop(11.7).marginTop} fill={this.balloon3}/>
                                    <Ellipse rx={getWidthnHeight(4).width} ry={getMarginTop(5).marginTop} cx={getMarginLeft(8).marginLeft} cy={getMarginTop(11.7).marginTop} fill="rgba(255, 255, 255, 0.3)"/>
                                </Svg>
                            </View>
                            <View style={{alignItems: 'center'}}>
                                <Image source={require('../Image/Thread.png')} resizeMode="contain" style={[{borderColor: 'red', borderWidth: 0, height: getWidthnHeight(undefined, 20).height}, getMarginTop(-1.2)]}/>
                                <View style={[styles.triangleCorner, {position: 'absolute', borderTopColor: this.balloon3, transform: [{rotate: '45deg'}]}, getMarginTop(-1.5)]} />
                            </View>
                        </View>
                    )}
                ])
            },
            shuffledBalloons: [],
            centerBalloonAnimation: new Animated.Value(0),
            outerRingAnimation: new Animated.Value(0),
            inner1Animation: new Animated.Value(0),
            inner2Animation: new Animated.Value(0),
            innerCircle: new Animated.Value(0),
            floatAnimation: new Animated.Value(0),
            hideBalloons: new Animated.Value(1),
            animateCake: new Animated.Value(0),
            flyingGiftAnimation: new Animated.Value(0),
            animateRhino: new Animated.Value(0),
            animateHippo: new Animated.Value(0),
            animateBdayRoll: new Animated.Value(0),
            animateWish: new Animated.Value(0),
            toggleBalloons: false,
            showAll: true,
            animateChair: new Animated.Value(0),
            animateDancers: new Animated.Value(0),
            outerRingAnimation2: new Animated.Value(0),
            inner1Animation2: new Animated.Value(0),
            inner2Animation2: new Animated.Value(0),
            innerCircle2: new Animated.Value(0),
            outerRingAnimation3: new Animated.Value(0),
            inner1Animation3: new Animated.Value(0),
            inner2Animation3: new Animated.Value(0),
            innerCircle3: new Animated.Value(0),
            outerRingAnimation4: new Animated.Value(0),
            inner1Animation4: new Animated.Value(0),
            inner2Animation4: new Animated.Value(0),
            innerCircle4: new Animated.Value(0),
            fireCrackerColor1: '',
            fireCrackerColor2: '',
            fireCrackerColor3: '',
            fireCrackerColor4: '',
            currentDateBirthdays: [],
            animateUser: new Animated.Value(0),
            selectedIndex: 0
        }
        //this._scrollRef = React.createRef();
    }

    UNSAFE_componentWillUpdate(){
        LayoutAnimation.configureNext(CustomAnimation)
    }



    componentDidMount(){
        const {notifications} = this.props.route.params;
        const parseNotifications = JSON.parse(notifications);
        if(parseNotifications.length > 0){
            this.checkCurrentDateBirthday(parseNotifications);
            this.showCake();
        }else{
            this.setState({showAll: false}, () => {
                const {animateChair} = this.state;
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(animateChair, {
                            toValue: 2,
                            duration: 2000
                        }),
                        Animated.timing(animateChair, {
                            toValue: 0,
                            duration: 2000
                        }),
                    ])
                ).start()
            })
        }
    }

    checkCurrentDateBirthday(notifications){
        const currentMonth = (moment().month() + 1);
        const currentDate = (moment().date() + 0);
        let getBirthdays = [];
        getBirthdays = notifications.filter((item) => {
            const dob = moment(item.birth_date);
            const month = (dob.month() + 1);
            const date = dob.date();
            console.log("BIRTH MONTH / DATE: ", dob, month, date, item.birth_date)
            return (month === currentMonth && date === currentDate)
        })
        this.setState({currentDateBirthdays: getBirthdays}, () => {
            const {currentDateBirthdays} = this.state;
            console.log("@@@^^^BIRTH MONTH: ", this.state.currentDateBirthdays, currentMonth, currentDate)
            if(currentDateBirthdays.length > 0){
                setInterval(() => {
                    this.setState({
                        selectedIndex: (this.state.selectedIndex === (currentDateBirthdays.length - 1)? 0 : (this.state.selectedIndex + 1)
                    )}, () => {
                        //console.log("### $$$ SCROLL REF: ", this.scrollRef)
                        this.scrollRef.scrollToIndex({
                            animated: true,
                            index: this.state.selectedIndex
                        })
                    })
                }, 3000)
                let filterBirthdayList = [];
                filterBirthdayList = notifications.filter((item) => {
                    return !currentDateBirthdays.includes(item)
                })
                console.log("$$$^^^&&& FILTER BIRTHDAY LIST: \n", notifications, notifications.length, "\n\n", filterBirthdayList, filterBirthdayList.length)
                this.setState({notifications: filterBirthdayList}, () => {
                    console.log("@@@AFTER FILTER: ", this.state.notifications, " \n\n", currentDateBirthdays)
                    this.generateRandomColors();
                    this.showTodaysBirthday();
                    this.flyingAwayGift();
                    this.fireCrackerColor();
                    this.showRhino();
                    this.showHippo();
                    this.showBdayRoll();
                    this.showDancers();
                    this.balloonPopAnimation();
                });
            }else{
                this.setState({notifications}, () => {
                    this.generateRandomColors();
                    console.log("WITHOUT FILTER: ", this.state.notifications.length)
                });
            }
        })
    }

    showTodaysBirthday(){
        const {animateUser} = this.state;
        Animated.loop(
            Animated.sequence([
                Animated.timing(animateUser, {
                    toValue: 1,
                    duration: 1000
                }),
                Animated.delay(2000),
                Animated.timing(animateUser, {
                    toValue: 0,
                    duration: 1000
                })
            ])
        ).start();
    }

    showDancers(){
        const {animateDancers} = this.state;
        Animated.loop(
            Animated.sequence([
                Animated.timing(animateDancers, {
                    toValue: 1,
                    duration: 500
                }),
                Animated.timing(animateDancers, {
                    toValue: 0,
                    duration: 500
                })
            ])
        ).start();
    }

    showCake(){
        const {animateCake} = this.state;
        console.log("CALLED")
        Animated.loop(
            Animated.sequence([
                Animated.timing(animateCake, {
                    toValue: 1,
                    duration: 1000
                }),
                Animated.timing(animateCake, {
                    toValue: 0,
                    duration: 1000
                }),
            ])
        ).start();
    }

    showRhino(){
        const {animateRhino} = this.state;
        Animated.loop(
            Animated.sequence([
                Animated.timing(animateRhino, {
                    toValue: 1,
                    duration: 2000
                }),
                Animated.delay(2000),
                Animated.timing(animateRhino, {
                    toValue: 2,
                    duration: 2000
                })
            ])
        ).start();
    }

    showHippo(){
        const {animateHippo} = this.state;
        Animated.loop(
            Animated.sequence([
                Animated.timing(animateHippo, {
                    toValue: 1,
                    duration: 2000
                }),
                Animated.delay(2000),
                Animated.timing(animateHippo, {
                    toValue: 2,
                    duration: 2000
                })
            ])
        ).start();
    }

    showBdayRoll(){
        const {animateBdayRoll} = this.state;
        Animated.loop(
            Animated.sequence([
                Animated.timing(animateBdayRoll, {
                    toValue: 1,
                    duration: 2000
                }),
                Animated.delay(1500),
                Animated.timing(animateBdayRoll, {
                    toValue: 2,
                    duration: 500
                }),
                Animated.timing(animateBdayRoll, {
                    toValue: 3,
                    duration: 500
                }),
                Animated.delay(1500),
                Animated.timing(animateBdayRoll, {
                    toValue: 4,
                    duration: 500
                }),
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
        this.setState({fireCrackerColor1, fireCrackerColor2, fireCrackerColor3, fireCrackerColor4})
    }

    generateRandomColors(){
        const {centerBalloonAnimation, hideBalloons} = this.state;
        hideBalloons.setValue(1);
        centerBalloonAnimation.setValue(0);
        const balloonR1 = Math.floor((Math.random() * 256))
        const balloonG1 = Math.floor((Math.random() * 256))
        const balloonB1 = Math.floor((Math.random() * 256))
        const balloonR2 = Math.floor((Math.random() * 256))
        const balloonG2 = Math.floor((Math.random() * 256))
        const balloonB2 = Math.floor((Math.random() * 256))
        const balloonR3 = Math.floor((Math.random() * 256))
        const balloonG3 = Math.floor((Math.random() * 256))
        const balloonB3 = Math.floor((Math.random() * 256))
        const balloon1 = `rgb(${balloonR1}, ${balloonG1}, ${balloonB1})`
        const balloon2 = `rgb(${balloonR2}, ${balloonG2}, ${balloonB2})`
        const balloon3 = `rgb(${balloonR3}, ${balloonG3}, ${balloonB3})`
        //console.log("@@@ RED: ", this.props.notifications)
        this.setState({balloon1, balloon2, balloon3}, () => {
            this.shuffleBalloons((shuffledBalloons) => {
                this.setState({shuffledBalloons}, () => {
                    const {shuffledArray} = this.state;
                    if(shuffledArray.length === 0){
                        this.initialBirthdayBalloons();
                    }
                })
            })
        })
    }

    initialBirthdayBalloons(){
        const {notifications} = this.state;
        if(notifications.length > 3){
            console.log("^^^ @@@ INITIAL LIST: ", this.state.notifications)
            const {centerBalloonAnimation, floatAnimation} = this.state;
            Animated.parallel([
                Animated.timing(centerBalloonAnimation, {
                    toValue: 1,
                    duration: 2000
                }),
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(floatAnimation, {
                            toValue: 1,
                            duration: 1000
                        }),
                        Animated.timing(floatAnimation, {
                            toValue: 0,
                            duration: 1000
                        }),
                    ])
                )
            ]).start();
        }else if(notifications.length > 0 && notifications.length <= 3){
            const createArray = [...notifications];
            const length = notifications.length;
            const remainingLength = 3 - notifications.length;
            for(let i = (length - 1); i < (remainingLength + 1); i++){
                createArray[i + 1] = {
                    "first_name": "--",
                    "middle_name": null,
                    "last_name": "--",
                    "birth_date": "--",
                    "profile_picture": "",
                    "gender": "Female"
                }
            }
            console.log("@@@!!!###$$$ ", createArray, createArray.length)
            this.setState({notifications: createArray}, () => {
                console.log("@@@@NOTIFICATIONS ARRAY: ", this.state.notifications.length)
                const {centerBalloonAnimation, floatAnimation} = this.state;
                Animated.parallel([
                    Animated.timing(centerBalloonAnimation, {
                        toValue: 1,
                        duration: 2000
                    }),
                    Animated.loop(
                        Animated.sequence([
                            Animated.timing(floatAnimation, {
                                toValue: 1,
                                duration: 1000
                            }),
                            Animated.timing(floatAnimation, {
                                toValue: 0,
                                duration: 1000
                            }),
                        ])
                    )
                ]).start();
            })
        }
    }

    birthDayListShuffle(){
        const {notifications} = this.state;
        if(notifications.length > 3){
            this.shuffleBirthdayList((shuffledArray) => {
                this.setState({shuffledArray}, () => {
                    console.log("^^^SHUFFLED ARRAY: ", this.state.shuffledArray.length)
                    //console.log("^^^ @@@ PROFILE PICTURE PATH: ", `${this.props.profilePicturePath}/${shuffledArray[0]['profile_picture']}`)
                    const {centerBalloonAnimation, floatAnimation} = this.state;
                    Animated.parallel([
                        Animated.timing(centerBalloonAnimation, {
                            toValue: 1,
                            duration: 2000
                        }),
                        Animated.loop(
                            Animated.sequence([
                                Animated.timing(floatAnimation, {
                                    toValue: 1,
                                    duration: 1000
                                }),
                                Animated.timing(floatAnimation, {
                                    toValue: 0,
                                    duration: 1000
                                }),
                            ])
                        )
                    ]).start();
                })
            })
        }else if(notifications.length > 0 && notifications.length <= 3){
            const createArray = [...notifications];
            const length = notifications.length;
            const remainingLength = 3 - notifications.length;
            for(let i = (length - 1); i < (remainingLength + 1); i++){
                createArray[i + 1] = {
                    "first_name": "--",
                    "middle_name": null,
                    "last_name": "--",
                    "birth_date": "--",
                    "profile_picture": "",
                    "gender": "Female"
                }
            }
            console.log("@@@!!!###$$$ ", createArray, createArray.length)
            this.setState({shuffledArray: createArray}, () => {
                console.log("@@@@SHUFFLED ARRAY: ", this.state.shuffledArray.length)
                //console.log("^^^ @@@ PROFILE PICTURE PATH: ", `${this.props.profilePicturePath}/${shuffledArray[0]['profile_picture']}`)
                const {centerBalloonAnimation, floatAnimation} = this.state;
                Animated.parallel([
                    Animated.timing(centerBalloonAnimation, {
                        toValue: 1,
                        duration: 2000
                    }),
                    Animated.loop(
                        Animated.sequence([
                            Animated.timing(floatAnimation, {
                                toValue: 1,
                                duration: 1000
                            }),
                            Animated.timing(floatAnimation, {
                                toValue: 0,
                                duration: 1000
                            }),
                        ])
                    )
                ]).start();
            })
        }
    }

    flyingAwayGift(){
        const {flyingGiftAnimation} = this.state;
        Animated.loop(
            Animated.timing(flyingGiftAnimation, {
                toValue: 2,
                duration: 8000
            })
        ).start();
    }

    balloonPopAnimation(){
        const {
            outerRingAnimation, inner1Animation, inner2Animation, innerCircle,
            outerRingAnimation2, inner1Animation2, inner2Animation2, innerCircle2,
            outerRingAnimation3, inner1Animation3, inner2Animation3, innerCircle3,
            outerRingAnimation4, inner1Animation4, inner2Animation4, innerCircle4
        } = this.state;
            Animated.loop(
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
                    ]),
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
            ).start();
    }

    shuffleBirthdayList(callBack){
        const {notifications} = this.state;
        let i, j, x;
        let shuffledArray = [];
        shuffledArray = notifications;
        for(i = (shuffledArray.length - 1); i >= 0 ; i--){
            j = Math.floor(Math.random() * (i + 1));
            x = shuffledArray[i];
            shuffledArray[i] = shuffledArray[j];
            shuffledArray[j] = x;
            if(i === 0){
                callBack(shuffledArray);
            }
        }
    }

    shuffleBalloons(callBack){
        let i, j, x;
        let shuffledBalloons = [];
        shuffledBalloons = this.state.balloonArray();
        for(i = (shuffledBalloons.length - 1); i >= 0 ; i--){
            j = Math.floor(Math.random() * (i + 1));
            x = shuffledBalloons[i];
            shuffledBalloons[i] = shuffledBalloons[j];
            shuffledBalloons[j] = x;
            if(i === 0){
                callBack(shuffledBalloons);
            }
        }
    }  

    showNextBirthdays(){
        const {hideBalloons} = this.state;
        Animated.timing(hideBalloons, {
            toValue: 0,
            duration: 1000
        }).start(({finished}) => {
            if(finished){
                this.generateRandomColors();
                this.birthDayListShuffle();
            }
        });
    }

    setSelectedIndex(event){
        const viewSize = event.nativeEvent.layoutMeasurement.width;
        const contentOffset = event.nativeEvent.contentOffset.x;
        const selectedIndex = Math.floor(contentOffset / viewSize);
        this.setState({selectedIndex});
    }

    render(){
        const {
            shuffledArray, animateCake, flyingGiftAnimation, animateHippo, animateRhino, 
            animateBdayRoll, animateChair, showAll, animateDancers, selectedIndex,
            outerRingAnimation, inner1Animation, inner2Animation, innerCircle,
            outerRingAnimation2, inner1Animation2, inner2Animation2, innerCircle2,
            outerRingAnimation3, inner1Animation3, inner2Animation3, innerCircle3,
            outerRingAnimation4, inner1Animation4, inner2Animation4, innerCircle4,
            currentDateBirthdays, animateUser
        } = this.state;
        const {screen, profilePicturePath} = this.props.route.params;
        const innerCircleAnimation = {
            transform: [
                {
                    scale: innerCircle.interpolate({
                        inputRange: [0, 2],
                        outputRange: [0, 1.5]
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
                        outputRange: [0, 1.5]
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
                        outputRange: [0, 1.5]
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
                        outputRange: [0, 1.5]
                    })
                }
            ],
            opacity: outerRingAnimation.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [0, 1, 0]
            })
        }
        const innerCircleAnimation2 = {
            transform: [
                {
                    scale: innerCircle2.interpolate({
                        inputRange: [0, 2],
                        outputRange: [0, 1]
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
                        outputRange: [0, 1]
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
                        outputRange: [0, 1]
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
                        outputRange: [0, 1]
                    })
                }
            ],
            opacity: outerRingAnimation2.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [0, 1, 0]
            })
        }
        const cakeStyle =  {
            transform: [
                {
                    scale: animateCake.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1]
                    })
                }
            ]
        }
        const flyAwayAnimation = {
            transform: [
                {
                    translateY: flyingGiftAnimation.interpolate({
                        inputRange: [0, 2],
                        outputRange: [0, getWidthnHeight(undefined, 60).height]
                    })
                },
                {
                    translateX: flyingGiftAnimation.interpolate({
                        inputRange: [0, 1, 2],
                        outputRange: [(getWidthnHeight(100).width), getWidthnHeight(0).width, (getWidthnHeight(100).width)]
                    })
                }
            ]
        }
        const rhinoAnimation = {
            transform: [
                {
                    translateX: animateRhino.interpolate({
                        inputRange: [0, 1, 2],
                        outputRange: [(-1)*(getWidthnHeight(50).width), (-1)*(getWidthnHeight(20).width), (-1)*(getWidthnHeight(50).width)]
                    })
                },
                // {
                //     translateY: animateRhino.interpolate({
                //         inputRange: [0, 1, 2],
                //         outputRange: [(-1)*(getMarginTop(8).marginTop), (getMarginTop(8).marginTop), (-1)*(getMarginTop(8).marginTop)]
                //     })
                // }
            ]
        }
        const hippoAnimation = {
            transform: [
                {
                    translateX: animateHippo.interpolate({
                        inputRange: [0, 1, 2],
                        outputRange: [0, (-1)*(getWidthnHeight(32).width), (getWidthnHeight(32).width)]
                    })
                },
                {
                    translateY: animateHippo.interpolate({
                        inputRange: [0, 1, 2],
                        outputRange: [0, (-1)*(getMarginTop(8).marginTop), (getMarginTop(8).marginTop)]
                    })
                }
            ]
        }
        const bdayRollAnimation = {
            transform: [
                {
                    translateX: animateBdayRoll.interpolate({
                        inputRange: [0, 1],
                        outputRange: [(-1)*(getMarginLeft(25).marginLeft), getMarginLeft(37).marginLeft],
                        extrapolate: "clamp"
                    })
                },
                {
                    rotate: animateBdayRoll.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                        extrapolate: "clamp"
                    })
                },
                {
                    scale: animateBdayRoll.interpolate({
                        inputRange: [0, 1, 2],
                        outputRange: [1, 1, 0],
                        extrapolate: "clamp"
                    })
                }
            ],
            opacity: animateBdayRoll.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [1, 1, 0],
            })
        }
        const wishAnimation = {
            transform: [
                {
                    translateX: animateBdayRoll.interpolate({
                        inputRange: [0, 1],
                        outputRange: [(-1)*(getMarginLeft(25).marginLeft), getMarginLeft(37).marginLeft],
                        extrapolate: "clamp"
                    })
                },
                {
                    rotate: animateBdayRoll.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                        extrapolate: "clamp"
                    })
                },
                {
                    scale: animateBdayRoll.interpolate({
                        inputRange: [0, 1, 2, 3, 4],
                        outputRange: [0, 0, 0, 1, 0]
                    })
                }
            ],
            opacity: animateBdayRoll.interpolate({
                inputRange: [0, 1, 2, 3, 4],
                outputRange: [0, 0, 0, 1, 0]
            })
        }
        const rockingChair = {
            transform: [
                {
                    rotate: animateChair.interpolate({
                        inputRange: [0, 2],
                        outputRange: ['-15deg', '5deg']
                    })
                }
            ]
        }
        const dancerScaleAnimation = {
            transform: [
                {
                    scale: animateDancers.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1]
                    })
                },
                {
                    rotate: animateDancers.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['-4deg', '2deg']
                    })
                }
            ]
        }
        const userAnimation = {
            transform: [
                {
                    scale: animateUser.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1]
                    })
                }
            ]
        }
        console.log("^^^###PROFILE PICTURE PATH: ", currentDateBirthdays, currentDateBirthdays.length)
        return (
            <View style={{flex: 1, backgroundColor: 'white'}}>
                <IOS_StatusBar color={statusBarGradient} barStyle="light-content"/>
                <View style={[{flex: 1, alignItems: 'center', justifyContent: 'center'}]}>
                    {(!showAll) &&
                        <View style={[{alignItems: 'center'}, getMarginTop(20)]}>
                            <Animated.Image resizeMode="contain" source={require('../Image/idle.png')} style={[{width: getWidthnHeight(40).width, height: getWidthnHeight(40).width}, rockingChair]}/>
                            <Text style={[{fontSize: fontSizeH4().fontSize + 3}, getMarginTop(2)]}>No Upcoming Birthdays</Text>
                        </View>
                    }
                    <View style={{flex: 1}}>
                        <GradientBackground 
                            start={{x: 0.5, y: 0.3}} end={{x: 0.5, y: 0.8}}
                            colors={["rgba(255, 211, 132, 0.7)", "rgba(101, 201, 207, 0.5)"]}
                            style={[{flex: 1}]}>
                            {(currentDateBirthdays.length > 0) && (
                                <View style={{position: 'absolute', alignSelf: 'flex-end'}}>
                                    <View style={[getMarginRight(4), getMarginTop(7)]}>
                                        <Image resizeMode="contain" source={require('../Image/birthday.png')} style={{borderColor: 'red', borderWidth: 0, width: getWidthnHeight(25).width, height: getWidthnHeight(10).width}}/>
                                    </View>
                                </View>
                            )}
                            {(showAll) && (
                                <View style={{position: 'absolute'}}>
                                    <View style={{position: "absolute"}}>
                                        <View style={{position: "absolute"}}>
                                            <Animated.Image resizeMode="contain" source={require('../Image/flyGift.png')} style={[{borderColor: 'white', borderRadius: 0, width: getWidthnHeight(20).width, height: getWidthnHeight(20).width}, flyAwayAnimation]}/>
                                        </View>
                                    </View>
                                    <View style={{position: "absolute"}}>
                                        <Animated.View style={[rhinoAnimation]}>
                                            <Animated.Image resizeMode="contain" source={require('../Image/rhino.png')} style={[{transform: [{rotate: '40deg'}, {scaleX: -1}], borderColor: 'white', borderRadius: 0, width: getWidthnHeight(50).width, height: getWidthnHeight(50).width}]}/>
                                        </Animated.View>
                                    </View>
                                    {(currentDateBirthdays.length > 0) && 
                                        <View style={{position: "absolute"}}>
                                            <View style={[getMarginTop(47), getMarginLeft(10)]}>
                                                <Animated.Image resizeMode="contain" source={require('../Image/happy-birthday.png')} style={[{borderColor: 'white', borderRadius: 0, width: getWidthnHeight(25).width, height: getWidthnHeight(25).width}]}/>
                                            </View>
                                        </View>
                                    }
                                </View>
                            )}
                            {(shuffledArray.length === 0 && this.state.notifications.length >= 3) &&
                                <Animated.FlatList 
                                    horizontal
                                    data={this.state.shuffledBalloons}
                                    keyExtractor={(item) => ""+item.id}
                                    renderItem={({item, index}) => {
                                        const {centerBalloonAnimation, floatAnimation, hideBalloons} = this.state;
                                        const notifications = this.state.notifications;
                                        const centerBalloon = centerBalloonAnimation.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [Math.floor(getWidthnHeight(undefined, 80).height) , (index === 1)? 0 : Math.floor(getWidthnHeight(undefined, 25).height)]
                                        })
                                        const floatBalloon3 = {
                                            marginLeft: floatAnimation.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [getMarginLeft(-2).marginLeft, getMarginLeft(2).marginLeft]
                                            })
                                        }
                                        const floatBalloon2 = {
                                            marginTop: floatAnimation.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [getMarginLeft(-1).marginLeft, getMarginLeft(2).marginLeft]
                                            })
                                        }
                                        const floatBalloon1 = {
                                            marginTop: floatAnimation.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [getMarginLeft(2).marginLeft, getMarginLeft(-2.5).marginLeft]
                                            })
                                        }
                                        const hideBalloonsAnimation = {
                                            transform: [
                                                {
                                                    scale: hideBalloons.interpolate({
                                                        inputRange: [0, 0.7, 1],
                                                        outputRange: [1, 1.1, 1]
                                                    })
                                                }
                                            ],
                                            opacity: hideBalloons
                                        }
                                        //console.log("@@@CENTER BALLOON: ", `${profilePicturePath}/${notifications[index]['profile_picture']}`)
                                        return(
                                            <Animated.View key={index} style={[{
                                                flexDirection: 'row', borderWidth: 0, borderColor: 'red',
                                                transform: [{
                                                    translateY: centerBalloon
                                                }]}, getWidthnHeight(33, 50)
                                            ]}>
                                                <Animated.View style={[{alignItems: 'center'}, ((index === 0) && floatBalloon1), ((index === 1) && floatBalloon2), ((index === 2) && floatBalloon3), hideBalloonsAnimation]}>
                                                    {item.balloon}
                                                    <View style={{position: 'absolute', alignSelf: 'center'}}>
                                                        <View style={{alignItems: 'center', justifyContent: 'space-between'}}>
                                                            <View style={[{
                                                                backgroundColor: 'transparent', width: getWidthnHeight(20).width, height: getWidthnHeight(20).width, 
                                                                borderRadius: getWidthnHeight(20).width, overflow: 'hidden', alignItems: 'center', justifyContent: 'center'
                                                            }, getMarginTop(4)]}>
                                                                {(notifications[index]['profile_picture']) ? 
                                                                    <Image 
                                                                        style={{borderColor: 'white', borderRadius: 4, width: getWidthnHeight(20).width, height: getWidthnHeight(20).width}} 
                                                                        source={{uri: `${profilePicturePath}/${notifications[index]['profile_picture']}`}}
                                                                    />
                                                                :
                                                                    (notifications[index]['gender'] === 'Male')?
                                                                        <Image 
                                                                            style={{resizeMode: "contain", borderColor: 'white', borderRadius: 4, width: getWidthnHeight(20).width, height: getWidthnHeight(20).width}} 
                                                                            source={require('../Image/groom.png')}
                                                                        />
                                                                    :
                                                                        <Image 
                                                                            style={{resizeMode: "contain", borderColor: 'white', borderRadius: 4, width: getWidthnHeight(20).width, height: getWidthnHeight(20).width}} 
                                                                            source={require('../Image/bride.png')}
                                                                        />
                                                                }
                                                            </View>
                                                            <View style={[{alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.7)', borderColor: 'rgba(0, 0, 0, 0.3)', borderWidth: 0.5}, getMarginTop(0)]}>
                                                                <Text style={[{textAlign: 'center'}, fontSizeH4()]}>{
                                                                    " "+`${notifications[index]['first_name'].replace(/^\w/, (c) => c.toUpperCase())} ${notifications[index]['last_name'].replace(/^\w/, (c) => c.toUpperCase())}`+" "}
                                                                </Text>
                                                                {(notifications[index]['birth_date'] === '--') ?
                                                                    <View />
                                                                :
                                                                    <Text style={[{textAlign: 'center'}, fontSizeH4()]}>{" "+moment(notifications[index]['birth_date']).format("DD MMM")+" "}</Text>
                                                                }
                                                            </View>
                                                        </View>
                                                    </View>
                                                </Animated.View>
                                            </Animated.View>
                                        )
                                    }}
                                />
                            }
                            {(shuffledArray.length > 0) &&
                                <Animated.FlatList 
                                    horizontal
                                    data={this.state.shuffledBalloons}
                                    keyExtractor={(item) => ""+item.id}
                                    renderItem={({item, index}) => {
                                        const {centerBalloonAnimation, floatAnimation, hideBalloons} = this.state;
                                        const centerBalloon = centerBalloonAnimation.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [Math.floor(getWidthnHeight(undefined, 80).height) , (index === 1)? 0 : Math.floor(getWidthnHeight(undefined, 25).height)]
                                        })
                                        const floatBalloon3 = {
                                            marginLeft: floatAnimation.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [getMarginLeft(-2).marginLeft, getMarginLeft(2).marginLeft]
                                            })
                                        }
                                        const floatBalloon2 = {
                                            marginTop: floatAnimation.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [getMarginLeft(-1).marginLeft, getMarginLeft(2).marginLeft]
                                            })
                                        }
                                        const floatBalloon1 = {
                                            marginTop: floatAnimation.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [getMarginLeft(2).marginLeft, getMarginLeft(-2.5).marginLeft]
                                            })
                                        }
                                        const hideBalloonsAnimation = {
                                            transform: [
                                                {
                                                    scale: hideBalloons.interpolate({
                                                        inputRange: [0, 0.7, 1],
                                                        outputRange: [1, 1.1, 1]
                                                    })
                                                }
                                            ],
                                            opacity: hideBalloons
                                        }
                                        console.log("@@@CENTER BALLOON: ", shuffledArray[index])
                                        return(
                                            <Animated.View key={index} style={[{
                                                flexDirection: 'row', borderWidth: 0, borderColor: 'red',
                                                transform: [{
                                                    translateY: centerBalloon
                                                }]}, getWidthnHeight(33, 50)
                                            ]}>
                                                <Animated.View style={[{alignItems: 'center'}, ((index === 0) && floatBalloon1), ((index === 1) && floatBalloon2), ((index === 2) && floatBalloon3), hideBalloonsAnimation]}>
                                                    {item.balloon}
                                                    <View style={{position: 'absolute', alignSelf: 'center'}}>
                                                        <View style={{alignItems: 'center', justifyContent: 'space-between'}}>
                                                            <View style={[{
                                                                backgroundColor: 'transparent', width: getWidthnHeight(20).width, height: getWidthnHeight(20).width, 
                                                                borderRadius: getWidthnHeight(20).width, overflow: 'hidden', alignItems: 'center', justifyContent: 'center'
                                                            }, getMarginTop(4)]}>
                                                                {(shuffledArray[index]['profile_picture']) ? 
                                                                    <Image 
                                                                        style={{borderColor: 'white', borderRadius: 4, width: getWidthnHeight(20).width, height: getWidthnHeight(20).width}} 
                                                                        source={{uri: `${profilePicturePath}/${shuffledArray[index]['profile_picture']}`}}
                                                                    />
                                                                :
                                                                    (shuffledArray[index]['gender'] === 'Male')?
                                                                        <Image 
                                                                            style={{resizeMode: "contain", borderColor: 'white', borderRadius: 4, width: getWidthnHeight(20).width, height: getWidthnHeight(20).width}} 
                                                                            source={require('../Image/groom.png')}
                                                                        />
                                                                    :
                                                                        <Image 
                                                                            style={{resizeMode: "contain", borderColor: 'white', borderRadius: 4, width: getWidthnHeight(20).width, height: getWidthnHeight(20).width}} 
                                                                            source={require('../Image/bride.png')}
                                                                        />
                                                                }
                                                            </View>
                                                            <View style={[{alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.7)', borderColor: 'rgba(0, 0, 0, 0.3)', borderWidth: 0.5}, getMarginTop(0)]}>
                                                                <Text style={[{textAlign: 'center'}, fontSizeH4()]}>{
                                                                    " "+`${shuffledArray[index]['first_name'].replace(/^\w/, (c) => c.toUpperCase())} ${shuffledArray[index]['last_name'].replace(/^\w/, (c) => c.toUpperCase())}`+" "}
                                                                </Text>
                                                                {(shuffledArray[index]['birth_date'] === '--') ?
                                                                    <View />
                                                                :
                                                                    <Text style={[{textAlign: 'center'}, fontSizeH4()]}>{" "+moment(shuffledArray[index]['birth_date']).format("DD MMM")+" "}</Text>
                                                                }
                                                            </View>
                                                        </View>
                                                    </View>
                                                </Animated.View>
                                            </Animated.View>
                                        )
                                    }}
                                />
                            }
                        </GradientBackground>
                        {(showAll) && (
                            <View style={[{justifyContent: 'flex-end', overflow: 'hidden'}, StyleSheet.absoluteFill]}>
                                <View style={{position: "absolute"}}>
                                    <View style={[]}>
                                        <Animated.Image resizeMode="contain" source={require('../Image/bdayRoll.png')} style={[bdayRollAnimation, {borderColor: 'white', borderRadius: 0, width: getWidthnHeight(25).width, height: getWidthnHeight(25).width}]}/>
                                    </View>
                                </View>
                                <View style={{position: "absolute"}}>
                                    <View style={[]}>
                                        <Animated.Image resizeMode="contain" source={require('../Image/wish.png')} style={[wishAnimation, {borderColor: 'white', borderRadius: 0, width: getWidthnHeight(25).width, height: getWidthnHeight(25).width}]}/>
                                    </View>
                                </View>
                                <View style={{position: "absolute"}}>
                                    <View style={[{transform: [{rotate: '-30deg'}]}, getMarginLeft(100)]}>
                                        <Animated.Image resizeMode="contain" source={require('../Image/hippo.png')} style={[getMarginTop(5), {borderColor: 'white', borderRadius: 0, width: getWidthnHeight(50).width, height: getWidthnHeight(50).width}, hippoAnimation]}/>
                                    </View>
                                </View>
                            </View>
                        )}
                        {(showAll) && 
                            <View 
                                style={[{backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center'}, StyleSheet.absoluteFill]} 
                                pointerEvents={'auto'}
                            >
                                <Animated.Image resizeMode="contain" source={require('../Image/cake.png')} style={[{borderColor: 'white', borderRadius: 0, width: getWidthnHeight(40).width, height: getWidthnHeight(40).width}, cakeStyle]}/>
                                <View style={{position: 'absolute'}}>
                                    <View style={[{flexDirection: 'row', justifyContent: 'space-evenly', borderColor: 'red', borderWidth: 0}, getMarginTop(30), getWidthnHeight(100)]}>
                                        <View style={[getMarginTop(-35), getMarginLeft(10),{borderColor: 'cyan', borderWidth: 0, width: getWidthnHeight(20).width, height: getWidthnHeight(20).width, alignItems: 'center', justifyContent: 'center'}]}>
                                            {/* OUTER RING */}
                                            <Animated.View style={[{ position: 'absolute', backgroundColor: 'transparent',
                                                borderColor: this.state.fireCrackerColor1, borderWidth: 5, width: getWidthnHeight(20).width, height: getWidthnHeight(20).width,
                                                borderRadius: getWidthnHeight(20).width, borderStyle: 'dotted', alignItems: 'center', justifyContent: 'center'
                                            }, outerCircleAnimation]}/>
                                            {/* INNER 1st RING */}
                                            <Animated.View style={[{ position: 'absolute', backgroundColor: 'transparent',
                                                borderColor: this.state.fireCrackerColor1, borderWidth: 5, width: getWidthnHeight(15).width, height: getWidthnHeight(15).width,
                                                borderRadius: getWidthnHeight(15).width, borderStyle: 'dotted', alignItems: 'center', justifyContent: 'center'
                                            }, inner1stRingAnimation]}/>
                                            {/* INNER 2nd RING */}
                                            <Animated.View style={[{ position: 'absolute', backgroundColor: 'transparent',
                                                borderColor: this.state.fireCrackerColor1, borderWidth: 5, width: getWidthnHeight(10).width, height: getWidthnHeight(10).width,
                                                borderRadius: getWidthnHeight(10).width, borderStyle: 'dotted', alignItems: 'center', justifyContent: 'center'
                                            }, inner2ndRingAnimation]}/>
                                            {/* INNER CIRCLE */}
                                            <Animated.View style={[{borderColor: this.state.fireCrackerColor1, borderWidth: 0,  
                                                backgroundColor: this.state.fireCrackerColor1, width: getWidthnHeight(5).width, height: getWidthnHeight(5).width,
                                                borderRadius: getWidthnHeight(5).width, alignItems: 'center', justifyContent: 'center'
                                            }, innerCircleAnimation]}/>
                                        </View>
                                        <View style={[getMarginTop(-30), getMarginLeft(40), {borderColor: 'cyan', borderWidth: 0, width: getWidthnHeight(20).width, height: getWidthnHeight(20).width, alignItems: 'center', justifyContent: 'center'}]}>
                                            {/* OUTER RING */}
                                            <Animated.View style={[{ position: 'absolute', backgroundColor: 'transparent',
                                                borderColor: this.state.fireCrackerColor2, borderWidth: 5, width: getWidthnHeight(20).width, height: getWidthnHeight(20).width,
                                                borderRadius: getWidthnHeight(20).width, borderStyle: 'dotted', alignItems: 'center', justifyContent: 'center'
                                            }, outerCircleAnimation2]}/>
                                            {/* INNER 1st RING */}
                                            <Animated.View style={[{ position: 'absolute', backgroundColor: 'transparent',
                                                borderColor: this.state.fireCrackerColor2, borderWidth: 5, width: getWidthnHeight(15).width, height: getWidthnHeight(15).width,
                                                borderRadius: getWidthnHeight(15).width, borderStyle: 'dotted', alignItems: 'center', justifyContent: 'center'
                                            }, inner1stRingAnimation2]}/>
                                            {/* INNER 2nd RING */}
                                            <Animated.View style={[{ position: 'absolute', backgroundColor: 'transparent',
                                                borderColor: this.state.fireCrackerColor2, borderWidth: 5, width: getWidthnHeight(10).width, height: getWidthnHeight(10).width,
                                                borderRadius: getWidthnHeight(10).width, borderStyle: 'dotted', alignItems: 'center', justifyContent: 'center'
                                            }, inner2ndRingAnimation2]}/>
                                            {/* INNER CIRCLE */}
                                            <Animated.View style={[{borderColor: this.state.fireCrackerColor2, borderWidth: 0,  
                                                backgroundColor: this.state.fireCrackerColor2, width: getWidthnHeight(5).width, height: getWidthnHeight(5).width,
                                                borderRadius: getWidthnHeight(5).width, alignItems: 'center', justifyContent: 'center'
                                            }, innerCircleAnimation2]}/>
                                        </View>
                                    </View>
                                    <View style={[{flexDirection: 'row', justifyContent: 'space-evenly', borderColor: 'red', borderWidth: 0}, getMarginTop(0), getWidthnHeight(100)]}>
                                        <View style={[getMarginTop(15), getMarginLeft(-10), {borderColor: 'cyan', borderWidth: 0, width: getWidthnHeight(20).width, height: getWidthnHeight(20).width, alignItems: 'center', justifyContent: 'center'}]}>
                                            {/* OUTER RING */}
                                            <Animated.View style={[{ position: 'absolute', backgroundColor: 'transparent',
                                                borderColor: this.state.fireCrackerColor3, borderWidth: 5, width: getWidthnHeight(20).width, height: getWidthnHeight(20).width,
                                                borderRadius: getWidthnHeight(20).width, borderStyle: 'dotted', alignItems: 'center', justifyContent: 'center'
                                            }, outerCircleAnimation2]}/>
                                            {/* INNER 1st RING */}
                                            <Animated.View style={[{ position: 'absolute', backgroundColor: 'transparent',
                                                borderColor: this.state.fireCrackerColor3, borderWidth: 5, width: getWidthnHeight(15).width, height: getWidthnHeight(15).width,
                                                borderRadius: getWidthnHeight(15).width, borderStyle: 'dotted', alignItems: 'center', justifyContent: 'center'
                                            }, inner1stRingAnimation2]}/>
                                            {/* INNER 2nd RING */}
                                            <Animated.View style={[{ position: 'absolute', backgroundColor: 'transparent',
                                                borderColor: this.state.fireCrackerColor3, borderWidth: 5, width: getWidthnHeight(10).width, height: getWidthnHeight(10).width,
                                                borderRadius: getWidthnHeight(10).width, borderStyle: 'dotted', alignItems: 'center', justifyContent: 'center'
                                            }, inner2ndRingAnimation2]}/>
                                            {/* INNER CIRCLE */}
                                            <Animated.View style={[{borderColor: this.state.fireCrackerColor3, borderWidth: 0,  
                                                backgroundColor: this.state.fireCrackerColor3, width: getWidthnHeight(5).width, height: getWidthnHeight(5).width,
                                                borderRadius: getWidthnHeight(5).width, alignItems: 'center', justifyContent: 'center'
                                            }, innerCircleAnimation2]}/>
                                        </View>
                                        <View style={[getMarginTop(5), getMarginLeft(0),{borderColor: 'cyan', borderWidth: 0, width: getWidthnHeight(20).width, height: getWidthnHeight(20).width, alignItems: 'center', justifyContent: 'center'}]}>
                                            {/* OUTER RING */}
                                            <Animated.View style={[{ position: 'absolute', backgroundColor: 'transparent',
                                                borderColor: this.state.fireCrackerColor4, borderWidth: 5, width: getWidthnHeight(20).width, height: getWidthnHeight(20).width,
                                                borderRadius: getWidthnHeight(20).width, borderStyle: 'dotted', alignItems: 'center', justifyContent: 'center'
                                            }, outerCircleAnimation]}/>
                                            {/* INNER 1st RING */}
                                            <Animated.View style={[{ position: 'absolute', backgroundColor: 'transparent',
                                                borderColor: this.state.fireCrackerColor4, borderWidth: 5, width: getWidthnHeight(15).width, height: getWidthnHeight(15).width,
                                                borderRadius: getWidthnHeight(15).width, borderStyle: 'dotted', alignItems: 'center', justifyContent: 'center'
                                            }, inner1stRingAnimation]}/>
                                            {/* INNER 2nd RING */}
                                            <Animated.View style={[{ position: 'absolute', backgroundColor: 'transparent',
                                                borderColor: this.state.fireCrackerColor4, borderWidth: 5, width: getWidthnHeight(10).width, height: getWidthnHeight(10).width,
                                                borderRadius: getWidthnHeight(10).width, borderStyle: 'dotted', alignItems: 'center', justifyContent: 'center'
                                            }, inner2ndRingAnimation]}/>
                                            {/* INNER CIRCLE */}
                                            <Animated.View style={[{borderColor: this.state.fireCrackerColor4, borderWidth: 0,  
                                                backgroundColor: this.state.fireCrackerColor4, width: getWidthnHeight(5).width, height: getWidthnHeight(5).width,
                                                borderRadius: getWidthnHeight(5).width, alignItems: 'center', justifyContent: 'center'
                                            }, innerCircleAnimation]}/>
                                        </View>
                                    </View>
                                </View>
                                {(currentDateBirthdays.length > 0) && (
                                    <View style={{position: "absolute"}}>
                                        <View style={[{alignItems: 'center'}, getMarginTop(5)]}>
                                            <Animated.View style={[cakeStyle, {alignItems: 'center', justifyContent: 'center', width: getWidthnHeight(20).width, height: getWidthnHeight(21).width, borderColor: 'red', borderWidth: 0}]}>
                                                {/* {<ScrollView showsHorizontalScrollIndicator={true} horizontal contentContainerStyle={{alignItems: 'center'}}>} */}
                                                    <Animated.View>
                                                        <Animated.FlatList 
                                                            ref={(scroll) => this.scrollRef = scroll}
                                                            scrollEnabled={false}
                                                            scrollEventThrottle={16}
                                                            pagingEnabled
                                                            onMomentumScrollEnd={this.setSelectedIndex.bind(this)}
                                                            horizontal
                                                            showsHorizontalScrollIndicator={false}
                                                            keyExtractor={(item) => item.profile_picture}
                                                            data={currentDateBirthdays}
                                                            renderItem={({item, index}) => {
                                                                return (
                                                                    <Animated.View style={[{overflow: "hidden", alignItems: 'center', justifyContent: 'center',width: getWidthnHeight(20).width, height: getWidthnHeight(20).width, borderRadius: getWidthnHeight(20).width}]}>
                                                                        {(item.profile_picture)?
                                                                            <Image 
                                                                                style={[{borderColor: 'white', borderRadius: 0, width: getWidthnHeight(20).width, height: getWidthnHeight(20).width}]} 
                                                                                source={{uri: `${profilePicturePath}/${item['profile_picture']}`}}
                                                                            />
                                                                        :
                                                                            (item['gender'] === 'Male')?
                                                                                <Image 
                                                                                    style={{resizeMode: "contain", borderColor: 'white', borderRadius: 0, width: getWidthnHeight(20).width, height: getWidthnHeight(20).width}} 
                                                                                    source={require('../Image/groom.png')}
                                                                                />
                                                                            :
                                                                                <Image 
                                                                                    style={{resizeMode: "contain", borderColor: 'white', borderRadius: 0, width: getWidthnHeight(20).width, height: getWidthnHeight(20).width}} 
                                                                                    source={require('../Image/bride.png')}
                                                                                />
                                                                        }
                                                                    </Animated.View>
                                                                )
                                                            }}
                                                        />
                                                    </Animated.View>
                                                {/* {</ScrollView>} */}
                                            </Animated.View>
                                            <Animated.View style={[cakeStyle, {alignItems: 'center'}]}>
                                                <View style={{alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', borderColor: 'rgba(0, 0, 0, 0.3)', borderWidth: 0}}>
                                                    <Text style={[{color: '#FFFFFF'}]}>
                                                        {" "+currentDateBirthdays[selectedIndex]['first_name'].replace(/^\w/, (c) => c.toUpperCase())+" "
                                                        +currentDateBirthdays[selectedIndex]['last_name'].replace(/^\w/, (c) => c.toUpperCase())+" "}
                                                    </Text>
                                                </View>
                                                {(currentDateBirthdays.length > 1) &&
                                                    <View style={[{flexDirection: 'row'}, getMarginTop(1)]}>
                                                        {currentDateBirthdays.map((item, index) => {
                                                            return (
                                                                <View 
                                                                    style={[{
                                                                        backgroundColor: (index === selectedIndex)? 'dimgrey' : '#F1F0EF',
                                                                        borderColor: 'rgba(0, 0, 0, 0.5)', width: getWidthnHeight(2).width,
                                                                        height: getWidthnHeight(2).width, borderRadius: getWidthnHeight(1).width, borderWidth: 0.5
                                                                    }, getMarginHorizontal(0.3)]}
                                                                />
                                                            )
                                                        })}
                                                    </View>
                                                }
                                            </Animated.View>
                                        </View>
                                    </View>
                                )}
                            </View>
                        }
                    </View>
                    {(showAll) &&
                        <TouchableOpacity style={{borderTopWidth: 0, borderTopColor: "rgba(255, 211, 132, 0.7)"}} activeOpacity={0.7} onPress={() => {
                            const notifications = JSON.parse(this.props.route.params.notifications);
                            if(notifications.length > 3){
                                this.showNextBirthdays();
                            }
                        }}>
                            <GradientBackground 
                                start={{x: 0.5, y: 0}} end={{x: 0.5, y: 0.8}}
                                //locations={[0.35, 0.75, 1]}
                                //colors={["rgba(255, 178, 107, 0.5)", "rgba(255, 211, 132, 0.7)"]}
                                colors={["rgba(101, 201, 207, 0.4)", "rgba(255, 211, 132, 0.7)"]}
                                //colors={["rgba(0, 0, 0, 0.4)", "rgba(255, 211, 132, 0.7)"]}
                                style={[{
                                    backgroundColor: 'white', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}, getWidthnHeight(100, 20)
                            ]}>
                                <View style={{position: 'absolute', alignSelf: 'flex-start'}}>
                                    <View style={[{flexDirection: 'row', justifyContent: 'space-evenly'}, getWidthnHeight(100), getMarginTop(2)]}>
                                        <Image source={require('../Image/windows.png')} style={{width: getWidthnHeight(12).width, height: getWidthnHeight(12).width}}/>
                                        <Image source={require('../Image/windows.png')} style={{width: getWidthnHeight(12).width, height: getWidthnHeight(12).width}}/>
                                    </View>
                                </View>
                                <Image resizeMode="contain" source={require('../Image/reading.png')} style={[{borderColor: 'white', borderRadius: 0, width: getWidthnHeight(30).width, height: getWidthnHeight(30).width}, getMarginLeft(2)]}/>
                                {(currentDateBirthdays.length > 0) &&
                                    <Animated.Image resizeMode="contain" source={require('../Image/dancing.png')} style={[dancerScaleAnimation, {borderColor: 'white', borderRadius: 0, width: getWidthnHeight(30).width, height: getWidthnHeight(30).width}]}/>
                                }
                                <Image resizeMode="contain" source={require('../Image/stay-home.png')} style={[{borderColor: 'white', borderRadius: 0, width: getWidthnHeight(25).width, height: getWidthnHeight(25).width}]}/>
                            </GradientBackground>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    boldFont: {
        ...Platform.select({
            android: {
                fontFamily: ''
            }
        })
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
        borderWidth: 0,
    }, 
    triangleCorner: {
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderRightWidth: getWidthnHeight(3.5).width,
        borderTopWidth: getWidthnHeight(3.5).width,
        borderRightColor: "transparent",
        borderTopColor: "#307FE4",
    },
})

export default Birthdays;