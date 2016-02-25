var extend = require('xtend')
var Emitter = require('component-emitter')
var convert = require('object-array-converter')
var createClassName = require('data-field-classname')
var listEditor = require('list-editor')
var isarray = require('isarray')

/**
* Create a virtual-dom list (object or array) data-field for use with [data-ui](https://github.com/editdata/data-ui).
* @param {Object} options an options object, including any properties you can pass to virtual-dom/h
* @param {Boolean} options.display true for display mode, default is false for input mode
* @param {Boolean} options.keys, false for array mode, default is true for object mode
* @returns field
* @name createListField
* @example
* var createListField = require('data-field-string')
* var field = createListField()
* var tree = field.render(h, properties, ['a', 'b', 'c'])
*/
module.exports = function createListField (options) {
  options = extend({
    tagName: 'div',
    display: false,
    size: 'normal',
    fieldType: 'input',
    attributes: {}
  }, options)

  var field = {}
  Emitter(field)
  options.dataType = 'list'

  /**
  * Create a virtual-dom list (object or array) data-field for use with [data-ui](https://github.com/editdata/data-ui).
  * @param {function} h virtual-dom `h` function
  * @param {Object} properties an options object, including any properties you can pass to virtual-dom/h
  * @param {Boolean} properties.display true for display mode, default is false for input mode
  * @param {Boolean} properties.keys, false for array mode, default is true for object mode
  * @param {Object} properties.value an array or flat object
  * @param {Array} properties.value an array or flat object
  * @param {Object} value an array or flat object
  * @param {Array} value an array or flat object
  * @returns virtual-dom tree
  * @name createListField
  * @example
  * var createListField = require('data-field-string')
  * var field = createListField()
  * var tree = field.render(h, properties, ['a', 'b', 'c'])
  */
  field.render = function (h, properties, value) {
    properties = extend(options, properties)
    value = value || properties.value
    properties.items = value
    var keys = properties.keys

    if (isarray(value)) {
      value = convert.toObject(value)
    }

    properties.oninput = function (e, items, item) {

    }

    properties.onsubmit = function (e, items, item) {
      field.emit('update', e, items, item)
    }

    properties.removeItem = function (e, items) {
      field.emit('update', e, items)
    }

    var items = []
    if (properties.display) {
      properties.tagName = 'ul'
      properties.fieldType = 'display'
      items = Object.keys(value).map(function (key) {
        var item = value[key]
        var el = []
        if (keys) el.push(h('span.data-field-list-key', key + ': '))
        el.push(h('span.data-field-list-value', item))
        return h('li.data-field-list-item', el)
      })
    } else {
      items = [listEditor({ items: value, keys: keys }, properties)]
    }

    properties.className = createClassName(properties)
    return h(properties.tagName, properties, items)
  }

  return field
}
