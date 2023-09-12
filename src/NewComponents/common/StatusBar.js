import React, {Component} from 'react';
import { StatusBar } from 'react-native'

class IOS_StatusBar extends Component {
    render(){
        const { barStyle = 'light-content' } = this.props;
        return (
            <StatusBar backgroundColor={'transparent'} barStyle={barStyle} translucent={true}/>
        );
    }
}

export {IOS_StatusBar};