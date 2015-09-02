var request = require('xhr')

module.exports = function orgs (options, callback) {
  var requestOptions = {
    url: 'https://api.github.com/repos/' + options.owner + '/' + options.repo + '/contents/' + options.path,
    headers: { authorization: 'token ' + options.token },
    method: 'put',
    json: {
      path: options.path,
      message: options.message,
      content: window.btoa(options.content),
      sha: options.sha,
      branch: options.branch
    }
  }

  require('./github-get-blob')(options, function (err, res) {
    if (err) return callback(err)
    request(requestOptions, function (err, res, body) {
      if (err) return callback(err)
      callback(null, body)
    })
  })
}
