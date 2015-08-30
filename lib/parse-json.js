var fromString = require('from2-string')
var JSONStream = require('JSONStream')
var union = require('lodash.union')

module.exports = function parseJSON (json, callback) {
  var properties = []
  var data = []
  var i = 0
  console.log(json)
  fromString(json)
    .pipe(JSONStream.parse('*'))
    .on('data', function (row) {
      console.log(row)
      data.push({ key: i, value: row })
      properties = union(properties, Object.keys(row))
      i++
    })
    .on('end', function () {
      console.log(data, properties)
      callback(null, data, properties)
    })
}
