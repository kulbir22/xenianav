import React, {Component} from 'react';
import {TouchableOpacity, View, Alert, StyleSheet} from 'react-native';
import moment from 'moment';
import {RNCamera} from 'react-native-camera';
import Modal from 'react-native-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { getWidthnHeight } from './width';

class BasicCamera extends Component {
    constructor(props) {
    super(props);
    this.state = {
            takingPic: false,
            toggleCamera: false,
        };
    }

    componentDidMount(){
        const {rearCamera} = this.props;
        if(rearCamera){
            this.setState({toggleCamera: rearCamera})
        }
    }

    takePicture = async () => {
        console.log("Touched Camera")
        const {
            imageQuality = null, width = null, height = null, rearCamera = false, closeCamera = () => {},
            captureImage = () => {}
        } = this.props;
        if (this.camera && !this.state.takingPic){
            let options = {
                quality: (this.state.toggleCamera)? (imageQuality)? imageQuality : 0.25 : 0.50,
                fixOrientation: true,
                forceUpOrientation: true,
                width: (width)? width : 400,
                height: (height)? height : 500,
            };
            console.log("Camera Quality: ", options.quality, options.width, options.height)
            this.setState({takingPic: true});
        
            try {
                this.camera.takePictureAsync(options).then((data) => {
                    const filePath = data.uri;
                    const splitArray = filePath.split('Camera/');
                    const fileData = {type: 'image/jpeg', name: splitArray[1], timeStamp: moment().valueOf()}
                    const addTimeStamp = Object.assign(data, fileData);
                    captureImage(addTimeStamp);
                    closeCamera();
                });
                //Alert.alert('Success', JSON.stringify(data));
            } catch (err) {
                Alert.alert('Error', 'Failed to take picture: ' + (err.message || err));
                return;
            } finally {
                this.setState({takingPic: false});
            }
        }
      };

    render() {
        const {style, rearCamera, isVisible = false, closeCamera = () => {}} = this.props;
        console.log("CAMERA COMPONENT")
    return (
        <View style={{alignItems: 'center'}}>
            <Modal
                isVisible={isVisible}
                style={{flex: 1, justifyContent: 'flex-start'}}
                backdropOpacity={1}
            >
                <View style={{alignItems: 'center', flex: 1}}>
                    <View style={{flex: 1}}>
                        <RNCamera 
                            ref={ref => {
                                this.camera = ref;
                            }}
                            captureAudio={false}
                            style={[{borderWidth: 0, borderColor: 'white'},style]}
                            type={(this.state.toggleCamera)? RNCamera.Constants.Type.back : RNCamera.Constants.Type.front}
                            androidCameraPermissionOptions={{
                                title: 'Permission to use camera',
                                message: 'We need your permission to use your camera',
                                buttonPositive: 'Ok',
                                buttonNegative: 'Cancel',
                        }}/>
                    </View>
                    <View 
                        style={[{
                        backgroundColor: 'transparent', alignItems: 'center'
                        }, StyleSheet.absoluteFill]} 
                        pointerEvents={'auto'}
                    >
                        <View style={[{justifyContent: 'space-between'}, getWidthnHeight(100, 95)]}>
                            <TouchableOpacity 
                                style={{
                                    marginLeft: 0, marginTop: 0, borderColor: 'white', borderWidth: 0, width: getWidthnHeight(12).width, 
                                    height: getWidthnHeight(12).width, alignItems: 'center', justifyContent: 'center'
                                }} 
                                onPress={() => closeCamera()}
                            >
                                <IonIcons color='#FFFFFF' name='arrow-back-circle-sharp' size={getWidthnHeight(10).width}/>
                            </TouchableOpacity>
                            <View style={[{flexDirection: 'row', borderWidth: 0, borderColor: 'cyan', alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(100, 10)]}>
                                <View style={[{borderWidth: 0, borderColor: 'white'}, getWidthnHeight(33)]}>
                                    <View style={{borderWidth: 0, borderColor: 'white', flex: 1, justifyContent: 'center'}}>
                                        <TouchableOpacity 
                                            style={{
                                                borderColor: 'cyan', borderWidth: 0, width: getWidthnHeight(12).width, height: getWidthnHeight(undefined, 8).height,
                                                alignItems: 'center', justifyContent: 'center'
                                            }} 
                                            onPress={() => this.setState({toggleCamera: !this.state.toggleCamera})}
                                        >
                                            <IonIcons color='#FFFFFF' name='camera-reverse-sharp' size={getWidthnHeight(8).width}/>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={[{alignItems: 'center', justifyContent: 'center', borderWidth: 0, borderColor: 'tomato'}, getWidthnHeight(33)]}>
                                    <TouchableOpacity style={[{alignItems: 'center', borderWidth: 0, borderColor: 'white'}, getWidthnHeight(20)]} onPress={this.takePicture.bind(this)}>
                                        <MaterialIcons color='#FFFFFF' name='camera' size={getWidthnHeight(17).width}/>
                                    </TouchableOpacity>
                                </View>
                                <View style={[{borderWidth: 0, borderColor: 'yellow'}, getWidthnHeight(33)]}/>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
        );
    }
}

    const styles = StyleSheet.create({
        btnAlignment: {
           flex: 1,
           flexDirection: 'column',
           justifyContent: 'flex-end',
           alignItems: 'center',
           marginBottom: 20,
         },
     });


export {BasicCamera};