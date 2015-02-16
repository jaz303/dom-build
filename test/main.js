var d = require('..');

window.init = function() {
  
  var ui = d('#root.a.b.c!foo',
    "This is a text node", d('br'),
    "This is another text node", d('br'),
    d('span',
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
    d("div", {style: {width: 100, height: 100, backgroundColor: 'red'}}, 0, null, void 0, false)
  );

  document.body.appendChild(ui.root);

  ui.myMessage.nodeValue += "; this is a dynamic text update!";

  console.log(ui);

}