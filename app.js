var cookie = require('cookie-cutter')
var keycode = require('keycode')

var state = require('./lib/state')
var router = require('./lib/router')
var app = require('./lib')('app', state)
var profile = require('./lib/github-user-profile')

router.on('/', function (params) {
  state.setUrl()
  if (state.user && state.user.token) {
    profile(state.user.token, function (err, profile) {
      if (err) console.error(err)
      if (profile.message === 'Bad credentials') return console.error(profile)
      state.user.profile = profile
      state.save()
      router.go('/edit')
    })
  } else if (state.url.query.code) {
    app.auth(state, function (err, user) {
      if (err) console.error(err)
      state.user = user
      state.save()
      cookie.set('editdata', user.token)
      router.go('/edit', { query: false })
    })
  } else {
    var landing = require('./elements/landing')()
    var html = landing.render(state)
    app.renderContent(html, state)
  }
})

router.on('/edit', function (params) {
  if (state.activeDataset) {
    if (state.saveData.owner && state.saveData.repo && state.saveData.branch && state.saveData.location) {
      return router.go('/edit/github/' + state.saveData.owner + '/' + state.saveData.repo + '/' + state.saveData.branch + '/' + state.saveData.location.path)
    } else {
      return router.go('/edit/new')
    }
  }

  var getStarted = require('./elements/get-started')()
  var html = getStarted.render(state)
  app.renderContent(html, state)

  getStarted.addEventListener('click', function (source) {
    var popup = app.openFile(source, state)

    console.log(popup)

    popup.addEventListener('render', function (popupEl) {
      app.renderContent([html, popupEl], state)
    })

    popup.addEventListener('close', function () {
      app.renderContent(html, state)
    })

    popup.addEventListener('done', function (data, properties, save) {
      state.data = data
      state.properties = properties
      if (save) state.saveData = save
      state.activeDataset = true
      state.save()
      app.renderEditor([], state)
    })
  })
})

router.on('/edit/new', function (params) {
  app.renderEditor([], state)
})

router.on('/edit/github/:owner/:repo/:branch/:path', function (params) {
  state.setUrl()
  app.renderEditor([], state)
})

router.start()

document.addEventListener('keydown', function (e) {
  var key = keycode(e)

  if (key === 'tab') {
    var el = document.activeElement
    console.log(el.id)
  }
})
