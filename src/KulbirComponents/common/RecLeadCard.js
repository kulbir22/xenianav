import React, {Component} from 'react';
import { Dimensions } from 'react-native';
import {View, Text, Image, TouchableWithoutFeedback, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {getWidthnHeight, getMarginLeft, getMarginTop} from './width';

class RecLeadCard extends Component{
    constructor(props){
        super(props)
        this.state = {
            options: false,
            optionsKey: null
        }
    }
    render(){
        const { leadData, cardStyle, navigation, route } = this.props;
        const { options, optionsKey } = this.state;
    return (
        leadData.map((item,key) => {
            if (item.priority == 0){                    //LOW
                var color = '#3181c4'
            }else if (item.priority == 1){              //NORMAL
                var color = '#f57f20'
            }else if (item.priority == 2){              //CRITICAL
                var color = '#ee282c'
            }
            //console.log("REC LEAD CARD: ", item.user_employee)
            return (
                <View key={key} style={[cardStyle, getWidthnHeight(90, 14)]}>
                    <TouchableWithoutFeedback onPress={() => this.setState({options: false})}>
                        <View style={{flexDirection:'row',justifyContent:'space-between',}}>
                            <View style={{
                                width: 0,
                                height: 0,
                                backgroundColor: 'transparent',
                                borderStyle: 'solid',
                                borderTopWidth: 40,
                                borderBottomWidth: 0,
                                borderLeftWidth: 0,
                                borderRightWidth: 60,
                                borderTopColor: color,
                                borderBottomColor: 'transparent',
                                borderLeftColor: 'transparent',
                                borderRightColor: 'transparent',
                            }}/>
                            <Text style={{position: 'absolute', color: 'white',width: 50, borderColor: 'red', borderWidth: 0, marginLeft: 10}}>{(key < 9)? `0${key + 1}` : key + 1}</Text>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1, borderColor: 'red', borderWidth: 0}}>
                                <Text style={[{fontSize:14, fontWeight: 'bold', borderWidth: 0, borderColor: 'black'}, getWidthnHeight(65), getMarginTop(2)]} numberOfLines = {1}>  {(!item.name_of_prospect) ? '--' : item.name_of_prospect } </Text>
                                <TouchableOpacity style={{marginTop: 5}} onPress={() =>this.setState({options: true, optionsKey: key})}>
                                    <View style={{borderRadius:35,borderColor:'#e5314e',width: 28, height: 27,borderWidth:0,justifyContent:'center',alignItems:'center'}}>
                                        <Image source={require('../../Image/blackiconothers.png')} style={{ width: 20, height: 13, transform: [{rotate: '90deg'}]}}/>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={() => this.setState({options: false})}>
                    <View style={[{borderLeftWidth:2,borderLeftColor:color, alignItems: 'flex-start', marginLeft: 10, justifyContent: 'space-between'}, getWidthnHeight(90, 7), getMarginTop(1)]}>
                        <View style={[{borderColor: 'red', borderWidth: 0},getWidthnHeight(80)]}>
                            <View style={{flexDirection:'row',borderLeftWidth:0,borderLeftColor:color, alignItems: 'center', marginLeft: 10}}>
                                <View style={{alignItems: 'center',width:'30%',borderWidth:1,borderColor:'#e5314e'}}>
                                    <Text style={[{fontSize:12,color:'black',height:18,paddingLeft:10,paddingRight:10, textAlignVertical: 'center', fontWeight: 'bold'}, styles.boldFont]}>{item.lead_code}</Text>
                                </View>

                                <View style={[{flexDirection:'row',alignItems:'center',borderWidth:0,borderLeftColor:color, width:'30%'}, getMarginLeft(5)]}>
                                    <Image source={require('../../Image/GrayBuilding.png')} style={{ width: 18, height: 18, }}/>
                                    <Text style={{fontSize:12,color:'#767576'}}>  {(item.business_type == 1)?'Goverment':'Corporate'} </Text>
                                </View>
                            </View>
                        </View>

                        <View style={[{flexDirection:'row',alignItems:'center',borderWidth:0,borderColor:color, marginLeft: 0, justifyContent: 'space-between'}, getWidthnHeight(80)]}>
                            <View style={{borderWidth:0,borderTopRightRadius:10,borderBottomEndRadius:10,justifyContent:'center',alignItems:'center',flexDirection:'row', marginLeft: 10}}>
                                <View style={{backgroundColor:'#e5314e', borderRadius: 20, width: 25, height: 25, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{color:'white', fontSize: 12}}>To:</Text>
                                </View>
                                <Text>    {item.lead_executives !== null ? item.lead_executives.fullname : "--"}</Text>
                            </View>
                            <View style={{borderWidth:0,borderTopRightRadius:10,borderBottomEndRadius:10,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                                <View style={{backgroundColor:'#e5314e', borderRadius: 20, width: 25, height: 25, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{color:'white', fontSize: 12}}>By:</Text>
                                </View>
                                <Text>    {item.user_employee !== null ? item.user_employee.fullname : "--"}</Text>
                            </View>
                        </View>
                    </View>
                    </TouchableWithoutFeedback>
                    {(this.state.options && this.state.optionsKey === key)?
                        <View style={[{backgroundColor: 'transparent', justifyContent: 'center',position: 'absolute', borderWidth: 0, borderColor: 'red'}, getMarginLeft(60), getWidthnHeight(20, 13)]}>
                        <View style={[{backgroundColor: 'white', borderColor: 'grey', borderWidth: 0, elevation: 7, shadowColor: '#000000', alignItems: 'center'}, styles.optionsBG, getWidthnHeight(20, 10)]}>
                            <View style={{alignItems: 'flex-start', justifyContent: 'space-evenly', flex: 1}}>
                                <View>
                                    <TouchableOpacity style={{borderWidth: 0, borderColor: 'red', width: getWidthnHeight(18).width, alignItems: 'center'}} onPress={() => this.setState({
                                        options: false, optionsKey: null }, () => {

                                            navigation.navigate('ViewLead', {
                                                view_lead: item, employeeFullname: item.user_employee.fullname, screen: route.name
                                            })
                                        }
                                    )}>
                                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                                            <Icon name='eye-outline' size={15} style={{marginRight:5}} color='#e5314e'/>
                                            <Text style={{fontSize: 12}}>View</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        </View>
                    :
                        null
                    }
                </View>
            )})
        );
    }
}

const styles = {
    boldFont: {
        ...Platform.select({
          android: {
            fontFamily: ''
          }
        })
    },
    optionsBG: {
        ...Platform.select({
            ios: {
                zIndex: 1,
                shadowOffset: {
                    width: 0,
                    height: 5
                },
                shadowOpacity: 0.3,
                shadowRadius: 5
            }
        })
    }
}

export {RecLeadCard};