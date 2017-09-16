'use strict';

//
// localdb.js: This module contains the actions to load the resources from the LocalDB into memory
//

import { LogError } from '../services/logger';
import { LocalDBGetResources } from '../services/localdb';

import { setLoading, setLoaded, updateMultiplePages, updateCss } from '../actions/pagestore';


export function loadLocalDBResources() {
    return (dispatch, getState) => {
        if (getState().pagestore.loaded || getState().pagestore.loading) {
            return Promise.resolve();
        }

        dispatch(setLoading(true));
        
        return LocalDBGetResources()
            .then( results => {
                dispatch(updateMultiplePages(results.pages));
                dispatch(updateCss(results.css.data));
                dispatch(setLoaded(true));
                dispatch(setLoading(true));
            })
            .catch( err => {
                dispatch(setLoading(false));
                LogError(err);
            });
    };
};




