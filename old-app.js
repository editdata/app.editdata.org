var cookie = require('cookie-cutter')
var h = require('virtual-dom/h')

var orgs = require('./lib/github-organizations')
var orgRepos = require('./lib/github-org-repos')
var repos = require('./lib/github-user-repos')
var profile = require('./lib/github-user-profile')
var router = require('./lib/router')
var state = require('./lib/state')
var editor = require('./lib/editor')(state)

var content = require('./elements/content')()
var header = require('./elements/header')(document.querySelector('header'))
var auth = require('./elements/github-auth')()
var landing = require('./elements/landing')()
var getStarted = require('./elements/get-started')()

auth.addEventListener('sign-out', function () {
  cookie.set('editdata', '', { expires: new Date(0) })
  state.user = null
  state.data = []
  state.properties = []
  window.location = window.location.origin
})

router.on('/', function (params) {
  if (state.user && state.gist) window.location.hash = '/edit/' + state.gist.id
  else if (state.user && !state.gist) window.location.hash = '/edit'
  else renderContent([landing.render(state)])
})

router.on('/about', function (params) {
  var about = require('./elements/about')()
  var html = about.render(state)
  renderContent([html])
})

router.on('/docs', function (params) {
  var docs = require('./elements/docs')()
  var html = docs.render(state)
  renderContent([html])
})

router.on('/edit', function (params) {
  if (!state.user) window.location.hash = '/'
  var html = getStarted.render(state)
  renderContent([html])
})

router.on('/edit/new', function (params) {
  if (!state.user) window.location.hash = '/'
  state.data = []
  state.properties = []
  renderEditor()
})

getStarted.addEventListener('click', function (source) {
  if (source === 'empty') {
    window.location.hash = '/edit/new'
  } else if (source === 'github') {
    openGithubFile()
  } else if (source === 'dat') {
    openDat()
  } else if (source === 'csv') {

  } else if (source === 'json') {

  }
})

function renderContent (elements) {
  document.getElementById('editor').style.display = 'none'
  document.getElementById('content').style.display = 'initial'
  header.render([auth.render(state)], state)
  content.render(elements)
}

function renderEditor () {
  document.getElementById('editor').style.display = 'initial'
  document.getElementById('content').style.display = 'none'
  header.render([auth.render(state)], state)
  editor.render(state)
}

if (state.url.query.code) {
  auth.verify(state.url.query.code, function (err, user) {
    if (err) console.error(err)
    state.user = user
    cookie.set('editdata', user.token)
    router.start()
    if (!state.gist) window.location = window.location.origin + '/#/edit'
  })
} else if (state.user && state.user.token) {
  profile(state.user.token, function (err, profile) {
    if (err) console.error(err)
    state.user.profile = profile
    router.start()
  })
} else {
  router.start()
}


