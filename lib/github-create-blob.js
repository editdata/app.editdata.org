var request = require('xhr')
var base64 = require('base-64')
var utf8 = require('utf8')

module.exports = function createBlob (options, callback) {
  var opts = {
    url: 'https://api.github.com/repos/' + options.owner + '/' + options.repo + '/contents/' + options.path,
    headers: { authorization: 'token ' + options.token },
    method: 'put',
    json: {
      path: options.path,
      message: options.message,
      content: base64.encode(utf8.encode(options.content)),
      branch: options.branch
    }
  }

  request(opts, function (err, res, body) {
    if (err) return callback(err)
    var save = {
      branch: options.branch,
      owner: options.owner,
      repo: options.repo,
      location: body.content,
      source: 'github'
    }
    callback(null, body, save)
  })
}
