import React, {Component} from 'react';
import {View, Text, TextInput, StyleSheet, Platform, FlatList, Keyboard, ActivityIndicator, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';
import {Header} from './Header';
import {
    getWidthnHeight, getMarginTop, getMarginLeft, fontSizeH4, ChoppedButton, getMarginVertical, getMarginBottom,
    MaskedGradientText, fontSizeH3, AnimateDateLabel, IOS_StatusBar, statusBarGradient, Spinner
} from '../NewComponents/common';

class SoldCoupons extends Component{
    constructor(props){
        super(props)
        this.state = {
            fromDate: '',
            fromDateError: true,
            toDate: '',
            toDateError: true,
            submit: false,
            loading: false,
            baseURL: null,
            bookData: [],
            portName: '',
            empID: null
        };
    }

    componentDidMount(){
        AsyncStorage.getItem('receivedBaseURL').then((url) => {
            this.setState({baseURL: url}, () => {
                //console.log("BASE URL: ", this.state.baseURL)
            })
        });
        AsyncStorage.getItem('user_token').then((data) => {
            const userObj = JSON.parse(data);
            const empID = userObj.success.customs.id;
            this.setState({portName: userObj.success.customs.port.name, empID}, () => {})
        });
    }

    showLoader(){
        this.setState({loading: true})
    }

    hideLoader(){
        this.setState({loading: false})
    }

    issuedBooksList(){
        const {baseURL, fromDate, toDate, empID} = this.state;
        this.showLoader();
        //console.log("BASEURL: ", `${baseURL}/customs/port-inventory-report?from_date=${fromDate}&to_date=${toDate}&custom_employee_id=${empID}`)
        axios.get(`${baseURL}/customs/port-inventory-report?from_date=${fromDate}&to_date=${toDate}&custom_employee_id=${empID}`,
        {
            headers: {
                'Accept': 'application/json',
            }
        }).then((response) => {
            this.hideLoader();
            const responseJson = (response.data);
            //console.log("AXIOS SUCCESS: ", responseJson)
            const bookData = responseJson.success.map((item, index) => {
                return {...item, id: index}
            })
            this.setState({bookData}, () => {
                //console.log("@@@@@ #### ISSUED BOOKS LIST", this.state.bookData)
            })
        }).catch((error) => {
            this.hideLoader();
            //console.log("AXIOS ERROR: ", error)
            let status = null;
            if(error.response){
                //console.log("AXIOS RESPONSE: ", error.response)
                status = error.response.status;
                Alert.alert("Error!!!", `ErrorCode: ${status}807`)
            }else{
                alert(`${error}, API CODE: 807`)
            }
        });
    }

    render(){
        const {fromDate, fromDateError, toDate, toDateError, submit, loading, bookData, portName} = this.state;
        const colorTitle = '#0B8EE8';
        const tableHeader = [
            {id: '1', name: 'Type'},
            {id: '2', name: 'Units Sold'}
        ];
        const currentDate = `${moment().year()}-${moment().month() + 1}-${moment().date()}`
        console.log("DATE: ", currentDate)
        return (
            <View style={{flex: 1}}>
                <IOS_StatusBar color={statusBarGradient} barStyle="light-content"/>
                <Header
                    menu='white'
                    title='Sold Coupons'
                />
                <View style={{flex: 1}}>
                    <View style={styles.container}>
                        <View style={[{
                            flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', shadowColor: '#000000', shadowOpacity: 0.5,
                            elevation: 4, shadowRadius: 2
                            }, getWidthnHeight(93), getMarginVertical(2)
                        ]}>
                            <View style={[getMarginTop(2)]}>
                                {(portName === '') ? (
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
                            <View style={[{flexDirection:'row', justifyContent: 'space-evenly', alignItems: 'center'}, getMarginTop(2), getWidthnHeight(93)]}>
                                <AnimateDateLabel
                                    containerColor={[(submit && fromDateError)? 'red' : '#C4C4C4', (submit && fromDateError)? 'red' : '#C4C4C4']}
                                    containerBorderWidth={[(submit && fromDateError)? 2 : 1, 1]}
                                    containerStyle={[{
                                        borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && fromDateError)? 'dashed' : 'solid',
                                    }, getWidthnHeight(42, 6.5)]}
                                    slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                    slideHorizontal={[0, getWidthnHeight(-5.5).width]}
                                    style={[{justifyContent: 'center'}, getWidthnHeight(42, 6.5)]}
                                    date={fromDate}
                                    minDate="2016-01-01"
                                    maxDate={currentDate}
                                    mode="date"
                                    placeholder="From Date"
                                    titleContainer={[{alignSelf: 'flex-start'}]}
                                    titleStyle={[getMarginLeft(5)]}
                                    format="YYYY-MM-DD"
                                    onDateChange={(date) => {
                                        if((date !== fromDate) && moment(fromDate).valueOf()){
                                            this.setState({bookData: []})
                                        }
                                        console.log("TEST DATE: ", moment(fromDate).valueOf())
                                        const currentTimeStamp = moment().valueOf();
                                        const addTime = moment(currentTimeStamp).add(1, 'second').format('hh:mm:ss A')
                                        const selectedTimeStamp = moment(`${date} ${addTime}`, "YYYY-MM-DD hh:mm:ss A").valueOf();
                                        const date2AddTime = moment(currentTimeStamp).add(2, 'seconds').format('hh:mm:ss A');
                                        let date2TimeStamp = moment(`${toDate} ${date2AddTime}`, "YYYY-MM-DD hh:mm:ss A").valueOf();
                                        //console.log("DATE TIME STAMP: \n", selectedTimeStamp, addTime, "\n", selectedTimeStamp > date2TimeStamp, Boolean(date2TimeStamp), date2AddTime);
                                        this.setState({
                                            fromDate: date, fromDateError: false
                                        }, () => {
                                            Keyboard.dismiss();
                                        })
                                        if(selectedTimeStamp > date2TimeStamp && date2TimeStamp){
                                            this.setState({toDate: '', toDateError: true}, () => {
                                                Keyboard.dismiss();
                                            })
                                        }
                                    }}
                                />
                                <AnimateDateLabel
                                    containerColor={[(submit && toDateError)? 'red' : '#C4C4C4', (submit && toDateError)? 'red' : '#C4C4C4']}
                                    containerBorderWidth={[(submit && toDateError)? 2 : 1, 1]}
                                    containerStyle={[{
                                        borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && toDateError)? 'dashed' : 'solid',
                                    }, getWidthnHeight(42, 6.5)]}
                                    slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                    slideHorizontal={[0, getWidthnHeight(-5).width]}
                                    style={[{justifyContent: 'center'}, getWidthnHeight(42, 6.5)]}
                                    disabled={(fromDateError)? true : false}
                                    date={toDate}
                                    minDate={fromDate}
                                    maxDate={currentDate}
                                    mode="date"
                                    placeholder="To Date"
                                    titleContainer={[{alignSelf: 'flex-start'}]}
                                    titleStyle={[{backgroundColor: (fromDateError)? 'transparent' : '#FFFFFF'}, getMarginLeft(5)]}
                                    format="YYYY-MM-DD"
                                    onDateChange={(date) => {
                                        if((date !== toDate) && moment(toDate).valueOf()){
                                            this.setState({bookData: []})
                                        }
                                        const currentTimeStamp = moment().valueOf();
                                        const addTime = moment(currentTimeStamp).add(2, 'seconds').format('hh:mm:ss A')
                                        const selectedTimeStamp = moment(`${date} ${addTime}`, "YYYY-MM-DD hh:mm:ss A").valueOf();
                                        const date1AddTime = moment(currentTimeStamp).add(1, 'second').format('hh:mm:ss A');
                                        let date1TimeStamp = moment(`${fromDate} ${date1AddTime}`, "YYYY-MM-DD hh:mm:ss A").valueOf();
                                        if(date1TimeStamp > selectedTimeStamp){
                                            this.setState({toDate: '', toDateError: true}, () => {
                                                Keyboard.dismiss();
                                            })
                                            alert("This date should be greater/equal to FROM DATE")
                                        }else{
                                            this.setState({toDate: date, toDateError: false}, () => {
                                                Keyboard.dismiss();
                                            })
                                        }
                                    }}
                                />
                            </View>
                            <View style={[getMarginTop(2)]}>
                                <ChoppedButton 
                                    onPress={() => {
                                        this.setState({submit: true}, () => {
                                            const {fromDateError, toDateError} = this.state;
                                            if(!fromDateError && !toDateError){
                                                this.issuedBooksList();
                                            }else{
                                                alert("Please fill the fields highlighted in RED")
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
                            <View style={[{height: 1, backgroundColor: '#C4C4C4'}, getWidthnHeight(84), getMarginTop(4)]}/>
                            <View style={[{alignSelf: 'flex-start'}, getMarginTop(2)]}>
                                <Text style={[{color: colorTitle}, fontSizeH4(), getMarginLeft(5)]}>TOTAL COUPONS SOLD</Text>
                            </View>
                            <View style={[getMarginTop(1)]}>
                                <View style={[{backgroundColor: colorTitle, flexDirection: 'row'}, getWidthnHeight(84, 5)]}>
                                    {tableHeader.map((item, index) => {
                                        return (
                                            <View style={[{alignItems: 'center', justifyContent: 'center', borderColor: 'white', borderRightWidth: 0}, getWidthnHeight(42, 5)]}>
                                                <Text style={[{color: 'white', fontWeight: 'normal', fontSize: (fontSizeH4().fontSize + 2)}, styles.boldFont]}>{item.name}</Text>
                                            </View>
                                        );
                                    })
                                    }
                                </View>
                            </View>
                            <View style={[{flex: 1}, getMarginBottom(2)]}>
                                {(bookData.length > 0)?
                                    <FlatList 
                                        data={bookData}
                                        nestedScrollEnabled={true}
                                        showsVerticalScrollIndicator={false}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({item, index}) => {
                                            return (
                                                <View style={[{flexDirection: 'row', alignItems: 'center', borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(196, 196, 196, 0.3)'}, getWidthnHeight(84, 5)]}>
                                                    <View style={[{alignItems: 'center', justifyContent: 'center', borderWidth: 0, borderColor: 'red'}, getWidthnHeight(42, 7)]}>
                                                        <Text style={[{color: '#000000', fontSize: (fontSizeH4().fontSize + 2)}]}>{`${"\u20B9"} ${item.type}/-`}</Text>
                                                    </View>
                                                    <View style={[{alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(42, 5)]}>
                                                        <Text>{item.unit_sold}</Text>
                                                    </View>
                                                </View>
                                            );
                                        }}
                                    />
                                :
                                    <View style={[{alignItems: 'center', justifyContent: 'center', borderColor: '#C4C4C4', borderWidth: (loading || bookData.length === 0)? 0.5 : 0}, getWidthnHeight(84, 5)]}>
                                        <Text style={{fontSize: (fontSizeH4().fontSize + 2)}}>{(loading)? 'Please wait...' : (bookData.length === 0)? 'No records were found' : 'Please wait...'}</Text>
                                    </View>
                                }
                            </View>
                        </View>
                    </View>
                    <View 
                        style={[{backgroundColor: (loading)? 'rgba(0, 0, 0, 0.5)' : 'transparent', borderTopLeftRadius:0,
                        borderTopRightRadius: 0}, StyleSheet.absoluteFill]} 
                        pointerEvents={(loading)? 'auto' : 'none'}
                    >
                        {(loading) ?
                            <Spinner loading={loading} style={[styles.loadingStyle, getWidthnHeight(45, 10), getMarginLeft(3)]} color='rgb(19,111,232)'/>
                        : null}
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

export default SoldCoupons;