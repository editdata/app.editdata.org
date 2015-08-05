var element = require('base-element')
var inherits = require('inherits')

module.exports = Actions
inherits(Actions, element)

function Actions (options) {
  if (!(this instanceof Actions)) return new Actions(options)
  element.call(this)
}

Actions.prototype.render = function (state) {
  var self = this

  var saveText = state.gist ? 'update gist' : 'save data as gist'
  var saveGist = this.html('li.menu-item', [
    this.html('button#save-gist', {
      onclick: function (e) {
        self.send('save-gist', e)
      }
    }, saveText)
  ])

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
    this.html('button#new-dataset', {
      onclick: function (e) {
        self.send('new-dataset', e)
      }
    }, 'new dataset')
  ])

  var vtree = this.html('div.menubar', [
    this.html('ul', [saveGist, newColumn, newRow, destroy])
  ])

  return this.afterRender(vtree)
}
