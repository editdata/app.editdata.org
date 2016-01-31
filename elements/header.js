// var h = require('virtual-dom').h
var GithubAuth = require('./github-auth')

module.exports = Header

function Header (props) {
  var site = props.site
  var h = props.app.h

  return h('header', [
    h('div.container', [
      h('h1.site-title', [
        h('a', { href: '/' }, site.title)
      ]),
      GithubAuth(props)
    ])
  ])
}
