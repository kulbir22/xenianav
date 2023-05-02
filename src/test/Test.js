import React, { Component } from 'react';
import {
  StyleSheet, Text,
  TouchableOpacity, View, Image,
  Dimensions, ActivityIndicator, TextInput,
  Alert, ScrollView, Platform, Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-material-dropdown';
import {extractBaseURL} from '../api/BaseURL';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {
  CommonModal, getWidthnHeight, DismissKeyboard, LeadInfoModal, WaveHeader, 
  RoundButton, getMarginTop, getMarginBottom, getMarginLeft, LeadCommonCard,
  SearchBar,
  fontSizeH3,
  fontSizeH2
} from '../KulbirComponents/common';
import { filteredData } from '../actions';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const colorBase = '#25A2F9';
const modalColor = '#1079D5';
let newDataArray = [];

let clickKey = null;

class Lead_list extends Component {

constructor(props){
super(props)
//this._onScroll = this._onScroll.bind(this);
  this.state={
    questions: [
      'Would you like to listen some songs ?',
      'Do you prefer Jubin Nautiyal ?',
      'Are you married ?',
      'Are you scorpion ?'
    ],
    index: 0,
    animation: new Animated.Value(0),
    progress: new Animated.Value(0)
  }
}

componentDidMount(){
//this.Lead_list().done();
}

searchLeadName(empArray, searchName, callBack){
  let isNum = /^\d+$/.test(searchName);
  console.log("Search Result: ", typeof isNum, isNum)
  let filterNames = empArray;
  let splitArray = [];
  if(!isNum){
    splitArray = searchName.toLowerCase().split('');
    console.log("THIS IS STRING: ", typeof searchName, searchName)
  }else if(isNum){
    splitArray = (searchName.split(''));
    console.log("THIS IS NUMBER: ", typeof searchName, searchName)
  }
  const searchLength = splitArray.length;
  let data = [];
  //console.log("SPLIT SEARCH: ", splitArray, searchLength)
  for(let i = 0; i <= filterNames.length - 1; i++){
    let leadName = null;
    let splitLeadName = [];
    if(!isNum && Boolean(filterNames[i]['lead_executives']) && Boolean(filterNames[i]['lead_executives']['fullname'])){
      leadName = filterNames[i]['lead_executives']['fullname'];
      splitLeadName = leadName.toLowerCase().split(''); 
      //console.log("SPLIT LEAD NAME: ", splitLeadName)
    }else if(isNum){
      leadName = (filterNames[i]['lead_code']);
      splitLeadName = leadName.split('');
      //console.log("SPLIT LEAD NAME: ", splitLeadName)
    }
    //console.log("SPLIT ARRAY: ", splitArray)
      //console.log("INSIDE LOOP: ", splitArray, splitLeadName)
      for(let j = 0; j < searchLength; j++){
        //console.log("INSIDE FOR LOOP****: ", j)
        if(splitArray[j] !== splitLeadName[j]){
            console.log("$$$$$ BREAK $$$$$")
            //this.setState({noData: true})
            break;
        }
        if(j === searchLength - 1 && splitArray[searchLength - 1] === splitLeadName[searchLength - 1]){
            data.push(filterNames[i])
            //console.log("FOR LOOP DATA: ", data.length)
            //callBack(data)
        }
      }
      if(i === filterNames.length - 1){
        if(data.length > 0){
          this.setState({noData: false})
          callBack(data);
        }else{
          this.setState({noData: true})
        }
      }
    }
  }

  multipleCards(){
    const {Lead_listing, searchText, filterData} = this.state;
    //console.log("SELF TASK: ", self_task)
    let empArray = Lead_listing;
    let data = [];
    let searchName = searchText;
    const check = Boolean(searchName.includes('_$'))
    let checkArray = [];
    let multiFilterNumber = false;
    if(check){
      checkArray = searchName.split('_$')
      const initial = /^\d+$/.test(checkArray[0])
      multiFilterNumber = /^\d+$/.test(checkArray[1])
      if(initial){
        checkArray.forEach((array, index) => {
          checkArray[index] = "";
        })
      }
      if(!initial && !multiFilterNumber && checkArray[1]){
        checkArray.forEach((array, index) => {
          checkArray[index] = "";
        })
      }
      // if(!multiFilterNumber && !initial){
      //   checkArray.forEach((array, index) => {
      //   checkArray[index] = "";
      //   })
      // }
      console.log("^^^^^ CHECK STRING: ", Boolean(checkArray[0]), checkArray, searchName, checkArray[1], "CHECK NUMBER: ", multiFilterNumber)
    }
    const checkCharacters = Boolean(searchName.includes('_'));
    let charArray = [];
    if(checkCharacters){
      charArray = searchName.split('_')
      searchName = charArray[0];
      console.log("TEST SCREEN: ", charArray)
      const initial = /^\d+$/.test(searchName)
      if(initial){
        searchName = '';
      }else if(!initial && charArray[1]){
        searchName = '';
      }
    }
    console.log("SEARCH FOR: ", searchName, check)
    if(searchName && !check || checkCharacters && !check){
        console.log("EXTRACT STRING: ", searchName)
        this.searchLeadName(empArray, searchName, (dataArray) => {
          if(dataArray !== [] && dataArray !== null && dataArray.length !== null && dataArray.length > 0){
            data = dataArray;
            this.setState({filterData: dataArray, multiFilter: []}, () => console.log("%%%%% TEST ARRAY: ", this.state.filterData.length))
            this.setState({noData: false})
          }
        });
    }else if(check && filteredData.length > 0 && Boolean(checkArray[0]) && multiFilterNumber){
        console.log("%%%%% DUAL FILTER IS NOW ACTIVE")
          this.searchLeadName(filterData, checkArray[1], (dataArray) => {
            if(dataArray !== [] && dataArray !== null && dataArray.length !== null && dataArray.length > 0){
              data = dataArray;
              this.setState({multiFilter: dataArray}, () => console.log("%%%%% MULTI-FILTER ARRAY: ", this.state.multiFilter.length))
            }
          });
    }else if(check && !multiFilterNumber){
      this.searchLeadName(empArray, checkArray[0], (dataArray) => {
        if(dataArray !== [] && dataArray !== null && dataArray.length !== null && dataArray.length > 0){
          data = dataArray;
          this.setState({filterData: dataArray, multiFilter: []}, () => console.log("%%%%% TEST ARRAY: ", this.state.filterData.length))
          this.setState({noData: false})
        }
      });
    }
  }

  handlePress(){
    const {animation, progress, index} = this.state;
    Animated.parallel([
      Animated.timing(animation, {
        toValue: 1,
        duration: 400,
      })
    ]).start(() =>  this.setState({index: index + 1}, () => this.state.animation.setValue(0)))
  }

render (){
  const {questions, index, animation, progress} = this.state;
  const question = questions[index];
  let nextQuestion;
  if(index + 1 < questions.length){
    nextQuestion = questions[index + 1]
  }
  const mainQuestion = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, (-1) * getWidthnHeight(100).width]
  })
  const mainStyle = {
    transform: [
      {
        translateX: mainQuestion
      }
    ]
  }
  const nextQuestionInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [getWidthnHeight(100).width, 0]
  })
  const nextStyle = {
    transform: [
      {
        translateX: nextQuestionInterpolate
      }
    ]
  }
return (
        <View style={{height:viewportHeight,width:viewportWidth,backgroundColor:'#e6e6e6'}}>
            <WaveHeader
                wave={Platform.OS ==="ios" ? false : false} 
                //logo={require('../Image/Logo-164.png')}
                menu='white'
                title='Test Screen'
                createLead={true}
            />
            <View style={{flexDirection: 'row', borderColor: 'red', borderWidth: 0, flex: 1, backgroundColor: '#DA3256'}}>
              <View style={[StyleSheet.absoluteFill, {alignItems: 'center', justifyContent: 'center'}]}>
                <Animated.Text style={[{color: '#FFF', position: 'absolute'}, fontSizeH3(), mainStyle]}>{question}</Animated.Text>
                <Animated.Text style={[{color: '#FFF', position: 'absolute'}, fontSizeH3(), nextStyle]}>{nextQuestion}</Animated.Text>
              </View>
              <TouchableOpacity onPress={() => this.handlePress()} activeOpacity={0.7} style={{flex: 1, borderWidth: 0, borderColor: 'red', justifyContent: 'flex-end', alignItems: 'center'}}>
                <Text style={[{marginBottom: 30, color: '#FFFFFF'}, fontSizeH3()]}>NO</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.handlePress()} activeOpacity={0.7} style={{flex: 1, borderWidth: 0, borderColor: 'red', justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.1)'}}>
                <Text style={[{marginBottom: 30, color: '#FFFFFF'}, fontSizeH3()]}>YES</Text>
              </TouchableOpacity>
            </View>

          
        </View>
                   
        )
    }
  }

const styles = StyleSheet.create({
  MainContainer:{
    flex: 1,
    alignItems: 'center',
    backgroundColor:'white',
    borderTopLeftRadius:40,
    borderTopRightRadius:40,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {
          width: 0,
          height: 50,
        },
        zIndex: 10
      },
      android: {
        elevation: 15,
      }
    }),
    shadowOpacity: 0.3,
    shadowRadius: 40,
    borderColor: 'blue',
    borderWidth: 0
  },
  button: {
    width:'90%',
    flexDirection:'row',
    justifyContent:'center',
    marginLeft:15,
    marginRight:5,
    marginBottom: 0,
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:0,
    paddingRight:0,
    backgroundColor:'#e5314e',
    borderRadius:1,
    borderWidth: 0,
    // borderColor: 'rgb(19,111,232)',
    elevation: 0,
  },
  container: {
    flex: 0,
    flexDirection:'column',
    left:'0%',
    width:wp('100%'),
    height:hp('90%'),

  },
  image:{
    top:245,
    left: 300,
    bottom:0,
    backgroundColor:'white',
    width: 10,
    height: 14,
  },
  task_list:{
    //justifyContent: 'space-around',
    margin:10,
    borderRadius: 0,
    backgroundColor:'white',
    paddingTop:0,
    paddingBottom:0,
    width:'95%',
    shadowColor: "#000",
    shadowOffset: {
    width: 0,
    height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
},
box:{
  borderWidth: 0,
  borderColor:'#c4c4c4',
  borderRadius:10,
  flexDirection: 'row',
  justifyContent: 'space-evenly',
},
boldFont: {
 ...Platform.select({
   android: {
     fontFamily: ''
   }
 }) 
}
});

export default Lead_list;
