import React, { Component } from 'react';
import {Text, View, Modal, Image, TouchableOpacity} from 'react-native';
import {Camera, getWidthnHeight} from '../KulbirComponents/common';

class CameraScreen extends Component{
    constructor(props){
        super(props)
    }
    render(){
        const params = this.props.route.params;
        // console.log("@#@#@#@# ACTUAL CAMERA: ", this.props.navigation)
    return (
            <View style={styles.container}>
                <View>
                    <Camera goBack={() => this.props.navigation.goBack()} {...params} style={[getWidthnHeight(100, 95)]}/>
                </View>
                {/* {<Button onPress={onDecline} style={[getWidthnHeight(90)]} buttonColor={buttonColor}>Close</Button>} */}
            </View>
    )}
};

const styles = {
    container: {
        backgroundColor: 'rgba(0,0,0,0.85)',
        position: 'relative',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
};

export default CameraScreen;