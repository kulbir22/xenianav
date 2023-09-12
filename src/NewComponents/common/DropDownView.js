import React, {Component} from 'react';
import {View, Text, TextInput, Animated, StyleSheet, Platform} from 'react-native';
import { Keyboard } from 'react-native';
import {TouchableOpacity, FlatList} from 'react-native-gesture-handler';
import {getWidthnHeight, getMarginTop, fontSizeH4, getMarginLeft, getMarginHorizontal} from './width';

const AnimateTouch = Animated.createAnimatedComponent(TouchableOpacity);

class DropDownView extends Component{
    constructor(props){
        super(props)
        this.state = {
            layout: null
        }
    }

    searchInputName(dataList, searchName, callBack){
        let isNum = /^\d+$/.test(searchName);
        console.log("Search Result: ", typeof isNum, isNum)
        let filterNames = dataList;
        let splitArray = [];
        splitArray = searchName.toLowerCase().split('');
        console.log("THIS IS STRING: ", typeof searchName, searchName)
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

    onLayout(event){
        this.setState({layout: event.nativeEvent.layout}, () => console.log("### LAYOUT: ", this.state.layout))
    }

    renderFlatList(){
        const {searchName, textBoxSize, selectedItem, hideDropDown, dataList, dropDownSize} = this.props;
        let data = [];
        if(searchName){
            this.searchInputName(dataList, searchName, (dataArray) => {
                if(dataArray !== [] && dataArray !== null && dataArray.length !== null && dataArray.length > 0){
                    data = dataArray
                    console.log("%%%%% TEST ARRAY: ", data.length)
                    //this.setState({filterData: dataArray}, () => console.log("%%%%% TEST ARRAY: ", this.state.filterData.length))
                }
            })
        }
        if(data.length === 0 && searchName !== ''){
            return (
                <View style={[{alignItems: 'center', justifyContent: 'center', borderWidth: 0, borderColor: '#C4C4C4'}, dropDownSize]}>
                    <Text style={{color: 'grey', fontSize: fontSizeH4().fontSize}}>Not found</Text>
                </View>
            )
        }else if(data !== [] && data !== null && data.length !== null && data.length > 0 && searchName !== ''){
            return (
                <View style={{flex: 1}}>
                    <FlatList 
                        nestedScrollEnabled={true}
                        //contentContainerStyle={{flex: 1}}
                        data={data}
                        keyExtractor={(item) => "" + item.id}
                        showsVerticalScrollIndicator={true}
                        onLayout={(event) => this.onLayout(event)}
                        renderItem={({item, index}) => {
                            //console.log("FLATLIST INDEX", index%2)
                            const {dataList, dropDownBG, dropDownTextStyle} = this.props;
                            return (
                                <TouchableOpacity 
                                    onPress={() => {
                                        selectedItem(item.id, item.name, dataList);
                                        hideDropDown();
                                    }}
                                    style={[{
                                        width: Math.floor(textBoxSize[0]['width']), height: Math.floor(textBoxSize[0]['height']), 
                                        justifyContent: 'center', backgroundColor: (index%2 === 0)? dropDownBG[0] : dropDownBG[1]
                                }]}>
                                    <Text numberOfLines={1} style={[fontSizeH4(), getMarginHorizontal(1), dropDownTextStyle]}>{item.name}</Text>
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>
            )
        }else if(searchName === ''){
            return (
                <View style={{flex: 1}}>
                    <FlatList 
                        nestedScrollEnabled={true}
                        //contentContainerStyle={{flexGrow: 1}}
                        data={dataList}
                        keyExtractor={(item) => "" + item.id}
                        showsVerticalScrollIndicator={true}
                        onLayout={(event) => this.onLayout(event)}
                        renderItem={({item, index}) => {
                            //console.log("FLATLIST INDEX", index%2)
                            const {dataList, dropDownBG, dropDownTextStyle} = this.props;
                            return (
                                <TouchableOpacity 
                                    onPress={() => {
                                        selectedItem(item.id, item.name, index, dataList);
                                        hideDropDown();
                                        Keyboard.dismiss();
                                    }}
                                    style={[{
                                        width: Math.floor(textBoxSize[0]['width']), height: Math.floor(textBoxSize[0]['height']), 
                                        justifyContent: 'center', backgroundColor: (index%2 === 0)? dropDownBG[0] : dropDownBG[1],
                                }]}>
                                    <Text numberOfLines={1} style={[fontSizeH4(), getMarginHorizontal(1), dropDownTextStyle]}>{item.name}</Text>
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>
            )
        }
    }

    render(){
        const {dropDownSize} = this.props;
        return (
            <View pointerEvents="auto" style={{position: 'absolute'}}>
                <View style={[{
                    borderColor: 'red', borderWidth: 0, shadowColor: '#000000', zIndex: 999,
                    shadowOpacity: 0.7, shadowRadius: 5, elevation: 4, shadowOffset: {width: 0, height: 1},
                    backgroundColor: 'white'
                }, dropDownSize]}>
                    {this.renderFlatList()}
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    container: {
        ...Platform.select(
            {
                android: {
                    zIndex: 1,
                },
                ios: {
                    zIndex: 2
                }
            }
        )
    }
})

export {DropDownView};