var extend = require('xtend')
var createClassName = require('../data-field-classname')

var defaultProps = {
  tagName: 'input',
  type: 'number',
  attributes: {},
  editable: true
}

/**
* Create a virtual-dom string data-field for use with [data-ui](https://github.com/editdata/data-ui).
* @param {function} h virtual-dom `h` function
* @param {Object} properties an options object, including any properties you can pass to virtual-dom/h
* @param {Boolean} properties.display true for display mode, default is false for input mode
* @param {String} properties.value any string
* @param {String} value any string
* @returns virtual-dom tree
* @name createStringField
* @example
* var createStringField = require('data-field-string')
* var field = createStringField()
* var vtree = field.render(h, {}, 'example string')
*/

module.exports = function NumberField (options) {
  var h = options.h
  options = extend(defaultProps, options)
  options.dataType = 'number'
  options.fieldType = 'input'
  options.className = createClassName(options)
  if (!options.editable) options.tagName = 'div'
  return h(options.tagName, options, options.value)
}
