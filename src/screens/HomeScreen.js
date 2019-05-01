import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
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
            id: '',
            location: '',
            name: '',
            homeAddress: '',
            phone: '',
            confirmButton: true,
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
        console.log(this.props.navigation.getParam('ID', 'noID'));
        var self = this;


        const db = firebase.firestore();
        const studentRef = db.collection('students').doc(this.props.navigation.state.params.ID);
        studentRef.get().then(function(doc) {
            if(doc.exists) {
                console.log("Name"+doc.data().name);
                found = true;
                
                self.setState({
                    name: doc.data().name,
                    phone: doc.data().phone,
                    homeAddress: doc.data().Address
                })
                
            } else {
                console.log("No student exist");
                return;
            }
        }).then(function(string) {
            console.log(found);
        });

        const request = [];
        firestore.collection('test').where('id', '==', this.props.navigation.state.params.ID).get().then((querySnapshot) => {
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
            console.log("Request: " +doc.data());
        }).catch((error) => {
            console.log('Doc doesnt exist, creating one');
            firestore.collection('test').doc(this.props.navigation.state.params.ID).set({
                id: this.props.navigation.state.params.ID,
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
        firestore.collection('test').where('id', '==', this.props.navigation.state.params.ID).get().then((snapshot) => {
            snapshot.forEach((doc) => {
                if(doc.data().id === this.props.navigation.state.params.ID) {
                    firestore.doc('test/' + doc.id).set({
                        ADA: this.state.ADA,
                        comment: this.state.comment,
                        guests: this.state.guest,
                        id: this.props.navigation.state.params.ID,
                        location: this.state.location,
                        name: this.state.name,
                        phone: this.state.phone,
                        homeAddress: this.state.homeAddress,
                        accepted: 'pending',
                        reason: ''
                    }).then(function() {
                        console.log('Successful Request');
                    });
                }
            });
        });
        this.setState({confirmButton: false });
    }

    renderConfirmButton = (props) => {
        return (
            <View>
                <TouchableOpacity style = {styles.button} onPress={this.showDialog}>
                <Text>Confirm Request</Text>
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

    cancelRequest = () => {
        const firestore = firebase.firestore();
        firestore.collection('test').doc(this.state.id).delete().then(function() {
            console.log("Request deleted");
        }).catch(function(error) {
            console.log("Error canceling request: " +error)
        });
        this.hideDialog();

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

    renderMapView = (props) => {
        return (
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
            )
    }
    


    render() {
        if(this.state.confirmButton) {
    return (
        <View style={{flex:1, backgroundColor: '#f3f3f3'}}>
            {this.renderMapView()}
            {this.renderConfirmButton()}
        </View>
    );
        } else {
        return (
            <View style={{flex:1, backgroundColor: '#f3f3f3'}}>
            {this.renderMapView()}
            {this.renderCancelButton()}
        </View>
        );
        }
    }
}
//The styles for elements
const styles = {
    map: {
        height: 100,
        flex: 1,
        zIndex: -1,
    },
    button: {
        fontSize: 12,
        alignItems: 'center',
        width: 400,
        height: 40,
        backgroundColor: 'transparent',
    },
}
