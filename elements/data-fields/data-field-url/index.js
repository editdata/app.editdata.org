var Emitter = require('component-emitter')
var extend = require('xtend')
var createClassName = require('data-field-classname')
var addhttp = require('addhttp')

/**
* Create a virtual-dom url data-field for use with [data-ui](https://github.com/editdata/data-ui).
* @param {Object} options an options object, including any properties you can pass to virtual-dom/h
* @param {Boolean} options.display true for display mode, default is false for input mode
* @returns field
* @name createURLField
* @example
* var createURLField = require('data-field-url')
* var field = createURLField()
* var vtree = field.render(h, {}, 'http://example.com')
*/
module.exports = function createURLField (options) {
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

  options.oninput = function (e) {
    field.emit('update', e, e.target.value)
  }

  /**
  * Create a virtual-dom url data-field for use with [data-ui](https://github.com/editdata/data-ui).
  * @param {function} h virtual-dom `h` function
  * @param {Object} properties an options object, including any properties you can pass to virtual-dom/h
  * @param {Boolean} properties.display true for display mode, default is false for input mode
  * @param {String} properties.value any url
  * @param {String} value any url
  * @returns virtual-dom tree
  * @name createURLField
  * @example
  * var createURLField = require('data-field-url')
  * var field = createURLField()
  * var vtree = field.render(h, {}, 'http://example.com')
  */
  field.render = function (h, properties, value) {
    properties = extend(options, properties)
    properties.href = addhttp(properties.href || properties.value || value)
    properties.value = properties.href
    properties.className = createClassName(properties)
    delete properties.size

    if (properties.display) {
      properties.tagName = 'a'
      properties.fieldType = 'display'
    }

    return h(properties.tagName, properties, properties.href)
  }

  return field
}
