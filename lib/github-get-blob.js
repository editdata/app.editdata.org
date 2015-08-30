var request = require('xhr')
var ext = require('file-extension')

var parseCSV = require('./parse-csv')
var parseJSON = require('./parse-json')

module.exports = function orgs (user, owner, repo, file, callback) {
  var options = {
    url: 'https://api.github.com/repos/' + owner.login + '/' + repo.name + '/contents/' + file.path,
    headers: { authorization: 'token ' + user.token },
    json: true
  }

  var accept = ['csv', 'json']
  var comingSoon = ['tsv', 'geojson', 'yml']
  var type = ext(file.path)

  if (accept.indexOf(type) < 0) {
    if (comingSoon.indexOf(type) >= 0) {
      return callback(new Error(type + ' is not yet supported, but will be!'))
    }
    return callback(new Error(type + ' is not supported'))
  }

  function end (err, data, properties) {
    var save = {
      type: type,
      branch: repo.default_branch,
      owner: owner.login,
      repo: repo.name,
      location: file
    }
    callback(err, data, properties, save)
  }

  request(options, function (err, res, body) {
    if (err) return callback(err)
    var content = window.atob(body.content)

    if (type === 'csv') {
      parseCSV(content, end)
    } else if (type === 'json') {
      parseJSON(content, end)
    }
  })
}
