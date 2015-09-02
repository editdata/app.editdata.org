var BaseElement = require('base-element')
var inherits = require('inherits')

module.exports = Docs
inherits(Docs, BaseElement)

function Docs (options) {
  if (!(this instanceof Docs)) return new Docs(options)
  BaseElement.call(this)
}

Docs.prototype.render = function (state) {
  var h = this.html
  var elements = [
    h('h1', 'Documentation')
  ]
  var vtree = h('div.docs', elements)
  return this.afterRender(vtree)
}
