var vraf = require('virtual-raf')
var h = require('virtual-dom/h')
var createField = require('../index')

function inputField (state) {
  var field = createField({
    keys: state.keys
  })

  field.on('update', function (e, items) {
    state.items = items
    tree.update(state)
  })

  return field.render(h, { value: state.items })
}

function displayField (state) {
  var field = createField({
    keys: state.keys,
    display: true
  })

  return field.render(h, { value: state.items })
}

function render (state) {
  return h('div.fields', [
    inputField(state),
    displayField(state)
  ])
}

var tree = vraf({ items: ['hi', 'ok', 'awesome'], keys: true }, render, require('virtual-dom'))
document.body.appendChild(tree())
