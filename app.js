var Storage = require('simple-local-storage')
var history = require('sheet-router/history')
var createApp = require('virtual-app')
var vdom = require('virtual-dom')
var xtend = require('xtend')
var url = require('url')

var ActionCreators = require('./actions')
var initialState = require('./lib/initial-state')
var modifier = require('./modifiers')
var store = new Storage()

var config = require('./config')
var app = createApp(vdom)
var state = xtend({}, store.get(config.slug) || initialState)
var render = app.start(modifier, state)
var router = require('./lib/router')(app)
app.router = router
var actions = ActionCreators(app)

var appEl = document.querySelector('#app')
var href

var tree = render(function (state) {
  href = href || url.parse(window.location.href).pathname
  if (!state.ui) state.ui = xtend({}, initialState.ui)
  var props = xtend({}, state, {
    store: app.store,
    actions: actions
  })
  return router(href)(xtend({}, props))
})

app.on('*', function (action, state, oldState) {
  // console.log('ACTION', action.type, action)
  var storedState = xtend({}, state)
  delete storedState.ui
  store.set(config.slug, storedState)
})

history(function (href) {
  href = href || url.parse(window.location.href).pathname
  actions.setRoute(href)
})

appEl.appendChild(tree)

module.exports = app
