'use strict';

import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';

import { popPage } from '../actions/page';
import MainView from './mainview';


const HEADER = '#3b5998'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: HEADER,
    }
});


class Main extends React.Component {

  static navigationOptions = ({ screenProps, navigation }) => ({
      title: "",
      headerLeft: screenProps.history.length > 1 ? <Button title={"< " + screenProps.history[screenProps.history.length-2]} onPress={ () => { navigation.dispatch(popPage()) } } /> : null
  });

  componentDidMount() {
      this.props.navigation.setParams({callback: () => console.log("Initial callback")});
  }

  render() {
    return (
        <View style={styles.container}>
            <MainView />
        </View>
    );
  }
}


export default Main