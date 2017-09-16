'use strict';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { GetLastUpdateTime, SaveLastUpdateTime } from '../../app/services/appstorage';
jest.mock('../../app/services/appstorage', () => ({ 
    GetLastUpdateTime: jest.fn(), SaveLastUpdateTime: jest.fn()
}));

import { LocalDBSaveResources } from '../../app/services/localdb';
jest.mock('../../app/services/localdb', () => ({ LocalDBSaveResources: jest.fn() }));

import { LogError } from '../../app/services/logger';
jest.mock('../../app/services/logger', () => ({ LogError: jest.fn() }));

import { GetNewDataFromServer } from '../../app/services/firebase';
jest.mock('../../app/services/firebase', () => ({ GetNewDataFromServer: jest.fn() }));


import { getDataFromServer } from '../../app/actions/firebase';


const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Firebase Server Actions testing', () => {

    it('getDataFromServer test full path', () => {
        const lasttime = 1234;
        GetLastUpdateTime.mockImplementation( () => Promise.resolve(lasttime) );

        const pages = [
            { name: 'name01b', data: 'name01bdata' },
            { name: 'name02b', data: 'name02bdata' }
        ];
        const css = [
            { name: 'cssnameb', data: "cssdatab" }
        ];
        GetNewDataFromServer.mockImplementation( () => Promise.resolve(
            {
                pages: pages,
                css: css
            }
        ));

        const nowtime = 9876;
        Date.now = jest.fn();
        Date.now.mockImplementation( () => nowtime);

        const store = mockStore({ pagestore: { loading: false }});
        const expectedActions = [
            'SET_LOADING',
            'SET_LOADING',
        ];

        
        return store.dispatch(getDataFromServer())
            .then( () => {
                const actualActions = store.getActions().map(action => action.type);
                expect(actualActions).toEqual(expectedActions);
                expect(GetLastUpdateTime).toBeCalled();
                expect(GetNewDataFromServer).toBeCalledWith(lasttime);
                expect(LocalDBSaveResources).toBeCalledWith(pages, css);
                expect(SaveLastUpdateTime).toBeCalledWith(nowtime);
                expect(LogError).not.toBeCalled();
                GetLastUpdateTime.mockClear();
                GetNewDataFromServer.mockClear();
                LogError.mockClear();
                LocalDBSaveResources.mockClear();
                SaveLastUpdateTime.mockClear();
            });
    });

    it('getDataFromServer test when error in GetNewDataFromServer', () => {
        const lasttime = 1234;
        GetLastUpdateTime.mockImplementation( () => Promise.resolve(lasttime) );
        
        const err = "error msg";
        GetNewDataFromServer.mockImplementation( () => Promise.reject(err));

        const store = mockStore({ pagestore: { loading: false }});
        const expectedActions = [
            'SET_LOADING',
            'SET_LOADING'
        ];

        return store.dispatch(getDataFromServer())
            .then( () => {
                const actualActions = store.getActions().map(action => action.type);
                expect(actualActions).toEqual(expectedActions);
                expect(GetLastUpdateTime).toBeCalled();
                expect(GetNewDataFromServer).toBeCalledWith(lasttime);
                expect(LocalDBSaveResources).not.toBeCalled();
                expect(SaveLastUpdateTime).not.toBeCalled();
                expect(LogError).toBeCalledWith(err);
                GetLastUpdateTime.mockClear();
                GetNewDataFromServer.mockClear();
                LogError.mockClear();
                LocalDBSaveResources.mockClear();
                SaveLastUpdateTime.mockClear();
            });
    });

    it('getDataFromServer test when error in LocalDBSaveResources', () => {
        const lasttime = 1234;
        GetLastUpdateTime.mockImplementation( () => Promise.resolve(lasttime) );
        
        const pages = [
            { name: 'name01b', data: 'name01bdata' },
            { name: 'name02b', data: 'name02bdata' }
        ];
        const css = [
            { name: 'cssnameb', data: "cssdatab" }
        ];
        GetNewDataFromServer.mockImplementation( () => Promise.resolve(
            {
                pages: pages,
                css: css
            }
        ));
        
        const err = "error msg 2";
        LocalDBSaveResources.mockImplementation( () => Promise.reject(err));

        const store = mockStore({ pagestore: { loading: false }});
        const expectedActions = [
            'SET_LOADING',
            'SET_LOADING'
        ];

        return store.dispatch(getDataFromServer())
            .then( () => {
                const actualActions = store.getActions().map(action => action.type);
                expect(actualActions).toEqual(expectedActions);
                expect(GetLastUpdateTime).toBeCalled();
                expect(GetNewDataFromServer).toBeCalledWith(lasttime);
                expect(LocalDBSaveResources).toBeCalledWith(pages, css);
                expect(SaveLastUpdateTime).not.toBeCalled();
                expect(LogError).toBeCalledWith(err);
                GetLastUpdateTime.mockClear();
                GetNewDataFromServer.mockClear();
                LogError.mockClear();
                LocalDBSaveResources.mockClear();
                SaveLastUpdateTime.mockClear();
            });
    });

    it('getDataFromServer test when error in SaveLastUpdateTime', () => {
        const lasttime = 1234;
        GetLastUpdateTime.mockImplementation( () => Promise.resolve(lasttime) );
        
        const pages = [
            { name: 'name01b', data: 'name01bdata' },
            { name: 'name02b', data: 'name02bdata' }
        ];
        const css = [
            { name: 'cssnameb', data: "cssdatab" }
        ];
        GetNewDataFromServer.mockImplementation( () => Promise.resolve(
            {
                pages: pages,
                css: css
            }
        ));
        
        LocalDBSaveResources.mockImplementation( () => Promise.resolve());

        const err = "error msg 3";
        SaveLastUpdateTime.mockImplementation( () => Promise.reject(err));

        const nowtime = 9876;
        Date.now = jest.fn();
        Date.now.mockImplementation( () => nowtime);

        const store = mockStore({ pagestore: { loading: false }});
        const expectedActions = [
            'SET_LOADING',
            'SET_LOADING'
        ];

        return store.dispatch(getDataFromServer())
            .then( () => {
                const actualActions = store.getActions().map(action => action.type);
                expect(actualActions).toEqual(expectedActions);
                expect(GetLastUpdateTime).toBeCalled();
                expect(GetNewDataFromServer).toBeCalledWith(lasttime);
                expect(LocalDBSaveResources).toBeCalledWith(pages, css);
                expect(SaveLastUpdateTime).toBeCalledWith(nowtime);
                expect(LogError).toBeCalledWith(err);
                GetLastUpdateTime.mockClear();
                GetNewDataFromServer.mockClear();
                LogError.mockClear();
                LocalDBSaveResources.mockClear();
                SaveLastUpdateTime.mockClear();
            });
    });

    it('getDataFromServer test if blocked when loading', () => {
        const store = mockStore({ pagestore: { loading: true }});
        const expectedActions = [];

        return store.dispatch(getDataFromServer())
            .then( () => {
                const actualActions = store.getActions().map(action => action.type);
                expect(actualActions).toEqual(expectedActions);
                expect(GetLastUpdateTime).not.toBeCalled();
                expect(GetNewDataFromServer).not.toBeCalled();
                expect(LocalDBSaveResources).not.toBeCalled();
                expect(SaveLastUpdateTime).not.toBeCalled();
                expect(LogError).not.toBeCalled();
                GetLastUpdateTime.mockClear();
                GetNewDataFromServer.mockClear();
                LogError.mockClear();
                LocalDBSaveResources.mockClear();
                SaveLastUpdateTime.mockClear();
            });
    });

    
})