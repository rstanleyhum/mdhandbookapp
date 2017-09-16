'use strict';

export const PostScript = `
    document.querySelector("body.article").addEventListener("click", doSomething, false);
    
    function doSomething(e) {
        var clickedItem = e.target.href;
        window.postMessage(clickedItem);
        e.preventDefault();
        return false;
    }`