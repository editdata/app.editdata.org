var send = require('./github-send-list-request')

module.exports = function orgs (user, callback) {
  send({
    url: 'https://api.github.com/user/orgs',
    headers: { authorization: 'token ' + user.token },
    json: true
  }, callback)
}
