var assert = require('assert')
var type = require('type-of')

/**
*
* @name dataFormat.
* @param
* @example
*
*/
module.exports = function editor_isDataset (dataset) {
  assert(dataset.data, 'dataset.data property is required')
  assert(type(dataset.data) === 'array', 'dataset.data must be an array of objects')
  assert(dataset.properties, 'dataset.properties object is required')
  return true
}
