var debounce = require('lodash.debounce')
var element = require('base-element')
var inherits = require('inherits')

module.exports = Filter
inherits(Filter, element)

function Filter (appendTo) {
  if (!(this instanceof Filter)) return new Filter(appendTo)
  element.call(this, appendTo)
}

Filter.prototype.render = function (list) {
  var self = this
  var input = self.html('input', {
    type: 'text',
    attributes: { placeholder: 'search' },
    oninput: debounce(function (e) {
      if (e.target.value.length === 0) return self.send('reset')
      if (e.target.value.length > 2) {
        var results = filterRows(e.target.value, list)
        self.send('filter', results, results.length)
      }
    }, 50)
  })

  var button = self.html('button', {
    onclick: function (e) {
      input.properties.value = null
      self.send('reset')
      self.render(list)
    }
  }, 'reset')

  var vtree = this.html('div#filter', [input, button])
  return this.afterRender(vtree)
}

function filterRows (txt, list) {
  var results = []
  list.forEach(function (row) {
    Object.keys(row.value).forEach(function (key) {
      if (row.value[key] && row.value[key].indexOf(txt) > -1) results.push(row)
    })
  })
  return results
}
