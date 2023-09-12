import React, { Component } from 'react';
import {
  StyleSheet, Text,
  TouchableOpacity, View,
  ActivityIndicator, TextInput,
  Alert, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActionModal from 'react-native-modal';
import { Dropdown } from 'react-native-material-dropdown';
import {extractBaseURL} from '../api/BaseURL';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {
  CommonModal, IOS_StatusBar, getWidthnHeight, DismissKeyboard, LeadInfoModal, getMarginTop,
   Spinner, WaveHeader, RoundButton, UnassignLeadCard, getMarginLeft, SearchBar, LoadingModal
  } from '../NewComponents/common';

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
                                  setLoader: true,
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
                                  slideAnimationDialogUnassign:false,
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
                                  NextPage:'',
                                  lead_status:'3',
                                  lead_type:'all',
                                  bdEmployees:[],
                                  leadListId:'',
                                  bdEmployeesId:'',
                                  contentOffsetY: '',
                                  contentOffsetZ: 2678,
                                  contentOffsetA: 4198,
                                  contentOffsetB: 5718,
                                  contentOffsetC: 7238,
                                  baseURL: null,
                                  errorCode: null,
                                  apiCode: null,
                                  commonModal: false,
                                  options: false,
                                  optionsKey: null,
                                  empty: true,
                                  searchText: '',
                                  menuState: true,
                                  leadCode: null,
                                  empName: ''
                    }
                    this.props.navigation.setOptions({
                      title: 'Unassigned Leads'
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
          this.setState({ loading: false, setLoader: false });
          }

          showLoader = () => {
          this.setState({ loading: true, setLoader: true });
          }

          componentDidMount(){
          this.Lead_list().done();
          }

          async extractLink(){
            await extractBaseURL().then((baseURL) => {
            this.setState({baseURL}, () => console.log("EXTRACT LINK: ", this.state.baseURL))
            })
          }

assigned_user=async()=>{
const {baseURL, loading, setLoader, leadCode, empName} = this.state;
const context=this;
this.showLoader();
const _this = this;
var user_token= await AsyncStorage.getItem('user_token');
var permissions_fir= JSON.parse(user_token);
var permissions_four=permissions_fir.success.secret_token;
var user_id=permissions_fir.success.user.id;
this.setState({user_id:user_id}, () => console.log("%%%%%%% ASSIGN LEAD_ID: ", _this.state.leadListId))
    var data = new FormData();
data.append("lead_id", this.state.leadListId);
data.append("assign_to", this.state.bdEmployeesId);

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function() {
  if(this.readyState !== 4) {
    return;
  }if(xhr.status == 200){
    console.log("$$$$$ ASSIGNED SUCCESSFULLY", xhr.responseText);
    _this.hideLoader();
    var json_obj = JSON.parse(xhr.responseText);
    var msg = json_obj.success;
    Alert.alert("Success!", `Lead - ${leadCode}, has been assigned to ${empName}.`);
    _this.setState({slideAnimationDialogUnassign: false});
    _this.Lead_list();
    _this.setState({leadCode: null, empName: ''})
  }else {
    console.log("%%%%% FAILED TO ASSIGN", xhr.responseText);
    _this.enableModal(xhr.status, "085");
  }
});

xhr.open("POST", `${baseURL}/assigned-user`);
xhr.setRequestHeader("Authorization", "Bearer " + permissions_four);

xhr.send(data);
}

Lead_list=async()=>{
await this.extractLink();
const {baseURL, loading, setLoader} = this.state;
const context=this;
this.showLoader();
const _this = this;
var user_token= await AsyncStorage.getItem('user_token');
var permissions_fir= JSON.parse(user_token);
var permissions_four=permissions_fir.success.secret_token;
var user_id=permissions_fir.success.user.id;
this.setState({user_id:user_id, options: false, optionsKey: null})
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
  var NextPage = json_obj.success.leadList.next_page_url;
  _this.setState({NextPage:NextPage, searchText: ''})
  var Lead_list = json_obj.success.leadList.data;
  var bdEmployees = json_obj.success.bdEmployees;
  context.setState({bdEmployees:bdEmployees, empty: true});
  const unique = [...new Map(Lead_list.map(item => [item['lead_code'], item])).values()]
  context.setState({Lead_listing:unique});
  console.log("EMPLOYEE LIST: ", bdEmployees)
}
else{
console.log(xhr.responseText)
_this.hideLoader();
_this.enableModal(xhr.status, "086");
}
});
xhr.open("POST", `${baseURL}/unassigned-leads`);
xhr.setRequestHeader("Authorization", "Bearer " + permissions_four);
xhr.setRequestHeader("Accept", "application/json");
xhr.send(data);

}

Lead_list_down=async()=>{
  const {baseURL, Lead_listing, NextPage, loading, setLoader} = this.state;
  if(!NextPage){
    this.hideLoader();
    console.log("###### @@@@@@ END OF PAGE - API 87")
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
    // console.log("lead list",xhr.responseText)
    let stateData = Lead_listing;
    var json_obj = JSON.parse(xhr.responseText);
    var NextPage = json_obj.success.leadList.next_page_url;
    _this.setState({NextPage:NextPage})
    var Lead_list = json_obj.success.leadList.data;
    Array.prototype.push.apply(stateData, Lead_list)
    console.log("%%%%%%%%ARRAY PROTOTYPE: ", stateData.length)
    const unique = [...new Map(stateData.map(item => [item['lead_code'], item])).values()]
    _this.setState({Lead_listing: unique})
  }
  else{
  console.log("@@@ API ERROR 87", xhr.responseText)
  _this.hideLoader();
  if(!NextPage){
    return;
  }
  _this.enableModal(xhr.status, "087");
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
  var contentOffset  = e.nativeEvent.contentOffset.y;
  this.state.contentOffsetY !== contentOffset ? this.Lead_list_down() : null
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
  //console.log("SELF TASK: ", Lead_listing)
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
      <UnassignLeadCard 
          leadData = {data}
          cardStyle = {styles.task_list}
          openAssignLeadModal = {() => this.setState({slideAnimationDialogUnassign: true})}
          selectedLead = {(leadID, leadCode) => this.setState({leadListId: leadID, leadCode: leadCode}, () => console.log("%%%%%% MAIN SCREEN: ", this.state.leadListId))}
      />
    );
  }else if(empty){
    return (
      <UnassignLeadCard 
          leadData = {Lead_listing}
          cardStyle = {styles.task_list}
          openAssignLeadModal = {() => this.setState({slideAnimationDialogUnassign: true})}
          selectedLead = {(leadID, leadCode) => this.setState({leadListId: leadID, leadCode: leadCode}, () => console.log("%%%%%% MAIN SCREEN: ", this.state.leadListId))}
      />
      )
  }
}

render (){
const {
  errorCode, apiCode, slideAnimationDialog, slideAnimationDialogUnassign, bdEmployeesId, 
  loading, setLoader, Lead_listing, menuState, leadCode
} = this.state;
const context=this;
console.log(this.state.lead_status)
console.log(this.state.lead_type)
let leadStatus = [{value: 'All',type:'all'}, {value: 'New',type:'1'}, {value: 'Open',type:'2'},{value: 'Lead For Recommendtion',type:'3' },{value: "Lead For Approval",type:'4'}];
let leadType = [{value: 'All Leads',type:'all'}, {value: 'Created Leads',type:'created'}, {value: 'Assigned Leads',type:'assigned'},];
let popupDropdown = [{name:'naveen'},{name:'naveen'},{name:'naveen'},{name:'naveen'}];
// console.log(this.state.user_id)
const renderItem = ({ item }) => (
  <Item title={item.name_of_prospect} />
);
let gradient = ['#0E57CF', '#25A2F9'];
return (
        <View style={{flex: 1,backgroundColor:'#e6e6e6'}}>
          <View>
            <IOS_StatusBar barStyle="light-content"/>
          </View>
            <LeadInfoModal 
                visible={slideAnimationDialog}
                onBackdropPress={() => this.setState({slideAnimationDialog: false})}
                color={modalColor}
            />

        <ActionModal 
          isVisible={slideAnimationDialogUnassign}
          style={{justifyContent: 'center', alignItems: 'center'}}
          avoidKeyboard={true}
          onBackdropPress={() => this.setState({slideAnimationDialogUnassign: false, bdEmployeesId: ''})}
        >
          <View>
            <View style={[{alignItems: 'center', backgroundColor: 'white', borderRadius: 10}, getWidthnHeight(85, 30)]}>
              <View style={[{backgroundColor:modalColor, justifyContent: 'center'}, getWidthnHeight(85, 7)]}>
                <Text style={{color: 'white',textAlign: 'center', fontWeight: 'bold', textAlignVertical: 'center', fontSize: 16}}>{`Change Assignee - (${leadCode})`}</Text>
              </View>
              <View style={{flex: 1, borderColor: 'black', borderWidth: 0, alignItems: 'center', justifyContent: 'space-evenly'}}>
                  <Dropdown
                      containerStyle={[{borderColor: 'grey', borderWidth: 1, borderRadius: 10, justifyContent: 'center', alignItems: 'center'}, getWidthnHeight(60, 7)]}
                      //value={popupDropdown}
                      //maxLength = {12}
                      inputContainerStyle={[{borderBottomWidth:wp(0),borderBottomColor:"rgb(19,111,232)",fontSize:hp(2)}, getWidthnHeight(50)]}
                      label={'Assignee'}
                      data={this.state.bdEmployees}
                      valueExtractor={({user_id})=> user_id}
                      labelExtractor={({fullname})=> fullname}
                      onChangeText={(bdEmployeesId, index, empData) => {
                        this.setState({ bdEmployeesId, empName: empData[index]['fullname'] }, () => console.log('BD EMPLOYEE: ', this.state.bdEmployeesId))
                      }}
                      baseColor = {(bdEmployeesId)? colorBase : 'grey'}
                  />
                  <RoundButton 
                      title="SAVE"
                      onPress={()=>this.assigned_user()}
                      gradient={['#0E57CF', '#25A2F9']}
                      style={[getWidthnHeight(30, 5)]}
                  />
              </View>
            </View>
            <View 
                style={[{backgroundColor: (loading)? 'rgba(0, 0, 0, 0.5)' : 'transparent',
                }, StyleSheet.absoluteFill]} 
                pointerEvents={(loading)? 'auto' : 'none'}
            >
                {(loading) ?
                    <Spinner loading={loading} style={[styles.loadingStyle, getWidthnHeight(45, 10), getMarginLeft(3)]} color='rgb(19,111,232)'/>
                : null}
            </View>
          </View>
       </ActionModal>


              <View style={[{flexDirection:'row',justifyContent:'center',alignItems:'center', marginBottom: 15}, getMarginTop(2)]}>
                <TouchableOpacity onPress={() => {this.setState({slideAnimationDialog: true,})}}>
                  <Text style={[{color:colorBase, fontWeight: 'bold'}, styles.boldFont]}>Click Here</Text>
                </TouchableOpacity>
                <Text>  For Information About Lead List</Text>
              </View>
              <View style={styles.MainContainer}> 
                <View>
                  <View style={[{justifyContent: 'center', borderWidth: 0, borderColor: 'red', marginTop: 10, alignItems: 'center'}, getMarginTop(3), getWidthnHeight(100, 8)]}>
                    <View style={[{alignItems: 'center', justifyContent: 'center', borderWidth: 0, borderColor: 'green'}, getWidthnHeight(100, 8)]}>
                        {/* {<View style={[styles.box, getWidthnHeight(100)]}>
                            <Dropdown
                              containerStyle={[{justifyContent: 'center', borderColor: 'grey', borderWidth: 1, paddingLeft: 10, borderRadius: 10}, getWidthnHeight(70, 7)]}
                              value={this.state.lead_status}
                              maxLength = {14}
                              inputContainerStyle={{borderBottomWidth: 0, fontSize:hp(2)}}
                              label={'Lead Status'}
                              data={leadStatus}
                              valueExtractor={({type})=> type}
                              labelExtractor={({value})=> value}
                              onChangeText={lead_status => this.setState({ lead_status, options: false, optionsKey: null, Lead_listing: [] }, () => this.Lead_list())}
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
                        </View>} */}
                        <DismissKeyboard>
                            <View style={[{alignItems: 'center'}, getWidthnHeight(100)]}>
                                <SearchBar 
                                    placeholder = {(loading || Lead_listing.length == 0)? 'Disabled' : 'Lead Name / Lead Code'}
                                    editable = {(loading || Lead_listing.length == 0)? false : true}
                                    style ={[{borderColor: 'grey', borderWidth: 1, borderRadius: 10, justifyContent: 'center', paddingHorizontal: 10}, getWidthnHeight(70, 7)]}
                                    value = {this.state.searchText}
                                    onChangeText = {(searchText) => {
                                      this.setState({searchText})
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
                  {/* {(setLoader)?
                    <LoadingModal 
                      visible={setLoader}
                      tempClose={() => this.setState({setLoader: false})}
                      menuState={menuState}
                    />
                  :
                    null
                  } */}
                  <View style={{flex: 1, marginTop: 10}}>
                    {this.state.Lead_listing.length>0 ?
                      <ScrollView pagingEnabled={false} onScroll={(this.state.empty) ? this._onScroll : null}>
                          {this.multipleCards()}
                      </ScrollView>
                    :
                      <View style={{marginTop: 50,justifyContent:'center',alignItems:'center'}}>
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
    // onPopupEvent = (eventName, index) => {
    //   if (eventName !== 'itemSelected') return
    //   if (index === 0) this.onEdit()
    //   else this.onRemove()
    // }
}
const styles = StyleSheet.create({
  MainContainer:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
PopupDropdownBox:{
    borderWidth:1,
  borderColor:'#c4c4c4',
  borderRadius:10,
 left:0,
 top:0,
 height:50,
 width:'90%',
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
loader: {
  ...Platform.select({
    ios: {
      zIndex: 1,
    }
  })
},
boldFont: {
  ...Platform.select({
    android: {
      fontFamily: ''
    }
  })
},
});
