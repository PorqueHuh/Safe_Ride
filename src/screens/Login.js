import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, TextInput, Dimensions } from 'react-native';

import { Button } from '../components/Button';

export default class Login extends Component {
  static navigationOptions = {
      headerStyle: {
          backgroundColor: '#9D2235',
        },
  };

  state = {
    ID: '',
  };

    render() {
        return (
            <View style={styles.container}>
                <Image source={require('./img/Logo.png')} style={{flex: 1, alignSelf: 'center', height: 200, width: 200}} resizeMode="contain" />
                <TextInput style={styles.User} placeholder="Student ID" onChangeText={(value) => this.setState({ID: value})}/>
                <Button color="#ffffff" onPress={() => { this.props.navigation.navigate('App'); }}>
                    {'Login'}
                </Button>
                <View style={{flex: 1}}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9D2235',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
        flex: 0
    },
    User: {
        textAlign: 'center',
        color: '#ffffff',

    },
    buttonStyle: {
      backgroundColor: '#ffffff',
    }
});