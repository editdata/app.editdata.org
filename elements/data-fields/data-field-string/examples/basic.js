var vraf = require('virtual-raf')
var h = require('virtual-dom/h')
var createField = require('../index')

function inputField (state) {
  var field = createField()

  field.on('update', function (e, value) {
    tree.update({ message: value })
  })

  return field.render(h, { value: state.message })
}

function displayField (state) {
  var field = createField(h, {
    display: true
  })

  return field.render(h, { value: state.message })
}

function render (state) {
  return h('div.fields', [
    inputField(state),
    displayField(state)
  ])
}

var tree = vraf({ message: 'hi' }, render, require('virtual-dom'))
document.body.appendChild(tree())
