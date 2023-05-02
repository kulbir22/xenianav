import React, {Component} from 'react';
import {View, Text, Image, TouchableWithoutFeedback, TouchableOpacity} from 'react-native';
import {getWidthnHeight, getMarginLeft, getMarginTop, getMarginHorizontal} from './width';

class UnassignLeadCard extends Component{
    constructor(props){
        super(props)
        this.state = {
            options: false,
            optionsKey: null
        }
    }
    render(){
        const { leadData, cardStyle, openAssignLeadModal, selectedLead } = this.props;
        const {options} = this.state;
    return (
        leadData.map((item,key) => {
            if (item.priority == 0){                    //LOW
                var color = '#3181c4'
            }else if (item.priority == 1){              //NORMAL
                var color = '#f57f20'
            }else if (item.priority == 2){              //CRITICAL
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
                                    <Text style={[{fontSize:12,color:'black',height:18,paddingLeft:10,paddingRight:10, textAlignVertical: 'center', fontWeight: 'bold'}, styles.boldFont]}>{item.lead_code}</Text>
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
                                    <Text style={{fontSize:12,color:'#e5314e', textAlignVertical: 'center', marginLeft: 5}}>--</Text>
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
                    {(this.state.options && this.state.optionsKey === key)?
                        <View style={[{backgroundColor: 'transparent', justifyContent: 'center',position: 'absolute', borderWidth: 0, borderColor: 'red'}, getMarginLeft(60), getWidthnHeight(20, 13)]}>
                        <View style={[{backgroundColor: 'white', borderColor: 'grey', borderWidth: 0, elevation: 7, shadowColor: '#000000', alignItems: 'center'}, styles.optionsBG, getWidthnHeight(20, 10)]}>
                            <View style={{alignItems: 'flex-start', justifyContent: 'space-evenly', flex: 1}}>
                                <View>
                                    <TouchableOpacity style={{borderWidth: 0, borderColor: 'red', width: getWidthnHeight(18).width}} onPress={() => {
                                        this.setState({options: false, optionsKey: null}, () => {
                                        console.log("SELECTED LEAD CODE: ", item.id)
                                        selectedLead(item.id, item.lead_code)
                                        openAssignLeadModal();
                                    })}}>
                                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                                        <Image source={require('../../Image/assigned.png')} style={{ width: 15, height: 15, marginRight: 5}}/>
                                        <Text style={{fontSize: 12}}>Assign</Text>
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

export {UnassignLeadCard};