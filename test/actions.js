var test = require('tape')
var actions = require('../actions')
var constants = require('../constants')

function createStore () {
  return function (state) {
    return state
  }
}

test('signOut', function (t) {
  var store = createStore()
  t.plan(1)
  var action = actions.signOut(store)
  t.equal(action.type, constants.SIGN_OUT)
})
