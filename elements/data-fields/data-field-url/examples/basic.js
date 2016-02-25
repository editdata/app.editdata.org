var vraf = require('virtual-raf')
var h = require('virtual-dom/h')
var createField = require('../index')

function inputField (state) {
  var field = createField()

  field.on('update', function (e, value) {
    tree.update({ url: value })
  })

  return field.render(h, { value: state.url })
}

function displayField (state) {
  var field = createField({
    display: true
  })

  return field.render(h, { value: state.url })
}

function render (state) {
  return h('div.fields', [
    inputField(state),
    displayField(state)
  ])
}

var tree = vraf({ url: 'example.com' }, render, require('virtual-dom'))
document.body.appendChild(tree())
