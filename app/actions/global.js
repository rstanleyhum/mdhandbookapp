'use strict';

import { setLoading, setLoaded, updatePage, updateCss } from '../actions/pagestore';

import { LoadAllPages, LoadAllCss } from '../services/pageloader';
import { SaveAll, GetAllPages, GetAllCss } from '../services/localdb';


export function setupAllPageResources() {
    return (dispatch, getState) => {
        if (getState().pagestore.loaded || getState().pagestore.loading) {
            return
        }

        dispatch(setLoading(true));

        return Promise.all([LoadAllPages(), LoadAllCss()])
                .then( results => {
                    let pageresults = results[0]
                    for (var i = 0; i < pageresults.length; i++) {
                        dispatch(updatePage(pageresults[i].name, pageresults[i].data));
                    }
                    let cssresults = results[1]
                    for (var i = 0; i < cssresults.length; i++) {
                        dispatch(updateCss(cssresults[i].data));
                    }
                    dispatch(setLoaded(true));
                    dispatch(setLoading(false));
                })
                .catch( (err) => {
                    console.log(err);
                });
    };
};


export function saveAllPageResources() {
    return (dispatch, getState) => {
        return SaveAll(getState().pagestore.sourcePages, getState().pagestore.sourceCss)
                .then( result => {
                    return result;
                })
                .catch( error => {
                    console.log("Saving: error: " + error);
                });
    };
};


export function loadAllPageResources() {
    return (dispatch, getState) => {
        return GetAllPages()
                .then(json_str => {
                    if (json_str == null) {
                        return Promise.reject(false);
                    }
                    var pages = JSON.parse(json_str);
                    for (var k in pages) {
                        dispatch(updatePage(k, pages[k]));
                    }
                    return GetAllCss();
                })
                .then(json_str => {
                    if (json_str == null) {
                        return false;
                    }

                    var csstext = JSON.parse(json_str);
                    dispatch(updateCss(csstext));
                    return true;
                })
                .catch( (err) => {
                    return false;
                    console.log(err);
                });
    };
};



