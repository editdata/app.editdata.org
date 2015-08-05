var BaseElement = require('base-element')
var inherits = require('inherits')

module.exports = Content
inherits(Content, BaseElement)

function Content () {
  if (!(this instanceof Content)) return new Content()
  this.el = document.getElementById('content')
  BaseElement.call(this, this.el)
}

Content.prototype.render = function (elements) {
  var vtree = this.html('div.content-wrapper', elements)
  return this.afterRender(vtree)
}
