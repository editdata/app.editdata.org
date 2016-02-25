var createClassName = require('data-field-classname')
var Emitter = require('component-emitter')
var extend = require('xtend')
var createMap = require('./map')

/**
Create a virtual-dom geojson data-field for use with [data-ui](https://github.com/editdata/data-ui).
* @name createGeoJSONField
* @param {Object} options an options object, including any properties you can pass to leaflet & virtual-dom/h
* @param {String} options.accessToken mapbox access token for using their API
* @param {Object} options.tileLayer Leaflet tilelayer, default is osm tiles
* @param {String} options.imagePath path to leaflet images
* @param {Boolean} options.display true for display mode, default is false for input mode
* @returns field
* @example
* var createGeoJSONField = require('data-field-geojson')
* var field = createGeoJSONField(options)
* field.render(h, {}, geojsonObject)
*/
module.exports = function createGeoJSONField (options) {
  options = extend({
    tagName: 'div',
    display: false,
    size: 'normal',
    attributes: {}
  }, options)

  var field = {}
  Emitter(field)
  options.dataType = 'geojson'
  options.fieldType = options.display ? 'display' : 'input'

  options.onclick = function (e) {
    field.emit('click', e)
  }

  options.ondraw = function (e, value) {
    field.emit('draw', e, value)
    field.emit('update', e, value)
  }

  options.onedit = function (e, value) {
    field.emit('edit', e, value)
    field.emit('update', e, value)
  }

  /**
  Render the virtual-dom geojson data-field.
  * @param {function} h virtual-dom `h` function
  * @param {Object} properties an options object, including any properties you can pass to leaflet & virtual-dom/h
  * @param {Boolean} properties.display true for display mode, default is false for input mode
  * @param {Object} properties.value a geojson Feature or Featurecollection
  * @param {Object} value a geojson Feature or Featurecollection
  * @returns virtual-dom tree
  * @name field.render
  * @example
  * var createGeoJSONField = require('data-field-geojson')
  * var field = createGeoJSONField(options)
  * field.render(h, properties, geojsonObject)
  */
  field.render = function (h, properties, value) {
    properties = extend(options, properties)
    value = value || properties.value
    var map = field.map = createMap(value, properties)
    properties.className = createClassName(properties)
    return h(properties.tagName, properties, map)
  }

  return field
}
