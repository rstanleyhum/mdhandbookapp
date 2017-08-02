'use strict';

import React from 'react';
import { Provider } from 'react-redux';
import Expo, { AppLoading } from 'expo';

import store from './app/store';
import MainApp from './app/mainapp';

import { setupAllPageResources, saveAllPageResources, loadAllPageResources } from './app/actions/global';
import { SetupLocalDB } from './app/services/localdb';


export default class App extends React.Component {
  state = {
    isReady: false,
  };

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

