var vraf = require('virtual-raf')
var h = require('virtual-dom/h')
var createField = require('../index')

function inputField (state) {
  var field = createField()

  field.on('update', function (e, value) {
    tree.update({ imageURL: value })
  })

  return field.render(h, { value: state.imageURL })
}

function displayField (state) {
  var field = createField({
    display: true
  })

  return field.render(h, { value: state.imageURL })
}

function render (state) {
  return h('div.fields', [
    inputField(state),
    displayField(state)
  ])
}

var tree = vraf({ imageURL: 'http://placehold.it/50x50' }, render, require('virtual-dom'))
document.body.appendChild(tree())
