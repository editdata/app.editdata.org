var element = require('base-element')
var inherits = require('inherits')

module.exports = Headers
inherits(Headers, element)

function Headers (appendTo) {
  if (!(this instanceof Headers)) return new Headers(appendTo)
  element.call(this, appendTo)
}

Headers.prototype.render = function (properties) {
  var self = this
  var items = []

  Object.keys(properties).forEach(function (key) {
    var property = properties[key]
    items.push(self.html('li#' + property.key + '.list-header-item.data-list-property', [
      property.name,
      self.html('button#column-settings.small', {
        onclick: function (e) {
          self.send('destroy-column', property, e)
        }
      }, self.html('i.fa.fa-trash', ''))
    ]))
  })

  var vtree = this.html('ul.headers-list.data-list-properties', items)
  return this.afterRender(vtree)
}
