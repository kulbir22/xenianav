import React from 'react';
import {  Image } from 'react-native';
import { Provider, useSelector } from 'react-redux';
import Gradient from 'react-native-linear-gradient';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AppLoading from './src/LoadingScreen';
import LoginPage from './src/LoginPage';
import WelcomePage from './src/Dash Board/Welcomepage';
import DashboardNotifications from './src/ScrollBar/Notifications';
import Birthdays from './src/ScrollBar/Birthdays';

import MyProfile from './src/Dash Board/MyProfile';

import CameraScreen from './src/Attendance Module/CameraScreen';

import CameraPage from './src/Attendance Module/CameraPage';
import Checkoutpage from './src/Attendance Module/checkOutPage';


import Monthlyreport from './src/Attendance Management/My_Attendance';
import AttendanceDetail from './src/Attendance Management/Team_Attendance';
import Leaves from './src/Attendance Management/Employee_Attendance';

import ApplyLeave from './src/Leave Management/Apply-Leave';
import AppliedLeaves from './src/Leave Management/Applied_Leave';
import AppliedLeaveDetailPage from './src/Leave Management/appliedLeaveDetailPage';
import Approve_leave from './src/Leave Management/Approve_leave';

import ApplyLeaveEWF from './src/Ewf/LeaveManagement/ApplyLeave';
import AppliedLeavesEWF from './src/Ewf/LeaveManagement/AppliedLeave';

import AddTask from './src/Task Management/Add task';
import Task_self_team from './src/Task Management/assignTask_self_team';
import Approval_date_Extension_List from './src/Task Management/Approval date Extension List';
import Task from './src/Task Management/Task';
import TaskDateExtension from './src/Task Management/request date extension';
import Requested_date_Extension_List from './src/Task Management/Requested date extension list';
import TaskOverViewComment from './src/Task Management/task_overview_comment_screen';
import TaskOverViewUpdate from './src/Task Management/task_overview_update_screen';
import TaskOverViewHistory from './src/Task Management/task_overview_history_screen';

import CreateNewLead from './src/Lead/CreateNewLead';
import CreatedLeads from './src/Lead/CreatedLeads';
import ViewLead from './src/Lead/ViewLead';
import LeadComments from './src/Lead/LeadComments';
import ListOfLeads from './src/Lead/ListOfLeads';
import MDViewLead from './src/Lead/MDViewLead'; 
import AssignedLeads from './src/Lead/AssignedLeads';
import UnassignedLeads from './src/Lead/UnassignedLeads';
import RecommendedLead from './src/Lead/RecommendedLead';
import EditLead from './src/Lead/EditLead';

import Pre_Approval_Form from './src/Manage-Travel/Pre-Approval-Form';
import Travel_Approvals from './src/Manage-Travel/Travel-Approvals';
import Claim_Requests from './src/Manage-Travel/Claim-Requests';
import ImprestRequests from './src/Manage-Travel/ImprestRequests';
import PayImprest from './src/Manage-Travel/PayImprest';
import View_Travel from './src/Manage-Travel/View-Travel';
import EditTravel from './src/Manage-Travel/EditTravel';
import Claim_Form_Travel from './src/Manage-Travel/Claim-Form-Travel';
import Edit_Claim_Form from './src/Manage-Travel/EditClaimForm';
import View_claim from './src/Manage-Travel/View-claim';

import TicTacToe from './src/Games/Tictactoe';

import StepCount from './src/Fitness/StepCount';

import HolidayList from './src/HolidayList';

import SalarySlipXM from './src/SalarySlip/SalarySlip';

import CustomDrawer from './src/Drawer/CustomDrawer2';

import WelcomePortal from './src/Onboarding/WelcomePortal';
import BasicDetails from './src/Onboarding/Registration';
import ProfessionalDetails from './src/Onboarding/ProfessionalDetails';
import EmergencyDetails from './src/Onboarding/EmergencyDetails';
import PFForm from './src/Onboarding/PFForm';
import ESIForm from './src/Onboarding/ESIForm';
import PFDeclaration from './src/Onboarding/PFDeclaration';
import OnboardingDeclaration from './src/Onboarding/E-onboardingDeclaration';

import TestScreen from './src/test/Test';
import AnotherTest from './src/test/AnotherTest';
import SwipeTest from './src/test/SwipeTest';
import TestInputText from './src/test/TestInputText';
import LoginTestPage from './src/test/LoginTestPage';
import HTML from './src/test/html';

import { store } from './src/store/redux/store';

import { fontSizeH4, getMarginLeft, getMarginRight, getMarginTop, getWidthnHeight } from './src/NewComponents/common';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();


const COLOR1 = "#039FFD";
const COLOR2 = "#EA304F";

const appProject = "Elite Workforce";

export default function App(){

    function DrawerComponent(){ 
        const { serverLabel } = useSelector((state) => state.reduxState);
        return (
            <Drawer.Navigator
                initialRouteName='Home'
                screenOptions={({navigation}) => ({
                    headerShown: true,
                    unmountOnBlur: true,
                    drawerActiveBackgroundColor: '#2FA2F6',
                    drawerActiveTintColor: 'white',
                    drawerInactiveBackgroundColor: 'white',
                    drawerInactiveTintColor: 'black',
                    drawerLabelStyle: { fontWeight: 'bold', paddingHorizontal: 10},
                    headerBackground: () => (
                        <Gradient 
                            start={{x: 0, y: 1}} end={{x: 1, y: 1.5}}
                            colors={[COLOR1, COLOR2]}
                            style={[{alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'}]}
                        />
                    ),
                    headerTintColor: 'white',
                    // headerLeftContainerStyle: {alignItems: 'center', borderWidth: 1, borderColor: 'cyan'},
                    headerLeft: () => (
                        <Entypo 
                            style={[{borderWidth: 0, borderColor: 'cyan'}, getMarginLeft(3)]} 
                            name='menu' size={getWidthnHeight(12).width} 
                            color='white' onPress={() => navigation.toggleDrawer()}
                        />
                    ),
                    headerRight: () => serverLabel
                })}
                drawerContent={(props) => (
                    <CustomDrawer 
                        {...props} 
                    />
                )}
            >
                <Drawer.Screen 
                    name='Home' 
                    component={WelcomePage}
                    options={({navigation}) => ({
                        headerShown: true,
                        unmountOnBlur: false,
                        drawerLabel: 'Home',
                        title: '',
                        drawerLabelStyle: {...getMarginLeft(-5), fontWeight: 'bold'},
                        drawerIcon: () => (
                            <Image 
                                style={[{
                                    width: getWidthnHeight(5.5).width, height: getWidthnHeight(5.5).width
                                }, getMarginLeft(3)]} 
                                resizeMode="contain" source={require('./src/Image/home.png')} 
                            />
                        ),
                        headerTintColor: 'white',
                        drawerItemStyle: {...getMarginTop(1.5)},
                    })}
                    
                />
                

                {AttendanceModule()}

                {LeaveManagement()}

                {TaskManagement()}

                {Lead()}

                {TravelManagement()}

                {Game()}

                {StepCountFunction()}

                {Holiday()}

                {SalarySlip()}

                {Testing()}

            </Drawer.Navigator>
        );
    }

    function AttendanceModule(){
        return (
            <Drawer.Group screenOptions={{headerShown: true, headerTitleAlign: 'center',}}>
                <Drawer.Screen name="MyAttendance" component={Monthlyreport}/>
                <Drawer.Screen name="AttendanceSheet" component={AttendanceDetail}/>
                <Drawer.Screen name="VerifyAttendance" component={Leaves} />
            </Drawer.Group>
        );
    }

    function LeaveManagement(){
        const { project } = useSelector((state) => state.reduxState);
        console.log("#### REDUX PROJECT: ", project)
        return (
            <Drawer.Group
                screenOptions={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    drawerLabelStyle: {...getMarginLeft(-5), fontWeight: 'bold'},
                    headerTintColor: 'white',
                    headerLeftContainerStyle: {marginLeft: getMarginLeft(3).marginLeft},
                }}
            >
                <Drawer.Screen 
                    name='ApplyForLeave' 
                    component={(appProject !== project)? ApplyLeave : ApplyLeaveEWF}
                    options={({navigation, route}) => ({
                        drawerLabel: 'Apply For Leave',
                        title: 'Apply For Leave'
                    })}
                />
                <Drawer.Screen 
                    name='AppliedLeaves' 
                    component={(appProject !== project)? AppliedLeaves : AppliedLeavesEWF}
                    options={({navigation, route}) => ({
                        drawerLabel: 'Applied Leaves',
                        title: 'Applied Leaves'
                    })}
                />
                <Drawer.Screen 
                    name="AppliedLeaveDetailPage" 
                    component={AppliedLeaveDetailPage} 
                    options={({navigation, route}) => ({
                        drawerLabel: 'Applied Leave Details',
                        title: 'Applied Leave Details'
                    })}
                />
                <Drawer.Screen 
                    name="ApprovesLeaves" 
                    component={Approve_leave} 
                    options={({navigation, route}) => ({
                        drawerLabel: 'Approve Leaves List',
                        title: 'Approve Leaves List'
                    })}
                />
            </Drawer.Group>
        );
    }

    function TaskManagement(){
        return (
            <Drawer.Group
                screenOptions={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                }}
            >
                <Drawer.Screen name="AddTask" component={AddTask} />
                <Drawer.Screen name="CreatedTasks" component={Task_self_team} />
                <Drawer.Screen name="ApproveDateExtensions" component={Approval_date_Extension_List} />
                <Drawer.Screen name="MyTask" component={Task} /> 
                <Drawer.Screen name="RequestDateExtension" component={TaskDateExtension} />
                <Drawer.Screen name="RequestedDateExtension" component={Requested_date_Extension_List} />
            </Drawer.Group>
        );
    }

    function Lead(){
        return (
            <Drawer.Group
                screenOptions={{headerShown: true, headerTitleAlign: 'center',}}
            >
                <Drawer.Screen name="CreateNewLead" component={CreateNewLead} />
                <Drawer.Screen name="CreatedLeads" component={CreatedLeads} />
                <Drawer.Screen name="ListOfLeads" component={ListOfLeads} />
                <Drawer.Screen name="AssignedLeads" component={AssignedLeads} />
                <Drawer.Screen name="UnassignedLeads" component={UnassignedLeads} />
                <Drawer.Screen name="RecommendedLead" component={RecommendedLead} />
            </Drawer.Group>
        );
    }

    function TravelManagement(){
        return (
            <Drawer.Group screenOptions={{headerShown: true, headerTitleAlign: 'center'}}>
                <Drawer.Screen name="PreApprovalForm" component={Pre_Approval_Form}/>
                <Drawer.Screen name="TravelApprovals" component={Travel_Approvals}/>
                <Drawer.Screen name="ClaimRequests" component={Claim_Requests}/>
                <Drawer.Screen name="ImprestRequests" component={ImprestRequests}/>
            </Drawer.Group>
        );
    }

    function Game(){
        return (
            <Drawer.Screen name="tictactoe" component={TicTacToe}/>
        );
    }

    function StepCountFunction(){
        return (
            <Drawer.Screen options={{headerShown: true, headerTitleAlign: 'center'}} name="StepCount" component={StepCount}/>
        );
    }

    function Holiday(){
        return (
            <Drawer.Screen options={{headerShown: true, headerTitleAlign: 'center'}} name="HolidayList" component={HolidayList}/>
        );
    }

    function SalarySlip(){
        return (
            <Drawer.Screen options={{headerShown: true, headerTitleAlign: 'center'}} name="SalarySlipXM" component={SalarySlipXM} />
        );
    }

    function AppLoadingStack(){
        return (
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen 
                    name="loader" 
                    component={AppLoading} 
                />
            </Stack.Navigator>
        );
    }

    function AuthStack() {
        return (
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
                id='LoginStack'
            >
                <Stack.Screen 
                    name='login' 
                    component={LoginPage} 
                />
                {Onboarding()}  
            </Stack.Navigator>
        );
    }

    function AuthenticatedDrawer() {
        const { serverLabel } = useSelector((state) => state.reduxState);
        return (
            <Drawer.Navigator
                initialRouteName='Home'
                screenOptions={({navigation}) => ({
                    headerShown: true,
                    unmountOnBlur: true,
                    drawerActiveBackgroundColor: '#2FA2F6',
                    drawerActiveTintColor: 'white',
                    drawerInactiveBackgroundColor: 'white',
                    drawerInactiveTintColor: 'black',
                    drawerLabelStyle: { fontWeight: 'bold', paddingHorizontal: 10},
                    headerBackground: () => (
                        <Gradient 
                            start={{x: 0, y: 1}} end={{x: 1, y: 1.5}}
                            colors={[COLOR1, COLOR2]}
                            style={[{alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'}]}
                        />
                    ),
                    headerTintColor: 'white',
                    // headerLeftContainerStyle: {alignItems: 'center', borderWidth: 1, borderColor: 'cyan'},
                    headerLeft: () => (
                        <Entypo 
                            style={[{borderWidth: 0, borderColor: 'cyan'}, getMarginLeft(3)]} 
                            name='menu' size={getWidthnHeight(12).width} 
                            color='white' onPress={() => navigation.toggleDrawer()}
                        />
                    ),
                    headerRight: () => serverLabel
                })}
                drawerContent={(props) => (
                    <CustomDrawer 
                        {...props} 
                    />
                )}
                id={'RootDrawer'}
            >
                <Drawer.Screen 
                    name='Home' 
                    component={WelcomePage}
                    options={({navigation}) => ({
                        headerShown: true,
                        unmountOnBlur: false,
                        drawerLabel: 'Home',
                        title: '',
                        drawerLabelStyle: {...getMarginLeft(-5), fontWeight: 'bold'},
                        drawerIcon: () => (
                            <Image 
                                style={[{
                                    width: getWidthnHeight(5.5).width, height: getWidthnHeight(5.5).width
                                }, getMarginLeft(3)]} 
                                resizeMode="contain" source={require('./src/Image/home.png')} 
                            />
                        ),
                        headerTintColor: 'white',
                        drawerItemStyle: {...getMarginTop(1.5)},
                    })}
                    
                />
                
                {AttendanceModule()}

                {LeaveManagement()}

                {TaskManagement()}

                {Lead()}

                {TravelManagement()}

                {Game()}

                {StepCountFunction()}

                {Holiday()}

                {SalarySlip()}

                {Testing()}

                <Drawer.Screen options={{headerShown: false}} name='DrawerStack' component={AuthenticatedStack}/>

            </Drawer.Navigator>
        );
    }

    function AuthenticatedStack(){
        const { serverLabel } = useSelector((state) => state.reduxState);
        return (
            <Stack.Navigator
                screenOptions={({navigation}) => ({
                    headerShown: false,
                    headerRight: () => serverLabel,
                    headerLeft: () => (
                        <Ionicons 
                            style={[{borderWidth: 0, borderColor: 'cyan'}]} 
                            name='arrow-back' size={getWidthnHeight(8).width} 
                            color='white' onPress={() => navigation.goBack()}
                        />
                    ),
                })}
            >
                <Stack.Screen name="camera" component={CameraScreen} />
                <Stack.Group 
                    screenOptions={{
                        headerShown: true,
                        headerTitleAlign: 'center',
                        headerBackground: () => (
                            <Gradient 
                                start={{x: 0, y: 1}} end={{x: 1, y: 1.5}}
                                colors={[COLOR1, COLOR2]}
                                style={[{alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'}]}
                            />
                        ),
                        headerTintColor: 'white',
                    }}
                >
                    {/* CHECK IN and CHECK OUT - STACK */}
                    <Stack.Screen name="cameraPage" component={CameraPage}/>
                    <Stack.Screen name="CheckOut" component={Checkoutpage}/>

                    {/* DASHBOARD SCREENS - STACK */}
                    <Stack.Screen name="My_Profile" component={MyProfile}/>
                    <Stack.Screen name="DashboardNotifications" component={DashboardNotifications}/>
                    <Stack.Screen name="Birthdays" component={Birthdays}/>

                    {/* LEAD MANAGEMENT - STACK */}
                    <Stack.Screen name="ViewLead" component={ViewLead} />
                    <Stack.Screen name="MDViewLead" component={MDViewLead} />
                    <Stack.Screen name="LeadComments" component={LeadComments} />
                    <Stack.Screen name="LeadEdit" component={EditLead} />

                    {/* TRAVEL MANAGEMENT - STACK */}
                    <Stack.Screen name="View_Travel" component={View_Travel}/>
                    <Stack.Screen name="PayImprest" component={PayImprest}/>
                    <Stack.Screen name="View_claim" component={View_claim}/>
                    <Stack.Screen name="EditTravel" component={EditTravel}/>
                    <Stack.Screen name="Claim_Form_Travel" component={Claim_Form_Travel}/>
                    <Stack.Screen name="Edit_Claim_Form" component={Edit_Claim_Form}/>

                    {/* TASK MANAGEMENT - STACK */}
                    <Stack.Screen name="taskOverViewComment" component={TaskOverViewComment} />
                    <Stack.Screen name="taskOverViewUpdate" component={TaskOverViewUpdate} />
                    <Stack.Screen name="taskOverViewHistory" component={TaskOverViewHistory} />
                </Stack.Group>
            </Stack.Navigator>
        );
    }

    function Onboarding(){
        return (
            <>
                <Stack.Screen name="WelcomePortal" component={WelcomePortal} />
                <Stack.Screen name="BasicDetails" component={BasicDetails} />
                <Stack.Screen name="ProfessionalDetails" component={ProfessionalDetails} />
                <Stack.Screen name="EmergencyDetails" component={EmergencyDetails} />
                <Stack.Screen name="PFForm" component={PFForm} />
                <Stack.Screen name="ESIForm" component={ESIForm} />
                <Stack.Screen name="PFDeclaration" component={PFDeclaration} />
                <Stack.Screen name="OtherDetails" component={OnboardingDeclaration} />
            </>
        );
    }

    function Testing(){
        return (
            <>
                <Drawer.Screen name="TestScreen" component={TestScreen} />
                <Drawer.Screen name="AnotherTest" component={AnotherTest} />
                <Drawer.Screen name="HTMLView" component={HTML} />
                <Drawer.Screen name="LoginTestPage" component={LoginTestPage} />
                <Drawer.Screen name="SwipeTest" component={SwipeTest} />
                <Drawer.Screen name="TestInputText" component={TestInputText} />
            </>
        );
    }

    function Navigation({}) {
        return (
            <>
                <Provider store={store}>
                    <NavigationStack  />
                </Provider>
            </>
        );
    }

    function NavigationStack(){
        const { isLoggedIn } = useSelector((state) => state.reduxState);
        // console.log("**&&** NAVIGATION: ", isLoggedIn)
        return (
            <NavigationContainer>
                {(isLoggedIn === null) && (
                    <AppLoadingStack />
                )}
                {(isLoggedIn === false) && (
                    <AuthStack />
                )}
                {(isLoggedIn === true) && (
                    <AuthenticatedDrawer />
                )}
            </NavigationContainer>
        );
    }

    return <Navigation />;
}