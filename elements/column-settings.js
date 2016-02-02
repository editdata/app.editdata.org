var h = require('virtual-dom/h')

module.exports = ColumnSettings

function ColumnSettings (props) {
  var actions = property.actions
  var property = props.property
  var store = props.store

  var destroyColumn = actions.destroyColumn
  var propertyType = actions.propertyType
  var renameColumn = actions.renameColumn

  var newName = ''

  return h('div', [
    h('h1', property.name + ' settings'),
    h('h2', 'Manage the settings of this column'),
    h('h3', 'Change column type'),
    h('select.small', {
      onchange: function (e) {
        var selectedValue = e.target.options[e.target.selectedIndex].text
        propertyType(selectedValue)
      }
    }, [
      h('option', { selected: property.type === 'string' }, 'string'),
      h('option', { selected: property.type === 'number' }, 'number')
    ]),
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
        renameColumn(newName)
      }
    }, 'Rename'),
    h('hr'),
    h('h3', 'Destroy column'),
    h('button.small.button-red', {
      onclick: function (e) {
        destroyColumn(property.key, store)
      }
    }, 'Destroy ' + property.name + ' column')
  ])
}
