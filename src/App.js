import React, { Component } from 'react';
import RootNavigator from './navigators/RootNavigator';
import firebase from 'firebase';
import 'firebase/firestore';

export default class App extends Component {

  // Initialize Firebase
componentWillMount() {
  const settings = { timestampsInSnapshots: true };

  const config = {
  apiKey: "AIzaSyBRo4js_I1GWQhYM7tH_Ru-tAG5Tyx7-gQ",
  authDomain: "saferide-c024a.firebaseapp.com",
  databaseURL: "https://saferide-c024a.firebaseio.com",
  projectId: "saferide-c024a",
  storageBucket: "saferide-c024a.appspot.com",
  messagingSenderId: "166980960789"
  };

  firebase.initializeApp(config);

  firebase.firestore().settings(settings);
}
  render() {
    return (
      <RootNavigator />
    );
  }
}
