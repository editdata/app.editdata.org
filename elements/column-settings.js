var h = require('virtual-dom/h')
var actions = require('../actions')

module.exports = ColumnSettings

function ColumnSettings (props) {
  var property = props.property
  var store = props.store
  var onTypeChange = props.onTypeChange
  var onNameSubmit = props.onNameSubmit

  var newName = ''

  return h('div', [
    h('h1', property.name + ' settings'),
    h('h2', 'Manage the settings of this column'),
    h('h3', 'Change column type'),
    h('select.small', {
      onchange: function (e) {
        var selectedValue = e.target.options[e.target.selectedIndex].text
        if (onTypeChange) onTypeChange(selectedValue)
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
        if (onNameSubmit) onNameSubmit(newName)
      }
    }, 'Rename'),
    h('hr'),
    h('h3', 'Destroy column'),
    h('button.small.button-red', {
      onclick: function (e) {
        actions.editor.destroyColumn(property.key, store)
      }
    }, 'Destroy ' + property.name + ' column')
  ])
}
