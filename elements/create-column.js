var serialize = require('@f/serialize-form')
var dataFields = require('./data-fields')
var h = require('virtual-dom/h')

module.exports = CreateColumn

function CreateColumn (props) {
  var onsubmit = props.onsubmit

  function onSubmit (event) {
    event.preventDefault()
    if (!onsubmit) return
    var result = serialize(event.target)
    return onsubmit(event, result)
  }

  var types = Object.keys(dataFields).map(function (key) {
    return h('option', key)
  })

  return h('div', [
    h('h1', 'Create new column'),
    h('h2', 'Set the column name & type'),
    h('form', { onsubmit: onSubmit }, [
      h('div', [
        h('input.small', { type: 'text', name: 'name' })
      ]),
      h('div', [
        h('select.small', { name: 'type' }, types)
      ]),
      h('div', [
        h('button.button-blue', { type: 'submit' }, 'Create column')
      ])
    ])
  ])
}
