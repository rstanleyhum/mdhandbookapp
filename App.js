'use strict';

import React from 'react';
import { Provider } from 'react-redux';
import Expo, { AppLoading } from 'expo';

import store from './app/store';
import MainApp from './app/mainapp';

import { SetupAllPageResources } from './app/actions/global';



export default class App extends React.Component {
  state = {
    isReady: false,
  };

  componentWillMount() {
    this.setup();
  }

  setup() {
    Promise.all([store.dispatch(SetupAllPageResources())])
    .then(results => {
      this.setState({isReady: true});
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

