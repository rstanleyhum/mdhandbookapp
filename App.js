'use strict';

import React from 'react';
import { Provider } from 'react-redux';
import Expo, { AppLoading } from 'expo';

import store from './app/store';
import MainApp from './app/mainapp';

import { DropLocalDB, SetupLocalDB } from './app/services/localdb';
import { GetRunNumber, SaveRunNumber, ResetLastUpdateTime } from './app/services/appstorage';
import { loadLocalDBResources } from './app/actions/localdb';
import { getDataFromServer } from './app/actions/firebase';
import { LogError } from './app/services/logger';


export default class App extends React.Component {
  state = {
    isReady: false,
  };

  componentWillMount() {
    this.setup();
  }

  setup() {
    GetRunNumber()
      .then( (run_num) => {
        if (run_num == 0) {
          return Promise.all([DropLocalDB(), ResetLastUpdateTime(), SaveRunNumber(1)])
        }  
        let new_run_num = run_num + 1;
        return SaveRunNumber(new_run_num);
      })
      .then( () => {
        return SetupLocalDB()
      })
      .then( () => {
        return store.dispatch(getDataFromServer());
      })
      .then( () => {
        return store.dispatch(loadLocalDBResources());
      })
      .then( () => {
        this.setState({isReady: true});
      })
      .catch(err => {
        LogError("Error on startup: " + err);
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

