var request = require('xhr')

module.exports = function profile (token, callback) {
  var options = {
    url: 'https://api.github.com/user',
    headers: { authorization: 'token ' + token },
    json: true
  }

  request(options, function (err, res, body) {
    if (err) return callback(err)
    callback(null, body)
  })
}
