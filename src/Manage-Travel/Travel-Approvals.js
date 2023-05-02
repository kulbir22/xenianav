import React from 'react';
import {
    StyleSheet,Text,TouchableOpacity,
    View,Alert,ScrollView,FlatList,
    TouchableHighlight,TouchableWithoutFeedback,
    TextInput,Animated,
    LayoutAnimation, Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Dropdown } from 'react-native-material-dropdown';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import RequestChange from 'react-native-vector-icons/MaterialIcons';
import ViewClaim from 'react-native-vector-icons/MaterialCommunityIcons';
import ClaimForm from 'react-native-vector-icons/MaterialCommunityIcons';
import EditClaim from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    IOS_StatusBar, getMarginTop, getMarginBottom, getWidthnHeight,fontSizeH4, Spinner,
    WaveHeader, fontSizeH3, AlertBox, DismissKeyboard, getMarginLeft, getMarginRight,
    TravelApprovalModal, TravelApprovalInfo, getMarginHorizontal, getMarginVertical,
    statusBarGradient
} from '../KulbirComponents/common';
import {extractBaseURL} from '../api/BaseURL';

const AnimateTextInput = Animated.createAnimatedComponent(TextInput);

const CustomAnimation = {
    duration: 100,
    create: {
        type: LayoutAnimation.Types.easeIn,
        property: LayoutAnimation.Properties.scaleXY,
        springDamping: 1.5
    }
}

const modalColor = '#1079D5';
const ITEM_SIZE = (getWidthnHeight(undefined, 12.5).height + (getMarginVertical(1).marginVertical * 2));

    export default class Travel_Approvals extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchText:'',
            status:'New',
            list_type:'All',
            placeholder:'Employee Name/Travel Code',
            loading: false,
            show: true,
            baseURL:null,
            approvals:[],
            visibleloader: true,
            modalVisible: true,
            animatedWidth: new Animated.Value(0),
            animatedHeight: new Animated.Value(0),
            animateTextInputWidth: new Animated.Value(0),
            animateTextInputHeight: new Animated.Value(0),
            iconalign: new Animated.Value(0),
            animateOpacity: new Animated.Value(1),
            travelPreApprovalRole: [],
            travelClaimRole: [],
            animateDropDownWidth: new Animated.Value(0),
            dropDownState: false,
            filterData: [],
            empty: true,
            travelDetails: null,
            enableAlert: false,
            alertTitle: '',
            alertColor: false,
            apiError: false,
            errorCode: null,
            apiCode: null,
            viewAPI: true,
            requestChange: false,
            changeTravelID: null,
            loggedUserID: null,
            slideAnimationDialog: false,
            animatedContainer: new Animated.Value(0),
            visible: false,
            started: false,
            scrollY: new Animated.Value(0)
        };
        this.arrayholder = [];
        this.props.navigation.setOptions({
            title: 'Travel Approvals'
        })
    }

    //   componentWillMount = () => {
    //     this.animatedWidth = new Animated.Value(0)
    //     this.animatedHeight = new Animated.Value(0)
    //     this.iconaling = new Animated.Value(0)
    //     this.borderanimated = new Animated.Value(0)
    //     this.iconmargintop = new Animated.Value(0)
    //     this.animation = new Animated.Value(0)
    //  }

    UNSAFE_componentWillUpdate(){
        LayoutAnimation.configureNext(CustomAnimation)
    }

    async componentDidMount(){ 
        const { navigation } = this.props;
        this.unsubscribe = navigation.addListener("focus", async() => {
            // console.log("### TRAVEL FOCUS : ", navigation)
            await extractBaseURL().then((baseURL) => {
                this.setState({baseURL}, () => {
                    this.apicall()
                })
            })
        })
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        const travelPreApprovalRole = permissions_fir.success.travel_pre_approval_role;
        const travelClaimRole = permissions_fir.success.travel_claim_role
        this.setState({travelPreApprovalRole, travelClaimRole,
            loggedUserID: permissions_fir.success.user.id
        }, () => {
            if(this.state.travelPreApprovalRole.length > 0){
                this.setState({dropDownState: true}, () => {
                    this.animate_DropdownWidth();
                })
            }
        })
    }
    
    componentWillUnmount(){
        this.unsubscribe();
    }

    animate_DropdownWidth(){
        const {animateDropDownWidth} = this.state;
        Animated.timing(animateDropDownWidth, {
            toValue: 1,
            duration: 1000
        }).start()
    }

    showLoader(){
        this.setState({loading: true})
    }

    hideLoader(){
        this.setState({loading: false})
    }

    async apicall(){
        const {baseURL, dropDownState, list_type} = this.state;
        this.showLoader();
        const listType = (dropDownState)? list_type : 'Created';
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_four=permissions_fir.success.secret_token;
        axios.post(`${baseURL}/travel/approval-requests`,
        {
            filter_status: this.state.status.toLowerCase(),
            list_type: listType.toLowerCase()
        },
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+ permissions_four, 
            }
        }).then((response) => {
            const parsedData = response.data;
            //console.log("^^^ @@@ travel_code:",parsedData);
            this.hideLoader();
            this.setState({approvals: parsedData.data.approvals})
            this.arrayholder = parsedData.data.approvals
        }).catch((error) => {
            this.hideLoader();
            console.log("@@@ ERROR: ", error)
            if(error.response){
                const status = error.response.status;
                this.enableModal(status, '114')
            }else{
                alert(`${error}, API CODE: 114`)
            }
        })
    }

    async travelRequestDetails(travelID, screen = null){
        const {baseURL, viewAPI} = this.state;
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
            const parsedData = (response.data)
            this.setState({changeTravelID: null})
            const leadData = parsedData.data.lead;
            console.log("^^^###%%% TRAVEL DETAIL: ", parsedData.data.approval);
            const imprestPaidBy = parsedData.data.imprest_paid_by;
            if(viewAPI){
                this.props.navigation.navigate('View_Travel', {
                    data: parsedData.data.approval, 
                    flag: parsedData.data.form_flag, 
                    lead: (leadData.length === 1)? leadData[0]['name'] : null,
                    imprest: (imprestPaidBy)
                })
            }else{
                this.props.navigation.navigate('EditTravel', {data: parsedData.data, screen: screen})
            }
            this.hideLoader()
        }).catch((error) => {
            this.hideLoader()
            if(error.response){
                console.log("ERROR: ", error.response)
                const status = error.response.status;
                this.enableModal(status, '115')
            }else{
                alert(`${error}, API CODE: 115`)
            }
        })
    }

    async requestChangeFunction(){
        const {baseURL, changeTravelID} = this.state;
        console.log("TRAVEL ID: ", changeTravelID)
        this.showLoader();
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_four=permissions_fir.success.secret_token;
        axios.post(`${baseURL}/travel/change-request`,
        {
            id: changeTravelID 
        },
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+ permissions_four, 
            }
        }).then((response) => {
            this.hideLoader();
            console.log("@@@ ### $$$ REQUEST CHANGE SUCCESS: ", response);
            this.travelRequestDetails(changeTravelID, this.props.route.name);
        }).catch((error) => {
            this.hideLoader()
            if(error.response){
                const status = error.response.status;
                this.enableModal(status, '116')
            }else{
                alert(`${error}, API CODE: 116`)
            }
        })
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
            console.log("^^^###%%% CLAIM DETAIL: ", parsedData);
            this.props.navigation.navigate('View_claim', {claim: parsedData.data, manager: parsedData.manager})
        }).catch((error) => {
            this.hideLoader();
            console.log("CLAIM ERROR: ", error, error.response)
            if(error.response){
                const status = error.response.status;
                this.enableModal(status, '117')
            }else{
                alert(`${error}, API CODE: 117`)
            }
        })
    }

    async claimForm(travelID){
        const {baseURL, viewAPI} = this.state;
        console.log("TRAVEL ID: ", travelID)
        this.showLoader();
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_four=permissions_fir.success.secret_token;
        axios.get(`${baseURL}/travel/claim-form/${travelID}`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+ permissions_four, 
            }
        }).then((response) => {
            this.hideLoader();
            const parsedData = (response.data)
            const leadData = parsedData.data.lead;
            this.props.navigation.navigate('Claim_Form_Travel', {
                details: parsedData.data,
                lead: (leadData.length === 1)? leadData[0]['name'] : null
            })
        }).catch((error) => {
            this.hideLoader()
            if(error.response){
                const status = error.response.status;
                this.enableModal(status, '118')
            }else{
                alert(`${error}, API CODE: 118`)
            }
        })
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
                this.enableModal(status, '119');
            }else{
                alert(`${error}, API CODE: 119`)
            }
        })
    }

    enableModal(status, apiCode){
        this.setState({errorCode: status})
        this.setState({apiCode})
        this.setState({apiError: true})
    }

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
        }).start(() => this.setState({show:true, searchText: '', placeholder: 'Employee Name/Travel Code', empty: true}))
    }

    onPress=()=>{
        const newData = this.arrayholder.filter((item)=>{
            return String(item.travel_code).match(this.state.searchtext) || item.user.employee.fullname.toLowerCase().match(this.state.searchtext.toLowerCase());
        })
        this.setState({
        approvals: newData
        });
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
                empName = (filterNames[i]['travel_code']);
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
            const {searchText, approvals, empty} = this.state;
            let travelArray = approvals;
            let data = [];
            if(searchText){
                this.searchName(travelArray, searchText, (dataArray) => {
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
                const {scrollY} = this.state;
                return (
                    <View>
                        <FlatList
                            data={data}
                            initialNumToRender = {5}
                            renderItem={this.renderItem.bind(this)}
                            keyExtractor={item => item.id}
                        />
                    </View>
                );
            }
            else if(empty){
                const {scrollY} = this.state;
                return (
                    <View>
                        <FlatList
                            data={this.state.approvals}
                            initialNumToRender = {5}
                            renderItem={this.renderItem.bind(this)}
                            keyExtractor={item => item.id}
                        />
                    </View>
                )
            }
        }
    
    ondrop=()=>{
        this.setState({approvals:[]})
        this.setState({modalVisible: true})
        this.apicall()
    }

    renderItem = ({ item, index }) => {
        //console.log("!!!!!!!!!!! ", item)
        const {loggedUserID} = this.state;
        return(
        <View style={[{alignItems: 'center', borderWidth: 0, borderColor: 'red', justifyContent: 'center'}]}>
            <Animated.View style={[styles.flatlistcontainer, getMarginVertical(1), {borderColor: 'red', borderWidth: 0}]}>
                <View style={{flex: 1}}>
                    <View style={[styles.triangleCorner]}/>
                    <View style = {[{ transform: [{ rotate: '0deg' }], alignItems: 'center', position: 'absolute'}, getMarginLeft(1), getMarginTop(0)]}>
                        <Text style={[{fontSize: (fontSizeH4().fontSize), color:'white', borderColor: 'black', borderWidth: 0}]}>{(index < 9)? `0${index + 1}` : index + 1}</Text>                
                    </View>
                    <View style={[{borderWidth: 0, borderColor: 'red', position: 'absolute'}, getWidthnHeight(91), getMarginTop(0.5)]}>
                        <View style={[{flexDirection:'row', borderWidth: 0, borderColor: 'red', justifyContent: 'space-between'}]}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style = {[{borderWidth: 0, borderColor: 'red'}, getWidthnHeight(60), getMarginLeft(10)]}>
                                <Text style={[{color:'#3180E5', fontWeight:'500', fontSize: (fontSizeH4().fontSize + 1) }, getWidthnHeight(60), getMarginTop(0), getMarginLeft(0)]}>{item.user.employee.fullname.replace(/^\w/, (c) => c.toUpperCase())}</Text>
                            </ScrollView>
                            <View style={[getMarginHorizontal(2)]}>
                                {(item.status === 'Approved'.toLowerCase())?
                                    <View style={[{borderWidth:0, borderRadius:5, backgroundColor:'#029D01', justifyContent:'center'}, getWidthnHeight(undefined,3), getMarginTop(0)]}>
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
                                            <View style={[{borderWidth:0, borderRadius:5, backgroundColor:'#DE9222', justifyContent:'center'}, getWidthnHeight(undefined,3), getMarginTop(0)]}>
                                                <Text style={[{color:'#ffffff', paddingHorizontal:10, paddingVertical:1, fontStyle:'italic'}, fontSizeH4()]}>{item.status.replace(/^\w/, (c) => c.toUpperCase())}</Text>
                                            </View>
                                }
                            </View>
                        </View>
                    </View>
                    <View style ={[{flexDirection:'row'},getMarginLeft(6), getWidthnHeight(80), getMarginTop(-0.6)]}>
                        <FontAwesomeIcons name='caret-right' size={getWidthnHeight(5).width} color={'#3280E4'}/>  
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[getWidthnHeight(80)]}>
                            <Text style={[{fontWeight:'bold', fontSize: (fontSizeH4().fontSize + 1), borderWidth: 0, borderColor: 'red'}, styles.boldFont]}>{item.travel_purpose.replace(/^\w/, (c) => c.toUpperCase())}</Text>
                        </ScrollView> 
                    </View>
                    
                    <View style = {[{alignItems:'flex-start', justifyContent: 'space-between', flexDirection:'row', borderColor: 'green', borderWidth: 0,}, getMarginLeft(6), getMarginTop(0.5)]}>
                        <View style= {[{flexDirection:'row', borderColor: 'black', borderWidth: 0, alignItems: 'center'}]}>
                            <Text style = {[{color:'#565656', fontWeight:'600'} ,fontSizeH4()]}>TC: </Text>
                            <View style={{backgroundColor:'#DAE7F7'}}>
                                <Text style = {[{fontWeight:'600', fontStyle:'italic',fontSize: (fontSizeH4().fontSize - 1)}]}> {item.travel_code} </Text>
                            </View>
                            <View>
                                <Text style = {[{color:'#565656', fontWeight:'bold', fontSize:(fontSizeH4().fontSize + 7)}, getMarginTop(-1), getMarginLeft(3.5)]}>|</Text>
                            </View>
                            <Text style = {[{color:'#565656', fontWeight:'600'},fontSizeH4(),getMarginLeft(3.5)]}>Amount: </Text>
                            <View style = {[]}>
                                <View style={[{backgroundColor:'#367FE6'}]}>
                                    <Text style = {[{color:'#fff', fontWeight:'600', fontStyle:'italic',fontSize:(fontSizeH4().fontSize - 1)}, styles.boldFont]}> {`${"\u20B9"} ${item.total_amount}/-`} </Text>
                                </View>
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
                        <View style={[getMarginHorizontal(2)]}>
                            <TouchableHighlight underlayColor="#3280E4" onPress= {() => {
                                this.setState({viewAPI: true, requestChange: false}, () => {
                                    this.travelRequestDetails(item.id)
                                })
                            }} 
                                style={[{
                                    width: getWidthnHeight(7).width,height: getWidthnHeight(7).width,borderRadius: (getWidthnHeight(7).width/2), 
                                    borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center'}, (loggedUserID === item.user_id)? null : getMarginRight(0)]}>
                                <View style={[{alignItems:'center'}]}>   
                                    <FontAwesomeIcons name='eye' size={getWidthnHeight(4).width}/>
                                </View> 
                            </TouchableHighlight>
                        </View>
                        {(loggedUserID === item.user_id) && (item.travel_climber.length === 0 && item.claims === null) &&
                            <View style={[getMarginRight(2)]}>
                                <TouchableHighlight underlayColor="#3280E4" onPress= {() => {
                                    this.setState({viewAPI: false}, () => {
                                        this.travelRequestDetails(item.id)
                                    })
                                }}  
                                    style={{
                                        width: getWidthnHeight(7).width,height: getWidthnHeight(7).width,borderRadius: (getWidthnHeight(7).width/2),
                                        borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center',marginRight:getMarginRight(0).marginRight}}>
                                    <View style={[{alignItems: 'center'}, getMarginTop(0.6)]}>   
                                        <FontAwesomeIcons name='edit' size={getWidthnHeight(4).width}/>
                                    </View> 
                                </TouchableHighlight>
                            </View>
                        }
                        {(loggedUserID === item.user_id && item.status === 'approved' && item.claims === null && (item.imprest_request === 0 || (item.imprest_request === 1 && item.imprest.status === 'paid'))) &&
                            <View style={[getMarginRight(2)]}>
                                <TouchableHighlight underlayColor="#3280E4" onPress= {() => this.claimForm(item.id)}  
                                    style={{
                                        width: getWidthnHeight(7).width,height: getWidthnHeight(7).width,borderRadius: (getWidthnHeight(7).width/2),
                                        borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center',marginRight:getMarginRight(0).marginRight}}>
                                    <View style={[{alignItems: 'center'}, getMarginTop(0)]}>   
                                        <ClaimForm name='view-carousel-outline' size={getWidthnHeight(5).width}/>
                                    </View> 
                                </TouchableHighlight>
                            </View>
                        }
                        {(loggedUserID === item.user_id) && (item.travel_climber.length > 0 && item.claims === null) &&
                            <View style={[getMarginRight(2)]}>
                                <TouchableHighlight underlayColor="#3280E4" onPress= {() => {
                                    this.setState({viewAPI: false, requestChange: true, changeTravelID: item.id}, () => {
                                        //this.travelRequestDetails(item.id, false)
                                    })
                                }}  
                                    style={{
                                        width: getWidthnHeight(7).width,height: getWidthnHeight(7).width,borderRadius: (getWidthnHeight(7).width/2),
                                        borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center',marginRight:getMarginRight(0).marginRight}}>
                                    <View style={[{alignItems: 'center'}, getMarginTop(0)]}>   
                                        <RequestChange name='sync' size={getWidthnHeight(5).width}/>
                                    </View> 
                                </TouchableHighlight>
                            </View>
                        }
                        {(item.status === 'approved' && item.claims !== null && item.claims.status !== 'back') && 
                            <View style={[getMarginRight(2)]}>
                                <TouchableHighlight underlayColor="#3280E4" onPress={() => this.claimRequestDetails(item.claims.id)}
                                    style={{
                                        width: getWidthnHeight(7).width,height: getWidthnHeight(7).width,borderRadius: (getWidthnHeight(7).width/2),
                                        borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center',marginRight:getMarginRight(0).marginRight}}>
                                    <View style={[{alignItems: 'center'}, getMarginTop(0)]}>   
                                        <ViewClaim name='eye-check' size={getWidthnHeight(5).width}/>
                                    </View> 
                                </TouchableHighlight>
                            </View>
                        }
                        {(item.status === 'approved' && item.claims !== null && item.claims.status === 'back') && 
                            <View style={[getMarginRight(2)]}>
                                <TouchableHighlight underlayColor="#3280E4" onPress={() => this.editClaim(item.claims.id)}
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
            </Animated.View>
        </View>
        )
    };

    startAnimation(){
        const {animatedContainer} = this.state;
        Animated.timing(animatedContainer, {
            toValue: 1,
            duration: 500
        }).start(() => this.setState({started: true}))
    }

    resetAnimation(){
        const {animatedContainer} = this.state;
        Animated.timing(animatedContainer, {
            toValue: 0,
            duration: 500
        }).start(() => this.setState({started: false}))
    }

    render() {
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
                value:'New'
            }, 
            {
                value: 'Discussion',
            }, 
            {
                value: 'Discarded',
            }, 
            {
                value: 'Approved',
            }
        ];
        const {
            animatedWidth, animatedHeight, iconalign, animateOpacity, animateTextInputWidth, 
            animateTextInputHeight, travelPreApprovalRole, travelClaimRole, dropDownState,
            animateDropDownWidth, loading, errorCode, apiCode, apiError, requestChange,
            slideAnimationDialog, animatedContainer, visible, started
        } = this.state;

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
        const animatedIcons = {
            transform: [
                {
                    scale: animatedContainer.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1]
                    })
                }
            ],
            // opacity: animatedContainer.interpolate({
            //     inputRange: [0, 1],
            //     outputRange: [0, 1]
            // }),
            // height: animatedContainer.interpolate({
            //     inputRange: [0, 1],
            //     outputRange: [0, getWidthnHeight(undefined, 12).height]
            // })
        }
        const animatedContainerStyle = {
            marginTop: animatedContainer.interpolate({
                inputRange: [0, 1],
                outputRange: [getMarginTop(-14).marginTop, 0]
            }),
        }
        const rotateIcon = {
            transform: [
                {
                    rotateX: animatedContainer.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '180deg']
                    })
                }
            ]
        }
        console.log(this.state.approvals.length)

        return (
            <View style = {styles.container}>
                <View>
                    <IOS_StatusBar color={statusBarGradient} barStyle="light-content"/>
                    {/* <WaveHeader
                        wave={Platform.OS ==="ios" ? false : false} 
                        //logo={require('../Image/Logo-164.png')}
                        menu='white'
                        title='Travel Approval Listing'
                        headerType = {'small'}
                        //version={`Version ${this.state.deviceVersion}`}
                    /> */}
                </View>
                {(this.state.apiError)?
                    <AlertBox 
                        title={'Something went wrong'}
                        subtitle={`Error Code: ${errorCode}${apiCode}`}
                        visible={this.state.apiError}
                        onDecline={() => this.setState({apiError: false})}
                        titleStyle={{color: 'black'}}
                        color={false}
                    />
                :
                    null
                }
                <Animated.View style={[{alignItems:'center', borderColor: 'red', borderWidth: 0}, getMarginVertical(1.5), fontSizeH3(), animatedIcons]}>
                    <View style={[{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'}, getWidthnHeight(100)]}>
                        <View style={[{flexDirection:'row', alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(50)]}>
                            <View style={{
                                width: getWidthnHeight(7).width,height: getWidthnHeight(7).width,borderRadius: (getWidthnHeight(7).width/2),
                                borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center', alignItems: 'center'}}>
                                <FontAwesomeIcons name='eye' size={getWidthnHeight(4).width}/>
                            </View>
                            <Text style={{textAlignVertical: 'center', paddingLeft: 10}}>View Request</Text>
                        </View>
                        <View style={[{height: getWidthnHeight(6).width, backgroundColor: 'black', width: 1}]}/>
                        <View style={[{flexDirection:'row', alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(50)]}>
                            <View style={{
                                width: getWidthnHeight(7).width,height: getWidthnHeight(7).width,borderRadius: (getWidthnHeight(7).width/2),
                                borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center', alignItems: 'center'}}>
                                <RequestChange name='sync' size={getWidthnHeight(5).width}/>
                            </View>
                            <Text style={{textAlignVertical: 'center', paddingLeft: 10}}>Request Change</Text>
                        </View>
                    </View>
                    <View style={[{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'}, getMarginTop(1), getWidthnHeight(100)]}>
                        <View style={[{flexDirection:'row', alignItems: 'center', justifyContent: 'center', transform:[{translateX: getMarginLeft(-1.5).marginLeft}]}, getWidthnHeight(50)]}>
                            <View style={[{
                                width: getWidthnHeight(7).width,height: getWidthnHeight(7).width,borderRadius: (getWidthnHeight(7).width/2),
                                borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center', alignItems: 'center'}]}>
                                <ViewClaim name='eye-check' size={getWidthnHeight(5).width}/>
                            </View>
                            <Text style={{textAlignVertical: 'center', paddingLeft: 10}}>View Claim</Text>
                        </View>
                        <View style={[{height: getWidthnHeight(6).width, backgroundColor: 'black', width: 1}]}/>
                        <View style={[{flexDirection:'row', alignItems: 'center', justifyContent: 'center', transform:[{translateX: getMarginLeft(-2.5).marginLeft}]}, getWidthnHeight(50)]}>
                            <View style={[{
                                width: getWidthnHeight(7).width,height: getWidthnHeight(7).width,borderRadius: (getWidthnHeight(7).width/2),
                                borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center', alignItems: 'center'}]}>
                                <FontAwesomeIcons name='edit' size={getWidthnHeight(4).width} style={[getMarginTop(0.5)]}/>
                            </View>
                            <Text style={{textAlignVertical: 'center', paddingLeft: 10}}>Edit Request</Text>
                        </View>
                    </View>
                    <View style={[{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'}, getMarginTop(1), getWidthnHeight(100)]}>
                        <View style={[{flexDirection:'row', alignItems: 'center', justifyContent: 'center', transform:[{translateX: getMarginLeft(-1.5).marginLeft}]}, getWidthnHeight(50)]}>
                            <View style={[{
                                width: getWidthnHeight(7).width,height: getWidthnHeight(7).width,borderRadius: (getWidthnHeight(7).width/2),
                                borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center', alignItems: 'center'}]}>
                                <ClaimForm name='view-carousel-outline' size={getWidthnHeight(5).width} style={[getMarginTop(0.3)]}/>
                            </View>
                            <Text style={{textAlignVertical: 'center', paddingLeft: 10}}>Claim Form</Text>
                        </View>
                        <View style={[{height: getWidthnHeight(6).width, backgroundColor: 'black', width: 1}]}/>
                        <View style={[{flexDirection:'row', alignItems: 'center', justifyContent: 'center', transform:[{translateX: getMarginLeft(-4.5).marginLeft}]}, getWidthnHeight(50)]}>
                            <View style={{
                                width: getWidthnHeight(7).width,height: getWidthnHeight(7).width,borderRadius: (getWidthnHeight(7).width/2),
                                borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center', alignItems: 'center'}}>
                                <EditClaim name='database-edit' size={getWidthnHeight(5).width}/>
                            </View>
                            <Text style={{textAlignVertical: 'center', paddingLeft: 10}}>Edit Claim</Text>
                        </View>
                    </View>
                </Animated.View>
                <Animated.View style={[styles.MainContainer, animatedContainerStyle]}>
                    <TouchableOpacity style={[getWidthnHeight(25), {borderColor: 'red', borderWidth: 0, alignItems: 'center'}]} onPress={() => (started)? this.resetAnimation() : this.startAnimation()}>
                        <View style={[{flexDirection: 'row'}, getMarginVertical(2)]}>
                            <Text style={{color: '#0B8EE8'}}>Icon Info</Text>
                            <View style={[{
                                width: getWidthnHeight(5).width, height: getWidthnHeight(5).width, borderRadius: getWidthnHeight(5).width, 
                                backgroundColor: '#1968CF', alignItems: 'center', justifyContent: 'center'}, getMarginHorizontal(2)]}>
                                    <Animated.View style={[rotateIcon]}>
                                        <FontAwesomeIcons name='angle-down' size={getWidthnHeight(4).width} color={'white'}/>
                                    </Animated.View>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={{alignItems: 'center', flex: 1}}>
                        <View style = {[{flexDirection:'row', justifyContent: 'space-between', alignItems: 'center'}, getWidthnHeight(90), getMarginTop(0)]} >
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
                                    onChangeText={status => this.setState({ status }, this.ondrop)}
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
                                        onChangeText={list_type => this.setState({ list_type }, this.ondrop)}
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
                                    <TouchableOpacity activeOpacity={0.7} style = {[{backgroundColor:'white',width: '25%', borderColor: 'red', borderWidth: 0},styles.Ancontainer]} onPress = {this.animatedBox}>  
                                        <Animated.View style={[{elevation: 5, shadowColor: 'black', shadowOpacity: 0.4, shadowOffset: {width: 0, height: 0}, shadowRadius: 3, width: getWidthnHeight(9).width,height: getWidthnHeight(9).width, borderRadius: getWidthnHeight(9).width/2, borderWidth:0, backgroundColor:'white', justifyContent:'center'}, iconmargin]}>
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
                                                // onFocus={() => this.setState({placeholder: ''})}
                                                // onBlur = {() => this.setState({placeholder: 'Search here'})}
                                                onChangeText={(searchText) => {
                                                    this.setState({searchText})
                                                    if(searchText === ''){
                                                        this.setState({empty: true, filterData: []})
                                                    }else{
                                                        this.setState({empty: false})
                                                    }
                                                }}  
                                                value={this.state.searchText}
                                                backgroundColor='white'
                                                style= {[{paddingLeft:10,borderWidth:0, borderColor:'#DBE8F8', borderRadius:50, padding:10}, animateTextInput, fontSizeH4()]}
                                            />  
                                            <TouchableWithoutFeedback style = {[{backgroundColor:'white'},styles.Ancontainer]}>  
                                                <Animated.View style={[{width: getWidthnHeight(9).width,height: getWidthnHeight(9).width, borderRadius: getWidthnHeight(9).width, borderWidth:0, borderColor: 'red', backgroundColor:'#3280E4', justifyContent:'center'}, iconmargin]}>
                                                <Animated.View style={[{alignItems:'center'}]}>   
                                                    <FontAwesomeIcons name='search' size={getWidthnHeight(5).width} color={'white'}/>
                                                </Animated.View>
                                                </Animated.View>
                                            </TouchableWithoutFeedback>
                                        </Animated.View>
                                    </View>
                                }
                            </View>  
                        </DismissKeyboard>
                
                        {(this.state.approvals.length > 0) ? 
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
                </Animated.View>
                {(requestChange) &&
                    <TravelApprovalModal 
                        isVisible={requestChange}
                        toggle={() => this.setState({requestChange: false})}
                        containerStyle={[{
                            backgroundColor: '#F3F3F3', alignItems: 'center', justifyContent: 'center', 
                            borderRadius: getWidthnHeight(undefined, 1).height}, getWidthnHeight(90, 35)]}
                        requestChange={() => this.requestChangeFunction()}
                    />
                }
            </View>
        )
    }
    }

    const styles = StyleSheet.create({
        container: {
            backgroundColor: '#F5FCFF',
            alignItems: 'center',
            flex: 1,
        },
        MainContainer:{
            flex: 1,
            alignItems: 'center',
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            backgroundColor:'white',
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
            borderWidth:1,
            borderColor:'#DBE8F8'
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
        boldFont: {
            ...Platform.select(
            {
                android: {
                    fontFamily: ''
                }
            }
            )
        },
    });
