var request = require('xhr')

module.exports = function orgs (user, save, content, message, callback) {
  var options = {
    url: 'https://api.github.com/repos/' + save.owner + '/' + save.repo + '/contents/' + save.location.path,
    headers: { authorization: 'token ' + user.token },
    method: 'put',
    json: {
      path: save.location.path,
      message: message,
      content: window.btoa(content),
      sha: save.location.sha,
      branch: save.branch
    }
  }

  request(options, function (err, res, body) {
    if (err) return callback(err)
    callback(null, body)
  })
}
