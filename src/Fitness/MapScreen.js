import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Platform, ToastAndroid, TouchableOpacity } from 'react-native';
import ReactNativeForegroundService from "@supersami/rn-foreground-service";
import BackgroundService from 'react-native-background-actions';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Polyline, PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import PolyLine from '@mapbox/polyline';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import MapTheme from './MapTheme.json';
import { IOS_StatusBar, fontSizeH4, getMarginLeft, getWidthnHeight } from '../NewComponents/common';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';

const START = 'START';
const PAUSE = 'PAUSE';
const STOP = 'STOP';

export const MapScreen = ({navigation}) => {
    const [trackingStatus, setTrackingStatus] = useState(null);
    const [coordinates, setCoordinates] = useState([]);
    const [destinationPoints, setDestinationPoints] = useState([]);
    const [currentPosition, setCurrentPosition] = useState({});
    const [travelDistance, setTravelDistance] = useState(0);

    // const calculateDistance = async(previous, next) => {
    //     const R = 6371; //Radius of earth in KM
    //     console.log("***COORDINATES*** ", coordinates)
    //     let dLat = deg2rad(previous.latitude - next.latitude)
    //     let dLng = deg2rad(previous.longitude - next.longitude)
    //     let a = Math.sin(dLat/2) * Math.sin(dLat/2) +  
    //             Math.cos(deg2rad(next.latitude)) * Math.cos(deg2rad(previous.latitude)) *
    //             Math.sin(dLng/2) * Math.sin(dLng/2);
    //     let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    //     let num = R * c * 1000; //Distance in Meters
    //     console.log('^^^^ Distance: ', Number(num.toFixed(1)))
    //     return Number(num.toFixed(1))
        
    // }

    useLayoutEffect(() => {
        console.log('BackgroundService: ', BackgroundService.isRunning())
        if(BackgroundService.isRunning()) {
            setTrackingStatus(START);
        }
    }, []);

    useEffect(() => {
        async function getLocationStatus(){
            const bgStatus = await hasLocationPermission();
            if(bgStatus){
                console.log("$#$#$*(& BG STATUS: ", bgStatus);               
            }
        }
        
        getLocationStatus();
    }, []);

    const sleep = (time) => new Promise((resolve) => setTimeout(() => {
        resolve();
    }, time));

    useEffect(() => {
        if(Object.keys(currentPosition).length > 0){
            calculateDistance(currentPosition);
        }
    }, [currentPosition]);

    const calculateDistance = async(position) => {
        const {latitude, longitude} = position.coords;
        // console.log(`@@@ POSITION: `, JSON.stringify(position, null, 4));
        if(coordinates.length > 0){
            const length = coordinates.length;
            const lastCoordinates = coordinates[length - 1]
            const R = 6371; //Radius of earth in KM
            // console.log("***COORDINATES*** ", coordinates)
            let dLat = deg2rad(lastCoordinates.latitude - latitude)
            let dLng = deg2rad(lastCoordinates.longitude - longitude)
            let a = Math.sin(dLat/2) * Math.sin(dLat/2) +  
                    Math.cos(deg2rad(latitude)) * Math.cos(deg2rad(lastCoordinates.latitude)) *
                    Math.sin(dLng/2) * Math.sin(dLng/2);
            let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            let num = R * c * 1000; //Distance in Meters
            let distance = Number(num.toFixed(1));
            const sumDistance = travelDistance + distance;
            console.log("***DISTANCE*** ", sumDistance);
            setTravelDistance(Number(sumDistance.toFixed(1)));
            setCoordinates([...coordinates, {
                latitude: latitude,
                longitude: longitude,
                timeStamp: position.timestamp
            }]);
        }else{
            const data = [];
            data.push({
                latitude: latitude,
                longitude: longitude,
                timeStamp: position.timestamp
            })
            console.log(`@@@ COORDINATES ${data.length}: `, JSON.stringify(data, null, 4));
            setCoordinates(data)
        }
    }

    const deg2rad = (deg) => {
        return deg * (Math.PI/180)
    }

    const veryIntensiveTask = async (taskDataArguments) => {
        // Example of an infinite loop task
        const { delay } = taskDataArguments;
        await new Promise( async (resolve) => {
            for (let i = 0; BackgroundService.isRunning(); i++) {
                console.log('@&*&*& LOOP: ', i);
                Geolocation.getCurrentPosition((position) => {
                    const {accuracy} = position.coords;
                    if(accuracy < 20){
                        setCurrentPosition(position);
                        // console.log("#@#@#@ LOCATION: ", position.coords); 
                    }
                }, (error) => {
                    console.log("error", error);
                }, 
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 20000 }
                ) 
                await sleep(delay);
            }
        });
    };
    
    const options = {
        taskName: 'Track Workout',
        taskTitle: 'Tracking Location',
        taskDesc: 'Your location is being tracked',
        taskIcon: {
            name: 'ic_launcher',
            type: 'mipmap',
        },
        color: '#ff00ff',
        linkingURI: 'xenia://MapScreen', // See Deep Linking for more info
        parameters: {
            delay: 10000,
        }
    };

    async function startBGTracking(){
        console.log("Starting background tracking");
        await BackgroundService.start(veryIntensiveTask, options);
    }
    
    async function stopBGTracking(){
        console.log('Stop background tracking');
        await BackgroundService.stop();
    }

    useEffect(() => {
        if(trackingStatus === START && ReactNativeForegroundService.is_running() === false){
            console.log('@@#@#!!$$ START SERVICE');
            startBGTracking();
        }else if(trackingStatus === PAUSE){
            // Pause
        }else if(trackingStatus === STOP){
            stopBGTracking();
            setTrackingStatus(null);
        }
    }, [trackingStatus]);

    const hasLocationPermission = async () => {
		// if (Platform.OS === 'ios') {
		// 	const hasPermission = await hasPermissionIOS();
		// 	return hasPermission;
		// }

		if (Platform.OS === 'android' && Platform.Version < 23) {
			return true;
		}

		const hasPermission = await PermissionsAndroid.check(
			PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
		);
        
        console.log("#@#@#&^^ HAS FINE PERMISSION: ", hasPermission)

        if (!hasPermission) {
            const status = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            )
            if (status !== PermissionsAndroid.RESULTS.GRANTED) {
                return false;
            }
        }
        return requestBGPermission();
	};

    const requestBGPermission = async () => {
        const hasBGPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
        );
        if(hasBGPermission) {
            return true;
        }

        const bgStatus = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
        );

        console.log("#@#@#&^^ BG STATUS: ", bgStatus)

        if (bgStatus === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
        }

        if (bgStatus === PermissionsAndroid.RESULTS.DENIED) {
            ToastAndroid.show(
                'BG Location permission denied by user.',
                ToastAndroid.LONG
            );
        } else if (bgStatus === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            ToastAndroid.show(
                'BG Location permission revoked by user.',
                ToastAndroid.LONG
            );
        }
        return false;
    }

    const region = {
        latitude: 30.709597189331838,
		longitude: 76.68947006872848,
		latitudeDelta: 0.015,
		longitudeDelta: 0.0121,
    }

    let polyline = null;
    let marker = null;

    if(coordinates.length > 0){
        // console.log("#$##$ DESTINATION: ", coordinates);
        polyline = <Polyline strokeWidth={getWidthnHeight(0.5).width} strokeColor={'#f66d43'} coordinates={coordinates} />
        // marker = <Marker coordinate={coordinates[coordinates.length - 1]}/>
        marker = coordinates.map((position) => {
            return <Marker coordinate={position} title={moment(position.timeStamp).format('hh:mm a').toString()}/>
        }) 
    }

    return (
        <View style={{borderColor: 'red', borderWidth: 0, flex: 1}}>
            <IOS_StatusBar barStyle="dark-content"/>
            <View style={[getWidthnHeight(100, 70)]}>
                <View style={styles.mapcontainer}>
                    <MapView
                        //ref={mapRef}
                        provider={PROVIDER_GOOGLE}
                        showsUserLocation={true}
                        zoomUserLocation={true}
                        zoomEnabled={true}
                        loadingEnabled
                        loadingBackgroundColor='#0000008A'
                        showsMyLocationButton={true}
                        followsUserLocation={true}
                        showsCompass={true}
                        toolbarEnabled={true}
                        style={styles.mapViewStyle}
                        initialRegion={region}
                        customMapStyle={MapTheme}
                    >
                        {polyline}
                        {marker}
                    </MapView>
                </View>
            </View>
            <View style={{backgroundColor: '#3c4259', alignItems: 'center'}}>
                <Text style={{color: '#FFFFFF', fontSize: fontSizeH4().fontSize + 3}}>{`Distance: ${travelDistance}`} (meters)</Text>
            </View>
            <View style={{
                flex: 1, backgroundColor: '#3c4259', alignItems: (!trackingStatus)? 'center' : 'flex-start', 
                justifyContent: 'center'
            }}>
                {(!trackingStatus) && (
                    <View style={{alignItems: 'center'}}>
                        <View style={[getWidthnHeight(33)]} />
                        <View style={[{alignItems: 'center'}, getWidthnHeight(33)]} >
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => setTrackingStatus(START)}
                                style={styles.buttonBG}
                            >
                                    <FontAwesome5 name='play' color={'#00C897'} size={getWidthnHeight(7).width} />
                            </TouchableOpacity>
                        </View>
                        <View style={[getWidthnHeight(33)]} />
                    </View>
                )}
                
                {(trackingStatus === START || trackingStatus === PAUSE) && (
                    <View style={[{
                        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                    }]}>
                        <View style={[{alignItems: 'flex-start', paddingLeft: getWidthnHeight(3).width}, getWidthnHeight(33)]} >
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => setTrackingStatus(STOP)}
                                style={[styles.buttonBG, { backgroundColor: '#dc353542'}]}
                            >
                                <FontAwesome5 name='stop' color={'#DC3535'} size={getWidthnHeight(7).width} />
                            </TouchableOpacity>
                        </View>
                        <View style={[{alignItems: 'center'}, getWidthnHeight(33)]} >
                            {(trackingStatus === PAUSE)? (
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => setTrackingStatus(START)}
                                    style={styles.buttonBG}
                                >
                                        <FontAwesome5 name='play' color={'#00C897'} size={getWidthnHeight(7).width} />
                                </TouchableOpacity> 

                            )
                            :
                            (
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => setTrackingStatus(PAUSE)}
                                    style={styles.buttonBG}
                                >
                                    <FontAwesome5 name='pause' color={'#00C897'} size={getWidthnHeight(7).width} />
                                </TouchableOpacity>

                            )}
                        </View>
                        <View style={[getWidthnHeight(33)]} />
                    </View>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mapViewStyle: {
      flex: 1,
      ...StyleSheet.absoluteFillObject,
    },
    mapcontainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      borderColor: 'red',
      borderWidth: 0
    },
    buttonBG: {
        width: getWidthnHeight(14).width, 
        height: getWidthnHeight(14).width,
        borderRadius: getWidthnHeight(7).width, 
        backgroundColor: '#00c89645',
        alignItems: 'center', 
        justifyContent: 'center'
    }
})