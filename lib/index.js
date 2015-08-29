var cookie = require('cookie-cutter')

module.exports = function (el, state) {
  var app = {
    el: document.getElementById(el),
    state: state
  }

  var container = require('../elements/container')(app.el)
  var header = require('../elements/header')()
  var content = require('../elements/content')()
  var auth = require('../elements/github-auth')()

  auth.addEventListener('sign-out', function () {
    cookie.set('editdata', '', { expires: new Date(0) })
    state.reset()
    window.location = window.location.origin
  })

  app.render = function render (elements, state) {
    app.state = state
    elements = [
      header.render([auth.render(state)], state),
    ].concat(elements)
    container.render(elements)
  }

  app.renderContent = function renderContent (elements, state) {
    var html = content.render(elements)
    app.render([html], state)
  }

  app.renderEditor = function renderEditor (elements, state) {
    
  }

  app.auth = function (state, callback) {
    auth.verify(state.url.query.code, callback)
  }

  return app
}
