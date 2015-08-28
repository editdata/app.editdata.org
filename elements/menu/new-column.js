var BaseElement = require('base-element')
var inherits = require('inherits')

module.exports = NewColumn
inherits(NewColumn, BaseElement)

function NewColumn (appendTo) {
  if (!(this instanceof NewColumn)) return new NewColumn(appendTo)
  BaseElement.call(this, appendTo)
}

NewColumn.prototype.render = function (state) {
  var h = this.html.bind(this)
  var self = this

  var vtree = h('li.menu-item', [
    h('button#new-column', {
      onclick: function (e) {
        self.send('new-column', e)
      }
    }, 'new column')
  ])

  return this.afterRender(vtree)
}
