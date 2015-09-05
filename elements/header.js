var BaseElement = require('base-element')
var inherits = require('inherits')

module.exports = Header
inherits(Header, BaseElement)

function Header () {
  if (!(this instanceof Header)) return new Header()
  BaseElement.call(this)
}

Header.prototype.render = function (elements, state) {
  var h = this.html

  elements = [h('h1.site-title', [
    h('a', { href: '/' }, state.site.title)
  ])].concat(elements)

  var vtree = h('header', [
    h('div.container', elements)
  ])

  return this.afterRender(vtree)
}
