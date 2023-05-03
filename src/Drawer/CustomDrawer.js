import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, View, Text, Animated, Easing, TouchableOpacity, StyleSheet, Image, Alert, SafeAreaView } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "axios";
import Gradient from 'react-native-linear-gradient';
import { useDrawerStatus } from '@react-navigation/drawer';
import { ListItem, Avatar } from 'react-native-elements';
import moment from "moment";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcons from 'react-native-vector-icons/Ionicons';

import { fetchURL } from '../api/BaseURL';
import { showGame, reloadDrawer, selectDrawerItem, loginState, setServerLabel } from '../store/redux/reducer';
import { 
    getWidthnHeight, fontSizeH4, getMarginRight, getMarginTop, getMarginLeft, 
    getMarginVertical, fontSizeH2, fontSizeH3, GradientIcon, Spinner, getMarginBottom
} from '../KulbirComponents/common';

let COLOR1 = "#039FFD";
let COLOR2 = "#EA304F"; 

function CustomDrawer(props) {
    // const { getState } = useStore();
    const selector = useSelector((state) => state);
    // console.log("#### SELECTOR: ", selector)
    const drawerStatus = useDrawerStatus();
    const dispatch = useDispatch();
    const [ animation, setAnimation] = useState(new Animated.Value(0));
    const [ baseURL, setBaseURL ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const [ drawerData, setDrawerData ] = useState([]);
    const [ newDrawer, setNewDrawer ] = useState([]);
    // const [ routes, setRoutes ] = useState([]);
    const [mainDrawer, setMainDrawer] = useState(true);
    const [filteredItems, setFilteredItems] = useState([]);
    const [ wish, setWish ] = useState('');
    const [ date, setDate] = useState(moment().format('DD/MM/YYYY'));
    const day = moment().format("dddd");
    const { top } = useSafeAreaInsets();
    const reduxState = selector.reduxState;
    const parsedData = JSON.parse(reduxState.userObj);
    const empName = parsedData.success.user.employee.fullname;
    let refreshButtonSize = {width: getWidthnHeight(13).width };

    useEffect(() => {
        if(reduxState.drawerSelection !== ''){
            findItem(reduxState.drawerSelection);
        }
    }, [reduxState.drawerSelection, findItem]);

    const findItem = useCallback((name) => {
        // const routes = props.navigation.getState().routes;
        try{
            console.log("$$$^&^&^  DRAWER: ", JSON.stringify(newDrawer));
            const index = newDrawer.findIndex((item) => {
                return item.routes.find((subItem) => {
                    return subItem.routeName === name
                })
            });
            if(index > -1){
                let selectedCategory = newDrawer[index];
                let matched = false;
                const editRoutes = selectedCategory.routes.map((item) => {
                    if(item.routeName === name){
                        matched = true;
                        return {
                            ...item,
                            selected: true
                        }
                    }else{
                        return {
                            ...item
                        }
                    }
                })
                selectedCategory.selected = matched;
                selectedCategory.isExpanded = (selectedCategory.routes.length > 1)? true : false;
                selectedCategory.routes = editRoutes;
                // console.log("***$$$$$ SELECTED ITEM: ", index, JSON.stringify(selectedCategory));
                let updateDrawer = newDrawer.map((item, i) => {
                    if(i === index){
                        return selectedCategory
                    }else{
                        // console.log("##@@@## UPDATE ITEM: ", item.title, item.selected);
                        return {
                            ...item,
                            selected: false,
                            isExpanded: false,
                            routes: item.routes.map((subItem) => {
                                return {
                                    ...subItem,
                                    selected: false
                                }
                            })
                        }
                    }
                });
                // console.log("$$^^^@@ UPDATE ITEM: ", JSON.stringify(updateDrawer[0]));
                setNewDrawer(updateDrawer)
                dispatch(selectDrawerItem(''));
            }
        }catch(error){
            console.log("$$$^&^&^ SEARCH ERROR: ", error);
        }
    }, [newDrawer, selectDrawerItem]);

    useEffect(() => {
        if(drawerStatus === 'open'){
            // console.log("&&& ^^^ RELOAD WISH")
            reloadWish();
        }
    }, [drawerStatus, reloadWish]);

    const reloadWish = useCallback(() => {
        const hourHand = moment().format('H');
        if (hourHand >= 0 && hourHand < 12){
            setWish("Good Morning")
        }else if (hourHand >= 12 && hourHand < 16){
            setWish("Good Afternoon")
        }else {
            setWish("Good Evening")
        }
    }, [])

    const onItemParentPress = (key) => {
        const filteredMainDrawerRoutes = newDrawer.find((e) => {
            return e.key === key;
        });
        const updateRoutes = newDrawer.map((item) => {
            const subRoutes = item.routes.map((subItem) => {
                return {
                    ...subItem,
                    selected: false
                }
            })
            return {
                ...item,
                selected: (item.key === key),
                routes: subRoutes,
                isExpanded: false
            }
        })
        setNewDrawer(updateRoutes);
        const selectedRoute = filteredMainDrawerRoutes.routes[0];
        props.navigation.toggleDrawer();
        props.navigation.navigate(selectedRoute.nav, {
            screen: selectedRoute.routeName,
        });
    };

    function animateText(){
        Animated.loop(
            Animated.timing(animation, {
                toValue: 1,
                duration: 6000,
                easing: Easing.ease
            })
        ).start()
    }

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('state', (e) => {
            // do something
            // console.log("!@#!@@#*** STATE: ", reduxState)
            if(reduxState.resetDrawer){
                // console.log("$^$#@!#$^%")
                recallDrawerUpdate();
                dispatch(reloadDrawer(false));
            }
        });
      
        return unsubscribe;
    }, [reduxState.resetDrawer, recallDrawerUpdate, reloadDrawer, props.navigation]);

    useEffect(() => {
        if(baseURL){
            drawerItemsList();
        }
    }, [baseURL, drawerItemsList])

    useEffect(() => {
        async function getURL(){
            const url = await fetchURL();
            // console.log("$$@@ URL: ", url)
            setBaseURL(url);
        }
        getURL();
        animateText();
        reloadWish();
    }, [animateText, fetchURL, reloadWish]);

    useEffect(() => {
        recallDrawerUpdate();
    }, [recallDrawerUpdate, drawerData]);

    const recallDrawerUpdate = useCallback(() => {
        const routes = props.navigation.getState().routes;
        const newRoutes = drawerData.map((item) => {
            if(!!item.subcategory && item.subcategory.length > 0){
                let subCategory = [];
                item.subcategory.forEach((subItem) => {
                    routes.forEach((routeItem) => {
                        if(subItem.type === routeItem.name){
                            subCategory.push({
                                nav: 'MainDrawer', routeName: subItem.type, title: subItem.val,
                                key: routeItem.key
                            })
                        }
                    })
                })
                return { 
                    key: item.category_name,
                    title: item.category_name,
                    routes: subCategory
                }
            }
        });
        let home = routes.find((item) => item.name === 'Home');
        home = Object.assign(home, { title: home.name, routes: [{nav: 'MainDrawer', routeName: home.name, title: home.name}] })
        newRoutes.unshift(home);
        let updateRoutes = newRoutes.map((item) => {
            const subRoutes = item.routes.map((subItem) => {
                return { ...subItem, selected: (subItem.title === 'Home')? true : false}
            })
            return { 
                ...item, 
                isExpanded: false, 
                selected: (item.name === 'Home')? true : false, 
                routes: subRoutes,
                image: (item.name === 'Home')? require('../Image/home.png') : null
            }
        })
        updateRoutes = updateRoutes.map((item => (
            item.title === "Attendance Management"? {...item, image:require('../Image/atten.png')} : item
            &&
            item.title === "Leaves Management"? {...item, image:require('../Image/leave32.png')} : item
            &&
            item.title === "Task Management"? {...item, image:require('../Image/task_2.png')} : item
            &&
            item.title === "Lead Management"? {...item, image:require('../Image/lead.png')} : item
            &&
            item.title === "Holidays"? {...item, image:require('../Image/tent.png')} : item
            &&
            item.title === "Salary Slip"? {...item, image:require('../Image/salary.png')} : item
            &&
            item.title === "Travel Management"? {...item, image:require('../Image/globe.png')} : item
            &&
            item.title === "Coupon Management"? {...item, image: CouponScreen.image} : item
            &&
            item.title === "Stationary Management"? {...item, image: stationary.image} : item
            &&
            item.title === "Games"? {...item, image: games.image} : item
            &&
            item.title === "Holiday List"? {...item, image: holidayList.image} : item
            &&
            item.title === "StepCount" ? {...item, image: StepCount.image} : item
            &&
            item.title === "Test Screen" ? {...item, image: TestScreen.image} : item
        )))
        setNewDrawer(updateRoutes)
        __DEV__ && console.log("### RECALL DRAWER: ", updateRoutes)
    }, [props.navigation, drawerData]);

    const animatedStyle = {
        transform: [{
            translateX: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [getWidthnHeight(56).width, getWidthnHeight(-56).width]
            })
        }]
    };

    function showLoader(){
        setLoading(true)
    }

    function hideLoader(){
        setLoading(false)
    }

    const drawerItemsList = useCallback(() => {
        async function callSideMenu(){
            showLoader();
            const userObj = await AsyncStorage.getItem('userObj');
            const parsedData = JSON.parse(userObj);
            const token = parsedData.success.secret_token;
            console.log("@@@ &&& BASEURL: ", `${baseURL}/side-menu`);
            axios.get(`${baseURL}/side-menu`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then((response) => {
                hideLoader();
                let data = response.data.data;
                //data.push(TestScreen);
                let checkGames = [];
                checkGames = data.filter((item) => {
                    return (item.category_name === 'Games')
                })
                if(checkGames.length > 0){
                    console.log("$$$^^^ THIS IS IT: ", checkGames);
                    dispatch(showGame(true));
                }else if(checkGames.length === 0){
                    dispatch(showGame(false));
                }
                setDrawerData(data)
            }).catch((error) => {
                hideLoader();
                console.log("$$$ ### ERROR: ", error?.response);
                if(error.response?.data){
                    Alert.alert("#Error", JSON.stringify(error.response.data))
                }else if(error.response?._response){
                    Alert.alert("@Error", JSON.stringify(error.response._response))
                }else{
                    Alert.alert("Error!!", JSON.stringify(error?.response))
                }
            })   
        }

        callSideMenu();
    }, [showLoader, hideLoader, showGame])

    const pic = {uri: parsedData.success.user.employee.profile_picture};
    // console.log("###$$$ DRAWER: ", JSON.stringify(props))

    function selectSubCategory(parentKey, selectedItem){
        const updateDrawer = newDrawer.map((item) => {
            const updateRoutes = item.routes.map((subItem) => {
                return {
                    ...subItem,
                    selected: (subItem.key === selectedItem.key)
                }
            })
            return {
                ...item,
                selected: (item.key === parentKey)? true : false,
                routes: updateRoutes
            }
        });
        setNewDrawer(updateDrawer);
        props.navigation.toggleDrawer();
        props.navigation.navigate(selectedItem.nav, {
            screen: selectedItem.routeName,
        });
    }

    function renderMainDrawer() {
        return (
            <View style={[getMarginTop(1)]}>
                {newDrawer.map((parent) => {
                    // console.log("$$$^^^ MAP: ", parent.isExpanded)
                    if(!parent.isExpanded){
                        return (
                            <View key={parent.key}>
                                <TouchableOpacity
                                    key={parent.key}
                                    testID={parent.key}
                                    onPress={() => {
                                        if(parent.routes.length === 1){
                                            onItemParentPress(parent.key);
                                        }else{
                                            const updateDrawer = newDrawer.map((item) => {
                                                return {
                                                    ...item,
                                                    isExpanded: (parent.key === item.key) ? !item.isExpanded : false
                                                }
                                            })
                                            setNewDrawer(updateDrawer);
                                            console.log("##### IS EXPANDED: ", parent.key)
                                        }
                                    }}
                                    style={[{
                                        paddingHorizontal: getMarginLeft(4).marginLeft
                                    }, getMarginVertical(0.5)]}
                                >
                                    <View
                                        style={[{
                                            backgroundColor: (parent.selected)? COLOR1 : 'transparent',
                                            width: '100%', alignItems: 'center',
                                            paddingHorizontal: getMarginLeft(3).marginLeft,
                                            paddingVertical: getMarginTop(2).marginTop,
                                            borderRadius: getWidthnHeight(1).width, 
                                            flexDirection: 'row', justifyContent: 'flex-start'
                                        }]}
                                    >
                                        {(typeof parent.image === 'number')? (
                                            <Image style={{width: getWidthnHeight(5.5).width, height: getWidthnHeight(5.5).width}} resizeMode="contain" source={parent.image} />
                                        )
                                        :
                                            <>
                                                {parent.image}
                                            </>
                                        }
                                        <Text 
                                            style={[
                                                styles.title, { 
                                                    color: (!parent.selected)? '#6D6D6D' : 'white'
                                                }, getMarginLeft(3)
                                            ]}
                                        >
                                            {parent.title}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )
                    }else{
                        return (
                            <View key={parent.key} style={[getMarginVertical(0.5)]}>
                                <TouchableOpacity
                                    key={parent.key}
                                    testID={parent.key}
                                    onPress={() => {
                                        const updateDrawer = newDrawer.map((item) => {
                                            return {
                                                ...item,
                                                isExpanded: (parent.key === item.key)? !item.isExpanded : false
                                            }
                                        })
                                        setNewDrawer(updateDrawer);
                                    }}
                                    style={[{
                                        paddingHorizontal: getMarginLeft(4).marginLeft
                                    }]}
                                >
                                    <View
                                        style={[{
                                            backgroundColor: 'transparent',
                                            width: '100%', alignItems: 'center',
                                            paddingHorizontal: getMarginLeft(3).marginLeft,
                                            paddingVertical: getMarginTop(2).marginTop,
                                            borderRadius: getWidthnHeight(1).width,
                                            flexDirection: 'row', justifyContent: 'flex-start'
                                        }]}
                                    >
                                        {(typeof parent.image === 'number')? (
                                            <Image style={{width: getWidthnHeight(5.5).width, height: getWidthnHeight(5.5).width}} resizeMode="contain" source={parent.image} />
                                        )
                                        :
                                            <>
                                                {parent.image}
                                            </>
                                        }
                                        <Text 
                                            style={[
                                                styles.title, { 
                                                    color: (parent.isExpanded && parent.selected)? COLOR1 : '#6D6D6D'
                                                }, getMarginLeft(3)
                                            ]}
                                        >
                                            {parent.title}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{width: '100%'}}>
                                    {parent.routes.map((subItem) => {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    selectSubCategory(parent.key, subItem)
                                                }}
                                                style={{width: '100%', alignItems: 'flex-end'}}
                                            >
                                                <View
                                                    style={[{
                                                        backgroundColor: (subItem.selected)? COLOR1 : 'transparent',
                                                        width: '90%', alignItems: 'flex-start',
                                                        paddingHorizontal: getMarginLeft(3).marginLeft,
                                                        paddingVertical: getMarginTop(1.5).marginTop,
                                                        borderRadius: getWidthnHeight(1).width,
                                                        borderColor: 'red', borderWidth: 0,
                                                        transform: [{scale: 0.8}]
                                                    }]}
                                                >
                                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                        <View 
                                                            style={[{
                                                                backgroundColor: (subItem.selected)? 'white' : '#6D6D6D', width: getWidthnHeight(4).width,
                                                                height: getWidthnHeight(4).width, borderRadius: getWidthnHeight(2).width
                                                            }]}
                                                        />
                                                        <Text 
                                                            style={[
                                                                styles.title, { 
                                                                    color: (subItem.selected)? 'white' : '#6D6D6D',
                                                                    fontSize: fontSizeH4().fontSize + 4
                                                                }, getMarginLeft(3)
                                                            ]}
                                                        >
                                                            {subItem.title}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        )
                    }
                })}
            </View>
        );
    }

    function refresh(){
        drawerItemsList();
    }

    return (
        <View style={{flex: 1, borderColor: 'red', borderWidth: 0}}>
            <View style={[{flex: 1, borderColor: 'yellow', borderWidth: 0}, getMarginTop(-0.5)]}>
                <Gradient 
                    start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                    colors={[COLOR1, COLOR2]}
                    style={[{paddingTop: top}]}
                >
                    <ListItem containerStyle={{backgroundColor: 'transparent'}}>
                        <Avatar 
                            imageProps={{resizeMode: "cover"}} 
                            source={pic} 
                            containerStyle={{width: getWidthnHeight(20).width, height: getWidthnHeight(20).width, borderWidth: 0, borderColor: 'white'}} 
                            avatarStyle={{borderRadius: getWidthnHeight(10).width}}
                        />
                        <ListItem.Content>
                            <ListItem.Title style={[{color: 'white', fontWeight: 'bold', fontSize: fontSizeH4().fontSize + 1}, styles.boldFont]}>{wish}</ListItem.Title>
                            <ListItem.Subtitle style={{color: 'white', fontSize: fontSizeH4().fontSize}}>{empName.toUpperCase()}</ListItem.Subtitle>
                            <ListItem.Subtitle style={{color: 'white', fontSize: fontSizeH4().fontSize}}>{day}, {date}</ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>

                    <View style={[{borderColor: 'black', borderWidth: 0, marginBottom: 5,justifyContent: 'space-evenly',flexDirection: 'row', alignItems: 'center'}]}>
                        <View style={{flex: 1, borderColor: 'white', borderWidth: 0, alignItems: 'center', overflow: 'hidden'}}>
                            <Animated.Text style={[{color:'white', fontSize: fontSizeH4().fontSize - 1}, animatedStyle]}>
                                Click Refresh, to reload Drawer Menu
                            </Animated.Text>
                        </View>
                        <View style={[{backgroundColor: '#F1F1F1', borderRadius: 10}, getMarginRight(2), refreshButtonSize]}>
                            <TouchableOpacity onPress={() => refresh()}>
                                <Text style={{textAlign: 'center', marginLeft: 0, fontSize: fontSizeH4().fontSize - 3}}>Refresh</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Gradient>
            
                <View style={{flex: 1}}>
                    <View style={{flex: 1}}>
                        <ScrollView style={[getMarginVertical(1)]} showsVerticalScrollIndicator={false}>
                            {renderMainDrawer()}
                            <TouchableOpacity
                                style={{paddingHorizontal: getMarginLeft(4).marginLeft}}
                                onPress={() => {
                                    Alert.alert("Log Out", "Are you sure you want to log out ?", [
                                        {
                                            text: 'Yes',
                                            onPress: async() => {
                                                await AsyncStorage.clear();
                                                dispatch(showGame(false));
                                                dispatch(loginState(null));
                                                // dispatch(setServerLabel(null));
                                            }
                                        },
                                        {
                                            text: 'No',
                                        }
                                    ])
                                }}
                            >
                                <View 
                                    style={{
                                        flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',
                                        backgroundColor: 'transparent', width: '100%',
                                        paddingHorizontal: getMarginLeft(3).marginLeft,
                                        paddingVertical: getMarginTop(2).marginTop,
                                        borderColor: 'red', borderWidth: 0
                                    }}
                                >
                                    <Image 
                                        style={{width: getWidthnHeight(5.5).width, height: getWidthnHeight(5.5).width}} 
                                        resizeMode="contain" 
                                        source={require('../Image/log_out.png')} 
                                    />
                                    <Text 
                                        style={[
                                            styles.title, { 
                                                color: '#6D6D6D'
                                            }, getMarginLeft(3)
                                        ]}
                                    >
                                        Log Out
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                    <View 
                        style={[{
                            backgroundColor: (loading)? 'rgba(254, 208, 73, 0.3)' : 'transparent', borderTopLeftRadius:0,
                            borderTopRightRadius: 0}, StyleSheet.absoluteFill
                        ]} 
                        pointerEvents={(loading)? 'auto' : 'none'}
                    >
                        {(loading) && 
                            <Spinner loading={loading} style={[styles.loadingStyle, getWidthnHeight(40, 8)]} color='rgb(19,111,232)'/>
                        }
                    </View>
                </View>
            </View>
        </View>
    );
}

export default CustomDrawer;

const styles = StyleSheet.create({
    boldFont: {
        ...Platform.select({
            android: {
                fontFamily: ''
            }
        })
    },
    parentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: '#000000',
        paddingHorizontal: getMarginTop(2).marginTop,
        paddingVertical: getMarginTop(1).marginTop
        // paddingTop: 4,
        // paddingBottom: 4,
    },
    title: {
        // margin: 16,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
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

const CouponScreen = {
    category_name: 'Coupon Management',
    image:  <GradientIcon
                start={{x: 0.3, y: 0}}
                end={{x: 0.7, y: 0}}
                containerStyle={[{borderWidth: 0, borderColor: 'red', alignItems: 'center'}, getWidthnHeight(5.5)]}
                icon={<MaterialIcons name={'receipt'} style={{backgroundColor: 'transparent'}} size={getWidthnHeight(5.5).width}/>}
                colors={["#FF6A4D", "#FF3333"]}
            />
    ,
    subcategory: [
        {id: 1, type: 'issueNewBook', val: 'Issue New Book'},
        {id: 2, type: 'serialNumber', val: 'Serial Number'},
        {id: 3, type: 'soldCoupons', val: 'Sold Coupons'},
    ]
}

const stationary = {
    id: 2,
    category_name: 'Stationary Management',
    image: (
        <GradientIcon
            start={{x: 0.3, y: 0}}
            end={{x: 0.7, y: 0}}
            containerStyle={[{borderWidth: 0, borderColor: 'red', alignItems: 'center'}, getWidthnHeight(6)]}
            icon={<MaterialCommunityIcons name={'newspaper'} style={{backgroundColor: 'transparent'}} size={getWidthnHeight(6).width}/>}
            colors={["#184D47", "#29BB89"]}
        />
    ),
    subcategory: [
        {id: '1', type: 'consumedPaper', val: 'Consumed Paper'},
        {id: '2', type: 'addPaperConsumption', val: 'Add Paper Consumption'}
    ]
}

const StepCount = {
    category_name: 'StepCount',
    image: <FontAwesome5 name={'walking'} color="#D61C4E" style={{backgroundColor: 'transparent'}} size={getWidthnHeight(5).width}/>,
    subcategory: [{val: 'Step Count', type: 'StepCount'}],
}

const games = {
    category_name: 'Games',
    image: (
        <GradientIcon
            start={{x: 0.3, y: 0}}
            end={{x: 0.7, y: 0}}
            containerStyle={[{borderWidth: 0, borderColor: 'red', alignItems: 'center'}, getWidthnHeight(6)]}
            icon={<IonIcons name={'game-controller'} style={{backgroundColor: 'transparent'}} size={getWidthnHeight(6).width}/>}
            colors={["#084594", "#1572A1"]}
        />
    ),
    subcategory: [{ val: 'Tic-Tac-Toe', type: 'tictactoe'}],
}

const holidayList = {
    category_name: 'Holiday List',
    image: require('../Image/holiday.png'),
    subcategory: [{ id: '1', val: 'Holiday List', type: 'HolidayList'}],
}

const TestScreen = {
    isExpanded: false,
    category_name: 'Test Screen',
    image: require('../Image/test.png'),
    subcategory: [
        { permission: '', val: 'Apply Leave', type: 'applyLeaveEWF'}, 
        { permission: '', val: 'Applied Leaves', type: 'appliedLeaveEWF'}, 
        { permission: '', val: 'HTML View', type: 'HTMLView'}, 
        { permission: '', val: 'Login Test Page', type: 'LoginTestPage'}, 
        { permission: '', val: 'Swipe Test', type: 'SwipeTest'},
        { permission: '', val: 'Test TextInput', type: 'TestInputText'}
    ]
}