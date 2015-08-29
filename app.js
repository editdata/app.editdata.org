var cookie = require('cookie-cutter')

var state = require('./lib/state')
var router = require('./lib/router')
var app = require('./lib')('app', state)
var profile = require('./lib/github-user-profile')
var notify = require('./elements/notify')
// var createPopup = require('./elements/popup')

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

  getStarted.addEventListener('click', function (type) {
    var info = notify(function () {
      app.renderContent([html], state)
    })

    setTimeout(function () {
      app.renderContent([html], state)
    }, 2000)

    app.renderContent([
      html,
      info.show({ type: 'info', message: type })
    ], state)
  })
})

router.start()
