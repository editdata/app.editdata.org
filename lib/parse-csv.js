var fromString = require('from2-string')
var csvParser = require('csv-parser')
var union = require('lodash.union')

module.exports = function parseCSV (csv, callback) {
  var properties = []
  var data = []
  var i = 0

  fromString(csv)
    .pipe(csvParser())
    .on('data', function (row) {
      data.push({ key: i, value: row })
      properties = union(properties, Object.keys(row))
      i++
    })
    .on('end', function () {
      callback(null, data, properties)
    })
}
