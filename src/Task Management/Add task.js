import React, {Component} from 'react';
import {
    StyleSheet, Text,
    KeyboardAvoidingView, TouchableOpacity,
    View, Image, Dimensions, Alert, ScrollView,
    TextInput, Keyboard, FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { Dropdown } from 'react-native-material-dropdown';
import DocumentPicker from 'react-native-document-picker';
import TaskIcon from 'react-native-vector-icons/FontAwesome';
import Upload from 'react-native-vector-icons/MaterialCommunityIcons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {extractBaseURL} from '../api/BaseURL';
import {
    CommonModal, IOS_StatusBar, WaveHeader, getWidthnHeight, getMarginTop, getMarginLeft, Spinner, fontSizeH4,
    AnimatedTextInput, getMarginHorizontal, fontSizeH3, Slider, DateTimePicker
} from '../KulbirComponents/common';
import moment from 'moment';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
export default class Leaves extends Component {
    constructor(props){
        super(props)
        let currentDate = moment().format("DD-MM-YYYY");
        console.log("!!@@@ DATE: ", currentDate)
        const currentTime = "12:00 AM";
        const currentDateTime = `${currentDate} ${currentTime}`;
        const utcTimeStamp = moment(currentDateTime, "DD-MM-YYYY hh:mm A").utc().toDate();
        this.state={
            fromDate: moment().format("DD-MM-YYYY"),
            fromTimeStamp: moment().valueOf(),
            fromTime: '12:00 AM',
            fromMinDate: utcTimeStamp,
            showFromDatePicker: false,
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
            task_title:'',
            task_projects:[],
            departments:[],
            language:'',
            employees:[],
            task_projects_id:'',
            departments_id:'',
            employees_id:'',
            Task_title:'',
            Due_date:'',
            Task_Description:'',
            priority:"H5",
            reminder:'off',
            reminder_notification:'off',
            reminder_mail:'off',
            singleFileOBJ:'',
            reminder_dropdown:'',
            valueTaskProject:'',
            valueDepartment:'',
            valueEmployee:'',
            valueFrequency:'',
            baseURL: null,
            errorCode: null,
            apiCode: null,
            commonModal: false,
            taskProjectError: true,
            taskTitleError: true,
            priorityError: false,
            departmentError: true,
            employeeError: true,
            dateError: true,
            reminderError: true,
            reminderTypeError: true,
            frequencyError: true,
            descriptionError: true,
            createTask: false,
            noError: function(){
                return (!this.taskProjectError && !this.taskTitleError && !this.priorityError && !this.departmentError && !this.employeeError
                    && !this.dateError && !this.reminderError  && !this.frequencyError && !this.descriptionError)
            }
        }
        this.props.navigation.setOptions({
            title: 'Add Task'
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
        this.createTask().done();  
    }

    async extractLink(){
        await extractBaseURL().then((baseURL) => {
            this.setState({baseURL}, () => console.log("EXTRACT LINK: ", this.state.baseURL))
        })
    }

    save_task = async () => {
        const {baseURL} = this.state;
        const context=this;
        this.showLoader();
        const _this = this;
        console.log("My_task")
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_sec=permissions_fir.success.secret_token;
        console.log("permissions_sec",permissions_sec)
        var data = new FormData();
        data.append("task_project_id", this.state.task_projects_id);
        data.append("department_ids", this.state.departments_id);
        data.append("assigned_to[]", this.state.employees_id);
        data.append("title", this.state.Task_title);
        data.append("priority", this.state.priority);
        data.append("due_date", this.state.Due_date);
        data.append("description", this.state.Task_Description);
        data.append("reminder", this.state.reminder);
        data.append("reminder_days", this.state.reminder_dropdown);
        data.append("reminder_notification", this.state.reminder_notification);
        data.append("reminder_mail", this.state.reminder_mail);
        data.append("task_files", this.state.singleFileOBJ);
        
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        
        xhr.addEventListener("readystatechange", function() {
            if (xhr.readyState !== 4) {
                console.log(xhr.responseText)
                return;
            }
            if(xhr.status===200){
                _this.hideLoader();
                var json_obj = JSON.parse(xhr.responseText);
                console.log(xhr.responseText)
                var msg = json_obj.success.message;
                Alert.alert(msg);
                _this.setState({valueTaskProject:''})
                _this.setState({valueDepartment:''})
                _this.setState({valueEmployee:''})
                _this.setState({task_projects_id:''})
                _this.setState({departments_id:''})
                _this.setState({employees_id:''})
                _this.setState({Task_title:''})
                _this.setState({Due_date:'', fromTimeStamp: moment().valueOf()})
                _this.setState({Task_Description:'', singleFileOBJ: ''})
                _this.setState({valueFrequency:'', priority: "H5"})
                _this.setState({reminder: 'off', reminder_notification: 'off', reminder_mail: 'off'})
                _this.setState({createTask: false, taskProjectError: true, taskTitleError: true, 
                    priorityError: false, departmentError: true, employeeError: true, dateError: true, 
                    reminderError: true, reminderTypeError: true, frequencyError: true, descriptionError: true
                })
            } 
            else{
                console.log(xhr.responseText)
                _this.hideLoader();
                _this.enableModal(xhr.status, "023");
            }
        });
        xhr.open("POST", `${baseURL}/save-task`);
        xhr.setRequestHeader("Authorization", "Bearer " + permissions_sec);
        xhr.send(data);
    }

    My_task=async()=>{
        const {baseURL} = this.state;
        const context=this;
        const _this = this;
        this.showLoader();
        console.log("My_task")
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_sec=permissions_fir.success.secret_token;
        var data = new FormData();
        data.append("task_type", this.state.task_type);
        data.append("my_status", this.state.my_status);
        data.append("task_status", this.state.task_status);
        
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        
        xhr.addEventListener("readystatechange", function() {
            if (xhr.readyState !== 4) {
                return;
            }
          if(xhr.status===200){
                 _this.hideLoader();
              var json_obj = JSON.parse(xhr.responseText);
              var task = json_obj.success.tasks;
              context.setState({task:task})
              {task.map((item) => {
                  return (
                      context.setState({task_title:item.title})
              )})}
          }
          else{
              // console.log(xhr.responseText)
              _this.hideLoader();
              _this.enableModal(xhr.status, "024");
          }
        });
        
        xhr.open("POST", `${baseURL}/my-tasks`);
        xhr.setRequestHeader("Authorization", "Bearer " + permissions_sec);
        xhr.send(data);
    }

    taskWithComment(){
        const context=this;
        context.props.navigation.navigate("taskWithComment");
    }

    createTask=async()=>{
        await this.extractLink();
        const {baseURL} = this.state;
        const context=this;
        const _this = this;
        this.showLoader();
        console.log("My_task")
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_sec=permissions_fir.success.secret_token;
        var data = new FormData();

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        
        xhr.addEventListener("readystatechange", function() {
            if (xhr.readyState !== 4) {
                return;
            }
            if(xhr.status===200){
                _this.hideLoader();
                var json_obj = JSON.parse(xhr.responseText);
                var task_projects = json_obj.success.task_projects;
                var departments = json_obj.success.departments;
                context.setState({task_projects:task_projects})
                context.setState({departments:departments}) 
            }
            else{
                // console.log(xhr.responseText)
                _this.hideLoader();
                _this.enableModal(xhr.status, "025");
            }
       });
        xhr.open("GET", `${baseURL}/create-task`);
        xhr.setRequestHeader("Authorization", "Bearer " + permissions_sec);
        xhr.send(data);
    }

    departments_wise_employees=async()=>{
        const {baseURL} = this.state;
        const b="departments_wise_employees";
        console.log(b)
      
        const context=this;
        const _this = this;
        this.showLoader();
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_sec=permissions_fir.success.secret_token;
        var data = new FormData();
        const {language}=this.state;
        data.append("department_ids", this.state.departments_id);
        
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        
        xhr.addEventListener("readystatechange", function () {
            if (xhr.readyState !== 4) {
                return;
            }
            if(xhr.status===200){
                _this.hideLoader();
                console.log(xhr.responseText)
                var json_obj = JSON.parse(xhr.responseText);
                var employees = json_obj.success.employees;
                context.setState({employees:employees});
            }
            else{
                console.log("inside error")
                _this.hideLoader();
                _this.enableModal(xhr.status, "026");
            }
    
        });
        xhr.open("POST", `${baseURL}/departments-wise-employees`);
        xhr.setRequestHeader("Content-Type", "multipart/form-data");
        xhr.setRequestHeader("Authorization", "Bearer  "+ permissions_sec);
        xhr.send(data);
    }

    Reminder = () => {
        Keyboard.dismiss();
        if(this.state.reminder=='off'){
            this.setState({reminder:'on', reminderError: false});
        }if(this.state.reminder=='on'){
            this.setState({reminder:'off', reminderError: true});
        }
        // this.approveLeave();
    };

    Notification = () => {
        Keyboard.dismiss();
        if(this.state.reminder_notification=='off'){
            this.setState({reminder_notification:'on', reminderTypeError: false});
        }
        if(this.state.reminder_notification=='on'){
            this.setState({reminder_notification:'off'}, () => {
                const {reminder_notification, reminder_mail} = this.state;
                if(reminder_notification === 'off' && reminder_mail === 'off'){
                    this.setState({reminderTypeError: true})
                }
            });
        }
        // this.approveLeave();
    };

    Mail = () => {
        Keyboard.dismiss();
        if(this.state.reminder_mail=='off'){
            this.setState({reminder_mail:'on', reminderTypeError: false});
        }if(this.state.reminder_mail=='on'){
            this.setState({reminder_mail:'off'}, () => {
                const {reminder_notification, reminder_mail} = this.state;
                if(reminder_notification === 'off' && reminder_mail === 'off'){
                    this.setState({reminderTypeError: true})
                }
            });
        }
        // this.approveLeave();
    };
  
    async SingleFilePicker() {
        try {
          const res = await DocumentPicker.pick({
              type: [DocumentPicker.types.allFiles],
          });
          this.setState({ singleFileOBJ: res }, () => Keyboard.dismiss());
      
        }catch (err) {
            Keyboard.dismiss();
            if (DocumentPicker.isCancel(err)) {
                Alert.alert('Canceled');
            } else {
                Alert.alert('Unknown Error: ' + JSON.stringify(err));
                console.log(JSON.stringify(err))
                throw err;
            }
        }
    }

    dropDownValueChange(value){
        console.log("value",value)
        this.setState({valueTaskProject:"Task project"})
        this.setState({valueDepartment:"Department"})
        this.setState({valueEmployee:"Assignee"})
        this.setState({valueFrequency:"Frequency of reminder"})
    }

    confirmNoError(){
        Keyboard.dismiss();
        this.setState({createTask: true})
        const noError = this.state.noError();
        if(noError){
            if(noError && !this.state.reminderTypeError){
                this.createSaveTask();
            }else{
                Alert.alert("", "Please check atleast one/both: Notification / WhatsApp")
            }
        }else {
            Alert.alert("", "Please fill the fields highlighted in RED")
        }
    }

    createSaveTask(){
        this.save_task();
        this.dropDownValueChange();
    }

    renderScreenHeader(){
        return (
          <WaveHeader
              wave={Platform.OS ==="ios" ? false : false} 
              //logo={require('../Image/Logo-164.png')}
              menu='white'
              title='Add Task Form'
              //version={`Version ${this.state.deviceVersion}`}
          />
        );
    }

    render (){
        const context=this;
        const {
            errorCode, apiCode, taskProjectError, taskTitleError, priorityError, departmentError, loading,
            employeeError, dateError, reminderError, reminderTypeError, frequencyError, descriptionError, createTask,
            showFromDatePicker, fromDate, fromMinDate, fromTimeStamp, fromTime, Due_date
        } = this.state;
        const value=[
            {task_type:"all",my_status:"all",task_status:"all"},
            {task_type:"Today's Tasks ",my_status:"Not-Started",task_status:"Open"},
            {task_type:"Delayed Tasks",my_status:"Inprogress",task_status:"Inprogress"},
            {task_type:"Upcoming Tasks",my_status:"Unassigned",task_status:"Reopened"},
            {task_type:"This Week's Tasks",my_status:"Done",task_status:"Completed"},
            {task_type:"This Month's Tasks",task_status:"Unassigned"}
        ]
        let reminder_dropdown = [
            {value: 'Twice per day',leave_status:'0'}, 
            {value: 'Once everyday',leave_status:'1'}, 
            {value: 'Once every 2 days',leave_status:'2'},
            {value: 'Once every 5 days',leave_status:'2'},
            {value: 'Once every 10 days',leave_status:'2'},
            {value: 'Once every month',leave_status:'2'}
        ];
        let priorityList = [
            {priority: "H1", backgroundColor: "#FFFDD0", severity: "VERY LOW"},
            {priority: "H2", backgroundColor: "#FFFF00", severity: "LOW"},
            {priority: "H3", backgroundColor: "#00FFFF", severity: "ALARMING"},
            {priority: "H4", backgroundColor: "#FFA500", severity: "CRITICAL"},
            {priority: "H5", backgroundColor: "#FF0000", severity: "HIGHEST"}
        ]
        let blank_reminder_dropdown = [{value: '',leave_status:'0'}, ]
        //console.log(this.state.button_value_one);
        let user = this.props.employer;
        console.log("***EMPLOYER: ", user)
        let gradient = null;
        let borderColor = null;
        let searchButton = null;
        searchButton = {backgroundColor: 'rgb(19,111,232)'}
        gradient = ['#039FFD', '#EA304F']
        borderColor = {borderColor: 'rgb(19,111,232)'}

        const currentYear = `${moment().year()}`;
        const currentMonth = `${moment().month() + 1}`;
        let maxDate = moment(`${currentMonth}-${currentYear}`, "MM-YYYY").add(1, 'month').format("MM-YYYY");
        let maxMonth = moment(maxDate, "MM-YYYY").format("MM");
        let maxYear = moment(maxDate, "MM-YYYY").format("YYYY");
        let maxMonthDays = moment(`${maxMonth}-${maxYear}`, "MM-YYYY").daysInMonth();
        __DEV__ && console.log("###^^^ MAX DATE1: ", maxDate, maxYear, "-", maxMonth, "-", maxMonthDays)
        const maxCompiledDate = moment(`${maxMonthDays}-${maxMonth}-${maxYear}`, "DD-MM-YYYY").format("DD-MM-YYYY");
        __DEV__ && console.log("@@@^^^ CURRENT & MAX YEAR: ", currentYear, maxYear, maxCompiledDate)
        let fromMaxDate = moment(`${maxCompiledDate} ${fromTime}`, "DD-MM-YYYY hh:mm A").utc().toDate();

		    return(
            <View style={{flex: 1}}>
                <IOS_StatusBar barStyle="light-content"/>
                <View style={[{flex: 1}, getWidthnHeight(100)]}>
                    <View style={{flex: 1, backgroundColor:'#F6F6F6', alignItems: 'center'}}>
                        <View style={[{alignItems: 'center', borderWidth: 0, borderColor: 'red', flex: 1}]}>
                            <View style={[{
                                borderWidth: 0, borderColor: 'red', backgroundColor: 'white', alignItems: 'center', shadowColor: '#000000', 
                                shadowRadius: 2, shadowOpacity: 0.5, elevation: 5, flex: 1, shadowOffset: {width: 0, height: 0}}, getMarginTop(2.5), getWidthnHeight(93)
                            ]}>
                                <View style={[{alignItems: 'center', flex: 1, borderColor: 'purple', borderWidth: 0}]}>
                                    <KeyboardAvoidingView style={{flex: 1, alignItems: 'center'}} behavior={(Platform.OS === 'ios')? "padding" : null} keyboardVerticalOffset={(Platform.OS === 'ios')? 130 : null}> 
                                        <ScrollView bounces={false} keyboardShouldPersistTaps="handled" contentContainerStyle={[{alignItems: 'center', borderColor: 'cyan', borderWidth: 0}]} style={[{borderColor: 'tomato', borderWidth: 0}, getMarginTop(2.5), getWidthnHeight(93)]} showsVerticalScrollIndicator={false} horizontal={false}>
                                            <View style={[{flexDirection:'row', alignItems: 'center', justifyContent: 'space-evenly', borderWidth: 0, borderColor: 'red'}, getWidthnHeight(93)]}>
                                                <View style={[{
                                                    borderWidth: (createTask && taskProjectError)? 2 : 1, borderColor: (createTask && taskProjectError)? 'red' : '#C4C4C4',
                                                    borderStyle: (createTask && taskProjectError)? 'dashed' : 'solid', borderRadius: 1}, getWidthnHeight(72, 6.5)
                                                ]}>
                                                    <Dropdown
                                                        containerStyle={[{textOverflow:'hidden', borderColor: '#C4C4C4', borderWidth: 0}, getWidthnHeight(72), getMarginTop(-1)]}
                                                        inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: 'blue', paddingHorizontal: 5 }, getWidthnHeight(72)]}
                                                        data={this.state.task_projects}
                                                        value={this.state.valueTaskProject}
                                                        valueExtractor={({id})=> id}
                                                        labelExtractor={({name})=> name}
                                                        label="Task project"
                                                        fontSize={fontSizeH4().fontSize + 2}
                                                        labelFontSize={fontSizeH4().fontSize - 3}
                                                        labelTextStyle={[getMarginLeft(1.5), getMarginTop(0)]}
                                                        baseColor={(this.state.task_projects_id)? "#039FFD" : '#C4C4C4'}
                                                        onChangeText={task_projects_id => this.setState({task_projects_id, taskProjectError: false}, () => Keyboard.dismiss())}
                                                    />
                                                </View>
                                                <TaskIcon name="tasks" size={getWidthnHeight(10).width} color="rgb(19,111,232)"/>
                                            </View>
                                            <View style={{marginTop: '5%'}}>
                                                <AnimatedTextInput 
                                                    placeholder="Task Title"
                                                    placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                    value={this.state.Task_title}
                                                    slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                                    slideHorizontal={[0, getWidthnHeight(-2).width]}
                                                    placeholderScale={[1, 0.75]}
                                                    autoFocus={false}
                                                    onChangeText={(Task_title) => this.setState({Task_title: Task_title.trimLeft()}, () => {
                                                    console.log("###ANIMATED TEXTINPUT: ", this.state.Task_title)
                                                    if(this.state.Task_title !== ''){
                                                        this.setState({taskTitleError: false})
                                                    }else{
                                                        this.setState({Task_title: '', taskTitleError: true}, () => Keyboard.dismiss())
                                                    }
                                                    })}
                                                    clearText={() => this.setState({Task_title: '', taskTitleError: true})}
                                                    containerColor={[(createTask && taskTitleError)? 'red' : '#C4C4C4', (createTask && taskTitleError)? 'red' : '#C4C4C4']}
                                                    containerBorderWidth={[(createTask && taskTitleError)? 2 : 1, 1]}
                                                    containerStyle={[{borderRadius: 1, justifyContent: 'center', borderStyle: (createTask && taskTitleError)? 'dashed' : 'solid'}, getWidthnHeight(86, 6.5)]}
                                                    style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2), paddingRight: "5%"}, getWidthnHeight(86, 6.5), getMarginHorizontal(1.5)]}
                                                    // iconSize={Math.floor(getWidthnHeight(5).width)}
                                                    // iconColor={'grey'}
                                                />
                                            </View>
                                            <View style={[{alignItems: 'center', marginTop: '5%'}, getWidthnHeight(93)]}>
                                               <FlatList 
                                                  data={priorityList.reverse()}
                                                  horizontal
                                                  keyExtractor={(item) => item.priority}
                                                  renderItem={({item, index}) => {
                                                      return (
                                                          <View style={{backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', marginHorizontal: Math.floor(getMarginHorizontal(1).marginHorizontal)}}>
                                                              <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center'}} activeOpacity={0.5} onPress={() => this.setState({priority: item.priority}, () => Keyboard.dismiss())}>
                                                                  <LinearGradient 
                                                                      start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                                                      colors={(this.state.priority === item.priority)? ["#039FFD", "#EA304F"] : ["#FFFFFF", "#FFFFFF"]}
                                                                      style={{
                                                                          alignItems: 'center', justifyContent: 'center', borderRadius: Math.floor(getWidthnHeight(8).width),  
                                                                          width: Math.floor(getWidthnHeight(16).width), height: Math.floor(getWidthnHeight(16).width), 
                                                                      }}
                                                                  >
                                                                      <View style={{
                                                                          width: Math.floor(getWidthnHeight(15).width), height: Math.floor(getWidthnHeight(15).width), 
                                                                          borderRadius: Math.floor(getWidthnHeight(8).width), backgroundColor: item.backgroundColor, 
                                                                          justifyContent: 'center', alignItems: 'center', borderColor: '#FFFFFF',
                                                                          borderWidth: getMarginLeft(1).marginLeft
                                                                      }}>
                                                                          <Text style={[{color: 'black', fontSize: (fontSizeH3().fontSize - 3)}]}>{item.priority}</Text>
                                                                      </View>
                                                                  </LinearGradient>
                                                                  <Text style={[{fontSize: (fontSizeH4().fontSize - 2)}]}>{item.severity}</Text>
                                                              </TouchableOpacity>
                                                          </View>
                                                      );
                                                  }}
                                               /> 
                                            </View>

                                            <View style={[{height: 1, backgroundColor: 'rgba(196, 196, 196, 0.25)', marginVertical: '5%'}, getWidthnHeight(86)]}/>

                                            <View style={[{alignItems: 'flex-start'}, getWidthnHeight(93)]}>
                                                <Text style={[{color: 'rgb(19,111,232)', marginLeft: '3%', fontWeight: 'bold'}, styles.boldFont, fontSizeH4()]}>ASSIGNEE DETAILS</Text>
                                            </View>

                                            <View style={{
                                                flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', width: getWidthnHeight(93).width, marginVertical: '5%'
                                            }}>
                                                <View style={[{
                                                    borderRadius: 1, borderStyle: (createTask && departmentError)? 'dashed' : 'solid', borderWidth: (createTask && departmentError)? 2 : 1,
                                                    borderColor: (createTask && departmentError) ? 'red' : '#C4C4C4'}, getWidthnHeight(42, 6.5)
                                                ]}>
                                                    <Dropdown
                                                        containerStyle={[{textOverflow:'hidden', borderColor: '#C4C4C4', borderWidth: 0}, getWidthnHeight(42), getMarginTop(-1)]}
                                                        inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getWidthnHeight(42)]}
                                                        data={this.state.departments}
                                                        value={this.state.valueDepartment}
                                                        valueExtractor={({id})=> id}
                                                        label={"Department"}
                                                        fontSize={fontSizeH4().fontSize + 2}
                                                        labelFontSize={fontSizeH4().fontSize - 3}
                                                        labelTextStyle={[getMarginLeft(1.5), getMarginTop(0)]}
                                                        baseColor={(this.state.departments_id)? "#039FFD" : '#C4C4C4'}
                                                        labelExtractor={({name})=> name}
                                                        onChangeText={async(departments_id) => {
                                                            this.setState({ 
                                                                valueEmployee: 'Assignee', departments_id, 
                                                                departmentError: false, employees: [], 
                                                                employeeError: true
                                                            }, () => Keyboard.dismiss())
                                                            await this.departments_wise_employees();
                                                            this.setState({valueEmployee: ''})
                                                        }}
                                                    />
                                                </View>
                                                <View style={[{
                                                    borderRadius: 1, borderStyle: (createTask && employeeError)? 'dashed' : 'solid', borderWidth: (createTask && employeeError)? 2 : 1,
                                                    borderColor: (createTask && employeeError) ? 'red' : '#C4C4C4'}, getWidthnHeight(42, 6.5)
                                                ]}>
                                                    <Dropdown
                                                        containerStyle={[{textOverflow:'hidden', borderColor: '#C4C4C4', borderWidth: 0}, getWidthnHeight(42), getMarginTop(-1)]}
                                                        inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getWidthnHeight(42)]}
                                                        data={this.state.employees}
                                                        value={this.state.valueEmployee}
                                                        valueExtractor={({user_id}) => user_id}
                                                        labelExtractor={({fullname})=> fullname }
                                                        label={"Assignee"}
                                                        fontSize={fontSizeH4().fontSize + 2}
                                                        labelFontSize={fontSizeH4().fontSize - 3}
                                                        labelTextStyle={[getMarginLeft(1.5), getMarginTop(0)]}
                                                        baseColor={(this.state.employees_id)? "#039FFD" : '#C4C4C4'}
                                                        onChangeText={(employees_id) => this.setState({ employees_id, employeeError: false }, () => Keyboard.dismiss())}
                                                    />
                                                </View>
                                            </View>

                                            <View style={[{height: 1, backgroundColor: 'rgba(196, 196, 196, 0.25)', marginTop: '2%', marginBottom: '5%'}, getWidthnHeight(86)]}/>

                                            <View style={[{alignItems: 'flex-start'}, getWidthnHeight(93)]}>
                                                <Text style={[{color: 'rgb(19,111,232)', marginLeft: '3%', fontWeight: 'bold'}, styles.boldFont, fontSizeH4()]}>DUE DATE</Text>
                                            </View>

                                            <View style={[{alignItems: 'center', marginTop: '2%', marginBottom: '2%'}, getWidthnHeight(86)]}>
                                                {/* <DatePicker
                                                    customStyles={{dateInput: {borderWidth: 0}}}
                                                    style={[{
                                                        borderColor: (createTask && dateError)? 'red' : '#C4C4C4', borderWidth: (createTask && dateError)? 2 : 1,
                                                        paddingVertical: '1%', borderStyle: (createTask && dateError)? 'dashed' : 'solid', borderRadius: 1
                                                    }, getWidthnHeight(42, 6)]}
                                                    date={this.state.Due_date}
                                                    mode="date"
                                                    placeholder="Date"
                                                    format="DD-MM-YYYY"
                                                    minDate="2016-01"
                                                    maxDate="2022-12"
                                                    confirmBtnText="Confirm"
                                                    cancelBtnText="Cancel"
                                                    onDateChange={(date) => {this.setState({Due_date: date, dateError: false}, () => Keyboard.dismiss())}}
                                                /> */}
                                                <View style={[{borderColor: 'red', borderWidth: 0}, getWidthnHeight(42, 6)]}>
                                                    <TouchableOpacity 
                                                        onPress={() => this.setState({showFromDatePicker: !showFromDatePicker})}
                                                    >
                                                        <View 
                                                            style={[{
                                                                alignItems: 'center', justifyContent: 'center',
                                                                borderColor: (createTask && dateError)? 'red' : '#C4C4C4', borderWidth: (createTask && dateError)? 2 : 1,
                                                                borderStyle: (createTask && dateError)? 'dashed' : 'solid', borderRadius: 1
                                                            }, getWidthnHeight(42, 6)]}>
                                                            <Text style={[{color: (Due_date)? '#000000' : '#C4C4C4', fontSize: (fontSizeH4().fontSize + 2)}]}>{Due_date || 'Select Date'}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                    {(showFromDatePicker) && (
                                                        <DateTimePicker 
                                                            styleBox={{flex: 1}}
                                                            date={moment(fromTimeStamp).utc().toDate()}
                                                            androidMode='default'
                                                            mode='date'
                                                            is24Hour={false}
                                                            placeholder='Select Date'
                                                            format='DD-MM-YYYY'
                                                            minDate={fromMinDate}
                                                            maxDate={fromMaxDate}
                                                            onDateChange={(event, newDate) => {
                                                                if(event.type === "dismissed"){
                                                                    this.setState({showFromDatePicker: !showFromDatePicker})
                                                                    return;
                                                                }
                                                                this.setState({showFromDatePicker: !showFromDatePicker})
                                                                const fromTimeStamp = event.nativeEvent.timestamp;
                                                                this.setState({
                                                                    Due_date: moment(newDate).format("DD-MM-YYYY"), fromTimeStamp,
                                                                    showToDatePicker: false, dateError: false
                                                                }, () => {});
                                                                Keyboard.dismiss();
                                                            }} 
                                                        />
                                                    )}
                                                    <View style={styles.forDate}>
                                                        <Text style={[{fontSize: (fontSizeH4().fontSize - 4), color: '#1363DF', fontWeight: 'bold', textAlign: 'center'}, styles.boldFont]}>Due Date</Text>
                                                    </View>
                                                </View> 
                                            </View>

                                            <View style={[{height: 1, backgroundColor: 'rgba(196, 196, 196, 0.25)', marginVertical: '5%'}, getWidthnHeight(86)]}/>

                                            <View style={[{flexDirection: 'row', justifyContent: 'space-between'}, getWidthnHeight(93)]}>
                                                <Text style={[{color: 'rgb(19,111,232)', marginLeft: '3%', fontWeight: 'bold'}, styles.boldFont, fontSizeH4()]}>REMINDER</Text>
                                                <View style={{marginRight: '5%'}}>
                                                    <Slider 
                                                        activeColor={'#25A2F9'} 
                                                        value={(this.state.reminder === 'on')? true : false}
                                                        onSlide={() => this.Reminder()}
                                                        delay={300}
                                                    />
                                                </View>
                                            </View>

                                            <View style={[{alignItems:'center'}, getWidthnHeight(93)]}>
                                                <View style={[{flexDirection: 'row', justifyContent: 'space-between', borderColor: 'lightgrey', borderWidth: 0}, getWidthnHeight(86)]}>
                                                    {(this.state.reminder === 'on') &&
                                                        <View style={[{
                                                            borderRadius: 1, borderStyle: (createTask && frequencyError)? 'dashed' : 'solid', borderWidth: (createTask && frequencyError)? 2 : 1,
                                                            borderColor: (createTask && frequencyError) ? 'red' : '#C4C4C4', marginTop: '5%', marginBottom: '2%'}, getWidthnHeight(42, 6.5)
                                                        ]}>
                                                            <Dropdown
                                                                containerStyle={[{textOverflow:'hidden', borderColor: '#C4C4C4', borderWidth: 0}, getWidthnHeight(42), getMarginTop(-1)]}
                                                                inputContainerStyle={[{borderBottomWidth: 0, borderBottomColor: '#C4C4C4', paddingHorizontal: 5 }, getWidthnHeight(42)]}
                                                                data={reminder_dropdown}
                                                                value={this.state.valueFrequency}
                                                                // valueExtractor={({user_id}) => user_id}
                                                                // labelExtractor={({fullname})=> fullname }
                                                                label={"Frequency"}
                                                                fontSize={fontSizeH4().fontSize + 2}
                                                                labelFontSize={fontSizeH4().fontSize - 3}
                                                                labelTextStyle={[getMarginLeft(1.5), getMarginTop(0)]}
                                                                baseColor={(this.state.reminder_dropdown)? "#039FFD" : '#C4C4C4'}
                                                                onChangeText={(reminder_dropdown) =>{
                                                                    if(reminder_dropdown==='Twice per day'){
                                                                        this.setState({reminder_dropdown:'0.5'})
                                                                    }
                                                                    if(reminder_dropdown==='Once everyday'){
                                                                        this.setState({reminder_dropdown:'1'})
                                                                    }
                                                                    if(reminder_dropdown==='Once every 2 days'){
                                                                        this.setState({reminder_dropdown:'5'})
                                                                    }
                                                                    if(reminder_dropdown==='Once every 5 days'){
                                                                        this.setState({reminder_dropdown:'7'})
                                                                    }
                                                                    if(reminder_dropdown==='Once every 10 days'){
                                                                        this.setState({reminder_dropdown:'15'})
                                                                    }
                                                                    if(reminder_dropdown==='Once every month'){
                                                                        this.setState({reminder_dropdown:'30'})
                                                                    }
                                                                    this.setState({frequencyError: false}, () => Keyboard.dismiss())
                                                                }}
                                                            />
                                                        </View>
                                                    }
                                                    {(this.state.reminder === 'on') &&
                                                        <View style={{
                                                            marginTop: '5%', marginBottom: '2%', justifyContent: 'space-between', borderWidth: (createTask && reminderTypeError)? 2 : 1, borderRadius: 1,
                                                            borderColor: (createTask && reminderTypeError)? 'red' : 'transparent', borderStyle: (createTask && reminderTypeError)? 'dashed' : 'solid'
                                                        }}>
                                                            <View style={[{flexDirection: 'row', alignItems: 'center',borderLeftWidth: 0, borderRightWidth: 0,borderColor: 'lightgrey'}, getWidthnHeight(30)]}>
                                                                <TouchableOpacity onPress={context.Notification}>
                                                                    {(this.state.reminder_notification=== 'off') &&
                                                                        <Image source={require('../Image/unchecked.png')} style={{ width: getWidthnHeight(6).width, height: getWidthnHeight(6).width, marginLeft:wp(0) }}/>
                                                                    }
                                                                    {(this.state.reminder_notification=== 'on') &&
                                                                        <Image source={require('../Image/checked.png')} style={{ width: getWidthnHeight(6).width, height: getWidthnHeight(6).width, marginLeft: wp(0) }}/>
                                                                    }
                                                                </TouchableOpacity> 
                                                                <Text style={[{color:'rgb(19,111,232)'}, fontSizeH4()]}>Notification</Text>
                                                            </View>   
                                                            <View style={[{flexDirection: 'row',  alignItems: 'center',borderWidth: 0, borderColor: 'pink'}, getWidthnHeight(30)]}>
                                                                <TouchableOpacity onPress={context.Mail}>
                                                                    {(this.state.reminder_mail=== 'off') &&
                                                                        <Image source={require('../Image/unchecked.png')} style={{ width: getWidthnHeight(6).width, height: getWidthnHeight(6).width, marginLeft:wp(0) }}/>
                                                                    }
                                                                    {(this.state.reminder_mail=== 'on') &&
                                                                        <Image source={require('../Image/checked.png')} style={{ width: getWidthnHeight(6).width, height: getWidthnHeight(6).width, marginLeft: wp(0) }}/>
                                                                    }
                                                                </TouchableOpacity> 
                                                                <Text style={[{color:'rgb(19,111,232)'}, fontSizeH4()]}>WhatsApp</Text>
                                                            </View>
                                                        </View>
                                                    }
                                                </View>
                                            </View>

                                            <View style={[{height: 1, backgroundColor: 'rgba(196, 196, 196, 0.25)', marginTop: '5%'}, getWidthnHeight(86)]}/>

                                            <View style={{marginVertical: '5%'}}>
                                                <View style={[{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}, getWidthnHeight(93)]}>
                                                    <View style={[getWidthnHeight(42)]}>
                                                        <TouchableOpacity activeOpacity={0.6} onPress={this.SingleFilePicker.bind(this)}>
                                                            <View style={[{flexDirection: 'row', alignItems: 'center', marginLeft: '5%'}]}>
                                                                <Upload name='file-upload-outline' size={getWidthnHeight(8).width} color='rgb(19,111,232)'/>
                                                                <Text style={[{color: 'rgb(19,111,232)'}, fontSizeH4()]}>UPLOAD FILE</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View style={[{alignItems: 'flex-end'}, getWidthnHeight(42)]}>
                                                        <TouchableOpacity 
                                                            style={{marginRight: '7%'}} 
                                                            activeOpacity={0.6} 
                                                            onPress={() => this.setState({singleFileOBJ: ''}, () => Keyboard.dismiss())}
                                                        >
                                                            <View style={[{flexDirection: 'row', alignItems: 'center', marginLeft: '5%'}]}>
                                                                <Upload name='delete' size={getWidthnHeight(9).width} color={(this.state.singleFileOBJ === '')? '#C4C4C4' : '#CD113B'}/>
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                                {(this.state.singleFileOBJ !== '') && 
                                                    <View style={[{alignItems: 'center', marginTop: '2%'}, getWidthnHeight(93)]}>
                                                        <Text numberOfLines={1} style={{color: 'rgb(19,111,232)',textAlign:'center'}}>
                                                            {this.state.singleFileOBJ.name}
                                                        </Text>
                                                    </View>
                                                }
                                            </View>
                                        
                                            <View style={{flexDirection:'column', marginTop: '3%', marginBottom: '5%', alignItems: 'center'}}>
                                                <AnimatedTextInput 
                                                    placeholder=" Description "
                                                    placeholderColor={['#C4C4C4', '#0B8EE8']}
                                                    value={this.state.Task_Description}
                                                    multiline={true}
                                                    maxLength={190}
                                                    numberOfLines={4}
                                                    slideVertical={[0, getWidthnHeight(undefined, -5).height]}
                                                    slideHorizontal={[0, getWidthnHeight(-2).width]}
                                                    placeholderScale={[1, 0.75]}
                                                    autoFocus={false}
                                                    onChangeText={(Task_Description) => {
                                                        this.setState({ Task_Description: Task_Description.trimLeft() }, () => {
                                                            const {Task_Description} = this.state;
                                                            if(Task_Description !== ''){
                                                                this.setState({descriptionError: false})
                                                            }else{
                                                                this.setState({Task_Description: '', descriptionError: true}, () => Keyboard.dismiss())
                                                            }
                                                        })
                                                    }}
                                                    clearText={() => this.setState({Task_Description: '', descriptionError: true})}
                                                    containerColor={[(createTask && descriptionError)? 'red' : '#C4C4C4', (createTask && descriptionError)? 'red' : '#C4C4C4']}
                                                    containerBorderWidth={[(createTask && descriptionError)? 2 : 1, 1]}
                                                    containerStyle={[{
                                                        borderRadius: 1, justifyContent: 'center', borderStyle: (createTask && descriptionError)? 'dashed' : 'solid',
                                                    }, getWidthnHeight(86, 10)]}
                                                    style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(86, 10), getMarginHorizontal(1.5)]}
                                                />
                                            </View>
                                        </ScrollView>
                                        <View style={[{backgroundColor: 'white', alignItems: 'center', justifyContent: 'space-between'}, getWidthnHeight(100, 8)]}>
                                            <View style={[{position: 'absolute', height: 1, backgroundColor: 'rgba(19,111,232,0.6)'}, getWidthnHeight(80)]}/>
                                            <View style={[{alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(100, 7)]}>
                                                <TouchableOpacity 
                                                    activeOpacity={0.6} 
                                                    style={[{flexDirection: 'row', alignItems:'center', justifyContent: 'center'}, getWidthnHeight(40, 5.5)]} 
                                                    onPress={()=> {
                                                        this.confirmNoError();
                                                }}>
                                                    <View style={[{
                                                        backgroundColor: 'rgb(19,111,232)', borderRightWidth: 2, borderRightColor: '#FFFFFF', borderTopLeftRadius: getWidthnHeight(2).width,
                                                        borderBottomLeftRadius: getWidthnHeight(2).width
                                                    }, getWidthnHeight(5, 5.5)]}/>
                                                    <View style={[{backgroundColor: 'rgb(19,111,232)', alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(30, 5.5)]}>
                                                        <Text style={{fontSize: (fontSizeH4().fontSize + 2), color:'white'}}>CREATE TASK</Text>
                                                    </View>
                                                    <View style={[{
                                                        backgroundColor: 'rgb(19,111,232)', borderLeftWidth: 2, borderLeftColor: '#FFFFFF', borderTopRightRadius: getWidthnHeight(2).width,
                                                        borderBottomRightRadius: getWidthnHeight(2).width
                                                        }, getWidthnHeight(5, 5.5)]}/>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </KeyboardAvoidingView>
                                </View>
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
        boldFont: {
            ...Platform.select(
                {
                    android: {
                        fontFamily: ''
                    }
                }
            )
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
        forDate: {
            position: 'absolute',
            backgroundColor: 'white',
            justifyContent: 'center', 
            //alignSelf: 'center', 
            borderColor: 'black', 
            borderWidth: 0, 
            marginTop: getMarginTop(-1).marginTop, 
            width: 50, 
            height: 16,
            marginLeft: 10,
        }
    });
