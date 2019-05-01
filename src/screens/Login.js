import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, TextInput, Dimensions, Alert } from 'react-native';
import firebase from 'firebase';
import 'firebase/firestore';
import { Button } from '../components/Button';
import { Spinner } from '../components/Spinner';

export default class Login extends Component {
  static navigationOptions = {
      headerStyle: {
          backgroundColor: '#9D2235',
        },
  };

  constructor(props) {
      super(props);
      this.checkIfStudentExist = this.checkIfStudentExist.bind(this);
      this.loginToApp = this.loginToApp.bind(this);

      this.state = {
            ID: '',
            loading: true,
            login: false
      }
  }

  checkIfStudentExist = ()  => {
    const db = firebase.firestore();
    var found = false;
    var self = this;
    
    console.log("found" +found);
    if(this.state.ID == ''){
        alert("Please enter ID");
        return;
    }
    const studentRef = db.collection('students').doc(this.state.ID);
    studentRef.get().then(function(doc) {
        if(doc.exists) {
            console.log(doc.data());
            found = true;
            {self.loginToApp()}
            
        } else {
            console.log("No student exist");
            alert("Incorrect ID");
            return;
        }
    }).then(function(string) {
        console.log(found);
    });

  }



  loginToApp = () => {
    console.log('Login in');
    this.props.navigation.navigate('HomeScreen', {ID: this.state.ID});
  }

    render() {
        return (
            <View style={styles.container}>
                <Image source={require('./img/Logo.png')} style={{flex: 1, alignSelf: 'center', height: 200, width: 200}} resizeMode="contain" />
                <TextInput style={styles.User} placeholder="Student ID" onChangeText={(value) => this.setState({ID: value})}/>
                <Button color="#ffffff" onPress={() => { this.checkIfStudentExist();}}>
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
    User: {
        textAlign: 'center',
        color: '#ffffff',

    },
    buttonStyle: {
      backgroundColor: '#ffffff',
    }
});
