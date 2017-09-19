'use strict';

import * as firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

import firebaseConfig from '../assets/firebase.secret'


firebase.initializeApp(firebaseConfig);

var storage = firebase.storage();
var storageRef = storage.ref();

export const GET_NEW_PAGES_BASE_URL = "https://us-central1-mdhandbookapp-1debf.cloudfunctions.net/bookpages";
export const GET_NEW_CSS_BASE_URL   = "https://us-central1-mdhandbookapp-1debf.cloudfunctions.net/stylefiles";
export const TIME_QUERY_PARAM = 'time';

const BOOKPAGES_DIR = "bookpages/";
const BOOKPAGES_DIR_LENGTH = 10;
const STYLEFILES_DIR = "stylefiles/";
const STYLEFILES_DIR_LENGTH = 11;
const HTML_EXT = ".html";
const HTML_EXT_LENGTH = 5;
const CSS_EXT = ".css";
const CSS_EXT_LENGTH = 4;


export const GetNewDataFromServer = (lasttime) => {
    var p = new Promise( (resolve, reject) => {
        var newPagesUrl = CreateNewPagesUrl(lasttime);
        var newCssUrl = CreateNewCssUrl(lasttime);
        Promise.all([fetch(newPagesUrl), fetch(newCssUrl)])
            .then(responses => {
                return Promise.all([responses[0].json(), responses[1].json()]);
            })
            .then(results => {
                let pageUrls = results[0].names;
                let pagesstats = { totallength: results[0].totallength, numfiles: results[0].numfiles }
                let cssUrls = results[1].names;
                let cssstats = { totallength: results[1].totallength, numfiles: results[1].numfiles }
                let pageBaseNames = ParseBaseHTMLNames(pageUrls);
                let cssBaseNames = ParseBaseCssNames(cssUrls);

                let loadpageslist = pageUrls.map( (path, idx) => {
                    if (pageBaseNames[idx] == null) {
                        return null;
                    }
                    return { name: pageBaseNames[idx], path: path };
                });
                let finalpageslist = loadpageslist.filter(item => item != null);

                let loadcsslist = cssUrls.map( (path, idx) => {
                    if (cssBaseNames[idx] == null) {
                        return null;
                    }
                    return { name: cssBaseNames[idx], path: path };
                });
                let finalcsslist = loadcsslist.filter(item => item != null);

                var pageLoading = finalpageslist.map( (item) => { return LoadURL(item.name, item.path); } );
                var cssLoading = finalcsslist.map( (item) => { return LoadURL(item.name, item.path); } );
                return Promise.all([Promise.all(pageLoading), Promise.all(cssLoading)], Promise.resolve(pagesstats), Promise.resolve(cssstats));
            })
            .then(dataresults => {
                var page_json = dataresults[0];
                var css_json = dataresults[1];
                var pagesstats = dataresults[2];
                var cssstats = dataresults[3];
                var final_results = {
                    pages: page_json,
                    css: css_json,
                    pagestats: pagesstats,
                    cssstats: cssstats
                };
                resolve(final_results);
            })
            .catch(err => {
                reject(err);
            });
    });
    return p;
}

export const ParseBaseHTMLNames = (urllist) => {
    return urllist.map(item => { return GetBaseHTMLName(item); });
}

export const GetBaseHTMLName = (url) => {
    return GetBaseName(BOOKPAGES_DIR, BOOKPAGES_DIR_LENGTH, HTML_EXT, HTML_EXT_LENGTH, url);
}

export const ParseBaseCssNames = (urllist) => {
    return urllist.map(item => { return GetBaseCssName(item); });
}

export const GetBaseCssName = (url) => {
    return GetBaseName(STYLEFILES_DIR, STYLEFILES_DIR_LENGTH, CSS_EXT, CSS_EXT_LENGTH, url);
}

export const GetBaseName = (prefix, prefix_length, ext, ext_length, url) => {
    if(!url.startsWith(prefix)) {
        return null;
    }

    if(!url.endsWith(ext)) {
        return null;
    }

    let end = 0 - ext_length;
    return url.slice(prefix_length, end);
}


export const LoadURL = (name, path) => {
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


export const CreateNewPagesUrl = (lasttime) => {
    return lasttime ? AddTimeParam(GET_NEW_PAGES_BASE_URL, lasttime) : GET_NEW_PAGES_BASE_URL;
}

export const CreateNewCssUrl = (lasttime) => {
    return lasttime ? AddTimeParam(GET_NEW_CSS_BASE_URL, lasttime) : GET_NEW_CSS_BASE_URL;
}

export const AddTimeParam = (url, lasttime) => {
    return url.concat('?', TIME_QUERY_PARAM, '=', lasttime.toString());
}



export default firebase;
