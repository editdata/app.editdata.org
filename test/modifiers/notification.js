var test = require('tape')
var modifier = require('../../modifiers')
var constants = require('../../constants')

test('reducer handles SET_NOTIFICATION ', function (t) {
  t.plan(2)
  var state = modifier({
    type: constants.SET_NOTIFICATION,
    level: 'error',
    message: 'foo'
  }, {})
  t.equal(state.notification.level, 'error')
  t.equal(state.notification.message, 'foo')
})
