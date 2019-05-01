import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps'; //"npm install --save react-native-maps"
import Dialog from 'react-native-dialog'; //"npm install --save react-native-dialog"
import firebase from 'firebase'; //npm install firebase@5.0.3 --save
import 'firebase/firestore';
import Geocoder from 'react-native-geocoder';



export default class HomeScreen extends Component {
    constructor(props){
        super(props);
        // const {navigation} = this.props;
        nID = this.props.navigation.state.params.nID;
        this.state = {
            latitude : null,
            longitude : null,
            error: null,
            dialogConfirmVisible: false,
            dialogCareVisible: false,
            ADA: false,
            comment: '',
            guest: '',
            id: nID,
            location: '',
            name: 'Carl Johnson',
            phone: '4790001122',
            reason: 'NON',
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

        var self = this;
        const db = firebase.firestore()
        const studentRef = db.collection('students').doc(this.state.id);
        studentRef.get().then(function(doc) {
        if(doc.exists) {
            found = true;
            self.setState ({
                name: doc.data().name,
                phone: doc.data().phone,
            })
        } else {
            return;
        }
        }).then(function(string) {
            console.log(found);
        });
        const request = [];
//this.state.id
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
            console.log("Request: " +doc.data());
        }).catch((error) => {
            console.log('Doc doesnt exist, creating one');
            firestore.collection('test').doc(this.state.id).set({
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
    

    showConfirmDialog = () => {
        this.setState({dialogConfirmVisible: true});
    };

    showCareCard = () => {
        this.setState({dialogCareVisible: true});
    };

    hideConfirmDialog = () => {
        this.setState({dialogConfirmVisible: false});
    };

    handleYes = () => {
        var pos = {
            lat: this.state.latitude,
            lng: this.state.longitude
        };
        Geocoder.geocodePosition(pos).then(res => {
        this.setState({location: res[0].formattedAddress})
        });
        this.sendRequest();
        this.setState({ dialogConfirmVisible: false});
    };

    handleNo = () => {
        this.setState({dialogConfirmVisible: false});
    };
    handleOK = () => {
        this.setState({dialogCareVisible:false});
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
                        phone: this.state.phone,
                        accepted: 'pending',
                        reason: this.state.reason,
                    }).then(function() {
                        console.log('Successful Request');   
                    });
                }
            });
        });
        alert("You have successfully requested a ride");
        this.setState({confirmButton: false });
    }

    renderConfirmButton = (props) => {
        return (
            <View>
                <TouchableOpacity style = {styles.button1} onPress={this.showConfirmDialog}>
                <Text>Request</Text>
                </TouchableOpacity>
                <Dialog.Container visible={this.state.dialogConfirmVisible}>
                <Dialog.Title>Confirm Destination</Dialog.Title>
                <Dialog.Description>Destination is correct?</Dialog.Description>
                <Dialog.Description>{this.state.location}</Dialog.Description>
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
        this.hideConfirmDialog();
        this.setState({confirmButton: true });
        alert("You have cancelled your request");
    }


    renderCancelButton = (props) => {
        return (
            <View>
                <TouchableOpacity style = {styles.button1} onPress={this.showConfirmDialog}>
                <Text>Cancel Request</Text>
                </TouchableOpacity>
                <Dialog.Container visible={this.state.dialogConfirmVisible}>
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
        </View>
        )
}
    


    render() {
        
        if(this.state.confirmButton) {
    return (
        <View style={{flex:1, backgroundColor: '#f3f3f3'}}>
            {this.renderMapView()}
            {this.renderConfirmButton()}
            <View>
            {this.renderCareCard()}
            </View>
        </View>
    );
        } else {
        return (
            <View style={{flex:1, backgroundColor: '#f3f3f3'}}>
            {this.renderMapView()}
            <View>
            {this.renderCareCard()}
            </View>
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