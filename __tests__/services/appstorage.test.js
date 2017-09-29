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

    it('GetRunNumber when no number exists', () => {
        AsyncStorage.getItem = jest.fn( () => { return Promise.resolve(null); });
        const expectedValue = appstorage.INITIAL_RUN_NUMBER;

        return appstorage.GetRunNumber()
            .then( (actualValue) => {
                expect(actualValue).toBe(expectedValue);
                expect(AsyncStorage.getItem).toBeCalledWith(appstorage.RUN_NUMBER_KEY);
                AsyncStorage.getItem.mockClear();
            });
    });

    it('GetRunNumber when run number exists and is a number', () => {
        AsyncStorage.getItem = jest.fn( () => { return Promise.resolve("42"); });
        const expectedValue = 42;

        return appstorage.GetRunNumber()
            .then( (actualValue) => {
                expect(actualValue).toBe(expectedValue);
                expect(AsyncStorage.getItem).toBeCalledWith(appstorage.RUN_NUMBER_KEY);
            });
    });

    it('GetRunNumber when and error happens', () => {
        const err = "error message";
        AsyncStorage.getItem = jest.fn( () => { return Promise.reject(err); });

        return appstorage.GetRunNumber()
            .then()
            .catch( (actualErr) => {
                expect(actualErr).toBe(err);
            });
    });

    it('SaveRunNumber when number is set', () => {
        const expectedNumber = 5;
        const expectedNumberString = "5";

        AsyncStorage.setItem = jest.fn( () => { return Promise.resolve(); });

        return appstorage.SaveRunNumber(expectedNumber)
            .then( () => {
                expect(AsyncStorage.setItem).toBeCalledWith(appstorage.RUN_NUMBER_KEY, expectedNumberString);
                AsyncStorage.setItem.mockClear();
            });
    });

    it('SaveRunNumber when error occurs', () => {
        const expectedNumber = 5;
        const expectedNumberString = "5";

        const err = "error message";

        AsyncStorage.setItem = jest.fn( () => { return Promise.reject(err); });

        return appstorage.SaveRunNumber(expectedNumber)
            .then( (actualErr) => {
                expect(actualErr).toBe(err);
                AsyncStorage.setItem.mockClear();
            });
    });

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
            });
    });

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
            });
    });

    it('ResetlastUpdateTime called', () => {
        appstorage.SaveLastUpdateTime = jest.fn();

        return appstorage.ResetLastUpdateTime()
            .then( () => {
                expect(appstorage.SaveLastUpdateTime).toBeCalledWith(appstorage.INITIAL_DEPLOY_TIME);

            })
    })
})