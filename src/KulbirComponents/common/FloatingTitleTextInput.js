import React, { Component } from 'react';
import { View, Animated, StyleSheet, TextInput, Text} from 'react-native';
import { string, func, object, number } from 'prop-types';
import {getMarginVertical, getWidthnHeight} from './width';
import { Keyboard } from 'react-native';

class FloatingTitleTextInputField extends Component {
  static propTypes = {
    attrName: string.isRequired,
    title: string.isRequired,
    value: string.isRequired,
    updateMasterState: func.isRequired,
    keyboardType: string,
    titleActiveSize: number, // to control size of title when field is active
    titleInActiveSize: number, // to control size of title when field is inactive
    titleActiveColor: string, // to control color of title when field is active
    titleInactiveColor: string, // to control color of title when field is active
    updateUI: string,
    valueProp: string,
    textInputStyles: object,
    containerStyle: object,
    animateTextWidth: object,
    otherTextInputProps: object,
    Border_Styling:string,
    multiline:string
  }

  
  static defaultProps = {
    keyboardType: 'default',
    titleActiveSize: 11,
    titleInActiveSize: 10,
    updateUI: 'false',
    valueProp: null,
    titleActiveColor: 'black',
    titleInactiveColor: 'dimgrey',
    textInputStyles: {}, 
    containerStyle: {},
    animateTextWidth:{},
    otherTextInputAttributes: {},
    Border_Styling:'true',
    multiline: false
  }

  constructor(props) {
    super(props);
    const { value } = this.props;
    this.position = new Animated.Value(value ? 1 : 0);
    this.state = {
      isFieldActive: false,
      activeAll: false
    }
  }
  // componentDidMount(){
  //   const {value} = this.props;
  //   console.log("VALUE: ", value, Boolean(value))
  //   if(value){
  //     this._handleFocus();
  //   }else{
  //     this._handleBlur();
  //   }
  // }

  //_handleFocus = () => {
  //  if (!this.state.isFieldActive) {
  //    this.setState({ isFieldActive: true });
  //    Animated.timing(this.position, {
  //      toValue: 1,
  //      duration: 150,
  //    }).start();
  //  }
  //}
     

  componentDidMount(){
    const {valueProp} = this.props;
    console.log("FLOATING TITLE: ", valueProp, this.props.value, this.state.isFieldActive)
    if(valueProp){
        this._handleFocus();
    }
    // else{
    //     console.log("ERASE and BLUR: ", valueProp, this.props.value, this.state.isFieldActive)
    //     this.setState({isFieldActive: true}, () => this._handleBlur())
    // }
  }

  _handleFocus = () => {
    if (!this.state.isFieldActive) {
      this.setState({ isFieldActive: true });
      Animated.timing(this.position, {
        toValue: 1,
        duration: 150,
      }).start();
    }
  }

  _handleBlur = () => {
    if (this.state.isFieldActive && !this.props.value) {
      this.setState({ isFieldActive: false });
      Animated.timing(this.position, {
        toValue: 0,
        duration: 150,
      }).start();
    }
  }

  _onChangeText = (updatedValue) => {
    const { attrName, updateMasterState } = this.props; 
    updateMasterState(attrName, updatedValue);
  }

  _returnAnimatedTitleStyles = () => {
    const { isFieldActive } = this.state;
    const {
      titleActiveColor, titleInactiveColor, titleActiveSize, titleInActiveSize, fieldPaddingLeft
    } = this.props;
    //console.log("AnimatedTitleStyles: ", activeWidth, inactiveWidth)
  
    return {
      top: this.position.interpolate({
        inputRange: [0, 1],
        outputRange: [14, 0],
      }),
      fontSize: isFieldActive ? titleActiveSize : titleInActiveSize,
      color: isFieldActive ? titleActiveColor : titleInactiveColor,
    }
  }

  render() {
    console.log("NEW TITLE WIDTH: ", this.props.titleActiveColor)
    const {titleActiveWidth, titleInactiveWidth, Border_Styling = 'true',multiline= false, updateUI = 'false', otherTextInputProps} = this.props;
    const {isFieldActive} = this.state;
    return (
      <View style = {[Styles.container, this.props.containerStyle]}>
            
            <Animated.Text
                style = {[Styles.titleStyles, this._returnAnimatedTitleStyles(), (isFieldActive && updateUI === 'true')? {position: 'relative', paddingTop: 0, paddingLeft: 10, borderRadius: 10} : Styles.titleStyles]}>
                    {this.props.title}
            </Animated.Text>
            <View>
            <TextInput
              value = {this.props.value}
              style={[(this.props.Border_Styling === 'true'? Styles.textInput: Styles.mytextInput), this.props.textInputStyles]}
              //style = {[Styles.textInput, this.props.textInputStyles]}
              underlineColorAndroid = 'transparent'
              onFocus = {this._handleFocus}
              onBlur = {this._handleBlur}
              onChangeText = {this._onChangeText}
              multiline = {multiline}
              keyboardType = {this.props.keyboardType}
              {...this.props.otherTextInputProps}
            />
            </View>
      </View>
    )
  }
}

const Styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 3,
    borderStyle: 'solid',
    borderWidth: 0,
    height: 50,
    marginVertical: 0,
  },
  textInput: {
    fontSize: 14,
    color: 'black',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    paddingLeft: 10
  },
  mytextInput: {
   color: 'black',
   borderColor: '#C4C4C4',
   borderWidth:1,
   paddingTop: 2,
   marginTop:'2%'
  },
  titleStyles: {
    position: 'absolute',
    backgroundColor: 'white',
    paddingLeft: 10,
    paddingTop: 4,
    borderColor: 'red',
    borderWidth: 0,
  }
})

export {FloatingTitleTextInputField};