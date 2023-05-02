import React, { Component } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Platform, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Modal from 'react-native-modal';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import sid from '../Image/sid.png';
import squirrel from '../Image/squirrel.png';
import mammoth from '../Image/mammoth.png';
import bigcat from '../Image/bigcat.png';
import mommaDino from '../Image/mommaDino.png';
import { 
    fontSizeH2, fontSizeH3, fontSizeH4, getMarginBottom, getMarginLeft, getMarginTop, 
    getMarginVertical, getWidthnHeight, GradientIcon
} from '../KulbirComponents/common';

class LevelSelection extends Component{
    constructor(props){
        super(props)
        this.state = {
            levels: [
                {
                    id: '1',
                    image: sid,
                    difficultyLevel: 1,
                    enableFoxMode: false,
                    name: 'SID',
                    rowCol: 3
                },
                {
                    id: '2',
                    image: squirrel,
                    difficultyLevel: 2,
                    enableFoxMode: false,
                    name: 'SCRAT',
                    rowCol: 3
                },
                {
                    id: '3',
                    image: mammoth,
                    difficultyLevel: 1,
                    enableFoxMode: true,
                    name: 'MANNY',
                    rowCol: 3
                },
                {
                    id: '4',
                    image: bigcat,
                    difficultyLevel: 2,
                    enableFoxMode: true,
                    name: 'DIEGO',
                    rowCol: 3
                },
                {
                    id: '5',
                    image: mommaDino,
                    difficultyLevel: 2,
                    enableFoxMode: true,
                    name: 'MOMMA DINO',
                    rowCol: 4
                }
            ]
        }
    }
    render(){
        const { levels } = this.state;
        const {
            isVisible = false, toggle = () => {}, startGame = () => {}, finish = false,
            winnerDetails = null, timeOut = false
        } = this.props;
        let winner = null;
        if((winnerDetails) && (winnerDetails !== '999') && (winnerDetails.includes('tie') === false)){
            let index = null;
            index = levels.findIndex((item) => {
                return (item.id === winnerDetails)
            })
            winner = levels[index]
        }else if(winnerDetails.includes('tie')){
            const split = winnerDetails.split('-');
            const botID = split[1];
            //console.log("### SPLIT: ", split, botID)
            let index = null;
            index = levels.findIndex((item) => {
                return (item.id === botID)
            })
            winner = levels[index]
        }
        return(
            <Modal 
                isVisible={isVisible}
                onBackdropPress={toggle}
                animationOut="slideOutLeft"
                style={{alignItems: 'center', justifyContent: 'center'}}
                backdropOpacity={0.90}
            > 
                <View style={[{
                    alignItems: 'center', justifyContent: 'center', borderColor: 'white', borderWidth: 0,
                    backgroundColor: 'transparent'
                    }, getWidthnHeight(80), getMarginTop(0)
                ]}>
                    {(!finish)? (
                        <View style={{alignItems: 'center'}}>
                            <Text style={[{color: 'white'}, fontSizeH3(), getMarginTop(5)]}>Choose your Opponent:</Text>
                            <FlatList 
                                keyExtractor={(item) => item.id}
                                data={levels}
                                renderItem={({item}) => {
                                    const { boldFont } = styles;
                                    let iqWidth = null;
                                    if(item.id === '1'){
                                        iqWidth = { 
                                            width: getWidthnHeight(4).width, height: getWidthnHeight(1.5).width,
                                            backgroundColor: '#FC5404', borderRadius: getWidthnHeight(2).width
                                        }
                                    }else if(item.id === '2'){
                                        iqWidth = { 
                                            width: getWidthnHeight(8).width, height: getWidthnHeight(1.5).width,
                                            backgroundColor: '#FEE440', borderRadius: getWidthnHeight(2).width
                                        }
                                    }else if(item.id === '3'){
                                        iqWidth = { 
                                            width: getWidthnHeight(16).width, height: getWidthnHeight(1.5).width,
                                            backgroundColor: '#8BCDCD', borderRadius: getWidthnHeight(2).width
                                        }
                                    }else if(item.id === '4'){
                                        iqWidth = { 
                                            width: getWidthnHeight(23).width, height: getWidthnHeight(1.5).width,
                                            backgroundColor: '#77D970', borderRadius: getWidthnHeight(2).width
                                        }
                                    }else if(item.id === '5'){
                                        iqWidth = { 
                                            width: getWidthnHeight(30).width, height: getWidthnHeight(1.5).width,
                                            backgroundColor: '#28FFBF', borderRadius: getWidthnHeight(2).width
                                        }
                                    }
                                    return (
                                        <TouchableOpacity 
                                            style={[{
                                                flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',
                                                backgroundColor: '#2C2E43', borderRadius: getWidthnHeight(2).width,
                                                borderColor: 'white', borderWidth: 0.5
                                                }, getWidthnHeight(70, 12), getMarginVertical(2)
                                            ]}
                                            activeOpacity={0.8}
                                            onPress={() => {
                                                startGame(item)
                                            }}
                                        >
                                            <View style={[{
                                                width: getWidthnHeight(20).width, height: getWidthnHeight(20).width, borderRadius: getWidthnHeight(10).width,
                                                backgroundColor: '#F9D5A7', alignItems: 'center', justifyContent: 'center'
                                                }, getMarginLeft(4)]}>
                                                <Image 
                                                    style={{
                                                        width: getWidthnHeight(18).width, height: getWidthnHeight(18).width,
                                                        transform: [{scale: (item.id === '2')? 0.8 : 1}]
                                                    }}
                                                    source={(item.image)}
                                                    resizeMode="contain"
                                                />
                                            </View>
                                            <View style={[{alignItems: 'flex-start'}, getMarginLeft(2)]}>
                                                <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}]}>
                                                    <Text style={[{color: 'white', fontWeight: 'bold'}, boldFont, fontSizeH4()]}>Name: </Text>
                                                    <Text style={[{color: 'white'}, fontSizeH4()]}>{item.name}</Text>
                                                </View>
                                                <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, getMarginTop(2)]}>
                                                    <Text style={[{color: 'white', fontWeight: 'bold'}, boldFont, fontSizeH4()]}>Skills: </Text>
                                                    <View 
                                                        style={iqWidth}
                                                    />
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                        </View>
                    )
                    :
                        <TouchableWithoutFeedback 
                            onPress={() => {
                                //console.log("@@@ WITHOUT FEEDBACK");
                                toggle();
                            }}
                        >
                            <View>
                                {((winnerDetails && winnerDetails !== '999' && winnerDetails.includes('tie') === false) || (timeOut)) && (
                                    <View style={{alignItems: 'center'}}>
                                        {(timeOut) && (
                                            <Text style={[{color: 'white'}, fontSizeH3(), getMarginBottom(3)]}>Oops! You ran out of time</Text>
                                        )}
                                        <View style={[{
                                            width: getWidthnHeight(40).width, height: getWidthnHeight(40).width, borderRadius: getWidthnHeight(20).width,
                                            backgroundColor: '#F9D5A7', alignItems: 'center', justifyContent: 'center'
                                            }]}>
                                            <Image 
                                                style={{
                                                    width: getWidthnHeight(36).width, height: getWidthnHeight(36).width,
                                                    transform: [{scale: (winner.id === '2')? 0.8 : 1}]
                                                }}
                                                source={(winner.image)}
                                                resizeMode="contain"
                                            />
                                        </View>
                                        <Text style={[{color: 'white'}, fontSizeH4()]}>{winner.name}</Text>
                                        <Text style={[{color: 'white'}, fontSizeH2(), getMarginTop(5)]}>WINNER</Text>
                                    </View>
                                )}
                                {(winnerDetails === '999')&& (
                                    <View style={{alignItems: 'center'}}>
                                        <View 
                                            style={[{
                                                width: getWidthnHeight(40).width, height: getWidthnHeight(40).width, borderRadius: getWidthnHeight(20).width,
                                                backgroundColor: '#F9D5A7', alignItems: 'center', justifyContent: 'center'
                                        }]}>
                                            <FontAwesome name='user-circle' size={getWidthnHeight(36).width}/>
                                        </View>
                                        <Text style={[{color: 'white'}, fontSizeH4()]}>YOU</Text>
                                        <Text style={[{color: 'white'}, fontSizeH2(), getMarginTop(5)]}>WINNER</Text>
                                    </View>
                                )}
                                {(winnerDetails.includes('tie')) && (
                                    <View style={{alignItems: 'center'}}>
                                        <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}, getWidthnHeight(70)]}>
                                            <View style={{alignItems: 'center'}}>
                                                <View 
                                                    style={[{
                                                        width: getWidthnHeight(20).width, height: getWidthnHeight(20).width, borderRadius: getWidthnHeight(10).width,
                                                        backgroundColor: '#F9D5A7', alignItems: 'center', justifyContent: 'center'
                                                }]}>
                                                    <FontAwesome name='user-circle' size={getWidthnHeight(18).width}/>
                                                </View>
                                                <Text style={[{color: 'white'}, fontSizeH4()]}>YOU</Text>
                                            </View>
                                            <GradientIcon
                                                start={{x: 0.3, y: 0.3}}
                                                end={{x: 0.5, y: 0.2}}
                                                containerStyle={[{borderWidth: 0, borderColor: 'red', alignItems: 'center'}, getWidthnHeight(25)]}
                                                icon={
                                                    <MaterialCommunityIcons 
                                                        style={{backgroundColor: 'transparent', transform: [{rotate: '30deg'}, {scaleY: 2}, {scaleX: 0.8}]}} 
                                                        name='lightning-bolt-outline' 
                                                        size={getWidthnHeight(25).width}
                                                    />
                                                }
                                                colors={["#FFFFFF", "#FFFFFF"]}
                                            />
                                            <View style={{alignItems: 'center'}}>
                                                <View style={[{
                                                    width: getWidthnHeight(20).width, height: getWidthnHeight(20).width, borderRadius: getWidthnHeight(10).width,
                                                    backgroundColor: '#F9D5A7', alignItems: 'center', justifyContent: 'center'
                                                    }]}>
                                                    <Image 
                                                        style={{
                                                            width: getWidthnHeight(18).width, height: getWidthnHeight(18).width,
                                                            transform: [{scale: (winner.id === '2')? 0.8 : 1}]
                                                        }}
                                                        source={(winner.image)}
                                                        resizeMode="contain"
                                                    />
                                                </View>
                                                <Text style={[{color: 'white'}, fontSizeH4()]}>{winner.name}</Text>
                                            </View>
                                        </View>
                                        <Text style={[{color: 'white'}, fontSizeH2(), getMarginTop(3)]}>Its a Tie!!!</Text>
                                    </View>
                                )}
                            </View>
                        </TouchableWithoutFeedback>
                    }
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    boldFont: {
        ...Platform.select({
            android: {
                fontFamily: ''
            }
        })
    }
})

export default LevelSelection;