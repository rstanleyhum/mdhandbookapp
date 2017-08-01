'use strict';

import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

import { navReducer } from './appnav';
import PageReducer from './pagesapp/reducers/pagereducer';
import PageStoreReducer from './pagesapp/reducers/pagestorereducer';


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

