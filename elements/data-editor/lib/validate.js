var jsonValidator = require('is-my-json-valid')

/**
* @name validator
* @private
*/
module.exports = function validator (schema, data) {
  var validate = jsonValidator(schema, { greedy: true, verbose: true })
  return validate(data)
}
