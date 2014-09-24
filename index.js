module.exports = dombuild;

var bind = require('dom-bind').bind;

var PIXELS = {

    fontSize            : true,

    top                 : true,
    right               : true,
    bottom              : true,
    left                : true,

    width               : true,
    minWidth            : true,
    maxWidth            : true,

    height              : true,
    minHeight           : true,
    maxHeight           : true,

    outlineWidth        : true,

    margin              : true,
    marginTop           : true,
    marginRight         : true,
    marginBottom        : true,
    marginLeft          : true,

    padding             : true,
    paddingTop          : true,
    paddingRight        : true,
    paddingBottom       : true,
    paddingLeft         : true,

    borderTopWidth      : true,
    borderRightWidth    : true,
    borderBottomWidth   : true,
    borderLeftWidth     : true
    
};

function Result() {}

function dombuild(tag) {
    var state = new Result();
    state.root = builder(state, arguments);
    return state;
}

function builder(state, args) {
    var el = createElement(state, args[0]);
    append(state, el, args, 1);
    return el;
}

function append(state, el, items, startOffset) {
    for (var i = startOffset, len = items.length; i < len; ++i) {
        var item = items[i];
        if (typeof item === 'string' || typeof item === 'number') {
            el.appendChild(document.createTextNode(item));
        } else if (item instanceof Result) {
            for (var k in item) {
                if (k === 'root') {
                    el.appendChild(item[k]);
                } else {
                    state[k] = item[k];
                }
            }
        } else if (Array.isArray(item)) {
            append(state, el, item, 0);
        } else if (!item) {
            continue;
        } else {
            for (var k in item) {
                var v = item[k];
                if (typeof v === 'function' && k[0] === 'o' && k[1] === 'n') {
                    bind(el, k.substr(2), v);
                } else if (k === 'style') {
                    if (typeof v === 'string') {
                        el.style.cssText = v;
                    } else {
                        for (var prop in v) {
                            var propVal = v[prop];
                            if (typeof propVal === 'number' && PIXELS[prop]) {
                                propVal += 'px';
                            }
                            el.style[prop] = propVal;
                        }   
                    }
                } else {
                    el.setAttribute(k, v);
                }
            }
        }
    }
}

function createElement(state, tag) {

    var m;
    if (!tag.length || !(m = /^([\w-]+)?(#[\w-]+)?((\.[\w-]+)*)(\![\w-]+)?$/.exec(tag))) {
        throw new Error("invalid tag");
    }

    var el = document.createElement(m[1] || 'div');

    if (m[2]) el.id = m[2].substr(1);
    if (m[3]) el.className = m[3].replace(/\./g, ' ').trim();
    if (m[5]) state[m[5].substr(1)] = el;

    return el;

}