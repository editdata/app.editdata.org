/*global requestAnimationFrame*/
var h = require('virtual-dom/h')
var dataset = require('data-set')

module.exports = Item

function Item (props) {
  var activeColumnKey = props.activeColumnKey
  var properties = props.properties
  var item = props.activeRowData
  var actions = props.actions

  var updateCellContent = actions.updateCellContent
  var setActiveRow = actions.setActiveRow
  var destroyRow = actions.destroyRow
  var fields = []

  Object.keys(item.value).forEach(function (key) {
    var options = {
      itemHook: FocusHook(key === activeColumnKey),
      id: 'item-property-' + item.key + '-' + key,
      attributes: { 'data-key': key },
      value: item.value[key],
      oninput: function (e) {
        updateCellContent(key, e.target.value, item.key, e)
      },
      onclick: function (e) {
        var el = e.target
        var rowEl = el.parentNode.parentNode
        var propertyKey = dataset(el).key
        var rowKey = dataset(rowEl).key
        var active = {
          column: propertyKey,
          row: rowKey
        }
        setActiveRow(active)
      }
    }

    if (properties[key]) {
      var field
      if (properties[key].type === 'number') {
        options.type = 'number'
        field = h('input.item-property-value', options)
      } else {
        field = h('textarea.item-property-value', options)
      }

      var fieldwrapper = h('div.item-property-wrapper', [
        h('span.item-property-label', properties[key].name),
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
          setActiveRow(null)
        }
      }, 'x'),
      h('button#destroyRow.small.button-orange', {
        onclick: function (e) {
          if (window.confirm('wait. are you sure you want to destroy all the data in this row?')) {
            destroyRow(item.key)
          }
        }
      }, 'destroy row'),
      h('div.item-properties-wrapper', {
        attributes: {
          'data-key': item.key
        }
      }, fields)
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
