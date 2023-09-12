// import React, {Component} from 'react';
// import {View, Keyboard, Text, TouchableOpacity, Animated, PanResponder, ScrollView, KeyboardAvoidingView, Platform, StatusBar} from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// import {getWidthnHeight, IOS_StatusBar, InputText, getMarginTop, WaveHeader, AnimatedTextInput, fontSizeH4, getMarginHorizontal} from '../NewComponents/common';

// class MultipleInput extends Component {
//     constructor(props){
//         super(props)
//         this.state = {
//             userInput: '',
//             inputError: true,
//             textInput: '',
//             textInputError: true,
//             userInput3: '',
//             inputError3: true,
//             userInput4: '',
//             inputError4: true,
//             userInput5: '',
//             inputError5: true,
//             userInput6: '',
//             inputError6: true,
//             userInput7: '',
//             inputError7: true,
//             userInput8: '',
//             inputError8: true,
//             userInput9: '',
//             inputError9: true,
//             userInput10: '',
//             inputError10: true,
//             submit: false
//         }
//     }

//     render(){
//         const {
//             userInput, textInput, userInput3, userInput4, userInput5, userInput6, userInput7, userInput8, userInput9, userInput10, 
//             inputError, textInputError, inputError3, inputError4, inputError5, inputError6, inputError7, inputError8, inputError9, submit
//         } = this.state;
//         return (
//             <KeyboardAvoidingView style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} keyboardVerticalOffset={30} behavior={(Platform.OS === 'ios')? "padding" : null}>
//                 <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{alignItems: 'center'}}>
//                     <View style={[getMarginTop(2)]}>
//                         <AnimatedTextInput 
//                             placeholder=" First Name "
//                             placeholderColor={['#C4C4C4', '#0B8EE8']}
//                             value={userInput}
//                             slideVertical={[0, getWidthnHeight(undefined, -3.5).height]}
//                             slideHorizontal={[0, getWidthnHeight(-2).width]}
//                             placeholderScale={[1, 0.75]}
//                             autoFocus={false}
//                             onChangeText={(userInput) => this.setState({userInput: userInput.trimLeft()}, () => {
//                             console.log("###ANIMATED TEXTINPUT: ", this.state.userInput)
//                             if(this.state.userInput !== ''){
//                                 this.setState({inputError: false})
//                             }else{
//                                 this.setState({userInput: '', inputError: true}, () => Keyboard.dismiss())
//                             }
//                             })}
//                             clearText={() => this.setState({userInput: '', inputError: true})}
//                             containerColor={[(submit && inputError)? 'red' : '#C4C4C4', (submit && inputError)? 'red' : '#0B8EE8']}
//                             containerBorderWidth={[(submit && inputError)? 2 : 1, 2]}
//                             containerStyle={[{borderRadius: getWidthnHeight(1.5).width, justifyContent: 'center', borderStyle: (submit && inputError)? 'dashed' : 'solid'}, getWidthnHeight(90, 7)]}
//                             style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(80, 7), getMarginHorizontal(1.5)]}
//                             iconSize={Math.floor(getWidthnHeight(5).width)}
//                             iconColor={'grey'}
//                         />
//                     </View>
//                     <View style={[getMarginTop(2)]}>
//                         <AnimatedTextInput 
//                             placeholder=" Middle Name "
//                             placeholderColor={['#C4C4C4', '#0B8EE8']}
//                             value={textInput}
//                             slideVertical={[0, getWidthnHeight(undefined, -3.5).height]}
//                             slideHorizontal={[0, getWidthnHeight(-2).width]}
//                             placeholderScale={[1, 0.75]}
//                             autoFocus={false}
//                             onChangeText={(textInput) => this.setState({textInput: textInput.trimLeft()}, () => {
//                             console.log("ANIMATED TEXTINPUT: ", this.state.textInput)
//                             if(this.state.textInput !== ''){
//                                 this.setState({textInputError: false})
//                             }else{
//                                 this.setState({textInput: '', textInputError: true}, () => Keyboard.dismiss())
//                             }
//                             })}
//                             clearText={() => this.setState({textInput: '', textInputError: true})}
//                             containerColor={[(submit && textInputError)? 'red' : '#C4C4C4', (submit && textInputError)? 'red' : '#0B8EE8']}
//                             containerBorderWidth={[(submit && textInputError)? 2 : 1, 2]}
//                             containerStyle={[{borderRadius: getWidthnHeight(1.5).width, justifyContent: 'center', borderStyle: (submit && textInputError)? 'dashed' : 'solid'}, getWidthnHeight(90, 7)]}
//                             style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(80, 7), getMarginHorizontal(1.5)]}
//                             iconSize={Math.floor(getWidthnHeight(5).width)}
//                             iconColor={'grey'}
//                         />
//                     </View>
//                     <View style={[getMarginTop(2)]}>
//                         <AnimatedTextInput 
//                             placeholder=" Last Name "
//                             placeholderColor={['#C4C4C4', '#0B8EE8']}
//                             value={userInput3}
//                             slideVertical={[0, getWidthnHeight(undefined, -3.5).height]}
//                             slideHorizontal={[0, getWidthnHeight(-2).width]}
//                             placeholderScale={[1, 0.75]}
//                             autoFocus={false}
//                             onChangeText={(userInput) => this.setState({userInput3: userInput.trimLeft()}, () => {
//                             console.log("ANIMATED TEXTINPUT: ", this.state.userInput3)
//                             if(this.state.userInput3 !== ''){
//                                 this.setState({inputError3: false})
//                             }else{
//                                 this.setState({userInput3: '', inputError3: true}, () => Keyboard.dismiss())
//                             }
//                             })}
//                             clearText={() => this.setState({userInput3: '', inputError3: true})}
//                             containerColor={[(submit && inputError3)? 'red' : '#C4C4C4', (submit && inputError3)? 'red' : '#0B8EE8']}
//                             containerBorderWidth={[(submit && inputError3)? 2 : 1, 2]}
//                             containerStyle={[{borderRadius: getWidthnHeight(1.5).width, justifyContent: 'center', borderStyle: (submit && inputError3)? 'dashed' : 'solid'}, getWidthnHeight(90, 7)]}
//                             style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(80, 7), getMarginHorizontal(1.5)]}
//                             iconSize={Math.floor(getWidthnHeight(5).width)}
//                             iconColor={'grey'}
//                         />
//                     </View>
//                     <View style={[getMarginTop(2)]}>
//                         <AnimatedTextInput 
//                             placeholder=" Father's Name "
//                             placeholderColor={['#C4C4C4', '#0B8EE8']}
//                             value={userInput4}
//                             slideVertical={[0, getWidthnHeight(undefined, -3.5).height]}
//                             slideHorizontal={[0, getWidthnHeight(-2.5).width]}
//                             placeholderScale={[1, 0.75]}
//                             autoFocus={false}
//                             onChangeText={(userInput) => this.setState({userInput4: userInput.trimLeft()}, () => {
//                             console.log("ANIMATED TEXTINPUT: ", this.state.userInput4)
//                             if(this.state.userInput4 !== ''){
//                                 this.setState({inputError4: false})
//                             }else{
//                                 this.setState({inputError4: true})
//                             }
//                             })}
//                             clearText={() => this.setState({userInput4: '', inputError4: true})}
//                             containerColor={[(submit && inputError4)? 'red' : '#C4C4C4', (submit && inputError4)? 'red' : '#0B8EE8']}
//                             containerBorderWidth={[(submit && inputError4)? 2 : 1, 2]}
//                             containerStyle={[{borderRadius: getWidthnHeight(1.5).width, justifyContent: 'center', borderStyle: (submit && inputError4)? 'dashed' : 'solid'}, getWidthnHeight(90, 7)]}
//                             style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(80, 7), getMarginHorizontal(1.5)]}
//                             iconSize={Math.floor(getWidthnHeight(5).width)}
//                             iconColor={'grey'}
//                         />
//                     </View>
//                     <View style={[getMarginTop(2)]}>
//                         <AnimatedTextInput 
//                             placeholder=" Mother's Name "
//                             placeholderColor={['#C4C4C4', '#0B8EE8']}
//                             value={userInput5}
//                             slideVertical={[0, getWidthnHeight(undefined, -3.5).height]}
//                             slideHorizontal={[0, getWidthnHeight(-2.5).width]}
//                             placeholderScale={[1, 0.75]}
//                             autoFocus={false}
//                             onChangeText={(userInput) => this.setState({userInput5: userInput.trimLeft()}, () => {
//                             console.log("ANIMATED TEXTINPUT: ", this.state.userInput5)
//                             if(this.state.userInput5 !== ''){
//                                 this.setState({inputError5: false})
//                             }else{
//                                 this.setState({inputError5: true})
//                             }
//                             })}
//                             clearText={() => this.setState({userInput5: '', inputError5: true})}
//                             containerColor={[(submit && inputError5)? 'red' : '#C4C4C4', (submit && inputError5)? 'red' : '#0B8EE8']}
//                             containerBorderWidth={[(submit && inputError5)? 2 : 1, 2]}
//                             containerStyle={[{borderRadius: getWidthnHeight(1.5).width, justifyContent: 'center', borderStyle: (submit && inputError5)? 'dashed' : 'solid'}, getWidthnHeight(90, 7)]}
//                             style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(80, 7), getMarginHorizontal(1.5)]}
//                             iconSize={Math.floor(getWidthnHeight(5).width)}
//                             iconColor={'grey'}
//                         />
//                     </View>
//                     <View style={[getMarginTop(2)]}>
//                         <AnimatedTextInput 
//                             placeholder=" Country "
//                             placeholderColor={['#C4C4C4', '#0B8EE8']}
//                             value={userInput6}
//                             slideVertical={[0, getWidthnHeight(undefined, -3.5).height]}
//                             slideHorizontal={[0, getWidthnHeight(-1).width]}
//                             placeholderScale={[1, 0.75]}
//                             autoFocus={false}
//                             onChangeText={(userInput) => this.setState({userInput6: userInput.trimLeft()}, () => {
//                             console.log("ANIMATED TEXTINPUT: ", this.state.userInput6)
//                             if(this.state.userInput6 !== ''){
//                                 this.setState({inputError6: false})
//                             }else{
//                                 this.setState({inputError6: true})
//                             }
//                             })}
//                             clearText={() => this.setState({userInput6: '', inputError6: true}, () => Keyboard.dismiss())}
//                             containerColor={[(submit && inputError6)? 'red' : '#C4C4C4', (submit && inputError6)? 'red' : '#0B8EE8']}
//                             containerBorderWidth={[(submit && inputError6)? 2 : 1, 2]}
//                             containerStyle={[{borderRadius: getWidthnHeight(1.5).width, justifyContent: 'center', borderStyle: (submit && inputError6)? 'dashed' : 'solid'}, getWidthnHeight(90, 7)]}
//                             style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(80, 7), getMarginHorizontal(1.5)]}
//                             iconSize={Math.floor(getWidthnHeight(5).width)}
//                             iconColor={'grey'}
//                         />
//                     </View>
//                     <View style={[getMarginTop(2)]}>
//                         <AnimatedTextInput 
//                             placeholder=" State "
//                             placeholderColor={['#C4C4C4', '#0B8EE8']}
//                             value={userInput7}
//                             slideVertical={[0, getWidthnHeight(undefined, -3.5).height]}
//                             slideHorizontal={[0, getWidthnHeight(-0.5).width]}
//                             placeholderScale={[1, 0.75]}
//                             autoFocus={false}
//                             onChangeText={(userInput) => this.setState({userInput7: userInput.trimLeft()}, () => {
//                             console.log("ANIMATED TEXTINPUT: ", this.state.userInput7)
//                             if(this.state.userInput7 !== ''){
//                                 this.setState({inputError7: false})
//                             }else{
//                                 this.setState({userInput7: '', inputError7: true}, () => Keyboard.dismiss())
//                             }
//                             })}
//                             clearText={() => this.setState({userInput7: '', inputError7: true})}
//                             containerColor={[(submit && inputError7)? 'red' : '#C4C4C4', (submit && inputError7)? 'red' : '#0B8EE8']}
//                             containerBorderWidth={[(submit && inputError7)? 2 : 1, 2]}
//                             containerStyle={[{borderRadius: getWidthnHeight(1.5).width, justifyContent: 'center', borderStyle: (submit && inputError7)? 'dashed' : 'solid'}, getWidthnHeight(90, 7)]}
//                             style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(80, 7), getMarginHorizontal(1.5)]}
//                             iconSize={Math.floor(getWidthnHeight(5).width)}
//                             iconColor={'grey'}
//                         />
//                     </View>
//                     <View style={[getMarginTop(2)]}>
//                         <AnimatedTextInput 
//                             placeholder=" City "
//                             placeholderColor={['#C4C4C4', '#0B8EE8']}
//                             value={userInput8}
//                             slideVertical={[0, getWidthnHeight(undefined, -3.5).height]}
//                             slideHorizontal={[0, getWidthnHeight(-0.5).width]}
//                             placeholderScale={[1, 0.75]}
//                             autoFocus={false}
//                             onChangeText={(userInput) => this.setState({userInput8: userInput.trimLeft()}, () => {
//                             console.log("ANIMATED TEXTINPUT: ", this.state.userInput8)
//                             if(this.state.userInput8 !== ''){
//                                 this.setState({inputError8: false})
//                             }else{
//                                 this.setState({inputError8: true})
//                             }
//                             })}
//                             clearText={() => this.setState({userInput8: '', inputError8: true})}
//                             containerColor={[(submit && inputError8)? 'red' : '#C4C4C4', (submit && inputError8)? 'red' : '#0B8EE8']}
//                             containerBorderWidth={[(submit && inputError8)? 2 : 1, 2]}
//                             containerStyle={[{borderRadius: getWidthnHeight(1.5).width, justifyContent: 'center', borderStyle: (submit && inputError8)? 'dashed' : 'solid'}, getWidthnHeight(90, 7)]}
//                             style={[{borderColor: 'red', borderWidth: 0, borderRadius: 0, fontSize: (fontSizeH4().fontSize + 2)}, getWidthnHeight(80, 7), getMarginHorizontal(1.5)]}
//                             iconSize={Math.floor(getWidthnHeight(5).width)}
//                             iconColor={'grey'}
//                         />
//                     </View>
//                     <TouchableOpacity onPress={() => this.setState({userInput7: '', inputError7: true})}>
//                         <Text style={{fontSize: 30}}>Reset</Text>
//                     </TouchableOpacity>
//                 </ScrollView>
//             </KeyboardAvoidingView>
//         );
//     }
// }

// export default MultipleInput;