import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import MapView from 'react-native-maps';



export default class HomeScreen extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            latitude : null,
            longitude : null,
            error: null,
        };
    }
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

    componentDidMount() {
    navigator.geolocation.getCurrentPosition(
       (position) => {
         console.log("test");
         console.log(position);
         this.setState({
           latitude: position.coords.latitude,
           longitude: position.coords.longitude,
           error: null,
         });
        },
        (error) => this.setState({ error: error.message }),
        { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
        );
    }
    render() {
    return (
      <MapView style={styles.map} initialRegion={{
       latitude:36.0729399,
       longitude:-94.165265,
       latitudeDelta: 0.5,
       longitudeDelta: 0.5
      }}>
      
      {!!this.state.latitude && !!this.state.longitude && <MapView.Marker
         coordinate={{  "latitude":this.state.latitude,
                        "longitude":this.state.longitude}}
         title={"Your Location"}
       />}

       </MapView>
      );
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