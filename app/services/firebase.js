'use strict';

import * as firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

import firebaseConfig from '../assets/firebase.secret';

firebase.initializeApp(firebaseConfig);

var storage = firebase.storage();
var storageRef = storage.ref();


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


export default firebase;
