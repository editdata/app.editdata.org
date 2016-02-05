var h = require('virtual-dom/h')

module.exports = Headers

function Headers (props) {
  var properties = props.properties
  var actions = props.actions
  var items = []

  var setActiveProperty = actions.setActiveProperty
  var modal = actions.modal

  Object.keys(properties).forEach(function (key) {
    var property = properties[key]

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
    h('ul.headers-list.data-list-properties', items)
  ])
}
