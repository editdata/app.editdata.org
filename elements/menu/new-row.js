var BaseElement = require('base-element')
var inherits = require('inherits')

module.exports = NewRow
inherits(NewRow, BaseElement)

function NewRow (appendTo) {
  if (!(this instanceof NewRow)) return new NewRow(appendTo)
  BaseElement.call(this, appendTo)
}

NewRow.prototype.render = function (state) {
  var h = this.html.bind(this)
  var self = this

  var vtree = h('li.toolbar-item', [
    h('button#new-row', {
      onclick: function (e) {
        self.send('new-row', e)
      }
    }, 'new row')
  ])

  return this.afterRender(vtree)
}
