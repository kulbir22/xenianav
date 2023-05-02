import React, { Component } from 'react';
import {View, Text, TouchableOpacity, TextInput, StyleSheet, Platform, FlatList, ScrollView, Keyboard, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Down from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesone from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import axios from 'axios';
import {
    getWidthnHeight, fontSizeH4, getMarginLeft, fontSizeH3, getMarginTop, getMarginBottom, getMarginHorizontal, getMarginRight, getMarginVertical,
} from './width';
import { Spinner } from './Spinner';

class CheckList extends Component{
    constructor(props){
        super(props)
        this.state = {
            empty: true,
            searchText: '',
            searchResult: []
        }
    }

    searchName(dataArray, searchName, callBack){
        let filterNames = dataArray;
        let splitArray = [];
        splitArray = searchName.toLowerCase().split('');
        const searchLength = splitArray.length;
        let data = [];
        for(let i = 0; i <= filterNames.length - 1; i++){
            let name = null;
            let splitName = [];
            name = filterNames[i]['name'];
            splitName = name.toLowerCase().split(''); 
            for(let j = 0; j < searchLength; j++){
                if(splitArray[j] !== splitName[j]){
                    //console.log("$$$$$ BREAK $$$$$")
                    break;
                }
                if(j === searchLength - 1 && splitArray[searchLength - 1] === splitName[searchLength - 1]){
                    data.push(filterNames[i])
                }
            }
            if((i === filterNames.length - 1) && (data.length > 0)){
                callBack(data);
            }
        }
    }

    dataList(){
        const {searchText, empty} = this.state;
        let searchData = this.props.data;
        let data = [];
        if(searchText){
            this.searchName(searchData, searchText, (dataArray) => {
                if(dataArray !== [] && dataArray !== null && dataArray.length !== null && dataArray.length > 0){
                    data = dataArray;
                    console.log("%%%%% TEST ARRAY: ", data.length)
                    //this.setState({filterData: dataArray}, () => console.log("%%%%% TEST ARRAY: ", this.state.filterData.length))
                }
            })
        }
        if(data.length === 0 && empty === false){
            return (
            <View style={[{alignItems: 'center', borderColor: 'red', borderWidth: 0}, getMarginTop(15)]}>
                <Text style={{color: 'grey', fontSize: fontSizeH4().fontSize + 7}}>Not found</Text>
            </View>
            );
        }else if(data !== [] && data !== null && data.length !== null && data.length > 0 && empty === false){
            return (
                <View>
                    <FlatList 
                        data={data}
                        keyboardShouldPersistTaps="handled"
                        keyExtractor={(item) => item.id}
                        nestedScrollEnabled
                        showsVerticalScrollIndicator={false}
                        renderItem={({item, index}) => {
                            if(!item.selected){
                                return (
                                    <TouchableOpacity 
                                        style={[{borderColor: 'red', borderWidth: 1}, getMarginBottom(1)]} activeOpacity={0.5} 
                                        onPress={() => {
                                            this.props.selectFunction(item.id, index);
                                            Keyboard.dismiss();
                                        }}
                                    >
                                        <View style={[{flexDirection: 'row', alignItems: 'center'}, getWidthnHeight(80)]}>
                                            <MaterialCommunityIcons 
                                                name='checkbox-blank' 
                                                color={'rgba(146, 146, 146, 0.5)'} 
                                                size={getWidthnHeight(7).width}
                                            />
                                            {/* <ScrollView keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false} horizontal style={[getWidthnHeight(70), getMarginHorizontal(2)]}> */}
                                                <Text style={[{fontSize: (fontSizeH4().fontSize + 3)}, getMarginHorizontal(2)]}>{item.name}</Text>
                                            {/* </ScrollView> */}
                                        </View>
                                    </TouchableOpacity>
                                );
                            }
                        }}
                    />
                </View>
            );
        }
        else if(empty){
            return (
                <View>
                    <FlatList 
                        data={this.props.data}
                        keyboardShouldPersistTaps="handled"
                        keyExtractor={(item) => item.id}
                        nestedScrollEnabled
                        showsVerticalScrollIndicator={false}
                        renderItem={({item, index}) => {
                            if(!item.selected){
                                return (
                                    <TouchableOpacity 
                                        style={[{borderColor: 'red', borderWidth: 0}, getMarginBottom(1)]} activeOpacity={0.5} 
                                        onPress={() => {
                                            this.props.selectFunction(item.id, index);
                                            Keyboard.dismiss();
                                        }}
                                    >
                                        <View style={[{flexDirection: 'row', alignItems: 'center'}, getWidthnHeight(80)]}>
                                            <MaterialCommunityIcons 
                                                name='checkbox-blank' 
                                                color={'rgba(146, 146, 146, 0.5)'} 
                                                size={getWidthnHeight(7).width}
                                            />
                                            {/* <ScrollView keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false} horizontal style={[getWidthnHeight(70), getMarginHorizontal(2)]}> */}
                                                <Text style={[{fontSize: (fontSizeH4().fontSize + 3)}, getMarginHorizontal(2)]}>{item.name}</Text>
                                            {/* </ScrollView> */}
                                        </View>
                                    </TouchableOpacity>
                                );
                            }
                        }}
                    />
                </View>
            )
        }
    }

    render(){
        const {empty, searchText} = this.state;
        const {
            isVisible = false, toggle = () => {}, containerStyle = null, data = [], title = "Qualification",
            titleStyle = null, selectFunction = () => {}, deselectFunction = () => {}, checkBoxColor = "#039FFD",
            underLayColor = "#EA304F", selectedList = []
        } = this.props;
        let count = 0;
        data.filter((item) => {
            if(item.selected){
                count += 1;
            }
        })
        let height = null;
        if(count === 0){
            height = 0
        }else if(count === 1){
            height = getWidthnHeight(undefined, 4).height
        }else if(count === 2){
            height = getWidthnHeight(undefined, 9).height
        }else if(count === 3){
            height = getWidthnHeight(undefined, 14).height
        }else if(count >= 4){
            height = getWidthnHeight(undefined, 18).height
        }
        const selectedStyle = {
            height: height
        }
        //console.log("TOTAL HEIGHT: ", selectedStyle)
        return (
            <View style={{flex: 1}}>
                <View style={[{flex: 1}, containerStyle]}>
                    <Text style={[{color: '#C4C4C4'}, fontSizeH4(), getMarginLeft(2)]}>{title}</Text>
                    {(count === 0)?
                        <Down name="arrow-drop-up" size={Math.floor(getWidthnHeight(7).width)} color="#C4C4C4" style={{transform: [{rotate: '180deg'}]}}/>
                    :
                        <View style={[{
                            width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, borderRadius: getWidthnHeight(3.5).width,
                            backgroundColor: checkBoxColor, alignItems: 'center', justifyContent: 'center'
                        }, getMarginRight(2)]}>
                            <Text style={[{color: '#FFFFFF'}, fontSizeH4()]}>{count}</Text>
                        </View>
                    }
                </View>
                <Modal
                    isVisible={isVisible}
                    onBackdropPress={toggle}
                    style={[{position: 'absolute', flex: 1}, getMarginTop(7.5)]}
                >
                    <View style={[{backgroundColor: 'white', borderRadius: getWidthnHeight(2).width, alignItems: 'center', justifyContent: 'flex-start'}, getWidthnHeight(90, 85)]}>
                        <View style={[{
                            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(196, 196, 196, 0.5)'
                            }, getWidthnHeight(85, 5), getMarginTop(1)]}>
                            <Text style={[{color: 'grey', fontSize: fontSizeH4().fontSize + 2}, titleStyle]}>{title.toUpperCase()}</Text>
                            <TouchableOpacity 
                                style={[{borderColor: 'red', borderWidth: 0, alignItems: 'flex-end', justifyContent: 'center'}, getWidthnHeight(20)]} 
                                onPress={() => {
                                    toggle();
                                    Keyboard.dismiss();
                                }}
                            >
                                <Icon name="close" size={Math.floor(getWidthnHeight(7).width)} color="grey"/>
                            </TouchableOpacity>
                        </View>
                        <View style={[{
                            borderColor: '#C4C4C4', borderWidth: 1, paddingHorizontal: getWidthnHeight(2).width,
                            borderRadius: getWidthnHeight(1).width, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                        }, getWidthnHeight(80, 6.5), getMarginTop(4)]}>
                            <TextInput 
                                placeholder="Search here"
                                style={{flex: 1, fontSize: fontSizeH4().fontSize + 3}}
                                value={this.state.searchText}
                                onChangeText={(searchText) => {
                                    this.setState({searchText}, () => {
                                        const {searchText} = this.state;
                                        if(searchText === ''){
                                            this.setState({empty: true})
                                        }else{
                                            this.setState({empty: false})
                                        }
                                    })
                                }}  
                            />
                            <TouchableOpacity activeOpacity={0.5} onPress={() => Keyboard.dismiss()}>
                                <Icon name="search" size={Math.floor(getWidthnHeight(7).width)} color="grey"/>
                            </TouchableOpacity>
                        </View>
                        <View style={[{alignItems: 'center', borderColor: 'blue', borderWidth: 0, flex: 1}, getMarginTop(2)]}>
                            <View style={[{borderColor: 'cyan', borderWidth: 0, justifyContent: 'center'}, getWidthnHeight(80), selectedStyle]}>
                                <FlatList 
                                    data={selectedList}
                                    keyboardShouldPersistTaps="handled"
                                    keyExtractor={(item) => item.id}
                                    nestedScrollEnabled
                                    renderItem={({item, index}) => {
                                        return (
                                            <TouchableOpacity 
                                                style={[{borderColor: 'red', borderWidth: 0}, getMarginBottom(1)]} activeOpacity={0.5} 
                                                onPress={() => {
                                                    deselectFunction(item.id, index);
                                                    Keyboard.dismiss();
                                                }}
                                            >
                                                <View style={[{flexDirection: 'row', alignItems: 'center', borderColor: 'red', borderWidth: 0}, getWidthnHeight(80)]}>
                                                    <MaterialCommunityIcons name="checkbox-marked" size={Math.floor(getWidthnHeight(7).width)} color={checkBoxColor}/>
                                                    {/* <ScrollView keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false} horizontal style={[getWidthnHeight(70), getMarginHorizontal(2)]}> */}
                                                        <Text style={[{fontSize: (fontSizeH4().fontSize + 3)}, getMarginHorizontal(2)]}>{item.name}</Text>
                                                    {/* </ScrollView> */}
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    }}
                                />
                            </View>

                            {(count > 0) && <View style={[{height: 1, backgroundColor: '#C4C4C4'}, getWidthnHeight(60), getMarginVertical(2)]}/>}

                            <View style={[{borderWidth: 0, borderColor: 'red', flex: 1}, getMarginBottom(2)]}>
                                {this.dataList()}
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

class LanguageSelection extends Component{
    constructor(props){
        super(props)
        this.state = {
            empty: true,
            searchText: '',
            searchResult: []
        }
    }

    searchName(dataArray, searchName, callBack){
        let filterNames = dataArray;
        let splitArray = [];
        splitArray = searchName.toLowerCase().split('');
        const searchLength = splitArray.length;
        let data = [];
        for(let i = 0; i <= filterNames.length - 1; i++){
            let name = null;
            let splitName = [];
            name = filterNames[i]['name'];
            splitName = name.toLowerCase().split(''); 
            for(let j = 0; j < searchLength; j++){
                if(splitArray[j] !== splitName[j]){
                    //console.log("$$$$$ BREAK $$$$$")
                    break;
                }
                if(j === searchLength - 1 && splitArray[searchLength - 1] === splitName[searchLength - 1]){
                    data.push(filterNames[i])
                }
            }
            if((i === filterNames.length - 1) && (data.length > 0)){
                callBack(data);
            }
        }
    }

    dataList(){
        const {searchText, empty} = this.state;
        const {
            selectFunction, deselectFunction, checkBoxColor = "#039FFD", underLayColor = "#EA304F",
            addRemoveRead = () => {}, addRemoveWrite = () => {}, addRemoveSpeak = () => {}, 
            overLayColor = "rgb(19,111,232)"
        } = this.props;
        let searchData = this.props.data;
        let data = [];
        if(searchText){
            this.searchName(searchData, searchText, (dataArray) => {
                if(dataArray !== [] && dataArray !== null && dataArray.length !== null && dataArray.length > 0){
                    data = dataArray;
                    console.log("%%%%% TEST ARRAY: ", data.length)
                    //this.setState({filterData: dataArray}, () => console.log("%%%%% TEST ARRAY: ", this.state.filterData.length))
                }
            })
        }
        if(data.length === 0 && empty === false){
            return (
            <View style={[{alignItems: 'center', borderColor: 'red', borderWidth: 0}, getMarginTop(15)]}>
                <Text style={{color: 'grey', fontSize: fontSizeH4().fontSize + 7}}>Not found</Text>
            </View>
            );
        }else if(data !== [] && data !== null && data.length !== null && data.length > 0 && empty === false){
            return (
                <View>
                    <FlatList 
                        data={data}
                        keyboardShouldPersistTaps="handled"
                        keyExtractor={(item) => item.id}
                        nestedScrollEnabled
                        showsVerticalScrollIndicator={false}
                        renderItem={({item, index}) => {
                            return (
                                <View>
                                    <TouchableOpacity 
                                        style={[{borderWidth: 0, borderColor: 'red'}, getMarginBottom(1.5)]}
                                        activeOpacity={0.5} 
                                        onPress={() => {
                                            if(item.selected){
                                                deselectFunction(item.id, index)
                                            }else {
                                                selectFunction(item.id, index)
                                            }
                                            Keyboard.dismiss();
                                        }}
                                    >
                                        <View style={[{flexDirection: 'row', alignItems: 'center'}, getWidthnHeight(80)]}>
                                            {(item.selected)?
                                                <MaterialCommunityIcons name="checkbox-marked" size={Math.floor(getWidthnHeight(7).width)} color={checkBoxColor}/>
                                            :
                                                <MaterialCommunityIcons 
                                                    name='checkbox-blank' 
                                                    color={'rgba(146, 146, 146, 0.5)'} 
                                                    size={getWidthnHeight(7).width}
                                                />
                                            }
                                            {/* <ScrollView keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false} horizontal style={[getWidthnHeight(70), getMarginHorizontal(2)]}> */}
                                                <Text style={[{fontSize: (fontSizeH4().fontSize + 3)}]}>{item.name}</Text>
                                            {/* </ScrollView> */}
                                            </View>
                                    </TouchableOpacity>
                                    {(item.selected) && (
                                        <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, getMarginBottom(2)]}>
                                            <TouchableOpacity activeOpacity={0.7} onPress={() => {addRemoveRead(item.id)}}>
                                                <View style={[{
                                                    alignItems: 'center', justifyContent: 'center', width: getWidthnHeight(15).width, height: getWidthnHeight(15).width,
                                                    backgroundColor: (item.read)? checkBoxColor : underLayColor, borderRadius: getWidthnHeight(7.5).width
                                                }]}>
                                                    <Text style={{fontSize: (fontSizeH3().fontSize + 3), color: (item.read)? 'white' : 'black'}}>R</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[getMarginHorizontal(4)]} activeOpacity={0.7} onPress={() => {addRemoveWrite(item.id)}}>
                                                <View style={[{
                                                    alignItems: 'center', justifyContent: 'center', width: getWidthnHeight(15).width, height: getWidthnHeight(15).width,
                                                    backgroundColor: (item.write)? checkBoxColor : underLayColor, borderRadius: getWidthnHeight(7.5).width
                                                }]}>
                                                    <Text style={{fontSize: (fontSizeH3().fontSize + 3), color: (item.write)? 'white' : 'black'}}>W</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity activeOpacity={0.7} onPress={() => {addRemoveSpeak(item.id)}}>
                                                <View style={[{
                                                    alignItems: 'center', justifyContent: 'center', width: getWidthnHeight(15).width, height: getWidthnHeight(15).width,
                                                    backgroundColor: (item.speak)? checkBoxColor : underLayColor, borderRadius: getWidthnHeight(7.5).width
                                                }]}>
                                                    <Text style={{fontSize: (fontSizeH3().fontSize + 3), color: (item.speak)? 'white' : 'black'}}>S</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            );
                        }}
                    />
                </View>
            );
        }
        else if(empty){
            return (
                <View>
                    <FlatList 
                        data={this.props.data}
                        keyboardShouldPersistTaps="handled"
                        keyExtractor={(item) => item.id}
                        nestedScrollEnabled
                        showsVerticalScrollIndicator={false}
                        renderItem={({item, index}) => {
                            return (
                                <View>
                                    <TouchableOpacity 
                                        style={[{borderColor: 'red', borderWidth: 0}, getMarginBottom(1.5)]}
                                        activeOpacity={0.5} 
                                        onPress={() => {
                                            if(item.selected){
                                                deselectFunction(item.id, index)
                                            }else {
                                                selectFunction(item.id, index)
                                            }
                                            Keyboard.dismiss();
                                        }}
                                    >
                                        <View style={[{flexDirection: 'row', alignItems: 'center'}, getWidthnHeight(80)]}>
                                            {(item.selected)?
                                                <MaterialCommunityIcons name="checkbox-marked" size={Math.floor(getWidthnHeight(7).width)} color={checkBoxColor}/>
                                            :
                                                <MaterialCommunityIcons  
                                                    name='checkbox-blank' 
                                                    color={'rgba(146, 146, 146, 0.5)'} 
                                                    size={getWidthnHeight(7).width}
                                                />
                                            }
                                            {/* <ScrollView keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false} horizontal style={[getWidthnHeight(70), getMarginHorizontal(2)]}> */}
                                                <Text style={[{fontSize: (fontSizeH4().fontSize + 3)}]}>{item.name}</Text>
                                            {/* </ScrollView> */}
                                        </View>
                                    </TouchableOpacity>
                                    {(item.selected) && (
                                        <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, getMarginBottom(2)]}>
                                            <TouchableOpacity activeOpacity={0.7} onPress={() => {addRemoveRead(item.id)}}>
                                                <View style={[{
                                                    alignItems: 'center', justifyContent: 'center', width: getWidthnHeight(15).width, height: getWidthnHeight(15).width,
                                                    backgroundColor: (item.read)? checkBoxColor : underLayColor, borderRadius: getWidthnHeight(7.5).width
                                                }]}>
                                                    <Text style={{fontSize: (fontSizeH3().fontSize + 3), color: (item.read)? 'white' : 'black'}}>R</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[getMarginHorizontal(4)]} activeOpacity={0.7} onPress={() => {addRemoveWrite(item.id)}}>
                                                <View style={[{
                                                    alignItems: 'center', justifyContent: 'center', width: getWidthnHeight(15).width, height: getWidthnHeight(15).width,
                                                    backgroundColor: (item.write)? checkBoxColor : underLayColor, borderRadius: getWidthnHeight(7.5).width
                                                }]}>
                                                    <Text style={{fontSize: (fontSizeH3().fontSize + 3), color: (item.write)? 'white' : 'black'}}>W</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity activeOpacity={0.7} onPress={() => {addRemoveSpeak(item.id)}}>
                                                <View style={[{
                                                    alignItems: 'center', justifyContent: 'center', width: getWidthnHeight(15).width, height: getWidthnHeight(15).width,
                                                    backgroundColor: (item.speak)? checkBoxColor : underLayColor, borderRadius: getWidthnHeight(7.5).width
                                                }]}>
                                                    <Text style={{fontSize: (fontSizeH3().fontSize + 3), color: (item.speak)? 'white' : 'black'}}>S</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            );
                        }}
                    />
                </View>
            )
        }
    }

    render(){
        const {empty, searchText} = this.state;
        const {
            isVisible = false, toggle = () => {}, containerStyle = null, data = [], title = "Qualification",
            titleStyle = null, selectFunction = () => {}, deselectFunction = () => {}, checkBoxColor = "#039FFD",
            underLayColor = "#EA304F"
        } = this.props;
        let count = 0;
        data.filter((item) => {
            if(item.selected){
                count += 1;
            }
        })
        //console.log("TOTAL HEIGHT: ", selectedStyle)
        return (
            <View style={{flex: 1}}>
                <View style={[{flex: 1}, containerStyle]}>
                    <Text style={[{color: '#C4C4C4'}, fontSizeH4(), getMarginLeft(2)]}>{title}</Text>
                    {(count === 0)?
                        <Down name="arrow-drop-up" size={Math.floor(getWidthnHeight(7).width)} color="#C4C4C4" style={{transform: [{rotate: '180deg'}]}}/>
                    :
                        <View style={[{
                            width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, borderRadius: getWidthnHeight(3.5).width,
                            backgroundColor: checkBoxColor, alignItems: 'center', justifyContent: 'center'
                        }, getMarginRight(2)]}>
                            <Text style={[{color: '#FFFFFF'}, fontSizeH4()]}>{count}</Text>
                        </View>
                    }
                </View>
                <Modal
                    isVisible={isVisible}
                    onBackdropPress={toggle}
                    style={[{position: 'absolute', flex: 1}, getMarginTop(7.5)]}
                >
                    <View style={[{backgroundColor: 'white', borderRadius: getWidthnHeight(2).width, alignItems: 'center', justifyContent: 'flex-start'}, getWidthnHeight(90, 85)]}>
                        <View style={[{
                            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(196, 196, 196, 0.5)'
                            }, getWidthnHeight(85, 5), getMarginTop(1)]}>
                            <Text style={[{color: 'grey', fontSize: fontSizeH4().fontSize + 2}, titleStyle]}>{title.toUpperCase()}</Text>
                            <TouchableOpacity style={[{borderColor: 'red', borderWidth: 0, alignItems: 'flex-end', justifyContent: 'center'}, getWidthnHeight(20)]} onPress={() => toggle()}>
                                <Icon name="close" size={Math.floor(getWidthnHeight(7).width)} color="grey"/>
                            </TouchableOpacity>
                        </View>
                        <View style={[{
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: checkBoxColor, borderRadius: getWidthnHeight(1).width
                        }, getMarginTop(2), getWidthnHeight(70, 4)]}>
                            <View style={[{flexDirection: 'row', alignItems: 'center'}]}>
                                <Text style={[{color: '#FFFFFF', fontWeight: 'bold'}, fontSizeH4(), styles.boldFont]}>R - </Text>
                                <Text style={[{color: '#FFFFFF'}, fontSizeH4()]}>Read</Text>
                            </View>
                            <View style={[{flexDirection: 'row', alignItems: 'center'}]}>
                                <Text style={[{color: '#FFFFFF', fontWeight: 'bold'}, fontSizeH4(), styles.boldFont]}>W - </Text>
                                <Text style={[{color: '#FFFFFF'}, fontSizeH4()]}>Write</Text>
                            </View>
                            <View style={[{flexDirection: 'row', alignItems: 'center'}]}>
                                <Text style={[{color: '#FFFFFF', fontWeight: 'bold'}, fontSizeH4(), styles.boldFont]}>S - </Text>
                                <Text style={[{color: '#FFFFFF'}, fontSizeH4()]}>Speak</Text>
                            </View>
                        </View>
                        <View style={[{
                            borderColor: '#C4C4C4', borderWidth: 1, paddingHorizontal: getWidthnHeight(2).width,
                            borderRadius: getWidthnHeight(1).width, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                        }, getWidthnHeight(80, 6.5), getMarginTop(2)]}>
                            <TextInput 
                                placeholder="Search here"
                                style={{flex: 1, fontSize: fontSizeH4().fontSize + 3}}
                                value={this.state.searchText}
                                onChangeText={(searchText) => {
                                    this.setState({searchText}, () => {
                                        const {searchText} = this.state;
                                        if(searchText === ''){
                                            this.setState({empty: true})
                                        }else{
                                            this.setState({empty: false})
                                        }
                                    })
                                }}  
                            />
                            <TouchableOpacity activeOpacity={0.5} onPress={() => Keyboard.dismiss()}>
                                <Icon name="search" size={Math.floor(getWidthnHeight(7).width)} color="grey"/>
                            </TouchableOpacity>
                        </View>
                        <View style={[{alignItems: 'center', borderColor: 'blue', borderWidth: 0, flex: 1}, getMarginTop(2)]}>
                            <View style={[{borderWidth: 0, borderColor: 'red', flex: 1}, getMarginBottom(2)]}>
                                {this.dataList()}
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

class ScreensModal extends Component{
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

    async editScreen(item){
        const {baseURL, apiData, toggle = () => {}, navigation} = this.props;
        const secretToken = await AsyncStorage.getItem('onboardingToken');
        this.showLoader();
        console.log("^^^ @@@ PAGE CONTENT API: ", `${baseURL}/onboarding/page-content/${apiData.draftId}/page/${item.page}`, item);
        axios.post(`${baseURL}/onboarding/page-content/${apiData.draftId}/page/${item.page}`,
        {},
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${secretToken}`
            }
        }).then((response) => {
            this.hideLoader();
            toggle();
            const parsedData = response.data;
            console.log("### CHECK LIST RESPONSE: ", parsedData)
            Alert.alert('Success!!!', parsedData.message);
            navigation.navigate(item.key, { apiData: JSON.stringify(parsedData) })
        }).catch((error) => {
            this.hideLoader();
            let status = null;
            console.log("ERROR RESPONSE: ", error)
            if(error.response){
                status = error.response.status;
                Alert.alert("Error!!!", `ErrorCode: ${status}xxx.`)
            }else{
                alert(`${error}, API CODE: xxx`)
            }
        })
    }

    render(){
        const {loading} = this.state;
        const {isVisible = false, toggle = () => {}, data = [], checkBoxColor = "#039FFD", underLayColor = "#EA304F", apiData = null} = this.props;
        return (
            <View>
                <Modal
                    isVisible={isVisible}
                    style={{flex: 1, justifyContent: 'flex-start'}}
                >
                    <View style={{flex: 1}}>
                        <View style={{backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'space-evenly', flex: 1}}>
                            <View style={[{borderColor: '#FFFFFF', borderWidth: 0}, getWidthnHeight(90, 80)]}>
                                <FlatList 
                                    data={data}
                                    nestedScrollEnabled
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={(item) => `${item.page}`}
                                    renderItem={({item, index}) => {
                                        return (
                                            <View style={[{
                                                borderRadius: getWidthnHeight(2).width, alignItems: 'flex-start', justifyContent: 'center', 
                                                backgroundColor: Boolean(item.filled)? checkBoxColor : underLayColor, overflow: 'hidden'
                                                }, getWidthnHeight(90, 13), getMarginBottom(2)
                                            ]}>
                                                {/* {<View style={{position: 'absolute'}}>
                                                    <View style={[getWidthnHeight(90, 13)]}>
                                                        <View style={{flex: 1, justifyContent: 'flex-start'}}>
                                                            <LinearGradient 
                                                                start={{x: 0, y: 0}} 
                                                                end={{x: 0, y: 1}}
                                                                colors={['rgba(255, 255, 255, 0.7)', 'transparent']}
                                                                style={[{
                                                                    borderBottomLeftRadius: 100, 
                                                                    borderBottomRightRadius: getWidthnHeight(45).width
                                                                }, getWidthnHeight(90, 8)]}
                                                            />
                                                        </View>
                                                    </View>
                                                </View>} */}
                                                <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(90)]}>
                                                    <View style={{flex: 1, borderWidth: 0, borderColor: 'red'}}>
                                                        <ScrollView nestedScrollEnabled horizontal showsHorizontalScrollIndicator={false}>
                                                            <Text
                                                                style={[{
                                                                    color: (item.filled)? "#FFFFFF" : '#000000',
                                                                    fontSize: (fontSizeH4().fontSize + 3), fontWeight: 'bold',
                                                                }, styles.boldFont, getMarginHorizontal(2)]}
                                                            >
                                                                    {item.title}
                                                            </Text>
                                                        </ScrollView>
                                                        <Text style={[{
                                                            color: (item.filled)? "#FFFFFF" : '#000000'
                                                            }, getMarginHorizontal(2), getMarginVertical(2), fontSizeH4()]}
                                                        >
                                                            {`( Page: ${item.page})`}
                                                        </Text>
                                                    </View>
                                                    <TouchableOpacity 
                                                        style={[{borderColor: 'yellow', borderWidth: 0}]} 
                                                        activeOpacity={0.5} 
                                                        onPress={() => {
                                                            if(item.page === 1){
                                                                if(data[index]['filled'] === true && this.props.route.name !== item.key){
                                                                    this.editScreen(item);
                                                                }else{
                                                                    toggle();
                                                                }
                                                            }else{
                                                                if(data[index - 1]['filled'] === true && this.props.route.name !== item.key){
                                                                    this.editScreen(item);
                                                                }else{
                                                                    toggle();
                                                                }
                                                            }
                                                        }}>
                                                        <View style={[getMarginLeft(4), getMarginRight(2)]}>
                                                            {((index > 0 && data[index - 1]['filled']) || index === 0)?
                                                                <FontAwesone name="edit" color={(item.filled)? "#FFFFFF" : '#000000'} size={getWidthnHeight(7).width}/>
                                                            :
                                                                <MaterialIcon name="do-not-disturb" color={'#000000'} size={getWidthnHeight(7).width}/>
                                                            }
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        );
                                    }}
                                />
                            </View>
                            <TouchableOpacity activeOpacity={0.7} onPress={() => toggle()}>
                                <View style={[{
                                    alignItems: 'center', justifyContent: 'center', width: getWidthnHeight(15).width, height: getWidthnHeight(15).width,
                                    backgroundColor: '#FFFFFF', borderRadius: getWidthnHeight(7.5).width
                                }]}>
                                    <Icon name="close" size={Math.floor(getWidthnHeight(10).width)} color="black"/>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View 
                            style={[{
                                backgroundColor: (loading)? 'transparent' : 'transparent', borderTopLeftRadius:0,
                                borderTopRightRadius: 0, borderColor: 'yellow', borderWidth: 0}, StyleSheet.absoluteFill
                            ]} 
                            pointerEvents={(loading)? 'auto' : 'none'}
                        >
                            {(loading) && 
                                <Spinner loading={loading} style={[styles.loadingStyle, getWidthnHeight(40, 8), getMarginTop(5), getMarginLeft(5)]} color='rgb(19,111,232)'/>
                            }
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

export {CheckList, LanguageSelection, ScreensModal};