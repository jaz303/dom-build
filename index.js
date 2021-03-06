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
        while (typeof item === 'function') {
            item = item();
        }
        if (typeof item === 'string' || typeof item === 'number') {
            if (el.nodeType === 1) {
                el.appendChild(document.createTextNode(item));    
            } else if (el.nodeType === 3) {
                el.nodeValue += item;
            }
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
        } else if (item.nodeType) {
            el.appendChild(item);
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

    if (tag.length) {
        var m;
        if ((m = /^([\w-]+)?(#[\w-]+)?((\.[\w-]+)*)(\![\w-]+)?$/.exec(tag))) {
            var el = document.createElement(m[1] || 'div');
            if (m[2]) el.id = m[2].substr(1);
            if (m[3]) el.className = m[3].replace(/\./g, ' ').trim();
            if (m[5]) state[m[5].substr(1)] = el;
            return el;
        } else if ((m = /^%text(\![\w-]+)?$/.exec(tag))) {
            var text = document.createTextNode('');
            if (m[1]) state[m[1].substr(1)] = text;
            return text;
        }
    }

    throw new Error("invalid tag");

}