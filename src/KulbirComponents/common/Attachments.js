import React, { Component } from 'react';
import {View, Text, TouchableOpacity, TextInput, StyleSheet, Platform, FlatList, ScrollView, Keyboard, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Down from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import axios from 'axios';
import {
    getWidthnHeight, fontSizeH4, getMarginLeft, fontSizeH3, getMarginTop, getMarginBottom, getMarginHorizontal, getMarginRight, getMarginVertical,
} from './width';
import { Spinner } from './Spinner';

class Attachments extends Component{
    constructor(props){
        super(props)
        this.state = {
            loading: false
        };
    }

    showLoader(){
        this.setState({loading: true})
    }

    hideLoader(){
        this.setState({loading: false})
    }

    deleteDocuments(fileName, subIndex){
        const {
            baseURL = null, secretToken = null, cloneDocumentsList = null, documentsList = [], deleteIndex = null,
            updateDocuments = () => {}, data = [], updateAttachment = () => {}, staticValue = null 
        } = this.props;
        const apiData = JSON.parse(this.props.apiData);
        let cloneData = JSON.parse(cloneDocumentsList);
        this.showLoader();
        let sendData = null;
        if(deleteIndex){
            sendData = {
                eid: apiData.draftId,
                name: fileName,
                id: Number(cloneData[deleteIndex]['id']),
            }
        }else{
            sendData = {
                eid: apiData.draftId,
                name: fileName,
                type: staticValue,
            }
        }
        console.log(
            "@@@*** BASEURL: ", `${baseURL}/onboarding/delete-document`, "\n\n", sendData
        )
        axios.post(`${baseURL}/onboarding/delete-document`,
        sendData,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${secretToken}`
            }
        }).then((response) => {
            this.hideLoader();
            const parsedData = response.data;
            console.log("&^&^&^ DELETE SUCCESS ###$$$^^^ ", parsedData);
            if(parsedData.status === "1"){
                data.splice(subIndex, 1);
                if(data.length === 0 && deleteIndex){
                    cloneData.splice(deleteIndex, 1, null);
                    updateDocuments(JSON.stringify(cloneData))
                }
                updateAttachment(data);
                alert(parsedData.message);
            }
        }).catch((error) => {
            this.hideLoader();
            console.log("%%% ERROR: ", error, error.response)
            if(error.response){
                const status = error.response.status;
                console.log("%%% ERROR2: ", error.response)
                Alert.alert("ERROR", `Error Code: ${status}xxx`);
            }else{
                alert(`${error}, API CODE: xxx`);
            }
        })
    }

    render(){
        const {loading} = this.state;
        const {
            isVisible = false, toggle = () => {}, data = [], deleteIndex = null, headerColor = "#039FFD", 
            baseURL = null, secretToken = null, downloadColor = "#F98404", deleteColor = "#E02401", staticValue = null,
            downloadAttachment = () => {}, documentsList = []
        } = this.props;
        const apiData = JSON.parse(this.props.apiData);
        const updatedData = data.map((item, index) => {
            return {name: item, id: index + 1}
        })
        //console.log("ATTACHMENTS: ", updatedData);
        return (
            <View>
                <Modal
                    isVisible={isVisible}
                    style={{flex: 1, justifyContent: 'flex-start'}}
                >
                    <View style={{flex: 1}}>
                        <View style={{backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'space-evenly', flex: 1}}>
                            <View style={[{
                                borderColor: '#FFFFFF', borderWidth: 0, backgroundColor: 'white', borderTopLeftRadius: getWidthnHeight(5).width, 
                                borderTopRightRadius: getWidthnHeight(5).width, overflow: 'hidden'}, getWidthnHeight(90, 60)
                            ]}>
                                <View style={[{backgroundColor: headerColor, justifyContent: 'center', alignItems: 'flex-start'}, getWidthnHeight(90, 8)]}>
                                    <Text style={[{fontSize: fontSizeH4().fontSize + 5, color: 'white', fontWeight: "bold"}, styles.boldFont, getMarginLeft(5)]}>Downloads</Text>
                                </View>
                                <View style={{alignItems: 'center', flex: 1}}>
                                    <View style={[{alignItems: 'center', flex: 1, borderColor: 'red', borderWidth: 0}, getMarginVertical(2)]}>
                                        <FlatList 
                                            data={updatedData}
                                            keyExtractor={(item) => `${item.id}`}
                                            renderItem={({item, index}) => {
                                                return (
                                                    <View style={[{flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start'}, getWidthnHeight(87), getMarginTop(1)]}>
                                                        <Text style={[{color: downloadColor, fontWeight: 'bold'}, styles.boldFont, fontSizeH4()]}>{index + 1}. </Text>
                                                        <Text style={[fontSizeH4(), getWidthnHeight(60)]}>{item.name}</Text>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                if(staticValue){
                                                                    downloadAttachment(item.name, null, staticValue);
                                                                    toggle();
                                                                }else{
                                                                    const id = documentsList[deleteIndex]['id']
                                                                    downloadAttachment(item.name, id, null);
                                                                    toggle();
                                                                }
                                                            }}
                                                        >
                                                            <View style={[{
                                                                width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, 
                                                                backgroundColor: 'rgba(249, 132, 4, 0.2)', alignItems: 'center', justifyContent: 'center',
                                                                borderRadius: getWidthnHeight(1).width,
                                                            }, getMarginLeft(3)]}>
                                                                <FontAwesome name="download" size={getWidthnHeight(4).width} color={downloadColor}/>
                                                            </View>
                                                        </TouchableOpacity>
                                                        {(updatedData.length > 1) && <TouchableOpacity
                                                            onPress={() => {
                                                                this.deleteDocuments(item.name, index)
                                                            }}
                                                        >
                                                            <View style={[{
                                                                width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, 
                                                                backgroundColor: 'rgba(224, 36, 1, 0.2)', alignItems: 'center', justifyContent: 'center',
                                                                borderRadius: getWidthnHeight(1).width,
                                                            }, getMarginLeft(3)]}>
                                                                <IonIcons name="trash" size={getWidthnHeight(4).width} color={deleteColor}/>
                                                            </View>
                                                        </TouchableOpacity>}
                                                    </View>
                                                );
                                            }}
                                        />
                                    </View>
                                    <View 
                                        style={[{
                                            backgroundColor: (loading)? 'rgba(0, 0, 0, 0.4)' : 'transparent', borderTopLeftRadius:0,
                                            borderTopRightRadius: 0, borderColor: 'yellow', borderWidth: 0}, StyleSheet.absoluteFill
                                        ]} 
                                        pointerEvents={(loading)? 'auto' : 'none'}
                                    >
                                        {(loading) && 
                                            <Spinner loading={loading} style={[styles.loadingStyle, getWidthnHeight(40, 8), getMarginTop(5), getMarginLeft(5)]} color='rgb(19,111,232)'/>
                                        }
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity activeOpacity={0.7} 
                                onPress={() => {
                                    const {loading} = this.state;
                                    if(!loading){
                                        toggle();
                                    }
                                }}
                            >
                                <View style={[{
                                    alignItems: 'center', justifyContent: 'center', width: getWidthnHeight(15).width, height: getWidthnHeight(15).width,
                                    backgroundColor: '#FFFFFF', borderRadius: getWidthnHeight(7.5).width
                                }]}>
                                    <Icon name="close" size={Math.floor(getWidthnHeight(10).width)} color="black"/>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    boldFont:  {
        ...Platform.select({
            android: {
                fontFamily: ''
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
        borderWidth: 0
    },
})

export {Attachments};