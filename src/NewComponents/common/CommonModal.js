import React, { Component } from 'react';
import {Text, View, Modal, Platform, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';

import {Button} from './Button';
import { loginState } from '../../store/redux/reducer';
import {getWidthnHeight} from './width';

class CommonModal extends Component{
    constructor(props){
        super(props)
            this.state = {
                errorCode: null
            }
    }
    async componentDidMount(){
        if(this.props.apiCode){
            console.log("### OUTSIDE ERROR CODE: ", this.props.apiCode)
            if(this.props.apiCode === 3){
                console.log("### INSIDE ERROR CODE: ", this.props.apiCode)
                this.setState({errorCode: this.props.apiCode})
            }
        }
    }

    logoutWithoutApi = () =>{
        console.log("&&&LOG OUT")
        // await AsyncStorage.removeItem('receivedBaseURL');
        // await AsyncStorage.removeItem('user_token');
        // await AsyncStorage.removeItem('userObj');
        AsyncStorage.clear();
        this.props.onDecline();
        this.props.loginState(null);
        Alert.alert("Please Login Again");
    }

    render(){
        const {title, subtitle, visible, onDecline, buttonColor, buttonText = "OK"} = this.props;
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={() => {}}
        >
            <View style={styles.container}>
                <View style={[{backgroundColor: 'white', borderRadius: 10, alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(90, 15)]}>
                    <Text style={[{textAlign: 'center', color: '#E72828'}, getWidthnHeight(80)]}>{title}</Text>
                    <Text style={[{textAlign: 'center', color: '#E72828'}, getWidthnHeight(80)]}>{subtitle}</Text>
                </View>
                <Button 
                    onPress={() => {
                        if(this.state.errorCode === 3){
                            this.logoutWithoutApi();
                            onDecline();
                        }else{
                            onDecline();
                        }
                    }} 
                    style={[{textAlign: 'center'}, getWidthnHeight(90)]} buttonColor={buttonColor}>{buttonText}</Button>
            </View>
        </Modal>
    )}
};

const styles = {
    container: {
        backgroundColor: 'rgba(0,0,0,0.75)',
        position: 'relative',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
};

const CommonModalComponent = connect(null, { loginState })(CommonModal);
export {CommonModalComponent as CommonModal};

// export {CommonModal};