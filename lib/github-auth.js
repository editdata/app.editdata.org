var request = require('xhr')
var profile = require('../lib/github-user-profile')
var config = require('../config')

module.exports = function (code, callback) {
  var user = {}
  var options = {
    url: config.gatekeeper + '/authenticate/' + code,
    json: true
  }

  request(options, function (err, res, body) {
    if (err) return callback(err)
    user.token = body.token
    profile(user.token, function (err, res) {
      if (err) return callback(err)
      user.profile = res
      callback(null, user)
    })
  })
}
