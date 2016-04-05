var csvWriter = require('csv-write-stream')
var fromArray = require('from2-array')
var through = require('through2')
var getData = require('./get-data')

module.exports = function toCSV (properties, data, callback) {
  console.log('properties', properties)
  var csv = ''
  var writer = csvWriter({ headers: getPropertyNames(properties) })
  fromArray.obj(getData(properties, data))
    .pipe(through.obj(function (chunk, enc, next) {
      this.push(chunk)
      next()
    }))
    .pipe(writer)
    .on('data', function (data) {
      csv += data
    })
    .on('end', function () {
      callback(null, csv)
    })
}

function getPropertyNames (properties) {
  var names = []
  Object.keys(properties).forEach(function (key) {
    names.push(properties[key].name)
  })
  return names
}
