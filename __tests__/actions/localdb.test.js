'use strict';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { LocalDBGetResources } from '../../app/services/localdb';
jest.mock('../../app/services/localdb', () => ({ LocalDBGetResources: jest.fn() }));

import { LogError } from '../../app/services/logger';
jest.mock('../../app/services/logger', () => ({ LogError: jest.fn() }));

import { loadLocalDBResources } from '../../app/actions/localdb';


const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Local DB Actions testing', () => {

    it('loadLocalDBResources when all is good', () => {
        LocalDBGetResources.mockImplementation(() => Promise.resolve(
            {
                pages: [
                    { name: 'name01a', data: 'name01adata' },
                    { name: 'name02a', data: 'name02adata' }
                ],
                css: {
                    data: "data"
                }
            }
        ));

        const store = mockStore({ pagestore: { loaded: false, loading: false }});
        const expectedActions = [
            'SET_LOADING',
            'UPDATE_PAGE',
            'UPDATE_PAGE',
            'UPDATE_CSS',
            'SET_LOADED',
            'SET_LOADING'
        ];

        return store.dispatch(loadLocalDBResources())
            .then( () => {
                const actualActions = store.getActions().map(action => action.type);
                expect(actualActions).toEqual(expectedActions);
                expect(LocalDBGetResources).toHaveBeenCalled();
                LocalDBGetResources.mockClear();
                LogError.mockClear();
            })
    });


    it('loadLocalDBResources when error in LocalDBGetResources', () => {
        const err = "error msg";
        LocalDBGetResources.mockImplementation(() => Promise.reject(err));

        const store = mockStore({ pagestore: { loaded: false, loading: false }});
        const expectedActions = [
            'SET_LOADING',
            'SET_LOADING'
        ];
        return store.dispatch(loadLocalDBResources())
            .then( () => {
                const actualActions = store.getActions().map(action => action.type);
                expect(actualActions).toEqual(expectedActions);
                expect(LogError).toHaveBeenCalledWith(err);
                LocalDBGetResources.mockClear();
                LogError.mockClear();
            })
    });


    it('loadLocalDBResources test if blocked when loaded', () => {
        const store = mockStore({ pagestore: { loaded: true, loading: false }});
        const expectedActions = [];
        
        return store.dispatch(loadLocalDBResources())
            .then( () => {
                const actualActions = store.getActions().map(action => action.type);
                expect(actualActions).toEqual(expectedActions);
                expect(LocalDBGetResources).not.toHaveBeenCalled();
                expect(LogError).not.toHaveBeenCalled();
                LocalDBGetResources.mockClear();
                LogError.mockClear();        
            });
    });


    it('loadLocalDBResources test if blocked when loading', () => {
        const store = mockStore({ pagestore: { loaded: true, loading: false }});
        const expectedActions = [];

        return store.dispatch(loadLocalDBResources())
            .then( () => {
                const actualActions = store.getActions().map(action => action.type);
                expect(actualActions).toEqual(expectedActions);
                expect(LocalDBGetResources).not.toHaveBeenCalled();
                expect(LogError).not.toHaveBeenCalled();
                LocalDBGetResources.mockClear();
                LogError.mockClear();               
            });
    });


})