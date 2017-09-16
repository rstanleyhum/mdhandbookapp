'use strict';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';


import { 
    UPDATE_PAGE, UPDATE_CSS, SET_LOADED, SET_LOADING,
    updatePage, updateCss, setLoaded, setLoading,
    updateMultiplePages
} from '../../app/actions/pagestore';



const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Page Store Actions Test', () => {
    
    it('updatePage has a type, id and pagedata', () => {
        let id = 'id';
        let data = 'data';
        let action = updatePage(id, data);
        expect(action.type).toBe(UPDATE_PAGE);
        expect(action.id).toBe(id);
        expect(action.data).toBe(data);
    });

    it('updateCss has type and data', () => {
        let data = 'data';
        let action = updateCss(data);
        expect(action.type).toBe(UPDATE_CSS);
        expect(action.data).toBe(data);
    });

    it('setLoaded has a type and a value and the value is a boolean', () => {
        let value = true;
        let action = setLoaded(value);
        expect(action.type).toBe(SET_LOADED);
        expect(action.value).toBe(value);
        expect(typeof action.value).toBe('boolean');
    });

    it('setLoading has a type and value and the value is a boolean', () => {
        let value = true;
        let action = setLoading(value);
        expect(action.type).toBe(SET_LOADING);
        expect(action.value).toBe(value);
        expect(typeof action.value).toBe('boolean');
    });

    it('updateMultiplePages creates multiple updatePage actions', () => {
        const store = mockStore({}); 
        const pagesdata = [
            { name: 'name01', data: 'name01data' },
            { name: 'name02', data: 'name02data' },
            { name: 'name03', data: 'name03data' }
        ];
        const expectedActions = [
            { type: UPDATE_PAGE, id: 'name01', data: 'name01data' },
            { type: UPDATE_PAGE, id: 'name02', data: 'name02data' },
            { type: UPDATE_PAGE, id: 'name03', data: 'name03data' }
        ];

        store.dispatch(updateMultiplePages(pagesdata));
        
        const actualActions = store.getActions().map(action => action)
        expect(actualActions).toEqual(expectedActions);
    });

    it('updateMultiplePages sends no actions with an empty pagesdata', () => {
        const store = mockStore({});
        const pagesdata = [];
        const expectedActions = [];

        store.dispatch(updateMultiplePages(pagesdata));
        const actualActions = store.getActions().map(action => action);
        expect(actualActions).toEqual(expectedActions);
    });

})

