import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
   ScrollView,
   TextInput,
   SafeAreaView,
   Keyboard
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActionModal from 'react-native-modal';
import { Dropdown } from 'react-native-material-dropdown';
import Button from 'react-native-button';
import NameBottomBorder from '../Components/Name bottom border'
import TitleBox from '../Components/title box'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Dialog, {
  DialogTitle,
  DialogContent,
  SlideAnimation,
} from 'react-native-popup-dialog';
import {extractBaseURL} from '../api/BaseURL';
import {CommonModal, getWidthnHeight, IOS_StatusBar, WaveHeader, getMarginTop, Spinner, getMarginLeft} from '../KulbirComponents/common';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
export default class Leaves extends Component {

  constructor(props){
  super(props)
  this.state={
                loading: false,
                token:'',
                final_data:'',
                final_data_sec:'',
                language:'',
                language_sec:'',
                tvf:[],
                tvl:[],
                data:[],
                from:'',
                to:'',
                counter_data:'',
                pic_name_data:'',
                emp_code:'',
                leaves:[],
                message:[],
                msg:[],
                xyz:'',
                slideAnimationDialog: false,
                employee:[],
                sender:[],
                name:'',
                status:'0',
                Month:'',
                Year:'',
                leave_approvals_id:'',
                applied_leave_id:'',
                slideAnimationDialog:'',
                button_value:'0',
                remark:'',
                leave_approval_id:'',
                mandatory:'0',
                leave_approve_status:'',
                reson:'',
                baseURL: null,
                errorCode: null,
                apiCode: null,
                commonModal: false,
                isActionVisible: false,
                editable: true,
                saveRemark: false,
                remarkError: true,
                leaveStatus: null
              }
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

async showLeaves(){
  const {baseURL} = this.state;
  console.log("approve-leaves", this.state.baseURL);
  this.showLoader();
  var userObj= await AsyncStorage.getItem('user_token');
  var parsedData = JSON.parse(userObj);
  var secretToken = parsedData.success.secret_token;
  const data = new FormData();
  data.append("leave_status", this.state.status);
  data.append("month", this.state.Month);
  data.append("year", this.state.Year);
  axios.post(`${baseURL}/approve-leaves`, 
    data
  ,
  {
      headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${secretToken}`
      }
  }).then((response) => {
      this.hideLoader();
      if(response.status === 200){
        const leaves = response.data.success.leave_approvals;
        this.setState({mandatory:'0', leaves:leaves})
        // {leaves.map((item) => {
        //     this.setState({leave_approvals_id:item.id})
        //     this.setState({applied_leave_id:item.applied_leave_id})
        // })}
      }else if(response.status === 204){
        this.hideLoader();
        this.setState({mandatory:'1', leaves:[]})
        Alert.alert("No Records Found")
      }
  }).catch((error) => {
      this.hideLoader();
      if(error.response?.data){
          Alert.alert("Error", JSON.stringify(error.response.data))
      }else if(error.response?._response){
          Alert.alert("Error", JSON.stringify(error.response._response))
      }
  })
}

conditional=(t)=>{

  if(t=="Approved"){
    return "Approved"
  }
  if(t=="Inprogress"){
    return "In-progress"
  }
  if(t=="Rejected"){
    return "Rejected"
  }
  if(t=="Cancelled"){
    return "Cancelled"
  }
}
conditional_next=(t)=>{

  if(t=="Approved"){
    return "Approved"
  }
  if(t=="Inprogress"){
    return "Inprogress"
  }
  if(t=="Rejected"){
    return "Rejected"
  }
  if(t=="Cancelled"){
    return "Cancelled"
  }
}
message=()=>{
  const {message,msg,leaves}=this.state;
     // console.log(leaves)
     // Alert.alert("leaves")


        <View>
        <View style={styles.container}>

          <Button
            title="Slide Animation Dialog"
            onPress={() => {
              this.setState({
                slideAnimationDialog: true,
              });
            }}
          />
        </View>



        <Dialog
          onDismiss={() => {
            this.setState({ slideAnimationDialog: false });
          }}
          onTouchOutside={() => {
            this.setState({ slideAnimationDialog: false });
          }}
          visible={this.state.slideAnimationDialog}
          dialogTitle={<DialogTitle title="Slide Animation Dialog Sample" />}
          dialogAnimation={new SlideAnimation({ slideFrom: 'bottom' })}>
          <DialogContent>
            <Text>
              Here is an example of slide animation dialog. Please click outside
              to close the the dialog.
            </Text>
          </DialogContent>
        </Dialog>
        </View>



 //console.log(message)
  // Alert.alert({message}

  // )
}

approveLeave=async()=>{
  const {baseURL} = this.state;
  var user_token= await AsyncStorage.getItem('user_token');
  var permissions_fir= JSON.parse(user_token);
  var permissions_four=permissions_fir.success.secret_token;
  const _this = this;
  const context=this;
  this.showLoader();
  var data = new FormData();
  data.append("remark", this.state.remark);
  data.append("leave_approval_id", this.state.leave_approval_id);
  data.append("leave_status", this.state.button_value);
  
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  
  xhr.addEventListener("readystatechange", function() {
    if(this.readyState !== 4) {
      return;
      
    }if(xhr.status === 200) {
      _this.hideLoader();
      console.log("200",xhr.responseText)
      context.setState({remark:'', saveRemark: false, remarkError: true})
      if(context.state.leave_approve_status == 0){
        Alert.alert("Leave Approved Successfully")
        context.setState({ slideAnimationDialog: false });
      }
      if(context.state.leave_approve_status == 1){
        Alert.alert("Leave Rejected Successfully")
        context.setState({ slideAnimationDialog: false });
      }
      _this.initialize();
    }else if(xhr.status === 405){
      _this.hideLoader();
      context.setState({remark:'', saveRemark: false, remarkError: true})
      context.setState({ slideAnimationDialog: false });
      Alert.alert("You cannot approve leave for previous month's date now")
    }else{
      _this.hideLoader();
      let error=xhr.responseText;
      let error_withOut_validation= error.error;
      let error_with_validation = error.validation_error;
      console.log("else",error)
      context.setState({remark:'', saveRemark: false, remarkError: true})
      context.setState({ slideAnimationDialog: false });
      //_this.enableModal(xhr.status, "022");
  } 
  
  });
  
  xhr.open("POST", `${baseURL}/leave-approval`);
  xhr.setRequestHeader("Authorization", "Bearer " + permissions_four);
  
  xhr.send(data);
}
abc=()=>{
  // const {message}= this.state;
  // console.log("sender");
  // {message.map((item) => {
  // return (
  //   this.setState({sender:item.sender.employee})
  // )})}
}
xyz(){
  this.showLeaves();
  this.abc();
}
goverment = () => {
  
  this.setState({button_value:0});
  this.approveLeave();
  
};
confirmCorporate(){
  Keyboard.dismiss()
  this.setState({saveRemark: true})
  if(this.state.remarkError === true){
    Alert.alert("Please fill the field highlighted in RED")
  }else{
    this.corporate();
  }
}
corporate = () => {
  this.setState({leave_approve_status:'0'})
  this.setState({button_value:1});
  this.approveLeave();
};

confirmReject(){
  Keyboard.dismiss()
  this.setState({saveRemark: true})
  if(this.state.remarkError === true){
    Alert.alert("Please fill the field highlighted in RED")
  }else{
    this.Rejected();
  }
}
Rejected = () => {
  this.setState({leave_approve_status:'1'})
  this.setState({button_value:2});
  this.approveLeave();
};

from_month(){
  var today = new Date();
  var dd = today.getDate();

  var mm = today.getMonth()+1; 
  var yyyy = today.getFullYear();
  // if(mm==1) 
  // {
  //     mm='January';
  // } 
  // if(mm==2) 
  // {
  //     mm='February';
  // }
  // if(mm==3) 
  // {
  //     mm='March';
  // }
  // if(mm==4) 
  // {
  //     mm='April';
  // }
  // if(mm==5) 
  // {
  //     mm='May';
  // }
  // if(mm==6) 
  // {
  //     mm='June';
  // }
  // if(mm==7) 
  // {
  //     mm='July';
  // }
  // if(mm==8) 
  // {
  //     mm='August';
  // }
  // if(mm==9) 
  // {
  //     mm='September';
  // }
  // if(mm==10) 
  // {
  //     mm='October';
  // }

  // if(mm<11) 
  // {
  //   mm='November';
  // } 
  // if(mm<12) 
  // {
  //   mm='December';
  // } 
  today = yyyy+'-'+mm+'-'+'01';
  this.setState({Month:mm})
  console.log(mm);
}

to_month(){
  var today = new Date();
  var dd = today.getDate();

  var mm = today.getMonth()+1; 
  var yyyy = today.getFullYear();
  if(dd<10) 
  {
      dd='0'+dd;
  } 

  if(mm<10) 
  {
      mm='0'+mm;
  } 
  today = yyyy+'-'+mm+'-'+'30';
  this.setState({Year:yyyy})
  console.log(yyyy);
}

componentDidMount(){
  this.initialize();
}

async initialize(){
  await this.extractLink();
  this.from_month();
  this.to_month();
  this.showLeaves();
}

async extractLink(){
  await extractBaseURL().then((baseURL) => {
    this.setState({baseURL}, () => console.log("EXTRACT LINK: ", this.state.baseURL))
  })
}

renderScreenHeader(){
      return (
        <WaveHeader
          wave={Platform.OS ==="ios" ? false : false} 
          //logo={require('../Image/Logo-164.png')}
          menu='white'
          title='Approve Leaves List'
          //version={`Version ${this.state.deviceVersion}`}
        />
            );
  }

    render (){
          const {
            leaves,message,msg,xyz,employee,sender,name,from, errorCode, apiCode, slideAnimationDialog, 
            saveRemark, remarkError, leaveStatus, loading
          }= this.state;
           const context=this;
           //console.log(leaves.secondary_final_status)
            
           
           console.log("leave_approval_id",this.state.leave_approval_id)
           let status = [{value: 'Pending',leave_status:'0'}, {value: 'Approved',leave_status:'1'}, {value: 'Rejected',leave_status:'2'},];
           let Month = [{value: 'January',leave_status:'0'}, {value: 'February',leave_status:'1'}, {value: 'March',leave_status:'2'},{value: 'April',leave_status:'2'},{value: 'May',leave_status:'2'},{value: 'June',leave_status:'2'},{value: 'July',leave_status:'2'},{value: 'August',leave_status:'2'},{value: 'September',leave_status:'2'},{value: 'October',leave_status:'2'},{value: 'November',leave_status:'2'},{value: 'December',leave_status:'2'},];
           let Year = [{value: '2016',leave_status:'0'}, {value: '2017',leave_status:'1'}, {value: '2018',leave_status:'2'}, {value: '2019',leave_status:'2'}, {value: '2020',leave_status:'2'}, {value: '2021',leave_status:'2'}, {value: '2022',leave_status:'2'}, {value: '2023',leave_status:'2'}];
           // console.log(employee)
           var today = new Date();
           var mm = today.getMonth()+1; 
            var yyyy = today.getFullYear();
            if(mm==1) 
            {
                mm='January';
            } 
            if(mm==2) 
            {
                mm='February';
            }
            if(mm==3) 
            {
                mm='March';
            }
            if(mm==4) 
            {
                mm='April';
            }
            if(mm==5) 
            {
                mm='May';
            }
            if(mm==6) 
            {
                mm='June';
            }
            if(mm==7) 
            {
                mm='July';
            }
            if(mm==8) 
            {
                mm='August';
            }
            if(mm==9) 
            {
                mm='September';
            }
            if(mm==10) 
            {
                mm='October';
            }

            if(mm==11) 
            {
              mm='November';
            } 
            if(mm==12) 
            {
              mm='December';
            } 
            let user = this.props.employer;
            console.log("***EMPLOYER: ", user)
            let gradient = null;
            let borderColor = null;
            let searchButton = null;
            if(user === "Aarti Drugs Ltd"){
              searchButton = {backgroundColor: '#F06130'}
              gradient = ['#F03030', '#E1721D']
              borderColor = {borderColor: '#F06130'}
            }else{
              searchButton = {backgroundColor: 'rgb(19,111,232)'}
              gradient = ['#039FFD', '#EA304F'];
              borderColor = {borderColor: 'rgb(19,111,232)'}
            }
		return(
      <View style={{height:viewportHeight,width:viewportWidth,backgroundColor:'white'}}>
         <IOS_StatusBar color={gradient} barStyle="light-content"/>
            <View>
      <View style={{height:'100%',top:'0%',backgroundColor:'white'}}>
      
      <ActionModal 
        isVisible={slideAnimationDialog}
        style={{justifyContent: 'flex-end', alignItems: 'center'}}
        avoidKeyboard={true}
        onBackdropPress={() => this.setState({
          remark: '', saveRemark: false, remarkError: true
        }, () => this.setState({slideAnimationDialog: false}))
        }
      >
        <View>
        <View style={[{alignItems: 'center', backgroundColor: 'white', borderRadius: 10}, getWidthnHeight(85, 40)]}>
        <View style={[{backgroundColor:'#F1F1F1', justifyContent: 'center'}, getWidthnHeight(85, 7)]}>
          <Text style={{textAlign: 'center', fontWeight: 'bold', textAlignVertical: 'center'}}>Action for Leave</Text>
        </View>
        <View style={[{justifyContent: 'space-evenly', backgroundColor: 'white', alignItems: 'center', flex: 1}, getWidthnHeight(75)]}>
        <TextInput
                  style={[{backgroundColor: 'white' ,borderColor: (saveRemark && remarkError)? 'red' : 'rgb(19,111,232)', borderWidth: 1, fontSize:14}, getWidthnHeight(75, 12)]}
                  placeholder={'Remarks'}
                  multiline
                  numberOfLines={4}
                  editable
                  maxLength={190}
                  onChangeText={remark => {
                    this.setState({
                      remark, 
                      remarkError: false
                    })
                    if(remark === ''){
                      this.setState({remarkError: true})
                    }
                  }}
                  value={this.state.remark}
                />
                
            <View style={{flexDirection:'row',backgroundColor:'#f1f1f1', width:'100%', marginVertical: 10}}>
                <Text style={{margin:5,fontSize:12,}}> Reason:</Text>
                  <Text style={{margin:5,fontSize:12,width:'75%'}}>{this.state.reson}</Text>
                </View>
                 
            <View style={[{flexDirection:'row',alignItems:'center',justifyContent:'space-around',}, getWidthnHeight(75)]}>
              {(leaveStatus === '0' || leaveStatus === '2')?
              <TouchableOpacity style={{
                backgroundColor:'green',
                paddingLeft:5,
                paddingRight:5,
                paddingTop:5,
                paddingBottom:5,
                borderRadius:5,
                width:'40%'}} onPress={this.confirmCorporate.bind(this)}>
                  <Text style={{color:'white',textAlign:'center'}}>Approve</Text>
              </TouchableOpacity> 
              : null }
              {(leaveStatus === '0' || leaveStatus === '1')?
              <TouchableOpacity style={{
                backgroundColor:'red',
                paddingLeft:5,
                paddingRight:5,
                paddingTop:5,
                paddingBottom:5,
                borderRadius:5,
                width:'40%'}} onPress={this.confirmReject.bind(this)}>
                <Text style={{color:'white',textAlign:'center'}}>Reject</Text>
              </TouchableOpacity> 
              : null}
            </View>
          </View>
        </View>
        <View 
            style={[{backgroundColor: (loading)? 'rgba(0, 0, 0, 0.5)' : 'transparent'}, StyleSheet.absoluteFill]} 
            pointerEvents={(loading)? 'auto' : 'none'}
        >
            {(loading) ?
                <Spinner loading={loading} style={[styles.loadingStyle, getWidthnHeight(45, 10), getMarginLeft(3)]} color='rgb(19,111,232)'/>
            : null}
        </View>
        </View>
      </ActionModal>
      <View style={{alignItems: 'center'}}>
        <Dropdown
          containerStyle={{width:'50%'}}
          inputContainerStyle={{ borderBottomWidth: 1,borderBottomColor:"rgb(19,111,232)" }}
          data={status}
          label='Status'
          value={'Pending'}
          onChangeText={ status =>{
            if(status==='Pending'){
              context.setState({status:'0'}) ||this.showLeaves()
            }
            if(status==='Approved'){
              context.setState({status:'1'}) ||this.showLeaves()
            }
            if(status==='Rejected'){
              context.setState({status:'2'}) ||this.showLeaves()
            }
            } }
        />
      </View>  
         <View style={styles.date_component}>
              <Text style={{bottom:'6%',backgroundColor:'white',color:'rgb(19,111,232)'}}>    Search for Particular Date    </Text>
<View style={{flexDirection:'row',top:0}}>
      
<Dropdown
              containerStyle={{width:'30%',right:10,bottom:10}}
              inputContainerStyle={{ borderBottomWidth: 1,borderBottomColor:"rgb(19,111,232)" }}
              data={Month}
              fontSize={14}
              value={mm}
              label='Month'
              onChangeText={ Month =>{
                if(Month==='January'){
                  context.setState({Month:'1'})
                }
                if(Month==='February'){
                  context.setState({Month:'2'})
                }
                if(Month==='March'){
                  context.setState({Month:'3'})
                }
                if(Month==='April'){
                  context.setState({Month:'4'})
                }
                if(Month==='May'){
                  context.setState({Month:'5'})
                }
                if(Month==='June'){
                  context.setState({Month:'6'})
                }
                if(Month==='July'){
                  context.setState({Month:'7'})
                }
                if(Month==='August'){
                  context.setState({Month:'8'})
                }
                if(Month==='September'){
                  context.setState({Month:'9'})
                }
                if(Month==='October'){
                  context.setState({Month:'10'})
                }
                if(Month==='November'){
                  context.setState({Month:'11'})
                }
                if(Month==='December'){
                  context.setState({Month:'12'})
                }
               } }
              
            />

            <Dropdown
              containerStyle={{width:'30%',left:'0%',bottom:10}}
              inputContainerStyle={{ borderBottomWidth: 1,borderBottomColor:"rgb(19,111,232)" }}
              data={Year}
              fontSize={14}
              value={yyyy}
              label='Year'
              onChangeText={ Year =>{ context.setState({ Year }) } }
              
            />
       
          <TouchableOpacity style={{top:20}} onPress={()=>this.showLeaves()}>
          <Image
                          source={require('../Image/search.png')}
                          style={{ width: 35, height: 35, marginLeft: 20,top:0,borderRadius:0 }}
                        />
      </TouchableOpacity>
    </View>
    
      </View>
      
      <View style={{top:'5%',height:'100%',}}>
      
        <TitleBox lable='Task List'/>
           
           <View style={{height: '55%',top:10}} >
      <ScrollView >
        
      {this.state.mandatory == 0 ?
     <View>
       
      {leaves.map((item) => {
         console.log("LEAVE STATUS: ", item.leave_status, typeof item.leave_status)
         let from_day = item.applied_leave.from_date.substring(8,10);
         let from_month = item.applied_leave.from_date.substring(5,7);
         let from_year = item.applied_leave.from_date.substring(0,4);
         let from_date = from_day+"/"+from_month+"/"+from_year;
        
         let to_day = item.applied_leave.to_date.substring(8,10);
         let to_month = item.applied_leave.to_date.substring(5,7);
         let to_year = item.applied_leave.to_date.substring(0,4);
         let to_date = to_day+"/"+to_month+"/"+to_year;
      return (
        
                <View>
                   <View style={ styles.Approved }>
               <View style={{flexDirection:'row'}}> 
                <Text style={{fontSize:18,fontWeight:'bold',paddingTop:10,width:'90%',}}>  {item.user.employee.fullname}  ({item.user.employee_code}) </Text>
                
                <TouchableOpacity 
                  onPress={() => {
                    this.setState({leaveStatus: item.leave_status})
                    this.setState({
                      slideAnimationDialog: true,
                      leave_approval_id:item.id,
                      reson:item.applied_leave.reason
                    });
                  }}
                  style={{top:hp('2%'),right: wp('1%')}}
                >
                <Image source={require('../Image/eye.png')}/>
                </TouchableOpacity>
                

                </View>
                <NameBottomBorder/>
                
                <View style={{flexDirection:'row'}}>
                <Text style={{margin:5,fontSize:12,color:'gray'}}> From : </Text>
                <Text style={{margin:5,fontSize:12}}>{from_date}    |</Text>
                <Text style={{margin:5,fontSize:12,color:'gray'}}> To : </Text>
                <Text style={{margin:5,fontSize:12}}>{to_date} </Text>
                </View>

                <View style={{flexDirection:'row'}}>
                <Text style={{margin:5,fontSize:12,color:'gray'}}> No. of days  : </Text>
                <Text style={{margin:5,fontSize:12}}>{item.applied_leave.number_of_days}</Text>
                </View>
 
 
                
                </View>
                
                </View>
                
                
            )
    })}
</View>
 :
 <View style={{flexDirection:'row',justifyContent:'center',bottom:'0%',}}>
   <Text style={{color:'gray',fontSize:20}}>No data </Text>
 </View>
 
 }
    
    </ScrollView>
    </View>
      </View>
      </View>
        <View 
            style={[{backgroundColor: (loading)? 'rgba(0, 0, 0, 0.5)' : 'transparent'}, StyleSheet.absoluteFill]} 
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
   
    Approved:{
      flexDirection:'column',
      
      width:'95%',
      backgroundColor:'transparent',
      borderRadius: 0,
      borderTopWidth: 1,
      borderBottomWidth:1,
      borderRightWidth:1,
      borderLeftWidth:5.5,
      borderLeftColor: '#85b3d1',
      borderRightColor: 'transparent',
      borderBottomColor: 'transparent',
      borderTopColor: 'transparent',
      margin:10,
      shadowColor: '#330000',
      shadowOffset:{  width: 100,  height: 150,  },
                      shadowOpacity: 5,
                      // shadowRadius: 0,
                      elevation: 3,
                      overflow: "hidden"
    },
    
    
    date_component: {
      
      left:'5%',
      top:20,
       flexDirection:'column',
      margin:'0%',
      marginBottom:'0%',
      marginLeft:0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:'transparent',
      borderRadius: 10,
      borderTopWidth: 1,
      borderBottomWidth:1,
      borderRightWidth:1,
      borderLeftWidth:1,
      borderColor: 'rgb(19,111,232)',
      width:'90%',
      
      // shadowOffset:{  width: 100,  height: 100,  },
      shadowColor: '#330000',
      shadowOpacity: 0,
      // shadowRadius: 0,
      elevation: 0,

},
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
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
