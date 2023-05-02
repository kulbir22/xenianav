

  //Dummy content to show
  //You can also use dynamic data by calling webservice
const CouponScreen = {
    category_name: 'Coupon Management',
    image:  <GradientIcon
                start={{x: 0.3, y: 0}}
                end={{x: 0.7, y: 0}}
                containerStyle={[{borderWidth: 0, borderColor: 'red', alignItems: 'center'}, getWidthnHeight(5.5)]}
                icon={<MaterialIcons name={'receipt'} style={{backgroundColor: 'transparent'}} size={getWidthnHeight(5.5).width}/>}
                colors={["#FF6A4D", "#FF3333"]}
            />
    ,
    subcategory: [
        {id: 1, type: 'issueNewBook', val: 'Issue New Book'},
        {id: 2, type: 'serialNumber', val: 'Serial Number'},
        {id: 3, type: 'soldCoupons', val: 'Sold Coupons'},
    ]
}
const stationary = {
    id: 2,
    category_name: 'Stationary Management',
    image: (
        <GradientIcon
            start={{x: 0.3, y: 0}}
            end={{x: 0.7, y: 0}}
            containerStyle={[{borderWidth: 0, borderColor: 'red', alignItems: 'center'}, getWidthnHeight(6)]}
            icon={<MaterialCommunityIcons name={'newspaper'} style={{backgroundColor: 'transparent'}} size={getWidthnHeight(6).width}/>}
            colors={["#184D47", "#29BB89"]}
        />
    ),
    subcategory: [
        {id: '1', type: 'consumedPaper', val: 'Consumed Paper'},
        {id: '2', type: 'addPaperConsumption', val: 'Add Paper Consumption'}
    ]
}
const CONTENT = 
    {
        isExpanded: false,
        category_name: ' Lead Management',
        image:require('../src/Image/lead.png'),
        subcategory: [{ id: 1, val: 'Create New Lead',type:'CreateNewLead' },{ id: 1, val: 'Created Leads',type:'CreatedLeads' },{ id: 1, val: 'List of Leads',type:'ListOfLeads' },{ id: 1, val: 'Assigned Leads',type:'AssignedLeads' },{ id: 1, val: 'Unassigned Leads',type:'UnassignedLeads' },{ id: 1, val: 'Recommended Lead',type:'RecommendedLead' }], 
    }

const leaveMgmt = 
    {
        category_name: 'Leave Management',
        image:require('../src/Image/leave32.png'),
        subcategory: [{val: 'Apply Leave',type:'ApplyLeave' }], 
    }
    
const HOLIDAYS = {
    category_name: 'Holidays',
    image: require('../src/Image/tent.png'),
    subcategory: [{ permission: "", val: 'Holidays List', type: 'HolidaysList'}],
}

const SALARYSLIP = {
    category_name: 'Salary Slip',
    image: require('../src/Image/salary.png'),
    subcategory: [{ permission: "", val: 'Salary Slip', type: 'SalarySlip'}],
}

const StepCount = {
    category_name: 'StepCount',
    image: <FontAwesome5 name={'walking'} color="#D61C4E" style={{backgroundColor: 'transparent'}} size={getWidthnHeight(5).width}/>,
    subcategory: [{val: 'Step Count', type: 'StepCount'}],
}

const games = {
    category_name: 'Games',
    image: (
        <GradientIcon
            start={{x: 0.3, y: 0}}
            end={{x: 0.7, y: 0}}
            containerStyle={[{borderWidth: 0, borderColor: 'red', alignItems: 'center'}, getWidthnHeight(6)]}
            icon={<IonIcons name={'game-controller'} style={{backgroundColor: 'transparent'}} size={getWidthnHeight(6).width}/>}
            colors={["#084594", "#1572A1"]}
        />
    ),
    subcategory: [{ val: 'Tic-Tac-Toe', type: 'tictactoe'}],
}

const holidayList = {
    category_name: 'Holiday List',
    image: require('../src/Image/holiday.png'),
    subcategory: [{ id: '1', val: 'Holiday List', type: 'HolidayList'}],
}

const SALARYSLIPXM = {
    category_name: 'Salary Slip',
    image: require('../src/Image/salary.png'),
    subcategory: [],
}

const CONTENT_SEC = {
    isExpanded: false,
    category_name: 'My Targets',
    image: require('../src/Image/target.png'),
    subcategory: [{ permission: "", val: 'Create Target', type: 'CreateTarget'}, { permission: "", val: 'Achieved Target', type: 'AchievedTarget'}, { permission: "", val: 'My Report', type: 'ReportLog'}, { permission: "", val: 'Team Report', type: 'TeamReport'}],
}

const LocationTracker = {
    isExpanded: false,
    category_name: 'Location Tracker',
    image: require('../src/Image/location32.png'),
    subcategory: [{ id: 1, val: 'Location Tracker', type: 'LocationTracker'}, { id: 1, val: 'Saved Locations', type: 'SavedLocations'}, { id: 1, val: 'Admin Tracker', type: 'AdminTracker'}],
}

const TestScreen = {
    isExpanded: false,
    category_name: 'Test Screen',
    image: require('../src/Image/test.png'),
    subcategory: [
        { id: '1', val: 'Apply Leave', type: 'applyLeaveEWF'}, 
        { id: '2', val: 'Applied Leaves', type: 'appliedLeaveEWF'}, 
        { id: '3', val: 'HTML View', type: 'HTMLView'}, 
        { id: '4', val: 'Login Test Page', type: 'LoginTestPage'}, 
        { id: '5', val: 'Swipe Test', type: 'SwipeTest'},
        { id: '6', val: 'Test TextInput', type: 'TestInputText'}
    ]
}
