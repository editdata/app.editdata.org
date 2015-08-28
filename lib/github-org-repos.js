var request = require('xhr')

module.exports = function userRepos (user, org, callback) {
  var options = {
    url: 'https://api.github.com/orgs/' + org + '/repos',
    headers: { authorization: 'token ' + user.token },
    json: true
  }

  request(options, function (err, res, body) {
    if (err) return callback(err)
    callback(null, body)
  })
}
