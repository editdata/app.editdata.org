/*global requestAnimationFrame*/
var h = require('virtual-dom/h')

module.exports = Item

function Item (props) {
  var item = props.item || { value: {} }
  var onInput = props.onInput
  var onFocus = props.onFocus
  var onClose = props.onClose
  var onDestroy = props.onDestroy
  var activePropertyId = props.activePropertyId
  var fields = []

  Object.keys(item.value).forEach(function (key) {
    var id = 'item-property-' + item.key + '-' + key
    var options = {
      itemHook: FocusHook(id === activePropertyId),
      id: 'item-property-' + item.key + '-' + key,
      value: item.value[key],
      oninput: function (e) {
        onInput(key, e.target.value, item.key, e)
      },
      onfocus: function (e) {
        if (onFocus) onFocus(e, item)
      }
    }

    if (props.properties[key]) {
      var field
      if (props.properties[key].type === 'number') {
        options.type = 'number'
        field = h('input.item-property-value', options)
      } else {
        field = h('textarea.item-property-value', options)
      }

      var fieldwrapper = h('div.item-property-wrapper', [
        h('span.item-property-label', props.properties[key].name),
        field
      ])

      fields.push(fieldwrapper)
    }
  })

  return h('div#item.active', [
    h('div.item', [
      h('a.close-item', {
        href: '#',
        onclick: function (e) {
          e.preventDefault()
          onClose(e)
        }
      }, 'x'),
      h('button#destroyRow.small.button-orange', {
        onclick: function (e) {
          onDestroy(item, e)
        }
      }, 'destroy row'),
      h('div.item-properties-wrapper', fields)
    ])
  ])
}

function FocusHook (value) {
  if (!(this instanceof FocusHook)) return new FocusHook(value)
  this.value = value
}

FocusHook.prototype.hook = function (elem, propName) {
  if (this.value) requestAnimationFrame(function () { elem.focus() })
}
