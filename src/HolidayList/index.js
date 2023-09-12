import React, { Component } from "react";
import { SafeAreaView, View, Text, Alert, FlatList, StyleSheet, Platform, StatusBar } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker, PickerIOS } from '@react-native-picker/picker';
import moment from 'moment';
import axios from 'axios';
import { IOS_StatusBar, Spinner, fontSizeH4, getWidthnHeight, getMarginTop, GradientBox, getMarginLeft, fontSizeH3 } from '../NewComponents/common';
import { extractBaseURL } from '../api/BaseURL';

class HolidayList extends Component {
    constructor(props){
        super(props)
        this.state = {
            fromDate: moment().year(), 
            data: [],
            loading: false,
            searchYear: `${moment().year()}`
        }
        this.props.navigation.setOptions({
            title: 'Holiday List'
        })
    }

    componentDidMount(){
        this.initialize();
    }

    async initialize(){
        await extractBaseURL().then((baseURL) => {
            //console.log("URL LOG: ", baseURL);
            this.setState({baseURL}, () => {
                this.callAPIFunction();
            })
        })
    }

    async callAPIFunction(){
        const { baseURL, searchYear } = this.state;
        this.showLoader();
        var parsedData = await AsyncStorage.getItem('userObj');
        var userObj = JSON.parse(parsedData);
        const secretToken = (userObj.success.secret_token);
        axios.post(`${baseURL}/holidays`, {
            user_id: userObj.success.user.id,
            year: searchYear
        },  
        {
            headers: {
                'Authorization': `Bearer ${secretToken}`
            }
        }).then((response) => {
            this.hideLoader();
            console.log("@@@ RESPONSE: ", response.data.success.holidays);
            const holidays = response.data.success.holidays;
            this.setState({
                data: holidays
            })
        }).catch((error) => {
            this.hideLoader();
            if(error.response.hasOwnProperty("_response")){
                //console.log("INSIDE")
                Alert.alert("Error", error.response?._response, [
                    {
                        text: 'OK',
                        onPress: () => {}
                    }
                ]);
                return;
            }
            //alert(error.response);
        })
    }

    showLoader(){
        this.setState({loading: true})
    }

    hideLoader(){
        this.setState({loading: false})
    }

    render(){
        const { loading, data, searchYear } = this.state;
        let year = moment().year();
        let options = [
            { id: '0', year: `${year - 2}` },
            { id: '1', year: `${year - 1}` },
            { id: '2', year: `${year}` },
            { id: '3', year: `${year + 1}` }
        ];
        console.log("OPTIONS: ", options);
        let gradient = ['#039FFD', '#EA304F']
        return (
            <SafeAreaView style={{flex: 1, alignItems: 'center', backgroundColor: 'white'}}>
                <IOS_StatusBar />
                <View style={{flex: 1, alignItems: 'center'}}>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <View 
                            style={[{
                                borderRadius: getWidthnHeight(1).width, overflow: 'hidden', 
                                borderWidth: 1, borderColor: '#C4C4C4',
                                }, getMarginTop(3)
                            ]}
                        >
                            <Picker 
                                style={[{backgroundColor: 'white', justifyContent: 'center'}, getWidthnHeight(70), Platform.OS === 'android' && {height: getWidthnHeight(undefined, 7).height}]}
                                selectedValue={searchYear}
                                onValueChange={(value, mainIndex) => {
                                    if(value){
                                        if(value === this.state.searchYear){
                                            return;
                                        }
                                        this.setState({ searchYear: value, data: [] }, () => this.callAPIFunction());
                                    }else{
                                        this.setState({ searchYear: '' });
                                    }
                                }}
                            >
                                <Picker.Item style={{color: '#C4C4C4'}} label={'Select Year'} value={null} />
                                {(options.map((item) => {
                                    return (
                                        <Picker.Item label={`${item.year}`} value={`${item.year}`} />
                                    );
                                }))}
                            </Picker>
                        </View>
                        <View 
                            style={[{
                                flex: 1, alignItems: 'center', justifyContent: (data.length === 0)? 'center' : 'flex-start', 
                                borderWidth: 0, borderColor: 'red', backgroundColor: '#EFEDED'
                            }, ,getWidthnHeight(100), getMarginTop(3)]}
                        > 
                            {(data.length > 0) && (
                                <View style={[getMarginTop(2)]}>
                                    <FlatList 
                                        data={data}
                                        keyExtractor={(item) => `${item.id}`}
                                        renderItem={({item, index}) => {
                                            return (
                                                <View style={[{alignItems: 'center'}, getWidthnHeight(100)]}>
                                                    <View 
                                                        style={[{
                                                            backgroundColor: 'white', paddingVertical: getMarginTop(1).marginTop, 
                                                            paddingHorizontal: getMarginTop(1).marginTop, overflow: 'hidden',
                                                            marginBottom: (index === (data.length - 1))? getMarginTop(2).marginTop : 0
                                                        }, styles.shadow, getWidthnHeight(90), getMarginTop(2)]}
                                                    >
                                                        <GradientBox 
                                                            containerStyle={[{paddingVertical: getMarginTop(2).marginTop}]}
                                                            title={item.name}
                                                            titleStyle={[{color: '#FFFFFF', fontSize: (fontSizeH4().fontSize + 5)}]}
                                                        />
                                                        <View 
                                                            style={[{
                                                                flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
                                                                paddingTop: getMarginTop(1).marginTop, paddingHorizontal: getMarginTop(1).marginTop
                                                            }]}
                                                        >
                                                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                                <Text style={[{color: '#019267', fontSize: (fontSizeH4().fontSize + 2), fontWeight: 'bold'}, styles.boldFont]}>Date:</Text>
                                                                <Text style={[{fontSize: (fontSizeH4().fontSize + 2), color: 'black'}, getMarginLeft(2)]}>{item.holiday_from}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            );
                                        }}
                                    />
                                </View>
                            )}
                            {((data.length === 0) && !loading) && <Text style={{fontSize: (fontSizeH3().fontSize - 3)}}>No results found</Text>}
                        </View>
                    </View>
                    <View 
                        style={[{
                        backgroundColor: (loading)? 'rgba(0, 0, 0, 0.5)' : 'transparent', alignItems: 'center', justifyContent: 'center'
                        }, StyleSheet.absoluteFill]} 
                        pointerEvents={(loading)? 'auto' : 'none'}
                    >
                        {(loading) &&
                            <Spinner loading={loading} style={[styles.loadingStyle, getWidthnHeight(45, 10), getMarginLeft(3)]} color='rgb(19,111,232)'/>
                        }
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 5},
        elevation: 4,
        shadowOpacity: 0.5,
        shadowRadius: 6
    },
    boldFont: {
        ...Platform.select(
            {
                android: {
                    fontFamily: ''
                }
            }
        )
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
    }
})

export default HolidayList;