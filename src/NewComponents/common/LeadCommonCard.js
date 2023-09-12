import React, {Component} from 'react';
import {View, Text, Image, TouchableWithoutFeedback, TouchableOpacity, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import EditIcon from 'react-native-vector-icons/Feather';
import Chain from 'react-native-vector-icons/FontAwesome';
import {getWidthnHeight, getMarginLeft, getMarginHorizontal, getMarginTop} from './width';

class LeadCommonCard extends Component{
    constructor(props){
        super(props)
        this.state = {
            options: false,
            optionsKey: null
        }
    }
    render(){
        const {leadData, cardStyle, unassignIconFunction, userID, canUnassign, canApprove, navigation, route} = this.props;
        const {options} = this.state;
        return (
            leadData.map((item,key) => {
                //console.log("##### ITEM STATUS: ", item.executive_id, item.status, typeof userID, userID)
                if (item.priority == 0){             //LOW
                    var color = '#3181c4'
                }else if (item.priority == 1){       //NORMAL
                    var color = '#f57f20'
                }else if (item.priority == 2){       //CRITICAL
                    var color = '#ee282c'
                }
                return (
                <View key={key} style={[cardStyle, getWidthnHeight(90, 13)]}>
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
                        <View style={[{borderLeftWidth:2,borderLeftColor:color, alignItems: 'center', marginLeft: 10, justifyContent: 'space-between'}, getWidthnHeight(90, 6), getMarginTop(1)]}>
                            <View style={[getWidthnHeight(90)]}>
                            <View style={{flexDirection:'row',borderLeftWidth:0,borderLeftColor:color, alignItems: 'center', marginLeft: 10}}>
                                <View style={{alignItems: 'center',width:'30%',borderWidth:1,borderColor:'#e5314e'}}>
                                <Text style={[styles.boldFont, {fontSize:12,color:'black',height:18,paddingLeft:10,paddingRight:10, textAlignVertical: 'center', fontWeight: 'bold'}]}>{item.lead_code}</Text>
                                </View>

                                <View style={[{flexDirection:'row',alignItems:'center',borderWidth:0,borderLeftColor:color, width:'30%'}, getMarginLeft(5)]}>
                                    <Image source={require('../../Image/GrayBuilding.png')} style={{ width: 18, height: 18, }}/>
                                    <Text style={{fontSize:12,color:'#767576'}}>  {(item.business_type == 1)?'Goverment':'Corporate'} </Text>
                                </View>
                            </View>
                            </View>

                            <View style={{alignSelf: 'flex-start',borderWidth:0,borderLeftColor:color,paddingLeft:10}}>
                                <View style={{flexDirection:'row',alignItems:'center',borderLeftWidth:0,borderLeftColor:color,paddingLeft:0,justifyContent: 'space-evenly'}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <View style={{borderRadius:35,borderColor:'#e5314e',width: 20, height: 19,borderWidth:1,justifyContent:'center',alignItems:'center',backgroundColor:'#e5314e'}}>
                                            <Image source={require('../../Image/LeadMUser.png')} style={{ width: 10, height: 9, }}/>
                                        </View>
                                        <Text style={{fontSize:12,color:'#e5314e', textAlignVertical: 'center', marginLeft: 5}}> {item.lead_executives !== null ? item.lead_executives.fullname : "--"}</Text>
                                    </View>

                                    <View style={[getMarginHorizontal(5)]}>
                                        <Text style={{fontSize:18,color:'#767576'}}>|</Text>
                                    </View>

                                    <View style={{flexDirection: 'row'}}>
                                        <View style={{borderRadius:35,borderColor:'#e5314e',width: 20, height: 19,borderWidth:1,justifyContent:'center',alignItems:'center',backgroundColor:'#e5314e'}}>
                                            <Image source={require('../../Image/LeadMStatus.png')} style={{ width: 10, height: 9, }}/>
                                        </View>
                                        {(item.priority === 0)?
                                            <Text style={{fontSize:12, textAlignVertical: 'center', marginLeft: 5}}>Low</Text>
                                        :
                                            null
                                        }
                                        {(item.priority === 1)?
                                            <Text style={{fontSize:12, textAlignVertical: 'center', marginLeft: 5}}>Normal</Text>
                                        :
                                            null
                                        }
                                        {(item.priority === 2)?
                                            <Text style={{fontSize:12, textAlignVertical: 'center', marginLeft: 5}}>Critical</Text>
                                        :
                                            null
                                        }
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>

                    {/* AVAILABLE OPTIONS */}
                    {(this.state.options && this.state.optionsKey === key && item.lead_executives !== null)?
                        <View style={[{backgroundColor: 'transparent', justifyContent: 'center',position: 'absolute', borderWidth: 0, borderColor: 'red'}, getMarginLeft(60), getWidthnHeight(20, 13)]}>
                            <View style={[{backgroundColor: 'white', borderColor: 'grey', borderWidth: 0, elevation: 7, shadowColor: '#000000', alignItems: 'center'}, styles.optionsBG, getWidthnHeight(20, 12)]}>
                                <View style={{alignItems: 'flex-start', justifyContent: 'space-evenly', flex: 1}}>
                                    <View>
                                        <TouchableOpacity 
                                        style={{
                                            borderColor: 'red', borderWidth: 0, width: getWidthnHeight(18).width, 
                                            height: getWidthnHeight(undefined, 5).height, justifyContent: 'center'}} 
                                        onPress={() => this.setState({options: false, optionsKey: null }, () => navigation.navigate((userID === 13)? "MDViewLead" : "ViewLead",{view_lead:item, screen: route.name, canApprove: canApprove}))}>
                                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                                                <Icon name='eye-outline' size={15} style={{marginRight:5}} color='#e5314e'/>
                                                <Text style={{fontSize: 12}}>View</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                    {(userID == item.executive_id && ((item.status == '1' ) || (item.status == '2')) || (canUnassign == true && item.executive_id !== 0))?
                                    <View style={[{borderBottomColor: 'grey', borderBottomWidth: 1}, getWidthnHeight(18)]}/>
                                    :
                                    null
                                    }

                                    {(userID == item.executive_id && ((item.status == '1' ) || (item.status == '2'))) ?
                                    <View>
                                        <TouchableOpacity 
                                        style={{
                                            borderColor: 'red', borderWidth: 0, width: getWidthnHeight(18).width, 
                                            height: getWidthnHeight(undefined, 5).height, justifyContent: 'center'}} 
                                        onPress={() => this.setState({options: false, optionsKey: null }, () => navigation.navigate('LeadEdit', {view_lead:item, screen: route.name}))}>
                                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                                            {/* {<Image source={require('../Image/redEditLead.png')} style={{ width: 16, height: 12, }}/> } */}
                                            <EditIcon name='edit' size={15} style={{marginRight: 5}} color='#e5314e'/>
                                            <Text style={{fontSize: 12}}>Edit</Text>
                                        </View>
                                        </TouchableOpacity>
                                    </View>
                                    :null
                                    }

                                    {canUnassign == true && item.executive_id !== 0 ?
                                    <View>
                                        <TouchableOpacity 
                                        style={{
                                            borderColor: 'red', borderWidth: 0, width: getWidthnHeight(18).width, 
                                            height: getWidthnHeight(undefined, 5).height, justifyContent: 'center'}} 
                                        onPress={() => {
                                            this.setState({options: false, optionsKey: null })
                                            unassignIconFunction(item.id);
                                        }}> 
                                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                                            <Chain name='chain-broken' size={12} style={{marginRight: 5}} color='#e5314e'/>
                                            <Text style={{fontSize: 12}}>Unassign</Text>
                                        </View>
                                        </TouchableOpacity>
                                    </View>
                                    :null
                                    }
                                </View>
                            </View>
                        </View>
                    :
                        null
                    }
                </View>
            )})
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

export {LeadCommonCard};