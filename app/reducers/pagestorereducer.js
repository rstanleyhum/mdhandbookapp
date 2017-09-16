'use strict';

import { UPDATE_PAGE, UPDATE_CSS, SET_LOADED, SET_LOADING } from '../actions/pagestore';


var initialState = {
    loaded: false,
    loading: false,
    sourcePages: {},
    sourceCss: "",
}


function PageStoreReducer(state = initialState, action) {
    switch(action.type) {
        case UPDATE_PAGE:
            var newSourcePages = Object.assign({}, state.sourcePages);
            newSourcePages[action.id] = action.data;
            return Object.assign({}, state, {
                sourcePages: newSourcePages
            });
        
        case UPDATE_CSS:
            return Object.assign({}, state, {
                sourceCss: action.data
            });

        case SET_LOADED:
            return Object.assign({}, state, {
                loaded: action.value
            });

        case SET_LOADING:
            return Object.assign({}, state, {
                loading: action.value
            });

        default:
            return state
    }
}

export default PageStoreReducer
