import React from 'react';
import {
    StyleSheet, Text, TouchableOpacity,
    View, ScrollView, FlatList,
    TouchableHighlight, TextInput,
    KeyboardAvoidingView, Animated, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-material-dropdown';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import EditClaim from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import {
    CommonModal, IOS_StatusBar, getMarginTop, getMarginBottom, getWidthnHeight,fontSizeH4, Spinner,
    FloatingTitleTextInputField, getMarginVertical, DateSelector, WaveHeader, fontSizeH3, ItineraryModal, statusBarGradient,
    TimePicker, RoundButton, RadioEnable, RadioDisable, AlertBox, DismissKeyboard, getMarginLeft, Date, MySwitch, getMarginRight, getMarginHorizontal
} from '../KulbirComponents/common';
import {extractBaseURL} from '../api/BaseURL';
const AnimateTextInput = Animated.createAnimatedComponent(TextInput);
const AnimateTouch = Animated.createAnimatedComponent(TouchableOpacity);

export default class Travel_Approvals extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchText:'',
            empty: true,
            placeholder: 'Employee Name/Travel Code',
            show: true,
            showbox: true,
            showsubmitbtn:false,
            opid:'',
            opacity:1,
            backstatus:'',
            full:true,
            baseURL: null,
            animateDropDownWidth: new Animated.Value(0),
            animatedWidth: new Animated.Value(0),
            animatedHeight: new Animated.Value(0),
            iconalign: new Animated.Value(0),
            animateOpacity: new Animated.Value(1),
            animateTextInputWidth: new Animated.Value(0),
            animateTextInputHeight: new Animated.Value(0),
            animatedlistHeight: new Animated.Value(0),
            animatedlistWidth: new Animated.Value(0),
            animateCommentWidth: new Animated.Value(0),
            animateSubmitButton: new Animated.Value(0),
            animateBoxOpacity: new Animated.Value(0),
            travelPreApprovalRole: [],
            travelClaimRole: [],
            loggedUserID: null,
            status: 'New',
            dropDownState: false,
            imprest: [],
            loading: false,
            alertTitle: '',
            alertColor: false,
            apiError: false,
            errorCode: null,
            apiCode: null,
            enableAlert: false,
            secretToken: null
        };
        this.props.navigation.setOptions({
            title: 'Imprest Requests'
        })
    }

    showLoader(){
        this.setState({loading: true})
    }

    hideLoader(){
        this.setState({loading: false})
    }

    async componentDidMount(){ 
        const {navigation} = this.props;
        this._unsubscribe = navigation.addListener("focus", async() => {
            var user_token= await AsyncStorage.getItem('user_token');
            var permissions_fir= JSON.parse(user_token);
            var token = permissions_fir.success.secret_token;
            await extractBaseURL().then((baseURL) => {
                this.setState({baseURL, secretToken: token}, () => this.apicall())
            });
        })
    }
    
    UNSAFE_componentWillUnmount(){
        this._unsubscribe();
    }

    animate_DropdownWidth(){
        const {animateDropDownWidth} = this.state;
        Animated.timing(animateDropDownWidth, {
            toValue: 1,
            duration: 1000
        }).start()
    }

    async apicall(){
        const {baseURL, secretToken} = this.state;
        this.showLoader();
        axios.post(`${baseURL}/travel/imprest-list`,
        {
            filter_status: this.state.status.toLowerCase(),
        },
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${secretToken}`, 
            }
        }).then((response) => {
            const parsedData = response.data;
            this.hideLoader();
            this.setState({imprest: parsedData.data.imprest_list})
        }).catch((error) => {
            this.hideLoader();
            console.log("ERROR: ", error)
            if(error.response){
                const status = error.response.status;
                this.enableModal(status, '141')
            }else{
                alert(`${error}, API CODE: 141`)
            }
        })
    }

    reload=()=>{
        this.setState({imprest:[]})
        this.apicall()
    }
 
    /* To Animate Open Search Bar On click*/
    /******/
    animatedBox = () => {
        this.setState({show:false}, () => {
            const {animatedHeight, animatedWidth, iconalign, animateOpacity, animateTextInputWidth, animateTextInputHeight} = this.state;
            Animated.timing(animatedWidth, {
                toValue: getWidthnHeight(85).width,
                duration: 700
            }).start()
            Animated.timing(animatedHeight, {
                toValue: getWidthnHeight(undefined, 5).height,
                duration: 10
            }).start()
            Animated.timing(animateTextInputWidth, {
                toValue: getWidthnHeight(65).width,
                duration: 700
            }).start()
            Animated.timing(animateTextInputHeight, {
                toValue: getWidthnHeight(undefined, 4.9).height,
                duration: 10
            }).start()
            Animated.timing(animateOpacity, {
                toValue: 1,
                duration: 30
            }).start()
            Animated.timing(iconalign, {
                toValue: getMarginLeft(0).marginLeft,
                duration: 700
            }).start()
        })
    }

    /* To Animate Open Status Box On click*/
    /******/

    animatedlistbox =(status, id)=>{
        this.setState({
            backstatus:status, showsubmitbtn:true
            }, () => {
                this.state.DATA.forEach(element => {
                if(element.id === id && element.swipe === true){
                element.show = true
                this.setState({opid:selectedid, showbox: false}, () => this.listbox())
                }
            });
        })
    }

    listbox =()=>{
        const {animatedlistWidth, animateCommentWidth, animateSubmitButton, animateBoxOpacity} = this.state;
        console.log("@@@ ENTERED LISTBOX")
        Animated.parallel([
            Animated.timing(animatedlistWidth, {
                toValue: 1,
                duration: 800
            }),
            Animated.timing(animateCommentWidth, {
                toValue: 1,
                duration: 800
            }),
            Animated.timing(animateSubmitButton, {
              toValue: 1,
              duration: 300
            }),
            Animated.timing(animateBoxOpacity, {
              toValue: 1,
              duration: 50
            })
        ]).start()
    }

    /******/

    /* To Animate Hide Search Box On click*/
    /******/
    hideshow=()=>{
        const {animatedHeight, animatedWidth, iconalign, animateOpacity, animateTextInputWidth, animateTextInputHeight} = this.state;
        Animated.timing(animatedWidth, {
            toValue: 0,
            duration: 300
        }).start()
        Animated.timing(animatedHeight, {
            toValue: 0,
            duration: 300
        }).start()
        Animated.timing(animateTextInputWidth, {
            toValue: 0,
            duration: 300
        }).start()
        Animated.timing(animateTextInputHeight, {
            toValue: 0,
            duration: 300
        }).start()
        Animated.timing(animateOpacity, {
            toValue: 0,
            duration: 300
        }).start()
        Animated.timing(iconalign, {
            toValue: 0,
            duration: 300
        }).start(() => this.setState({show:true, placeholder: 'Employee Name/Claim Code', searchText: '', empty: true}))
    }
    /******/

    /* To Animate Hide Status Box On click*/
    /******/

    opacitybox = (id) => {
        this.state.DATA.forEach(element => {
            if(element.id === id){
                element.show = false
                this.listclose()
            //this.close(id);
            }
        });
    }

    listclose = () => {
        const {animatedlistWidth, animateCommentWidth, animateSubmitButton, animateBoxOpacity} = this.state;
        Animated.parallel([
          Animated.timing(animatedlistWidth, {
              toValue: 0,
              duration: 400
          }),
          Animated.timing(animateCommentWidth, {
              toValue: 0,
              duration: 400
          }),
          Animated.timing(animateSubmitButton, {
              toValue: 0,
              duration: 400
          }),
          Animated.timing(animateBoxOpacity, {
              toValue: 0,
              duration: 400
          })
        ]).start(() => this.setState({opid:selectedid}));
    }
    /******/

    open = (item) => {
        global.selectedid = ' '
    }

    close = (id) => {
        //this.renderLeftActions().close
    }

    set = (id) => {
        this.state.DATA.forEach(element => {
            if(element.id === id){
                element.swipe = true
            }
        });
    }

    onPress=()=>{
        const newData = this.arrayholder.filter((item)=>{
            return item.id.match(this.state.searchtext);
        })
        this.setState({ DATA: newData});
    }
  
    ondrop=()=>{
        const newData = this.arrayholder.filter((item)=>{
            return item.status === this.state.status
        }).filter((item)=>{
            return item.id.match(this.state.searchtext);
        })
        this.setState({ DATA: newData });
    }

    searchName(empArray, searchName, callBack){
        let isNum = /^\d+$/.test(searchName);
        console.log("Search Result: ", typeof isNum, isNum)
        let filterNames = empArray;
        let splitArray = [];
        if(!isNum){
            splitArray = searchName.toLowerCase().split('');
            console.log("THIS IS STRING: ", typeof searchName, searchName)
        }else if(isNum){
            splitArray = (searchName.split(''));
            console.log("THIS IS NUMBER: ", typeof searchName, searchName)
        }
        const searchLength = splitArray.length;
        let data = [];
        for(let i = 0; i <= filterNames.length - 1; i++){
            let empName = null;
            let splitEmpName = [];
            if(!isNum){
                empName = filterNames[i]['travel']['user']['employee']['fullname'];
                splitEmpName = empName.toLowerCase().split(''); 
            }else if(isNum){
                empName = (filterNames[i]['travel']['travel_code']);
                splitEmpName = empName.split('');
            }
            for(let j = 0; j < searchLength; j++){
                if(splitArray[j] !== splitEmpName[j]){
                    console.log("$$$$$ BREAK $$$$$")
                    break;
                }
                if(j === searchLength - 1 && splitArray[searchLength - 1] === splitEmpName[searchLength - 1]){
                    data.push(filterNames[i])
                }
            }
            if((i === filterNames.length - 1) && (data.length > 0)){
                callBack(data);
            }
        }
    }

    multipleCards(){
        const {searchText, imprest, empty} = this.state;
        let claimArray = imprest;
        let data = [];
        if(searchText){
            this.searchName(claimArray, searchText, (dataArray) => {
                if(dataArray !== [] && dataArray !== null && dataArray.length !== null && dataArray.length > 0){
                    data = dataArray;
                    console.log("%%%%% TEST ARRAY: ", data.length)
                    //this.setState({filterData: dataArray}, () => console.log("%%%%% TEST ARRAY: ", this.state.filterData.length))
                }
            })
        }
        if(data.length === 0 && empty === false){
            return (
            <View style={[{alignItems: 'center'}, getMarginTop(15)]}>
                <Text style={{color: 'grey', fontSize: fontSizeH4().fontSize + 7}}>No data available</Text>
            </View>
            );
        }else if(data !== [] && data !== null && data.length !== null && data.length > 0 && empty === false){
            return (
                <View>
                    <FlatList
                        data={data}
                        initialNumToRender = {5}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.id}
                    />
                </View>
            );
        }
        else if(empty){
            const {scrollY} = this.state;
            return (
                <View>
                    <Animated.FlatList
                        data={this.state.imprest}
                        initialNumToRender = {5}
                        renderItem={this.renderItem.bind(this)}
                        keyExtractor={item => item.id}
                    />
                </View>
            )
        }
    }

    async travelRequestDetails(travelID, screen = null, status){
        const {baseURL} = this.state;
        console.log("TRAVEL ID: ", travelID)
        this.showLoader();
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_four=permissions_fir.success.secret_token;
        axios.get(`${baseURL}/travel/approval-request-details/${travelID}`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+ permissions_four, 
            }
        }).then((response) => {
            this.hideLoader();
            const parsedData = (response.data)
            this.setState({changeTravelID: null})
            const leadData = parsedData.data.lead;
            //console.log("^^^###%%% TRAVEL DETAIL: ", parsedData.data.approval);
            if(status === 'new'){
                this.props.navigation.navigate('PayImprest', {
                    data: parsedData.data.approval, 
                    flag: parsedData.data.form_flag, 
                    lead: (leadData.length === 1)? leadData[0]['name'] : null,
                    imprest: parsedData.data.imprest_paid_by
                })
            }else{
                this.props.navigation.navigate('View_Travel', {
                    data: parsedData.data.approval, 
                    flag: parsedData.data.form_flag, 
                    lead: (leadData.length === 1)? leadData[0]['name'] : null,
                    imprest: parsedData.data.imprest_paid_by
                })
            }
        }).catch((error) => {
            this.hideLoader()
            if(error.response){
                const status = error.response.status;
                this.enableModal(status, '142')
            }else{
                alert(`${error}, API CODE: 142`)
            }
        })
    }

    enableModal(status, apiCode){
        this.setState({errorCode: status})
        this.setState({apiCode})
        this.setState({apiError: true})
    }

    renderItem = ({ item, index }) => {
        //console.log("!!!!!!!!!!! ", item)
        return(
        <Animated.View style={[{alignItems: 'center', borderWidth: 0, borderColor: 'red', justifyContent: 'center'}, getWidthnHeight(100, 13), getMarginVertical(1)]}>
            <View style={[styles.flatlistcontainer]}>
                <View style={[styles.triangleCorner]}/>
                <View style = {[{ transform: [{ rotate: '0deg' }], alignItems: 'center', position: 'absolute'}, getMarginLeft(1), getMarginTop(0)]}>
                    <Text style={[{fontSize: (fontSizeH4().fontSize), color:'white', borderColor: 'black', borderWidth: 0}]}>{(index < 9)? `0${index + 1}` : index + 1}</Text>                
                </View>
                <View style={[{borderWidth: 0, borderColor: 'red', position: 'absolute'}, getWidthnHeight(91), getMarginTop(0.5)]}>
                    <View style={[{flexDirection:'row', borderWidth: 0, borderColor: 'red', justifyContent: 'space-between'}]}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style = {[{borderWidth: 0, borderColor: 'red'}, getWidthnHeight(60), getMarginLeft(10)]}>
                            <Text style={[{borderWidth: 0, borderColor: 'red', color:'#3180E5', fontSize: (fontSizeH4().fontSize + 1) }]}>
                                {item.travel.user.employee.fullname.replace(/^\w/, (c) => c.toUpperCase())}
                            </Text>
                        </ScrollView>
                        <View style={[getMarginHorizontal(2)]}>
                            {(item.status === 'New'.toLowerCase()) && 
                                <View style={[{borderWidth:0, borderRadius:5, backgroundColor:'#00B7DB', justifyContent:'center'}, getWidthnHeight(undefined,3), getMarginTop(0)]}>
                                    <Text style={[{color:'#ffffff', paddingHorizontal:10, fontStyle:'italic'}, fontSizeH4()]}>{item.status.replace(/^\w/, (c) => c.toUpperCase())}</Text>
                                </View>
                            }
                            {(item.status === 'Paid'.toLowerCase()) && 
                                <View style={[{borderWidth:0, borderRadius:5, backgroundColor:'#0BB051', justifyContent:'center'}, getWidthnHeight(undefined,3), getMarginTop(0)]}>
                                    <Text style={[{color:'#ffffff', paddingHorizontal:10, fontStyle:'italic'}, fontSizeH4()]}>{item.status.replace(/^\w/, (c) => c.toUpperCase())}</Text>
                                </View>
                            }
                        </View>
                    </View>
                </View>
                <View style ={[{flexDirection:'row', borderWidth: 0, borderColor: 'black'},getMarginLeft(6), getWidthnHeight(80), getMarginTop(-0.5)]}>
                    <FontAwesomeIcons name='caret-right' size={getWidthnHeight(5).width} color={'#3280E4'}/>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{justifyContent: 'center'}} style={[getWidthnHeight(80), {borderWidth: 0, borderColor: 'red'}]}>
                        <Text style={[{fontSize: (fontSizeH4().fontSize + 1), borderWidth: 0, borderColor: 'red'}, getMarginLeft(2)]}>{item.remarks_by_applicant.replace(/^\w/, (c) => c.toUpperCase())}</Text>
                    </ScrollView>  
                </View>
                
                <View style = {[{alignItems:'flex-start', justifyContent: 'space-between', flexDirection:'row', borderColor: 'green', borderWidth: 0,}, getMarginLeft(6), getMarginTop(0.5)]}>
                    <View style= {[{flexDirection:'row', borderColor: 'black', borderWidth: 0, alignItems: 'center'}]}>
                        <Text style = {[{color:'#565656', fontWeight:'bold'}, styles.boldFont ,fontSizeH4()]}>TC: </Text>
                        <View style={{backgroundColor:'#DAE7F7'}}>
                            <Text style = {[{fontWeight:'bold', fontStyle:'italic',fontSize: (fontSizeH4().fontSize)}, styles.boldFont]}> {item.travel.travel_code} </Text>
                        </View>
                        <View>
                            <Text style = {[{color:'#565656', fontWeight:'bold', fontSize:(fontSizeH4().fontSize + 7)}, styles.boldFont, getMarginTop(-1), getMarginHorizontal(3.5)]}>|</Text>
                        </View>
                        <Text style = {[{color:'#565656', fontWeight:'bold'}, styles.boldFont ,fontSizeH4()]}>Amount: </Text>
                        <View style={{backgroundColor:'#DAE7F7'}}>
                            <Text style = {[{fontWeight:'bold', fontStyle:'italic',fontSize: (fontSizeH4().fontSize)}]}> {`${"\u20B9"} ${item.amount}/-`} </Text>
                        </View>
                    </View>
                </View>
                <View pointerEvents="box-none" style={[{justifyContent: "flex-end"}, StyleSheet.absoluteFill]}>
                    <View style= {[{
                        flexDirection:'row', borderColor: 'red', borderWidth: 0,
                        justifyContent: 'flex-end',
                        }, getMarginBottom(0.5)
                    ]}>
                        {(item.status === 'new') &&
                            <View style={[getMarginRight(2)]}>
                                <TouchableHighlight underlayColor="#3280E4" onPress={() => this.travelRequestDetails(item.travel_id, null, item.status)}
                                    style={{
                                        width: getWidthnHeight(10).width,height: getWidthnHeight(6).width,borderRadius: (getWidthnHeight(7).width/2),
                                        borderWidth:0, backgroundColor:'black', justifyContent:'center',marginRight:getMarginRight(0).marginRight}}>
                                    <View style={[{alignItems: 'center'}, getMarginTop(0)]}>   
                                        <Text style={[{color: 'white', fontSize: (fontSizeH4().fontSize - 2)}]}>Pay</Text>
                                    </View> 
                                </TouchableHighlight>
                            </View>
                        }
                        {(item.status === 'paid') &&
                            <View style={[getMarginHorizontal(2)]}>
                                <TouchableHighlight underlayColor="#3280E4" onPress= {() => {
                                    this.setState({viewAPI: true, requestChange: false}, () => {
                                        this.travelRequestDetails(item.travel_id, null, item.status)
                                    })
                                }} 
                                    style={[{
                                        width: getWidthnHeight(7).width,height: getWidthnHeight(7).width,borderRadius: (getWidthnHeight(7).width/2), 
                                        borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center'}]}>
                                    <View style={[{alignItems:'center'}]}>   
                                        <FontAwesomeIcons name='eye' size={getWidthnHeight(4).width}/>
                                    </View> 
                                </TouchableHighlight>
                            </View>
                        }
                    </View>
                </View>
            </View>
        </Animated.View>
        )
    };

    render() {
        const {
            animatedWidth, animatedHeight, iconalign, animateOpacity, animateTextInputWidth, animateTextInputHeight,
            animateDropDownWidth, dropDownState, loading} = this.state;
        const animatedStyle = { width: animatedWidth}
        const animateTextInput = {width: animateTextInputWidth, height: animateTextInputHeight}
        const iconmargin = {marginLeft: iconalign}
        const interpolateOpacity = animateOpacity.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
        })
        const hideOpacity = {
            opacity: interpolateOpacity
        }
        let filter_status =[
            {
                value: 'New'
            }, 
            {
                value: 'Paid',
            }
        ];
        console.log('### ^^^WIDTH: ', animateTextInput, animatedStyle)
        return (
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style = {styles.container}>
                <IOS_StatusBar color={statusBarGradient} barStyle="light-content"/>
                {/* <WaveHeader
                    wave={Platform.OS ==="ios" ? false : false} 
                    //logo={require('../Image/Logo-164.png')}
                    menu='white'
                    title='Imprest Requests'
                    headerType = {'small'}
                    //version={`Version ${this.state.deviceVersion}`}
                />  */}
                <View style={[{alignItems:'center'}, getMarginTop(0)]}>
                    <View style={[{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'}, getMarginTop(1), getWidthnHeight(100)]}>
                        <View style={[{flexDirection:'row', alignItems: 'center', justifyContent: 'center', transform:[{translateX: getMarginLeft(0).marginLeft}]}, getWidthnHeight(50)]}>
                            <View
                                style={{
                                    width: getWidthnHeight(10).width,height: getWidthnHeight(6).width,borderRadius: (getWidthnHeight(7).width/2),
                                    borderWidth:0, backgroundColor:'black', justifyContent:'center',marginRight:getMarginRight(0).marginRight}}>
                                <View style={[{alignItems: 'center'}, getMarginTop(0)]}>   
                                    <Text style={[{color: 'white', fontSize: (fontSizeH4().fontSize - 2)}]}>Pay</Text>
                                </View> 
                            </View>
                            <Text style={{textAlignVertical: 'center', paddingLeft: 10}}>Pay Imprest</Text>
                        </View>
                        <View style={[{height: getWidthnHeight(6).width, backgroundColor: 'black', width: 1}]}/>
                        <View style={[{flexDirection:'row', alignItems: 'center', justifyContent: 'center', transform:[{translateX: getMarginLeft(0).marginLeft}]}, getWidthnHeight(50)]}>
                            <View style={[{
                                width: getWidthnHeight(7).width,height: getWidthnHeight(7).width,borderRadius: (getWidthnHeight(7).width/2), 
                                borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center'}]}>
                                <View style={[{alignItems:'center'}]}>   
                                    <FontAwesomeIcons name='eye' size={getWidthnHeight(4).width}/>
                                </View> 
                            </View>
                            <Text style={{textAlignVertical: 'center', paddingLeft: 10}}>View Travel</Text>
                        </View>
                    </View>
                </View>
                <View style={[styles.MainContainer, getMarginTop(1)]}>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <View style = {[{flexDirection:'row', justifyContent: 'space-between', alignItems: 'center'}, getWidthnHeight(90), getMarginTop(3)]} >
                            <View style={[{borderColor: '#C4C4C4', borderWidth: 1}, getWidthnHeight(90)]}>
                                <Dropdown
                                    containerStyle={[{
                                    justifyContent: 'center', borderColor: '#C4C4C4', borderWidth: 0, paddingHorizontal: 10
                                    }, getMarginTop(-1)]}
                                    //  maxLength = {12}
                                    inputContainerStyle={[{borderBottomWidth:0, marginTop:0}]}
                                    label={'Request Type'}
                                    data={filter_status}
                                    value={this.state.status}
                                    onChangeText={status => this.setState({ status }, this.reload)}
                                    baseColor = {(this.state.status == '')? 'grey': '#0B8EE8' }
                                    pickerStyle={[{borderWidth: 0,}]}
                                    //dropdownOffset={{ 'top': 25 }}
                                    fontSize = {fontSizeH4().fontSize + 0.5}
                                />
                            </View>
                        </View>  
                        <DismissKeyboard>
                            <View style={[{alignItems:'center',justifyContent:'center'}, getWidthnHeight(100, 5), getMarginTop(2)]}>
                                {(this.state.show)?
                                    <TouchableOpacity activeOpacity={0.8} style = {[{backgroundColor:'white',width: '25%', borderColor: 'red', borderWidth: 0},styles.Ancontainer]} onPress = {this.animatedBox}>  
                                        <Animated.View style={[{elevation: 5, shadowColor: 'black', shadowOpacity: 0.4, shadowOffset: {width: 0, height: 0}, shadowRadius: 3, width: getWidthnHeight(9).width,height: getWidthnHeight(9).width, borderRadius: getWidthnHeight(9).width, borderWidth:0, backgroundColor:'white', justifyContent:'center'}, iconmargin]}>
                                            <Animated.View style={[{alignItems:'center'}]}>   
                                                <FontAwesomeIcons name='search' size={getWidthnHeight(5).width} color={'#3181E2'}/>
                                            </Animated.View>
                                        </Animated.View>
                                    </TouchableOpacity>
                                :
                                    <View style={[{justifyContent: 'center'}, getMarginTop(0)]}>
                                        <Animated.View style={[{flexDirection: 'row', borderColor: '#DBE8F8', borderWidth: 1, borderRadius: 50, justifyContent: 'space-around', alignItems: 'center'}, animatedStyle, hideOpacity]}>
                                            <View style ={[getWidthnHeight(5), getMarginLeft(2)]}>
                                                <TouchableOpacity onPress = {this.hideshow}>
                                                    <FontAwesomeIcons name='close' size={getWidthnHeight(5).width} color={'#C4C4C4'}/>
                                                </TouchableOpacity>
                                            </View> 
                                            <AnimateTextInput
                                                placeholder={this.state.placeholder}
                                                onFocus={() => this.setState({placeholder: ''})}
                                                onBlur = {() => this.setState({placeholder: 'Employee Name/Travel Code'})}
                                                onChangeText={(searchText) => {
                                                    this.setState({searchText})
                                                    if(searchText === ''){
                                                        this.setState({empty: true})
                                                    }else{
                                                        this.setState({empty: false})
                                                    }
                                                }}   
                                                value={this.state.searchText}
                                                backgroundColor='white'
                                                style= {[{paddingLeft:10,borderWidth:0, borderColor:'#DBE8F8', borderRadius:50, padding:10, justifyContent: 'center'}, animateTextInput, fontSizeH4()]}
                                            />  
                                            <TouchableOpacity activeOpacity={1} style = {[{backgroundColor:'white'},styles.Ancontainer,]}>  
                                                <Animated.View style={[{width: getWidthnHeight(9).width,height: getWidthnHeight(9).width, borderRadius: getWidthnHeight(9).width, borderWidth:0, borderColor: 'red', backgroundColor:'#3280E4', justifyContent:'center'}, iconmargin]}>
                                                    <Animated.View style={[{alignItems:'center'}]}>   
                                                        <FontAwesomeIcons name='search' size={getWidthnHeight(5).width} color={'white'}/>
                                                    </Animated.View>
                                                </Animated.View>
                                            </TouchableOpacity>
                                        </Animated.View>
                                    </View>
                                }
                            </View>  
                        </DismissKeyboard>
                        {(this.state.imprest.length > 0) ? 
                            <View style={{flex: 1}}>
                                <View style={[getWidthnHeight(100), getMarginTop(1)]}>
                                    {this.multipleCards()} 
                                </View>
                            </View>
                        :
                            <View style={[getMarginTop(15)]}>
                                
                            </View>
                        } 
                    </View>
                    <View 
                        style={[{backgroundColor: (loading)? 'rgba(0, 0, 0, 0.5)' : 'transparent', borderTopLeftRadius: 40,
                        borderTopRightRadius: 40}, StyleSheet.absoluteFill]} 
                        pointerEvents={(loading)? 'auto' : 'none'}
                    >
                        {(loading) &&
                            <Spinner loading={loading} style={[styles.loadingStyle, getWidthnHeight(45, 10)]} color='rgb(19,111,232)'/>
                        }
                    </View>
                </View>
            </View>
            </KeyboardAvoidingView>
            )
        }
    }

    const styles = StyleSheet.create({
        container: {
            justifyContent: 'center',
            backgroundColor: '#F5FCFF',
            height:'100%'
        },
        MainContainer:{
            flex: 1,
            alignItems: 'center',
            backgroundColor:'white',
            borderTopLeftRadius:40,
            borderTopRightRadius:40,
            ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: {
                width: 0,
                height: 50,
                },
                zIndex: 10
            },
            android: {
                elevation: 15,
            }
            }),
            shadowOpacity: 0.3,
            shadowRadius: 40,
        },
        Dropbox:{
            borderWidth: 1,
            left:0,
            width:getWidthnHeight(45).width,
            justifyContent: 'center',
            alignItems: 'center',
            color: 'black',
            borderColor: '#C4C4C4',
            marginTop:getMarginTop(1.5).marginTop
        },
        rectangletriangleCorner: {
            width: getWidthnHeight(42).width,
            height: 0,
            backgroundColor: "transparent",
            borderStyle: "solid",
            borderRightWidth: 23,
            borderTopWidth: 40,
            borderRightColor: "transparent",
            borderTopColor: "#307FE4",
        },
        flatlistcontainer:{
            width:getWidthnHeight(91).width,
            height:getWidthnHeight(undefined,12.5).height,
            backgroundColor: '#FFFFFF',
            borderWidth:0,
            borderColor: '#C4C4C4',
            //justifyContent: 'center',
            //marginVertical:getMarginTop(1.5).marginTop,
            ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: {
                    width: 0,
                    height: 50,
                },
                zIndex: 10
            },
            android: {
                elevation: 13,
            }
            }),
            shadowOpacity: 0.3,
            shadowRadius: 40,
            borderColor: 'black',
            borderWidth: 0
        }, 
        triangleCorner: {
            width: 0,
            height: 0,
            backgroundColor: "transparent",
            borderStyle: "solid",
            borderRightWidth: 40,
            borderTopWidth: 40,
            borderRightColor: "transparent",
            borderTopColor: "#307FE4",
        }, 
        Ancontainer: {
            justifyContent: 'center',
            alignItems: 'center'
        },
        box: {
            backgroundColor: 'white',
            width: 0,
            height: 0,
            justifyContent:"center",
            borderRadius:50,
            borderWidth:0,
            borderColor:'#DBE8F8'
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
    });
