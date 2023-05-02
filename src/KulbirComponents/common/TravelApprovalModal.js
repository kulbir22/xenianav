import React, {Component} from 'react';
import { View, Text, TouchableHighlight, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import AlertIcon from 'react-native-vector-icons/Foundation';
import {getWidthnHeight, getMarginHorizontal, getMarginVertical, fontSizeH3, fontSizeH4,} from './width';

class TravelApprovalModal extends Component {
    render(){
        const {containerStyle, isVisible, toggle, requestChange} = this.props;
        return (
            <View>
                <Modal 
                    isVisible={isVisible}
                    onBackdropPress={toggle}
                    animationIn="bounceInLeft"
                    animationInTiming={800}
                    animationOut="slideOutRight"
                    animationOutTiming={500}
                >
                    <View style={[containerStyle]}>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                            <View style={{borderWidth: 0, borderColor: 'black', justifyContent: 'center'}}>
                                <AlertIcon color='#FFC074' name="alert" size={getWidthnHeight(17).width}/>
                            </View>
                            <View style={{alignItems: 'center', borderWidth: 0, borderColor: 'red'}}>
                                <Text style={{fontSize: fontSizeH3().fontSize}}>Are you sure ?</Text>
                                <Text style={{fontSize: fontSizeH4().fontSize}}>You want to change this Travel approval request!</Text>
                            </View>
                            <View style={[{flexDirection: 'row', justifyContent: 'space-evenly', borderWidth: 0, borderColor: 'black'}, getWidthnHeight(80)]}>
                                <TouchableOpacity onPress={toggle}>
                                    <View style={[{borderColor: 'lightgrey', borderWidth: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: '#EBE6E6'}, getWidthnHeight(30, 6)]}>
                                        <Text>No, cancel it!</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    toggle();
                                    requestChange();
                                }}>
                                    <View style={[{borderColor: '#DB3056', borderWidth: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: '#DB3056'}, getWidthnHeight(30, 6)]}>
                                        <Text style={[fontSizeH4(), {color: 'white'}]}>Yes, I am sure!</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

export {TravelApprovalModal};