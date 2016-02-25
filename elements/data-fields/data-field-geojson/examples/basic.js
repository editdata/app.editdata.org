var vraf = require('virtual-raf')
var h = require('virtual-dom/h')
var createField = require('../index')

function inputField (state) {
  var field = createField({
    display: true,
    zoom: 12,
    value: state.geojson,
    center: [47.621958, -122.33636]
  })

  return field.render(h, {
    value: state.geojson
  })
}

function displayField (state) {
  var field = createField({
    zoom: 12,
    center: [47.621958, -122.33636]
  })

  field.on('update', function (e, geojson) {
    console.log('update?', e, geojson)
    state.geojson = geojson
    tree.update(state)
  })

  return field.render(h, {
    value: state.geojson
  })
}

function render (state) {
  return h('div.fields', [
    inputField(state),
    displayField(state)
  ])
}

var initialState = {
  geojson: { type: 'FeatureCollection', features: [] }
}

var tree = vraf(initialState, render, require('virtual-dom'))
document.body.appendChild(tree())
