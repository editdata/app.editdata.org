var request = require('xhr')
var ext = require('file-extension')
var fromString = require('from2-string')
var csvParser = require('csv-parser')
var union = require('lodash.union')

module.exports = function orgs (user, owner, repo, file, callback) {
  console.log(repo)
  var options = {
    url: 'https://api.github.com/repos/' + owner.login + '/' + repo.name + '/contents/' + file.path,
    headers: { authorization: 'token ' + user.token },
    json: true
  }

  var accept = ['csv']
  var comingSoon = ['tsv', 'json', 'geojson', 'yml']
  var type = ext(file.path)

  if (accept.indexOf(type) < 0) {
    if (comingSoon.indexOf(type) >= 0) {
      return callback(new Error(type + ' is not yet supported, but will be!'))
    }
    return callback(new Error(type + ' is not supported'))
  }

  request(options, function (err, res, body) {
    console.log('response from GET', body)
    if (err) return callback(err)
    var content = window.atob(body.content)

    if (type === 'csv') {
      loadCSV(content, function (err, data, properties) {
        callback(err, data, properties, type)
      })
    }
  })
}

function loadCSV (csv, callback) {
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
