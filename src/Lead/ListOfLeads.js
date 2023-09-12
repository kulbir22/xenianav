import React, { Component } from 'react';
import {
  StyleSheet, Text,
  Dimensions, ActivityIndicator, 
  TextInput, Alert, ScrollView,
  View, TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-material-dropdown';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {extractBaseURL} from '../api/BaseURL';
import {
    CommonModal, IOS_StatusBar, getWidthnHeight, LeadInfoModal, WaveHeader, RoundButton, Loader,
    getMarginTop, LeadCommonCard, getMarginBottom, DismissKeyboard, getMarginLeft, SearchBar,
    Spinner
} from '../NewComponents/common';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const MD_ID = 13;
const colorBase = '#25A2F9';
const modalColor = '#1079D5';

class Lead_List extends Component {
    constructor(props){
        super(props)
        this._onScroll = this._onScroll.bind(this)
        this.state={
            employee_code:'',
            userPassword:'',
            device_id:'',
            device_type:'',
            loading: false,
            name:'',
            code:'',
            permissions:'',
            token:'',
            final_data:'',
            task_type:'',
            my_status:'',
            task_status:'',
            task:[],
            isChecked:false,
            checkedDefault: {},
            slideAnimationDialog: false,
            slideAnimationDialog_sec:false,
            task_title:[],
            taskoverview_title:'',
            taskoverview_due_date:'',
            dataToShow_sec:[],
            button_value:'',
            show: true,
            show_sec: true,
            singleFileOBJ: '',
            model_close:false,
            defaultAnimationModal: false,
            task_id:'',
            status:'',
            task_status_comment:'',
            priority:'',
            due_date:'',
            task_title_textinput:'',
            update_description:'',
            taskoverview_project:'',
            taskoverview_id:'',
            comment_text:'',
            Lead_listing:[],
            user_id:'',
            userId:'',
            employeeFullname:'',
            NextPage:'',
            lead_status:'3',
            lead_type:'all',
            canUnassigned:'',
            canApprove: false,
            hodId:'',
            leadListId:'',
            contentOffsetY: 0,
            contentOffsetZ: 2678,
            contentOffsetA: 4198,
            contentOffsetB: 5718,
            contentOffsetC: 7238,
            baseURL: null,
            errorCode: null,
            apiCode: null,
            commonModal: false,
            apiLink: null,
            options: false,
            optionsKey: null,
            empty: true,
            searchText: ''
        }
        this.props.navigation.setOptions({
            title: 'List of Leads'
        })
    }

    onDecline(){
      this.setState({commonModal: false})
    }
    
    enableModal(status, apiCode){
      this.setState({errorCode: status})
      this.setState({apiCode})
      this.setState({commonModal: true})
    }   

    hideLoader = () => {
    this.setState({ loading: false });
    }

    showLoader = () => {
    this.setState({ loading: true });
    }

    componentDidMount(){
        const {navigation, route} = this.props;
        this._unsubscribe = navigation.addListener("focus", async() => {
            console.log("^^^!!!@@@ ROUTE: ", route)
            this.setState({Lead_listing: []})
            await this.initialize();
        })
    }

    async initialize(){
        await this.extractLink();
        await this.MDuserID();
        //await this.Lead_list().done();
    }

    async extractLink(){
      await extractBaseURL().then((baseURL) => {
      this.setState({baseURL}, () => console.log("EXTRACT LINK: ", this.state.baseURL))
      })
    }
  
    componentWillUnmount(){
      this._unsubscribe();
    }

    MDuserID=async()=>{
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var user_id=permissions_fir.success.user.id;
        console.log("##### MD SIR ID: ", typeof user_id, user_id)
        this.setState({user_id:user_id}, () => {
            const {user_id} = this.state;
            if(user_id === 13){
                this.setState({lead_status: '3'})
            }else if(user_id === 35){
                this.setState({lead_status: '3'})
            }else{
                this.setState({lead_status: '1'})
            }
            this.Lead_list();
        });
    }


    unassign_user=async(leadID)=>{
        const {baseURL} = this.state;
        this.setState({leadListId: leadID}, () => console.log("SELECTED LEAD: ", this.state.leadListId))
        const context=this;
        this.showLoader();
        const _this = this;
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_four=permissions_fir.success.secret_token;
        // var user_id=permissions_fir.success.user.id;
        // this.setState({user_id:user_id})
        var data = new FormData();
        data.append("lead_id", this.state.leadListId);

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function() {
            if(this.readyState !== 4) {
                return;
            }if(xhr.status == 200){
                //console.log(this.responseText);
                _this.hideLoader();
                var json_obj = JSON.parse(xhr.responseText);
                var msg = json_obj.msg;
                Alert.alert(msg);
                _this.Lead_list()
            }else {
                _this.hideLoader();
                _this.enableModal(xhr.status, "077");
            }
        });

        xhr.open("POST", `${baseURL}/unassigned-user`);
        xhr.setRequestHeader("Authorization", "Bearer " + permissions_four);

        xhr.send(data);
    }

    formLink(baseURL){
        const userIDString = String(this.state.user_id)
        switch(userIDString){
            case '13':
                console.log("***MD_ID: ", Boolean(this.state.user_id), this.state.user_id)
                this.setState({apiLink: `${baseURL}/get-list-lead`}, () => console.log("MD's APILINK: ", this.state.apiLink))
              return;
            default:
                console.log("***USER ID: ", Boolean(this.state.user_id), typeof this.state.user_id)
                this.setState({apiLink: `${baseURL}/list-lead`}, () => console.log("USER APILINK: ", this.state.apiLink))
              return;
        }
    }

    Lead_list=async()=>{
        const context=this;
        this.showLoader();
        console.log("Lead_List --- user_id: ",this.state.user_id, this.state.baseURL)
        //const baseValue = (this.state.user_id === 13 ? 'get-list-lead' : 'list-lead')
        await this.formLink(this.state.baseURL);
        console.log("API LINK: ", this.state.apiLink);
        const _this = this;
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_four=permissions_fir.success.secret_token;
        var user_id=permissions_fir.success.user.id; 
        var employeeFullname=permissions_fir.success.user.employee.fullname;

        this.setState({user_id:user_id, options: false, optionsKey: null}, () => console.log("API 78: ", this.state.user_id))
        this.setState({employeeFullname:employeeFullname, searchText: '', empty: true})
        var data = new FormData();
        data.append("lead_status", this.state.lead_status);
        data.append("lead_type", this.state.lead_type);
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function() {
        if (xhr.readyState !== 4) {
            return;
        }
        if(xhr.status===200){
            _this.hideLoader();
            //console.log("lead list",xhr.responseText)
            
            var json_obj = JSON.parse(xhr.responseText);
            console.log("**kk*lead list", _this.state.lead_status, _this.state.lead_type);
            var NextPage = json_obj.success.leadList.next_page_url;
            var canUnassigned = json_obj.success.canUnassigned;
            _this.setState({canUnassigned:canUnassigned})
            var canApprove = json_obj.success.canApprove;
            _this.setState({canApprove:canApprove}, () => console.log("%%%%% CAN APPROVE: ", typeof _this.state.canApprove, _this.state.canApprove))
            var hodId = json_obj.success.hodId;
            _this.setState({hodId:hodId})
            var userId = json_obj.success.userId;
            _this.setState({userId:userId})
            _this.setState({NextPage:NextPage})
            var Lead_list = json_obj.success.leadList.data;
            const unique = [...new Map(Lead_list.map(item => [item['lead_code'], item])).values()]
            context.setState({Lead_listing:unique});
            //console.log("json_obj",Lead_list)
        }
        else{
            //console.log("API LINK: ", `${baseURL}/${baseValue}`)
            console.log("*****ERROR API 78: ", xhr.responseText)
            _this.hideLoader();
            console.log("RESPONSE CODE: ", xhr.status);
            _this.enableModal(xhr.status, "078");
        }
        });
    xhr.open("POST", `${this.state.apiLink}`);
    xhr.setRequestHeader("Authorization", "Bearer " + permissions_four);
    xhr.send(data);
}

    Lead_list_down=async()=>{
        const {baseURL, NextPage, loading, Lead_listing} = this.state;
        const context=this;
        if(!NextPage){
            this.hideLoader();
            console.log("###### @@@@@@ END OF PAGE - API 79")
            return;
        }
        this.showLoader();
        console.log("****NEXT PAGE API 79 URL", this.state.NextPage)
        const _this = this;
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_four=permissions_fir.success.secret_token;
        var user_id=permissions_fir.success.user.id;
        this.setState({user_id:user_id})
        var data = new FormData();
        data.append("lead_status", this.state.lead_status);
        data.append("lead_type", this.state.lead_type);
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function() {
        if (xhr.readyState !== 4) {
          return;
        }
        if(xhr.status===200){
            _this.hideLoader();
            // console.log("lead list",xhr.responseText)
            let stateData = Lead_listing;
            var json_obj = JSON.parse(xhr.responseText);
            var NextPage = json_obj.success.leadList.next_page_url;
            _this.setState({NextPage:NextPage})
            var Lead_list = json_obj.success.leadList.data;
            // for(let count = 0; count < Lead_list.length; count++){
            //     for(let i = 0; i < stateData.length; i++){
            //         if(Lead_list[count]['lead_code'] !== stateData[i]['lead_code']){
            //             stateData.push(Lead_list[count])
            //         }
            //     }
            // }
            Array.prototype.push.apply(stateData, Lead_list)
            console.log("%%%%%%%%ARRAY PROTOTYPE: ", stateData.length)
            const unique = [...new Map(stateData.map(item => [item['lead_code'], item])).values()]
            _this.setState({Lead_listing: unique}, () => console.log("$$$$$$AFTER PUSH: ", _this.state.Lead_listing[1], NextPage, Lead_list.length, json_obj.success.count))
            console.log("****API 79 WORKED")
        }else{
            //var json_obj = JSON.parse(xhr.responseText);
            console.log("^^^^^API 79 ERROR: ", xhr.responseText)
            _this.hideLoader();
            if(!NextPage){
                return;
            }
            _this.enableModal(xhr.status, "079");
        }
        });
        xhr.open("POST", `${this.state.NextPage}`);
        xhr.setRequestHeader("Authorization", "Bearer " + permissions_four);
        
        xhr.send(data);
    }
     
    handleClose = () => {
        this.setState({ model_close: false })
    }

    taskOverViewComment(){
        const context=this;
        context.props.navigation.navigate("taskOverViewComment",{id:this.state.taskoverview_id});
        this.setState({ slideAnimationDialog: false });
    }

    taskOverViewUpdate(){
        const context=this;
        context.props.navigation.navigate("taskOverViewUpdate",{id:this.state.taskoverview_id});
        this.setState({ slideAnimationDialog: false });
    }

    taskOverViewHistory(){
        const context=this;
        context.props.navigation.navigate("taskOverViewHistory",{id:this.state.taskoverview_id});
        this.setState({ slideAnimationDialog: false });
    }

    onDismiss(){
        this.setState({ defaultAnimationDialog: false });
    }

    _onScroll(e){
        const {NextPage, loading} = this.state;
        var contentOffset = e.nativeEvent.contentOffset.y;
        if(this.state.contentOffsetY < contentOffset && NextPage && !loading){
            this.Lead_list_down()
        }
        // this.state.contentOffsetZ == contentOffset ? this.Lead_list_down() : null
        // this.state.contentOffsetA == contentOffset ? this.Lead_list_down() : null
        // this.state.contentOffsetB == contentOffset ? this.Lead_list_down() : null
        // this.state.contentOffsetC == contentOffset ? this.Lead_list_down() : null
        // this.state.contentOffsetZ == contentOffset ? this.Lead_list() : null
        this.setState({contentOffsetY: contentOffset});
        console.log("contentOffset",contentOffset ,this.state.contentOffsetY)
    }

    searchLeadName(empArray, searchName, callBack){
        let isNum = /^\d+$/.test(searchName);
        console.log("Search Result: ", typeof isNum, isNum)
        let filterNames = [];
        let splitArray = [];
        if(!isNum){
            splitArray = searchName.toLowerCase().split('');
            console.log("THIS IS STRING: ", typeof searchName, searchName)
            filterNames = empArray.filter((data) => {
            if(data.lead_executives && data.lead_executives.fullname){
                const leadName = data.lead_executives.fullname.toLowerCase().includes(searchName.toLowerCase())
                return leadName
            }else{
                return;
            }
            })
        }else if(isNum){
            splitArray = (searchName.split(''));
            console.log("THIS IS NUMBER: ", typeof searchName, searchName)
            filterNames = empArray.filter((data) => {
                const leadName = data.lead_code.includes(searchName)
                return leadName
            })
        }
        
        if(filterNames.length < 1){
            console.log("NO RESULTS TO DISPLAY")
            return;
        }
      
        //console.log("FILTER NAME: ", filterNames[0]['name_of_prospect'])
        //console.log("*******FILTER NAMES: ", filterNames, searchName.split(''), typeof filterNames.length)
        
        const searchLength = splitArray.length;
        let data = [];
        //console.log("SPLIT SEARCH: ", splitArray, searchLength)
        for(let i = 0; i <= filterNames.length - 1; i++){
            let leadName = null;
            let splitLeadName = null;
            if(!isNum){
                leadName = filterNames[i]['lead_executives']['fullname'];
                splitLeadName = leadName.toLowerCase().split(''); 
            }else if(isNum){
                leadName = (filterNames[i]['lead_code']);
                splitLeadName = leadName.split('');
                console.log("YES ITS NUMBER: ", typeof splitLeadName[0], splitLeadName[0])
            }
            //console.log("INSIDE LOOP: ", splitArray, splitLeadName)
            for(let j = 0; j < searchLength; j++){
                //console.log("INSIDE FOR LOOP****: ", j)
                if(splitArray[j] !== splitLeadName[j]){
                    break;
                }
                if(j === searchLength - 1 && splitArray[j] === splitLeadName[j]){
                    data.push(filterNames[i])
                    //console.log("FOR LOOP DATA: ", data)
                    callBack(data)
                }
            }
        }
    }

    multipleCards(){
        const {Lead_listing, searchText, empty} = this.state;
        //console.log("SELF TASK: ", self_task)
        let empArray = Lead_listing;
        let data = [];
        const searchName = searchText;
        if(searchName){
            this.searchLeadName(empArray, searchName, (dataArray) => {
                if(dataArray !== [] && dataArray !== null && dataArray.length !== null && dataArray.length > 0){
                    data = dataArray;
                }
            });
        }
        if(data.length === 0 && empty === false){
            return (
                <View style={{alignItems: 'center', marginTop: 30}}>
                    <Text style={{color: 'grey'}}>No such Lead was found</Text>
                </View>
            );
        }if(data !== [] && data !== null && data.length !== null && data.length > 0 && empty === false){
          return (
            <LeadCommonCard 
                leadData = {data}
                cardStyle = {styles.task_list}
                unassignIconFunction = {(leadID) => this.unassign_user(leadID)}
                userID = {this.state.user_id}
                canUnassign = {this.state.canUnassigned}
                canApprove = {this.state.canApprove}
                navigation={this.props.navigation}
                route={this.props.route}
            />
          );
        }else if(empty){
          return (
            <LeadCommonCard 
                leadData = {Lead_listing}
                cardStyle = {styles.task_list}
                unassignIconFunction = {(leadID) => this.unassign_user(leadID)}
                userID = {this.state.user_id}
                canUnassign = {this.state.canUnassigned}
                canApprove = {this.state.canApprove}
                navigation={this.props.navigation}
                route={this.props.route}
            />
            )
        }
    }

render (){
    const {errorCode, apiCode, slideAnimationDialog, loading, Lead_listing} = this.state;
    const context=this;
    console.log(this.state.lead_status)
    console.log(this.state.lead_type)
    console.log("this.state.user_id",this.state.user_id)
    if (this.state.user_id === MD_ID){
      var leadStatus = [{value: 'All',type:'all'}, {value: 'New',type:'1'}, {value: 'Open',type:'2'},{value: 'Complete',type:'3' },{value: "Rejected by Hod",type:'4'},{value: "Abandoned",type:'6'}];
    }else{
      var leadStatus = [{value: 'All',type:'all'}, {value: 'New',type:'1'}, {value: 'Open',type:'2'},{value: 'Lead For Recommendation',type:'3' },{value: "Lead For Approval",type:'4'}];
    }
    let leadType = [{value: 'All Leads',type:'all'}, {value: 'Created Leads',type:'created'}, {value: 'Assigned Leads',type:'assigned'},];
    console.log("leadListId",this.state.leadListId)
    const renderItem = ({ item }) => (
      <Item title={item.name_of_prospect} />
    );
    let gradient = ['#0E57CF', '#25A2F9'];
return (
        <View style={{height:viewportHeight,width:viewportWidth,backgroundColor:'#e6e6e6'}}>
            <IOS_StatusBar barStyle="light-content"/>
                {/* <WaveHeader
                    wave={Platform.OS ==="ios" ? false : false} 
                    //logo={require('../Image/Logo-164.png')}
                    menu='white'
                    title='List of Leads'
                    createLead={true}
                /> */}
          
                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                
                    <LeadInfoModal 
                        visible={slideAnimationDialog}
                        onBackdropPress={() => this.setState({slideAnimationDialog: false})}
                        color={modalColor}
                    />

                    <TouchableOpacity style={{marginVertical: 10}} onPress={() => {this.setState({slideAnimationDialog: true,})}}>
                        <Text style={[{color: colorBase, fontWeight: 'bold'}, styles.boldFont]}>Click Here</Text>
                    </TouchableOpacity>

                    <Text>  For Information About Lead List</Text>

                </View>

                {/* {<Loader
                    visible={loading}
                    onPress={this.hideLoader}
                />} */}

                <View style={styles.MainContainer}> 
                    <View>
                    <View style={[{justifyContent: 'space-between', borderWidth: 0, borderColor: 'red', marginTop: 10, alignItems: 'center'}, getMarginTop(3), getWidthnHeight(100, 18)]}>
                        <View style={[{alignItems: 'center', justifyContent: 'space-between', borderWidth: 0, borderColor: 'green'}, getWidthnHeight(100, 18)]}>
                            <View style={[styles.box, getWidthnHeight(100)]}>
                                <Dropdown
                                    containerStyle={[{justifyContent: 'center', borderColor: 'grey', borderWidth: 1, paddingLeft: 10, borderRadius: 10}, getWidthnHeight(70, 7)]}
                                    value={this.state.lead_status}
                                    inputContainerStyle={{borderBottomWidth: 0,fontSize:hp(2) }}
                                    label={'Lead Status'}
                                    data={leadStatus}
                                    valueExtractor={({type})=> type}
                                    labelExtractor={({value})=> value}
                                    onChangeText={lead_status => this.setState({ lead_status, options: false, optionsKey: null, Lead_listing: [] }, () => this.Lead_list())}
                                    baseColor = {colorBase}
                                    pickerStyle={[getMarginLeft(3), getWidthnHeight(70), getMarginTop(5)]}
                                />
                                <View style={{justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                                    <RoundButton 
                                        title="Filter"
                                        onPress={()=>this.Lead_list()}
                                        gradient={['#0E57CF', '#25A2F9']}
                                        style={[{width: getWidthnHeight(undefined, 7).height}, getWidthnHeight(undefined, 7)]}
                                    />
                                </View> 
                            </View>
                            <DismissKeyboard>
                                <View style={[{alignItems: 'center'}, getMarginBottom(1), getWidthnHeight(100)]}>
                                    <SearchBar 
                                        placeholder = {(loading || Lead_listing.length == 0)? 'Disabled' : 'Employee Name / Lead Code'}
                                        editable = {(loading || Lead_listing.length == 0)? false : true}
                                        style ={[{borderColor: 'grey', borderWidth: 1, borderRadius: 10, justifyContent: 'center', paddingHorizontal: 10}, getWidthnHeight(70, 7)]}
                                        value = {this.state.searchText}
                                        onChangeText = {(searchText) => {
                                            this.setState({searchText}, () => {
                                            })
                                            if(searchText === ''){
                                            this.setState({empty: true})
                                            }else{
                                            this.setState({empty: false})
                                            }
                                        }}
                                        clearSearch={() => this.setState({empty: true, searchText: ''})}
                                    />
                                </View>
                                </DismissKeyboard>
                        </View>
                    </View>

                    <View style={[{flex: 1, alignItems: 'center'}, getWidthnHeight(100)]}>
                        {this.state.Lead_listing.length>0 ?
                            <ScrollView pagingEnabled={false} onScroll={(this.state.empty) ? this._onScroll : null}>
                                {this.multipleCards()}
                            </ScrollView>
                        :
                            <View style={{justifyContent:'center',alignItems:'center', marginTop: 50}}>
                                <Text style={{color:'gray',fontSize:20}}>No Data Available</Text>
                            </View>
                        }
                    </View>
                </View>
                <View 
                    style={[{backgroundColor: (loading)? 'rgba(0, 0, 0, 0.5)' : 'transparent',
                    borderTopLeftRadius: 40, borderTopRightRadius: 40
                    }, StyleSheet.absoluteFill]} 
                    pointerEvents={(loading)? 'auto' : 'none'}
                >
                    {(loading) ?
                        <Spinner loading={loading} style={[styles.loadingStyle, getWidthnHeight(45, 10), getMarginLeft(3)]} color='rgb(19,111,232)'/>
                    : null}
                </View>
                </View>
            <CommonModal 
                title="Something went wrong"
                subtitle= {`Error Code: ${errorCode}${apiCode}`}
                visible={this.state.commonModal}
                onDecline={this.onDecline.bind(this)}
                buttonColor={['#0E57CF', '#25A2F9']}
            />
        </View>
                   
        );
    }
    onPopupEvent = (eventName, index) => {
          if (eventName !== 'itemSelected') return
          if (index === 0) this.onEdit()
          else this.onRemove()
        }
    }

const styles = StyleSheet.create({
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
      borderColor: 'red',
  },
  button: {
      width:'90%',
      flexDirection:'row',
      justifyContent:'center',
      marginLeft:15,
      marginRight:5,
      marginBottom: 0,
      paddingTop:10,
      paddingBottom:10,
      paddingLeft:0,
      paddingRight:0,
      backgroundColor:'#e5314e',
      borderRadius:1,
      borderWidth: 0,
      // borderColor: 'rgb(19,111,232)',
      elevation: 0,
  },
  container: {
      flex: 0,
      flexDirection:'column',
      left:'0%',
      width:wp('100%'),
      height:hp('90%'),
  },
  image:{
      top:245,
      left: 300,
      bottom:0,
      backgroundColor:'white',
      width: 10,
      height: 14,
  },
  task_list:{
    //justifyContent: 'space-around',
    margin:10,
    borderRadius: 0,
    backgroundColor:'white',
    paddingTop:0,
    paddingBottom:0,
    width:'95%',
    shadowColor: "#000",
    shadowOffset: {
    width: 0,
    height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    },
  triangle: {
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderTopWidth: 45,
      borderRightWidth: 45,
      borderBottomWidth: 10,
      borderLeftWidth: 0,
      borderTopColor: 'red',
      borderRightColor: 'transparent',
      borderBottomColor: 'transparent',
      borderLeftColor: 'transparent',
  },
  box:{
      borderWidth: 0,
      borderColor:'#c4c4c4',
      borderRadius:10,
      left:0,
      height:50,
      width:'90%',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center'
  },
  boldFont: {
    ...Platform.select({
      android: {
        fontFamily: ''
      }
    })
  },
  loader: {
    ...Platform.select({
      ios: {
        zIndex: 1,
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
  }
});

export default Lead_List;
