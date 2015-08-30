var send = require('./github-send-list-request')

module.exports = function orgRepos (user, org, callback) {
  send({
    url: 'https://api.github.com/orgs/' + org + '/repos',
    headers: { authorization: 'token ' + user.token },
    json: true
  }, callback)
}
