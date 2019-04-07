import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const Button = ({ onPress, children }) => {
    const { buttonStyle, textStyle } = styles;

    return (
        <TouchableOpacity onPress={onPress} style={buttonStyle}>
            <Text style={textStyle}>
                {children}
            </Text>
        </TouchableOpacity>
    );
};

const styles = {
    textStyle: {
        alignSelf: 'center',
        color: '#9D2235',
        fontSize: 12,
        fontWeight: 'bold',
        paddingTop: 10,
        paddingBottom: 10
    },
    buttonStyle: {
        alignSelf: 'stretch',
        height: 35,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: 'black',
        marginLeft: 5,
        marginRight: 5,
        backgroundColor: '#ffffff',
    }
};

export { Button };
