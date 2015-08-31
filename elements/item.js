var BaseElement = require('base-element')
var inherits = require('inherits')

module.exports = Item
inherits(Item, BaseElement)

function Item () {
  if (!(this instanceof Item)) return new Item()
  BaseElement.call(this)
}

Item.prototype.render = function (obj, state) {
  obj = obj || { value: {} }
  var self = this
  var fields = []

  Object.keys(obj.value).forEach(function (key) {
    var options = {
      id: 'item-property-' + obj.key + '-' + key,
      value: obj.value[key],
      oninput: function (e) {
        obj.value[key] = e.target.value
        self.send('input', obj.value[key], obj, e)
      },
      onfocus: function (e) {
        self.send('focus', e)
      }
    }

    var field = self.html('textarea.item-property-value', options)
    var fieldwrapper = self.html('div.item-property-wrapper', [
      self.html('span.item-property-label', state.properties[key].name),
      field
    ])

    fields.push(fieldwrapper)
  })

  var vtree = this.html('div#item', [
    this.html('div.item', [
      self.html('a.close-item', {
        href: '#',
        onclick: function (e) {
          e.preventDefault()
          self.send('close', e)
        }
      }, 'x'),
      self.html('button#destroyRow.small.button-orange', {
        onclick: function (e) {
          self.send('destroy-row', obj, e)
        }
      }, 'destroy row'),
      self.html('div.item-properties-wrapper', fields)
    ])
  ])

  return this.afterRender(vtree)
}
