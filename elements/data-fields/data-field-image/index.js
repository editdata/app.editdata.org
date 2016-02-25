var createClassName = require('data-field-classname')
var Emitter = require('component-emitter')
var addhttp = require('addhttp')
var extend = require('xtend')

/**
* Create a virtual-dom image data-field for use with [data-ui](https://github.com/editdata/data-ui).
* @param {Object} options options object
* @param {Boolean} options.display true for display mode, default is false for input mode
* @returns field
* @name createImageField
* @example
* var createImageField = require('data-field-image')
* var field = createImageField(options)
* var tree =  field.render(h, props, 'http://example.com/example.jpg')
*/
module.exports = function createImageField (options) {
  options = extend({
    tagName: 'input',
    type: 'url',
    display: false,
    size: 'normal',
    fieldType: 'input',
    attributes: {}
  }, options)

  var field = {}
  Emitter(field)
  options.dataType = 'url'

  /**
  * Render a virtual-dom image data-field.
  * @param {function} h virtual-dom `h` function
  * @param {Object} properties properties object for `h`
  * @param {Boolean} properties.display true for display mode, default is false for input mode
  * @param {String} properties.value any image url
  * @param {String} value any image url
  * @returns virtual-dom tree
  * @name createImageField
  * @example
  * var createImageField = require('data-field-image')
  * var field = createImageField(options)
  * var tree = field.render(h, props, 'http://example.com/example.jpg')
  */
  field.render = function (h, properties, value) {
    properties = extend(options, properties)
    properties.src = addhttp(properties.src || properties.value || value)
    properties.className = createClassName(properties)
    delete properties.size

    if (properties.display) {
      properties.tagName = 'img'
      properties.fieldType = 'display'
    } else {
      properties.oninput = function (e) {
        field.emit('update', e, e.target.value)
      }
    }
    return h(properties.tagName, properties, properties.src)
  }

  return field
}
