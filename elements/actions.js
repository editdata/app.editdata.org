var element = require('base-element')
var inherits = require('inherits')

module.exports = Actions
inherits(Actions, element)

function Actions (options) {
  if (!(this instanceof Actions)) return new Actions(options)
  element.call(this)
}

Actions.prototype.render = function (state) {
  var elements = []
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

  elements = [saveGist, newColumn, newRow]

  if (state.gist) {
    elements.push(this.html('li.menu-item', [
      this.html('button#download-csv', {
        onclick: function (e) {
          window.open(state.gist.files['data.csv'].raw_url)
        }
      }, 'csv')
    ]))

    elements.push(this.html('li.menu-item', [
      this.html('button#download-json', {
        onclick: function (e) {
          window.open(state.gist.files['data.json'].raw_url)
        }
      }, 'json')
    ]))

    elements.push(this.html('li.menu-item', [
      this.html('button#gist', {
        onclick: function (e) {
          window.open(state.gist.html_url)
        }
      }, 'gist')
    ]))

    elements.push(this.html('li.menu-item', [
      this.html('button#new-dataset', {
        onclick: function (e) {
          self.send('new-dataset', e)
        }
      }, 'new dataset')
    ]))
  }

  var vtree = this.html('div.menubar', [
    this.html('ul', elements)
  ])

  return this.afterRender(vtree)
}
