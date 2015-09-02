var BaseElement = require('base-element')
var inherits = require('inherits')

module.exports = About
inherits(About, BaseElement)

function About (options) {
  if (!(this instanceof About)) return new About(options)
  BaseElement.call(this)
}

About.prototype.render = function (state) {
  var h = this.html
  var elements = [
    h('h1', 'About EditData.org'),
    h('h2', 'Hello. Let me tell you about everything.'),
    h('p', 'EditData.org is a tool for editing CSV & JSON files from your computer & from GitHub.'),
    h('p', [
      h('a.button', 'Source on GitHub')
    ]),
    h('p', [
      h('a.button', 'Report an issue')
    ])
  ]
  var vtree = h('div.about', elements)
  return this.afterRender(vtree)
}
