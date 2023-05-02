import React, {Component} from 'react';
import {View, Text, TextInput, StyleSheet, Platform, FlatList, ScrollView} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import {Header} from './Header';
import {
    getWidthnHeight, getMarginTop, getMarginLeft, fontSizeH4, ChoppedButton, getMarginVertical, getMarginBottom,
    MaskedGradientText, fontSizeH3, IOS_StatusBar, statusBarGradient
} from '../KulbirComponents/common';

class CouponsLeft extends Component{
    constructor(props){
        super(props)
        this.state = {
            bookID: '',
            bookName: '',
            bookData: [
                {id: '1', name: 'Book Value 10'},
                {id: '2', name: 'Book Value 20'},
                {id: '3', name: 'Book Value 30'},
                {id: '4', name: 'Book Value 40'},
                {id: '5', name: 'Book Value 50'}
            ]
        };
    }

    render(){
        const {bookID, bookName, bookData} = this.state;
        const colorTitle = '#0B8EE8';
        const tableHeader = [
            {id: '1', name: 'Book Name'},
            {id: '2', name: 'Type'},
            {id: '3', name: 'Coupons Left'}
        ];
        const issuedBooks = [
            {id: '1', name: 'Treasure Island', type: 10, couponsLeft: 23},
            {id: '2', name: 'Colombua', type: 50, couponsLeft: 23},
            {id: '3', name: 'Nikola', type: 30, couponsLeft: 23},
            {id: '4', name: 'Tin Tin', type: 80, couponsLeft: 23},
            {id: '5', name: 'Eternal', type: 20, couponsLeft: 23},
            {id: '6', name: 'Adventure', type: 100, couponsLeft: 23},
            {id: '7', name: 'Treasure Island', type: 10, couponsLeft: 23},
            {id: '8', name: 'Colombua', type: 50, couponsLeft: 23},
            {id: '9', name: 'Nikola', type: 30, couponsLeft: 23},
            {id: '10', name: 'Tin Tin', type: 80, couponsLeft: 23},
            {id: '11', name: 'Eternal', type: 20, couponsLeft: 23},
            {id: '12', name: 'Adventure', type: 100, couponsLeft: 23},
            {id: '13', name: 'Treasure Island', type: 10, couponsLeft: 23},
            {id: '14', name: 'Colombua', type: 50, couponsLeft: 23},
            {id: '15', name: 'Nikola', type: 30, couponsLeft: 23},
            {id: '16', name: 'Tin Tin', type: 80, couponsLeft: 23},
            {id: '17', name: 'Eternal', type: 20, couponsLeft: 23},
            {id: '18', name: 'Adventure', type: 100, couponsLeft: 23},
        ];
        const portName = "Port Name here";
        return (
            <View style={{flex: 1}}>
                <IOS_StatusBar color={statusBarGradient} barStyle="light-content"/>
                <Header
                    menu='white'
                    title='Coupons Left'
                />
                <View style={styles.container}>
                    <View style={[{
                        flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', shadowColor: '#000000', shadowOpacity: 0.5,
                        elevation: 4, shadowRadius: 2
                        }, getWidthnHeight(93), getMarginVertical(2)
                    ]}>
                        <View style={[getMarginTop(1)]}>
                            <MaskedGradientText
                                title={portName}
                                titleStyle={[{fontWeight: '600', color: '#000000', fontSize: (fontSizeH3().fontSize)}]}
                                start={{x: 0, y: 0}}
                                end={{x: 0.7, y: 0}}
                                colors={["#039FFD", "#EA304F"]}
                            />
                        </View>
                        <Dropdown
                            containerStyle={[{textOverflow:'hidden', borderColor: '#C4C4C4', borderWidth: 1, borderRadius: getWidthnHeight(1).width}, getWidthnHeight(84, 7), getMarginTop(3)]}
                            inputContainerStyle={[{
                                borderBottomWidth: 0, borderColor: '#C4C4C4', paddingHorizontal: 5 
                            }, getWidthnHeight(84), getMarginTop(-1)]}
                            label={'Books available in the port'}
                            labelFontSize={fontSizeH4().fontSize - 3}
                            labelTextStyle={[getMarginLeft(1.5), getMarginTop(0)]}
                            data={bookData}
                            valueExtractor={({id})=> id}
                            labelExtractor={({name})=> name}
                            onChangeText={(id, index, data) => {
                                this.setState({bookID: id, bookName: data[index]['name']})
                            }}
                            value={bookName}
                            baseColor = {(bookName)? colorTitle : '#C4C4C4'}
                            fontSize = {(bookName)? fontSizeH4().fontSize + 2 : fontSizeH4().fontSize}
                        />
                        <View style={[getMarginTop(2)]}>
                            <ChoppedButton 
                                onPress={() => {}}
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
                            <Text style={[{color: colorTitle}, fontSizeH4(), getMarginLeft(5)]}>TOTAL COUPONS LEFT</Text>
                        </View>
                        <View style={[getMarginTop(1)]}>
                            <View style={[{backgroundColor: colorTitle, flexDirection: 'row'}, getWidthnHeight(84, 5)]}>
                                {tableHeader.map((item, index) => {
                                    return (
                                        <View style={[{
                                            alignItems: (index === 0)? 'flex-start' : 'center', justifyContent: 'center', borderColor: 'white', borderRightWidth: 0
                                            }, getWidthnHeight((index === 0)? 44 : 20, 5)
                                        ]}>
                                            <Text 
                                                numberOfLines={(index === 2)? 2 : 1} 
                                                style={[{
                                                    textAlign: 'center', color: 'white', fontWeight: 'normal', fontSize: (fontSizeH4().fontSize + 2)
                                                    }, styles.boldFont, getMarginLeft((index === 0)? 3 : 0)
                                            ]}>
                                                    {item.name}
                                            </Text>
                                        </View>
                                    );
                                })
                                }
                            </View>
                        </View>
                        <View style={[{flex: 1}, getMarginBottom(2)]}>
                            <FlatList 
                                data={issuedBooks}
                                nestedScrollEnabled={true}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item) => item.id}
                                renderItem={({item, index}) => {
                                    return (
                                        <View style={[{flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: 'rgba(196, 196, 196, 0.3)'}, getWidthnHeight(84, 5)]}>
                                            <View style={[{justifyContent: 'space-evenly', borderWidth: 0, borderColor: 'red'}, getWidthnHeight(44, 5)]}>
                                                <Text numberOfLines={1} style={[{color: '#000000', fontSize: (fontSizeH4().fontSize + 2)}, getMarginLeft(3)]}>{item.name}</Text>
                                            </View>
                                            <View style={[{alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(20, 5)]}>
                                                <Text>{item.type}</Text>
                                            </View>
                                            <View style={[{alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(20, 5)]}>
                                                <Text>{item.couponsLeft}</Text>
                                            </View>
                                        </View>
                                    );
                                }}
                            />
                        </View>
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
    }
})

export default CouponsLeft;