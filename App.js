'use strict';

import React from 'react';
import { AppState } from 'react-native';
import { Provider } from 'react-redux';
import Expo, { AppLoading } from 'expo';

import store from './app/store';
import MainApp from './app/mainapp';

import { setupAllPageResources, saveAllPageResources, loadAllPageResources } from './app/actions/global';
import { SetupLocalDB } from './app/services/localdb';


export default class App extends React.Component {
  state = {
    isReady: false,
    appState: AppState.currentState
  };

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    console.log("LOG: App DidMount");
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    console.log("LOG: " + nextAppState);
    this.setState({appState: nextAppState});
  }

  componentWillMount() {
    this.setup();
  }

  setup() {
    SetupLocalDB()
    .then( result => {
      return store.dispatch(loadAllPageResources())
    })
    .then(success => {
      if (success) {
        this.setState({isReady: true});
        return Promise.resolve(true);
      } else {
        return Promise.all([store.dispatch(setupAllPageResources())]);
      }
    })
    .then(results => {
      
      this.setState({isReady: true});
      
      if (typeof results != "boolean") {
        store.dispatch(saveAllPageResources());
      }
    })
    .catch(err => {
      console.log("Error on startup: " + err);
    });
  }

  render() {
    if(!this.state.isReady) {
      return <AppLoading />;
    }

    return (
      <Provider store={ store }>
        <MainApp />
      </Provider>
    );
  }
}

