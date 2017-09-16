'use strict';


import * as firebase from '../../app/services/firebase';


describe('Firebase Service testing', () => {

    it('GetBaseName check for prefix and ext okay', () => {
        const prefix = "prefixString/";
        const prefix_length = prefix.length;
        const ext = ".extString";
        const ext_length = ext.length;
        const basename = "BaseName";

        const url = prefix + basename + ext;

        var actualValue = firebase.GetBaseName(prefix, prefix_length, ext, ext_length, url);
        expect(actualValue).toBe(basename);
    });


    it('GetBaseName check for prefix null', () => {
        const prefix = "prefixString/";
        const prefix2 = "notTheRight1/";
        const prefix_length = prefix.length;
        const ext = ".extString";
        const ext_length = ext.length;
        const basename = "BaseName";
        
        const url = prefix2 + basename + ext;

        var actualValue = firebase.GetBaseName(prefix, prefix_length, ext, ext_length, url);
        expect(actualValue).toBeNull();
    });


    it('GetBaseName check for ext null', () => {
        const prefix = "prefixString/";
        const prefix_length = prefix.length;
        const ext = ".extString";
        const ext2 = "notTheRight1/";
        const ext_length = ext.length;
        const basename = "BaseName";
        
        const url = prefix + basename + ext2;

        var actualValue = firebase.GetBaseName(prefix, prefix_length, ext, ext_length, url);
        expect(actualValue).toBeNull();
    });

    it('ParseBaseHTMLNames integration for GetBaseName and GetBaseHTMLName', () => {
        const urllist = [
            'bookpages/one.html',
            'bookpages/two.css',
            'three.html',
            'four.css',
            'bookpages/five.html',
            'stylefiles/six.html',
            'stylefiles/seven.css',
            'stylefiles/eight.css'
        ];
        const expectedValue = [
            'one',
            null,
            null,
            null,
            'five',
            null,
            null,
            null
        ];
        var actualValue = firebase.ParseBaseHTMLNames(urllist);
        expect(actualValue).toEqual(expectedValue);
    });

    it('ParseBaseCssNames integration for GetBaseName and GetBaseCssName', () => {
        const urllist = [
            'bookpages/one.html',
            'bookpages/two.css',
            'three.html',
            'four.css',
            'bookpages/five.html',
            'stylefiles/six.html',
            'stylefiles/seven.css',
            'stylefiles/eight.css'
        ];
        const expectedValue = [
            null,
            null,
            null,
            null,
            null,
            null,
            'seven',
            'eight'
        ];
        var actualValue = firebase.ParseBaseCssNames(urllist);
        expect(actualValue).toEqual(expectedValue);
    });

    it('CreateNewPagesUrl when lasttime is not null', () => {
        var lasttime = 1234;
        var expectedValue = firebase.GET_NEW_PAGES_BASE_URL + "?" + firebase.TIME_QUERY_PARAM + "=" + lasttime.toString();
        var actualValue = firebase.CreateNewPagesUrl(lasttime);
        expect(actualValue).toBe(expectedValue);
    });

    it('CreateNewPagesUrl when lasttime is not specified', () => {
        var expectedValue = firebase.GET_NEW_PAGES_BASE_URL;
        var actualValue = firebase.CreateNewPagesUrl();
        expect(actualValue).toBe(expectedValue);
    });

    it('CreateNewCssUrl when lasttime is not null', () => {
        var lasttime = 1234;
        var expectedValue = firebase.GET_NEW_CSS_BASE_URL + "?" + firebase.TIME_QUERY_PARAM + "=" + lasttime.toString();
        var actualValue = firebase.CreateNewCssUrl(lasttime);
        expect(actualValue).toBe(expectedValue);
    });

    it('CreateNewCssUrl when lasttime is not specified', () => {
        var expectedValue = firebase.GET_NEW_CSS_BASE_URL;
        var actualValue = firebase.CreateNewCssUrl();
        expect(actualValue).toBe(expectedValue);
    });

    it('GetNewDataFromServer still needs to be created', () => {
        expect(1).toBe(2);
    });

    it('LoadURL test still needs to be created', () => {
        expect(1).toBe(2);
    })
})