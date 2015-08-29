var request = require('xhr')

module.exports = function createBlob (options, callback) {
  var opts = {
    url: 'https://api.github.com/repos/' + options.owner + '/' + options.repo + '/contents/' + options.path,
    headers: { authorization: 'token ' + options.token },
    method: 'put',
    json: {
      path: options.path,
      message: options.message,
      content: window.btoa(options.content),
      branch: options.branch
    }
  }

  request(opts, function (err, res, body) {
    if (err) return callback(err)
    callback(null, body)
  })
}
