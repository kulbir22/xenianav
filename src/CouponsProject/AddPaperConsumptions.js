import React, {Component} from 'react';
import {
    View, Text, TextInput, StyleSheet, Platform, ActivityIndicator, Keyboard, Alert,
    ScrollView, KeyboardAvoidingView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-material-dropdown';
import axios from 'axios';
import moment from 'moment';
import {Header} from './Header';
import {
    getWidthnHeight, getMarginTop, getMarginLeft, fontSizeH4, ChoppedButton, getMarginVertical, getMarginBottom,
    MaskedGradientText, fontSizeH3, getMarginHorizontal, AnimatedTextInput, Spinner, DismissKeyboard, IOS_StatusBar, 
    statusBarGradient, AnimateDateLabel
} from '../NewComponents/common';

class AddPaperConsumption extends Component{
    constructor(props){
        super(props)
        this.state = {
            paperID: '',
            paperName: '',
            paperList: [],
            paperError: true,
            inputText: '',
            inputTextError: true,
            inputText2: '',
            inputText2Error: true,
            submit: false,
            baseURL: null,
            loading: false,
            serialFrom: '-',
            serialTo: '-',
            portName: '',
            couponType: null,
            date: `${moment().year()}/${moment().month() + 1}/${moment().date()}`,
            dateError: false,
            quantityAvailable: '-',
            totalConsumption: '-'
        };
    }

    componentDidMount(){
        AsyncStorage.getItem('receivedBaseURL').then((url) => {
            this.setState({baseURL: url}, () => {
                //console.log("BASE URL: ", this.state.baseURL)
                this.fetchPaperList();
            })
        })
    }

    showLoader(){
        this.setState({loading: true})
    }

    hideLoader(){
        this.setState({loading: false})
    }

    async fetchPaperList(){
        const {baseURL} = this.state;
        this.showLoader();
        var user_token= await AsyncStorage.getItem('user_token');
        var userObj = JSON.parse(user_token);
        const empID = userObj.success.customs.id;
        this.setState({portName: userObj.success.customs.port.name}, () => {})
        axios.post(`${baseURL}/customs/paper-list`,
        {
            userId: empID
        },
        {
            headers: {
                'Accept': 'application/json',
            }
        }).then((response) => {
            this.hideLoader();
            const responseJson = (response.data);
            //console.log("@@@@@ #### ISSUED BOOKS LIST", responseJson.success)
            const paperTypes = responseJson.success.paperTypes;
            const paperList = paperTypes.map((item, index) => {
                return {id: item, paper_type: item }
            })
            this.setState({paperList})
        }).catch((error) => {
            this.hideLoader();
            //console.log("AXIOS ERROR: ", error)
            let status = null;
            if(error.response){
                //console.log("AXIOS RESPONSE: ", error.response)
                status = error.response.status;
                Alert.alert("Error!!!", `ErrorCode: ${status}808`)
            }else{
                alert(`${error}, API CODE: 804`)
            }
        });
    }

    async issuedPaperDetail(){
        const {baseURL, paperName} = this.state;
        this.showLoader();
        var user_token= await AsyncStorage.getItem('user_token');
        var userObj = JSON.parse(user_token);
        const portID = userObj.success.customs.custom_port_id;
        const empID = userObj.success.customs.id;
        axios.post(`${baseURL}/customs/issued-papers-detail`,
        {
            custom_port_id: portID,
            custom_employee_id: empID,
            paper_type: paperName,
        },
        {
            headers: {
                'Accept': 'application/json',
            }
        }).then((response) => {
            this.hideLoader();
            const responseJson = (response.data);
            this.setState({
                quantityAvailable: responseJson.success.paper_available,
                totalConsumption: responseJson.success.paper_consumed.total_consumed_quantity
            }, () => console.log("TOTAL CONSUMPTION: ", this.state.quantityAvailable))
        }).catch((error) => {
            this.hideLoader();
            //console.log("AXIOS ERROR: ", error)
            let status = null;
            if(error.response){
                //console.log("AXIOS RESPONSE: ", error.response)
                status = error.response.status;
                Alert.alert("Error!!!", `ErrorCode: ${status}810`)
            }else{
                alert(`${error}, API CODE: 805`)
            }
        });
    }
    
    submitConsumption = async() => {
        const {baseURL, paperName, inputText, inputText2, date} = this.state;
        if(inputText === '0' && inputText2 === '0'){
            alert(`Either "Utilized" or "Wasted" quantity must be greater than 0.`)
            return;
        }
        this.showLoader();
        const user_token= await AsyncStorage.getItem('user_token');
        const userObj = JSON.parse(user_token);
        const portID = userObj.success.customs.custom_port_id;
        const empID = userObj.success.customs.id;
        axios.post(`${baseURL}/customs/papers-out`,
        {
            custom_port_id: portID,
            custom_employee_id: empID,
            paper_type: paperName,
            utilized: inputText,
            wasted: inputText2,
            for_date: date
        },
        {
            headers: {
                'Accept': 'application/json',
            }
        }).then((response) => {
            this.hideLoader();
            console.log("### SUBMIT CONSUMPTION: ", (response.data))
            this.setState({
                inputText: '', inputTextError: true,
                inputText2: '', inputText2Error: true, submit: false
            }, () => this.issuedPaperDetail())
            alert(`${response.data.success}`)
        }).catch((error) => {
            this.hideLoader();
            let status = null;
            console.log("API ERROR: ", error, error.response)
            if(error.response){
                status = error.response.status;
                Alert.alert("Error!!!", `ErrorCode: ${status}809`)
            }else{
                alert(`${error}, API CODE: 806`)
            }
        })
    }

    render(){
        const {
            paperName, paperList, paperError, inputText, inputTextError, submit, loading, portName,
            date, dateError, inputText2, inputText2Error, quantityAvailable, totalConsumption
        } = this.state;
        const colorTitle = '#0B8EE8';
        const fadedBG = 'rgba(11, 142, 232, 0.2)';
        const previousDate = moment().subtract(1, 'day').format("YYYY/MM/DD");
        const currentDate = `${moment().year()}/${moment().month() + 1}/${moment().date()}`;
        console.log("@@@ DATE: ", previousDate, currentDate, date)
        return (
            <View style={{flex: 1}}>
                <IOS_StatusBar color={statusBarGradient} barStyle="light-content"/>
                <Header
                    menu='white'
                    title='Add Paper Consumption'
                />
                <View style={{flex: 1}}>
                    <View style={styles.container}>
                        <DismissKeyboard>
                        <KeyboardAvoidingView style={{alignItems: 'center'}} behavior={(Platform.OS === 'ios')? "padding" : null} keyboardVerticalOffset={(Platform.OS === 'ios')? getMarginTop(14).marginTop : null}>
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
                                    textOverflow:'hidden', borderColor: (submit && paperError)? 'red' : '#C4C4C4', borderWidth: (submit && paperError)? 2 : 1, 
                                    borderStyle: (submit && paperError)? 'dashed' : 'solid', borderRadius: getWidthnHeight(1).width
                                }, getWidthnHeight(84, 7), getMarginTop(2)]}
                                inputContainerStyle={[{
                                    borderBottomWidth: 0, borderColor: '#C4C4C4', paddingHorizontal: 5 
                                }, getWidthnHeight(84), getMarginTop(-1)]}
                                label={'Paper Type'}
                                labelFontSize={fontSizeH4().fontSize - 3}
                                labelTextStyle={[getMarginLeft(1.5), getMarginTop(0)]}
                                data={paperList}
                                valueExtractor={({id})=> id}
                                labelExtractor={({paper_type})=> paper_type}
                                onChangeText={(id, index, data) => {
                                    this.setState({
                                        paperID: id, paperName: data[index]['paper_type'], paperError: false
                                    }, () => this.issuedPaperDetail());
                                    Keyboard.dismiss();
                                }}
                                value={paperName}
                                baseColor = {(paperName)? colorTitle : '#C4C4C4'}
                                fontSize = {(paperName)? fontSizeH4().fontSize + 2 : fontSizeH4().fontSize}
                            />
                            <View style={[{alignItems: 'center', flexDirection: 'row'}, getMarginTop(2)]}>
                                <AnimateDateLabel
                                    containerColor={[(submit && dateError)? 'red' : '#C4C4C4', (submit && dateError)? 'red' : '#C4C4C4']}
                                    containerBorderWidth={[(submit && dateError)? 2 : 1, 1]}
                                    containerStyle={[{
                                        borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && dateError)? 'dashed' : 'solid',
                                    }, getWidthnHeight(84, 6.5)]}
                                    slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                    slideHorizontal={[0, getWidthnHeight(-5.4).width]}
                                    style={[{justifyContent: 'center'}, getWidthnHeight(82, 6.5)]}
                                    date={date}
                                    minDate={previousDate}
                                    maxDate={currentDate}
                                    mode="date"
                                    placeholder="On Date"
                                    titleContainer={[{alignSelf: 'flex-start'}]}
                                    titleStyle={[getMarginLeft(5)]}
                                    format="YYYY/MM/DD"
                                    onDateChange={(date) => {this.setState({date: date, dateError: false}, () => {
                                        Keyboard.dismiss();
                                    })}}
                                />
                            </View>
                            <View style={[getMarginTop(2)]}>
                                <Text style={{fontSize: (fontSizeH4().fontSize + 2)}}>Quantity available in the stock</Text>
                            </View>
                            <View style={[{alignItems: 'center'}, getMarginTop(2)]}>
                                <View style={[{
                                    height: getWidthnHeight(12).width, backgroundColor: fadedBG,
                                    alignItems: 'center', justifyContent: 'center'
                                }]}>
                                    <Text style={{color: colorTitle, fontSize: (fontSizeH3().fontSize + 5)}}> {quantityAvailable} </Text>
                                </View>
                            </View>
                            <View style={[{borderColor: 'rgba(196, 196, 196, 0.5)', borderWidth: 0.5}, getWidthnHeight(84), getMarginTop(3)]}/>
                            <View style={[{alignSelf: 'flex-start'}, getMarginTop(2)]}>
                                <Text style={[{color: colorTitle}, fontSizeH4(), getMarginLeft(5)]}>ENTER CONSUMED QUANTITY</Text>
                            </View>
                            <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, getMarginTop(2.5), getWidthnHeight(84)]}>
                                <AnimatedTextInput 
                                    placeholder=" Utilized Quantity "
                                    placeholderColor={['#C4C4C4', '#0B8EE8']}
                                    value={inputText}
                                    keyboardType={'numeric'}
                                    maxLength={5}
                                    editable={(quantityAvailable === 0 || quantityAvailable === '-')? false : true}
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
                                    }, getWidthnHeight(40, 7)]}
                                    style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 4)}, getWidthnHeight(37, 7), getMarginHorizontal(2)]}
                                />
                                <AnimatedTextInput 
                                    placeholder=" Wasted Quantity "
                                    placeholderColor={['#C4C4C4', '#0B8EE8']}
                                    value={inputText2}
                                    keyboardType={'numeric'}
                                    maxLength={5}
                                    editable={(quantityAvailable === 0 || quantityAvailable === '-')? false : true}
                                    slideVertical={[0, getWidthnHeight(undefined, -3.5).height]}
                                    slideHorizontal={[0, getWidthnHeight(-3).width]}
                                    placeholderScale={[1, 0.75]}
                                    autoFocus={false}
                                    onChangeText={(text) => {
                                        this.setState({ inputText2: text.replace(/[^0-9]/g, '')}, () => {
                                            const {inputText2} = this.state;
                                            if(inputText2){
                                                this.setState({inputText2Error: false})
                                            }else if(inputText2 === ''){
                                                this.setState({inputText2: '', inputText2Error: true}, () => Keyboard.dismiss())
                                            }
                                        })
                                    }}
                                    clearText={() => this.setState({inputText2: '', inputText2Error: true})}
                                    containerColor={[(submit && inputText2Error)? 'red' : '#C4C4C4', (submit && inputText2Error)? 'red' : '#C4C4C4']}
                                    containerBorderWidth={[(submit && inputText2Error)? 2 : 1, 1]}
                                    containerStyle={[{
                                        borderRadius: getWidthnHeight(1).width, justifyContent: 'center', borderStyle: (submit && inputText2Error)? 'dashed' : 'solid',
                                    }, getWidthnHeight(40, 7)]}
                                    style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 4)}, getWidthnHeight(37, 7), getMarginHorizontal(2)]}
                                />
                            </View>
                            <View style={[getMarginTop(2)]}>
                                <Text style={{fontSize: (fontSizeH4().fontSize + 2)}}>Total Consumption</Text>
                            </View>
                            <View style={[{alignItems: 'center'}, getMarginTop(2)]}>
                                <View style={[{
                                    height: getWidthnHeight(12).width, backgroundColor: fadedBG,
                                    alignItems: 'center', justifyContent: 'center'
                                }]}>
                                    <Text style={{color: colorTitle, fontSize: (fontSizeH3().fontSize + 5)}}> {Number(totalConsumption)? totalConsumption : Number(quantityAvailable)? 0 : '-'} </Text>
                                </View>
                            </View>
                            </ScrollView>
                            <View style={[getMarginBottom(2)]}>
                                <ChoppedButton 
                                    onPress={() => {
                                        if(quantityAvailable === 0){
                                            return;
                                        }
                                        this.setState({submit: true}, () => {
                                            const {paperError, inputTextError, inputText2Error, dateError} = this.state;
                                            if(!paperError && !inputTextError && !inputText2Error && !dateError){
                                                this.submitConsumption();
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
                        </View>
                        </KeyboardAvoidingView>
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

export default AddPaperConsumption;