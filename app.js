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

var app = createApp(vdom)
var state = store.get('editdata') || initialState
var render = app.start(modifier, state)
var router = require('./lib/router')(app)
app.router = router
var actions = ActionCreators(app)

var appEl = document.querySelector('#app')

app.on('*', function (action, state, oldState) {
  console.log('oldState ->', oldState)
  console.log('action ->', action)
  console.log('state ->', state)
  rendr()
  var storedState = xtend({}, state)
  delete storedState.ui
  store.set('editdata', storedState)
})

history(function (href) {
  return rendr(href)
})

function rendr (href) {
  href = href || url.parse(window.location.href).pathname
  var tree = render(function (state) {
    // TODO: Weird behavior where `app.store.getState` has more recent
    // state than `state`
    state = app.store.getState()
    if (!state.ui) state.ui = initialState.ui
    var props = xtend(state, {
      store: app.store,
      actions: actions
    })
    return router(href, props)
  })

  while (appEl.firstChild) {
    appEl.removeChild(appEl.firstChild)
  }
  appEl.appendChild(tree)
}

rendr()

module.exports = app
