import React, {Component} from 'react';
import {View, Text, TextInput, StyleSheet, Platform, FlatList, ScrollView, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-material-dropdown';
import axios from 'axios';
import moment from 'moment';
import {Header} from './Header';
import {
    getWidthnHeight, getMarginTop, getMarginLeft, fontSizeH4, ChoppedButton, getMarginVertical, getMarginBottom,
    Spinner, IOS_StatusBar, statusBarGradient
} from '../NewComponents/common';

class IssueNewBook extends Component{
    constructor(props){
        super(props)
        this.state = {
            inventoryID: '',
            inventoryName: '',
            inventoryData: [],
            baseURL: null,
            loading: false,
            booksIssued: []
        };
    }

    componentDidMount(){
        AsyncStorage.getItem('receivedBaseURL').then((url) => {
            this.setState({baseURL: url}, () => {
                //console.log("ISSUE NEW BOOK: ", this.state.baseURL)
                this.getBookList()
            })
        })
    }

    showLoader(){
        this.setState({loading: true})
    }

    hideLoader(){
        this.setState({loading: false})
    }

    async getBookList(){
        const {baseURL} = this.state;
        this.showLoader();
        var user_token= await AsyncStorage.getItem('user_token');
        var userObj = JSON.parse(user_token);
        const portID = userObj.success.customs.custom_port_id;
        console.log("BASEURL: ", `${baseURL}/customs/inventory-list?port_id=${portID}`, )
        axios.get(`${baseURL}/customs/inventory-list?port_id=${portID}`,
        {
            headers: {
                'Accept': 'application/json',
            }
        }).then((response) => {
            this.hideLoader();
            const responseJson = (response.data);
            console.log("@@@@@ #### SUCCESS", responseJson.success)
            const updateListName = responseJson.success.inventory.map((item) => {
                return {...item, name: `${item.name} - ${"\u20B9"} ${item.coupon_type}/-`}
            })
            this.setState({inventoryData: updateListName}, () => this.issuedBooksList())
        }).catch((error) => {
            this.hideLoader();
            //console.log("AXIOS ERROR: ", error)
            let status = null;
            if(error.response){
                //console.log("AXIOS RESPONSE: ", error.response)
                status = error.response.status;
                Alert.alert("Error!!!", `ErrorCode: ${status}801`)
            }else{
                alert(`${error}, API CODE: 801`)
            }
        });
    }

    issueBook = async() => {
        const {baseURL, inventoryID} = this.state;
        this.showLoader();
        const user_token= await AsyncStorage.getItem('user_token');
        const userObj = JSON.parse(user_token);
        const empID = userObj.success.customs.id;
        axios.post(`${baseURL}/customs/inventory-issue`,
        {
            inventory_id: inventoryID,
            custom_employee_id: empID
        },
        {
            headers: {
                'Accept': 'application/json',
            }
        }).then((response) => {
            this.hideLoader();
            //console.log("### ISSUED BOOK: ", (response.data))
            this.setState({inventoryName: '', inventoryID: ''}, () => this.getBookList())
            alert(`${response.data.success}`)
        }).catch((error) => {
            this.hideLoader();
            let status = null;
            //console.log("STATE API ERROR: ", error, error.response)
            if(error.response){
                status = error.response.status;
                Alert.alert("Error!!!", `ErrorCode: ${status}802`)
            }else{
                alert(`${error}, API CODE: 802`)
            }
        })
    }

    async issuedBooksList(){
        const {baseURL} = this.state;
        this.showLoader();
        var user_token= await AsyncStorage.getItem('user_token');
        var userObj = JSON.parse(user_token);
        const portID = userObj.success.customs.custom_port_id;
        const empID = userObj.success.customs.id;
        //console.log("BASEURL: ", `${baseURL}/customs/inventory-list?port_id=${portID}`, )
        axios.get(`${baseURL}/customs/inventory-list?port_id=${portID}&status=issued&custom_employee_id=${empID}`,
        {
            headers: {
                'Accept': 'application/json',
            }
        }).then((response) => {
            this.hideLoader();
            const responseJson = (response.data);
            //console.log("@@@@@ #### KB ISSUED BOOKS LIST", responseJson.success)
            this.setState({booksIssued: responseJson.success.inventory})
        }).catch((error) => {
            this.hideLoader();
            //console.log("AXIOS ERROR: ", error)
            let status = null;
            if(error.response){
                //console.log("AXIOS RESPONSE: ", error.response)
                status = error.response.status;
                Alert.alert("Error!!!", `ErrorCode: ${status}803`)
            }else{
                alert(`${error}, API CODE: 803`)
            }
        });
    }

    render(){
        const {inventoryName, inventoryData, loading, booksIssued} = this.state;
        const colorTitle = '#0B8EE8';
        const tableHeader = [
            {id: '1', name: 'Book Name'},
            {id: '2', name: 'Type'}
        ];
        //console.log("PROPS: ", this.props.hasOwnProperty('projectName'))
        return (
            <View style={{flex: 1}}>
                <IOS_StatusBar color={statusBarGradient} barStyle="light-content"/>
                <Header
                    menu='white'
                    title='Issue New Book'
                />
                <View style={{flex: 1}}>
                    <View style={styles.container}>
                        <View style={[{
                            flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', shadowColor: '#000000', shadowOpacity: 0.5,
                            elevation: 4, shadowRadius: 2
                            }, getWidthnHeight(93), getMarginVertical(2)
                        ]}>
                            <Dropdown
                                containerStyle={[{textOverflow:'hidden', borderColor: '#C4C4C4', borderWidth: 1, borderRadius: getWidthnHeight(1).width}, getWidthnHeight(84, 7), getMarginTop(3)]}
                                inputContainerStyle={[{
                                    borderBottomWidth: 0, borderColor: '#C4C4C4', paddingHorizontal: 5 
                                }, getWidthnHeight(84), getMarginTop(-1)]}
                                label={'Select Book'}
                                labelFontSize={fontSizeH4().fontSize - 3}
                                labelTextStyle={[getMarginLeft(1.5), getMarginTop(0)]}
                                data={inventoryData}
                                valueExtractor={({id})=> id}
                                labelExtractor={({name})=> name}
                                onChangeText={(id, index, data) => {
                                    this.setState({inventoryID: id, inventoryName: data[index]['name']})
                                }}
                                value={inventoryName}
                                baseColor = {(inventoryName)? colorTitle : '#C4C4C4'}
                                fontSize = {(inventoryName)? fontSizeH4().fontSize + 2 : fontSizeH4().fontSize}
                            />
                            <View style={[getMarginTop(2)]}>
                                <ChoppedButton 
                                    onPress={() => {
                                        const {inventoryID} = this.state;
                                        if(inventoryID){
                                            this.issueBook();
                                        }
                                    }}
                                    leftBoxSize={{width: getWidthnHeight(6).width, height: getWidthnHeight(undefined, 6).height}}
                                    middleBoxSize={{width: getWidthnHeight(20).width, height: getWidthnHeight(undefined, 6).height}}
                                    rightBoxSize={{width: getWidthnHeight(6).width, height: getWidthnHeight(undefined, 6).height}}
                                    title={'ISSUE'}
                                    titleStyle={[{color: '#FFFFFF', letterSpacing: 2}]}
                                    buttonColor={"#039FFD"}
                                    underLayColor={"#EA304F"}
                                />
                            </View>
                            <View style={[{height: 1, backgroundColor: '#C4C4C4'}, getWidthnHeight(84), getMarginTop(4)]}/>
                            <View style={[{alignSelf: 'flex-start'}, getMarginTop(2)]}>
                                <Text style={[{color: colorTitle}, fontSizeH4(), getMarginLeft(5)]}>BOOKS ISSUED</Text>
                            </View>
                            <View style={[getMarginTop(1)]}>
                                <View style={[{backgroundColor: colorTitle, flexDirection: 'row'}, getWidthnHeight(84, 5)]}>
                                    {tableHeader.map((item, index) => {
                                        return (
                                            <View style={[{alignItems: (index === 0)? 'flex-start' : 'center', justifyContent: 'center', borderColor: 'white', borderRightWidth: (index === 0)? 2 : 0}, getWidthnHeight((index === 0)? 64 : 20, 5)]}>
                                                <Text style={[{color: 'white', fontWeight: 'normal', fontSize: (fontSizeH4().fontSize + 2)}, styles.boldFont, getMarginLeft((index === 0)? 3 : 0)]}>{item.name}</Text>
                                            </View>
                                        );
                                    })
                                    }
                                </View>
                            </View>
                            <View style={[{flex: 1}, getMarginBottom(2)]}>
                                {(booksIssued.length > 0)?
                                    <FlatList 
                                        data={booksIssued}
                                        nestedScrollEnabled={true}
                                        showsVerticalScrollIndicator={false}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({item, index}) => {
                                            const splitDate = item.issued_at.split(' ');
                                            const issuedDate = moment(splitDate[0]).format("DD-MM-YYYY");
                                            return (
                                                <View style={[{flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: 'rgba(196, 196, 196, 0.3)'}, getWidthnHeight(84, 7)]}>
                                                    <View style={[{justifyContent: 'space-evenly', borderWidth: 0, borderColor: 'red'}, getWidthnHeight(64, 7)]}>
                                                        <Text numberOfLines={1} style={[{color: '#000000', fontSize: (fontSizeH4().fontSize + 2)}, getMarginLeft(3)]}>{item.name}</Text>
                                                        <View style={[getMarginLeft(3)]}>
                                                            <Text style={{fontSize: (fontSizeH4().fontSize - 3)}}>ISSUED ON: {issuedDate}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={[{alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(20, 7)]}>
                                                        <Text>{`${"\u20B9"} ${item.coupon_type}/-`}</Text>
                                                    </View>
                                                </View>
                                            );
                                        }}
                                    />
                                :
                                    <View style={[{alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderColor: 'rgba(196, 196, 196, 0.3)'}, getWidthnHeight(84, 7)]}>
                                        <Text style={{fontSize: (fontSizeH4().fontSize + 2)}}>No books were found</Text>
                                    </View>
                                }
                            </View>
                        </View>
                    </View>
                    <View 
                        style={[{backgroundColor: (loading)? 'rgba(0, 0, 0, 0.5)' : 'transparent', borderTopLeftRadius:0,
                        borderTopRightRadius: 0}, StyleSheet.absoluteFill]} 
                        pointerEvents={(loading)? 'auto' : 'none'}
                    >
                        {(loading) ?
                            <Spinner loading={loading} style={[styles.loadingStyle, getWidthnHeight(45, 10), getMarginLeft(3)]} color='rgb(19,111,232)'/>
                        : null}
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(196, 196, 196, 0.2)'
    },
    boldFont: {
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

export default IssueNewBook;