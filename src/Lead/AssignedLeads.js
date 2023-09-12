import React, { Component } from 'react';
import {
  StyleSheet, Text,
  TouchableOpacity, View, Dimensions, 
  ActivityIndicator, TextInput,
  Alert, ScrollView, 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-material-dropdown';
import {extractBaseURL} from '../api/BaseURL';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {
  CommonModal, IOS_StatusBar, LeadInfoModal, getWidthnHeight, DismissKeyboard, WaveHeader, 
  RoundButton, getMarginTop, getMarginBottom, getMarginLeft, LeadCommonCard, SearchBar, Loader,
  Spinner
} from '../NewComponents/common';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const colorBase = '#25A2F9';
const modalColor = '#1079D5';

export default class Lead_List extends Component {

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
                                  canUnassigned:'',
                                  canApprove:'',
                                  hodId:'',
                                  leadListId:'',
                                  lead_status: 1,
                                  lead_type:'assigned',
                                  contentOffsetY: 0,
                                  contentOffsetZ:0,
                                  baseURL: null,
                                  errorCode: null,
                                  apiCode: null,
                                  commonModal: false,
                                  options: false,
                                  optionsKey: null,
                                  NextPage: '',
                                  empty: true,
                                  searchText: '',
                                  leadStatusLabel: 'New'
                    }
                    this.props.navigation.setOptions({
                      title: 'Assigned Leads'
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
            this.initialize();
          }

          async initialize(){
            await this.extractLink();
            this.Lead_list();
          }

          async extractLink(){
            await extractBaseURL().then((baseURL) => {
              this.setState({baseURL}, () => console.log("EXTRACT LINK: ", this.state.baseURL))
            })
          }

unassign_user=async()=>{
const {baseURL} = this.state;
const context=this;
this.showLoader();
const _this = this;
var user_token= await AsyncStorage.getItem('user_token');
var permissions_fir= JSON.parse(user_token);
var permissions_four=permissions_fir.success.secret_token;
var user_id=permissions_fir.success.user.id;
this.setState({user_id:user_id})
var data = new FormData();
data.append("lead_id", this.state.leadListId);

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function() {
if(this.readyState !== 4) {
return;
}if(xhr.status == 200){
console.log(this.responseText);
_this.hideLoader();
var json_obj = JSON.parse(xhr.responseText);
var msg = json_obj.msg;
Alert.alert(msg);
_this.Lead_list()
}else {
  _this.enableModal(xhr.status, "067");
}
});

xhr.open("POST", `${baseURL}/unassigned-user`);
xhr.setRequestHeader("Authorization", "Bearer " + permissions_four);

xhr.send(data);
}

Lead_list=async()=>{
const {baseURL} = this.state;
const context=this;
this.showLoader();
const _this = this;
var user_token= await AsyncStorage.getItem('user_token');
var permissions_fir= JSON.parse(user_token);
var permissions_four=permissions_fir.success.secret_token;
var user_id=permissions_fir.success.user.id;
this.setState({user_id:user_id, options: false, optionsKey: null, searchText: '', empty: true})
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
  var json_obj = JSON.parse(xhr.responseText);
  var Lead_list = json_obj.success.leadList.data;
  var NextPage = json_obj.success.leadList.next_page_url;
  var canUnassigned = json_obj.success.canUnassigned;
  _this.setState({canUnassigned:canUnassigned})
  var canApprove = json_obj.success.canApprove;
  _this.setState({canApprove:canApprove})
  var hodId = json_obj.success.hodId;
  _this.setState({hodId:hodId})
  _this.setState({NextPage:NextPage}, () => console.log("^^^^^^^NEXT PAGE", _this.state.NextPage))
  const unique = [...new Map(Lead_list.map(item => [item['lead_code'], item])).values()]
  context.setState({Lead_listing:unique});
  //console.log("LOOK FOR URL: ",Lead_list)
}
else{
console.log(xhr.responseText)
_this.hideLoader();
_this.enableModal(xhr.status, "068");
}
});
xhr.open("POST", `${baseURL}/list-lead`);
xhr.setRequestHeader("Authorization", "Bearer " + permissions_four);

xhr.send(data);

}

Lead_list_down=async()=>{
  const {baseURL, NextPage, Lead_listing} = this.state;
  if(!NextPage){
    this.hideLoader();
    console.log("###### @@@@@@ END OF PAGE - API 69")
    return;
  }
  const context=this;
  this.showLoader();
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
    let stateData = _this.state.Lead_listing;
    // console.log("lead list",xhr.responseText)
    var json_obj = JSON.parse(xhr.responseText);
    var NextPage = json_obj.success.leadList.next_page_url;
    _this.setState({NextPage:NextPage}, () => console.log("*******NEXT PAGE", _this.state.NextPage));
    var Lead_list = json_obj.success.leadList.data;
    Array.prototype.push.apply(stateData, Lead_list)
    console.log("%%%%%%%%ARRAY PROTOTYPE: ", stateData.length)
    const unique = [...new Map(stateData.map(item => [item['lead_code'], item])).values()]
    context.setState({Lead_listing: unique});
  }
  else{
  console.log(xhr.responseText)
  _this.hideLoader();
  if(!NextPage){
    return;
  }
  _this.enableModal(xhr.status, "069");
  }
  });
  xhr.open("POST", `${NextPage}`);
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
  //this.state.contentOffsetZ == contentOffset ? this.Lead_list() : null
  this.setState({contentOffsetY: contentOffset});
  console.log("contentOffset",contentOffset ,this.state.contentOffsetY, typeof contentOffset)
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
      if(data.name_of_prospect){
          const leadName = data.name_of_prospect.toLowerCase().includes(searchName.toLowerCase())
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
          leadName = filterNames[i]['name_of_prospect'];
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
          unassignIconFunction = {() => this.unassign_user()}
          userID = {this.state.user_id}
          canUnassign = {this.state.canUnassigned}
          navigation={this.props.navigation}
          route={this.props.route}
      />
    );
  }else if(empty){
    return (
      <LeadCommonCard 
          leadData = {Lead_listing}
          cardStyle = {styles.task_list}
          unassignIconFunction = {() => this.unassign_user()}
          userID = {this.state.user_id}
          canUnassign = {this.state.canUnassigned}
          navigation={this.props.navigation}
          route={this.props.route}
      />
      )
  }
}

render (){
const context=this;
const {errorCode, apiCode, slideAnimationDialog, loading, Lead_listing} = this.state;
console.log(this.state.business_type)
let leadStatus = [{value: 'All',type:'all'}, {value: 'New',type:'1'}, {value: 'Open',type:'2'},{value: 'Lead For Recommendation',type:'3' },{value: "Lead For Approval",type:'4'}];
let leadType = [{value: 'All Leads',type:'all'}, {value: 'Created Leads',type:'created'}, {value: 'Assigned Leads',type:'assigned'},];
console.log(this.state.leadIndustryOptions_id)
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
                title='Assigned Leads'
                createLead={true}
            />   */}
            {/* {<Loader
                visible={loading}
                onPress={this.hideLoader}
            />} */}
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                <LeadInfoModal 
                    visible={slideAnimationDialog}
                    onBackdropPress={() => this.setState({slideAnimationDialog: false})}
                    color={modalColor}
                />
                <View style={{flexDirection: 'row', marginVertical: 15}}>
                    <TouchableOpacity onPress={() => {this.setState({slideAnimationDialog: true,})}}>
                    <Text style={[{color:colorBase, fontWeight: 'bold'}, styles.boldFont]}>Click Here</Text>
                    </TouchableOpacity>
                    <Text>  For Information About Lead List</Text>
                </View>
            </View>
            <View style={styles.MainContainer}> 
              <View>
                <View style={[{justifyContent: 'space-between', borderWidth: 0, borderColor: 'red', marginTop: 10, alignItems: 'center'}, getMarginTop(3), getWidthnHeight(100, 18)]}>
                    <View style={[{alignItems: 'center', justifyContent: 'space-between', borderWidth: 0, borderColor: 'green'}, getWidthnHeight(100, 18)]}>
                        <View style={[styles.box, getWidthnHeight(100)]}>
                            <Dropdown
                                containerStyle={[{justifyContent: 'center', borderColor: 'grey', borderWidth: 1, paddingLeft: 10, borderRadius: 10}, getWidthnHeight(70, 7)]}
                                value={this.state.leadStatusLabel}
                                inputContainerStyle={{borderBottomWidth: 0, fontSize:hp(2)}}
                                label={'Lead Status'}
                                data={leadStatus}
                                valueExtractor={({type})=> type}
                                labelExtractor={({value})=> value}
                                onChangeText={(lead_status, index, data) => {
                                  this.setState({ leadStatusLabel: data[index]['value'], lead_status, options: false, optionsKey: null, Lead_listing: [] }, () => {
                                    console.log("@@@ LEAD STATUS LABEL: ", this.state.leadStatusLabel, index, data)
                                    this.Lead_list()
                                  })
                                }}
                                baseColor = {colorBase}
                                labelFontSize={10}
                                fontSize={14}
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
                              placeholder = {(loading || Lead_listing.length == 0)? 'Disabled' : 'Lead Name / Lead Code'}
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
        <View style={{flex: 1, alignItems: 'center'}}>
        {this.state.Lead_listing.length>0 ?
          <ScrollView pagingEnabled={false} onScroll={(this.state.empty) ? this._onScroll : null}>
            {this.multipleCards()}
          </ScrollView>
        :
          <View style={{marginTop: 50,justifyContent:'center',alignItems:'center'}}>
            <Text style={{color:'gray',fontSize:20}}>No Data Available</Text>
          </View>}
                
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
    borderColor: 'blue',
    borderWidth: 0
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
    margin:10,
    borderRadius: 0,
    borderTopWidth: 1.5,
    borderBottomWidth:1.5,
    borderRightWidth:3,
    borderLeftWidth:1.5,
    borderLeftColor:'transparent',
    borderTopColor:'transparent',
    borderBottomColor:'transparent',
    borderRightColor:'transparent',
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
