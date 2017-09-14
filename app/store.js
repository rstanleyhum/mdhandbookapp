'use strict';

import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

import { navReducer } from './appnav';
import PageReducer from './reducers/pagereducer';
import PageStoreReducer from './reducers/pagestorereducer';


const middleware = () => {
    return applyMiddleware(thunk)
}

export default createStore(
    combineReducers({
        pagesapp: PageReducer,
        pagestore: PageStoreReducer,
        nav: navReducer,
    }),
    middleware(),
)

