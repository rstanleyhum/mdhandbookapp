'use strict';

import { AsyncStorage } from 'react-native';
jest.mock('react-native', () => ({
    AsyncStorage: {
        getItem: jest.fn(),
        setItem: jest.fn(),
    }
}));

import * as appstorage from '../../app/services/appstorage';


describe('App Storage Service testing', () => {

    it('GetLastUpdateTime when no time exists', () => {
        AsyncStorage.getItem = jest.fn( () => { return Promise.resolve(null); });
        const expectedValue = appstorage.INITIAL_DEPLOY_TIME;

        return appstorage.GetLastUpdateTime()
            .then( (actualValue) => {
                expect(actualValue).toBe(expectedValue);
                expect(AsyncStorage.getItem).toBeCalledWith(appstorage.LASTUPDATETIME_KEY);
                AsyncStorage.getItem.mockClear();
            });
    });

    it('GetLastUpdateTime when time exists', () => {
        const expectedTimeString = "5000";
        const expectedTimeValue = 5000;
        AsyncStorage.getItem = jest.fn( () => { return Promise.resolve(expectedTimeString); });

        return appstorage.GetLastUpdateTime()
            .then( (actualValue) => {
                expect(actualValue).toBe(expectedTimeValue);
                expect(AsyncStorage.getItem).toBeCalledWith(appstorage.LASTUPDATETIME_KEY);
                AsyncStorage.getItem.mockClear();
            });
    });

    it('GetLastUpdateTime when error happens', () => {
        const err = "error msg";
        AsyncStorage.getItem = jest.fn( () => { return Promise.reject(err); });

        return appstorage.GetLastUpdateTime()
            .then()
            .catch( (actualErr) => {
                expect(actualErr).toBe(err);
            })
    })

    it('SaveLastUpdateTime when lasttime is set', () => {
        const expectedTimeValue = 5432;
        const expectedTimeString = "5432";

        AsyncStorage.setItem = jest.fn( () => { return Promise.resolve(); });

        return appstorage.SaveLastUpdateTime(expectedTimeValue)
            .then( () => {
                expect(AsyncStorage.setItem).toBeCalledWith(appstorage.LASTUPDATETIME_KEY, expectedTimeString);
                AsyncStorage.setItem.mockClear();
            })
    });

    it('SaveLastUpdateTime when there is an error in saving', () => {
        const expectedTimeValue = 5432;
        const expectedTimeString = "5432";
        
        const err = "error msg 2";

        AsyncStorage.setItem = jest.fn( () => { return Promise.reject(err); });

        return appstorage.SaveLastUpdateTime(expectedTimeValue)
            .then()
            .catch( (actualErr) => {
                expect(actualErr).toBe(err);
            })
    })
})