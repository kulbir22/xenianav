import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import {Scene, Router, Drawer } from 'react-native-router-flux';
import LoadingScreen from './LoadingScreen';
import LoginPage from './LoginPage';
import WelcomePage from './Dash Board/Welcomepage';
import CameraPage from './Attendance Module/CameraPage';
import Checkoutpage from './Attendance Module/checkOutPage';
import DrawerMenu from './DrawerMenu';
import Monthlyreport from './Attendance Management/My_Attendance';
import AttendanceDetail from './Attendance Management/Team_Attendance';
import Leaves from './Attendance Management/Employee_Attendance';
import ApplyLeave from './Leave Management/Apply-Leave';
import LeaveSection from './Leave Management/Applied_Leave';
import AppliedLeaveDetailPage from './Leave Management/appliedLeaveDetailPage';
import Approve_leave from './Leave Management/Approve_leave';
import add_task from './Task Management/Add task';
import task_self_team from './Task Management/assignTask_self_team';
import Approval_date_Extension_List from './Task Management/Approval date Extension List';
import Task from './Task Management/Task';
import TaskDateExtension from './Task Management/request date extension';
import Requested_date_Extension_List from './Task Management/Requested date extension list';
import taskOverViewComment from './Task Management/task_overview_comment_screen';
import taskOverViewUpdate from './Task Management/task_overview_update_screen';
import taskOverViewHistory from './Task Management/task_overview_history_screen';
import taskOverViewComment_sec from './Task Management/task_overview_comment_screen_sec';
import taskOverViewUpdate_sec from './Task Management/task_overview_update_screen_sec';
import taskOverViewHistory_sec from './Task Management/task_overview_history_screen_sec';
import CreateNewLead from './Lead/CreateNewLead';
import CreatedLeads from './Lead/CreatedLeads';
import ViewLead from './Lead/ViewLead';
import LeadComments from './Lead/LeadComments';
import ListOfLeads from './Lead/ListOfLeads';
import MDViewLead from './Lead/MDViewLead'; 
import AssignedLeads from './Lead/AssignedLeads';
import UnassignedLeads from './Lead/UnassignedLeads';
import RecommendedLead from './Lead/RecommendedLead';
import EditLead from './Lead/EditLead';
import SalarySlipXM from './SalarySlip/SalarySlip';
import CreateTarget from './Target/CreateTarget';
import EditTarget from './Target/EditTarget';
import AchievedTarget from './Target/AchievedTarget';
import EditAchievedTarget from './Target/EditAchievedTarget';
import Report from './Target/Report';
import TeamReport from './Target/TeamReport';
import LocationTracker from './Target/LocationTracker';
import UnsavedTracks from './Target/UnsavedTracks';
import SavedLocations from './Target/SavedLocations';
import AdminTracker from './Target/AdminTracker';
import HolidaysList from './AartiFiles/Holidays/HolidaysList';
import SalarySlip from './AartiFiles/SalarySlip/SalarySlip';
import CameraScreen from './Attendance Module/CameraScreen';
import {getWidthnHeight} from './NewComponents/common';
import Pre_Approval_Form from './Manage-Travel/Pre-Approval-Form';
import Travel_Approvals from './Manage-Travel/Travel-Approvals';
import Claim_Requests from './Manage-Travel/Claim-Requests';
import ImprestRequests from './Manage-Travel/ImprestRequests';
import PayImprest from './Manage-Travel/PayImprest';
import View_Travel from './Manage-Travel/View-Travel';
import EditTravel from './Manage-Travel/EditTravel';
import Claim_Form_Travel from './Manage-Travel/Claim-Form-Travel';
import Edit_Claim_Form from './Manage-Travel/EditClaimForm';
import View_claim from './Manage-Travel/View-claim';
import TestScreen from './test/Test';
import AnotherTest from './test/AnotherTest';
import SwipeTest from './test/SwipeTest';
import TestInputText from './test/TestInputText';
import LoginTestPage from './test/LoginTestPage';
import HTML from './test/html';
import DashboardNotifications from './ScrollBar/Notifications';
import Birthdays from './ScrollBar/Birthdays';
import {sendProps} from './actions';
import MyProfile from './Dash Board/MyProfile';
import WelcomePortal from './Onboarding/WelcomePortal';
import BasicDetails from './Onboarding/Registration';
import ProfessionalDetails from './Onboarding/ProfessionalDetails';
import EmergencyDetails from './Onboarding/EmergencyDetails';
import PFForm from './Onboarding/PFForm';
import ESIForm from './Onboarding/ESIForm';
import PFDeclaration from './Onboarding/PFDeclaration';
import OnboardingDeclaration from './Onboarding/E-onboardingDeclaration';
import {drawerMenuWidth} from './api/BaseURL';
import CustomInventory from './CouponsProject/CustomInventory';
import IssueNewBook from './CouponsProject/IssueNewBook';
import SerialNumber from './CouponsProject/SerialNumber';
import SoldCoupons from './CouponsProject/SoldCoupons';
import CouponsLeft from './CouponsProject/CouponsLeft';
import ConsumedPaper from './CouponsProject/ConsumedPaper';
import AddPaperConsumption from './CouponsProject/AddPaperConsumptions';
import TicTacToe from './Games/Tictactoe';
import ApplyLeaveEWF from './Ewf/LeaveManagement/ApplyLeave';
import AppliedLeaveEWF from './Ewf/LeaveManagement/AppliedLeave';
import HolidayList from './HolidayList';
import StepCount from './Fitness/StepCount';

class RouterComponent extends Component{
    
    render(){
        const {width} = drawerMenuWidth;
        const userObj = JSON.parse(this.props.data.userObj);
        let showCouponProject = false;
        if(userObj){
            showCouponProject = userObj.success.hasOwnProperty('dashboard_ui')
            //console.log("$$$ SHOW ROUTER SCREEN: ", showCouponProject, userObj)
        }
    return (
        <Router>
            <Scene key="root" hideNavBar>
                <Scene key="auth" headerMode="none">
                    {/*===========LOGIN PAGE===========*/}
                    <Scene key="loading" initial component={LoadingScreen} options={{swipeEnabled: false}}/>
                    <Scene key="login" component={LoginPage} options={{swipeEnabled: false}}/>
                </Scene>
                
                {/*===========DRAWER MENU===========*/}
                <Drawer hideNavBar key="drawerMenu" drawerPosition="left" drawerWidth={width} contentComponent={DrawerMenu} >
                    <Scene key="main" hideNavBar>
                        
                        {/*===========WELCOME PAGE===========*/}
                        <Scene key="First" component={WelcomePage} initial={true} hideNavBar/>

                        {/*===========CHECK IN and CHECK OUT===========*/}
                        <Scene key="cameraPage" component={CameraPage} hideNavBar/>
                        <Scene key="CheckOut" component={Checkoutpage} hideNavBar/>

                        {/*===========ATTENDANCE MANAGEMENT===========*/}
                        <Scene key="MyAttendance" component={Monthlyreport} hideNavBar/>
                        <Scene key="AttendanceSheet" component={AttendanceDetail} hideNavBar/>
                        <Scene key="VerifyAttendance" component={Leaves} hideNavBar headerMode="none"/>

                        {/*===========CAMERA SCREEN===========*/}
                        <Scene key="camera" component={CameraScreen} hideNavBar headerMode="none"/>

                        {/*===========LEAVES MANAGEMENT===========*/}
                        <Scene key="ApplyForLeave" component={ApplyLeave} hideNavBar headerMode="none"/>
                        <Scene key="AppliedLeaves" component={LeaveSection} hideNavBar headerMode="none"/>
                        <Scene key="AppliedLeaveDetailPage" component={AppliedLeaveDetailPage} />
                        <Scene key="ApprovesLeaves" component={Approve_leave} hideNavBar headerMode="none"/>

                        {/*===========TASK MANAGEMENT===========*/}
                        <Scene key="AddTask" component={add_task} hideNavBar headerMode="none"/>
                        <Scene key="CreatedTasks" component={task_self_team} hideNavBar headerMode="none"/>
                        <Scene key="ApproveDateExtensions" component={Approval_date_Extension_List} hideNavBar headerMode="none"/>
                        <Scene key="MyTask" component={Task} hideNavBar headerMode="none"/> 
                        <Scene key="RequestDateExtension" component={TaskDateExtension} hideNavBar headerMode="none"/>
                        <Scene key="RequestedDateExtension" component={Requested_date_Extension_List} hideNavBar headerMode="none"/>
                        <Scene key="taskOverViewComment" component={taskOverViewComment} hideNavBar headerMode="none"/>
                        <Scene key="taskOverViewUpdate" component={taskOverViewUpdate} hideNavBar headerMode="none"/>
                        <Scene key="taskOverViewHistory" component={taskOverViewHistory} hideNavBar headerMode="none"/>
                        <Scene key="taskOverViewComment_sec" component={taskOverViewComment_sec} hideNavBar headerMode="none"/>
                        <Scene key="taskOverViewUpdate_sec" component={taskOverViewUpdate_sec} hideNavBar headerMode="none"/>
                        <Scene key="taskOverViewHistory_sec" component={taskOverViewHistory_sec} hideNavBar headerMode="none"/>

                        {/*===========NEW LEAD===========*/}
                        <Scene key="CreateNewLead" component={CreateNewLead} hideNavBar headerMode="none"/>
                        <Scene key="CreatedLeads" component={CreatedLeads} hideNavBar headerMode="none"/>
                        <Scene key="ViewLead" component={ViewLead} hideNavBar headerMode="none"/>
                        <Scene key="LeadComments" component={LeadComments} hideNavBar headerMode="none"/>
                        <Scene key="ListOfLeads" component={ListOfLeads} hideNavBar headerMode="none"/>
                        <Scene key="MDViewLead" component={MDViewLead} hideNavBar headerMode="none"/>
                        <Scene key="AssignedLeads" component={AssignedLeads} hideNavBar headerMode="none"/>
                        <Scene key="UnassignedLeads" component={UnassignedLeads} hideNavBar headerMode="none"/>
                        <Scene key="RecommendedLead" component={RecommendedLead} hideNavBar headerMode="none"/>
                        <Scene key="LeadEdit" component={EditLead} hideNavBar headerMode="none"/>

                        {/*===========LOADING SCREEN===========*/}
                        {/* {<Scene key="LoadingScreen" component={LoadingScreen} hideNavBar headerMode="none"/>} */}

                        {/*===========TARGET===========*/}
                        <Scene key="CreateTarget" component={CreateTarget} hideNavBar headerMode="none"/>
                        <Scene key="EditTarget" component={EditTarget} hideNavBar headerMode="none"/>
                        <Scene key="AchievedTarget" component={AchievedTarget} hideNavBar headerMode="none"/>
                        <Scene key="EditAchievedTarget" component={EditAchievedTarget} hideNavBar headerMode="none"/>
                        <Scene key="ReportLog" component={Report} hideNavBar headerMode="none"/>
                        <Scene key="TeamReport" component={TeamReport} hideNavBar headerMode="none"/>

                        {/*===========LOCATION TRACKER===========*/}
                        <Scene key="LocationTracker" component={LocationTracker} hideNavBar headerMode="none" />
                        <Scene key="UnsavedTracks" component={UnsavedTracks} hideNavBar headerMode="none"/>
                        <Scene key="SavedLocations" component={SavedLocations} hideNavBar headerMode="none"/>
                        <Scene key="AdminTracker" component={AdminTracker} hideNavBar headerMode="none"/>

                        {/*===========AARTI DRUGS HOLIDAYS LIST===========*/}
                        <Scene key="HolidaysList" component={HolidaysList} hideNavBar headerMode="none"/>

                        {/*===========XEAM SALARY SLIP===========*/}
                        <Scene key="SalarySlipXM" component={SalarySlipXM} hideNavBar headerMode="none"/>

                        {/*===========AARTI DRUGS SALARY SLIP===========*/}
                        <Scene key="SalarySlip" component={SalarySlip} hideNavBar headerMode="none"/>

                        {/*===========Manage Travel===========*/}
                        <Scene key="PreApprovalForm" component={Pre_Approval_Form} hideNavBar headerMode="none"/>
                        <Scene key="TravelApprovals" component={Travel_Approvals} hideNavBar headerMode="none"/>
                        <Scene key="ClaimRequests" component={Claim_Requests} hideNavBar headerMode="none"/>
                        <Scene key="ImprestRequests" component={ImprestRequests} hideNavBar headerMode="none"/>
                        <Scene key="PayImprest" component={PayImprest} hideNavBar headerMode="none"/>
                        <Scene key="View_Travel" component={View_Travel} hideNavBar headerMode="none"/>
                        <Scene key="EditTravel" component={EditTravel} hideNavBar headerMode="none"/>
                        <Scene key="Claim_Form_Travel" component={Claim_Form_Travel} hideNavBar headerMode="none"/>
                        <Scene key="Edit_Claim_Form" component={Edit_Claim_Form} hideNavBar headerMode="none"/>
                        <Scene key="View_claim" component={View_claim} hideNavBar headerMode="none"/>

                        {/*===========TEST SCREEN===========*/}
                        <Scene key="TestScreen" component={TestScreen} />
                        <Scene key="AnotherTest" component={AnotherTest} />
                        <Scene key="HTMLView" component={HTML} />
                        <Scene key="LoginTestPage" component={LoginTestPage} />
                        <Scene key="SwipeTest" component={SwipeTest} />
                        <Scene key="TestInputText" component={TestInputText} />

                        {/*===========MY PROFILE===========*/}
                        <Scene key="My_Profile" component={MyProfile}/>

                        <Scene key="StepCount" component={StepCount}/>
                
                        {/*===========DASHBOARD===========*/}
                        <Scene key="DashboardNotifications" component={DashboardNotifications}/>
                        <Scene key="Birthdays" component={Birthdays}/>

                        {/*===========COUPON===========*/}
                        <Scene key="issueNewBook" component={IssueNewBook} />
                        <Scene key="serialNumber" component={SerialNumber} />
                        <Scene key="soldCoupons" component={SoldCoupons} />
                        <Scene key="couponsLeft" component={CouponsLeft} />
                        <Scene key="consumedPaper" component={ConsumedPaper} />
                        <Scene key="addPaperConsumption" component={AddPaperConsumption} />

                        {/*=========== GAMES ===========*/}
                        <Scene key="tictactoe" component={TicTacToe}/>

                        {/*=========== EWF CHECK IN-OUT ===========*/}
                        <Scene key="applyLeaveEWF" component={ApplyLeaveEWF}/>
                        <Scene key="appliedLeaveEWF" component={AppliedLeaveEWF}/>

                        {/*=========== HOLIDAY LIST ===========*/}
                        <Scene key="HolidayList" component={HolidayList}/>

                        {/*===========LOGOUT PAGE===========*/}
                        {/* <Scene key="LogOutPage" component={LogOutPage}/> */}
                    </Scene>
                </Drawer>
                {/*===========ONBOARDING PORTAL===========*/}
                <Scene key="Onboarding"  hideNavBar>
                    <Scene key="WelcomePortal" component={WelcomePortal} initial={true}/>
                    <Scene key="BasicDetails" component={BasicDetails} gesturesEnabled={false}/>
                    <Scene key="ProfessionalDetails" component={ProfessionalDetails} gesturesEnabled={false}/>
                    <Scene key="EmergencyDetails" component={EmergencyDetails} gesturesEnabled={false}/>
                    <Scene key="PFForm" component={PFForm} gesturesEnabled={false}/>
                    <Scene key="ESIForm" component={ESIForm} gesturesEnabled={false}/>
                    <Scene key="PFDeclaration" component={PFDeclaration} gesturesEnabled={false}/>
                    <Scene key="OtherDetails" component={OnboardingDeclaration} gesturesEnabled={false}/>
                </Scene>

                {(!showCouponProject) &&
                    <Drawer hideNavBar key="customMenu" drawerPosition="left" drawerWidth={width} contentComponent={CustomInventory}>
                        <Scene key="coupons" hideNavBar>
                            <Scene key="issueNewBook" component={IssueNewBook} />
                            <Scene key="serialNumber" component={SerialNumber} />
                            <Scene key="soldCoupons" component={SoldCoupons} />
                            <Scene key="couponsLeft" component={CouponsLeft} />
                            <Scene key="consumedPaper" component={ConsumedPaper} />
                            <Scene key="addPaperConsumption" component={AddPaperConsumption} />
                        </Scene>
                    </Drawer>
                }
            </Scene>
        </Router>
        );
    }
};

const mapStateToProps = (state) => {
    //console.log("*****MAP STATE TO PROPS: ", state.props)
    return {data: state.props}
}

export default connect(mapStateToProps, {sendProps})(RouterComponent); 
//export default RouterComponent; 