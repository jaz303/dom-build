module.exports = dombuild;

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

function bind(el, evt, fn) {
    // TODO: delegate to something else
    el.addEventListener(evt.substr(2), fn);
}

function dombuild(tag) {
    var state = {};
    state.root = builder(state, arguments, 0);
    return state;
}

function builder(state, args, offset) {
    var el = createElement(state, args[offset]);
    append(state, el, args, offset + 1);
    return el;
}

function append(state, el, items, startOffset) {
    for (var i = startOffset, len = items.length; i < len; ++i) {
        var item = items[i];
        if (typeof item === 'string') {
            el.appendChild(document.createTextNode(item));
        } else if (Array.isArray(item)) {
            if (item[0] === dombuild) {
                el.appendChild(builder(state, item, 1));
            } else {
                append(state, el, items, 0);    
            }
        } else {
            for (var k in item) {
                var v = item[k];
                if (typeof v === 'function') {
                    bind(el, k, v);
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
    if (!tag.length || !(m = /^([\w-]+)?(\![\w-]+)?(#[\w-]+)?((\.[\w-]+)*)$/.exec(tag))) {
        throw new Error("invalid tag");
    }

    var el = document.createElement(RegExp.$1 || 'div');

    if (m[2]) state[m[2].substr(1)] = el;
    if (m[3]) el.id = m[3].substr(1);
    if (m[4]) el.className = m[4].replace(/\./g, ' ').trim();

    return el;

}