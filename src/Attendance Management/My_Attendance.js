import React from 'react';
import {
    Dimensions, ActivityIndicator, Image, StyleSheet, Animated, SafeAreaView,
    Text, TouchableOpacity, View, ImageBackground, ScrollView, Keyboard, PanResponder, FlatList, Alert   
  } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { Dropdown } from 'react-native-material-dropdown';
import {extractBaseURL} from '../api/BaseURL';
import {
    Header, getWidthnHeight, CommonModal, IOS_StatusBar, WaveHeader, statusBarGradient, getMarginTop, getMarginVertical, fontSizeH3, fontSizeH4,
    fontSizeH2, getMarginLeft, getMarginBottom, Spinner
    } from '../KulbirComponents/common';
import moment from 'moment';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
var today = new Date();
const {dd} = today.getDate();

const mm = today.getMonth()+1; 
const yyyy = today.getFullYear();
const COLOR1 = "#039FFD";
const COLOR2 = "#EA304F";
const colorTitle = '#0B8EE8';
const presentColor = '#64E291';
const absentColor = '#FB3569';
const leaveColor = '#FAC70B';
const holidayColor = '#3DB2FF';

class monthlyreport extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            date:'',
            user_id:'',
            loading: false,
            monthly:'',
            uri:'',
            name:'',
            data:[],
            counter_data:'',
            pic_name_data:'',
            s_date:'',
            color:"p",
            value:'',
            status:'',
            status_data:'',
            backgroundColor:'',
            week_off:'Week-Off',
            Month:mm,
            Year:yyyy,
            baseURL: null,
            errorCode: null,
            apiCode: null,
            commonModal: false,
            animation: new Animated.Value(0),
        };
        this.props.navigation.setOptions({
            title: 'My Attendance'
        })
    }

    hideLoader = () => {
        this.setState({ loading: false });
    }

    showLoader = () => {
        this.setState({ loading: true });
    }

    show = async () => {
        const { baseURL } = this.state;
        this.showLoader();
        var userObj = await AsyncStorage.getItem('userObj');
        var parsedData = JSON.parse(userObj);
        var secretToken = parsedData.success.secret_token;
        var userid = parsedData.success.user.employee.user_id;
        console.log("@@### BASEURL: ", `${baseURL}/monthly-attendance-report`);
        axios.post(`${baseURL}/monthly-attendance-report`, {
            "year": this.state.Year,
            "month": this.state.Month,
            "user_id": userid
        },
        {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${secretToken}`
            }
        }).then((response) => {
            this.hideLoader();
            let monthlyReport = response.data.success.user.monthly_data;
            const counter = response.data.success.user.counter_data;
            const pic_name = response.data.success.user.employee;
            //console.log("@@@ Successfully200", c);
            monthlyReport = monthlyReport.map((item, index) => {
                return { ...item, id: (index + 1)}
            })
            this.setState({ counter_data:counter,  pic_name_data: pic_name, data: monthlyReport}, () => {
                console.log("### DATA: ", this.state.data)
            });
        }).catch((error) => {
            this.hideLoader();
            if(error.response?.data){
                Alert.alert("Error", JSON.stringify(error.response.data))
            }else if(error.response?._response){
                Alert.alert("Error", JSON.stringify(error.response._response))
            }
        })
    }

    onDecline(){
        this.setState({commonModal: false})
    }

    to_month(){
        var today = new Date();
        var dd = today.getDate();

        var mm = today.getMonth()+1; 
        var yyyy = today.getFullYear();
        // if(dd<10) 
        // {
        //     dd='0'+dd;
        // } 

        // if(mm<10) 
        // {
        //     mm='0'+mm;
        // } 
        today = yyyy+'-'+mm+'-'+'30';
        this.setState({Year:yyyy})
        this.setState({Month:mm})
        console.log("mm",mm);
        console.log("yyyy",yyyy);
    }

    async componentDidMount(){
        this.to_month();
        await this.extractLink();
        this.show();
    }

    async extractLink(){
        await extractBaseURL().then((baseURL) => {
            this.setState({baseURL}, () => console.log("EXTRACT LINK: ", this.state.baseURL))
        })
    }

    // UNSAFE_componentWillUnmount(){
    //     this._unsubscribe();
    // }

    getAsyncData = async(callback) => {
        const user_token = await AsyncStorage.getItem('user_token');
        const permissions_fir= JSON.parse(user_token);
        console.log("ASYNC DATA: ", permissions_fir.success.project)
        callback(permissions_fir.success.project, permissions_fir.success.user.employee_code)
    }

    renderHeader(){
        return (
            <WaveHeader
                wave={Platform.OS ==="ios" ? false : false} 
                //logo={require('../Image/Logo-164.png')}
                menu='white'
                title='My Attendance'
                //version={`Version ${this.state.deviceVersion}`}
            />
        );
    }

    renderItem = ({ item, index}) => {
        //console.log("@@@RENDER: ", this.state.data.length)
        let date = moment(item.on_date, "DD MMM, YYYY").format("DD-MM-YY")
        let status = item.status.substring(0,1);
        let backgroundColor = { backgroundColor: 'transparent'}
        if(item.status === "Present"){
            backgroundColor = { backgroundColor: presentColor}
        }else if(item.status === "Absent"){
            backgroundColor = { backgroundColor: absentColor}
        }else if(item.status === "Holiday"){
            backgroundColor = { backgroundColor: holidayColor}
        }else if(item.status === "Leave"){
            backgroundColor = { backgroundColor: leaveColor}
        }else if(item.status === "Week-Off"){
            backgroundColor = { backgroundColor: '#C4C4C4'}
        }
        return (
            <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', borderColor: '#C4C4C4', borderBottomWidth: 0.5}, getWidthnHeight(90)]}>
                <View style={[getWidthnHeight(20, 3.5), { alignItems: 'center', justifyContent: 'center' }]}>
                    <Text style={[{borderColor: 'black', borderWidth: 0, textAlign: 'center', color: 'black'}, fontSizeH4()]}>{date}</Text>
                </View>
                <View style={[{alignItems: 'center', justifyContent: 'center', width: getWidthnHeight(5).width, height: getWidthnHeight(5).width, borderRadius: getWidthnHeight(2.5).width}, backgroundColor]}>
                    <Text style={[{borderColor: 'black', borderWidth: 0, textAlign: 'center', color: 'white'}, fontSizeH4()]}>{status}</Text>
                </View>
                <View style={[getWidthnHeight(27.5, 3.5), { alignItems: 'center', justifyContent: 'center' }]}>
                    <Text style={[{borderColor: 'black', borderWidth: 0, textAlign: 'center', color: 'black'}, getWidthnHeight(27.5), fontSizeH4()]}>{(item.first_punch)? item.first_punch : 'N/A'}</Text>
                </View>
                <View style={[getWidthnHeight(27.5, 3.5), { alignItems: 'center', justifyContent: 'center' }]}>
                    <Text style={[{borderColor: 'black', borderWidth: 0, textAlign: 'center', color: 'black'}, getWidthnHeight(27.5), fontSizeH4()]}>{(item.last_punch)? item.last_punch : 'N/A'}</Text>
                </View>
            </View>
        );
    }

    render() {
        const {errorCode, apiCode} = this.state;
        const { counter_data,pic_name_data, animation, data, loading }=this.state;
        const t = [counter_data];
        var pic = { uri: pic_name_data.profile_picture };
        const context = this;
        var today = new Date();
        var mm = today.getMonth()+1; 
        var yyyy = today.getFullYear();
        let user = this.props.employer;
        let monthList = moment.months();
        monthList = monthList.map((name, index) => {
            return {name: name, id: index + 1}
        })
        const count = 3;
        const startYear = moment().subtract(count, 'years').year();
        let yearList  = [];
        for(let i = 0; i < count; i++){
            yearList.push(startYear + i);
            if(i === (count - 1)){
                yearList.push(moment().year());
            }
        }
        yearList = yearList.map((year, index) => {
            return {name: year, id: index + 1}
        })
        console.log("%%% DATA LENGTH: ", data.length)
        return (
            <View style={{flex: 1, alignItems: 'center'}}>
                <View>
                    <IOS_StatusBar color={statusBarGradient} barStyle="light-content"/>
                </View>
                <View style={[{flex: 1, alignItems: 'center'}, getWidthnHeight(100)]}>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <LinearGradient 
                            start={{x: 0, y: 1}} end={{x: 1, y: -1}}
                            colors={["#292C6D", "#6867AC"]}
                            style={[{alignItems: 'center', justifyContent: 'center', borderRadius: getWidthnHeight(4).width}, getWidthnHeight(90, 16), getMarginTop(2)]}
                        >
                            <View style={[{alignItems:'center'}, getMarginVertical(2)]}>
                                {(pic_name_data !== '')?
                                    <>
                                        <View style={{
                                            overflow: 'hidden', width: getWidthnHeight(22).width, height: getWidthnHeight(22).width, 
                                            borderRadius: getWidthnHeight(11).width, borderWidth:5, borderColor: 'white', alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Image 
                                                resizeMode="cover" 
                                                source={pic} 
                                                style={{
                                                    width: getWidthnHeight(20).width, height: getWidthnHeight(20).width
                                                }}
                                            />
                                        </View>
                                        <Text style={[{color: 'white', fontSize: (fontSizeH3().fontSize - 5)}]}>{pic_name_data.fullname.toUpperCase()}</Text>
                                    </>
                                :
                                    <ActivityIndicator size="large" color={'white'}/>
                                }
                            </View>
                        </LinearGradient>
                        <View style={[{flexDirection: 'row', justifyContent: 'space-evenly'}, getWidthnHeight(90, 6.5), getMarginTop(2)]}>
                            <View style={[{
                                borderColor: '#C4C4C4', justifyContent: 'center', borderRadius: getWidthnHeight(1).width,
                                borderWidth: 1,
                            }, getWidthnHeight(42, 6.5)]}>
                                <Dropdown
                                    containerStyle={[{textOverflow:'hidden', borderColor: '#C4C4C4', borderWidth: 0}, getWidthnHeight(42), getMarginTop(-1)]}
                                    inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getWidthnHeight(42)]}
                                    label={'Month'}
                                    labelFontSize={fontSizeH4().fontSize - 3}
                                    labelTextStyle={[getMarginLeft(1.5), getMarginTop(0)]}
                                    data={monthList}
                                    valueExtractor={({id})=> id}
                                    labelExtractor={({name})=> name}
                                    onChangeText={(id, index, data) => {
                                        this.setState({
                                            Month: id,
                                            data: []
                                        }, () => {
                                            this.show();
                                        })
                                        //Keyboard.dismiss();
                                    }}
                                    value={mm}
                                    baseColor = {(mm)? colorTitle : '#C4C4C4'}
                                    //pickerStyle={[getMarginLeft(4), getWidthnHeight(42), getMarginTop(10)]}
                                    fontSize = {(mm)? fontSizeH4().fontSize + 2 : fontSizeH4().fontSize}
                                />
                            </View>
                            <View style={[{
                                borderColor: '#C4C4C4', justifyContent: 'center', borderRadius: getWidthnHeight(1).width,
                                borderWidth: 1,
                            }, getWidthnHeight(42, 6.5)]}>
                                <Dropdown
                                    containerStyle={[{textOverflow:'hidden', borderColor: '#C4C4C4', borderWidth: 0}, getWidthnHeight(42), getMarginTop(-1)]}
                                    inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getWidthnHeight(42)]}
                                    label={'Year'}
                                    labelFontSize={fontSizeH4().fontSize - 3}
                                    labelTextStyle={[getMarginLeft(1.5), getMarginTop(0)]}
                                    data={yearList}
                                    valueExtractor={({id})=> id}
                                    labelExtractor={({name})=> name}
                                    onChangeText={(id, index, data) => {
                                        this.setState({
                                            Year: data[index]['name'],
                                            data: []
                                        }, () => {
                                            this.show();
                                        })
                                        //Keyboard.dismiss();
                                    }}
                                    value={yyyy}
                                    baseColor = {(yyyy)? colorTitle : '#C4C4C4'}
                                    //pickerStyle={[getMarginLeft(4), getWidthnHeight(42), getMarginTop(10)]}
                                    fontSize = {(yyyy)? fontSizeH4().fontSize + 2 : fontSizeH4().fontSize}
                                />
                            </View>
                        </View>
                        {/* <TouchableOpacity style={[getMarginTop(2)]} onPress={()=>this.show()}>
                            <View style={[{backgroundColor: COLOR1, borderRadius: 5, alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(25, 5)]}>
                                <Text style={{color:'white'}}>Search</Text>
                            </View>
                        </TouchableOpacity> */}
                        <View style={[{flexDirection: 'row', justifyContent: 'space-evenly'}, getMarginVertical(2), getWidthnHeight(92)]}>
                            {t.map((item, index) => {
                                return (
                                    <>
                                        <View style={[{
                                        width: getWidthnHeight(20).width, height: getWidthnHeight(20).width, backgroundColor: presentColor,
                                        borderRadius: getWidthnHeight(2).width, alignItems: 'center', justifyContent: 'center' 
                                        }]}>
                                            {(loading) ? (
                                                <ActivityIndicator size="small" color={'white'}/>
                                            )
                                            :
                                                <Text style={[{color: 'white'}, fontSizeH2()]}>{item.Present}</Text>
                                            }
                                            <Text style={[{color: 'white'}, fontSizeH4()]}>PRESENT</Text>
                                        </View>
                                        <View style={[{
                                        width: getWidthnHeight(20).width, height: getWidthnHeight(20).width, backgroundColor: absentColor,
                                        borderRadius: getWidthnHeight(2).width, alignItems: 'center', justifyContent: 'center'
                                        }]}>
                                            {(loading) ? (
                                                <ActivityIndicator size="small" color={'white'}/>
                                            )
                                            :
                                                <Text style={[{color: 'white'}, fontSizeH2()]}>{item.Absent}</Text>
                                            }
                                            <Text style={[{color: 'white'}, fontSizeH4()]}>ABSENT</Text>
                                        </View>
                                        <View style={[{
                                        width: getWidthnHeight(20).width, height: getWidthnHeight(20).width, backgroundColor: leaveColor,
                                        borderRadius: getWidthnHeight(2).width, alignItems: 'center', justifyContent: 'center'
                                        }]}>
                                            {(loading) ? (
                                                <ActivityIndicator size="small" color={'white'}/>
                                            )
                                            :
                                                <Text style={[{color: 'white'}, fontSizeH2()]}>{item.Leave}</Text>
                                            }
                                            <Text style={[{color: 'white'}, fontSizeH4()]}>LEAVE</Text>
                                        </View>
                                        <View style={[{
                                        width: getWidthnHeight(20).width, height: getWidthnHeight(20).width, backgroundColor: holidayColor,
                                        borderRadius: getWidthnHeight(2).width, alignItems: 'center', justifyContent: 'center'
                                        }]}>
                                            {(loading) ? (
                                                <ActivityIndicator size="small" color={'white'}/>
                                            )
                                            :
                                                <Text style={[{color: 'white'}, fontSizeH2()]}>{item.Holiday}</Text>
                                            }
                                            <Text style={[{color: 'white'}, fontSizeH4()]}>HOLIDAY</Text>
                                        </View>
                                    </>
                                );
                            })
                            }
                        </View>
                        <CommonModal 
                            title="Something went wrong"
                            subtitle= {`Error Code: ${errorCode}${apiCode}`}
                            visible={this.state.commonModal}
                            onDecline={this.onDecline.bind(this)}
                            buttonColor={['#0E57CF', '#25A2F9']}
                        />
                        <View style={{alignItems: 'center'}}>
                            <View style={[{alignItems: 'center'}]}>
                                <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: '#6867AC', borderRadius: 3}, getWidthnHeight(90), getMarginBottom(0.5)]}>
                                    <View style={[{alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(20, 3)]}>
                                        <Text style={[{borderColor: 'black', borderWidth: 0, textAlign: 'center', color: 'white'}, fontSizeH4()]}>DATE</Text>
                                    </View>
                                    <View style={[{alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(undefined, 3)]}>
                                        <Text style={[{borderColor: 'black', borderWidth: 0, textAlign: 'center', color: 'white'}, fontSizeH4()]}> </Text>
                                    </View>
                                    <View style={[{alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(27.5, 3)]}>
                                        <Text style={[{borderColor: 'black', borderWidth: 0, textAlign: 'center', color: 'white'}, fontSizeH4()]}>FIRST PUNCH</Text>
                                    </View>
                                    <View style={[{alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(27.5, 3)]}>
                                        <Text style={[{borderColor: 'black', borderWidth: 0, textAlign: 'center', color: 'white'}, fontSizeH4()]}>LAST PUNCH</Text>
                                    </View>
                                </View>
                                {(data.length > 0) && (
                                    <View style={[getWidthnHeight(90, 40), {alignItems: 'center', borderColor: 'black', borderWidth: 0}]}>
                                        <FlatList 
                                            data={data}
                                            keyExtractor={(item) => item.id}
                                            renderItem={this.renderItem}
                                        />
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                    <View 
                        style={[{
                        backgroundColor: (loading)? 'rgba(0, 0, 0, 0.5)' : 'transparent', alignItems: 'center', justifyContent: 'center'
                        }, StyleSheet.absoluteFill]} 
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
    }
});

export default (monthlyreport);