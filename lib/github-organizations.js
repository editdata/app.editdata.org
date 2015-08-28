var request = require('xhr')

module.exports = function orgs (user, callback) {
  var options = {
    url: 'https://api.github.com/user/orgs',
    headers: { authorization: 'token ' + user.token },
    json: true
  }

  request(options, function (err, res, body) {
    if (err) return callback(err)
    callback(null, body)
  })
}
