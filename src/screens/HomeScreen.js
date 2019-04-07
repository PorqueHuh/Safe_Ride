import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import MapView from 'react-native-maps';



export default class HomeScreen extends Component {
    static navigationOptions = {
        title: 'Home',
        headerStyle: {
            backgroundColor: 'red',
          },
        headerTintColor: '#F2F2F2',
        headerTitleStyle: {
            flex: 1,
            fontWeight: 'bold',
            textAlign: 'center'
        },
    };

    render() {
        /*return (
        <View style={styles.container}>
            <Text>Welcome user!</Text>
            <Text>What do you want to do?</Text>
        </View>
        );*/
        return <MapView style = {styles.map}
            initialRegion = {{
                latitude: 13.139238380834923,
                longitude: 80.25188422300266,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
                }}/>;
    }
}
const styles = {
    map: {
        height: 100,
        flex: 1
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    textStyle: {
        alignSelf: 'center',
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        paddingTop: 10,
        paddingBottom: 10
    },
    buttonView: {
 
        flexDirection: 'row',

    },
    managerButtonView: {
        justifyContent: 'flex-end',
    }
}