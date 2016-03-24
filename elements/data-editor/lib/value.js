var emitter = require('component-emitter')

module.exports = function (options) {
  var value = {}
  emitter(value)

  value.get = function editor_value_get (state, rowKey, propertyKey) {

  }

  value.create = function editor_value_create (state, rowKey, propertyKey, value) {
    
  }

  value.update = function editor_value_update (state, rowKey, propertyKey, value) {

  }

  value.remove = function editor_value_remove (state, rowKey, propertyKey) {

  }

  value.validate = function editor_value_validate (state, rowKey, propertyKey, value) {

  }

  return value
}
