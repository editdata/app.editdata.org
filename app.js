var cookie = require('cookie-cutter')

var state = require('./lib/state')
var router = require('./lib/router')
var app = require('./lib')('app', state)
var profile = require('./lib/github-user-profile')
var openGitHubFile = require('./lib/open-github-file')

router.on('/', function (params) {
  state.setUrl()
  if (state.user && state.user.token) {
    profile(state.user.token, function (err, profile) {
      if (err) console.error(err)
      state.user.profile = profile
      state.save()
      window.location = window.location.origin + '/#/edit'
    })
  } else if (state.url.query.code) {
    app.auth(state, function (err, user) {
      if (err) console.error(err)
      state.user = user
      state.save()
      cookie.set('editdata', user.token)
      window.location = window.location.origin + '/#/edit'
    })
  } else {
    var landing = require('./elements/landing')()
    var html = landing.render(state)
    app.renderContent(html, state)
  }
})

router.on('/edit', function (params) {
  var getStarted = require('./elements/get-started')()
  var html = getStarted.render(state)
  app.renderContent(html, state)

  getStarted.addEventListener('click', function (source) {
    if (source === 'empty') {
      window.location.hash = '/edit/new'
    } else if (source === 'github') {
      openGitHubFile(state, app, html, function (err, data, properties, save) {
        if (err) return console.error(err)
        state.data = data
        state.properties = properties
        state.saveData = save
        state.saveData.source = 'github'
        app.renderEditor([], state)
      })
    } else if (source === 'dat') {
      openDat()
    } else if (source === 'csv') {

    } else if (source === 'json') {

    }
  })
})

router.on('/edit/new', function (params) {
  
})

router.start()
