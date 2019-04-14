import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Button } from '../components/Button';
import Dialog from "react-native-dialog";


export default class HomeScreen extends Component {
state = {
    dialogVisible: false,
};

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

    showDialog = () => {
        this.setState({ dialogVisible: true });
    };

    hideDialog = () => {
        this.setState({ dialogVisible: false})
    };

    handleYes = () => {
        this.setState({ dialogVisible: false });
    };

    handleNo = () => {
        this.setState({ dialogVisible: false});
    };
    handleUpdate = () => {
        this.setState({ dialogVisible: false });
    };

    render() {
        return (
        <View style={styles.container}>
            <View>
                <Text>Welcome user!</Text>
                <Text>What do you want to do?</Text>
            </View>
            <View>
                <TouchableOpacity onPress={this.showDialog}>
                    <Text>Confirm</Text>
                </TouchableOpacity>
                <Dialog.Container visible={this.state.dialogVisible}>
        <Dialog.Title>Confirm Destination</Dialog.Title>
        <Dialog.Description>Destination is correct?.</Dialog.Description>
        <Dialog.Button label="Yes" onPress={this.handleYes} />
        <Dialog.Button label="No" onPress={this.handleNo} />
        <Dialog.Button label="Update" onPress={this.handleUpdate} />
    </Dialog.Container>
        </View>
        </View>
        );
    }
}

const styles = {
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