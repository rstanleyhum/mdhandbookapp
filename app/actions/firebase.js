'use strict';

//
// firebase.js: This module contains the actions to get data from the server and save it to the local DB
//

import { setLoading } from '../actions/pagestore';

import { LogError } from '../services/logger';
import { LocalDBSaveResources } from '../services/localdb';
import { GetNewDataFromServer } from '../services/firebase';
import { GetLastUpdateTime, SaveLastUpdateTime } from '../services/appstorage';


export function getDataFromServer() {
    return (dispatch, getState) => {
        if (getState().pagestore.loading) {
            return Promise.resolve();
        }

        dispatch(setLoading(true));

        var startUpdateTime = Date.now();

        return GetLastUpdateTime()
            .then( lasttime => {
                return GetNewDataFromServer(lasttime)              
            })
            .then( results => {
                var newPages = results.pages;
                var newCss = results.css;
                return LocalDBSaveResources(newPages, newCss);
            })
            .then( () => {
                return SaveLastUpdateTime(startUpdateTime);
            })
            .then( () => {
                dispatch(setLoading(false));
            })
            .catch( err => {
                LogError(err);
                dispatch(setLoading(false));
            });
    };
};


