import React from 'react';
import {View, Text, Image, Keyboard, TouchableOpacity, Modal} from 'react-native';
import {getWidthnHeight, getMarginTop} from './width';

export const LoadingModal = ({visible, tempClose, menuState}) => {
    if(visible){
        Keyboard.dismiss();
    }
    return (
        <Modal
            isVisible={visible}
            transparent
            animationType='fade'
            onRequestClose={() => {}}
            style={{justifyContent: 'flex-end'}}
        >
            <View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity onPress={() => { 
                        tempClose();
                    }}>
                        <View style={[{borderWidth: 0, borderColor: 'red'}, getWidthnHeight(20, 12)]}/>
                    </TouchableOpacity>
                </View>
                <View style={[styles.container, getWidthnHeight(100, 88)]}>
                    <View style={[{borderRadius: 10, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: 'white'}, getWidthnHeight(50, 10)]}>
                        <Image style={{width: 60, height: 60}} source={require('../../Image/loader.gif')}/>
                        <Text>Loading...</Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = {
    container: {
        backgroundColor: 'rgba(0, 0, 0,0.75)',
        alignItems: 'center',
        justifyContent: 'center'
    }
}