import React, {Component} from 'react';
import {
    View, Text, StyleSheet, Easing, Animated, TouchableOpacity, FlatList,
    Image, Alert, Platform, Linking
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ListItem, Avatar } from 'react-native-elements';
import axios from 'axios';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux'; 
import Gradient from 'react-native-linear-gradient';
import DeviceInfo from 'react-native-device-info';
import checkVersion from 'react-native-store-version';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Update from 'react-native-vector-icons/MaterialIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import {drawerMenuWidth} from '../api/BaseURL';
import {getWidthnHeight, IOS_StatusBar, fontSizeH4, getMarginRight, getMarginTop, getMarginLeft, GradientIcon, getMarginBottom} from '../NewComponents/common';

const AnimateTouch = Animated.createAnimatedComponent(TouchableOpacity);

class CustomInventory extends Component{
    constructor(props){
        super(props)
        this.state = {
            day: '',
            date: '',
            wish: '',
            time: '',
            hourHand: '',
            animation: new Animated.Value(0),
            loading: false,
            animateSubCategory: new Animated.Value(0),
            selectedID: null,
            baseURL: null,
            appVersion: DeviceInfo.getVersion(),
            playStoreAppVersion: '',
            iOSLink: '',
            featureList: []
        }
    }

    animateText(){
        const {animation} = this.state;
        Animated.loop(
            Animated.timing(animation, {
                toValue: 1,
                duration: 6000,
                easing: Easing.ease
            })
        ).start()
    }

    componentDidMount(){
        AsyncStorage.getItem('receivedBaseURL').then((url) => {
            this.setState({baseURL: url}, () => {
                //console.log("ISSUE NEW BOOK: ", this.state.baseURL)
                this.checkXeniaUpdate();
            })
        })
        const getTime = moment().format('H');
        this.animateText();
        this.setState({hourHand: getTime, day: moment().format("dddd")}, () => {
            this.wish();
            this.time();
        })
    }

    checkXeniaUpdate(){
        if(Platform.OS === "android"){
            checkVersion({
                version: DeviceInfo.getVersion(), // app local version
                androidStoreURL: 'https://play.google.com/store/apps/details?id=com.xenia',
                country: 'jp', // default value is 'jp'
            }).then((result) => {
                console.log("$$$$$ PlayStore Result: ", result);
                this.setState({playStoreAppVersion: result.remote}, () => {
                    const { appVersion, playStoreAppVersion } = this.state;
                    //console.log("$$$$$ Xenia version on Playstore: ", this.state.playStoreAppVersion);
                    if(playStoreAppVersion > appVersion){
                        this.getFeatureList();
                    }
                })
            }).catch((error) => {
                console.log("error occurred", error);
            })
            // getAppstoreAppMetadata("com.xenia") //put any apps packageId here
            // .then(metadata => {
            //     this.setState({playStoreAppVersion: metadata.version}, () => {
            //         const { appVersion, playStoreAppVersion } = this.state;
            //         //console.log("$$$$$ Xenia version on Playstore: ", this.state.playStoreAppVersion);
            //         if(playStoreAppVersion > appVersion){
            //             this.getFeatureList();
            //         }
            //     })
            // })
            // .catch(err => {
            //     console.log("error occurred", err);
            // });        
        }else{
            this.checkiOSUpdate();
        }
    }

    checkiOSUpdate(){
        const userID = 'fO81JtVcAfQ5BIALRz094zLBpW52';
        const appID = 'b2TgtDNCt4DQCtCJAPm5';
        const platform = 'ios';
        const appHostURL = `https://appho.st/api/get_current_version/?u=${userID}&a=${appID}&platform=${platform}`;
        //this.showLoader();
        axios.get(appHostURL).then((response) => {
            //this.hideLoader();
            const responseJson = (response.data);
            console.log("@@@@@ APPHOST SUCCESS", responseJson)
            this.setState({playStoreAppVersion: responseJson.version, iOSLink: responseJson.url}, () => {
                const { appVersion, playStoreAppVersion, iOSLink } = this.state;
                console.log("$$$$$ Xenia version on App Host: ", playStoreAppVersion, iOSLink);
                if(playStoreAppVersion > appVersion){
                    this.getFeatureList();
                }
            })
        }).catch((error) => {
            //this.hideLoader();
            console.log("AXIOS ERROR: ", error)
            let status = null;
            if(error.response){
                status = error.response.status;
                Alert.alert("Error!", `Error Code: ${status}145`)
            }else{
                alert(`${error}, API CODE: 145`)
            }
        });
    }

    openGooglePlayStore(){
        Linking.openURL("market://details?id=com.xenia");
    }

    async openAppHostIOS(){
        await Linking.openURL(this.state.iOSLink);
    }

    async getFeatureList(){
        const {baseURL} = this.state;
        //this.showLoader();
        console.log("BASEURL: ", `${baseURL}/app-update-details`)
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_four=permissions_fir.success.secret_token;
        axios.get(`${baseURL}/app-update-details`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+ permissions_four,
            }
        }).then((response) => {
            //this.hideLoader();
            const responseJson = (response.data);
            console.log("@@@@@ SUCCESS", responseJson)
            this.setState({
                featureList: responseJson
            }, () => {
                const { featureList } = this.state;
                let titleList = '';
                featureList.forEach((title, index) => {
                    if(featureList.length - 1 !== index){
                        titleList += `${index + 1}. ${title}\n`
                    }else{
                        titleList += `${index + 1}. ${title}`
                    }
                })
                Alert.alert("Update Available", `Xenia (${this.state.playStoreAppVersion}) is now available to download.\n\nList of updates:\n${titleList}`, [
                    {
                        text: 'UPDATE NOW',
                        onPress: () => {
                            if(Platform.OS === 'android'){
                                this.openGooglePlayStore();
                            }else{
                                this.openAppHostIOS();
                            }
                        }
                    },
                    {
                        text: 'LATER'
                    }
                ])
            })
        }).catch((error) => {
            //this.hideLoader();
            console.log("AXIOS ERROR: ", error)
            let status = null;
            if(error.response){
                status = error.response.status;
                Alert.alert("Error!", `Error Code: ${status}Customs`)
            }else{
                alert(`${error}, API CODE: Customs`)
            }
        });
    }

    showHideSubCategory(show = true){
        const {animateSubCategory} = this.state;
        if(show){
            animateSubCategory.setValue(0);
        }
        Animated.timing(animateSubCategory, {
            toValue: (show)? 1 : 0,
            duration: (show)? 400 : 200
        }).start(({finished}) => {
            if(finished){
                if(!show){
                    this.setState({selectedID: null})
                }
            }
        })
    }

    time(){
        var date = moment().date(); //Current Date
        var month = moment().month() + 1; //Current Month
        var year = moment().year(); //Current Year
        this.setState({
            date: `${date}/${month}/${year}`,
        });
    }

    wish(){
        const {hourHand} = this.state;
        if (hourHand >= 0 && hourHand < 12){
            this.setState({wish: "Good Morning"})
        }else if (hourHand >= 12 && hourHand < 16){
            this.setState({wish: "Good Afternoon"})
        }else {
            this.setState({wish: "Good Evening"})
        }
    }

    showHideSubCategory(show = true){
        const {animateSubCategory} = this.state;
        if(show){
            animateSubCategory.setValue(0);
        }
        Animated.timing(animateSubCategory, {
            toValue: (show)? 1 : 0,
            duration: (show)? 400 : 200
        }).start(({finished}) => {
            if(finished){
                if(!show){
                    this.setState({selectedID: null})
                }
            }
        })
    }

    render(){
        const {animation, animateSubCategory, date, day, wish, hourHand, selectedID} = this.state;
        const unParsedProps = this.props.drawerProps
        const drawerProps = JSON.parse(unParsedProps)
        let COLOR1 = "#039FFD";
        let COLOR2 = "#EA304F"; 
        let refreshButtonSize = {width: drawerMenuWidth.width / 5};
        const animatedStyle = {
            transform: [{
                translateX: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [getWidthnHeight(56).width, getWidthnHeight(-56).width]
                })
            }]
        }
        const userName = drawerProps.success.customs.name;
        //console.log("### USER NAME: ", userName);
        const categories = [];
        categories.push(CouponScreen);
        categories.push(stationary);
        let textColor = {color: 'rgb(19,111,232)'};
        return (
            <View style={{flex: 1}}>
                <View>
                    <IOS_StatusBar color={[COLOR1, COLOR2]} barStyle="light-content"/>
                    <Gradient 
                        start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                        colors={[COLOR1, COLOR2]}
                        style={[drawerMenuWidth]}>
                        <ListItem containerStyle={{backgroundColor: 'transparent'}}>
                            <Avatar 
                                imageProps={{resizeMode: "cover"}} 
                                rounded
                                icon={{name: 'user', type: 'font-awesome', size: getWidthnHeight(13).width, color: '#C4C4C4'}}
                                iconStyle={{
                                    alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', width: getWidthnHeight(20).width, 
                                    height: getWidthnHeight(20).width, borderRadius: getWidthnHeight(10).width
                                }}
                                containerStyle={{width: getWidthnHeight(20).width, height: getWidthnHeight(20).width}} 
                                avatarStyle={{borderRadius: getWidthnHeight(10).width}}
                            />
                            <ListItem.Content>
                                <ListItem.Title style={[{color: 'white', fontWeight: 'bold', fontSize: fontSizeH4().fontSize + 1}, styles.boldFont]}>{wish}</ListItem.Title>
                                <ListItem.Subtitle style={{color: 'white', fontSize: fontSizeH4().fontSize}}>{userName.toUpperCase()}</ListItem.Subtitle>
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
                                <TouchableOpacity onPress={()=> {}}>
                                    <Text style={{textAlign: 'center', marginLeft: 0, fontSize: fontSizeH4().fontSize - 1}}>Refresh</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Gradient>
                </View>
                <View style={{flex: 1, borderColor: 'red', borderWidth: 0}}>
                    <View>
                        <FlatList 
                            data={categories}
                            keyExtractor={(item) => `${item.id}`}
                            renderItem={({item, index}) => {
                                const {animateSubCategory} = this.state;
                                const animatedStyle = {
                                    transform: [
                                        {
                                            translateX: animateSubCategory.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [getMarginLeft(-50).marginLeft, 0]
                                            })
                                        }
                                    ]
                                }
                                return (
                                    <View>
                                        {(item.id !== selectedID)?
                                            <View style={{justifyContent: 'center', borderBottomColor: '#C4C4C4', borderBottomWidth: 0.5}}>
                                                <TouchableOpacity
                                                    activeOpacity={0.7}
                                                    style={[{justifyContent: 'center', flex: 1, borderWidth: 0, borderColor: 'red', paddingVertical: getMarginTop(2.2).marginTop}, drawerMenuWidth]}
                                                    onPress={() => {this.setState({selectedID: item.id}, () => this.showHideSubCategory(true))}}>
                                                    <View style={[{flexDirection: 'row', alignItems: 'center'}, getMarginLeft(5)]}>
                                                        {item.image}
                                                        <Text style={[{fontWeight: 'bold', fontSize: (fontSizeH4().fontSize + 1)}, styles.boldFont, textColor, getMarginLeft(5)]}>{item.category_name}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        :
                                            <View style={{justifyContent: 'center', borderBottomColor: '#C4C4C4', borderBottomWidth: 0.5}}>
                                                <TouchableOpacity
                                                    activeOpacity={0.7}
                                                    style={[{justifyContent: 'center', flex: 1, borderWidth: 0, borderColor: 'red', paddingVertical: getMarginTop(2.2).marginTop}, getWidthnHeight(80)]}
                                                    onPress={() => this.showHideSubCategory(false)}>
                                                    <View style={[{flexDirection: 'row', alignItems: 'center'}, getMarginLeft(5)]}>
                                                        {item.image}
                                                        <Text style={[{fontWeight: 'bold', fontSize: (fontSizeH4().fontSize + 1)}, styles.boldFont, textColor, getMarginLeft(5)]}>{item.category_name}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                <View style={{overflow: 'hidden'}}>
                                                    <View style={[]}>
                                                        {item.subcategory.map((screen) => {
                                                            return (
                                                                <View style={{flexDirection: 'row'}}>
                                                                    <View style={[getWidthnHeight(15)]}/>
                                                                    <View style={{overflow: 'hidden', flex: 1}}>
                                                                        <AnimateTouch 
                                                                            style={[{borderColor: 'cyan', borderWidth: 0, flex: 1}, animatedStyle]}
                                                                            onPress={() => {
                                                                                if(Actions.currentScene !== screen.type){
                                                                                    Actions[screen.type]();
                                                                                }else {
                                                                                    Actions.drawerClose();
                                                                                }
                                                                            }}
                                                                        >
                                                                            <View style={[{
                                                                                flexDirection: 'row', alignItems: 'center', borderWidth: 0, borderColor: 'blue',
                                                                                paddingBottom: getMarginTop(2.5).marginTop
                                                                            }]}>
                                                                                <View style={[{
                                                                                    borderColor: '#000000', borderWidth: getWidthnHeight(0.5).width, borderRadius: getWidthnHeight(3).width, 
                                                                                    width: getWidthnHeight(2.5).width, height: getWidthnHeight(2.5).width
                                                                                }]}/>
                                                                                <Text style={[fontSizeH4(), getMarginLeft(3)]}>{screen.val}</Text>
                                                                            </View>
                                                                        </AnimateTouch>
                                                                    </View>
                                                                </View>
                                                            );
                                                        })
                                                        }
                                                    </View>
                                                </View>
                                            </View>
                                        }
                                    </View>
                                );
                            }}
                        />
                    </View>
                    <View style={{justifyContent: 'center', borderBottomColor: '#C4C4C4', borderBottomWidth: 0.5}}>
                        <TouchableOpacity
                            style={[{
                                justifyContent: 'center', borderWidth: 0, borderColor: 'red', 
                                paddingVertical: getMarginTop(2.2).marginTop}, drawerMenuWidth
                            ]}
                            onPress={() => {
                                this.setState({selectedID: null}, () => {
                                    Alert.alert("Alert", "Are you sure you want to exit ?", [
                                        {
                                            text: "CANCEL",
                                            onPress: () => null
                                        },
                                        {
                                            text: "YES",
                                            onPress: async () => {
                                                await AsyncStorage.clear();
                                                Actions.auth();
                                            }
                                        }
                                    ])
                                })
                            }}>
                            <View style={[{flexDirection: 'row', alignItems: 'center'}, getMarginLeft(6), getMarginTop(0)]}>
                                <Image style={{width: getWidthnHeight(5.5).width, height: getWidthnHeight(5.5).width}} resizeMode="contain" source={require('../Image/log_out.png')} />
                                <Text style={[{fontWeight: 'bold', fontSize: (fontSizeH4().fontSize + 1)}, styles.boldFont, textColor, getMarginLeft(5)]}>Exit</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={[{alignItems: 'center'}, getMarginTop(2)]}>
                        <Text style={[fontSizeH4()]}>{`XENIA (${this.state.appVersion})`}</Text>
                    </View>
                    {(this.state.playStoreAppVersion > this.state.appVersion) &&
                        <View style={[{alignItems: 'center', justifyContent: 'flex-end', flex: 1}, getMarginBottom(2)]}>
                            <TouchableOpacity 
                                activeOpacity={0.5} 
                                onPress={() => {
                                    if(Platform.OS === 'android'){
                                        this.openGooglePlayStore();
                                    }else{
                                        this.openAppHostIOS();
                                    }
                                }}
                                style={{alignItems: 'center'}}
                            >
                                <Update name="system-update" color="black" size={Math.floor(getWidthnHeight(8).width)} />
                                <Text style={[fontSizeH4()]}>Click to Update App</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </View>
        );
    }
}

const CouponScreen = {
    id: 1,
    category_name: 'Coupon Management',
    image: (
        <GradientIcon
            start={{x: 0.3, y: 0}}
            end={{x: 0.7, y: 0}}
            containerStyle={[{borderWidth: 0, borderColor: 'red', alignItems: 'center'}, getWidthnHeight(6)]}
            icon={<MaterialIcons name={'receipt'} style={{backgroundColor: 'transparent'}} size={getWidthnHeight(6).width}/>}
            colors={["#FF6A4D", "#FF3333"]}
        />
    ),
    subcategory: [
        {id: '1', type: 'issueNewBook', val: 'Issue New Book'},
        {id: '3', type: 'serialNumber', val: 'Serial Number'},
        {id: '3', type: 'soldCoupons', val: 'Sold Coupons'},
        //{id: '4', type: 'couponsLeft', val: 'Coupons Left'},
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

const styles = StyleSheet.create({
    boldFont: {
        ...Platform.select({
        android: {
            fontFamily: ''
        }
        })
    }
})

const mapStateToProps = (state) => {
    return {
        drawerProps: state.props.userObj
    }
}

export default connect(mapStateToProps)(CustomInventory);