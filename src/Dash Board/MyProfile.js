import React, {Component} from 'react';
import {
    StyleSheet, Text, LayoutAnimation,
    TouchableOpacity, View, Image, ScrollView,
    Dimensions, Alert, Linking, TouchableWithoutFeedback,
    Platform, BackHandler, Animated, Easing, FlatList
} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import moment from 'moment';
import User from 'react-native-vector-icons/FontAwesome';
import Project from 'react-native-vector-icons/FontAwesome';
import Contact from 'react-native-vector-icons/Foundation';
import Hr from 'react-native-vector-icons/FontAwesome5';
import EyeIcon from 'react-native-vector-icons/Feather';
import clamp from 'clamp';
import LinearGradient from 'react-native-linear-gradient';
import { 
    getWidthnHeight, MenuIcon, GradientText, WaveHeader, fontSizeH4, 
    CommonModal, IOS_StatusBar, Spinner, getMarginTop, getMarginRight, ListModal,
    AlertBox, getMarginLeft, getMarginVertical, InOutButton, AnimatedFlatList,
    getMarginHorizontal, fontSizeH1, fontSizeH3, GradientBorderBox, fontSize_H3, fontSizeH2
} from '../NewComponents/common';

    const SWIPE_THRESHOLD = getWidthnHeight(30).width;

    const userIcon = (iconColor) => (<User name="user" size={Math.floor(getWidthnHeight(7).width)} color={iconColor}/>)
    const project = (iconColor) => (<Project name="building" size={Math.floor(getWidthnHeight(7).width)} color={iconColor}/>)
    const contact = (iconColor) => (<Contact name="telephone" size={Math.floor(getWidthnHeight(7).width)} color={iconColor}/>)
    const hr = (iconColor) => (<Hr name="user-tie" size={Math.floor(getWidthnHeight(7).width)} color={iconColor}/>)

    const appContent = [
        {name: 'BASIC', color: '#F38523', icon: (color) => userIcon(color), id: 0},
        {name: 'PROJECT', color: '#EA2F54', icon: (color) => project(color), id: 1},
        {name: 'CONTACT', color: '#07BB56', icon: (color) => contact(color), id: 2},
        {name: 'HR', color: '#1593EA', icon: (color) => hr(color), id: 3},
    ]
    
    const attendanceIcon = (<Image source={require('../Image/atten.png')} style={{width: getWidthnHeight(7).width, height: getWidthnHeight(7).width}}/>)
    const taskIcon = (<Image source={require('../Image/task_2.png')} style={{width: getWidthnHeight(7).width, height: getWidthnHeight(7).width}}/>)
    const leadIcon = (<Image source={require('../Image/lead.png')} style={{width: getWidthnHeight(7).width, height: getWidthnHeight(7).width}}/>)

    let screenData = [];

    //const boxLength = getWidthnHeight(20).width + (getMarginHorizontal(3.5).marginHorizontal);
    const boxLength = getWidthnHeight(20).width;
    class MyProfile extends Component {
        constructor(props){
            super(props)
                this.state={
                    position: 0,
                    selectedIndex: 0,
                    selectAddress: 1,
                    showACNumber: false,
                    showIFSC: false,
                    showListModal: false,
                    modalTitle: '',
                    modalData: [],
                    animateHorizontal: new Animated.ValueXY(),
                    animateOpacity: new Animated.Value(1),
                    next: new Animated.Value(0.9),
                    catalogueData: [],
                }
        }

        setSelectedIndex(event){
            const viewSize = event.nativeEvent.layoutMeasurement.width;
            const contentOffset = event.nativeEvent.contentOffset.x;
            const selectedIndex = Math.round(contentOffset / viewSize);
            this.setState({selectedIndex}, () => {
                this.scrollRef.scrollToIndex({
                    animated: true,
                    index: this.state.selectedIndex
                })
            });
        }

        renderItem({item, index}){
            const {selectedIndex} = this.state;
            return (
                <View>
                    {(selectedIndex !== index)?
                        <View style={[{
                            borderWidth: 0, borderColor: 'red', justifyContent: 'space-evenly', width: getWidthnHeight(20).width, 
                            height: getWidthnHeight(20).width}, getMarginTop(1)]}
                        >
                            <TouchableOpacity onPress={() => this.setState({selectedIndex: index}, () => {
                                this.scrollRef.scrollToIndex({
                                    animated: true,
                                    index: this.state.selectedIndex
                                })
                            })}>
                                <View style={{alignItems: 'center'}}>
                                    <View style={{
                                        backgroundColor:'#D9E8FA', width: getWidthnHeight(13).width, height: getWidthnHeight(13).width, 
                                        borderWidth: 0, borderColor: 'red', borderRadius: getWidthnHeight(13).width, alignItems: 'center',
                                        justifyContent: 'center'}}>
                                        {item.icon('#227CE7')}
                                    </View>
                                    <Text style={{fontSize: fontSizeH4().fontSize}}>{item.name}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    :
                        <View style={[{
                            borderWidth: 0, borderColor: 'red', justifyContent: 'space-evenly', width: getWidthnHeight(20).width, 
                            height: getWidthnHeight(20).width}, getMarginTop(1)]}
                        >
                            <TouchableOpacity onPress={() => this.setState({selectedIndex: index}, () => {
                                this.scrollRef.scrollToIndex({
                                    animated: true,
                                    index: this.state.selectedIndex
                                })
                            })}>
                                <View style={{alignItems: 'center'}}>
                                    <View style={{
                                        backgroundColor:'#0B6DD4', width: getWidthnHeight(13).width, height: getWidthnHeight(13).width, 
                                        borderWidth: 0, borderColor: 'red', borderRadius: getWidthnHeight(13).width, alignItems: 'center',
                                        justifyContent: 'center'}}>
                                        {item.icon('rgba(255, 255, 255, 0.90)')}
                                    </View>
                                    <Text style={{fontSize: fontSizeH4().fontSize}}>{item.name}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    }
                    
                </View>
            );
        }

        getItemLayout(data, index){
            return {length: boxLength, offset: boxLength * index, index}
        }

        scrollLeft(){
            const {position} = this.state;
            if(position >= 0){
                this.setState({position: position - 1}, () => {
                    const {position} = this.state;
                    console.log("@@@ LEFT: ", position)
                    if(position < 0){
                        this.setState({position: 0}, () => {
                            const {position} = this.state;
                            console.log("@@@ RESET LEFT: ", position)
                        })
                        return;
                    }
                    this._refFlatList.scrollToIndex({animated: true, index: position})
                })
            }
        }

        scrollRight(){
            const {position} = this.state;
            if(position <= appContent.length - 1){
                this.setState({position: position + 1}, () => {
                    const {position} = this.state;
                    console.log("@@@ RIGHT: ", position)
                    if(position >= appContent.length){
                        this.setState({position: (appContent.length - 1)}, () => {
                            const {position} = this.state;
                            console.log("@@@ RESET RIGHT: ", position)
                        })
                        return;
                    }
                    this._refFlatList.scrollToIndex({animated: true, index: position})
                })
            }
        }

        render (){
            const userObj = JSON.parse(this.props.route.params.userObj)
            // console.log("### MY PROFILE: ", userObj)
            const {selectedIndex, selectAddress, showACNumber, showIFSC, showListModal, modalTitle, modalData, catalogueData} = this.state;
            const userImage = { uri: userObj?.success?.user?.employee?.profile_picture };
            const userName = userObj?.success?.user?.employee?.fullname;
            const empCode = userObj?.success?.user?.employee_code;
            //BASIC
            const dateOfJoining = userObj?.success?.user?.employee?.joining_date;
            const formatedDOJ = moment(dateOfJoining).format('DD MMM YYYY');
            const dateOfBirth = userObj?.success?.user?.employee?.birth_date;
            const formatedDOB = moment(dateOfBirth).format('DD MMM YYYY');
            const designation = userObj?.success?.user?.designation[0]['name'];
            const email = userObj?.success?.user?.email.toLowerCase();
            const phone = userObj?.success?.user?.employee?.mobile_number;
            const fathersName = userObj?.success?.user?.employee?.father_name;
            const mothersName = userObj?.success?.user?.employee?.mother_name;

            //PROJECT
            const userProject = userObj?.success?.project;
            const department = userObj?.success?.user?.department;
            let fromTime12Hr = '--';
            let toTime12Hr = '--';
            let probationPeriod = '--'
            if(userObj?.success?.user?.hasOwnProperty('employee_profile')){
                const fromTime24Hr = userObj?.success?.user?.employee_profile?.shift?.from_time;
                const toTime24Hr = userObj?.success?.user?.employee_profile?.shift?.to_time;
                fromTime12Hr = moment(fromTime24Hr, 'HH:mm').format('hh:mm A');
                toTime12Hr = moment(toTime24Hr, 'HH:mm').format('hh:mm A');
                probationPeriod = userObj?.success?.user?.employee_profile?.probation_approval_status;
            }
            const shiftTimings = `${fromTime12Hr} to ${toTime12Hr}`
            let sanctionOfficers = [];
            if(userObj?.success?.user?.hasOwnProperty('sanction_officers')){
                sanctionOfficers = userObj?.success?.user?.sanction_officers;
                sanctionOfficers?.unshift(userObj?.success?.user?.user_manager);
            }
            let perks = [];
            if(userObj?.success?.user?.hasOwnProperty('perks')){
                perks = userObj?.success?.user?.perks;
            }
            //console.log("HAS OWN PROPERTY: ", userObj.success.user.hasOwnProperty('sanction_officers'))
            //CONTACT
            let presentHouseNumber = null;
            let presentRoadStreet = null;
            let presentLocality = null;
            let presentPincode = null;
            let presentEmergencyNum = null;
            let presentCountry = null;
            let presentState = null;
            let presentCity = null;
            let employeeAddress = [];
            if(userObj?.success?.user?.hasOwnProperty('employee_addresses')){
                employeeAddress = userObj?.success?.user?.employee_addresses;
            }
            let permanentHouseNumber = null;
            let permanentRoadStreet = null;
            let permanentLocality = null;
            let permanentPincode = null;
            let permanentEmergencyNum = null;
            let permanentCountry = null;
            let permanentState = null;
            let permanentCity = null;
            if(employeeAddress?.length > 0){
                {/*PRESENT ADDRESS (TYPE: 1)*/}
                presentHouseNumber = `#${userObj?.success?.user?.employee_addresses[0]['house_number']}`;
                presentRoadStreet = `${userObj?.success?.user?.employee_addresses[0]['road_street']}`;
                presentLocality = `${userObj?.success?.user?.employee_addresses[0]['locality_area']}`;
                presentPincode = `${userObj?.success?.user?.employee_addresses[0]['pincode']}`;
                presentEmergencyNum = `${userObj?.success?.user?.employee_addresses[0]['emergency_number']}`;
                presentCountry = `${userObj?.success?.user?.employee_addresses[0]['country']['name']}`;
                presentState = `${userObj?.success?.user?.employee_addresses[0]['state']['name']}`;
                presentCity = `${userObj?.success?.user?.employee_addresses[0]['city']['name']}`;

                {/*PERMANENT ADDRESS (TYPE: 2)*/}
                permanentHouseNumber = `#${userObj?.success?.user?.employee_addresses[1]['house_number']}`;
                permanentRoadStreet = `${userObj?.success?.user?.employee_addresses[1]['road_street']}`;
                permanentLocality = `${userObj?.success?.user?.employee_addresses[1]['locality_area']}`;
                permanentPincode = `${userObj?.success?.user?.employee_addresses[1]['pincode']}`;
                permanentEmergencyNum = `${userObj?.success?.user?.employee_addresses[1]['emergency_number']}`;
                permanentCountry = `${userObj?.success?.user?.employee_addresses[1]['country']['name']}`;
                permanentState = `${userObj?.success?.user?.employee_addresses[1]['state']['name']}`;
                permanentCity = `${userObj?.success?.user?.employee_addresses[1]['city']['name']}`;
            }

            //HR
            let employeeAccount = userObj?.success?.user?.employee_account;
            let adhaarNumber = null;
            let resultAdhaar = '';
            let gapSize = 4;
            let panNumber = '--';
            let bankName = null;
            let accountHolder = null;
            let esiNumber = null;
            let dispensary = null;
            let pfNumber = null;
            let uanNumber = null;
            let bankACNumber = null;
            let secureBankArray = [];
            let splitBankACNumber = [];
            let secureBankACNumber = null;
            let bankIFSCCode = null;
            let secureIFSCCODE = null;
            let secureIFSCArray = [];
            let splitIFSC = [];
            if(employeeAccount){
                adhaarNumber = userObj?.success?.user?.employee_account?.adhaar;
                if(adhaarNumber){
                    while(adhaarNumber?.length > 0){
                        resultAdhaar = resultAdhaar + " " + adhaarNumber?.substring(0,gapSize); // Insert space character
                        adhaarNumber = adhaarNumber?.substring(gapSize);  // Trim String
                    }
                }else {
                    resultAdhaar = '--'
                }
                panNumber = userObj?.success?.user?.employee_account?.pan_number;
                bankName = userObj?.success?.user?.employee_account?.bank?.name;
                accountHolder = userObj?.success?.user?.employee_account?.account_holder_name;
                esiNumber = userObj?.success?.user?.esi_number;
                dispensary = userObj?.success?.user?.dispensary;
                pfNumber = userObj?.success?.user?.pf_number_department;
                uanNumber = userObj?.success?.user?.uan_number;
                bankACNumber = userObj?.success?.user?.employee_account?.bank_account_number
                splitBankACNumber = bankACNumber?.split('');
                let loopTill = splitBankACNumber?.length - 4;
                for(let i = 0; i < splitBankACNumber?.length; i++){
                    if(i < loopTill){
                        secureBankArray[i] = '*';
                    }else{
                        secureBankArray[i] = splitBankACNumber[i];
                    }
                }
                console.log("$$$$ SELF AC SECURE: ", secureBankArray)
                //secureBankACNumber = '*'.repeat(bankACNumber.length);
                secureBankACNumber = secureBankArray?.join('');
                bankIFSCCode = userObj?.success?.user?.employee_account?.ifsc_code;
                splitIFSC = bankIFSCCode?.split('');
                let loopTill2 = splitIFSC?.length - 4;
                for(let i = 0; i < splitIFSC?.length; i++){
                    if(i < loopTill2){
                        secureIFSCArray[i] = '*';
                    }else{
                        secureIFSCArray[i] = splitIFSC[i];
                    }
                }
                //secureIFSCCODE = '*'.repeat(bankIFSCCode.length)
                secureIFSCCODE = secureIFSCArray?.join('');
            }
            let gradient = ['#039FFD', '#EA304F']
            let tripleGradient =['#039FFD', '#AD62F4', '#EA304F'];

            //DATA to be Displayed
            const basicSection = (
                <View style={[{borderColor: 'black', alignItems: 'center', borderWidth: 0, flex: 1, backgroundColor: 'rgb(250, 246, 233)'}, getWidthnHeight(100)]}>
                    <View style={[{flexDirection: 'row', borderWidth: 0, borderColor: 'black', alignItems: 'center', justifyContent: 'space-between'}, getWidthnHeight(70, 10), getMarginTop(2)]}>
                        <GradientBorderBox 
                            style={[{borderRadius: getWidthnHeight(2).width}, getWidthnHeight(33, 9.5)]}
                            locations={[0.35, 0.70, 1]}
                            title="DOB"
                            subTitle={(formatedDOB !== 'Invalid date')? formatedDOB : '--'}
                            gradient={tripleGradient}
                            innerBoxStyle={[{borderRadius: getWidthnHeight(1.5).width}, getWidthnHeight(32.3, 9.1)]}
                        />
                        <GradientBorderBox 
                            style={[{borderRadius: getWidthnHeight(2).width}, getWidthnHeight(33, 9.5)]}
                            locations={[0.35, 0.70, 1]}
                            title="DOJ"
                            subTitle={(formatedDOJ !== 'Invalid date')? formatedDOJ : '--'}
                            gradient={tripleGradient}
                            innerBoxStyle={[{borderRadius: getWidthnHeight(1.5).width}, getWidthnHeight(32.3, 9.1)]}
                        />
                    </View>
                    <View style={[{flexDirection: 'row', justifyContent: 'space-between'}, getMarginTop(1), getWidthnHeight(90)]}>
                        <View style={[{borderWidth: 0, borderColor: 'black', justifyContent: 'space-evenly'}, getWidthnHeight(35, 25)]}>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>Designation</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>Email</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>Phone</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>Father's Name</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>Mother's Name</Text>
                        </View>
                        <View style={[{borderWidth: 0, borderColor: 'black', justifyContent: 'space-evenly'}, getWidthnHeight(55, 25)]}>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont]}>{(designation)? designation : '--'}</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont]}>{(email)? email : '--'}</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont]}>{(phone)? phone : '--'}</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont]}>{(fathersName)? fathersName : '--'}</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont]}>{(mothersName)? mothersName : '--'}</Text>
                        </View>
                    </View> 
                    <View style={[{justifyContent: 'center', alignItems: 'center'}, getMarginTop(3)]}>
                        <LinearGradient 
                            start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                            colors={tripleGradient}
                            style={[getWidthnHeight(30, 0.3)]}/>
                    </View>
                </View>
            );
            const projectSection = (
                <View style={{alignItems: 'center'}}>
                    <View style={[{alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(100), getMarginTop(2)]}>
                        <GradientBorderBox 
                            style={[{borderRadius: getWidthnHeight(2).width}, getWidthnHeight(50, 9.5)]}
                            locations={[0.35, 0.70, 1]}
                            title="Shift Timing"
                            subTitle={shiftTimings}
                            gradient={tripleGradient}
                            innerBoxStyle={[{borderRadius: getWidthnHeight(1.5).width}, getWidthnHeight(49.2, 9.2)]}
                        />
                    </View>
                    <View style={[{flexDirection: 'row', justifyContent: 'space-between'}, getMarginTop(1), getWidthnHeight(90)]}>
                        <View style={[{borderWidth: 0, borderColor: 'black', justifyContent: 'space-evenly'}, getWidthnHeight(35, 25)]}>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>Project</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>Department</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>Sanction Officers</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>Perks</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>Probation Period</Text>
                        </View>
                        <View style={[{borderWidth: 0, borderColor: 'black', justifyContent: 'space-evenly'}, getWidthnHeight(55, 25)]}>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont]}>{userProject}</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont]}>{(department)? department?.name : '--'}</Text>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                                <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont, getMarginRight(2)]}>{sanctionOfficers?.length}</Text>
                                <TouchableOpacity onPress={() => {
                                    this.setState({modalTitle: 'SANCTION OFFICERS', modalData: sanctionOfficers, showListModal: true})
                                }}>
                                    <View style={[{backgroundColor: '#227CE7', alignItems: 'center', justifyContent: 'center', borderRadius: 5}, getWidthnHeight(12)]}>
                                        <Text style={{color: 'white', fontSize: fontSizeH4().fontSize}}>View</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                                <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont, getMarginRight(2)]}>{perks?.length}</Text>
                                <TouchableOpacity onPress={() => {
                                    this.setState({modalTitle: 'PERKS', modalData: perks, showListModal: true})
                                }}>
                                    <View style={[{backgroundColor: '#227CE7', alignItems: 'center', justifyContent: 'center', borderRadius: 5}, getWidthnHeight(12)]}>
                                        <Text style={{color: 'white', fontSize: fontSizeH4().fontSize}}>View</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={[{borderWidth: 0, borderColor: 'black', alignItems: 'flex-end'}, getWidthnHeight(55)]}>
                                {(probationPeriod == 1)?
                                    <View style={[{backgroundColor: '#15CC79', alignItems: 'center', justifyContent: 'center', borderRadius: 5}, getWidthnHeight(22)]}>
                                        <Text style={{color: 'white', fontSize: fontSizeH4().fontSize}}>Completed</Text>
                                    </View>
                                :
                                    <View style={[{backgroundColor: '#F3442F', alignItems: 'center', justifyContent: 'center', borderRadius: 5}, getWidthnHeight(27)]}>
                                        <Text style={{color: 'white', fontSize: fontSizeH4().fontSize}}>Not Completed</Text>
                                    </View>
                                }
                            </View>
                        </View>
                    </View>
                    <View style={[{justifyContent: 'center', alignItems: 'center'}, getMarginTop(3)]}>
                        <LinearGradient 
                            start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                            colors={tripleGradient}
                            style={[getWidthnHeight(30, 0.3)]}/>
                    </View>
                </View>
            )
            const contactSection = (
                <View style={[{borderColor: 'black', alignItems: 'center', borderWidth: 0, flex: 1, backgroundColor: 'rgba(250, 246, 233, 0.10)'}, getWidthnHeight(100)]}>
                    <View style={[{flexDirection: 'row', borderWidth: 0, borderColor: 'black', alignItems: 'center', justifyContent: 'space-evenly'}, getWidthnHeight(90, 10), getMarginTop(2)]}>
                        {(selectAddress === 1)?
                            <View style={[{flexDirection: 'row', justifyContent: 'space-evenly'}, getWidthnHeight(90)]}>
                                <GradientBorderBox 
                                    style={[{borderRadius: getWidthnHeight(2).width}, getWidthnHeight(40, 6.5)]}
                                    locations={[0, 1]}
                                    title="Present Address"
                                    titleStyle={[{color: 'white', fontSize: fontSizeH4().fontSize + 2}, getMarginTop(0)]}
                                    //subTitle={"Missing"}
                                    gradient={gradient}
                                    innerBoxStyle={[{borderRadius: getWidthnHeight(1.5).width, backgroundColor: 'transparent'}, getWidthnHeight(39.25, 6.2)]}
                                />
                                <GradientBorderBox 
                                    style={[{borderRadius: getWidthnHeight(2).width}, getWidthnHeight(40, 6.5)]}
                                    onPress={() => this.setState({selectAddress: 2})}
                                    locations={[0, 1]}
                                    //title="Permanent Address"
                                    //titleStyle={[{color: 'black', fontSize: fontSizeH4().fontSize + 2}, getMarginTop(2)]}
                                    subTitle={"Permanent Address"}
                                    subTitleStyle={[{fontSize: fontSizeH4().fontSize + 2}, getMarginTop(0)]}
                                    gradient={gradient}
                                    innerBoxStyle={[{borderRadius: getWidthnHeight(1.5).width}, getWidthnHeight(39.25, 6.2)]}
                                />
                            </View>
                        :
                            <View style={[{flexDirection: 'row', justifyContent: 'space-evenly'}, getWidthnHeight(90)]}>
                                <GradientBorderBox 
                                    style={[{borderRadius: getWidthnHeight(2).width}, getWidthnHeight(40, 6.5)]}
                                    onPress={() => this.setState({selectAddress: 1})}
                                    locations={[0, 1]}
                                    // title="Present Address"
                                    // titleStyle={[{color: 'white', fontSize: fontSizeH4().fontSize + 2}, getMarginTop(2)]}
                                    subTitle={"Present Address"}
                                    subTitleStyle={[{fontSize: fontSizeH4().fontSize + 2}, getMarginTop(0)]}
                                    gradient={gradient}
                                    innerBoxStyle={[{borderRadius: getWidthnHeight(1.5).width}, getWidthnHeight(39.25, 6.2)]}
                                />
                                <GradientBorderBox 
                                    style={[{borderRadius: getWidthnHeight(2).width}, getWidthnHeight(40, 6.5)]}
                                    locations={[0, 1]}
                                    title="Permanent Address"
                                    titleStyle={[{color: 'white', fontSize: fontSizeH4().fontSize + 2}, getMarginTop(0)]}
                                    //subTitle={"Missing"}
                                    gradient={gradient}
                                    innerBoxStyle={[{borderRadius: getWidthnHeight(1.5).width, backgroundColor: 'transparent'}, getWidthnHeight(39.25, 6.2)]}
                                />
                            </View>
                        }
                    </View>
                    {(selectAddress === 1)?
                    <View style={[{flexDirection: 'row', justifyContent: 'space-between'}, getWidthnHeight(90)]}>
                        <View style={[{borderWidth: 0, borderColor: 'black', justifyContent: 'space-evenly'}, getWidthnHeight(35, 40)]}>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>House Number</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>Road/Street</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>Locality/Area</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>Pincode</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>Emergency Number</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>Country</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>State</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>City</Text>
                        </View>
                        <View style={[{borderWidth: 0, borderColor: 'black', justifyContent: 'space-evenly'}, getWidthnHeight(55, 40)]}>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont]}>{(presentHouseNumber)? presentHouseNumber : '--'}</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont]}>{(presentRoadStreet)? presentRoadStreet : '--'}</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont]}>{(presentLocality)? presentLocality : '--'}</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont]}>{(presentPincode)? presentPincode : '--'}</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont]}>{(presentEmergencyNum)? presentEmergencyNum : '--'}</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont]}>{(presentCountry)? presentCountry : '--'}</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont]}>{(presentState)? presentState : '--'}</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont]}>{(presentCity)? presentCity : '--'}</Text>
                        </View>
                    </View>
                    :
                    <View style={[{flexDirection: 'row', justifyContent: 'space-between'}, getWidthnHeight(90)]}>
                        <View style={[{borderWidth: 0, borderColor: 'black', justifyContent: 'space-evenly'}, getWidthnHeight(35, 40)]}>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>House Number</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>Road/Street</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>Locality/Area</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>Pincode</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>Emergency Number</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>Country</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>State</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>City</Text>
                        </View>
                        <View style={[{borderWidth: 0, borderColor: 'black', justifyContent: 'space-evenly'}, getWidthnHeight(55, 40)]}>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont]}>{(permanentHouseNumber)? permanentHouseNumber : '--'}</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont]}>{(permanentRoadStreet)? permanentRoadStreet : '--'}</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont]}>{(permanentLocality)? permanentLocality : '--'}</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont]}>{(permanentPincode)? permanentPincode : '--'}</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont]}>{(permanentEmergencyNum)? permanentEmergencyNum : '--'}</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont]}>{(permanentCountry)? permanentCountry : '--'}</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont]}>{(permanentState)? permanentState : '--'}</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont]}>{(permanentCity)? permanentCity : '--'}</Text>
                        </View>
                    </View>
                    }
                    <View style={[{justifyContent: 'center', alignItems: 'center'}, getMarginTop(3)]}>
                        <LinearGradient 
                            start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                            colors={tripleGradient}
                            style={[getWidthnHeight(30, 0.3)]}/>
                    </View>
                </View>
            )
            const hrSection = (
                <View style={[{borderColor: 'black', alignItems: 'center', borderWidth: 0, flex: 1, backgroundColor: 'rgba(250, 246, 233, 0.10)'}, getWidthnHeight(100)]}>
                    <View style={[{flexDirection: 'row', borderWidth: 0, borderColor: 'black', alignItems: 'center', justifyContent: 'space-evenly'}, getWidthnHeight(100, 10), getMarginTop(2)]}>
                        <GradientBorderBox 
                            style={[{borderRadius: getWidthnHeight(2).width}, getWidthnHeight(45, 9.5)]}
                            locations={[0.35, 0.70, 1]}
                            title="Adhaar Number"
                            titleStyle={[{fontSize: fontSizeH4().fontSize + 3}, getMarginTop(0)]}
                            subTitle={resultAdhaar}
                            subTitleStyle={[{fontSize: fontSizeH4().fontSize + 4}, getMarginTop(0)]}
                            gradient={tripleGradient}
                            innerBoxStyle={[{borderRadius: getWidthnHeight(1.5).width}, getWidthnHeight(44.3, 9.1)]}
                        />
                        <GradientBorderBox 
                            style={[{borderRadius: getWidthnHeight(2).width}, getWidthnHeight(45, 9.5)]}
                            locations={[0.35, 0.70, 1]}
                            title="PAN Number"
                            titleStyle={[{fontSize: fontSizeH4().fontSize + 3}, getMarginTop(0)]}
                            subTitle={panNumber}
                            subTitleStyle={[{fontSize: fontSizeH4().fontSize + 4}, getMarginTop(0)]}
                            gradient={tripleGradient}
                            innerBoxStyle={[{borderRadius: getWidthnHeight(1.5).width}, getWidthnHeight(44.3, 9.1)]}
                        />
                    </View>
                    <View style={[{flexDirection: 'row', justifyContent: 'space-between'}, getMarginTop(0), getWidthnHeight(90)]}>
                        <View style={[{borderWidth: 0, borderColor: 'black', justifyContent: 'space-evenly'}, getWidthnHeight(40, 20)]}>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>Employee ESI Number</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>Employee Dispensary</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>PF Number (file)</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>UAN Number</Text>
                        </View>
                        <View style={[{borderWidth: 0, borderColor: 'black', justifyContent: 'space-evenly'}, getWidthnHeight(50, 20)]}>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont]}>{(esiNumber)? esiNumber : '--'}</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont]}>{(dispensary)? dispensary : '--'}</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont]}>{(pfNumber)? pfNumber : '--'}</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont]}>{(uanNumber)? uanNumber : '--'}</Text>
                        </View>
                    </View>
                    <View style={[{alignItems: 'flex-start'}, getWidthnHeight(90)]}>
                        <View>
                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                <MaskedView maskElement={<Text style={[{fontWeight: 'bold', fontSize: fontSizeH4().fontSize + 2}, styles.boldFont]}>BANK DETAILS</Text>}>
                                    <LinearGradient 
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        locations={[0.35, 0.70, 1]}
                                        colors={tripleGradient}
                                    >
                                        <Text style={[{fontWeight: 'bold', fontSize: fontSizeH4().fontSize + 2}, styles.boldFont]}>BANK DETAILS</Text>
                                    </LinearGradient>
                                </MaskedView>
                            </View>
                            <View style={[{justifyContent: 'center', alignItems: 'center'}, getMarginTop(0)]}>
                                <LinearGradient 
                                    start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                    colors={tripleGradient}
                                    style={[getWidthnHeight(25, 0.2)]}/>
                            </View>
                        </View>
                    </View>
                    <View style={[{flexDirection: 'row', justifyContent: 'space-between'}, getWidthnHeight(90)]}>
                        <View style={[{borderWidth: 0, borderColor: 'black', justifyContent: 'space-evenly'}, getWidthnHeight(40, 20)]}>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>Bank Name</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>Account Holder</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>Account Number</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'left'}, styles.boldFont]}>IFSC Code</Text>
                        </View>
                        <View style={[{borderWidth: 0, borderColor: 'black', justifyContent: 'space-evenly'}, getWidthnHeight(50, 20)]}>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont]}>{(bankName)? bankName : '--'}</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont]}>{(accountHolder)? accountHolder : '--'}</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont]}>{(secureBankACNumber)? secureBankACNumber : '--'}</Text>
                            <Text style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold', textAlign: 'right'}, styles.boldFont]}>{(secureIFSCCODE)? secureIFSCCODE : '--'}</Text>
                        </View>
                    </View>
                    <View style={[{justifyContent: 'center', alignItems: 'center'}, getMarginTop(1)]}>
                        <LinearGradient 
                            start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                            colors={tripleGradient}
                            style={[getWidthnHeight(30, 0.3)]}/>
                    </View>
                </View>
            )
            let catalogue = [
                {"id": 0, "screen": basicSection},
                {"id": 1, "screen": projectSection},
                {"id": 2, "screen": contactSection},
                {"id": 3, "screen": hrSection}
            ];
            const {animateHorizontal} = this.state;
            return(
                <View style={{flex: 1, backgroundColor: 'rgb(250, 246, 233)'}}>
                    {/* <IOS_StatusBar color={gradient} barStyle="light-content"/>
                    <View>
                        <WaveHeader
                            wave={false} 
                            title='My Profile'
                            menu='white'
                            size={getWidthnHeight(100, 7)}
                        />
                    </View> */}
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <View style={[{borderColor: 'black', borderWidth: 0, backgroundColor: 'white', alignItems: 'center', justifyContent: 'space-between'}, getWidthnHeight(100, 35)]}>
                            <Animated.View style={[{borderColor: 'red', borderWidth: 0, alignItems: 'center'}, getMarginTop(3)]}>
                                <View style={[{
                                    borderColor: 'rgba(11, 109, 212, 0.5)', borderWidth: 2, borderRadius: getWidthnHeight(25).width, alignItems: 'center', 
                                    justifyContent: 'center', width: getWidthnHeight(25).width, height: getWidthnHeight(25).width}]}>
                                    {(userImage)?
                                        <Image source={userImage} style={{width: getWidthnHeight(23).width, height: getWidthnHeight(23).width, borderColor: 'white', borderWidth: 0, borderRadius: getWidthnHeight(23).width}}/>
                                    :
                                        <View style={{
                                            width: getWidthnHeight(23).width, height: getWidthnHeight(23).width, 
                                            alignItems: 'center', justifyContent: 'center', backgroundColor:'#D9E8FA',
                                            borderRadius: getWidthnHeight(23).width    
                                        }}>
                                            <User name="user" size={Math.floor(getWidthnHeight(10).width)} color="#227CE7"/>
                                        </View>
                                    }
                                </View>
                                <Text style={[{fontSize: fontSizeH4().fontSize + 3, fontWeight: 'bold', color: '#0B6DD4'}, styles.boldFont]}>{`${userName.toUpperCase()} (${empCode})`}</Text>
                            </Animated.View>
                            <View style={[{borderColor: 'black', borderWidth: 0, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}, getWidthnHeight(100, 15)]}>
                                <TouchableOpacity 
                                    style={[{
                                        borderColor: 'red', borderWidth: 0, width: getWidthnHeight(8).width, height: getWidthnHeight(13).width,
                                        justifyContent: 'center', alignItems: 'center'}, getMarginTop(-1)]} 
                                    onPress={() => this.scrollLeft()}
                                >
                                    <Text style={[{fontWeight: 'bold', fontSize: fontSizeH2().fontSize, color: '#0B6DD4'}]}>{"\u00AB"}</Text>
                                </TouchableOpacity>
                                <View style={[{borderColor: 'black', borderWidth: 0}, getWidthnHeight(80, 12)]}>
                                    <FlatList 
                                        data={appContent}
                                        keyExtractor={(data) => data.id}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        renderItem={this.renderItem.bind(this)}
                                        getItemLayout={this.getItemLayout.bind(this)}
                                        scrollEnabled={false}
                                        ref={(refFlatList) => this._refFlatList = refFlatList}
                                        maxToRenderPerBatch={5}
                                    />
                                </View>
                                <TouchableOpacity 
                                    style={[{
                                        borderColor: 'red', borderWidth: 0, width: getWidthnHeight(8).width, height: getWidthnHeight(13).width,
                                        justifyContent: 'center', alignItems: 'center'}, getMarginTop(0.5)]}
                                    onPress={() => this.scrollRight()}
                                >
                                    <View style={{transform: [{rotate: '180deg'}]}}>
                                        <Text style={[{fontWeight: 'bold', fontSize: fontSizeH2().fontSize, color: '#0B6DD4'}]}>{"\u00AB"}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <FlatList 
                                ref={(scroll) => this.scrollRef = scroll}
                                keyExtractor={(item) => item.id}
                                data={catalogue}
                                scrollEventThrottle={16}
                                pagingEnabled
                                onMomentumScrollEnd={this.setSelectedIndex.bind(this)}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                renderItem={({item}, index) => {
                                    //console.log("CATALOGUE: ", item)
                                    return (
                                        <View style={[getWidthnHeight(100)]}>
                                            {item.screen}
                                        </View>
                                    )
                                }}
                            />
                        </View>
                    {(showListModal)?
                        <ListModal 
                            title={modalTitle}
                            data={modalData}
                            visible={showListModal}
                            onDecline={() => this.setState({showListModal: false})}
                        />
                    :
                        null
                    }
                </View>
            </View>
            )
        }
    }

    const styles = {
        boldFont: {
            ...Platform.select({
                android: {
                    fontFamily: ''
                }
            })
        }
    }

    export default MyProfile;