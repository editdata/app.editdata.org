var BaseElement = require('base-element')
var inherits = require('inherits')

module.exports = Container
inherits(Container, BaseElement)

function Container (el) {
  if (!(this instanceof Container)) return new Container(el)
  BaseElement.call(this, el)
}

Container.prototype.render = function (elements, state) {
  return this.afterRender(this.html('div.app-container', elements))
}
