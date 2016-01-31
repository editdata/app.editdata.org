var h = require('virtual-dom/h')
var actions = require('../actions')
var About = require('../elements/about')
var Landing = require('../elements/landing')
var Editor = require('../elements/editor')
var GetStarted = require('../elements/get-started')
var Docs = require('../elements/docs')

module.exports = Router

function Router (props) {
  var store = props.store
  var user = props.user
  var url = props.url
  var view

  if (!url) url = { pathname: '/' }
  var query = url.query

  // User has a token but no profile, grab it from Github
  if (!user.profile && user.token) actions.getGithubProfile(user.token, store)

  // User is authenticating with Github OAuth
  if (!user.profile && query && query.code) actions.githubAuth(query.code, store)

  if (url.pathname === '/') {
    // User is already logged in, redirect to `Getting Started` page
    if (user.profile) actions.setRoute('/edit', store)
  }

  // `About` page
  if (url.pathname === '/about') {
    view = About(props)
  }

  if (url.pathname === '/edit') {
    if (!props.data.length) {
      // User does not have an active dataset
      view = GetStarted(props)
    } else {
      // User is working on an active dataset
      if (props.saveData &&
        props.saveData.owner &&
        props.saveData.repo &&
        props.saveData.branch &&
        props.saveData.location) {
        // The dataset came from Github, redirect to proper url
        actions.setRoute('/edit/github/' + props.saveData.owner + '/' + props.saveData.repo + '/' + props.saveData.branch, store)
        return h('div')
      } else {
        // The dataset was an uploaded file or a new dataset
        return Editor(props)
      }
    }
  }

  // New file
  if (url.pathname === '/edit/new') view = Editor(props)

  // Docs
  if (url.pathname === '/docs') view = Docs(props)

  // Editing a file from Github
  if (url.pathname.substring(0, 12) === '/edit/github') view = Editor(props)

  // Default view
  if (!view) view = Landing(props)

  return h('div#content', [
    h('div.content-wrapper', [
      h('div.content', view)
    ])
  ])
}
