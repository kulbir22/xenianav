import React, { Component } from 'react';
import { Platform, ScrollView } from 'react-native';
import {Text, View, TouchableOpacity} from 'react-native';
import Close from 'react-native-vector-icons/EvilIcons';
import ActionModal from 'react-native-modal';
import {getWidthnHeight, fontSizeH2, getMarginTop, fontSize_H3, fontSizeH4, fontSizeH3} from './width';

class ListModal extends Component{
    constructor(props){
        super(props)
            this.state = {
                errorCode: null
            }
    }

    render(){
        const {title, visible, onDecline, titleStyle, data} = this.props;
        //console.log("^^^^ &&&&& MODAL DATA: ", data)
    return (
        <ActionModal 
            isVisible={visible}
            style={[{alignItems: 'center'}]}
            onBackdropPress={onDecline}
        >
            <View style={[{backgroundColor: 'rgba(0,0,0, 0.70)', borderRadius: 10, alignItems: 'center', borderWidth: 0, borderColor: 'red', justifyContent: 'space-evenly'}, getWidthnHeight(100, 100)]}> 
                <Text style={[{textAlign: 'center', color: 'white', fontWeight: 'bold'}, fontSizeH2(), getMarginTop(4), styles.boldFont, getWidthnHeight(80)]}>{title}</Text>
                <View style={[{justifyContent: 'center', borderColor: 'white', borderWidth: 0}, getMarginTop(4), getWidthnHeight(undefined, 65)]}>
                    <View style={{flex: 1}}>
                        <ScrollView>
                            {data.map((item, index) => {
                                let splitName, name;
                                let upperCaseArray = [];
                                if(title.toLowerCase() === 'perks'){
                                    name = item.name;
                                }else{
                                    splitName = item.manager.employee.fullname.split(' ');
                                    upperCaseArray = [];
                                    for(let i = 0; i < splitName.length; i++){
                                        upperCaseArray[i] = splitName[i].replace(/^\w/, (c) => c.toUpperCase());
                                    }
                                    console.log("CAPS NAME: ", upperCaseArray.join(' '))
                                    name = upperCaseArray.join(' ');
                                }
                                return (
                                    <View style={[{flexDirection: 'row'}, getMarginTop(1)]}>
                                        <Text style={[{color: 'white', textAlign: 'left', fontSize: fontSizeH3().fontSize}]}>{index + 1}. </Text>
                                        <Text style={[{color: 'white', textAlign: 'left', fontSize: fontSizeH3().fontSize}]}>{name}</Text>
                                    </View>
                                )
                            })}
                        </ScrollView>
                    </View>
                </View>
                <TouchableOpacity onPress={onDecline}>
                    <View style={{
                        width: getWidthnHeight(17).width, height: getWidthnHeight(17).width, 
                        borderRadius: getWidthnHeight(10).width, backgroundColor: 'white',
                        alignItems: 'center', justifyContent: 'center'}}>
                        <Close name="close" size={getWidthnHeight(10).width} color="black"/>
                    </View>
                </TouchableOpacity>
            </View>
        </ActionModal>
    )}
};

const styles = {
    boldFont: {
        ...Platform.select({
            android: {
                fontFamily: ''
            }
        })
    }
}

export {ListModal};