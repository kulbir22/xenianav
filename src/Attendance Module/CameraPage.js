import React from 'react';
import {
    Alert, PermissionsAndroid, Image, PixelRatio, StyleSheet,
    Text, TouchableOpacity, View, KeyboardAvoidingView, Keyboard, Dimensions,
    TextInput, BackHandler, Linking, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import axios from 'axios';
import ImagePicker from 'react-native-image-picker';
import DeviceInfo from 'react-native-device-info';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import LinearGradient from 'react-native-linear-gradient';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
//import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import Utils from '../Utils';
import {extractBaseURL} from '../api/BaseURL';
import {getWidthnHeight, CommonModal, IOS_StatusBar, WaveHeader, getMarginTop, Spinner, getMarginLeft, ModalAlert} from '../NewComponents/common';
import { cameraFile, setReloadHome } from '../store/redux/reducer';
import appConfig from '../../app.json';

const { width, height } = Dimensions.get('window');

const LATITUDE_DELTA = 0.00922;
const LONGITUDE_DELTA = 0.00421;

    export async function request_camera_runtime_permission() {
        try {
            const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    'title': 'XENIA Camera Permission',
                    'message': 'XENIA App needs access to your Camera '
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {

            }else {
                Alert.alert("Camera Permission Not Granted");
            }
        }catch (err) {
          console.warn(err)
        }
    }


    class App extends React.Component {
        constructor(props) {
            super(props)
            this.state = {
                file:'',
                file_sec:'',
                comment:'Check-In',
                type:'Check-In',
                isMapReady:false,
                latitude: null,
                longitude: null,
                latitudeDelta: '',
                longitudeDelta: '',
                receivedCurrentLocation:true,
                loading: true,
                animating: true,
                location: null,
                comment_error:'',
                baseURL: null,
                errorCode: null,
                apiCode: null,
                commonModal: false,
                image: false,
                data: null,
                fileError: true,
                Lat_LongError: true,
                commentError: false,
                buttonPressed: false,
                distance: 0,
                anyError: function(){
                  return (this.fileError === true || this.Lat_LongError === true || this.commentError === true)
                },
                allError: function(){
                  return (this.fileError === false && this.Lat_LongError === false && this.commentError === false)
                },
                iOSAlert: false
            };
            this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
        }

    selectPhotoTapped() {
        const options = {
            quality: 0.5,
            maxWidth: 400,
            maxHeight: 400,
            cameraType:'front',
            storageOptions: {
                waitUntilSaved: true,
                cameraRoll: true,
                skipBackup : true,
            },
        };
        ImagePicker.launchCamera(options, (response)  => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }else {
                let source = {uri:response.uri,type:response.type,name:response.fileName};
                console.log(source)
                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({
                    file: source,
                    file_sec: response.data
                }, () => console.log("IMAGE FILE: ", this.state.file));
            }
        });
    }

    componentDidMount() {
        const { navigation } = this.props;
        this._unsubscribe = navigation.addListener('focus', async() => {
            await this.extractLink();
            this.findCoordinates();
            if(this.props.file?.uri){
                const filePath = this.props.file.uri;
                const splitArray = filePath.split('Camera/')
                const fileData = {type: 'image/jpeg', name: splitArray[1], uri: filePath}
                console.log("OBJECT ASSIGN: ", Object.assign({}, fileData))
                this.setState({data: filePath}, () => {
                    if(this.state.data){
                        this.props.cameraFile(null)
                    }
                    console.log("FILE: ", this.state.data)
                })
                this.setState({image: true})
                this.setState({fileError: false})
                this.setState({file: fileData}, () => console.log("FILE DATA: ", this.state.file))
            }
            console.log("FILE: ", this.state.data)
            console.log('********ComponentDidMount*********');
            this._isMounted = true;
            const context = this;
            context.askPermissions(context);
        })
    }

    componentWillUnmount(){
        this._unsubscribe();
    }

    async extractLink(){
        await extractBaseURL().then((baseURL) => {
            this.setState({baseURL}, () => console.log("EXTRACT LINK: ", this.state.baseURL))
        })
    } 
    
    async hasPermissionIOS (){
		const status = await Geolocation.requestAuthorization('whenInUse');

		if (status === 'granted') {
			return true;
		}

		if ((status === 'disabled' || status === 'denied') && !this.state.iOSAlert) {
            this.setState({iOSAlert: true});
		}

		return false;
	};

    async askPermissions(context) {
        //Checking for the permission just after component loaded
        async function requestLocationPermission() {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION  
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('granted');
                    console.log('show location dialog if gps is off');
                    //To Check, If Permission is granted
                    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
                        .then(data => {
                            console.log('enabled or already enabled gps');
                            // The user has accepted to enable the location services
                            // data can be :
                            //  - "already-enabled" if the location services has been already enabled
                            //  - "enabled" if user has clicked on OK button in the popup
                            Geolocation.getCurrentPosition(
                                (position) => {
                                    console.log("current position");
                                    console.log(position);
                                    if (context._isMounted) {
                                        context.setState({
                                            latitude: position.coords.latitude,
                                            longitude: position.coords.longitude,
                                            Lat_LongError: false
                                        }, () => {
                                            const { details } = context.props.route.params;
                                            console.log("FIND COORDINATES: ", context.state.latitude, context.state.longitude)
                                            if(details.office_latitude && details.office_longitude){
                                                context.calculateDistance(context.state.latitude, context.state.longitude);
                                            }else{
                                                context.hideLoader();
                                            }
                                        })
                                    }
                                },
                                (error) => console.log(error.message),
                                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                            );
                        }).catch(err => {
                            // The user has not accepted to enable the location services or something went wrong during the process
                            // "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
                            // codes :
                            //  - ERR00 : The user has clicked on Cancel button in the popup
                            //  - ERR01 : If the Settings change are unavailable
                            //  - ERR02 : If the popup has failed to open
                            console.log(err)
                            if (err && err.code === 'ERR00') {
                                BackHandler.exitApp()
                            }
                        });
                }else{
                    console.log('permission denied');
                    BackHandler.exitApp()
                }
            }catch (err){
                console.log('error in runtime permission block');
                console.warn(err)
            }
        }
        if (Utils.isAndroid()) {
            //Calling the permission function
            requestLocationPermission();
        }
        if(Platform.OS === "ios"){
            const hasPermission = await this.hasPermissionIOS();
            if(!hasPermission){
                return;
            }
        }
    }

    hideLoader = () => {
        this.setState({ loading: false });
    }

    showLoader = () => {
        this.setState({ loading: true });
    }
 
    async calculateDistance(latitude, longitude){
        const { details } = this.props.route.params;
        const R = 6371; //Radius of earth in KM
        //console.log("***COORDINATES*** ", coordinates)
        let dLat = this.deg2rad(details['office_latitude'] - latitude)
        let dLng = this.deg2rad(details['office_longitude'] - longitude)
        let a = Math.sin(dLat/2) * Math.sin(dLat/2) +  
                Math.cos(this.deg2rad(latitude)) * Math.cos(this.deg2rad(details['office_latitude'])) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let num = R * c * 1000; //Distance in Meters
        let distance = Number(num.toFixed(1))
        console.log("@@@DISTANCE*** ", distance, latitude, longitude);
        if(distance > details.permit_distance){
            Alert.alert("Alert", `You should remain within ${details.permit_distance} meters from your office`, [
                {
                    text: 'OK',
                    onPress: () => {
                        this.hideLoader();
                        this.props.navigation.goBack();
                    }
                }
            ]);
        }else{
            this.hideLoader();
        }
    }

    deg2rad(deg){
        return deg * (Math.PI/180)
    }

    async markAttendance(latitude, longitude){
        const {comment, baseURL, file} = this.state;
        const { 
            details, successToken,  button, project,
            userName, user_id, xyz
        } = this.props.route.params;
        const { navigation } = this.props;
        // const parentNavigation = navigation.getParent('RootDrawer');
        this.showLoader();
        const userObj= await AsyncStorage.getItem('user_token');
        const parsedData = JSON.parse(userObj);
        const secretToken = parsedData.success.secret_token;
        const name = (userName.fullname);
        const userID = (user_id.userid);
        console.log("&&& DATA: ",secretToken, latitude, longitude, comment, file, xyz, userID, name)
        const formData = new FormData();
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);
        formData.append('comment', comment);
        formData.append('file', file);
        formData.append('type', xyz);
        formData.append('ver', DeviceInfo.getVersion());
        formData.append('auth', secretToken);
        formData.append('user_id', userID);
        axios.post(`${baseURL}/attendance-location`, 
            formData
        ,
        {
            headers: {
                "Accept": "application/json",
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${secretToken}`
            }
        }).then((response) => {
            this.hideLoader();
            this.props.setReloadHome(true);
            this.setState({
                file: undefined, comment: 'Check-In', fileError: true, Lat_LongError: true,
                commentError: false, buttonPressed: false
            })
            Alert.alert(
                name.toUpperCase(), 
                "YOUR ATTENDANCE HAS BEEN SUCCESSFULLY SAVED", 
                [{
                    text: 'OK'
                }]
            );   
            navigation.navigate('Home');
            // navigation.reset({
            //     index: 0,
            //     routes: [
            //         {
            //             key: "MainDrawer-lrxSaG5vx1afKmF2QB_Kr", name: "MainDrawer"
            //         }
            //     ]
            // })
        }).catch((error) => {
            this.hideLoader();
            this.findCoordinates();
            console.log("@@@ error ",error.response)
            this.setState({buttonPressed: false})
            if(error.response?.data){
                Alert.alert("@Error", JSON.stringify(error.response.data))
            }else if(error.response?._response){
                Alert.alert("Error!", JSON.stringify(error.response._response))
            }
        })
    }

    hide = () => {
        const a= Keyboard.dismiss();
    }

    functionCombined() {
        const anyError = this.state.anyError();
        const allError = this.state.allError();
        if(anyError){
            Alert.alert("Please fill the fields highlighted in RED")
        }
        if(allError){
            Keyboard.dismiss();
            this.findCoordinates(true);
        }
    }

    error(){
        if(this.state.file == null){
            Alert.alert('The file field is required.')
        }
    }

    async findCoordinates (call = false) {
        if(Platform.OS === "ios"){
            const hasPermission = await this.hasPermissionIOS();
            if(!hasPermission){
                return;
            }
        }
        Geolocation.getCurrentPosition(
            (position) => {
                const latitude = JSON.stringify(position.coords.latitude);
                const longitude = JSON.stringify(position.coords.longitude);
                console.log("^&^&^ LATITUDE: ", latitude);
                console.log("^&^&^ LONGITUDE: ", longitude);
                if(call === true){
                    this.setState({latitude: null, longitude: null, Lat_LongError: true}, () => {
                        if(!this.state.latitude && !this.state.longitude){
                            this.markAttendance(latitude, longitude);
                        }
                    });
                }else{
                    this.setState({latitude: latitude, longitude: longitude, Lat_LongError: false}, () => {
                        const { details } = this.props.route.params;
                        console.log("###FIND COORDINATES: ", this.state.latitude, this.state.longitude)
                        if(!!details.office_latitude && !!details.office_longitude){
                            this.calculateDistance(this.state.latitude, this.state.longitude);
                        }else{
                            this.hideLoader();
                        }
                    });
                }
                // this.setState({ location });
            },
            (error) => {
                this.hideLoader();
                console.log("#$#@#@ GEOLOCATION ERROR: ", error)
                Alert.alert("Error !", error.message, [{
                    text: 'Go Back',
                    onPress: () => this.props.navigation.goBack()
                }])
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
    };

    renderHeader(){
        return (
            <WaveHeader
                wave={Platform.OS ==="ios" ? false : false} 
                //logo={require('../Image/Logo-164.png')}
                menu='white'
                menuState={false}
                title='Check In'
            />
        );
    }

    onDecline(){
        this.setState({commonModal: false})
    }

    checkBlank(){
        const {comment, loading} = this.state;
        if(loading){
            return;
        }
        this.setState({buttonPressed: true})
        const check = comment.trim();
        if(check){
            this.functionCombined();
        }else{
            this.setState({commentError: true, comment: ''})
            Alert.alert("Please fill the fields highlighted in RED")
        }
    }

    render() {
        const {errorCode, apiCode, buttonPressed, fileError, Lat_LongError, commentError, loading} = this.state;
        const { 
            details, successToken,  button, project,
            userName, user_id, xyz 
        } = this.props.route.params;
        const { navigation } = this.props;
        const animating = this.state.animating;
        const context=this;
        // const card = {card: {width: width, height: height}};
        var name = userName.fullname;
        // var  coordinate=;
        const latitude=this.state.latitude;
        const longitude = this.state.longitude;
        var region = {
            latitude: Number(details.office_latitude),
            longitude: Number(details.office_longitude),
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        }
        // const kayboard=this.state.KeyboardAvoidingView
        let buttonColor = button;
        let gradient = button;
        let gradientShadow = ['#0D4EBA', '#197EC4'];
        const circleWidth = getWidthnHeight(50)
        const circleHeight = {height: circleWidth.width}
        console.log("###$$$ OFFICE LOCATION: ", details)
        return (
            <View>
                <KeyboardAvoidingView behavior="position" style={styles.container}>
                    <IOS_StatusBar color={gradient} barStyle="light-content"/>
                    <View>
                        <View style={{flex: 1, alignItems: 'center', borderColor: 'red', borderWidth: 0}}>
                            <View style={{alignItems: 'center', marginVertical: 20}}>
                                {(!this.state.image)?
                                    <View style={[{
                                        borderRadius: 200, backgroundColor: '#69726F', alignItems: 'center', 
                                        justifyContent: 'center', shadowColor: '#000000', elevation: 7, 
                                        shadowOpacity: 0.3, shadowRadius: 5, shadowOffset: {width: 0, height: 5},
                                        borderWidth: (buttonPressed && fileError)? 3 : 1, 
                                        borderColor: (buttonPressed && fileError)? 'red' : 'transparent',
                                        borderStyle: (buttonPressed && fileError)? 'dotted' : 'solid'
                                        }, circleWidth, circleHeight]}
                                    >
                                        <TouchableOpacity onPress={() => (loading)? null : (
                                            navigation.navigate('camera')
                                        )}>
                                            <Image source={require('../Image/white-camera.png')} style={{width: 45, height: 45}}/>
                                        </TouchableOpacity>
                                    </View>
                                : 
                                    <View style={[{
                                        borderRadius: circleWidth.width, backgroundColor: '#69726F', alignItems: 'center', 
                                        justifyContent: 'center', shadowColor: '#000000', elevation: 7,
                                        shadowOpacity: 0.3, shadowRadius: 5, shadowOffset: {width: 0, height: 5}
                                        }, circleWidth, circleHeight]}
                                    >
                                        <TouchableOpacity onPress={() => (loading)? null : (
                                            // console.log("&^%$#$%^&%$#$%^ ", navigation)
                                            navigation.navigate('camera')
                                        )}>
                                            <Image source={{uri: `${this.state.data}`}} style={[{borderRadius: circleWidth.width}, circleWidth, circleHeight]}/>
                                        </TouchableOpacity>
                                    </View>
                                }
                            </View>
                            <View style={{alignItems: 'center'}}>
                                <View style={[styles.MainContainer, {
                                    borderWidth: (buttonPressed && Lat_LongError)? 2 : 1, 
                                    borderColor: (buttonPressed && Lat_LongError)? 'red' : 'transparent',
                                    borderStyle: (buttonPressed && Lat_LongError)? 'dotted' : 'solid'
                                }]}>
                                    <MapView
                                        style={[styles.mapStyle, getWidthnHeight(90, 20)]}
                                        region={region}
                                        mapType={"standard"}
                                        provider={PROVIDER_GOOGLE}
                                        showsUserLocation={true}
                                        zoomUserLocation={true}
                                        zoomEnabled={true}
                                        zoomControlEnabled={true}
                                        showsMyLocationButton={true}
                                        followsUserLocation={true}
                                        showsCompass={true}
                                        toolbarEnabled={true}
                                    >
                                        <Marker
                                            coordinate={region}
                                            title={name}
                                            description={"YOUR LOCATION FOR ATTENDANCE"}
                                        />
                                    </MapView>
                                </View>
                                {(!!this.state.latitude && !!this.state.longitude) &&
                                    <View style={[{flexDirection: 'row', justifyContent: 'space-between'}, getWidthnHeight(90)]}>
                                        <Text style={{fontSize: 10}}>{`LATTITUDE: ${parseFloat(this.state.latitude).toFixed(3)}`}</Text>
                                        <Text style={{fontSize: 10}}>{`LONGITUDE: ${parseFloat(this.state.longitude).toFixed(3)}`}</Text>
                                    </View>
                                }
                            </View>
                            <View style={[styles.commentbox, getWidthnHeight(90)]}>
                                <TextInput
                                    style={[styles.input, {
                                      borderWidth: (buttonPressed && commentError)? 2 : 1, 
                                      borderColor: (buttonPressed && commentError)? 'red' : 'transparent',
                                      borderStyle: (buttonPressed && commentError)? 'dotted' : 'solid'
                                    }]}
                                    placeholder="COMMENT BOX"
                                    autoCapitalize={'none'}
                                    returnKeyType={'done'}
                                    onChangeText={comment => {
                                      this.setState({ comment })
                                      this.setState({commentError: false})
                                      if(comment === ''){
                                        this.setState({commentError: true})
                                      }
                                    }}
                                    editable={(loading)? false : true}
                                    value={this.state.comment}
                                    autoCorrect={false}
                                    placeholderTextColor="black"
                                />
                            </View>
                            <View style={{alignItems:'center'}}>
                                <TouchableOpacity onPress={() => this.checkBlank()}>
                                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                        <LinearGradient 
                                            start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                            colors={gradient}
                                            style={[styles.button, getWidthnHeight(40, 8)]}
                                        >
                                            <Text style={{ color:'white',fontSize: 14, textAlign: 'center'}}>SUBMIT</Text>
                                        </LinearGradient>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View 
                            style={[{
                              backgroundColor: (loading)? 'rgba(0, 0, 0, 0.5)' : 'transparent', alignItems: 'center', justifyContent: 'center'
                            }, StyleSheet.absoluteFill]} 
                            pointerEvents={(loading)? 'auto' : 'none'}
                        >
                            {(loading) &&
                                <Spinner loading={loading} style={[styles.loadingStyle, getWidthnHeight(45, 10), getMarginTop(-5), getMarginLeft(3)]} color='rgb(19,111,232)'/>
                            }
                        </View>
                    </View>
                    <ModalAlert 
                        isVisible={this.state.iOSAlert}
                        onDismiss={() => {
                            Linking.openSettings().catch(() => {
                                Alert.alert('Unable to open settings');
                            });
                            this.props.navigation.goBack();
                        }}
                    />
                </KeyboardAvoidingView>
            </View>   
        )}
    }

    const styles = StyleSheet.create({
        button: {
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 50,
            shadowColor: '#000000',
            marginTop: 10,
            elevation: 7
        },
        buttonShadow: {
            marginTop: 10,
            marginLeft: 0,
            borderTopLeftRadius: 50,
            borderBottomRightRadius: 50
        },
        container: {
            height:height,
            flex: 0,
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop:0,
            marginBottom:0
        },
        avatarContainer: {
            borderColor: 'transparent',
            borderWidth: 5 / PixelRatio.get(),
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 7,
        },
        avatar: {
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            borderTopWidth: 1,
            borderBottomWidth:1,
            borderRightWidth:1,
            borderLeftWidth:1,
            width:width,
            height: height / 3,
        },
        MainContainer: {
            flex:0,
            flexDirection:'row',
            alignItems:'center',
            margin:5,
            borderRadius: 8,
            shadowOffset:{  width: 0,  height: 5,  },
            shadowColor: '#000000',
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 7,
            zIndex: 1
        },
        commentbox: {
            flex:0,
            flexDirection:'row',
            alignItems:'center',
            shadowOffset:{  width: 0,  height: 5,  },
            shadowColor: '#000000',
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 10,
            marginTop: 20,
            zIndex: 1
        },
        mapStyle: {
            flex:0,
            flexDirection:'row',
            alignItems:'center',
            margin:5,
            borderRadius: 8,
            borderTopWidth: 1,
            borderBottomWidth:1,
            borderRightWidth:1,
            borderLeftWidth:1,
            shadowOffset:{  width: 100,  height: 100,  },
            shadowColor: '#000000',
            shadowOpacity: 0,
            shadowRadius: 10,
            elevation: 7,
        },
        input: {
            width:'100%',
            borderRadius: 10,
            backgroundColor: '#F0F8FF',
            paddingLeft:20,
            paddingRight:0,
            paddingTop:20,
            paddingBottom:20,
            fontSize:15,
            borderStyle:'dashed',
            elevation: 5,
        },
        loader: {
            ...Platform.select({
                ios: {
                    zIndex: 1,
                }
            })
        },
        loadingStyle: {
            flexDirection:'row', 
            backgroundColor: '#EFEFEF',
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
            borderWidth: 0,
        },
    });

    const mapStateToProps = ({reduxState}) => {
        // console.log("@@#Welcome***MAP STATE TO PROPS: ", reduxState)
        return {
            file: reduxState.cameraFile,
        }
    }

export default connect(mapStateToProps, {cameraFile, setReloadHome})(App);