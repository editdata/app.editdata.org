var Storage = require('simple-local-storage')
var createApp = require('virtual-app')
var vdom = require('virtual-dom')
var xtend = require('xtend')

var ActionCreators = require('./actions')
var initialState = require('./lib/initial-state')
var RootContainer = require('./containers/root')
var modifier = require('./modifiers')
var store = new Storage()

var app = createApp(document.getElementById('app'), vdom)
var state = store.get('editdata') || initialState

var render = app.start(modifier, state)
var actions = ActionCreators(app.store)

app.on('*', function (action, state, oldState) {
  console.log('oldState ->', oldState)
  console.log('action ->', action)
  console.log('state ->', state)
  delete state.ui
  store.set('editdata', state)
})

render(function (state) {
  if (!state.ui) state.ui = initialState.ui
  var props = xtend(state, {
    store: app.store,
    actions: actions
  })
  return RootContainer(props)
})

var router = require('./lib/router')

router.on('/', function (params) {
  app.store(actions.setUrl())
})

router.on('/about', function (params) {
  app.store(actions.setUrl())
})

router.on('/edit', function (params) {
  app.store(actions.setUrl())
})

router.on('/edit/github/:owner/:repo/:branch', function () {
  app.store(actions.setUrl())
})

router.on('/docs', function (params) {
  app.store(actions.setUrl())
})

router.start()

module.exports = app
