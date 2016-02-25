var vraf = require('virtual-raf')
var form = require('data-form')()

var initialState = {
  properties: {
    location: {
      key: 'location',
      name: 'location',
      type: ['geojson']
    }
  },
  activeRow: {
    data: {
      value: { location: { type: 'Feature', geometry: { type: 'Point', coordinates: [-122.33636, 47.621958] } } }
    }
  }
}

form.on('close', function () {
  console.log('heyo')
})

form.on('update', function (e, state) {
  tree.update(state)
})

function render (state) {
  return form.render(state)
}

var tree = vraf(initialState, render, require('virtual-dom'))
document.body.appendChild(tree())
