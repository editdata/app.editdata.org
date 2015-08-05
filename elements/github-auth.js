var BaseElement = require('base-element')
var inherits = require('inherits')
var request = require('xhr')
var profile = require('../lib/get-profile')
var config = require('../config')
module.exports = Auth
inherits(Auth, BaseElement)

function Auth (options) {
  if (!(this instanceof Auth)) return new Auth(options)
  BaseElement.call(this)
}

Auth.prototype.verify = function (code, callback) {
  var user = {}
  var options = {
    url: 'http://192.241.225.150:9999/authenticate/' + code,
    json: true
  }

  request(options, function (err, res, body) {
    if (err) return callback(err)
    user.token = body.token
    profile(user.token, function (err, res) {
      if (err) return callback(err)
      user.profile = res
      callback(null, user)
    })
  })
}

Auth.prototype.render = function (state) {
  var h = this.html.bind(this)
  var elements = []
  var self = this

  if (!state.user) {
    var url = 'https://github.com/login/oauth/authorize?client_id=' + config.client_id + '&scope=gist&redirect_uri=' + config.redirect_uri

    var button = h('a.button.small', { href: url }, [
      h('i.fa.fa-github-square'),
      ' Sign in with GitHub'
    ])

    elements.push(button)
  } else if (state.user.profile) {
    var options = {
      href: state.user.profile.html_url,
      target: '_blank'
    }

    elements = [(h('div.profile', [
      h('a', options, [
        h('img', { src: state.user.profile.avatar_url }),
        h('span', state.user.profile.name)
      ])
    ])),
    h('a.sign-out', {
      href: '#',
      onclick: function (e) {
        e.preventDefault()
        self.send('sign-out', e)
      }
    }, 'sign out')]
  }

  var vtree = h('div.github-auth' + (state.user ? '.active' : ''), elements)
  return this.afterRender(vtree)
}
