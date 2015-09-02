var fromString = require('from2-string')
var csvParser = require('csv-parser')
var schema = require('data-schema')()
var cuid = require('cuid')

module.exports = function parseCSV (csv, callback) {
  var properties = {}
  var data = []
  var i = 0

  fromString(csv)
    .pipe(csvParser())
    .on('data', function (row) {
      var rowkey
      var prop = {}

      if (row.key && row.value) {
        rowkey = row.key
        row = row.value
      } else {
        rowkey = cuid()
      }

      Object.keys(row).forEach(function (key) {
        prop = schema.inferType(key, row[key])
        if (!schema.find(key)) {
          schema.addProperty(prop)
          if (prop.key === 'categories') console.log(why, key, row)
          properties[prop.key] = prop
        }
      })

      data.push({ key: rowkey, value: schema.format(row) })
      i++
    })
    .on('end', function () {
      callback(null, data, properties)
    })
}
