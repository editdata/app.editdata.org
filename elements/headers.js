var element = require('base-element')
var inherits = require('inherits')

module.exports = Headers
inherits(Headers, element)

function Headers (appendTo) {
  if (!(this instanceof Headers)) return new Headers(appendTo)
  element.call(this, appendTo)
}

Headers.prototype.render = function (headers) {
  var self = this
  var items = []

  headers.forEach(function (header) {
    items.push(self.html('li.list-header-item.data-list-property', [
      header,
      self.html('button#column-settings.small', {
        onclick: function (e) {
          self.send('destroy-column', header, e)
        }
      }, self.html('i.fa.fa-trash', ''))
    ]))
  })

  var vtree = this.html('ul.headers-list.data-list-properties', items)
  return this.afterRender(vtree)
}
