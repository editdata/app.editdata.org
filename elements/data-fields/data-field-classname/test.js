var test = require('tape')
var createClassName = require('./index')

test('create a classname', function (t) {
  var className = createClassName({
    dataType: 'string',
    fieldType: 'display',
    size: 'normal'
  })
  t.equal(className, 'data-field data-field-string data-field-display data-field-display-normal')
  t.end()
})

test('require type', function (t) {
  try {
    createClassName({
      size: 'normal',
      fieldType: 'display'
    })
  } catch (err) {
    t.equal(err.message, 'options.dataType property required')
  }
  t.end()
})

test('require fieldType', function (t) {
  try {
    createClassName({
      dataType: 'string',
      size: 'normal'
    })
  } catch (err) {
    t.equal(err.message, 'options.fieldType property required')
  }
  t.end()
})

test('require size', function (t) {
  try {
    createClassName({
      dataType: 'string',
      fieldType: 'display'
    })
  } catch (err) {
    t.equal(err.message, 'options.size property required')
  }
  t.end()
})
