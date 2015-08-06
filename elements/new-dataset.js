var BaseElement = require('base-element')
var inherits = require('inherits')

module.exports = Dataset
inherits(Dataset, BaseElement)

function Dataset (options) {
  if (!(this instanceof Dataset)) return new Dataset(options)
  BaseElement.call(this)
}

Dataset.prototype.render = function (state) {
  var h = this.html.bind(this)
  var elements = []
  var self = this

  if (state.uploadCSV) {
    elements.push(h('h2', 'Upload a CSV file'))
    elements.push(h('input#upload-csv', { 
      type: 'file',
      onchange: function (e) {
        var file = e.target.files[0]
        var reader = new FileReader()
        reader.onload = function (e) {
          self.send('csv', e.target.result)
        }
        reader.readAsText(file)
        e.preventDefault()
      }
    }))
  } else if (!state.empty) {
    elements.push(h('h2', 'Create a new dataset'))

    elements.push(h('a.button.small.button-blue', {
      href: '#',
      onclick: function (e) {
        self.send('empty')
      }
    }, ['empty dataset']))

    elements.push(h('a.button.small.button-blue', {
      href: '#',
      onclick: function (e) {
        state.uploadCSV = true
        self.render(state)
      }
    }, ['upload csv file']))
  }

  var vtree = h('div.dataset', elements)
  return this.afterRender(vtree)
}
