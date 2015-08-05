var BaseElement = require('base-element')
var inherits = require('inherits')

module.exports = Header
inherits(Header, BaseElement)

function Header (options) {
  if (!(this instanceof Header)) return new Header(options)
  BaseElement.call(this)
}

Header.prototype.render = function (elements, state) {
  var h = this.html.bind(this)
  var self = this

  elements = [
    h('h1.site-title', state.site.title)
  ].concat(elements)

  var vtree = h('header', [
    h('div.container', elements)
  ])

  return this.afterRender(vtree)
}
