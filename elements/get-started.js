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

  var slugs = ['empty', 'github', 'dat', 'csv', 'json']
  var items = []

  slugs.forEach(function (slug) {
    var el = h('li.list-item', {
      onclick: function (e) {
        self.send('click', slug, e)
      }
    }, slug)
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
