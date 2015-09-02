var send = require('./github-send-list-request')

module.exports = function getBranches (options, callback) {
  send({
    url: 'https://api.github.com/repos/' + options.owner + '/' + options.repo + '/branches',
    headers: { authorization: 'token ' + options.token },
    json: true
  }, callback)
}
