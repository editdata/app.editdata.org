var h = require('virtual-dom/h')

var Popup = require('./popup')
var ColumnSettings = require('./column-settings')

module.exports = Headers

function Headers (props) {
  var activeProperty = props.activeProperty
  var properties = props.properties
  var actions = props.actions
  var items = []
  var popup

  var setActiveProperty = actions.setActiveProperty
  var propertyType = actions.propertyType
  var renameColumn = actions.renameColumn
  var modal = actions.modal

  function onclose () {
    setActiveProperty(null)
    modal('columnSettings', false)
  }

  Object.keys(properties).forEach(function (key) {
    var property = properties[key]

    var columnSettingsProps = {
      property: property,
      actions: {
        propertyType: propertyType,
        renameColumn: renameColumn
      }
    }

    if (activeProperty === key) {
      popup = Popup({ onclose: onclose }, [
        ColumnSettings(columnSettingsProps)
      ])
    }

    items.push(
      h('li#' + property.key + '.list-header-item.data-list-property', [
        property.name,
        h('button#column-settings.small', {
          onclick: function (e) {
            setActiveProperty(property.key)
            modal('columnSettings', true)
          }
        }, h('i.fa.fa-gear', ''))
      ])
    )
  })

  return h('div', [
    h('ul.headers-list.data-list-properties', items),
    popup
  ])
}
