import React, {Component} from 'react';
import {
    View, Text, TextInput, StyleSheet, Platform, ActivityIndicator, Keyboard, Alert,
    ScrollView, KeyboardAvoidingView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-material-dropdown';
import axios from 'axios';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Header} from './Header';
import {
    getWidthnHeight, getMarginTop, getMarginLeft, fontSizeH4, ChoppedButton, getMarginVertical, getMarginBottom,
    MaskedGradientText, fontSizeH3, getMarginHorizontal, AnimatedTextInput, Spinner, DismissKeyboard, IOS_StatusBar, 
    statusBarGradient, AnimateDateLabel
} from '../KulbirComponents/common';

class SerialNumber extends Component{
    constructor(props){
        super(props)
        this.state = {
            bookID: '',
            bookName: '',
            bookData: [],
            bookError: true,
            inputText: '',
            inputTextError: true,
            submit: false,
            baseURL: null,
            loading: false,
            serialFrom: '-',
            serialTo: '-',
            portName: '',
            couponType: null,
            lastSerialNumber: 0,
            date: `${moment().date()}/${moment().month() + 1}/${moment().year()}`,
            dateError: false
        };
    }

    componentDidMount(){
        AsyncStorage.getItem('receivedBaseURL').then((url) => {
            this.setState({baseURL: url}, () => {
                //console.log("BASE URL: ", this.state.baseURL)
                this.issuedBooksList();
            })
        })
    }

    showLoader(){
        this.setState({loading: true})
    }

    hideLoader(){
        this.setState({loading: false})
    }

    async issuedBooksList(){
        const {baseURL} = this.state;
        this.showLoader();
        var user_token= await AsyncStorage.getItem('user_token');
        var userObj = JSON.parse(user_token);
        const portID = userObj.success.customs.custom_port_id;
        const empID = userObj.success.customs.id;
        this.setState({portName: userObj.success.customs.port.name}, () => {})
        //console.log("BASEURL: ", `${baseURL}/customs/inventory-list?port_id=${portID}`, )
        axios.get(`${baseURL}/customs/inventory-list?port_id=${portID}&status=issued&custom_employee_id=${empID}`,
        {
            headers: {
                'Accept': 'application/json',
            }
        }).then((response) => {
            this.hideLoader();
            const responseJson = (response.data);
            //console.log("@@@@@ #### ISSUED BOOKS LIST", responseJson.success)
            const updateListName = responseJson.success.inventory.map((item) => {
                return {...item, name: `${item.name} - ${"\u20B9"} ${item.coupon_type}/-`}
            })
            this.setState({bookData: updateListName})
        }).catch((error) => {
            this.hideLoader();
            //console.log("AXIOS ERROR: ", error)
            let status = null;
            if(error.response){
                //console.log("AXIOS RESPONSE: ", error.response)
                status = error.response.status;
                Alert.alert("Error!!!", `ErrorCode: ${status}804`)
            }else{
                alert(`${error}, API CODE: 804`)
            }
        });
    }

    async inventoryDetails(){
        const {baseURL, bookID} = this.state;
        this.showLoader();
        var user_token= await AsyncStorage.getItem('user_token');
        var userObj = JSON.parse(user_token);
        const portID = userObj.success.customs.custom_port_id;
        const empID = userObj.success.customs.id;
        //console.log("BASEURL: ", `${baseURL}/customs/inventory-list?port_id=${portID}`, )
        axios.get(`${baseURL}/customs/inventory-details?inventory_id=${bookID}`,
        {
            headers: {
                'Accept': 'application/json',
            }
        }).then((response) => {
            this.hideLoader();
            const responseJson = (response.data);
            console.log("@@@@@ #### INVENTORY DETAILS: ", responseJson.success.last_serial_detail)
            const inventoryDetail = responseJson.success.inventory_detail;
            this.setState({
                serialFrom: inventoryDetail.serial_from, serialTo: inventoryDetail.serial_to,
                inputText: '', inputTextError: true, lastSerialNumber: responseJson.success.last_serial_detail
            })
        }).catch((error) => {
            this.hideLoader();
            //console.log("AXIOS ERROR: ", error)
            let status = null;
            if(error.response){
                //console.log("AXIOS RESPONSE: ", error.response)
                status = error.response.status;
                Alert.alert("Error!!!", `ErrorCode: ${status}805`)
            }else{
                alert(`${error}, API CODE: 805`)
            }
        });
    }
    
    onSubmit = async() => {
        const {baseURL, bookID, inputText, date} = this.state;
        this.showLoader();
        const user_token= await AsyncStorage.getItem('user_token');
        const userObj = JSON.parse(user_token);
        const empID = userObj.success.customs.id;
        axios.post(`${baseURL}/customs/inventory-save-in-out`,
        {
            inventory_id: bookID,
            custom_employee_id: empID,
            last_serial_number: inputText,
            for_date: moment(date, "DD-MM-YYYY").format("YYYY-MM-DD")
        },
        {
            headers: {
                'Accept': 'application/json',
            }
        }).then((response) => {
            this.hideLoader();
            console.log("### ISSUED BOOK: ", (response.data))
            this.setState({
                submit: false, inputText: '', inputTextError: true, dateError: false,
                date: `${moment().date()}/${moment().month() + 1}/${moment().year()}`
            }, () => this.inventoryDetails())
            alert(`${response.data.success}`)
        }).catch((error) => {
            this.hideLoader();
            let status = null;
            console.log("API ERROR: ", error, error.response)
            if(error.response){
                status = error.response.status;
                Alert.alert("Error!!!", `ErrorCode: ${status}806`)
            }else{
                alert(`${error}, API CODE: 806`)
            }
        })
    }

    render(){
        const {
            bookID, bookName, bookData, bookError, inputText, inputTextError, submit, loading, serialFrom, serialTo, portName, couponType,
            lastSerialNumber, date, dateError
        } = this.state;
        const colorTitle = '#0B8EE8';
        const fadedBG = 'rgba(11, 142, 232, 0.2)';
        const previousDate = moment().subtract(1, 'day').format("DD/MM/YYYY");
        const currentDate = `${moment().date()}/${moment().month() + 1}/${moment().year()}`;
        console.log("@@@ DATE: ", previousDate, currentDate, date)
        return (
            <View style={{flex: 1}}>
                <IOS_StatusBar color={statusBarGradient} barStyle="light-content"/>
                <Header
                    menu='white'
                    title='Add Port Serial Number'
                />
                <View style={{flex: 1}}>
                    <View style={styles.container}>
                        <DismissKeyboard>
                        <View style={[{
                            flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', shadowColor: '#000000', shadowOpacity: 0.5,
                            elevation: 4, shadowRadius: 2
                            }, getWidthnHeight(93), getMarginVertical(2)
                        ]}>
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{alignItems: 'center'}} style={[getWidthnHeight(93), getMarginVertical(2)]}>
                            <View>
                                {(portName === '')? (
                                    <View style={styles.indicatorBG}>
                                        <ActivityIndicator size="large" color="white" />
                                    </View>
                                    )
                                :
                                    <MaskedGradientText
                                        title={portName}
                                        titleStyle={[{fontWeight: '600', color: '#000000', fontSize: (fontSizeH3().fontSize)}]}
                                        start={{x: 0, y: 0}}
                                        end={{x: 0.7, y: 0}}
                                        colors={["#039FFD", "#EA304F"]}
                                    />
                                }
                            </View>
                            <Dropdown
                                containerStyle={[{
                                    textOverflow:'hidden', borderColor: (submit && bookError)? 'red' : '#C4C4C4', borderWidth: (submit && bookError)? 2 : 1, 
                                    borderStyle: (submit && bookError)? 'dashed' : 'solid', borderRadius: getWidthnHeight(1).width
                                }, getWidthnHeight(84, 7), getMarginTop(2)]}
                                inputContainerStyle={[{
                                    borderBottomWidth: 0, borderColor: '#C4C4C4', paddingHorizontal: 5 
                                }, getWidthnHeight(84), getMarginTop(-1)]}
                                label={'Book Name'}
                                labelFontSize={fontSizeH4().fontSize - 3}
                                labelTextStyle={[getMarginLeft(1.5), getMarginTop(0)]}
                                data={bookData}
                                valueExtractor={({id})=> id}
                                labelExtractor={({name})=> name}
                                onChangeText={(id, index, data) => {
                                    this.setState({
                                        bookID: id, bookName: data[index]['name'], bookError: false, couponType: data[index]['coupon_type']
                                    }, () => this.inventoryDetails());
                                }}
                                value={bookName}
                                baseColor = {(bookName)? colorTitle : '#C4C4C4'}
                                fontSize = {(bookName)? fontSizeH4().fontSize + 2 : fontSizeH4().fontSize}
                            />
                            <View style={[getMarginTop(2)]}>
                                <Text style={{fontSize: (fontSizeH4().fontSize + 2)}}>Serial Number of coupons available</Text>
                            </View>
                            <View style={[{flexDirection: 'row', alignItems: 'center'}, getMarginTop(2)]}>
                                <View style={[{
                                    height: getWidthnHeight(12).width, backgroundColor: fadedBG,
                                    alignItems: 'center', justifyContent: 'center'
                                }]}>
                                    <Text style={{color: colorTitle, fontSize: (fontSizeH3().fontSize + 5)}}> {(lastSerialNumber === 0)? serialFrom : (Number(lastSerialNumber) + 1)} </Text>
                                </View>
                                <Text style={[fontSizeH3(), getMarginHorizontal(2)]}>to</Text>
                                <View style={[{
                                    height: getWidthnHeight(12).width, backgroundColor: fadedBG,
                                    alignItems: 'center', justifyContent: 'center'
                                }]}>
                                    <Text style={{color: colorTitle, fontSize: (fontSizeH3().fontSize + 5)}}> {serialTo} </Text>
                                </View>
                            </View>
                            {(couponType) &&
                                <View style={[{alignItems: 'center', flexDirection: 'row'}, getMarginTop(3)]}>
                                    <Text style={{fontSize: (fontSizeH4().fontSize + 2)}}>for</Text>
                                    <Text style={[{fontSize: (fontSizeH4().fontSize + 2)}, styles.boldFont, getMarginLeft(2)]}>{`${"\u20B9"} ${couponType}/-`}</Text>
                                </View>
                            }
                            <View style={[{alignItems: 'center', flexDirection: 'row'}, getMarginTop(3)]}>
                                <AnimateDateLabel
                                    containerColor={[(submit && dateError)? 'red' : '#C4C4C4', (submit && dateError)? 'red' : '#C4C4C4']}
                                    containerBorderWidth={[(submit && dateError)? 2 : 1, 1]}
                                    containerStyle={[{
                                        borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && dateError)? 'dashed' : 'solid',
                                    }, getWidthnHeight(42, 6.5)]}
                                    slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                    slideHorizontal={[0, getWidthnHeight(-5.4).width]}
                                    style={[{justifyContent: 'center'}, getWidthnHeight(42, 6.5)]}
                                    date={date}
                                    minDate={previousDate}
                                    maxDate={currentDate}
                                    mode="date"
                                    placeholder="On Date"
                                    titleContainer={[{alignSelf: 'flex-start'}]}
                                    titleStyle={[getMarginLeft(5)]}
                                    format="DD/MM/YYYY"
                                    onDateChange={(date) => {this.setState({date: date, dateError: false}, () => {
                                        Keyboard.dismiss();
                                    })}}
                                />
                            </View>
                            <View style={[getMarginTop(3)]}>
                                <AnimatedTextInput 
                                    placeholder=" Enter Serial Number "
                                    placeholderColor={['#C4C4C4', '#0B8EE8']}
                                    value={inputText}
                                    keyboardType={'numeric'}
                                    slideVertical={[0, getWidthnHeight(undefined, -3.5).height]}
                                    slideHorizontal={[0, getWidthnHeight(-3).width]}
                                    placeholderScale={[1, 0.75]}
                                    autoFocus={false}
                                    onChangeText={(inputText) => {
                                        this.setState({ inputText: inputText.replace(/[^0-9]/g, '')}, () => {
                                            const {inputText} = this.state;
                                            if(inputText){
                                                this.setState({inputTextError: false})
                                            }else if(inputText === ''){
                                                this.setState({inputText: '', inputTextError: true}, () => Keyboard.dismiss())
                                            }
                                        })
                                    }}
                                    clearText={() => this.setState({inputText: '', inputTextError: true})}
                                    containerColor={[(submit && inputTextError)? 'red' : '#C4C4C4', (submit && inputTextError)? 'red' : '#C4C4C4']}
                                    containerBorderWidth={[(submit && inputTextError)? 2 : 1, 1]}
                                    containerStyle={[{
                                        borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && inputTextError)? 'dashed' : 'solid',
                                    }, getWidthnHeight(50, 7)]}
                                    style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 4)}, getWidthnHeight(47, 7), getMarginHorizontal(1.5)]}
                                />
                            </View>
                            <View style={[getMarginTop(3)]}>
                                <ChoppedButton 
                                    onPress={() => {
                                        this.setState({submit: true}, () => {
                                            const {bookError, inputTextError, dateError} = this.state;
                                            if(!bookError && !inputTextError && !dateError){
                                                this.onSubmit();
                                            }else{
                                                alert("Please fill the fields highlighted in RED.")
                                            }
                                        })
                                    }}
                                    leftBoxSize={{width: getWidthnHeight(6).width, height: getWidthnHeight(undefined, 6).height}}
                                    middleBoxSize={{width: getWidthnHeight(20).width, height: getWidthnHeight(undefined, 6).height}}
                                    rightBoxSize={{width: getWidthnHeight(6).width, height: getWidthnHeight(undefined, 6).height}}
                                    title={'SUBMIT'}
                                    titleStyle={[{color: '#FFFFFF', letterSpacing: 2}]}
                                    buttonColor={"#039FFD"}
                                    underLayColor={"#EA304F"}
                                />
                            </View>
                            </ScrollView>
                        </View>
                        </DismissKeyboard>
                    </View>
                    <View 
                        style={[{backgroundColor: (loading)? 'rgba(0, 0, 0, 0.5)' : 'transparent', borderTopLeftRadius:0,
                        borderTopRightRadius: 0}, StyleSheet.absoluteFill]} 
                        pointerEvents={(loading)? 'auto' : 'none'}
                    >
                        {(loading) &&
                            <Spinner loading={loading} style={[styles.loadingStyle, getWidthnHeight(45, 10), getMarginLeft(3)]} color='rgb(19,111,232)'/>
                        }
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(196, 196, 196, 0.2)'
    },
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
        borderWidth: 0
    },
    indicatorBG: {
        width: getWidthnHeight(10).width, 
        height: getWidthnHeight(10).width, 
        borderRadius: getWidthnHeight(7.5).width,
        backgroundColor: '#039FFD',
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default SerialNumber;