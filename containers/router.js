var h = require('virtual-dom/h')
var About = require('../elements/about')
var Landing = require('../elements/landing')
var Editor = require('./editor')
var Docs = require('../elements/docs')

module.exports = Router

function Router (props) {
  var actions = props.actions
  var editor = props.editor
  var user = props.user
  var url = props.url
  var view

  if (!url) url = { pathname: '/' }
  var query = url.query

  // User is working on an active dataset
  if (editor.saveData &&
    editor.saveData.owner &&
    editor.saveData.repo &&
    editor.saveData.branch &&
    editor.saveData.location) {
    // The dataset came from Github, redirect to proper url
    actions.setRoute('/edit/github/' + editor.saveData.owner + '/' + editor.saveData.repo + '/' + editor.saveData.branch)
  }

  // User has a token but no profile, grab it from Github
  if (!user.profile && user.token) actions.github.auth(user.token)

  // User is authenticating with Github OAuth
  if (!user.profile && query && query.code) actions.github.auth(query.code)

  if (url.pathname === '/') {
    // User is already logged in, redirect to `Getting Started` page
    if (user.profile) actions.setRoute('/edit')
  }

  // `About` page
  if (url.pathname === '/about') {
    view = About(props)
  }

  // Docs
  if (url.pathname === '/docs') view = Docs(props)

  // Editor
  if (url.pathname.substring(0, 5) === '/edit') view = Editor(props)

  // Default view
  if (!view) view = Landing(props)

  return h('div#content', [
    h('div.content-wrapper', [
      h('div.content', view)
    ])
  ])
}
