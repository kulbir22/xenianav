import React from 'react';
import {
    StyleSheet, Text, TouchableOpacity,
    View, ScrollView, FlatList,
    TouchableHighlight, TextInput,
    KeyboardAvoidingView, Animated, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Dropdown } from 'react-native-material-dropdown';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import ViewClaim from 'react-native-vector-icons/MaterialCommunityIcons';
import EditClaim from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import {
    CommonModal, IOS_StatusBar, getMarginTop, getMarginBottom, getWidthnHeight,fontSizeH4, Spinner,
    getMarginVertical, DateSelector, WaveHeader, fontSizeH3, ItineraryModal, statusBarGradient,
    DismissKeyboard, getMarginLeft, Date, MySwitch, getMarginRight, getMarginHorizontal
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
            placeholder: 'Employee Name/Claim Code',
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
            list_type: 'All',
            dropDownState: false,
            claims: [],
            loading: false,
            alertTitle: '',
            alertColor: false,
            apiError: false,
            errorCode: null,
            apiCode: null,
            enableAlert: false,
        };
        this.props.navigation.setOptions({
            title: 'Claim Requests'
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
            await extractBaseURL().then((baseURL) => {
                this.setState({baseURL}, () => this.apicall())
            })
        })
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        const travelPreApprovalRole = permissions_fir.success.travel_pre_approval_role;
        const travelClaimRole = permissions_fir.success.travel_claim_role
        this.setState({travelPreApprovalRole, travelClaimRole,
            loggedUserID: permissions_fir.success.user.id
        }, () => {
            if(this.state.travelClaimRole.length > 0){
                this.setState({dropDownState: true}, () => {
                    this.animate_DropdownWidth();
                })
            }
        })
        console.log("TRAVEL PRE APPROVAL : ", permissions_fir.success.user.id)
    }
    
    componentWillUnmount(){
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
        const {baseURL, dropDownState, list_type, status} = this.state;
        this.showLoader();
        const listType = (dropDownState)? list_type : 'Created';
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_four=permissions_fir.success.secret_token;
        axios.post(`${baseURL}/travel/claim-requests`,
        {
            filter_status: (status === 'SendBack')? 'back' : status.toLowerCase(),
            list_type: listType.toLowerCase()
        },
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+ permissions_four, 
            }
        }).then((response) => {
            const parsedData = response.data;
            this.hideLoader();
            this.setState({claims: parsedData.data.claims}, () => console.log("^^^ @@@ claim:", this.state.claims))
        }).catch((error) => {
            this.hideLoader();
            console.log("ERROR: ", error)
            if(error.response){
                const status = error.response.status;
                this.enableModal(status, '138')
            }else{
                alert(`${error}, API CODE: 138`)
            }
        })
    }

    reload=()=>{
        this.setState({claims:[]})
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
                toValue: getWidthnHeight(undefined, 4.8).height,
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
                empName = filterNames[i]['user']['employee']['fullname'];
                splitEmpName = empName.toLowerCase().split(''); 
            }else if(isNum){
                empName = (filterNames[i]['claim_code']);
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
        const {searchText, claims, empty} = this.state;
        let claimArray = claims;
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
                        data={this.state.claims}
                        initialNumToRender = {5}
                        renderItem={this.renderItem.bind(this)}
                        keyExtractor={item => item.id}
                    />
                </View>
            )
        }
    }

    async claimRequestDetails(claimID){
        const {baseURL, viewAPI} = this.state;
        console.log("CLAIM ID: ", claimID)
        this.showLoader();
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_four=permissions_fir.success.secret_token;
        axios.get(`${baseURL}/travel/claim-view/${claimID}`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+ permissions_four, 
            }
        }).then((response) => {
            this.hideLoader();
            const parsedData = (response.data)
            //console.log("^^^###%%% CLAIM DETAIL: ", parsedData.data);
            this.props.navigation.navigate('View_claim', {claim: parsedData.data, manager: parsedData.manager})
        }).catch((error) => {
            this.hideLoader()
            if(error.response){
                const status = error.response.status;
                this.enableModal(status, '139')
            }else{
                alert(`${error}, API CODE: 139`)
            }
        })
    }

    enableModal(status, apiCode){
        this.setState({errorCode: status})
        this.setState({apiCode})
        this.setState({apiError: true})
    }

    async editClaim(claimID){
        const {baseURL} = this.state;
        console.log("CLAIM ID: ", claimID)
        this.showLoader();
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_four=permissions_fir.success.secret_token;
        axios.get(`${baseURL}/travel/claim-form-edit/${claimID}`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+ permissions_four, 
            }
        }).then((response) => {
            this.hideLoader();
            const parsedData = (response.data)
            const leadData = parsedData.data.lead;
            //console.log("^^^###%%% CLAIM DETAIL: ", parsedData.data);
            this.props.navigation.navigate('Edit_Claim_Form', {details: parsedData.data, lead: (leadData.length === 1)? leadData[0]['name'] : null})
        }).catch((error) => {
            this.hideLoader()
            if(error.response){
                const status = error.response.status;
                this.enableModal(status, '140')
            }else{
                alert(`${error}, API CODE: 140`)
            }
        })
    }

    renderItem = ({ item, index }) => {
        //console.log("!!!!!!!!!!! ", item)
        const {loggedUserID} = this.state;
        // const inputRange = [
        //     -1,
        //     0,
        //     ITEM_SIZE * index,
        //     ITEM_SIZE * (index + 1)
        // ]
        // const scale = scrollY.interpolate({
        //     inputRange,
        //     outputRange: [1, 1, 1, 0]
        // })
        // const opacityInputRange = [
        //     -1,
        //     0,
        //     ITEM_SIZE * index,
        //     ITEM_SIZE * (index + 1)
        // ]
        // const opacity = scrollY.interpolate({
        //     inputRange: opacityInputRange,
        //     outputRange: [1, 1, 1, 0]
        // })
        return(
        <Animated.View style={[{alignItems: 'center', borderWidth: 0, borderColor: 'red', justifyContent: 'center'}, getWidthnHeight(100, 13), getMarginVertical(1)]}>
            <View style={[styles.flatlistcontainer]}>
            <View style={{flex: 1}}>
                <View style={[styles.triangleCorner]}/>
                <View style = {[{ transform: [{ rotate: '0deg' }], alignItems: 'center', position: 'absolute'}, getMarginLeft(1), getMarginTop(0)]}>
                    <Text style={[{fontSize: (fontSizeH4().fontSize), color:'white', borderColor: 'black', borderWidth: 0}]}>{(index < 9)? `0${index + 1}` : index + 1}</Text>                
                </View>
                <View style={[{borderWidth: 0, borderColor: 'red', position: 'absolute'}, getWidthnHeight(91), getMarginTop(0.5)]}>
                    <View style={[{flexDirection:'row', borderWidth: 0, borderColor: 'red', justifyContent: 'space-between'}]}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style = {[{borderWidth: 0, borderColor: 'red'}, getWidthnHeight(60), getMarginLeft(10)]}>
                            <Text style={[{color:'#3180E5', fontWeight:'500', fontSize: (fontSizeH4().fontSize + 1) }, styles.boldFont, getMarginTop(0), getMarginLeft(0)]}>{item.user.employee.fullname.replace(/^\w/, (c) => c.toUpperCase())}</Text>
                        </ScrollView>
                        <View style={[getMarginHorizontal(2)]}>
                            {(item.status === 'Approved'.toLowerCase())?
                                <View style={[{borderWidth:0, borderRadius:5, backgroundColor:'#0BB051', justifyContent:'center'}, getWidthnHeight(undefined,3), getMarginTop(0)]}>
                                    <Text style={[{color:'#ffffff', paddingHorizontal:10, paddingVertical:1, fontStyle:'italic'}, fontSizeH4()]}>{item.status.replace(/^\w/, (c) => c.toUpperCase())}</Text>
                                </View>
                            :
                                (item.status === 'Discarded'.toLowerCase())?
                                    <View style={[{borderWidth:0, borderRadius:5, backgroundColor:'#EB3A32', justifyContent:'center'}, getWidthnHeight(undefined,3), getMarginTop(0)]}>
                                        <Text style={[{color:'#ffffff', paddingHorizontal:10, paddingVertical:1, fontStyle:'italic'}, fontSizeH4()]}>{item.status.replace(/^\w/, (c) => c.toUpperCase())}</Text>
                                    </View>
                                :
                                    (item.status === 'New'.toLowerCase())?
                                        <View style={[{borderWidth:0, borderRadius:5, backgroundColor:'#00B7DB', justifyContent:'center'}, getWidthnHeight(undefined,3), getMarginTop(0)]}>
                                            <Text style={[{color:'#ffffff', paddingHorizontal:10, paddingVertical:1, fontStyle:'italic'}, fontSizeH4()]}>{item.status.replace(/^\w/, (c) => c.toUpperCase())}</Text>
                                        </View>:
                                        (item.status === 'Back'.toLowerCase())?
                                        <View style={[{borderWidth:0, borderRadius:5, backgroundColor:'#DE9222', justifyContent:'center'}, getWidthnHeight(undefined,3), getMarginTop(0)]}>
                                            <Text style={[{color:'#ffffff', paddingHorizontal:10, paddingVertical:1, fontStyle:'italic'}, fontSizeH4()]}>{'sendback'.replace(/^\w/, (c) => c.toUpperCase())}</Text>
                                        </View>:
                                            <View style={[{borderWidth:0, borderRadius:5, backgroundColor:'#0BB051', justifyContent:'center'}, getWidthnHeight(undefined,3), getMarginTop(0)]}>
                                                <Text style={[{color:'#ffffff', paddingHorizontal:10, paddingVertical:1, fontStyle:'italic'}, fontSizeH4()]}>{item.status.replace(/^\w/, (c) => c.toUpperCase())}</Text>
                                            </View>
                            }
                        </View>
                    </View>
                </View>
                <View style ={[{flexDirection:'row', borderWidth: 0, borderColor: 'black'},getMarginLeft(6), getWidthnHeight(80), getMarginTop(-0.5)]}>
                    <FontAwesomeIcons name='caret-right' size={getWidthnHeight(5).width} color={'#3280E4'}/>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[getWidthnHeight(80)]}>
                        <Text style={[{fontWeight:'bold', fontSize: (fontSizeH4().fontSize + 1), borderWidth: 0, borderColor: 'red'}, styles.boldFont, getMarginLeft(2)]}>{item.travel.travel_purpose.replace(/^\w/, (c) => c.toUpperCase())}</Text>
                    </ScrollView>  
                </View>
                
                <View style = {[{alignItems:'flex-start', justifyContent: 'space-between', flexDirection:'row', borderColor: 'green', borderWidth: 0,}, getMarginLeft(6), getMarginTop(0.5)]}>
                    <View style= {[{flexDirection:'row', borderColor: 'black', borderWidth: 0, alignItems: 'center'}]}>
                        <Text style = {[{color:'#565656', fontWeight:'600'} ,fontSizeH4()]}>TC: </Text>
                        <View style={{backgroundColor:'#DAE7F7'}}>
                            <Text style = {[{fontWeight:'600', fontStyle:'italic',fontSize: (fontSizeH4().fontSize - 1)}]}> {item.travel.travel_code} </Text>
                        </View>
                        <View>
                            <Text style = {[{color:'#565656', fontWeight:'bold', fontSize:(fontSizeH4().fontSize + 7)}, getMarginTop(-1), getMarginHorizontal(3.5)]}>|</Text>
                        </View>
                        <Text style = {[{color:'#565656', fontWeight:'600'} ,fontSizeH4()]}>CC: </Text>
                        <View style={{backgroundColor:'#DAE7F7'}}>
                            <Text style = {[{fontWeight:'600', fontStyle:'italic',fontSize: (fontSizeH4().fontSize - 1)}]}> {item.claim_code} </Text>
                        </View>
                    </View>
                </View>
            </View>
                <View pointerEvents="box-none" style={[{justifyContent: "flex-end"}, StyleSheet.absoluteFill]}>
                    <View style= {[{
                        flexDirection:'row', borderColor: 'red', borderWidth: 0,
                        justifyContent: 'flex-end',
                        }, getMarginBottom(0.4)
                    ]}>
                        <View style={[getMarginRight(2)]}>
                            <TouchableHighlight underlayColor="#3280E4" onPress={() => this.claimRequestDetails(item.id)}
                                style={{
                                    width: getWidthnHeight(7).width,height: getWidthnHeight(7).width,borderRadius: (getWidthnHeight(7).width/2),
                                    borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center',marginRight:getMarginRight(0).marginRight}}>
                                <View style={[{alignItems: 'center'}, getMarginTop(0)]}>   
                                    <ViewClaim name='eye-check' size={getWidthnHeight(5).width}/>
                                </View> 
                            </TouchableHighlight>
                        </View>
                        {(item.claims !== null && item.status === 'back' && (loggedUserID === item.user_id)) && 
                            <View style={[getMarginRight(2)]}>
                                <TouchableHighlight underlayColor="#3280E4" onPress={() => this.editClaim(item.id)}
                                    style={{
                                        width: getWidthnHeight(7).width,height: getWidthnHeight(7).width,borderRadius: (getWidthnHeight(7).width/2),
                                        borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center',marginRight:getMarginRight(0).marginRight}}>
                                    <View style={[{alignItems: 'center'}, getMarginTop(0)]}>   
                                        <EditClaim name='database-edit' size={getWidthnHeight(5).width}/>
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
        const animateRequestType = {
            width: animateDropDownWidth.interpolate({
                inputRange: [0, 1],
                outputRange: [getWidthnHeight(90).width, getWidthnHeight(43).width]
            }),
            height: getWidthnHeight(undefined, 7).height
        }
        const animateListType = {
            width: animateDropDownWidth.interpolate({
                inputRange: [0, 1],
                outputRange: [0, getWidthnHeight(43).width]
            }),
            height: getWidthnHeight(undefined, 7).height
        }
        let list_type = [
            {
                value: 'Created',
            }, 
            {
                value: 'All',
            }
        ];
        let filter_status =[
            {
                value: 'New'
            }, 
            {
                value: 'SendBack',
            }, 
            {
                value: 'Approved',
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
                        title='Travel Claim Requests'
                        headerType = {'small'}
                        //version={`Version ${this.state.deviceVersion}`}
                />  */}
                <View style={[{alignItems:'center'}, getMarginTop(0)]}>
                    <View style={[{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'}, getMarginTop(1), getWidthnHeight(100)]}>
                        <View style={[{flexDirection:'row', alignItems: 'center', justifyContent: 'center', transform:[{translateX: getMarginLeft(0).marginLeft}]}, getWidthnHeight(50)]}>
                            <View style={[{
                                width: getWidthnHeight(7).width,height: getWidthnHeight(7).width,borderRadius: (getWidthnHeight(7).width/2),
                                borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center', alignItems: 'center'}]}>
                                <ViewClaim name='eye-check' size={getWidthnHeight(5).width}/>
                            </View>
                            <Text style={{textAlignVertical: 'center', paddingLeft: 10}}>View Claim</Text>
                        </View>
                        <View style={[{height: getWidthnHeight(6).width, backgroundColor: 'black', width: 1}]}/>
                        <View style={[{flexDirection:'row', alignItems: 'center', justifyContent: 'center', transform:[{translateX: getMarginLeft(0).marginLeft}]}, getWidthnHeight(50)]}>
                            <View style={{
                                width: getWidthnHeight(7).width,height: getWidthnHeight(7).width,borderRadius: (getWidthnHeight(7).width/2),
                                borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center', alignItems: 'center'}}>
                                <EditClaim name='database-edit' size={getWidthnHeight(5).width}/>
                            </View>
                            <Text style={{textAlignVertical: 'center', paddingLeft: 10}}>Edit Claim</Text>
                        </View>
                    </View>
                </View>
                <View style={[styles.MainContainer, getMarginTop(1)]}>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <View style = {[{flexDirection:'row', justifyContent: 'space-between', alignItems: 'center'}, getWidthnHeight(90), getMarginTop(3)]} >
                            <Animated.View style={[{borderColor: '#C4C4C4', borderWidth: 1}, animateRequestType]}>
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
                            </Animated.View>  
                            {(dropDownState) && 
                                <Animated.View style = {[{borderColor: '#C4C4C4', borderWidth: 1}, animateListType]}>
                                    <Dropdown
                                        containerStyle={[{
                                        borderColor: '#C4C4C4', borderWidth: 0, paddingHorizontal: 10
                                        }, getMarginTop(-1)]}
                                        inputContainerStyle={[{borderBottomWidth:0, marginTop:0}]}
                                        label={'List Type'}
                                        data={list_type}
                                        value={this.state.list_type}
                                        onChangeText={list_type => this.setState({ list_type }, this.reload)}
                                        baseColor = {(this.state.list_type == '')? 'grey': '#0B8EE8' }
                                        pickerStyle={[{borderWidth: 0}]}
                                        //dropdownOffset={{ 'top': 25 }}
                                        fontSize = {fontSizeH4().fontSize + 0.5}
                                    />         
                                </Animated.View>
                            }  
                        </View>  
                        <DismissKeyboard>
                            <View style={[{alignItems:'center',justifyContent:'center'}, getWidthnHeight(100, 5), getMarginTop(2)]}>
                                {(this.state.show)?
                                    <TouchableOpacity style = {[{backgroundColor:'white',width: '25%', borderColor: 'red', borderWidth: 0},styles.Ancontainer]} onPress = {this.animatedBox}>  
                                        <Animated.View style={[{elevation: 5, shadowColor: 'black', shadowOpacity: 0.4, shadowOffset: {width: 0, height: 0}, shadowRadius: 3, width: getWidthnHeight(9).width,height: getWidthnHeight(9).width, borderRadius: getWidthnHeight(9).width, borderWidth:0, backgroundColor:'white', justifyContent:'center'}, iconmargin]}>
                                            <Animated.View style={[{alignItems:'center'}]}>   
                                                <FontAwesomeIcons name='search' size={getWidthnHeight(5).width} color={'#3181E2'}/>
                                            </Animated.View>
                                        </Animated.View>
                                    </TouchableOpacity>
                                :
                                    <View style={[getMarginTop(0)]}>
                                        <Animated.View style={[{flexDirection: 'row', borderColor: '#DBE8F8', borderWidth: 1, borderRadius: 50, justifyContent: 'space-around', alignItems: 'center'}, animatedStyle, hideOpacity]}>
                                            <View style ={[getWidthnHeight(5), getMarginLeft(2)]}>
                                                <TouchableOpacity onPress = {this.hideshow}>
                                                    <FontAwesomeIcons name='close' size={getWidthnHeight(5).width} color={'#C4C4C4'}/>
                                                </TouchableOpacity>
                                            </View> 
                                            <AnimateTextInput
                                                placeholder={this.state.placeholder}
                                                onFocus={() => this.setState({placeholder: ''})}
                                                onBlur = {() => this.setState({placeholder: 'Employee Name/Claim Code'})}
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
                                                style= {[{paddingLeft:10,borderWidth:0, borderColor:'#DBE8F8', borderRadius:50, padding:10}, animateTextInput, fontSizeH4()]}
                                            />  
                                            <TouchableOpacity style = {[{backgroundColor:'white'},styles.Ancontainer,]} onPress = {this.animatedBox}>  
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
                        {(this.state.claims.length > 0) ? 
                            <View style={{flex: 1}}>
                                <View style={[getWidthnHeight(100), getMarginTop(1)]}>
                                    {this.multipleCards()} 
                                </View>
                            </View>
                        :
                            <View style={[getMarginTop(15)]}>
                                <Text style={{color: 'grey', fontSize: fontSizeH4().fontSize + 7}}>No data available</Text>
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
