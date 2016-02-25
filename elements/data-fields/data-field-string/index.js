var extend = require('xtend')
var createClassName = require('../data-field-classname')

var defaultProps = {
  tagName: 'textarea',
  display: false,
  size: 'normal',
  fieldType: 'input',
  editable: true,
  attributes: {}
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
module.exports = function createStringField (options) {
  var h = options.h
  options = extend(defaultProps, options)
  options.dataType = 'string'

  if (!options.editable) {
    options.tagName = 'div'
    options.fieldType = 'display'
  }

  if (options.size === 'small') {
    options.attributes.rows = 1
  }

  options.className = createClassName(options)
  return h(options.tagName, options, String(options.value))
}
