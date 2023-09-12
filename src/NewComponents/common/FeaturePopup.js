import  React, { Component } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet, Animated } from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { GradientIcon } from './GradientIcon';
import { getWidthnHeight, getMarginRight } from './width';

class FeaturePopup extends Component {
    constructor(props){
        super(props);
        this.state  = {

        }
        this.rotationTimer = null;
    }

    render(){
        return (
            <View 
                style={[{
                    width: getWidthnHeight(15).width,
                    height: getWidthnHeight(15).width,
                    borderRadius: getWidthnHeight(7.5).width,
                    backgroundColor: 'tomato',
                    alignItems: 'center',
                    justifyContent: 'center'
                }, getMarginRight(3), styles.featureShadow]}
            >
                <GradientIcon
                    start={{x: 0.3, y: 0}}
                    end={{x: 0.7, y: 0}}
                    containerStyle={[{borderWidth: 0, borderColor: 'red', alignItems: 'center'}, getWidthnHeight(10)]}
                    icon={<IonIcons name={'game-controller'} style={{backgroundColor: 'transparent'}} size={getWidthnHeight(10).width}/>}
                    colors={["#084594", "#1572A1"]}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    featureShadow: {
        backgroundColor: '#F9EBC4',
        shadowColor: '#000000',
        elevation: 2,
        shadowOpacity: 0.5,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 5
        }
    }
})

export { FeaturePopup };