# dom-build

Build DOM trees in Javascript with shortcut syntax for grabbing references to generated elements.

There are lots of libraries that perform a similar function but none I've encountered allow you to get a reference to anything but the root node. `dom-build` introduces the `!key` selector syntax to indicate that a generated element should be attached to the returned object structure via the named key. Example:

```javascript
var d = require('dom-build');

var ui = d('#root.a.b.c!foo',
  "This is a text node", d('br'),
  "This is another text node", d('br'),
  d('span.myMessage',
    d('%text!myMessage',
      'This is an explicit text node; it will be returned.',
      ' Multiple strings ',
      'can be added'
    )
  ),
  d('br'),
  d('a.active!link',
    { href: "/foo/bar",
      onclick: function(evt) { evt.preventDefault(); alert("hello!"); } },
    "Click me! ", [
      d("b!bold", "here's some bold text"),
      " ",
      d("i", "here's some italic text")
    ]
  ),
  d("div", {style: {width: 100, height: 100, backgroundColor: 'red'}})
);
````

This yields the `ui` object comprising these keys:

  * `root`: the element created by the outermost call to `d()`
  * `myMessage`: a raw text node; the contents of `span.myMessage`
  * `foo`: equivalent to `root`; `div#root.a.b.c`
  * `link`: `a.active`
  * `bold`: `<b>here's some bold text</b>`
