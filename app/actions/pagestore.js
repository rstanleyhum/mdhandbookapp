'use strict';

export const UPDATE_PAGE = 'UPDATE_PAGE';
export const UPDATE_CSS  = 'UPDATE_CSS';
export const SET_LOADED = 'SET_LOADED';
export const SET_LOADING = 'SET_LOADING';


export function updatePage(id, data) {
    return { type: UPDATE_PAGE, id, data }
}

export function updateCss(data) {
    return { type: UPDATE_CSS, data }
}

export function setLoaded(value) {
    return { type: SET_LOADED, value }
}

export function setLoading(value) {
    return { type: SET_LOADING, value }
}

