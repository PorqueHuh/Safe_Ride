import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Button } from '../components/Button';
import MapView from 'react-native-maps'; //"npm install --save react-native-maps"
import Dialog from 'react-native-dialog'; //"npm install --save react-native-dialog"



export default class HomeScreen extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            latitude : null,
            longitude : null,
            error: null,
            //The state for button
            dialogVisible: false,
        };
    }
    static navigationOptions = {
        title: 'Safe Ride',
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
    //Next 5 methods are interactions for buttons
    showDialog = () => {
        this.setState({dialogVisible: true});
    };

    hideDialog = () => {
        this.setState({dialogVisible: false});
    };

    handleYes = () => {
        this.setState({ dialogVisible: false});
    };

    handleNo = () => {
        this.setState({dialogVisible: false});
    };

    handleUpdate = () => {
        this.setState({dialogVisible: false});
    };

    render() {
    return (
        <View style={{flex:1, backgroundColor: '#f3f3f3'}}>
            //MapView renders the map
            <MapView style={styles.map} initialRegion={{
            latitude:36.0729399,
            longitude:-94.165265,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1
            }}>
              
            {!!this.state.latitude && !!this.state.longitude && <MapView.Marker
            coordinate={{  "latitude":this.state.latitude,
                            "longitude":this.state.longitude}}
            title={"Your Location"}
            />}

            </MapView>
        
            /This renders the button
            <View>
                <TouchableOpacity style = {styles.button} onPress={this.showDialog}>
                <Text>Confirm</Text>
                </TouchableOpacity>
                <Dialog.Container visible={this.state.dialogVisible}>
                <Dialog.Title>Confirm Destination</Dialog.Title>
                <Dialog.Description>Destination is correct?</Dialog.Description>
                <Dialog.Button label="Yes" onPress={this.handleYes} />
                <Dialog.Button label="No" onPress={this.handleNo} />
                <Dialog.Button label="Update" onPress={this.handleUpdate} />
                </Dialog.Container>
            </View>
        </View>
    );
    }
}

//The styles for elements
const styles = {
    map: {
        height: 100,
        flex: 1,
        zIndex: -1,
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
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    button: {
        fontSize: 12,
        alignItems: 'center',
        width: 400,
        height: 40,
        backgroundColor: 'transparent',
    },
}