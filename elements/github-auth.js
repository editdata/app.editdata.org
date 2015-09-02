var BaseElement = require('base-element')
var inherits = require('inherits')
var auth = require('../lib/github-auth')
var config = require('../config')
module.exports = Auth
inherits(Auth, BaseElement)

function Auth (options) {
  if (!(this instanceof Auth)) return new Auth(options)
  BaseElement.call(this)
}

Auth.prototype.verify = function (code, callback) {
  auth(code, callback)
}

Auth.prototype.renderButton = function () {
  var url = 'https://github.com/login/oauth/authorize?client_id=' + config.client_id + '&scope=repo&redirect_uri=' + config.redirect_uri

  return this.html('a.button.small', { href: url }, [
    this.html('i.fa.fa-github-square'),
    ' Sign in with GitHub'
  ])
}

Auth.prototype.renderProfile = function (state) {
  var h = this.html
  var elements = []
  var self = this

  var options = {
    href: state.user.profile.html_url,
    target: '_blank'
  }

  elements.push(h('div.profile', [
    h('a', options, [
      h('img', { src: state.user.profile.avatar_url }),
      h('span', state.user.profile.name)
    ])
  ]))

  elements.push(h('a.sign-out', {
    href: '#',
    onclick: function (e) {
      e.preventDefault()
      self.send('sign-out', e)
    }
  }, 'sign out'))

  return elements
}

Auth.prototype.render = function (state) {
  var h = this.html
  var elements = []

  elements.push(h('a.content-link', {
    href: '#/about'
  }, 'about'))

  // elements.push(h('a.content-link', {
  //   href: '#/docs'
  // }, 'docs'))

  if (!state.user.profile) {
    elements.push(this.renderButton())
  } else if (state.user.profile) {
    elements = elements.concat(this.renderProfile(state))
  }

  var vtree = h('div.github-auth' + (state.user ? '.active' : ''), elements)
  return this.afterRender(vtree)
}
