import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Button } from '../components/Button';
import MapView from 'react-native-maps'; //"npm install --save react-native-maps"
import Dialog from 'react-native-dialog'; //"npm install --save react-native-dialog"
import firebase from 'firebase'; //npm install firebase@5.0.3 --save
import 'firebase/firestore';



export default class HomeScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            latitude : null,
            longitude : null,
            error: null,
            dialogVisible: false,
            ADA: false,
            comment: '',
            guest: '',
            id: '123456789',
            location: 'Grove Street',
            name: 'Carl Johnson',
            phone: '4790001122',
            confirmButton: true
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

        const firestore = firebase.firestore()
        const settings = {timestampsInSnapshots: true};
        firestore.settings(settings);

        const request = [];

        firestore.collection('test').where('id', '==', this.state.id).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const { name, id, guest, comment, location } = doc.data();

                request.push({
                    key: doc.id,
                    doc,
                    name,
                    id,
                    guest,
                    comment,
                    location
                });
            });
            console.log("Request: " +doc.date());
        }).catch((error) => {
            console.log('Doc doesnt exist, creating one');
            firestore.collection('test').add({
                id: this.state.id,
            }).then(function() {
                console.log('New doc sucessfully created');
            });
        });


    navigator.geolocation.getCurrentPosition(
       (position) => {
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
        this.sendRequest();
        this.setState({ dialogVisible: false});
    };

    handleNo = () => {
        this.setState({dialogVisible: false});
    };

    sendRequest = () => {
        const firestore = firebase.firestore();
        firestore.collection('test').where('id', '==', this.state.id).get().then((snapshot) => {
            snapshot.forEach((doc) => {
                if(doc.data().id === this.state.id) {
                    firestore.doc('test/' + doc.id).set({
                        ADA: this.state.ADA,
                        comment: this.state.comment,
                        guests: this.state.guest,
                        id: this.state.id,
                        location: this.state.location,
                        name: this.state.name,
                        phone: this.state.phone
                    }).then(function() {
                        console.log('Successful Request');
                    });
                }
            });
        });
        this.setState({cancel: true})

    }

    renderConfirmButton = (props) => {
        return (
            <View>
                <TouchableOpacity style = {styles.button} onPress={this.showDialog}>
                <Text>Confirm</Text>
                </TouchableOpacity>
                <Dialog.Container visible={this.state.dialogVisible}>
                <Dialog.Title>Confirm Destination</Dialog.Title>
                <Dialog.Description>Destination is correct?</Dialog.Description>
                <Text>{this.state.address}</Text>
                <Dialog.Button label="Yes" onPress={this.handleYes} />
                <Dialog.Button label="No" onPress={this.handleNo} />
                <Dialog.Input label="Number of guest" onChangeText={(guest) => this.setState({guest: guest})} />
                <Dialog.Input label="Additional comments" onChangeText={(comment) => this.setState({comment: comment})} />
                </Dialog.Container>
            </View>
        )
    }

    renderCancelButton = (props) => {
        return (
            <View>
                <TouchableOpacity style = {styles.button} onPress={this.showDialog}>
                <Text>Cancel Request</Text>
                </TouchableOpacity>
                <Dialog.Container visible={this.state.dialogVisible}>
                <Dialog.Description>Are you sure you want to cancel the request?</Dialog.Description>
                <Dialog.Button label="Yes" onPress={this.cancelRequest} />
                <Dialog.Button label="No" onPress={this.handleNo} />
                </Dialog.Container>
            </View>
        )
    }
    


    render() {
    return (
        <View style={{flex:1, backgroundColor: '#f3f3f3'}}>
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
                {this.renderConfirmButton()}
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
