'use strict';

import { AsyncStorage } from 'react-native';

const INITIAL_DEPLOY_TIME = 1498867200000;

export const GetLastUpdateTime = () => {
    var p = new Promise( (resolve, reject) => {
        AsyncStorage.getItem('@LastUpdateTime')
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

