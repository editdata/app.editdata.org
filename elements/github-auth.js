var h = require('virtual-dom').h
var config = require('../config')

module.exports = Auth

function SignInButton (h) {
  var url = 'https://github.com/login/oauth/authorize?client_id=' + config.client_id + '&scope=repo&redirect_uri=' + config.redirect_uri

  return h('a.button.small', { href: url }, [
    h('i.fa.fa-github-square'),
    ' Sign in with GitHub'
  ])
}

function Profile (props) {
  var actions = props.actions
  var elements = []

  var options = {
    href: props.user.profile.html_url,
    target: '_blank'
  }

  elements.push(h('div.profile', [
    h('a', options, [
      h('img', { src: props.user.profile.avatar_url }),
      h('span', props.user.profile.name)
    ])
  ]))

  elements.push(h('a.sign-out', {
    href: '#',
    onclick: function (e) {
      e.preventDefault()
      actions.signOut(props.store)
    }
  }, 'sign out'))

  return elements
}

function Auth (props) {
  var children = []

  children.push(h('a', {
    className: 'content-link',
    href: '/about'
  }, 'about'))

  // children.push(h('a.content-link', {
  //   href: '#/docs'
  // }, 'docs'))

  if (!props.user.profile) {
    children.push(SignInButton(h))
  } else if (props.user.profile) {
    children = children.concat(Profile(props))
  }

  return h('div.github-auth' + (props.user ? '.active' : ''), children)
}
