var h = require('virtual-dom/h')
var dataFields = require('./data-fields')

module.exports = ColumnSettings

function ColumnSettings (props) {
  var actions = props.actions
  var property = props.property

  var destroyColumn = actions.destroyColumn
  var propertyType = actions.propertyType
  var renameColumn = actions.renameColumn

  var newName = ''

  var types = Object.keys(dataFields).map(function (key) {
    return h('option', { selected: property.type[0] === key }, key)
  })

  return h('div', [
    h('h1', property.name + ' settings'),
    h('h2', 'Manage the settings of this column'),
    h('h3', 'Change column type'),
    h('select.small', {
      onchange: function (e) {
        var selectedValue = e.target.options[e.target.selectedIndex].text
        propertyType(property.key, selectedValue)
      }
    }, types),
    h('hr'),
    h('h3', 'Rename column'),
    h('input.small.rename-column', {
      type: 'text',
      oninput: function (e) {
        newName = e.target.value
      }
    }),
    h('button.small.button-blue', {
      onclick: function () {
        renameColumn(property.key, newName)
      }
    }, 'Rename'),
    h('hr'),
    h('h3', 'Destroy column'),
    h('button.small.button-red', {
      onclick: function (e) {
        destroyColumn(property.key)
      }
    }, 'Destroy ' + property.name + ' column')
  ])
}
