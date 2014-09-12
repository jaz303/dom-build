# dombuild

```javascript
var d = require('dombuild');

var ui = d('!foo#root.a.b.c',
  "This is a text node", d('br'),
  "This is another text node", d('br'),
  d('br'),
  d('a!link.active',
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