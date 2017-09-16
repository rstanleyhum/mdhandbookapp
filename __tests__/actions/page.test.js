'use strict';

import { PUSH_PAGE, POP_PAGE, PUSH_WEB_PAGE, pushWebPage, pushPage, popPage } from '../../app/actions/page';


describe('Page Actions Test', () => {
    
    it('pushWebPage has a type and url', () => {
        let url = 'fakeurl';
        let result = pushWebPage(url);
        expect(result.type).toBe(PUSH_WEB_PAGE);
        expect(result.url).toBe(url);
    });

    it('pushPage has a type and id', () => {
        let id = 'fakeurl';
        let result = pushPage(id);
        expect(result.type).toBe(PUSH_PAGE);
        expect(result.id).toBe(id);
    });

    it('popPage has a type', () => {
        let result = popPage();
        expect(result.type).toBe(POP_PAGE);
    });

});


