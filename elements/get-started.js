var BaseElement = require('base-element')
var inherits = require('inherits')

module.exports = GetStarted
inherits(GetStarted, BaseElement)

function GetStarted (options) {
  if (!(this instanceof GetStarted)) return new GetStarted(options)
  BaseElement.call(this)
}

GetStarted.prototype.render = function (state) {
  var self = this
  var h = this.html

  var options = [
    {
      slug: 'empty',
      text: 'Start new empty dataset'
    },
    {
      slug: 'github',
      text: 'Edit CSV or JSON file from GitHub'
    },
    {
      slug: 'upload',
      text: 'Upload CSV or JSON file'
    }
  ]
  var items = []

  options.forEach(function (item) {
    var el = h('li.list-item', {
      onclick: function (e) {
        self.send('click', item.slug, e)
      }
    }, item.text)
    items.push(el)
  })

  var elements = [
    h('h1', 'Get Started!'),
    h('h2', 'Start a new dataset or open an existing one.'),
    h('ul.list', items)
  ]

  var vtree = h('div.get-started', elements)
  return this.afterRender(vtree)
}
