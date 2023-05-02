import React from 'react';
import {
    StyleSheet,Text,TouchableOpacity,
    TouchableHighlight,View,FlatList,
    ScrollView, Animated, KeyboardAvoidingView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ListItem, Avatar} from 'react-native-elements';
import {
    getWidthnHeight, WaveHeader, getMarginTop, getMarginLeft, fontSize_H3, fontSizeH4, getMarginHorizontal, getMarginRight,
    IOS_StatusBar, statusBarGradient, CustomTextInput, fontSizeH3, getMarginVertical, getMarginBottom, AlertBox, Spinner} from '../KulbirComponents/common';
import {extractBaseURL} from '../api/BaseURL';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { Dropdown } from 'react-native-material-dropdown';
import { Platform } from 'react-native';
import moment from 'moment';

const colorTitle = '#0B8EE8';

export default class View_Travel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            remarks:'',
            remarksError: true,
            index:'0',
            status: '',
            statusLabel: '',
            statusError: true,
            visible: true,
            animateItinerary: new Animated.Value(0),
            animateItineraryText: new Animated.Value(1),
            animateItineraryIcon: new Animated.Value(0),
            animateStay: new Animated.Value(0),
            animateStayText: new Animated.Value(1),
            animateStayIcon: new Animated.Value(0),
            animateClimber: new Animated.Value(0),
            itineraryFullHeight: false,
            stayFullHeight: false,
            climberFullHeight: false,
            baseURL: null,
            submit: false,
            alertTitle: '',
            alertColor: false,
            apiError: false,
            errorCode: null,
            apiCode: null,
            enableAlert: false, 
            loading: false,
        };
        this.props.navigation.setOptions({
            title: 'View Travel'
        })
    }

    async componentDidMount(){ 
        await extractBaseURL().then((baseURL) => {
            this.setState({baseURL}, () => console.log("EXTRACT LINK AMAN: ", this.state.baseURL))
        })
    }

    setindex=(value) => {
        const {index} = this.state;
        this.setState({index:value}, ()=>console.log(index))
    }

    renderStatusItem = ({item, index}) => {
        const createdDateTime = item.created_at;
        const splitCreatedDateTime = createdDateTime.split(" ");
        const receivedOn = moment(splitCreatedDateTime[0]).format("DD-MM-YYYY");
        const updatedDateTime = item.updated_at;
        const splitUpdatedDateTime = updatedDateTime.split(" ");
        let updatedOn = null;
        if(item.status === 'new'){
            updatedOn = '--'
        }else{
            updatedOn = moment(splitUpdatedDateTime[0]).format("DD-MM-YYYY");
        }
        return(
        <View style={[{borderColor: 'white', borderWidth: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.7)'}, getMarginVertical(1), getWidthnHeight(95)]}>
            <View style ={[{flexDirection:'row'}, getWidthnHeight(95)]}>
                <ListItem key={index} containerStyle={{backgroundColor: 'transparent'}} style={[{borderColor: 'red', borderWidth: 0}, getWidthnHeight(74)]}>
                    <View style={[getMarginLeft(-2)]}>   
                        <FontAwesomeIcons name='user-circle' size={getWidthnHeight(10).width} color={'#3480E0'}/>
                        {/* {<Avatar avatarStyle={[{borderRadius: getWidthnHeight(10).width, borderColor: 'black', borderWidth: 0}, getMarginLeft(0)]} size={getWidthnHeight(10).width}/>} */}
                    </View>
                    <ListItem.Content style={[getMarginLeft(0)]}>
                        <ListItem.Title 
                            style={[{fontSize: fontSizeH4().fontSize, fontWeight: 'bold',
                            borderWidth: 0, borderColor: 'red'
                            }, styles.boldFont, getWidthnHeight(70)]}
                        >
                            {item.employee.fullname.toUpperCase()}
                        </ListItem.Title>
                        <ListItem.Subtitle
                            style={[{borderWidth: 0, borderColor: 'red', fontSize: fontSizeH4().fontSize}, getWidthnHeight(58)]}
                        >
                            {/* {<View style={[{flexDirection: 'row'}, getWidthnHeight(70)]}>
                                <Text style={[{fontStyle: 'italic', color:'grey'}, fontSizeH4()]}>Remarks: </Text>
                                <Text style={[fontSizeH4(), getWidthnHeight(55), {borderWidth: 0, borderColor: 'red', color:'grey'}]}>{(item.remarks)? item.remarks : '--'}</Text>
                            </View>} */}
                            {`Remarks: ${(item.remarks)? item.remarks : '--'}`}
                        </ListItem.Subtitle>
                        <ListItem.Subtitle
                            style={[{borderWidth: 0, borderColor: 'red', fontSize: fontSizeH4().fontSize}, getMarginTop(1), getWidthnHeight(70)]}
                        >
                            {/* {<View style={{flexDirection: 'row'}}>
                                <Text style={[{fontWeight: 'bold', fontStyle: 'italic'}, styles.boldFont, fontSizeH4()]}>Received On: </Text>
                                <Text style={[ fontSizeH4()]}>{receivedOn}</Text>
                            </View>} */}
                            {`Received On: ${receivedOn}`}
                        </ListItem.Subtitle>
                        <ListItem.Subtitle
                            style={[{borderWidth: 0, borderColor: 'red', fontSize: fontSizeH4().fontSize}, getMarginTop(1), getWidthnHeight(70)]}
                        >  
                            {/* {<View style={{flexDirection: 'row'}}>
                                <Text style={[{fontWeight: 'bold', fontStyle: 'italic'}, styles.boldFont, fontSizeH4()]}>Updated On: </Text>
                                <Text style={[ fontSizeH4()]}>{updatedOn}</Text>
                            </View>} */}
                            {`Updated On: ${updatedOn}`}
                        </ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>      
                <View style ={[{borderColor: 'red', borderWidth: 0, alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(20)]}>
                    {(item.status === 'new') &&
                        <View style = {[{backgroundColor:'transparent', borderRadius:5, borderWidth:0, borderColor:'red', alignItems:'flex-end'}]}>
                            <View style={{backgroundColor:'#2F7DE1',borderRadius:5,}}>
                                <Text style={[{textAlign:'center', color:'white', fontWeight:'bold',paddingHorizontal:5}, styles.boldFont, fontSizeH4() ]}>{item.status.replace(/^\w/, (c) => c.toUpperCase())}</Text> 
                            </View>
                        </View> 
                    }
                    {(item.status === 'approved') &&
                    <View style = {[{backgroundColor:'transparent', borderRadius:5, borderWidth:0, alignItems:'flex-end'}]}> 
                        <View style={{backgroundColor:'#3CA73F',borderRadius:5,}}>
                            <Text style={[{textAlign:'center', color:'white', fontWeight:'bold', paddingHorizontal:5}, styles.boldFont, fontSizeH4() ]}>{item.status.replace(/^\w/, (c) => c.toUpperCase())}</Text> 
                        </View>
                    </View>
                    }  
                    {(item.status === 'discarded') &&
                    <View style = {[{backgroundColor:'transparent', borderRadius:5, borderWidth:0, alignItems:'flex-end'}]}> 
                        <View style={{backgroundColor:'#E73D26',borderRadius:5,}}>
                            <Text style={[{textAlign:'center', color:'white', fontWeight:'bold', paddingHorizontal:5}, styles.boldFont, fontSizeH4() ]}>{item.status.replace(/^\w/, (c) => c.toUpperCase())}</Text> 
                        </View>
                    </View>
                    }
                    {(item.status === 'discussion') &&
                    <View style = {[{backgroundColor:'transparent', borderRadius:5, borderWidth:0, alignItems:'flex-end'}]}> 
                        <View style={{backgroundColor:'#2F7DE1',borderRadius:5,}}>
                            <Text style={[{textAlign:'center', color:'white', fontWeight:'bold', paddingHorizontal:5}, styles.boldFont, fontSizeH4() ]}>{item.status.replace(/^\w/, (c) => c.toUpperCase())}</Text> 
                        </View>
                    </View>
                    }
                </View>
            </View>
        </View>
        )
    }

    renderItineraryItem = ({item, index}) => {
        const conveyanceName = (item.conveyance.islocal === 0)? item.conveyance.name : `${item.conveyance.name} [Rs.${item.conveyance.price_per_km}/km]`
        return(
            <View style={[{alignItems: 'center'}, getMarginTop(-1), getWidthnHeight(95)]}>
            <View style={[styles.flatlistcontainer]}>
                <View style={[styles.triangleCornerl]}/>
                <View style = {[{ position: 'absolute'}]}>
                    <Text style={[{fontSize:(fontSizeH4().fontSize - 1), color:'white',textAlignVertical:'center'}, getMarginLeft(1)]}>{(index < 9)? `0${index + 1}` : (index + 1)}</Text>                
                </View>
                <Text style={[{ fontWeight:'bold'}, styles.boldFont, getMarginTop(-4), getMarginLeft(10)]}>{moment(item.travel_date.split(' ')[0]).format("DD-MM-YYYY")}</Text>
                <View style={[{flexDirection: 'row', borderWidth: 0, borderColor: 'black', alignItems: 'center'}, getWidthnHeight(85, 5)]}>
                    <View style={{alignItems: 'center', flexDirection: 'row', width: getWidthnHeight(9).width, height: getWidthnHeight(9).width, borderColor: 'black', borderWidth: 0, justifyContent: 'flex-end'}}>
                        <View style={[{borderTopWidth: 3, borderLeftWidth: 3, borderBottomWidth: 3, borderColor: 'black'}, getWidthnHeight(3.5, 3)]}/>
                        <View style={[{borderColor: 'black', borderTopWidth: 0, justifyContent: 'flex-end'}, getWidthnHeight(4, 3.8), getMarginLeft(-2)]}>
                            <View style={[{borderWidth: 0, borderColor: 'red'}]}>
                                <View style={styles.arrow}/>
                            </View>
                        </View>
                    </View>                        
                    <View style={{justifyContent: 'space-between'}}>
                        <Text style={[{color:'black'}, fontSizeH4(), getMarginLeft(1)]}>{item.from_city.name}</Text>
                        <Text style={[{color:'black'}, fontSizeH4(), getMarginLeft(1)]}>{item.to_city.name}</Text>
                    </View>
                </View>
                <View style = {[{alignItems:'flex-start', flexDirection:'row'}, getMarginLeft(2.2), getMarginTop(0.5)]}>
                    <Text style = {[{color:'#565656', fontWeight:'bold'}, styles.boldFont, fontSize_H3() ]}> Conveyance: </Text>
                    <View style={{backgroundColor:'#DAE7F7'}}>
                        <Text style = {[{color:'#565656', fontWeight:'600', fontStyle:'italic'},fontSize_H3(), styles.boldFont]}>{" " + conveyanceName + " "}</Text>
                    </View>
                </View>
                <View style ={[{flexDirection:"row", justifyContent: 'space-evenly', borderColor: 'black', borderWidth: 0}, getWidthnHeight(90), getMarginTop(1.5)]}>
                    <View style = {[{borderColor: 'red', borderWidth: 0, alignItems: 'center'}]}>
                        <View style={[{borderRadius: 10, backgroundColor: '#E83A31'}, getWidthnHeight(85/2.5, 7)]}>
                            <View style={{flexDirection:'row', flex: 1,justifyContent: 'space-evenly', alignItems: 'center'}}>    
                                <View style={[{
                                    borderWidth:0, borderColor: 'black', backgroundColor:'#F48D88', justifyContent:'center', width: getWidthnHeight(8).width, 
                                    height: getWidthnHeight(8).width, borderRadius: getWidthnHeight(8).width}]}>
                                    <View style={[{alignItems:'center'}]}>   
                                        <FontAwesome name='route' size={getWidthnHeight(4.5).width} color={'white'}/>
                                    </View> 
                                </View>    
                                <View>
                                    <Text style = {[{color:'#FFFEFF', fontWeight:'600'},fontSizeH4(), styles.boldFont]}>Distance</Text>
                                    <Text style = {[{color:'#FFFEFF', fontWeight:'bold'},fontSizeH4(), styles.boldFont]}>{(item.distance_in_km)? `${item.distance_in_km} Km` : '--'}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style = {[{borderColor: 'red', borderWidth: 0, alignItems: 'center'}]}>
                        <View style={[{borderRadius: 10, backgroundColor: '#E58F1E'}, getWidthnHeight(85/2.5, 7)]}>
                            <View style={{flexDirection:'row', flex: 1,justifyContent: 'space-evenly', alignItems: 'center'}}>    
                                <View style={[{
                                    borderWidth:0, borderColor: 'black', backgroundColor:'#EAA74E', justifyContent:'center', width: getWidthnHeight(8).width, 
                                    height: getWidthnHeight(8).width, borderRadius: getWidthnHeight(8).width}]}>
                                    <View style={[{alignItems:'center'}]}>   
                                        <FontAwesome name={'money-bill-alt'} size={getWidthnHeight(4.5).width} color={'white'}/>
                                    </View> 
                                </View>    
                                <View>
                                    <Text style = {[{color:'#FFFEFF', fontWeight:'600'},fontSizeH4(), styles.boldFont]}>Expected Cost</Text>
                                    <Text style = {[{color:'#FFFEFF', fontWeight:'bold'},fontSizeH4(), styles.boldFont]}>{`${"\u20B9"} ${item.travel_amount}/-`}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            </View>
        )
  }

    renderStayItem = ({item, index}) => {
        const date1 = moment(item.from_date, "YYYY-MM-DD");
        const date2 = moment(item.to_date, "YYYY-MM-DD");
        const days = date2.diff(date1, 'days');
        console.log("### RENDER DAYS: ", days, item.from_date)
        return(
            <View style={[{alignItems: 'center'}, getMarginTop(-1), getWidthnHeight(95)]}>
            <View style={[styles.flatlistcontainer, getWidthnHeight(90, 17)]}>
                    <View style={[styles.triangleCornerl]}/>
                    <View style = {[{position: 'absolute'}, getMarginLeft(1)]}>
                        <Text style={[{fontSize:(fontSizeH4().fontSize - 1), color:'white',textAlignVertical:'center'}]}>{(index < 9)? `0${index + 1}` : (index + 1)}</Text>                
                    </View>
                    <View style={[getMarginTop(-4), getMarginLeft(4)]}>
                        <Text style={[{color:'black'}, fontSizeH4(), getMarginLeft(5)]}>{item.city.state.name}</Text>
                        <View style={{flexDirection: 'row', borderColor: 'black', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center'}}>
                            <View style={[{
                                backgroundColor: 'black', width: getWidthnHeight(2).width, height: getWidthnHeight(2).width, 
                                justifyContent: 'center', borderRadius: getWidthnHeight(3).width}, getMarginLeft(5)]}
                            />
                            <Text style={[{color:'black', borderColor: 'black', borderWidth: 0}, fontSizeH4(), getMarginLeft(2)]}>{item.city.name}</Text>
                        </View>
                    </View>
                    <View style = {[{alignItems:'center', flexDirection:'row'}, getMarginLeft(2.2), getMarginTop(1)]}>
                        <Text style = {[{color:'#565656', fontWeight: 'bold'}, styles.boldFont, fontSize_H3() ]}> Date(s): </Text>
                        <View style={{backgroundColor:'#DAE7F7'}}>
                            <Text style = {[{color:'#565656', fontStyle:'italic'}, fontSizeH4() ]}> {moment(item.from_date).format("DD-MM-YYYY")} </Text>
                        </View>
                        <Text style = {[{color:'#565656', fontWeight: 'bold', fontSize: fontSize_H3().fontSize - 3}, styles.boldFont]}> To </Text>
                        <View style={{backgroundColor:'#DAE7F7'}}>
                            <Text style = {[{color:'#565656', fontStyle:'italic'}, fontSizeH4() ]}> {moment(item.to_date).format("DD-MM-YYYY")} </Text>
                        </View>
                    </View>
                <View style ={[{flexDirection:"row", justifyContent: 'space-evenly', borderColor: 'red', borderWidth: 0, alignItems: 'center'}, getMarginTop(1.5), getWidthnHeight(90)]}>
                    <View>  
                        <View>
                            <View>
                                <View style={[{flexDirection:'row',backgroundColor:'#E83A31', borderRadius: 5, alignItems: 'center', justifyContent: 'center'},getWidthnHeight(75/3, 5)]}>    
                                    <View style={[{width: getWidthnHeight(8).width, height: getWidthnHeight(8).width, borderRadius: getWidthnHeight(8).width/2, justifyContent:'center', backgroundColor:'#F48D88'}]}>
                                        <View style={[{alignItems:'center'}]}>   
                                            <FontAwesome name='home' size={getWidthnHeight(4).width} color={'white'}/>
                                        </View> 
                                    </View>    
                                    <View style ={[getMarginLeft(1)]}>
                                        <Text style = {[{color:'#FFFEFF', fontSize:9} ]}>Stay Exp</Text>
                                        <Text style = {[{color:'#FFFEFF', fontWeight:'bold'},styles.boldFont, fontSizeH4() ]}>{`${"\u20B9"} ${item.rate_per_night * ((days === 0)? 1 : days)}/-`}</Text>
                                    </View>
                                </View>
                            </View>
                        </View> 
                    </View>
                    <View>
                        <View>
                            <View style={[{flexDirection:'row', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor:'#E58F1E'},getWidthnHeight(75/3, 5)]}>    
                                <View style={[{width: getWidthnHeight(8).width, height: getWidthnHeight(8).width, borderRadius: getWidthnHeight(8).width/2, backgroundColor:'#DBE8F8', justifyContent:'center', backgroundColor:'#EAA74E'}]}>
                                    <View style={[{alignItems:'center'}]}>   
                                        <FontAwesome name={'money-bill-alt'} size={getWidthnHeight(4).width} color={'white'}/>
                                    </View> 
                                </View>    
                                <View style ={[getMarginLeft(1)]}>
                                    <Text style = {[{color:'#FFFEFF', fontSize:9 }]}>{'DA'}</Text>
                                    <Text style = {[{color:'#FFFEFF', fontWeight:'bold'},styles.boldFont, fontSizeH4() ]}>{`${"\u20B9"} ${item.da * ((days === 0)? 1 : (days + 1))}/-`}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View>
                        <View>
                            <View style={[{flexDirection:'row', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor:'#00C9DA'},getWidthnHeight(75/3, 5)]}>    
                                <View style={[{width: getWidthnHeight(8).width, height: getWidthnHeight(8).width, borderRadius: getWidthnHeight(8).width/2, justifyContent:'center', backgroundColor:'#72DDE7'}]}>
                                    <View style={[{alignItems:'center'}]}>   
                                        <FontAwesome name={'money-bill-alt'} size={getWidthnHeight(4).width} color={'white'}/>
                                    </View> 
                                </View>    
                                <View style ={[getMarginLeft(1)]}>
                                    <Text style = {[{color:'#FFFEFF', fontSize:9 }]}>{'Total'}</Text>
                                    <Text style = {[{color:'#FFFEFF', fontWeight:'bold'},styles.boldFont, fontSizeH4() ]}>{`${"\u20B9"} ${(item.rate_per_night * ((days === 0)? 1 : (days))) + (item.da * ((days === 0)? 1 : (days + 1)))}/-`}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            </View>
        )
    }

    itineraryScrollToTop(){
        this.scrollItinerary.scrollToIndex({animated: true, index: 0})
    }

    itineraryHeight(){
        const {animateItinerary, itineraryFullHeight} = this.state;
        if(!itineraryFullHeight){
            Animated.parallel([
                Animated.timing(animateItinerary, {
                    toValue: 1,
                    duration: 500
                })
            ]).start(() => {
                this.setState({itineraryFullHeight: true})
            })
        }else{
            this.itineraryScrollToTop();
            Animated.parallel([
                Animated.timing(animateItinerary, {
                    toValue: 0,
                    duration: 500
                })
            ]).start(() => {
                this.setState({itineraryFullHeight: false})
            })
        }
    }

    Itinerary = () => {
        const {animateItinerary, animateItineraryText, animateItineraryIcon, itineraryFullHeight, visible} = this.state;
        let total_itenerary_amount = 0 
        this.props.route.params.data.travel_national.forEach(item => {
            total_itenerary_amount += item.travel_amount
        });
        const interpolateHeight = animateItinerary.interpolate({
            inputRange: [0, 1],
            outputRange: [getWidthnHeight(undefined, 28).height, getWidthnHeight(undefined, 47).height]
        })
        const animatedStyle = {
            height: interpolateHeight
        }
        const itineraryLength = this.props.route.params.data.travel_national.length;
        return (
            <View style={[getWidthnHeight(100), {alignItems: 'center'}]}>
                <View style = {[{flexDirection:'row',  marginTop:getMarginTop(1.2).marginTop, alignItems:'center'}, getWidthnHeight(95,5)]}>  
                    <LinearGradient start={{x: 0, y: 0}} end={{x: 0.4, y: 0}} colors={['#0255BF','#1968CF', '#2C7BE0']} style={[{ borderWidth:0, justifyContent:'center', alignItems:'center'},getWidthnHeight(95/3,5)]}>
                        <TouchableHighlight underlayColor="transparent" onPress= {() => this.setindex('0')}>
                            <Text style={[{textAlign:'center', color:'white'}]}>Itinerary</Text>    
                        </TouchableHighlight>
                    </LinearGradient>
                    <TouchableHighlight underlayColor="#DAE7F7" onPress= {() => this.setindex('1')} style={[{ borderWidth: 0, backgroundColor:'#DAE7F7',justifyContent:'center', alignItems:'center'},getWidthnHeight(95/3,5)]}>
                        <Text style={{textAlign:'center'}}>Stay</Text> 
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="#DAE7F7" onPress= {() => this.setindex('2')} style={[{ borderWidth:0, backgroundColor:'#DAE7F7',justifyContent:'center', alignItems:'center'},getWidthnHeight(95/3,5)]}>
                        <Text style={{textAlign:'center'}}>Imprest</Text>
                    </TouchableHighlight>
                </View>
                <View style={[{flexDirection: 'row', borderBottomColor: '#1968CF', borderBottomWidth: 1}, getWidthnHeight(95)]}>
                    <View style={[{position: 'absolute', alignItems: 'center', justifyContent: 'flex-start', borderColor: 'red', borderWidth: 0, transform: [{translateY: -(getWidthnHeight(undefined, 1).height)}]}, getWidthnHeight(95/3, 2)]}>
                        <View style = {[styles.triangleCorner]}/>
                    </View>
                    <View style={[getWidthnHeight(95/3)]}/>
                    <View style={[getWidthnHeight(95/3)]}/>
                </View>
                <Animated.View style = {[{
                    borderTopWidth:0, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor:'#1968CF', alignItems: 'center'
                    }, getWidthnHeight(95), (itineraryLength > 1)? animatedStyle : getWidthnHeight(undefined, 31)]}>
                    <View style={[getMarginVertical(1)]}>
                        {this.props.route.params.data.travel_national != '' ? 
                            <FlatList
                                ref={(ref) => this.scrollItinerary = ref}
                                nestedScrollEnabled ={(itineraryFullHeight)? true : false}
                                scrollEnabled={(itineraryFullHeight)? true : false}
                                data={this.props.route.params.data.travel_national}
                                initialNumToRender = {this.props.route.params.data.travel_national.length}
                                renderItem={this.renderItineraryItem}
                                keyExtractor={item => item.id}
                                ListFooterComponent = {() => {
                                    return(
                                        <View style ={[{alignItems:'center', justifyContent:'center',marginVertical:'4%'}]}>
                                            <Text style = {[{textAlign:'center', backgroundColor: '#DAE7F7'},fontSize_H3(), getWidthnHeight(35)]}>Total Itinerary Cost</Text>
                                            <Text style = {[{textAlign:'center', fontWeight:'bold'}, styles.boldFont, fontSize_H3()]}>{`${"\u20B9"} ${total_itenerary_amount}/-`}</Text>
                                        </View>
                                    )
                                }}
                            />
                        :
                            null
                        }
                    </View>
                </Animated.View>
                {(itineraryLength > 1) &&
                    <TouchableOpacity style={[getWidthnHeight(20, 5), {borderColor: 'red', borderWidth: 0, alignItems: 'center', justifyContent: 'center'}, getMarginTop(-2.5)]} 
                        onPress={() => this.itineraryHeight()}>
                        <View style={[{
                            width: getWidthnHeight(8).width, height: getWidthnHeight(8).width, borderRadius: getWidthnHeight(8).width, 
                            backgroundColor: '#1968CF', alignItems: 'center', justifyContent: 'center'}]}>
                                {(!itineraryFullHeight)?
                                    <Animated.View>
                                        <Text style={[{color: 'white', textAlign: 'center', textAlignVertical: 'center'}]}>{`+${itineraryLength - 1}`}</Text>
                                    </Animated.View>
                                :
                                    <Animated.View style={[{borderWidth: 0, borderColor: 'white'}]}>
                                        <FontAwesomeIcons name='angle-up' size={getWidthnHeight(5).width} color={'white'}/>
                                    </Animated.View>
                                }
                        </View>
                    </TouchableOpacity>
                }
            </View>
        )
    };
  
    stayScrollToTop(){
        this.scrollStay.scrollToIndex({animated: true, index: 0})
    }

    stayHeight(){
        const {animateStay, stayFullHeight} = this.state;
        if(!stayFullHeight){
            Animated.timing(animateStay, {
                toValue: 1,
                duration: 500
            }).start(() => {
                this.setState({stayFullHeight: true})
            })
        }else{
            this.stayScrollToTop();
            Animated.timing(animateStay, {
                toValue: 0,
                duration: 500
            }).start(() => {
                this.setState({stayFullHeight: false})
            })
        }
    }
  
    Stay = () => {
        const {animateStay, stayFullHeight} = this.state;
        let total_stay_amount = 0 
        this.props.route.params.data.travel_stay.forEach(item => {
            const date1 = moment(item.from_date, "YYYY-MM-DD")
            const date2 = moment(item.to_date, "YYYY-MM-DD")
            const days = date2.diff(date1, 'days')
            total_stay_amount += (item.rate_per_night * ((days === 0)? 1 : days)) + (item.da * ((days === 0)? 1 : (days + 1)))
        });
        const interpolateHeight = animateStay.interpolate({
            inputRange: [0, 1],
            outputRange: [getWidthnHeight(undefined, 22).height, getWidthnHeight(undefined, 47).height]
        })
        const animatedStyle = {
            height: interpolateHeight
        }
        const rotateIcon = {
            transform: [{
                rotateX: animateStay.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg']
                })
            }]
        }
        console.log("TRAVEL STAY: ", this.props.route.params.data.travel_stay)
        const stayArrayLength = this.props.route.params.data.travel_stay.length;
        return (
            <View style={[getWidthnHeight(100), {alignItems: 'center'}]}>
                <View style = {[{flexDirection:'row',  marginTop:getMarginTop(1.2).marginTop, alignItems:'center'}, getWidthnHeight(95,5)]}>
                    <TouchableHighlight underlayColor="#DAE7F7" onPress= {() => this.setindex('0')} style={[{ borderWidth:0, backgroundColor:'#DAE7F7',justifyContent:'center', alignItems:'center'},getWidthnHeight(95/3,5)]}>
                        <Text style={[{textAlign:'center'}]}>Itinerary</Text>    
                    </TouchableHighlight>
                    <LinearGradient start={{x: 0, y: 0}} end={{x: 0.4, y: 0}} colors={['#0255BF','#1968CF', '#2C7BE0']} style={[{ borderWidth:0,justifyContent:'center', alignItems:'center'},getWidthnHeight(95/3,5)]}>
                        <TouchableHighlight underlayColor="transparent" onPress= {() => this.setindex('1')}>
                            <Text style={{textAlign:'center', color:'white'}}>Stay</Text> 
                        </TouchableHighlight>
                    </LinearGradient>
                    <TouchableHighlight underlayColor="#DAE7F7" onPress= {() => this.setindex('2')} style={[{ borderWidth:0, backgroundColor:'#DAE7F7',justifyContent:'center', alignItems:'center'},getWidthnHeight(95/3,5)]}>
                        <Text style={{textAlign:'center'}}>Imprest</Text>
                    </TouchableHighlight>
                </View>
                <View style={[{flexDirection: 'row', borderBottomColor: '#1968CF', borderBottomWidth: 1}, getWidthnHeight(95)]}>
                    <View style={[getWidthnHeight(95/3)]}/>
                    <View>
                        <View style={[{position: 'absolute', alignItems: 'center', justifyContent: 'flex-start', borderColor: 'red', borderWidth: 0, transform: [{translateY: -(getWidthnHeight(undefined, 1).height)}]}, getWidthnHeight(95/3, 2)]}>
                            <View style = {[styles.triangleCorner]}/>
                        </View>
                    </View>
                    <View style={[getWidthnHeight(95/3)]}/>
                </View>
                <Animated.View style = {[{
                    borderTopWidth:0, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor:'#1968CF'
                    , alignItems: 'center'}, getWidthnHeight(95), (stayArrayLength > 1)? animatedStyle : getWidthnHeight(undefined, 27)
                ]}>
                    <View style={[getMarginVertical(1)]}>
                        {this.props.route.params.data.travel_stay != null ?
                            <FlatList
                                ref={(ref) => this.scrollStay = ref}
                                nestedScrollEnabled={(stayFullHeight)? true : false}
                                scrollEnabled={(stayFullHeight)? true : false}
                                data={this.props.route.params.data.travel_stay}
                                initialNumToRender = {this.props.route.params.data.travel_stay.length}
                                renderItem={this.renderStayItem}
                                keyExtractor={item => item.id}
                                ListFooterComponent = {() => {
                                    return(
                                        <View style={[{borderWidth: 0, borderColor: 'red', alignItems: 'center', justifyContent: 'center'}, (this.props.route.params.data.travel_stay.length === 0)? getWidthnHeight(90, 26): null]}>
                                            <View style ={{alignItems:'center', justifyContent:'center', marginVertical:'3%'}}>
                                                <Text style = {[{textAlign:'center', backgroundColor: '#DAE7F7'},fontSize_H3(), getWidthnHeight(30)]}>Total Stay Cost</Text>
                                                <Text style = {[{textAlign:'center', fontWeight:'bold'}, styles.boldFont, fontSize_H3()]}>{`${"\u20B9"} ${total_stay_amount}/-`}</Text>
                                            </View>
                                        </View>
                                )}}
                            />
                        : 
                            null
                        }
                    </View>
                </Animated.View>
                {(stayArrayLength > 1) && 
                    <TouchableOpacity 
                        style={[getWidthnHeight(20, 5), {borderColor: 'red', borderWidth: 0, alignItems: 'center', justifyContent: 'center'}, getMarginTop(-2.5)]} 
                        onPress={() => this.stayHeight()}>
                        <View style={[{
                            width: getWidthnHeight(8).width, height: getWidthnHeight(8).width, borderRadius: getWidthnHeight(8).width, 
                            backgroundColor: '#1968CF', alignItems: 'center', justifyContent: 'center'}]}>
                                {(!stayFullHeight)?
                                    <Text style={[{color: 'white', textAlign: 'center', textAlignVertical: 'center'}]}>{`+${stayArrayLength - 1}`}</Text>
                                :
                                    <Animated.View>
                                        <FontAwesomeIcons name='angle-up' size={getWidthnHeight(5).width} color={'white'}/>
                                    </Animated.View>
                                }
                        </View>
                    </TouchableOpacity>
                }
            </View>
        )
    };
  
  
    Imprest = () => {
        return (
            <View style={[getWidthnHeight(100), {alignItems: 'center'}]}>
                <View style = {[{flexDirection:'row',  marginTop:getMarginTop(1.2).marginTop, alignItems:'center'}, getWidthnHeight(95,5)]}>
                    <TouchableHighlight underlayColor="#DAE7F7" onPress= {() => this.setindex('0')} style={[{ borderWidth:0, backgroundColor:'#DAE7F7',justifyContent:'center', alignItems:'center'},getWidthnHeight(95/3,5)]}>
                        <Text style={[{textAlign:'center'}]}>Itinerary</Text>    
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="#DAE7F7" onPress= {() => this.setindex('1')} style={[{ borderWidth:0, backgroundColor:'#DAE7F7',justifyContent:'center', alignItems:'center'},getWidthnHeight(95/3,5)]}>
                        <Text style={{textAlign:'center'}}>Stay</Text> 
                    </TouchableHighlight>
                    <LinearGradient start={{x: 0, y: 0}} end={{x: 0.4, y: 0}} colors={['#0255BF','#1968CF', '#2C7BE0']} style={[{ borderWidth:0,justifyContent:'center', alignItems:'center'},getWidthnHeight(95/3,5)]}>
                        <TouchableHighlight underlayColor="transparent" onPress= {() => this.setindex('2')}>
                            <Text style={{textAlign:'center', color:'white'}}>Imprest</Text>
                        </TouchableHighlight>
                    </LinearGradient>
                </View>
                <View style={[{flexDirection: 'row', borderBottomColor: '#1968CF', borderBottomWidth: 1}, getWidthnHeight(95)]}>
                    <View style={[getWidthnHeight(95/3)]}/>
                    <View style={[getWidthnHeight(95/3)]}/>
                    <View>
                        <View style={[{position: 'absolute', alignItems: 'center', justifyContent: 'flex-start', borderColor: 'red', borderWidth: 0, transform: [{translateY: -(getWidthnHeight(undefined, 1).height)}]}, getWidthnHeight(95/3, 2)]}>
                            <View style = {[styles.triangleCorner]}/>
                        </View>
                    </View>
                </View>
                <View style = {[{borderTopWidth:0, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor:'#1968CF', alignItems: 'center'}, getWidthnHeight(95, 14)]}>
                    {this.props.route.params.data.imprest != null ?
                        <View style={[{flex: 1, alignItems: 'flex-start', borderColor: 'red', borderWidth: 0, justifyContent: 'space-evenly'}, getWidthnHeight(90)]}>
                            <Text style={[{textAlign:'left', fontWeight:'700'}, styles.boldFont, fontSize_H3(), getMarginLeft(1)]} numberOfLines={1}>{this.props.route.params.data.imprest.project[0].name}</Text> 
                            <Text style={[{textAlign:'left'}, fontSize_H3(), getMarginLeft(1)]} numberOfLines={1}>{" "+this.props.route.params.data.imprest.remarks_by_applicant.replace(/^\w/, (c) => c.toUpperCase())}</Text> 
                            <View style = {{flexDirection:'row'}}>
                                <Text style={[{textAlign:'left', fontWeight:'bold'}, styles.boldFont, getMarginLeft(1)]}> Total Imprest Amount : </Text> 
                                <View style={{backgroundColor:'#DAE7F7'}}>
                                    <Text style = {[{color:'#565656', fontWeight:'600', fontStyle:'italic'}, styles.boldFont, fontSizeH4()]}>{" " + `${"\u20B9"} ${this.props.route.params.data.imprest.amount}/-` + " "}</Text>
                                </View>
                            </View>
                        </View>
                    : 
                        null
                    }
                </View>
            </View>
        )
    };

    climberScrollToTop(){
        this.travelClimber.scrollToIndex({animated: true, index: 0})
    }

    climberHeight(){
        const {animateClimber, climberFullHeight} = this.state;
        if(!climberFullHeight){
            Animated.timing(animateClimber, {
                toValue: 1,
                duration: 500
            }).start(() => {
                this.setState({climberFullHeight: true})
            })
        }else{
            this.climberScrollToTop();
            Animated.timing(animateClimber, {
                toValue: 0,
                duration: 500
            }).start(() => {
                this.setState({climberFullHeight: false})
            })
        }
    }

    showLoader(){
        this.setState({loading: true})
    }

    hideLoader(){
        this.setState({loading: false})
    }

    checkBlankFields(){
        const {statusError, remarksError} = this.state;
        this.setState({submit: true})
        const message = "Please fill the fields highlighted in RED"
        if(statusError || remarksError){
            this.setState({enableAlert: true, alertTitle: message, alertColor: true})
        }else{
            this.callAPI();
        }
    }

    async callAPI(){
        const {baseURL} = this.state;
        this.showLoader();
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_four=permissions_fir.success.secret_token;
        axios.post(`${baseURL}/travel/travel-action`,
        {
            id: this.props.route.params.data.id,
            remarks: this.state.remarks,
            mark: this.state.statusLabel
        },
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+ permissions_four, 
            }
        }).then((response) => {
            this.hideLoader();
            const parsedData = response.data;
            console.log("^^^ @@@ travel_code:",parsedData);
            this.setState({status: '', statusLabel: '', statusError: true, remarks: '', remarksError: true});
            this.setState({enableAlert: true, alertTitle: String(parsedData.success), alertColor: false, submit: false})
            this.props.navigation.navigate('TravelApprovals');
        }).catch((error) => {
            this.hideLoader();
            console.log("$$$^^^###%%% ERROR: ", error);
            if(error.response){
                const status = error.response.status;
                this.enableModal(status, '120')
            }else{
                alert(`${error}, API CODE: 120`)
            }
        })
    }

    enableModal(status, apiCode){
        this.setState({errorCode: status})
        this.setState({apiCode})
        this.setState({apiError: true})
    }

    render() {
        const {color, animateClimber, climberFullHeight, status, statusError,
            remarksError, submit, errorCode, apiCode, apiError, alertTitle, loading
        } = this.state;
        let data = [
            {
                value: 'To be discussed',
            }, 
            {
                value: 'Approve',
            }, 
            {
                value: 'Reject',
            }
        ];
        const dataProps = this.props.route.params.data;
        let dropDownState = false;
        if(this.props.route.params.flag == 'true'){
            dropDownState = true;
        }else{
            dropDownState = false;
        }
        const categoryName = dataProps.travel_category.name;
        let categoryDetail = '';
        if(dataProps.project_id){
            categoryDetail = dataProps.project.name;
        }else if(dataProps.lead_id){
            categoryDetail = this.props.route.params.lead;
        }else if(dataProps.others){
            categoryDetail = dataProps.others;
        }
        console.log("### DATA FLAG: ", this.props.route.params.imprest, dataProps.imprest)
        let splitCreatedOn = dataProps.created_at.split(" ");
        let createdOn = moment(splitCreatedOn[0]).format('DD-MM-YYYY')
        const travelClimberLength = this.props.route.params.data.travel_climber.length;
        const animatedStyle = {
            height: animateClimber.interpolate({
                inputRange: [0, 1],
                outputRange: [getWidthnHeight(undefined, 22).height, getWidthnHeight(undefined, 38).height]
            })
        }
        const paidBy = this.props.route.params.imprest;
        let paidDate = null;
        let checkUTR = null;
        let checkRemarks = null;
        if(dataProps.imprest){
            paidDate = dataProps.imprest.paid_at;
            checkUTR = dataProps.imprest.utr_no;
            checkRemarks = dataProps.imprest.remarks
        }
        let paidByUser = '--';
        let imprestPaidDate = '--';
        let utrNo = '--';
        let userRemarks = '--'
        if(paidBy){
            paidByUser = paidBy.fullname;
        }
        if(paidDate){
            const timeStamp = moment().valueOf(paidDate);
            imprestPaidDate = moment(timeStamp).format('DD-MM-YYYY')
        }
        if(checkUTR){
            utrNo = checkUTR;
        }
        if(checkRemarks){
            userRemarks = checkRemarks;
        }
        return (
            <View style = {{flex: 1, backgroundColor: 'white'}}>
                <View>
                    <IOS_StatusBar color={statusBarGradient} barStyle="light-content"/>
                    {/* <WaveHeader
                        wave={Platform.OS ==="ios" ? false : false} 
                        //logo={require('../Image/Logo-164.png')}
                        menu='white'
                        title='View Travel'
                        menuState = {false}
                        headerType = {'small'}
                        //version={`Version ${this.state.deviceVersion}`}
                    /> */}
                </View>
                <View style={{flex: 1}}>
                <KeyboardAvoidingView style={{flex: 1}} behavior={(Platform.OS === 'ios')? "padding" : null} keyboardVerticalOffset={(Platform.OS === 'ios')? 120 : null}> 
                <ScrollView contentContainerStyle={{alignItems: 'center'}}>
                    <View style={[{flexDirection: 'row'}, getMarginTop(1)]}>
                        <Text style={[{fontWeight: 'bold', fontSize: fontSizeH4().fontSize + 2}, styles.boldFont]}>Travel Created On: </Text>
                        <Text style={[{fontWeight: 'bold', fontSize: fontSizeH4().fontSize + 2}, styles.boldFont]}>{(createdOn)}</Text>
                    </View>
                    <View style ={[{backgroundColor:'#DBE8F8', borderRadius:10, alignItems: 'center'},styles.bigbluebox, getWidthnHeight(95,5.5)]}>
                        <View style = {[{flexDirection:'row', alignItems: 'center', flex: 1, justifyContent: 'center'}, getWidthnHeight(93)]}>                              
                            <Text numberOfLines={2} style = {[{fontWeight:'700', color:'#000', textAlignVertical: 'center', textAlign: 'center'}, getWidthnHeight(93/3), styles.boldFont, fontSize_H3()]}>{" "+dataProps.user.employee.first_name.replace(/^\w/, (c) => c.toUpperCase())+" "+dataProps.user.employee.last_name.replace(/^\w/, (c) => c.toUpperCase())+" "}</Text>  
                            <View style={[{flexDirection: 'row', alignItems: 'center'}, getWidthnHeight(93/3)]}>
                                <View style={{width: getWidthnHeight(6).width,height: getWidthnHeight(6).width,borderRadius: getWidthnHeight(6).width/2, borderWidth:0, backgroundColor:'#3381E5', justifyContent:'center', marginLeft:getMarginLeft(1).marginLeft}}>  
                                    <View style={{alignItems:'center', justifyContent: 'center', marginLeft:getMarginLeft(0.5).marginLeft, }}>   
                                        <FontAwesomeIcons name='angle-right' size={getWidthnHeight(5).width} color={'white'}/>
                                    </View>
                                </View>
                                <Text style = {[{fontSize: (fontSizeH4().fontSize + 1)}, getMarginLeft(1)]}>{" "+this.props.route.params.data.travel_code+" "}</Text>
                            </View>
                            <View style={[getWidthnHeight(93/3), {alignItems: 'center'}]}>
                                <View style ={[{backgroundColor:'#009D00', borderRadius:10, alignItems:'center', justifyContent: 'center'},styles.bigbluebox, getWidthnHeight(25,3), getMarginTop(0)]}>
                                    <Text style = {[{color:'white', fontSize: (fontSizeH4().fontSize - 1)}]}>Under Policy</Text>
                                </View>
                            </View>
                        </View>  
                    </View> 
                    <View>    
                        <LinearGradient start={{x: 0, y: 0}} end={{x: 0.4, y: 0}} colors={['#0255BF','#1968CF', '#2C7BE0']} 
                            style = {[{borderTopLeftRadius: 10, borderTopRightRadius: 10}, getWidthnHeight(95, 15.5), getMarginTop(1)]}> 
                            <View style={{alignItems: 'center'}}>  
                                <View style={{position: 'absolute'}}>
                                    <View style = {[{flexDirection:'row', justifyContent: 'flex-end'}, getWidthnHeight(90)]}>  
                                        <View style = {[getMarginTop(3.5),]}>
                                            <FontAwesomeIcons name ='plane' size = {getWidthnHeight(12).width} color = {'#4087E3'}/>
                                        </View>
                                        <View style = {[getMarginLeft(4)]}>
                                            <FontAwesomeIcons name ='plane' size = {getWidthnHeight(35).width} color = {'#4087E3'}/>
                                        </View>
                                    </View>
                                </View>
                                <ScrollView contentContainerStyle={[{alignItems: 'center'}]} horizontal showsHorizontalScrollIndicator={false} style={[{borderWidth: 0, borderColor: 'red'}, getWidthnHeight(90)]}>
                                    <View>
                                        <Text style = {[{fontWeight:'700', color:'white', fontSize:(fontSizeH4().fontSize + 3), fontStyle:'italic'}, styles.boldFont, getMarginTop(0.5)]}>{this.props.route.params.data.travel_purpose}</Text>
                                        <View style = {[{flexDirection:'row'}, getMarginTop(0.5)]}>
                                            <View style={[{width: getWidthnHeight(6).width,height: getWidthnHeight(6).width,borderRadius: getWidthnHeight(6).width/2, borderWidth:0, backgroundColor:'white', justifyContent:'center'}, getMarginRight(2)]}>  
                                                <View style={[{alignItems:'center'}]}>   
                                                    <FontAwesome name='map-marked-alt' size={getWidthnHeight(3.5).width} color={'#3280E2'}/>
                                                </View>
                                            </View>
                                            <Text style = {[{fontWeight:'700', color:'white'}, styles.boldFont, fontSize_H3, getMarginTop(0.2)]}>{categoryName}</Text>
                                            <Text style = {[{color:'white', borderWidth: 0, borderColor: 'white'}, fontSizeH4, getMarginTop(0.2)]}>{(categoryDetail)? `(${categoryDetail})` : ''}</Text>
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
                            <View style={[{alignItems: 'center', justifyContent: 'flex-end'}, getMarginTop(2), getWidthnHeight(95)]}>
                                <View style = {[styles.smallbox, getMarginTop(0)]}>
                                    <Text style = {[{fontSize: fontSizeH3().fontSize - 5}, styles.boldFont]}> Final Status: </Text>
                                    {(this.props.route.params.data.status === 'new') &&
                                        <Text style = {[{fontSize: fontSizeH3().fontSize - 5, backgroundColor: '#2473EB', borderRadius: 5, color: 'white', fontStyle: 'italic'}]}>
                                            {"  " + this.props.route.params.data.status.replace(/^\w/, (c) => c.toUpperCase()) + "  "}
                                        </Text>
                                    }
                                    {(this.props.route.params.data.status === 'approved') &&
                                        <Text style = {[{fontSize: fontSizeH3().fontSize - 5, backgroundColor: '#0BB051', borderRadius: 5, color: 'white', fontStyle: 'italic'}]}>
                                            {"  " + this.props.route.params.data.status.replace(/^\w/, (c) => c.toUpperCase()) + "  "}
                                        </Text>
                                    }
                                    {(this.props.route.params.data.status === 'discarded') &&
                                        <Text style = {[{fontSize: fontSizeH3().fontSize - 5, backgroundColor: '#EB3A32', borderRadius: 5, color: 'white', fontStyle: 'italic'}]}>
                                            {"  " + this.props.route.params.data.status.replace(/^\w/, (c) => c.toUpperCase()) + "  "}
                                        </Text>
                                    }
                                </View>
                            </View> 
                        </LinearGradient>
                    </View> 
                    {/* {<View>    
                        <LinearGradient start={{x: 0, y: 0}} end={{x: 0.4, y: 0}} colors={['#0255BF','#1968CF', '#2C7BE0']} 
                            style = {[{borderTopLeftRadius: 10, borderTopRightRadius: 10, justifyContent: 'center'}, getWidthnHeight(95, 6), getMarginTop(1)]}>
                            <View style={[getMarginLeft(2)]}>
                                <Text style={{color: 'white'}}>Allowed Conveyances</Text>
                            </View>
                        </LinearGradient>
                        <View style={[getWidthnHeight(95, 10), {borderColor: '#0255BF', borderTopWidth: 0, borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1}]}>
                            
                        </View>
                    </View>} */}
                    {(this.state.index === '0')?
                        this.Itinerary() 
                    : 
                        (this.state.index === '1')?
                            this.Stay()
                        : 
                            this.Imprest()
                    }
                    <View style={[{alignItems: 'center'}, getWidthnHeight(95)]}>
                        <View style = {[{borderWidth:1, borderColor:'#487DCB',backgroundColor:'#DAE7F7', alignItems:'center', justifyContent:'center'}, getWidthnHeight(55,8), getMarginTop(1)]}>
                            <Text style = {[fontSizeH4()]}>Total Cost = Itinerary + Stay</Text>
                            <Text style = {[{fontWeight:'bold', fontSize:18}, styles.boldFont]}>{`${"\u20B9"} ${this.props.route.params.data.total_amount}/-`}</Text>
                        </View>
                    </View>    
                    {(travelClimberLength > 0) &&
                    <View style={{alignItems: 'center'}}> 
                        <View style = {[{borderWidth:1, borderColor:'#EDEDED',backgroundColor:'#DAE7F7'}, getWidthnHeight(95,0.2), getMarginTop(1), getMarginLeft(2.5)]}/>
                        <View style = {[{alignItems: 'center'}, getWidthnHeight(95), getMarginTop(0.5)]}>
                            <Text style = {[{fontWeight:'bold', color:'#347FE5', textAlign: 'center', fontSize: fontSizeH4().fontSize + 1}, styles.boldFont,]}>APPROVAL/RECOMMENDATION STATUS</Text>
                        </View>
                        <View style={[{flexDirection: 'row'}, getMarginTop(1)]}>
                            <Text style={[{fontWeight: 'bold', fontSize: fontSizeH4().fontSize + 1}, styles.boldFont]}>Travel Created On: </Text>
                            <Text style={[{fontWeight: 'bold', fontSize: fontSizeH4().fontSize + 1}, styles.boldFont]}>{(createdOn)}</Text>
                        </View>
                        <Animated.View style = {[{
                            borderWidth:1, borderColor:'#487DCB', backgroundColor:'#DAE7F7'}, getWidthnHeight(95), getMarginTop(1),
                            (travelClimberLength > 1)? animatedStyle : getWidthnHeight(undefined, 17)
                        ]}>
                            <FlatList
                                ref={(ref) => this.travelClimber = ref}
                                nestedScrollEnabled={(climberFullHeight)? true : false}
                                scrollEnabled={(climberFullHeight)? true : false}
                                data={this.props.route.params.data.travel_climber}
                                initialNumToRender = {this.props.route.params.data.travel_climber.length}
                                renderItem={this.renderStatusItem}
                                keyExtractor={item => item.id}
                                ListFooterComponent={() => <View style ={[getWidthnHeight(undefined,0.3)]}/>}
                                //ItemSeparatorComponent = {()=><View style ={[{backgroundColor:'#3480E0'}, getMarginTop(0.3), getMarginLeft(2.5), getWidthnHeight(89,0.2)]}></View>}
                            />
                        </Animated.View> 
                        {(travelClimberLength > 1) && 
                            <TouchableOpacity 
                                style={[getWidthnHeight(20, 5), {borderColor: 'red', borderWidth: 0, alignItems: 'center', justifyContent: 'center'}, getMarginTop(-2.5)]} 
                                onPress={() => this.climberHeight()}>
                                <View style={[{
                                    width: getWidthnHeight(8).width, height: getWidthnHeight(8).width, borderRadius: getWidthnHeight(8).width, 
                                    backgroundColor: '#1968CF', alignItems: 'center', justifyContent: 'center'}]}>
                                        {(!climberFullHeight)?
                                            <Text style={[{color: 'white', textAlign: 'center', textAlignVertical: 'center'}]}>{`+${travelClimberLength - 1}`}</Text>
                                        :
                                            <Animated.View>
                                                <FontAwesomeIcons name='angle-up' size={getWidthnHeight(5).width} color={'white'}/>
                                            </Animated.View>
                                        }
                                </View>
                            </TouchableOpacity>
                        }
                    </View>
                    }
                    {(dataProps.imprest_request === 1) && 
                        <View>
                            <LinearGradient start={{x: 0, y: 0}} end={{x: 0.4, y: 0}} colors={['#0255BF','#1968CF', '#2C7BE0']} style={[{ borderWidth:0,justifyContent:'center', alignItems:'center'}, getMarginTop(2), getWidthnHeight(95,5)]}>
                                <View>
                                    <Text style={{textAlign:'center', color:'white'}}>Imprest Details</Text>
                                </View>
                            </LinearGradient>
                            <View style={{flexDirection: 'row'}}>
                                <View style={[getWidthnHeight(95/2, 5), {borderTopWidth:0, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor:'#1968CF', alignItems: 'center', justifyContent: 'center'}]}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={[fontSizeH4()]}>Amount: </Text>
                                        <Text style={[{fontWeight: 'bold'}, styles.boldFont, fontSizeH4()]}>{`${"\u20B9"} ${dataProps.imprest.amount}/-`}</Text>
                                    </View>
                                </View>
                                <View style={[getWidthnHeight(95/2, 5), {borderTopWidth:0, borderBottomWidth: 1, borderLeftWidth: 0, borderRightWidth: 1, borderColor:'#1968CF', alignItems: 'center', justifyContent: 'center'}]}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={[fontSizeH4()]}>Status: </Text>
                                        <View style = {[{backgroundColor:'transparent', borderRadius:5, borderWidth:0, alignItems:'flex-end'}, getMarginHorizontal(1)]}> 
                                            <View style={{backgroundColor: (dataProps.imprest.status === 'new')? '#2473EB' : '#3CA73F',borderRadius:5,}}>
                                                <Text style={[{textAlign:'center', color:'white', fontWeight:'bold', paddingHorizontal:5}, styles.boldFont, fontSizeH4() ]}>{dataProps.imprest.status.replace(/^\w/, (c) => c.toUpperCase())}</Text> 
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <View style={[getWidthnHeight(95/2, 5), {borderTopWidth:0, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor:'#1968CF', alignItems: 'center', justifyContent: 'center'}]}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={[fontSizeH4()]}>Paid By: </Text>
                                        <Text style={[{fontWeight: (paidBy)? 'bold' : 'normal'}, styles.boldFont, getMarginHorizontal(1), fontSizeH4()]}>{paidByUser}</Text>
                                    </View>
                                </View>
                                <View style={[getWidthnHeight(95/2, 5), {borderTopWidth:0, borderBottomWidth: 1, borderLeftWidth: 0, borderRightWidth: 1, borderColor:'#1968CF', alignItems: 'center', justifyContent: 'center'}]}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={[fontSizeH4()]}>Paid At: </Text>
                                        <View style = {[getMarginHorizontal(1)]}> 
                                            <View>
                                                <Text style={[{textAlign:'center', fontWeight: (paidDate)? 'bold' : 'normal'}, styles.boldFont, fontSizeH4() ]}>{imprestPaidDate}</Text> 
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={[getWidthnHeight(95, 5), {borderTopWidth:0, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor:'#1968CF', alignItems: 'center', justifyContent: 'center'}]}>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={[fontSizeH4()]}>UTR No: </Text>
                                    <Text style={[{fontWeight: (paidBy)? 'bold' : 'normal'}, styles.boldFont, fontSizeH4()]}>{utrNo}</Text>
                                </View>
                            </View>
                            <View style={[getWidthnHeight(95, 5), {borderTopWidth:0, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor:'#1968CF', alignItems: 'center', justifyContent: 'center'}]}>
                                <View style={[{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}]}>
                                    <Text style={[{textAlignVertical: 'center'}, getMarginHorizontal(1), fontSizeH4()]}>Remarks: </Text>
                                    {(userRemarks === '--') &&
                                        <Text style={[fontSizeH4()]}>{userRemarks}</Text>
                                    }
                                    {(userRemarks !== '--') &&
                                        <ScrollView contentContainerStyle={[{alignItems: 'center', justifyContent: 'center'}]} horizontal showsHorizontalScrollIndicator={false} style={[{borderWidth: 0, borderColor:'#1968CF'}, getMarginRight(2), getWidthnHeight(undefined, 4.5)]}>
                                            <Text style={[{fontSize: fontSizeH4().fontSize + 1}]}>{userRemarks}</Text>
                                        </ScrollView>
                                    }
                                </View>
                            </View>
                        </View>
                    }
                    {(dropDownState) &&
                        <View style={[getWidthnHeight(100), {alignItems: 'center'}]}>
                            <View style = {[{borderWidth:1, borderColor:'#DAE7F7', backgroundColor:'#DAE7F7'}, getWidthnHeight(95,0.2), getMarginTop(1)]}/>
                            <View style = {[getMarginTop(2)]}>
                                <Dropdown
                                    containerStyle={[{
                                        justifyContent: 'center', alignItems: 'center', 
                                        borderColor: (submit && statusError)? 'red' : '#C4C4C4',
                                        borderStyle: (submit && statusError)? 'dashed' : 'solid',
                                        borderWidth: (submit && statusError)? 2 : 1
                                    }, getWidthnHeight(95, 7)]}
                                    inputContainerStyle={[{borderBottomWidth:0}, getWidthnHeight(90)]}
                                    label={'Status'}
                                    data={data}
                                    value={this.state.status}
                                    onChangeText={(status) => {
                                        console.log("@#@#@#@# ", status)
                                        this.setState({ status, statusError: false }, () => {
                                            const {status} = this.state;
                                            if(status == 'To be discussed'){
                                                this.setState({statusLabel: 'discussion'})
                                            }else if(status == 'Approve'){
                                                this.setState({statusLabel: 'approved'})
                                            }else {
                                                this.setState({statusLabel: 'discarded'})
                                            }
                                        })
                                    }}
                                    baseColor={(!this.state.status)? 'grey' : colorTitle}
                                    pickerStyle={[{borderWidth: 0}]}
                                    fontSize = {fontSizeH4().fontSize + 0.5}
                                />
                            </View>    
                            <View style={[{alignItems: 'center'}, getMarginTop(1.5), getWidthnHeight(100)]}>
                                <CustomTextInput 
                                    placeholder=' Remarks '
                                    value={this.state.remarks}
                                    inactiveTitleFontSize={fontSizeH4().fontSize + 1}
                                    inactiveTitleHeight={getWidthnHeight(undefined, 3).height}
                                    activeTitleFontSize={fontSizeH4().fontSize - 3}
                                    onChangeText={(text) => {
                                        this.setState({remarks: text.trimLeft()}, () => {
                                            const {remarks} = this.state;
                                            if(remarks === ''){
                                                this.setState({remarksError: true})
                                            }else{
                                                this.setState({remarksError: false})
                                            }
                                        })
                                    }}
                                    containerStyle={[{
                                        borderColor: (submit && remarksError)? 'red' : '#C4C4C4',
                                        borderStyle: (submit && remarksError)? 'dashed' : 'solid',
                                        borderWidth: (submit && remarksError)? 2 : 1,
                                        justifyContent: 'center', alignItems: 'stretch'
                                    }, getWidthnHeight(95, 6.7)]}
                                    textInputStyle={[{borderColor: 'black', borderWidth: 0, fontSize: fontSizeH4().fontSize + 3}]}
                                    inactiveTitleColor='dimgrey'
                                    activeTitleColor={colorTitle}
                                />
                            </View> 
                        </View>
                    }
                    <View style = {[{borderWidth:0, borderColor:'#487DCB', backgroundColor:'white'}, getWidthnHeight(95,1.5), getMarginTop(0)]}/>
                </ScrollView>   
                {(dropDownState) &&      
                    <View style={[{alignItems: 'center', justifyContent: 'space-between'}, getMarginVertical(1), getWidthnHeight(100, 6)]}>
                        <View style = {[{borderWidth:1, borderColor:'#DAE7F7', backgroundColor:'#DAE7F7'}, getWidthnHeight(95,0.2), getMarginTop(0)]}/>
                        <TouchableOpacity style={[{flexDirection:'row', justifyContent: 'center'}, getMarginBottom(0)]} onPress={() => this.checkBlankFields()}>
                            <View style={[{justifyContent: 'center', alignItems: 'center', backgroundColor:'#3280E4',borderRightWidth:2, borderRightColor:'white', borderTopLeftRadius:5, borderBottomLeftRadius:5}, getWidthnHeight(4,5)]}/>
                            <View style={[{ justifyContent: 'center', alignItems: 'center', backgroundColor:'#3280E4'}, getWidthnHeight(20,5)]}>
                                <Text style = {[{color:'white', fontWeight:"bold"}, styles.boldFont]}>SUBMIT</Text>
                            </View>
                            <View style={[{justifyContent: 'center', alignItems: 'center', backgroundColor:'#3280E4',borderLeftWidth:2, borderLeftColor:'white', borderTopRightRadius:5, borderBottomRightRadius:5}, getWidthnHeight(4,5)]}/>
                        </TouchableOpacity>
                    </View>
                }
                {(this.state.apiError) &&
                    <AlertBox 
                        title={'Something went wrong'}
                        subtitle={`Error Code: ${errorCode}${apiCode}`}
                        visible={this.state.apiError}
                        onDecline={() => this.setState({apiError: false, alertTitle: '', alertColor: false})}
                        titleStyle={{color: 'black'}}
                        color={false}
                    />
                }
                {(this.state.enableAlert) &&
                    <AlertBox 
                        title={this.state.alertTitle}
                        visible={this.state.enableAlert}
                        onDecline={() => this.setState({enableAlert: false, alertTitle: '', alertColor: false})}
                        titleStyle={{color: 'black'}}
                        color={this.state.alertColor}
                    />
                }
                </KeyboardAvoidingView>
                    <View 
                        style={[{backgroundColor: (loading)? 'rgba(0, 0, 0, 0.5)' : 'transparent'}, StyleSheet.absoluteFill]} 
                        pointerEvents={(loading)? 'auto' : 'none'}
                    >
                        {(loading) ?
                            <Spinner loading={loading} style={[styles.loadingStyle, getWidthnHeight(45, 10)]} color='rgb(19,111,232)'/>
                        : null}
                    </View>
                </View>
            </View>
        )
    }
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bigbluebox: {
        marginLeft:"2.5%",
        marginRight:'2.5%',
        marginTop:'2%',
        height:getWidthnHeight(undefined,17).height,
        borderTopLeftRadius:10,
        borderTopRightRadius:10
    },
    smallbox: {
        height:getWidthnHeight(undefined,6.5).height,
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        backgroundColor:'white',
        width:getWidthnHeight(66).width,
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
      borderRadius: 75,
      width: 150,
      height: 150,
    },
    triangleCorner: {
        marginTop:getMarginTop(.8).marginTop,
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderRightWidth: 9,
        borderTopWidth: 9,
        borderLeftWidth: 9,
        borderRightColor: "transparent",
        borderLeftColor:"transparent",
        borderTopColor: "#307FE4",
    }, 
    flatlistcontainer:{
        width:getWidthnHeight(90).width,
        height:getWidthnHeight(undefined,21).height,
        backgroundColor: '#FFFFFF',
        borderWidth:0,
        borderColor: '#C4C4C4',
        marginTop:getMarginTop(2.5).marginTop,
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
                elevation: 7,
            }
        }),
        shadowOpacity: 0.3,
        shadowRadius: 40,
        borderColor: 'black',
        borderWidth: 0
    }, 
    triangleCornerl: {
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderRightWidth: 40,
        borderTopWidth: 40,
        borderRightColor: "transparent",
        borderTopColor: "#307FE4",
    },
    box:{
        left:0,
        height:45,
        width:'80%',
        borderRadius:10,
    },   
    Dropbox:{
        borderWidth: 1,
        left:0,
        width:getWidthnHeight(95).width,
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black',
        borderColor: '#C4C4C4',
        marginTop:getMarginTop(1.5).marginTop
    },  
    InputBox:{
        borderWidth: 1,
        left:0,
        width:getWidthnHeight(95).width,
        height:52,
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black',
        borderColor: '#C4C4C4',
        marginLeft:'2%',
        marginTop:getMarginTop(1.5).marginTop
    },
    boldFont: {
        ...Platform.select({
            android: {
                fontFamily: ''
            }
        })
    },
    arrow: {
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderRightWidth: getWidthnHeight(2.3).width,
        borderTopWidth: getWidthnHeight(2.3).width,
        borderRightColor: "black",
        borderTopColor: "transparent",
        transform: [{
            rotate: '-45deg'
        }]
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
});
