import React from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import AnimatedLoader from "react-native-animated-loader";
import {getWidthnHeight, getMarginTop} from './width';
import {Spinner} from './Spinner';

const Loader = ({
    visible,
    onRequestClose,
    source,
    backdropColor = 'rgba(0, 0, 0, 0.5)'
}) => {
    return (            
        <Modal
            isVisible={visible}
            style={{justifyContent: 'center', alignItems: 'center'}}
            //onBackdropPress={onRequestClose}
            animationIn="bounceInLeft"
            animationInTiming={800}
            animationOut="slideOutRight"
            animationOutTiming={500}
            backdropColor={backdropColor}
        >
            {/* {<AnimatedLoader
                visible={true}
                overlayColor="rgba(255,255,255,0.2)"
                source= {source}
                animationStyle={styles.lottie}
                speed={1}
            />} */}
            <Spinner loading={visible} style={[styles.loadingStyle, getWidthnHeight(45, 10)]} color='rgb(19,111,232)'/>
        </Modal>
    );
};

const styles = {
    lottie: {
        width: 200,
        height: 200
    }, 
    loadingStyle: {
        flexDirection:'row', 
        backgroundColor: '#EFEFEF',
        marginTop: getMarginTop(4.5).marginTop,
        alignItems: 'center',
        justifyContent: 'center',
        //position: 'absolute', 
        borderRadius: 10,      
        shadowOffset:{width: 0,  height: 5},
        shadowColor: '#000000',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
        borderColor: 'red',
        borderWidth: 0
    }
};

export {Loader};
