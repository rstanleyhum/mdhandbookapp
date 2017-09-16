'use strict';

import { AsyncStorage } from 'react-native';

export const INITIAL_DEPLOY_TIME = 1498867200000;
export const LASTUPDATETIME_KEY = '@LastUpdateTime';

export const RUN_NUMBER_KEY = '@RunNumber';
export const INITIAL_RUN_NUMBER = 0;

export const GetRunNumber = () => {
    var p = new Promise( (resolve, reject) => {
        AsyncStorage.getItem(RUN_NUMBER_KEY)
            .then( (data) => {
                if (data) {
                    resolve(parseInt(data));
                } else {
                    resolve(INITIAL_RUN_NUMBER);
                }
            })
            .catch(err => {
                reject(err);
            });
    });
    return p;
}

export const SaveRunNumber = (n) => {
    var p = new Promise( (resolve, reject) => {
        AsyncStorage.setItem(RUN_NUMBER_KEY, n.toString())
            .then( () => {
                resolve();
            })
            .catch(err => {
                reject(err);
            });
    });
    return p;
}

export const GetLastUpdateTime = () => {
    var p = new Promise( (resolve, reject) => {
        AsyncStorage.getItem(LASTUPDATETIME_KEY)
          .then( (data) => {
              if (data) {
                  resolve(parseInt(data));
              } else {
                  resolve(INITIAL_DEPLOY_TIME);
              }
          })
          .catch(err => {
            reject(err);
          });
    });
    return p;
}

export const SaveLastUpdateTime = (updatetime) => {
    var p = new Promise( (resolve, reject) => {
        AsyncStorage.setItem(LASTUPDATETIME_KEY, updatetime.toString())
            .then( () => {
                resolve();
            })
            .catch(err => {
                reject(err)
            })
    });
    return p;
}

export const ResetLastUpdateTime = () => {
    return SaveLastUpdateTime(INITIAL_DEPLOY_TIME);
}

