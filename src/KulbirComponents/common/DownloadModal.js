import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
import ActionModal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons'
import EditIcon from 'react-native-vector-icons/Feather';
import Chain from 'react-native-vector-icons/FontAwesome';
import {getWidthnHeight} from './width';

class DownloadModal extends Component {
    render(){
        const {visible, onBackdropPress, color = '#1079D5', percent, fileName} = this.props;
        return (
            <>
                <ActionModal 
                    isVisible={visible}
                    style={{justifyContent: 'center', alignItems: 'center'}}
                    onBackdropPress={onBackdropPress}
                >
                <View style={[{alignItems: 'center', backgroundColor: 'white', borderRadius: 10}, getWidthnHeight(85, 25)]}>
                    <View style={[{backgroundColor: color, justifyContent: 'center'}, getWidthnHeight(85, 7)]}>
                        <Text style={{textAlign: 'center', fontWeight: 'bold', textAlignVertical: 'center', color: 'white'}}>Download</Text>
                    </View>
                    <View style={[{alignItems: 'center', justifyContent: 'space-evenly', flex: 1}, getWidthnHeight(80)]}>
                        <Text style={[{textAlign: 'center'}, getWidthnHeight(60)]}>{fileName}</Text>
                        <Text style={{color: color}}>{`Downloading(${percent}%)...`}</Text>
                    </View>
                </View>
              </ActionModal>
            </>
        );
    }
}

export {DownloadModal};