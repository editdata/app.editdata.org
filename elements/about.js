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
    h('h2', 'Hello. Let\'s talk about editing data.'),
    h('p', 'EditData.org is a tool for editing CSV & JSON files from your computer & from GitHub.'),
    h('p', [
      h('a.button', {
        href: 'http://about.editdata.org',
        target: '_blank'
      }, 'Learn more at about.editdata.org')
    ]),
    h('p', [
      h('a.button', {
        href: 'https://github.com/editdata/editdata.org',
        target: '_blank'
      }, 'Source on GitHub')
    ]),
    h('p', [
      h('a.button', {
        href: 'https://github.com/editdata/editdata.org/issues',
        target: '_blank'
      }, 'Report an issue')
    ])
  ]
  var vtree = h('div.about', elements)
  return this.afterRender(vtree)
}
