var test = require('tape')
var ActionCreators = require('../../actions')
var constants = require('../../constants')

function createStore () {
  return function (state) {
    return state
  }
}

test('ActionCreators(store) returns action creators', function (t) {
  t.plan(12)
  var store = createStore()
  var actions = ActionCreators({store: store})
  t.ok(actions.editor)
  t.ok(actions.github)
  t.ok(actions.save)
  t.ok(actions.file)
  t.ok(actions.modal)
  t.ok(actions.menu)
  t.ok(actions.reset)
  t.ok(actions.setUrl)
  t.ok(actions.setUser)
  t.ok(actions.setUserProfile)
  t.ok(actions.setRoute)
  t.ok(actions.signOut)
})

test('signOut', function (t) {
  t.plan(1)
  var store = createStore()
  var actions = ActionCreators({ store: store })
  var action = actions.signOut()
  t.equal(action.type, constants.SIGN_OUT)
})
