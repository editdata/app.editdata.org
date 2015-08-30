var send = require('./github-send-list-request')

module.exports = function userRepos (user, callback) {
  send({
    url: 'https://api.github.com/users/' + user.profile.login + '/repos',
    headers: { authorization: 'token ' + user.token },
    json: true
  }, callback)
}
