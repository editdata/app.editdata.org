var h = require('virtual-dom/h')

module.exports = CreateColumn

function CreateColumn (props) {
  var name, type

  return h('div', [
    h('h1', 'Create new column'),
    h('h2', 'Set the column name & type'),
    h('div', [
      h('input.small', {
        type: 'text',
        name: 'column-name',
        onchange: function (e) {
          name = e.target.value
        }
      })
    ]),
    h('div', [
      h('select.small', {
        name: 'column-type',
        onchange: function (e) {
          type = e.target.options[e.target.selectedIndex].text
        }
      }, [
        h('option', 'string'),
        h('option', 'number')
      ])
    ]),
    h('div', [
      h('button.button-blue', {
        onclick: function () {
          props.onsubmit(name, type)
        }
      }, 'Create column')
    ])
  ])
}
