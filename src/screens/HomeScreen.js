import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Button } from '../components/Button';
import MapView from 'react-native-maps';
import Dialog from 'react-native-dialog';
import firebase from 'firebase';
import 'firebase/firestore';


export default class HomeScreen extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            latitude : null,
            longitude : null,
            error: null,
            dialogConfirmVisible: false,
            dialogCareVisible: false,
            confirmButton: true,
            ADA: false,
            comment: '',
            accepted: 'pending',
            guest: '',
            id: '123456789',
            location: 'Grove Street',
            name: 'Carl Johnson',
            phone: '4790001122',
            reason: 'NON',
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
            zIndex: -0.5,
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
    }
    showDialogConfirm = () => {
        this.setState({dialogConfirmVisible: true});
    };

    showCareCard = () => {
        this.setState({dialogCareVisible: true});
    };

    handleOK = () => {
        this.setState({dialogCareVisible:false});
    }

    hideDialog = () => {
        this.setState({dialogConfirmVisible: false});
    };

    handleYes = () => {
        this.sendRequest();
        this.setState({ dialogConfirmVisible: false});
    };

    handleNo = () => {
        this.setState({dialogConfirmVisible: false});
    };

    handleUpdate = () => {
        this.setState({dialogConfirmVisible: false});
    };

    sendRequest = () => {
        const firestore = firebase.firestore();
        firestore.collection('test').where('id', '==', this.state.id).get().then((snapshot) => {
            snapshot.forEach((doc) => {
                if(doc.data().id === this.state.id) {
                    firestore.doc('test/' + doc.id).set({
                        ADA: this.state.ADA,
                        accepted: this.state.accepted,
                        comment: this.state.comment,
                        guests: this.state.guest,
                        id: this.state.id,
                        location: this.state.location,
                        name: this.state.name,
                        reason: this.state.reason,
                        phone: this.state.phone
                    }).then(function() {
                        console.log('Successful Request');
                    });
                }
            });
        });
        this.setState({cancel: true})

    };

    cancelRequest = () => {
        const firestore = firebase.firestore();
        firestore.collection('test').doc(this.state.id).delete().then(function() {
            console.log("Request deleted");
        }).catch(function(error) {
            console.log("Error canceling request: " +error)
        });
        this.hideDialog();
    };
    confirmRequest = () => {
        {this.handleYes()}
        alert("You have successfully requested a ride")
    };

    renderConfirmButton = (props) => {
        return (
            <View>
                <TouchableOpacity style = {styles.button1} onPress={this.showDialogConfirm}>
                <Text>Request</Text>
                </TouchableOpacity>
                <Dialog.Container visible={this.state.dialogConfirmVisible}>
                <Dialog.Title>Confirm Destination</Dialog.Title>
                <Dialog.Description>Destination is correct?</Dialog.Description>
                <Text>{this.state.address}</Text>
                <Dialog.Button label="Yes" onPress = {this.confirmRequest} />
                <Dialog.Button label="No" onPress={this.handleNo} />
                <Dialog.Input label="Number of guest" onChangeText={(guest) => this.setState({guest: guest})} />
                <Dialog.Input label="Additional comments" onChangeText={(comment) => this.setState({comment: comment})} />
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

    renderCareCard = (props) => {
        return (
        <View>
            <TouchableOpacity style = {styles.button2} onPress = {this.showCareCard}>
                <Text>Care Card</Text>
                </TouchableOpacity>
                <Dialog.Container visible = {this.state.dialogCareVisible}>
                <Dialog.Title>Care Card</Dialog.Title>
                <Dialog.Description>
                    <Text>SAFE Ride  479-575-7233{"\n"}
                    UAPD  479-575-2222{"\n"}
                    Health Center 479-575-4451{"\n"}
                    Mental Health Crisis 479-575-5276</Text>
                </Dialog.Description>
                <Dialog.Button label = 'OK' onPress = {this.handleOK} />
                </Dialog.Container>
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
    button1: {
        fontSize: 12,
        alignItems: 'center',
        backgroundColor: 'skyblue',
        color: 'white',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        width: "100%",
        height: 30
    },
    bottom: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 36,
    },
    button2: {
        backgroundColor: 'white',
        color: 'black',
        fontSize: 12,
        alignItems: 'center',
        width: '20%',
        justifyContent: 'center',
        height: 30,
        position: 'absolute',
        zIndex: 0,
        top: -650,
        right: 5,
    },
}