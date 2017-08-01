'use strict';

import { loadURL } from '../../services/firebase'

import PagesFilenames, { UrlBase, CssFilenames } from '../config/firebaseassets';


export const LoadAllPages = () => {
    var filenames = []
    for (var key in PagesFilenames) {
        filenames.push(key)
    }

    var loadFilePromisesList = filenames.map( item => {
        return loadURL(item, UrlBase + PagesFilenames[item])
    });

    return Promise.all(loadFilePromisesList);
};


export const LoadAllCss = () => {
    var cssfilenames = []
    for (var key in CssFilenames) {
        cssfilenames.push(key)
    }

    var loadCssFilePromisesList = cssfilenames.map( item => {
        return loadURL(item, UrlBase + CssFilenames[item])
    });

    return Promise.all(loadCssFilePromisesList);
}
