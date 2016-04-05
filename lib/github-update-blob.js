var request = require('xhr')
var base64 = require('base-64')
var utf8 = require('utf8')

module.exports = function orgs (options, callback) {
  var requestOptions = {
    url: 'https://api.github.com/repos/' + options.owner + '/' + options.repo + '/contents/' + options.path,
    headers: { authorization: 'token ' + options.token },
    method: 'put',
    json: {
      path: options.path,
      message: options.message,
      content: base64.encode(utf8.encode(options.content)),
      sha: options.sha,
      branch: options.branch
    }
  }
  console.log('github update blob')
  require('./github-get-blob')(options, function (err, res) {
    if (err) return callback(err)
    console.log('get happen')
    request(requestOptions, function (err, res, body) {
      if (err) return callback(err)
      console.log('put happen')
      callback(null, body)
    })
  })
}
