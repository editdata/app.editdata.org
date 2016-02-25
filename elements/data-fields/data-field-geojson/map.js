var L = require('leaflet')
require('leaflet-draw')

module.exports = MapWidget
L.Icon.Default.imagePath = 'assets/'

function MapWidget (state, options) {
  if (!(this instanceof MapWidget)) return new MapWidget(state, options)
  var defaultState = { type: 'FeatureCollection', features: [] }

  if (!state || typeof state !== 'object') {
    this.data = defaultState
  } else if (state.type === 'Feature') {
    defaultState.features.push(state)
    this.data = defaultState
  } else if (state.type === 'FeatureCollection') {
    this.data = state
  }

  this.type = 'Widget'
  this.map = null
  this.features = null
  this.accessToken = options.accessToken
  this.display = options.display || false
  this.tiles = options.tileLayer || L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' })
  this.onclick = options.onclick
  this.onedit = options.onedit
  this.ondraw = options.ondraw
  this.onupdate = options.onupdate
  delete options.tiles
  delete options.display
  delete options.onclick
  this.options = options
}

MapWidget.prototype.refresh = function () {
  this.map.invalidateSize()
}

MapWidget.prototype.init = function () {
  var self = this
  var el = document.createElement('div')
  el.className = 'data-field-geojson-map-container'
  this.map = L.map(el, this.options)
  this.tiles.addTo(this.map)
  this.features = L.geoJson(this.data)
  this.map.addLayer(this.features)

  if (this.display) {
    this.features.on('click', function (e) {
      self.onclick(e)
    })
  } else {
    var drawControl = new L.Control.Draw({
      edit: { featureGroup: this.features }
    })

    this.map.addControl(drawControl)

    this.map.on('draw:created', function (e) {
      self.features.addData(e.layer.toGeoJSON())
      if (self.options.ondraw) self.options.ondraw(e, self.features.toGeoJSON())
      if (self.options.onupdate) self.options.onupdate(e, self.features.toGeoJSON())
    })

    this.map.on('draw:edited', function (e) {
      if (self.options.onedit) self.options.onedit(e, self.features.toGeoJSON())
      if (self.options.onupdate) self.options.onupdate(e, self.features.toGeoJSON())
    })
  }

  window.addEventListener('load', function (e) {
    self.map.invalidateSize()
  })

  return el
}

MapWidget.prototype.update = function (previous, el) {
  this.map = this.map || previous.map
  this.features = this.features || previous.features
  this.features.clearLayers()
  this.features.addData(this.data)
}

MapWidget.prototype.destroy = function (el) {}
