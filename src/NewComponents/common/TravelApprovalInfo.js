import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
import ActionModal from 'react-native-modal';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import RequestChange from 'react-native-vector-icons/MaterialIcons';
import {getWidthnHeight, getMarginTop} from './width';

class TravelApprovalInfo extends Component {
    render(){
        const {visible, onBackdropPress, color = '#E5314E'} = this.props;
        return (
            <>
                <ActionModal 
                    isVisible={visible}
                    style={{justifyContent: 'center', alignItems: 'center'}}
                    onBackdropPress={onBackdropPress}
                >
                <View style={[{alignItems: 'center', backgroundColor: 'white', borderRadius: 10}, getWidthnHeight(85, 30)]}>
                    <View style={[{backgroundColor: color, justifyContent: 'center'}, getWidthnHeight(85, 7)]}>
                        <Text style={{textAlign: 'center', fontWeight: 'bold', textAlignVertical: 'center', color: 'white'}}>ICON INFO</Text>
                    </View>
                    <View style={[{justifyContent: 'space-evenly', flex: 1}]}>
                        <View style={{marginTop: 0, justifyContent: 'space-evenly', flex: 1}}>
                            <View style={{flexDirection:'row'}}>
                                <View style={{
                                    width: getWidthnHeight(7).width,height: getWidthnHeight(7).width,borderRadius: (getWidthnHeight(7).width/2),
                                    borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center', alignItems: 'center'}}>
                                    <FontAwesomeIcons name='eye' size={getWidthnHeight(4).width}/>
                                </View>
                                <Text style={{textAlignVertical: 'center', paddingLeft: 10}}>Click To View</Text>
                            </View>

                            <View style={{flexDirection:'row'}}>
                                <View style={{
                                    width: getWidthnHeight(7).width,height: getWidthnHeight(7).width,borderRadius: (getWidthnHeight(7).width/2),
                                    borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center', alignItems: 'center'}}>
                                    <RequestChange name='sync' size={getWidthnHeight(5).width}/>
                                </View>
                                <Text style={{textAlignVertical: 'center', paddingLeft: 10}}>Request Change</Text>
                            </View>

                            <View style={{flexDirection:'row'}}>
                                <View style={[{
                                    width: getWidthnHeight(7).width,height: getWidthnHeight(7).width,borderRadius: (getWidthnHeight(7).width/2),
                                    borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center', alignItems: 'center'}]}>
                                    <FontAwesomeIcons name='edit' size={getWidthnHeight(4).width}/>
                                </View>
                                <Text style={{textAlignVertical: 'center', paddingLeft: 10}}>Edit Request</Text>
                            </View>
                        </View>
                    </View>
                </View>
              </ActionModal>
            </>
        );
    }
}

export {TravelApprovalInfo};