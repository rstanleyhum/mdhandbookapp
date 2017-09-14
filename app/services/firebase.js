'use strict';

import * as firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

import firebaseConfig from '../assets/firebase.secret';

firebase.initializeApp(firebaseConfig);

var storage = firebase.storage();
var storageRef = storage.ref();

const CHECKFILES_URL = "https://us-central1-mdhandbookapp-1debf.cloudfunctions.net/checkfiles";
const FORCECHECKFILES_URL = "https://us-central1-mdhandbookapp-1debf.cloudfunctions.net/forcecheckfiles";


export const loadURL = (name, path) => {
    var p = new Promise( (resolve, reject) => {
        storageRef.child(path).getDownloadURL()
        .then( url => {
            return fetch(url)
            })
        .then((response) => {
            return response.text();
        })
        .then( (data) => {
            resolve({name: name, data: data});
        })
        .catch( error => {
            resolve({name: name, data: null });
        });
    });
    return p;
}


export const GetNewPagesList = (lasttime) => {
    var url = CHECKFILES_URL.concat('?time=', lasttime.toString());
    return _getPagesList(url);
}

export const ForceGetNewPagesList = (lasttime) => {
    var url = FORCECHECKFILES_URL.concat('?time=', lasttime.toString());
    return _getPagesList(url);
}

const _getPagesList = (url) => {
    var p = new Promise( (resolve, reject) => {
        fetch(url)
          .then( (response) => {
            if(!response.ok) {
                reject({error: response.status, errorText: response.statusText, url: url});
            }
            return response.json();
          })
          .then( (data) => {
              resolve(data);
          })
          .catch( err => {
              reject({error: err});
          });
    });
    return p;
}

export const ParseFilename = (filename) => {

    if (!filename.startsWith("bookpages/")) {
        return null;
    }

    var basefilename = filename.slice(10);
    if (!basefilename.endsWith(".html")) {
        return null;
    }

    var basename = basefilename.slice(0, -5);
    return basename
}

export default firebase;
