import React, {Component} from 'react';
import { 
    View, Text , Platform, StyleSheet, LayoutAnimation, Animated, 
    Image, FlatList, TouchableOpacity, Alert, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaskedView from '@react-native-masked-view/masked-view';
import moment from 'moment';
import Delete from 'react-native-vector-icons/AntDesign';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import {extractBaseURL} from '../api/BaseURL';
import {
    getMarginTop, getWidthnHeight, getMarginRight, getMarginLeft, WaveHeader, IOS_StatusBar, MaskedGradientText, Spinner,
    statusBarGradient, fontSizeH4, getMarginHorizontal, getMarginVertical, getMarginBottom, fontSizeH2} from '../NewComponents/common';
// const timeStamp = moment().valueOf();
// const timeStamp2 = moment(timeStamp).subtract(5, 'minutes');
// const timeStamp3 = moment(timeStamp).subtract(7, 'minutes');
const SWIPE_THRESHOLD = 120;
var CustomAnimation = {
    // duration: 800,
    // delete: {
    // type: LayoutAnimation.Types.spring,
    // property: LayoutAnimation.Properties.scaleXY,
    // springDamping: 1.5
    // }
}

class Notifications extends Component {
    constructor(props){
        super(props)
        this.state  = {
            opacity: new Animated.Value(1),
            notifications: [
                // {
                //     id: 111,
                //     title: 'Kulbir has applied for Leave',
                //     time: timeStamp,
                // },
                // {
                //     id: 222,
                //     title: 'Kulbir has applied for Leave',
                //     time: timeStamp2,
                // },
                // {
                //     id: 333,
                //     title: 'Kulbir has applied for Leave',
                //     time: timeStamp3,
                // },
                // {
                //     id: 444,
                //     title: 'Kulbir has applied for Leave',
                //     time: timeStamp,
                // },
                // {
                //     id: 555,
                //     title: 'Kulbir has applied for Leave',
                //     time: timeStamp2,
                // },
                // {
                //     id: 666,
                //     title: 'Kulbir has applied for Leave',
                //     time: timeStamp3,
                // },
                // {
                //     id: 777,
                //     title: 'Kulbir has applied for Leave',
                //     time: timeStamp,
                // },
                // {
                //     id: 888,
                //     title: 'Kulbir has applied for Leave',
                //     time: timeStamp2,
                // },
                // {
                //     id: 999,
                //     title: 'Kulbir has applied for Leave',
                //     time: timeStamp3,
                // }
            ],
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
            notificationSwipe: false
        }
    }

    UNSAFE_componentWillUpdate(){
        LayoutAnimation.configureNext(CustomAnimation)
    }

    componentDidMount(){
        const {notifications} = this.props.route.params;
        //console.log("TIMESTAMP: ", this.state.notifications[0]['time'])
        this.setState({notifications: JSON.parse(notifications)}, () => {
            console.log("!!! @@@ ### $$$", this.state.notifications.length)
            this.initialize();
        })
    }

    async initialize(){
        await extractBaseURL().then((baseURL) => {
            this.setState({baseURL}, () => {
                const {notifications} = this.state;
                if(notifications.length > 0){
                    const notificationID = notifications[0]['id'];
                    this.clearNotification(notificationID, false);
                }
            })
        })
    }

    //Shows the Loading Spinner
    showLoader = () => {
        this.setState({ loading: true });
    }

    //Hides the Loading Spinner
    hideLoader = () => {
        this.setState({ loading: false });
    }

    async clearNotification(notificationID, callLoader = true){
        const {baseURL} = this.state;
        if(callLoader) {
            this.showLoader();
            this.setState({selectedID: notificationID});
        }
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_four=permissions_fir.success.secret_token;
        axios.post(`${baseURL}/remove-notification`,
        {
            notification_id: notificationID
        },
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+ permissions_four, 
            }
        }).then((response) => {
            if(callLoader) this.hideLoader();
            const parsedData = response.data;
            //console.log('success')
            const {closePressed} = this.state;
            if(callLoader){
                if(closePressed){
                    this.crumplePaper()
                }else{
                    this.closeSelection(notificationID);
                }
            }
        }).catch((error) => {
            if(callLoader) this.hideLoader();
            console.log("ERROR: ", error)
            this.setState({closePressed: false, selectedID: null})
            if(error.response){
                const status = error.response.status;
                Alert.alert("Error!", `Error Code: ${status}146`)
            }else{
                alert(`${error}, API CODE: 146`)
            }
        })
    }

    closeSelection(notificationID){
        const {animateAfterSwipe} = this.state;
        Animated.timing(animateAfterSwipe, {
            toValue: 0,
            duration: 500
        }).start(() => this.deleteItem(notificationID));
    }

    deleteItem = (id) => {
        const {notifications, closePressed} = this.state;
        console.log("DELETE")
        const temp = notifications.filter((item) => item.id !== id);
        this.setState({notifications: temp})
        if(closePressed){
            this.setState({closePressed: false, selectedID: null}, () => {
                const {discardPaper, animatePaper, hideDustBin, deletePanel} = this.state;
                animatePaper.setValue(1);
                discardPaper.setValue(1);
                hideDustBin.setValue(1);
                deletePanel.setValue(1);
            })
        }else{
            this.setState({selectedID: null, notificationSwipe: false}, () => {
                const {animateAfterSwipe} = this.state;
                animateAfterSwipe.setValue(1);
            })
        }
    }

    renderLeft(progress, dragX){
        const scale = dragX.interpolate({
          inputRange: [0, 100],
          outputRange: [0, 0.5],
        })
        const textStyle = {
            transform: [
                {
                    scale
                }
            ]
        }
        return (
            <Animated.View style={[{flex: 1, backgroundColor: 'rgba(243, 37, 16, 0.5)', alignItems: "center", justifyContent: 'center'}]}>
                <View style={{position: 'absolute', alignSelf: 'flex-start'}}>
                    <View style={[getMarginLeft(2)]}>
                        <Text style={[fontSizeH4(), {color: '#FFFFFF'}]}>{"Swipe >>"}</Text>
                    </View>
                </View>
                <Animated.Text style={[{color: '#fff', fontWeight: "600", fontSize: (fontSizeH4().fontSize + 2)}, textStyle, styles.boldFont]}>Delete</Animated.Text>
            </Animated.View>
        )
    }

    crumplePaper(){
        const {animatePaper, deletePanel, selectedID} = this.state;
        const {discardPaper, animateDustBin} = this.state;
        Animated.stagger(500, [
            Animated.timing(animatePaper, {
                toValue: 0,
                duration: 700
            }),
            Animated.stagger(200, [
                Animated.spring(deletePanel, {
                    toValue: 0,
                    duration: 200
                }),
                Animated.parallel([
                    Animated.timing(discardPaper, {
                        toValue: 0,
                        duration: 400
                    }),
                    Animated.timing(animateDustBin, {
                        toValue: 0,
                        duration: 400
                    })
                ])
            ])
        ]).start(() => {
            const {animateDustBin, hideDustBin} = this.state;
            Animated.sequence([
                Animated.timing(animateDustBin, {
                    toValue: 1,
                    duration: 400
                }),
                Animated.timing(hideDustBin, {
                    toValue: 0,
                    duration: 400
                }),
            ]).start(() => this.deleteItem(selectedID))
        })
    }

    renderItem({item, index}){
        const {
            animatePaper, selectedID, discardPaper, animateDustBin, hideDustBin, deletePanel, 
            baseURL, backgroundColor, animateAfterSwipe, notificationSwipe
        } = this.state;
        const animateStyle = {
            transform: [{
                scale: animatePaper.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1]
                })
            }],
            opacity: animatePaper
        }
        const animateBin = {
            transform: [{
                scale: deletePanel.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0]
                })
            }],
            opacity: deletePanel.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0]
            })
        }
        const throwPaperStyle = {
            transform: [
                {
                    scale: discardPaper.interpolate({
                        inputRange: [0, 0.7, 1],
                        outputRange: [0, 1, 1]
                    })
                },
                {
                    translateY: discardPaper.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-getMarginTop(15).marginTop, 0]
                    })
                },
                // {
                //     translateX: discardPaper.interpolate({
                //         inputRange: [0, 1],
                //         outputRange: [getMarginLeft(80).marginLeft, 0]
                //     })
                // },
            ],
            marginLeft: discardPaper.interpolate({
                inputRange: [0, 1],
                outputRange: [getMarginLeft(90).marginLeft, 0]
            })
        }
        const dustBinCover = {
            transform: [
                {
                    rotate: animateDustBin.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['90deg', '0deg']
                    })
                }
            ],
            marginLeft: animateDustBin.interpolate({
                inputRange: [0, 1],
                outputRange: [getMarginLeft(5.5).marginLeft, 0]
            })
        }
        const glowDustBin = {
            backgroundColor: animateDustBin.interpolate({
                inputRange: [0, 1],
                outputRange: ['#343F56', 'rgb(255, 255, 255)']
            })
        }
        const removeDustBin = {
            transform: [
                {
                    scale: hideDustBin.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1]
                    })
                }
            ]
        }
        const reduceHeight = {
            height: hideDustBin.interpolate({
                inputRange: [0, 1],
                outputRange: [0, getWidthnHeight(undefined, 14).height]
            }),
            opacity: hideDustBin.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1]
            })
        }
        const notificationTimeStamp = moment(item.created_at, 'YYYY-MM-DD HHmmss').valueOf();
        //console.log("@@@@@@@@@", notificationTimeStamp, item.created_at)
        const createdAt = `${moment(notificationTimeStamp).fromNow()}`;
        const clearAfterSwipe = {
            transform: [
                {
                    scale: animateAfterSwipe.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1]
                    })
                }
            ],
            height: animateAfterSwipe.interpolate({
                inputRange: [0, 1],
                outputRange: [0, getWidthnHeight(undefined, 14).height]
            })
        }
        return (
            <View style={[getMarginLeft(-1)]}>
                {((selectedID === item.id) && baseURL && notificationSwipe) && 
                    <Animated.View style={[clearAfterSwipe, getWidthnHeight(95), getMarginLeft(0)]}>
                        <View style={[{flex: 1, backgroundColor: 'rgba(243, 37, 16, 0.5)', alignItems: "center", justifyContent: 'center'}]}>
                            <View style={{position: 'absolute', alignSelf: 'flex-start'}}>
                                <View style={[getMarginLeft(2)]}>
                                    <Text style={[fontSizeH4(), {color: '#FFFFFF'}]}>{"Swipe >>"}</Text>
                                </View>
                            </View>
                            <Animated.Text style={[{transform: [{scale: 2}], color: '#fff', fontWeight: "600", fontSize: (fontSizeH4().fontSize + 2)}, styles.boldFont]}>Delete</Animated.Text>
                        </View>
                    </Animated.View>
                }
                {((selectedID !== item.id) && baseURL) &&
                <Swipeable 
                    useNativeAnimations 
                    overshootLeft={false} 
                    onSwipeableLeftOpen={() => {
                        this.setState({notificationSwipe: true}, () => this.clearNotification(item.id))
                    }} 
                    renderLeftActions={this.renderLeft.bind(this)}
                >
                    <View key={item.id} style={[{backgroundColor: '#FFFFFF', borderColor: '#C4C4C4', borderBottomWidth: 0.5}, getWidthnHeight(95, 14), getMarginLeft(0)]}>
                        <View style={[{flexDirection: 'row'}, getWidthnHeight(95), getMarginVertical(2)]}>
                            <View style={[{borderColor: '#63686E', borderRightWidth: 0.6}, getWidthnHeight(85)]}>
                                <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false} style={[{borderColor: 'black', borderWidth: 0}, getWidthnHeight(85, 8)]}>
                                    <Text style={[{fontSize: (fontSizeH4().fontSize + 2)}, getMarginHorizontal(1)]}>{item.message}</Text>
                                </ScrollView>
                                <Text style={[{textAlign: 'right', fontStyle: 'italic', fontSize: (fontSizeH4().fontSize - 2)}, getMarginTop(1), getMarginRight(1)]}>{createdAt}</Text>
                            </View>
                            <TouchableOpacity 
                                onPress={() => {
                                    this.setState({closePressed: true, backgroundColor: 'rgba(243, 37, 16, 0.5)'}, () => this.clearNotification(item.id))
                                }} 
                                style={{flex: 1, borderColor: 'red', borderWidth: 0, justifyContent: 'center'}}
                            >
                                <View style={[{alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(10)]}>
                                    <Delete name ='close' size = {getWidthnHeight(4).width} color = {'black'}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Swipeable>
                }
                {((selectedID === item.id) && baseURL && !notificationSwipe) &&
                    <Animated.View style={[{alignItems: 'center', justifyContent: 'center', borderColor: '#C4C4C4', borderBottomWidth: 0.5}, getWidthnHeight(95), getMarginLeft(0), reduceHeight]}>
                        <Animated.View key={item.id} style={[animateStyle, {backgroundColor: backgroundColor, borderColor: '#C4C4C4', borderBottomWidth: 0}, getWidthnHeight(95)]}>
                            <View style={[{flexDirection: 'row'}, getWidthnHeight(95), getMarginVertical(2)]}>
                                <View style={[{borderColor: '#63686E', borderRightWidth: 0.6}, getWidthnHeight(85)]}>
                                    <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false} style={[getWidthnHeight(85, 8)]}>
                                        <Text style={[{fontSize: (fontSizeH4().fontSize + 2)}, getMarginHorizontal(1)]}>{item.message}</Text>
                                    </ScrollView>
                                    <Text style={[{textAlign: 'right', fontStyle: 'italic', fontSize: (fontSizeH4().fontSize - 2)}, getMarginTop(1), getMarginRight(1)]}>{createdAt}</Text>
                                </View>
                                <TouchableOpacity style={{flex: 1, borderColor: 'red', borderWidth: 0, justifyContent: 'center'}}>
                                    <View style={[{alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(10)]}>
                                        <Delete name ='close' size = {getWidthnHeight(4).width} color = {'black'}/>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                        <Animated.View style={[{position: 'absolute', alignSelf: 'center', borderWidth: 0, borderColor: 'black'}, animateBin]}>
                            <Animated.Image source={require('../Image/wastePaper.png')} style={[throwPaperStyle]}/>
                        </Animated.View>
                        <Animated.View style={[{position: 'absolute', alignSelf: 'flex-end', borderWidth: 0, borderColor: 'black'}, animateBin]}>
                            <Animated.View style={[removeDustBin]}>
                                <View style={[getMarginRight(3)]}>
                                    <View style={[{justifyContent: 'flex-start', transform: [{translateY: getMarginTop(-1.5).marginTop}]}]}>
                                        <Animated.View style={[{position: 'absolute'}, dustBinCover]}>
                                            <Animated.View style={[{alignItems: 'center'}, getWidthnHeight(7)]}>
                                                <View style={[{backgroundColor: 'white', borderColor: '#343F56', borderWidth: 1, borderTopLeftRadius: 3, borderTopRightRadius: 3}, getWidthnHeight(3, 1)]}/>
                                                <View style={[{backgroundColor: '#343F56', borderTopLeftRadius: 3, borderTopRightRadius: 3}, getMarginTop(-0.5), getWidthnHeight(7, 1)]}/>
                                            </Animated.View>
                                        </Animated.View>
                                    </View>
                                </View>
                                <Animated.View style={[{borderColor: 'red', borderWidth: 0}, animateBin]}>
                                    <Animated.View style={[getMarginRight(3)]}>
                                        <View>
                                            <LinearGradient 
                                                start={{x: 0, y: 1}} end={{x: 0, y: 0}}
                                                //locations={[0.35, 0.70, 1]}
                                                colors={['#E1701A', '#FB9300']}
                                                style={[{borderBottomLeftRadius: 5, borderBottomRightRadius: 5},getWidthnHeight(7, 4)]}>
                                                <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'space-evenly'}}>
                                                    <Animated.View style={[{backgroundColor: 'white'}, getWidthnHeight(0.8, 2.7), glowDustBin]}/>
                                                    <Animated.View style={[{backgroundColor: 'white'}, getWidthnHeight(0.8, 2.7), glowDustBin]}/>
                                                    <Animated.View style={[{backgroundColor: 'white'}, getWidthnHeight(0.8, 2.7), glowDustBin]}/>
                                                </View>
                                            </LinearGradient>
                                        </View>
                                    </Animated.View>
                                </Animated.View>
                            </Animated.View>
                        </Animated.View>
                    </Animated.View>
                }
            </View>
        );
    }
    render(){
        const {notifications, dragging, loading} = this.state;
        const {screen} = this.props.route.params;
        const parsedData = JSON.parse(this.props.route.params.notifications);
        return (
            <View style={{flex: 1, backgroundColor: 'white'}}>
                <IOS_StatusBar color={statusBarGradient} barStyle="light-content"/>
                <View style={{flex: 1}}>
                    <View style={{flex: 1}}>
                        <View style={[{alignItems: 'center'}, getWidthnHeight(100), getMarginTop(2)]}>
                            <View style={[{flexDirection: 'row', alignItems: 'center'}, getWidthnHeight(95)]}>
                                <View style={[getMarginLeft(0.5), {width: getWidthnHeight(14).width, height: getWidthnHeight(14).width, alignItems: 'center', justifyContent: 'center', backgroundColor: screen.color, borderRadius: (getWidthnHeight(1.5).width)}]}>
                                    <View style={[{borderRadius: getWidthnHeight(10).width, width: getWidthnHeight(10).width, height: getWidthnHeight(10).width, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center'}]}>
                                        <View>
                                            {screen.icon}
                                        </View>
                                    </View>
                                </View>
                                <View style={[getMarginLeft(2)]}>
                                    <MaskedGradientText
                                        title={screen.fullName}
                                        titleStyle={[{color: '#000000', fontSize: (fontSizeH4().fontSize + 2)}]}
                                        start={{x: 0, y: 0}}
                                        end={{x: 0.7, y: 0}}
                                        colors={["#039FFD", "#EA304F"]}
                                    />
                                    {/* <GradientText gradient={["#039FFD", "#EA304F"]} title={screen.fullName} style={[{fontSize: (fontSizeH4().fontSize + 2)}]}/> */}
                                </View>
                            </View>
                        </View>
                        <View style={[{alignItems: 'center', flex: 1, justifyContent: 'center'}, getWidthnHeight(100), getMarginTop(2)]}>
                            {(notifications.length > 0)?
                                <FlatList 
                                    nestedScrollEnabled={true}
                                    data={notifications}
                                    keyExtractor={(item) => ""+item.id}
                                    renderItem={this.renderItem.bind(this)}
                                    showsVerticalScrollIndicator={false}
                                    maxToRenderPerBatch={10}
                                />
                            :
                                null
                            }
                        </View>
                    </View>
                    <View 
                        style={[{
                        backgroundColor: (loading)? 'rgba(0, 0, 0, 0.5)' : 'transparent', alignItems: 'center', justifyContent: 'center'
                        }, StyleSheet.absoluteFill]} 
                        pointerEvents={(loading)? 'auto' : 'none'}
                    >
                        {(loading) ?
                            <Spinner loading={loading} style={[styles.loadingStyle, getWidthnHeight(45, 10), getMarginLeft(3)]} color='rgb(19,111,232)'/>
                        : null}
                    </View>
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
})

export default Notifications;