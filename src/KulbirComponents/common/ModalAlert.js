import React from "react";
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { fontSizeH4, getWidthnHeight } from "./width";
import appConfig from '../../../app.json'; 

const ModalAlert = ({
    isVisible = false,
    onDismiss = () => {}
}) => {
    return (
        <Modal
            isVisible={isVisible}
            // onDismiss={onDismiss}
            style={{alignItems: 'center'}}
            // backdropColor="#CDCBCD"
            backdropOpacity={0.5}
        >
            <View style={[{
                backgroundColor: '#F2F1F2', 
                borderRadius: getWidthnHeight(3).width,
                alignItems: 'center'
            }, getWidthnHeight(75)]}>
                <Text style={{
                    fontSize: fontSizeH4().fontSize + 5, fontWeight: '600', paddingHorizontal: getWidthnHeight(4).width,
                    paddingVertical: getWidthnHeight(5).width, textAlign: 'center', color: '#282828'
                }}>{`Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`}</Text>
                <View style={{
                    width: '100%',
                    borderColor: '#E5E5E5',
                    borderWidth: 0.7
                }}/>
                <TouchableOpacity 
                    onPress={onDismiss}
                    style={{width: '100%', alignItems: 'center'}}
                >
                    <Text style={{color: '#397BFF', fontSize: fontSizeH4().fontSize + 5, fontWeight: '400', paddingVertical: getWidthnHeight(4).width}}>Go to Settings</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

export {ModalAlert}