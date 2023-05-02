import React from 'react';
import {TextInput, View, Text} from 'react-native';
import {getMarginLeft,getMarginTop, getWidthnHeight} from './width';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import Paid from 'react-native-vector-icons/FontAwesome';

function Circle({ position, activecircle = false, status}) {
    const {containerStyle, inputStyle, labelStyle} = styles;
    console.log("### STATUS: ", status)
    return (
        <View>
            <View style ={{alignItems:'center',justifyContent:'center'}}>
                {status == 'approved' &&
                    <View style={[{
                        backgroundColor:'white', borderRadius:(getWidthnHeight(15).width), borderWidth: getWidthnHeight(1.5).width, 
                        borderColor:'#01937C', width: getWidthnHeight(15).width, height: getWidthnHeight(15).width, alignItems: 'center',
                        justifyContent: 'center' 
                    }]}>
                        <View style = {[{alignItems:'center', justifyContent:'center'}]}>
                            <FontAwesome name = {"check"} size = {getWidthnHeight(8).width} color = {'#01937C'}/> 
                        </View>
                    </View>
                }
                {status == 'rejected' &&
                    <View style={[{
                        backgroundColor:'white', borderRadius:(getWidthnHeight(15).width), borderWidth: getWidthnHeight(1.5).width, 
                        borderColor:'#E93B30', width: getWidthnHeight(15).width, height: getWidthnHeight(15).width, alignItems: 'center',
                        justifyContent: 'center' 
                    }]}>
                        <View style = {[{alignItems:'center', justifyContent:'center'}]}>
                            <FontAwesomeIcons name = {"close"} size = {getWidthnHeight(8).width} color = {'#E93B30'}/> 
                        </View>
                    </View>
                }
                {status == 'back' &&    
                    <View style={[{
                        backgroundColor:'white', borderRadius:(getWidthnHeight(15).width), borderWidth: getWidthnHeight(1.5).width, 
                        borderColor:'#E68F1B', width: getWidthnHeight(15).width, height: getWidthnHeight(15).width, alignItems: 'center',
                        justifyContent: 'center' 
                    }]}>
                        <View style = {[{alignItems:'center', justifyContent:'center'}]}>
                            <FontAwesome name = {"level-up-alt"} size = {getWidthnHeight(8).width} color = {'#E68F1B'}/> 
                        </View>
                    </View>
                }
                {status == 'paid' &&
                    <View style={[{
                        backgroundColor:'white', borderRadius:(getWidthnHeight(15).width), borderWidth: getWidthnHeight(1.5).width, 
                        borderColor:'#01937C', width: getWidthnHeight(15).width, height: getWidthnHeight(15).width, alignItems: 'center',
                        justifyContent: 'center' 
                    }]}>
                        <View style = {[{alignItems:'center', justifyContent:'center'}]}>
                            <FontAwesome name = {"check"} size = {getWidthnHeight(8).width} color = {'#01937C'}/>
                        </View>
                    </View>
                }
                {(status == 'new') &&
                    <View style={[{
                        backgroundColor:'white', borderRadius:(getWidthnHeight(15).width), borderWidth: getWidthnHeight(1.5).width, 
                        borderColor:'#EFEFEF', width: getWidthnHeight(15).width, height: getWidthnHeight(15).width, alignItems: 'center',
                        justifyContent: 'center' 
                    }]}>
                        <View style = {[{alignItems:'center', justifyContent:'center'}]}>
                            <FontAwesome />
                        </View>
                    </View>
                } 
                {(status == '') &&
                    <View style={[{
                        backgroundColor:'white', borderRadius:(getWidthnHeight(15).width), borderWidth: getWidthnHeight(1.5).width, 
                        borderColor:'#EFEFEF', width: getWidthnHeight(15).width, height: getWidthnHeight(15).width, alignItems: 'center',
                        justifyContent: 'center' 
                    }]}>
                        <View style = {[{alignItems:'center', justifyContent:'center'}]}>
                            <FontAwesome />
                        </View>
                    </View>
                }    
            </View>
        </View>
  );
};

const styles = {
    labelStyle: {
        fontSize: 18,
        paddingLeft: 20,
        flex: 1,
    },
    containerStyle: {
        height: 50,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputStyle: {
        color: '#000',
        paddingLeft: 5,
        paddingRight: 5,
        fontSize: 18,
        lineHeight: 23,
        flex: 2,
    },
};

export {Circle};
