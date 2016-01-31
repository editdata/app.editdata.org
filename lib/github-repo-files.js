var request = require('xhr')
var parseLinks = require('parse-link-header')

module.exports = function files (user, ownerLogin, repo, callback) {
  sendRequest({
    url: 'https://api.github.com/repos/' + ownerLogin + '/' + repo.name + '/git/trees/' + repo.default_branch + '?recursive=1',
    headers: { authorization: 'token ' + user.token },
    json: true
  }, callback)
}

function sendRequest (options, callback) {
  var results = []
  send(options.url)
  function send (url) {
    options.url = url
    request(options, function (err, res, body) {
      if (err) return callback(err)
      var links = parseLinks(res.headers.link)
      results = results.concat(body.tree)
      if (links && links.next) send(links.next.url)
      else callback(null, results)
    })
  }
}
