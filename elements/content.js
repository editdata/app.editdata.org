var BaseElement = require('base-element')
var inherits = require('inherits')

module.exports = Content
inherits(Content, BaseElement)

function Content () {
  if (!(this instanceof Content)) return new Content()
  this.el = document.getElementById('content')
  BaseElement.call(this, this.el)
}

Content.prototype.render = function (elements, state) {
  var h = this.html
  var vtree = h('div.content-wrapper', [
    h('div.content', elements)
  ])
  return this.afterRender(vtree)
}
