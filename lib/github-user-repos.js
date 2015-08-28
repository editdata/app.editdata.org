var request = require('xhr')

module.exports = function userRepos (user, callback) {
  var options = {
    url: 'https://api.github.com/users/' + user.profile.login + '/repos',
    headers: { authorization: 'token ' + user.token },
    json: true
  }

  request(options, function (err, res, body) {
    if (err) return callback(err)
    callback(null, body)
  })
}
