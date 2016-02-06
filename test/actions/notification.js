var test = require('tape')
var Notification = require('../../actions/notification')
var constants = require('../../constants')

function createStore () {
  return function (state) {
    return state
  }
}

test('Notification(store) returns action creators', function (t) {
  t.plan(1)
  var store = createStore()
  var actions = Notification(store)
  t.ok(actions.set)
})

test('set', function (t) {
  t.plan(3)
  var store = createStore()
  var actions = Notification(store)
  var action = actions.set('error', 'Foo')
  t.equal(action.type, constants.SET_NOTIFICATION)
  t.equal(action.level, 'error')
  t.equal(action.message, 'Foo')
})
