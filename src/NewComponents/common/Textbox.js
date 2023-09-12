import React from 'react';
import {View, Text, Image,TouchableOpacity, Platform} from 'react-native';
import {getMarginTop, getMarginLeft, fontSizeH3, fontSizeH4, getWidthnHeight} from './width';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome5';

const Textbox = ({
    textboxtitle,
    textinputdata, 
    inputbgStyle,
    boxcontainerStyle,
    textboxplaceholder,
    textboxvalue,
    iconbgColor,
    iconname,
    iconsize,
    iconcolor,
}) => {
    return (            
        <View>
            <View style = {[{borderColor: 'red', borderWidth: 0, alignItems: 'center'},getWidthnHeight(40), getMarginTop(1.5)]}>
                <View style={[getWidthnHeight(35, 7), styles.box, boxcontainerStyle]}>
                    <View style={[{flexDirection:'row', justifyContent: 'space-evenly', alignItems: 'center'}, getWidthnHeight(30, 7)]}>    
                        <View style={[{
                            borderWidth:0, borderColor: 'black', backgroundColor:'#DBE8F8', justifyContent:'center', width: getWidthnHeight(10).width, 
                            height: getWidthnHeight(10).width, borderRadius: getWidthnHeight(10).width}, iconbgColor]}>
                            <View style={[{alignItems:'center'}]}>   
                                <FontAwesomeIcons name={iconname} size={iconsize} color={iconcolor}/>
                            </View> 
                        </View>    
                        <View>
                            <Text style = {[{color:'#FFFEFF', fontWeight:'600'},fontSizeH4(), styles.boldFont]}>{textboxplaceholder}</Text>
                            <Text style = {[{color:'#FFFEFF', fontWeight:'bold'},fontSizeH4(), styles.boldFont]}>{textboxvalue}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = {
box:{
    left:0,
    borderRadius:10,
    }, 
boldFont: {
    ...Platform.select({
        android: {
            fontFamily: ''
        }
    })
}
};

export {Textbox};