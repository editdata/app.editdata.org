var h = require('virtual-dom/h')
var actions = require('../actions')
var Popup = require('./popup')
var ColumnSettings = require('./column-settings')

module.exports = Headers

function Headers (props) {
  var activeProperty = props.activeProperty
  var properties = props.properties
  var store = props.store
  var items = []
  var popup

  Object.keys(properties).forEach(function (key) {
    var property = properties[key]
    if (activeProperty === key) {
      popup = Popup({
        visible: true,
        onclose: function () {
          actions.editor.setActiveProperty(null, store)
          actions.modal('columnSettings', false, store)
        }
      }, ColumnSettings({
        property: property,
        store: store,
        onTypeChange: function (value) {
          actions.editor.propertyType(key, value, store)
        },
        onNameSubmit: function (name) {
          actions.editor.renameColumn(key, name, store)
        }
      }))
    }

    items.push(h('li#' + property.key + '.list-header-item.data-list-property', [
      property.name,
      h('button#column-settings.small', {
        onclick: function (e) {
          actions.editor.setActiveProperty(property.key, store)
          actions.modal('columnSettings', true, store)
        }
      }, h('i.fa.fa-gear', ''))
    ]))
  })

  return h('div', [
    h('ul.headers-list.data-list-properties', items),
    popup
  ])
}
