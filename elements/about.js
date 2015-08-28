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
  var elements = []

  elements.push(h('h2', 'About EditData.org'))

  var vtree = h('div.about', elements)
  return this.afterRender(vtree)
}
