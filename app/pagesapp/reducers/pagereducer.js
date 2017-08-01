'use strict';

import { PUSH_PAGE, POP_PAGE, PUSH_WEB_PAGE } from '../actions/page';

var initialState = {
    history: ['chony_picu_main'],
    sourceUrl: 'chony_picu_main',
    activeButton: false,
    title: 'chony_picu_main'
}

function PageReducer(state = initialState, action) {
    switch(action.type) {
        case PUSH_PAGE:
            var newLength = state.history.length+1;
            return Object.assign({}, state, {
                history: [
                    ...state.history,
                    action.id
                ],
                sourceUrl: action.id,
                activeButton: (newLength>1),
                title: action.id
            });
            
        case POP_PAGE:
            if (state.history.length < 2) {
                return state
            }

            var newLength = state.history.length-1;
            var active = (newLength>1);
            var prevId = state.history[newLength-1];
            var sourceUrl = prevId;
            var title = "";

            if (prevId.startsWith("http")) {
                title = "";
            } else {
                title = prevId;
            }

            return Object.assign({}, state, {
                history: state.history.slice(0, newLength),
                sourceUrl: sourceUrl,
                activeButton: active,
                title: prevId
            });

        
        case PUSH_WEB_PAGE:
            var newLength = state.history.length+1
            return Object.assign({}, state, {
                history: [
                    ...state.history,
                    action.url
                ],
                sourceUrl: action.url,
                activeButton: (newLength>1),
                title: ""
            });

        default:
            return state;
    }
}

export default PageReducer