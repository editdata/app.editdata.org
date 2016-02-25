var assert = require('assert')

module.exports = function createClassName (options) {
  options = options || {}
  options.className = options.className ? options.className + ' ' : ''
  assert.ok(options.dataType, 'options.dataType property required')
  assert.ok(options.fieldType, 'options.fieldType property required')
  // assert.ok(options.size, 'options.size property required')
  return options.className + 'data-field data-field-' + options.dataType + ' data-field-' + options.fieldType + ' data-field-' + options.fieldType + '-' + options.size
}
