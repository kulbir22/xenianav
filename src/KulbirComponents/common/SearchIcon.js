import React from 'react';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';

const SearchIcon = ({style, color = ['#F71A1A', '#E1721D']}) => {
    return (
        <View style={[styles.container, style]}>
            <LinearGradient 
                start={{x: 0, y: 0}} 
                end={{x:1.3, y: 0}} 
                colors={color} 
                style={styles.searchGradient}>
                <Feather name="search" size={30} color='white'/>
            </LinearGradient>
        </View>
    );
}

const styles = {
    searchGradient: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 45,
        width: 45,
        borderRadius: 5
      },
      container: {
        width: 45, 
        height: 45, 
        borderRadius: 5, 
        backgroundColor: 'orange', 
        marginTop: 45
      },
};

export {SearchIcon};