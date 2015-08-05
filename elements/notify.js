var BaseElement = require('base-element')
var inherits = require('inherits')

module.exports = Notify
inherits(Notify, BaseElement)

function Notify (options) {
  if (!(this instanceof Notify)) return new Notify(options)
  BaseElement.call(this)
}

Notify.prototype.render = function (state) {
  var h = this.html.bind(this)
  var elements = []
  var self = this

  var vtree = h('div.notify', elements)
  return this.afterRender(vtree)
}
