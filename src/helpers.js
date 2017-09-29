// get elements(s) by CSS selector
function qs(select) {
    return document.querySelector(select);
}

function qsa(select) {
    return document.querySelectorAll(select);
}

// because forEach doesn't work with NodeLists in Safari
function eachNode(nodeList, callback, scope) {
    for (var i = 0; i < nodeList.length; i++) {
        callback.call(scope, nodeList[i], i);
    }
}