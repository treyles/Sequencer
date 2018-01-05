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

// display error messages for IE/Edge and mobile browsers
function handleCompatibility() {
    // ie/edge
    if (/Edge/.test(navigator.userAgent) || document.documentMode) {
        qs('#spinner').style.display = 'none';
        qs(
            '.loader-text'
        ).innerHTML = 'Sorry, this application uses features that your browser does not support at the moment';
        isCompatible = false;
    }

    // mobile
    if (
        /Mobi/i.test(navigator.userAgent) ||
        /Android/i.test(navigator.userAgent)
    ) {
        qs('#loader').style.display = 'none';
        qs('#on-mobile').style.display = 'block';
        isCompatible = false;
    }
}

// remove beat transition for Safari users
function handleBrowserStyles() {
    if (
        navigator.userAgent.indexOf('Safari') != -1 &&
        navigator.userAgent.indexOf('Chrome') == -1
    ) {
        eachNode(qsa('.beat'), function(el) {
            el.style.transition = 'none';
            el.style.webkitTransition = 'none';
        });
    }
}
