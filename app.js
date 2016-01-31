var Storage = require('simple-local-storage')
var createApp = require('virtual-app')
var vdom = require('virtual-dom')
var xtend = require('xtend')

var initialState = require('./lib/initial-state')
var RootContainer = require('./containers/root')
var modifier = require('./modifiers')
var store = new Storage()

var app = createApp(document.getElementById('app'), vdom)
var render = app.start(modifier, store.get('editdata') || initialState)

app.on('*', function (action, state, oldState) {
  console.log('oldState ->', oldState)
  console.log('action ->', action)
  console.log('state ->', state)
  store.set('editdata', state)
})

render(function (state) {
  var props = xtend(state, { store: app.store })
  return RootContainer(props)
})

var actions = require('./actions')
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

app.store(actions.setUrl())

module.exports = app
