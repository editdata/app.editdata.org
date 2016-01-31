var getData = require('./get-data')

module.exports = function toJSON (properties, data) {
  return JSON.stringify(getData(properties, data))
}
