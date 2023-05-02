import React, {Component} from 'react';
import { Platform } from 'react-native';
import {Animated, View, Text, TouchableWithoutFeedback, TouchableOpacity, Image} from 'react-native';
import {getWidthnHeight, getMarginTop, fontSizeH4, getMarginHorizontal, getMarginRight, getMarginLeft} from './width';

const PADDING = getMarginHorizontal(2.5).marginHorizontal;
const ITEM_SIZE = Math.floor(getWidthnHeight(30).width) + Math.floor(getMarginHorizontal(2.5).marginHorizontal) * 2;
const BounceTouch = Animated.createAnimatedComponent(TouchableWithoutFeedback);

const leaveIcon = (<Image source={require('../../Image/leave32.png')} style={{width: getWidthnHeight(5).width, height: getWidthnHeight(5).width}}/>)
const leadIcon = (<Image source={require('../../Image/lead.png')} style={{width: getWidthnHeight(5).width, height: getWidthnHeight(5).width}}/>)
const taskIcon = (<Image source={require('../../Image/task_2.png')} style={{width: getWidthnHeight(5).width, height: getWidthnHeight(5).width}}/>)
const travelIcon = (<Image source={require('../../Image/globe.png')} style={{width: getWidthnHeight(5).width, height: getWidthnHeight(5).width}}/>)
const cakeIcon = (<Image source={require('../../Image/dessert.png')} style={{width: getWidthnHeight(5).width, height: getWidthnHeight(5).width}}/>)

const iconsArray = [
    {name: 'Leave', color: '#F38523', icon: leaveIcon, id: 0, fullName: 'Leave Notification'},
    {name: 'Lead', color: '#EA2F54', icon: leadIcon, id: 1, fullName: 'Lead Notification'},
    {name: 'Task', color: '#1FAB89', icon: taskIcon, id: 2, fullName: 'Task Notification'},
    {name: 'Travel', color: '#14D6CA', icon: travelIcon, id: 3, fullName: 'Travel Notification'},
    {name: 'Birthdays', color: '#CC9B6D', icon: cakeIcon, id: 4, fullName: 'Cakes are special, isn\'t it'}
]

const dummyData1 = [{
        "empId": 10,
        "first_name": "Rani",
        "middle_name": null,
        "last_name": "Singh",
        "birth_date": "1991-08-18",
        "profile_picture": "1575354905.jpg",
        "gender": "Female"
    }]

const dummyData2 = [
    {
        "empId": 10,
        "first_name": "Rani",
        "middle_name": null,
        "last_name": "Singh",
        "birth_date": "1991-08-18",
        "profile_picture": "1575354905.jpg",
        "gender": "Female"
    },
    {
        "empId": 11,
        "first_name": "Rani",
        "middle_name": null,
        "last_name": "Singh",
        "birth_date": "1991-08-18",
        "profile_picture": "1575354905.jpg",
        "gender": "Female"
    }
]

const dummyData3 = [
    {
        "empId": 10,
        "first_name": "Rani",
        "middle_name": null,
        "last_name": "Singh",
        "birth_date": "1991-08-18",
        "profile_picture": "1575354905.jpg",
        "gender": "Female"
    },
    {
        "empId": 11,
        "first_name": "Rani",
        "middle_name": null,
        "last_name": "Singh",
        "birth_date": "1991-08-18",
        "profile_picture": "1575354905.jpg",
        "gender": "Female"
    },
    {
        "empId": 12,
        "first_name": "Rani",
        "middle_name": null,
        "last_name": "Singh",
        "birth_date": "1991-08-18",
        "profile_picture": "1575354905.jpg",
        "gender": "Female"
    }
]

class AnimatedFlatList extends Component {
    constructor(props){
        super(props)
        this.state = {
            storeIndex: null,
            animateValue: new Animated.Value(1),
            scrollX: new Animated.Value(0),
            notifications: []
        }
    }

    componentDidMount(){
        const {appContent, data} = this.props;
        const attendancePunch = JSON.parse(data);
        let embedNotifications = [];
        //console.log("#@# SCREEN: ", data)
        embedNotifications = appContent.map((item, index) => {
            const screenName = item.name.toLowerCase();
            let screenData = attendancePunch[screenName];
            // console.log("$$$SCREEN: ", screenData)
            return {...item, notifications: screenData}
        })
        embedNotifications.sort((a, b) => {
            //console.log("CHECK LENGTH: ", a.notifications.length, b.notifications.length)
            if(a.notifications.length > b.notifications.length){
                return -1;
            }else if(b.notifications.length > a.notifications.length){
                return 1;
            }else{
                return 0;
            }
        })
        this.setState({notifications: embedNotifications})
        //console.log("^^^$$$NEW APPCONTENT: ", embedNotifications[1])
    }

    animateIndividual(index){
        const {animateValue, storeIndex} = this.state;
        const {data} = this.props;
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
        ]).start(() => this.setState({storeIndex: null}, () => {
            const {notifications} = this.state;
            const name = notifications[index]['name'].toLowerCase();
            const getIconIndex = iconsArray.findIndex((item) => {
                return item.name.toLocaleLowerCase() === name
            })
            if(name === 'birthdays'){
                console.log("@@@##### OPEN BIRTHDAY LIST: ", dummyData1)
                const image = JSON.parse(data);
                this.props.navigation.navigate('Birthdays', {
                    screen: {...notifications[index], icon: iconsArray[getIconIndex]['icon']}, 
                    notifications: JSON.stringify(notifications[index]['notifications']), 
                    profilePicturePath: image.profile_picture_path    
                })
            }else {
                this.props.navigation.navigate('DashboardNotifications', {
                    screen: {...notifications[index], 
                    icon: iconsArray[getIconIndex]['icon']}, 
                    notifications: JSON.stringify(notifications[index]['notifications'])
                })
            }
        }))
    }

    render(){
    const {appContent, animateScale} = this.props;
    const {scrollX, notifications} = this.state;
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
            keyExtractor={(data) => ""+data.id}
            data={notifications}
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
                const totalCount = item.notifications.length;
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
                                {(totalCount > 0) &&
                                    <View style={[{
                                        position: 'absolute', alignSelf: 'flex-end', top: getMarginTop(-1).marginTop, right: getMarginRight(-1).marginRight
                                    }]}>
                                        <View style={{
                                            backgroundColor: '#F12D2D', width: getWidthnHeight(5).width, 
                                            height: getWidthnHeight(5).width, borderRadius: getWidthnHeight(5).width, 
                                            alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <Text style={[{
                                                textAlign: 'center', textAlignVertical: 'center', color: 'white', fontWeight: '800',
                                                fontSize: (totalCount > 99)? (fontSizeH4().fontSize - 5) : (fontSizeH4().fontSize - 1)
                                                }, styles.boldFont
                                            ]}>
                                                    {totalCount}
                                            </Text>
                                        </View>
                                    </View>
                                }
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
                                {(totalCount > 0) &&
                                    <View style={[{
                                        position: 'absolute', alignSelf: 'flex-end', top: getMarginTop(-1).marginTop, right: getMarginRight(-1).marginRight
                                    }]}>
                                        <View style={{
                                            backgroundColor: '#F12D2D', width: getWidthnHeight(5).width, 
                                            height: getWidthnHeight(5).width, borderRadius: getWidthnHeight(5).width, 
                                            alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <Text style={[{
                                                textAlign: 'center', textAlignVertical: 'center', color: 'white', fontWeight: '800',
                                                fontSize: (totalCount > 99)? (fontSizeH4().fontSize - 5) : (fontSizeH4().fontSize - 1)
                                                }, styles.boldFont
                                            ]}>
                                                {totalCount}
                                            </Text>
                                        </View>
                                    </View>
                                }
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

export {AnimatedFlatList};