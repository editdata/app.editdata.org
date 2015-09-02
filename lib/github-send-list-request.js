var request = require('xhr')
var parseLinks = require('parse-link-header')

module.exports = function sendRequest (options, callback) {
  var results = []
  send(options.url)
  function send (url) {
    options.url = url
    request(options, function (err, res, body) {
      if (err) return callback(err)
      var links = parseLinks(res.headers.link)
      results = results.concat(body)
      if (links && links.next) send(links.next.url)
      else callback(null, results)
    })
  }
}
