var request = require('xhr')

module.exports = function files (user, owner, repo, callback) {
  var options = {
    url: 'https://api.github.com/repos/' + owner.login + '/' + repo.name + '/git/trees/' + repo.default_branch + '?recursive=1',
    headers: { authorization: 'token ' + user.token },
    json: true
  }

  request(options, function (err, res, body) {
    if (err) return callback(err)
    callback(null, body)
  })
}
