var element = require('base-element')
var inherits = require('inherits')

module.exports = Actions
inherits(Actions, element)

function Actions (options) {
  if (!(this instanceof Actions)) return new Actions(options)
  element.call(this)
}

Actions.prototype.render = function (list) {
  var self = this

  var newColumn = this.html('li.menu-item', [
    this.html('button#new-column', {
      onclick: function (e) {
        self.send('new-column', e)
      }
    }, 'new column')
  ])

  var newRow = this.html('li.menu-item', [
    this.html('button#new-row', {
      onclick: function (e) {
        self.send('new-row', e)
      }
    }, 'new row')
  ])

  var destroy = this.html('li.menu-item', [
    this.html('button#destroy', {
      onclick: function (e) {
        self.send('destroy', e)
      }
    }, 'destroy all data')
  ])

  var vtree = this.html('div.menubar', [
    this.html('ul', [newColumn, newRow, destroy])
  ])

  return this.afterRender(vtree)
}
