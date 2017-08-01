'use strict';

import { setLoading, setLoaded, updatePage, updateCss } from '../pagesapp/actions/pagestore';

import { LoadAllPages, LoadAllCss } from '../pagesapp/services/pageloader';


export function SetupAllPageResources() {
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



