var test = require('tape')
var h = require('virtual-dom/h')
var createField = require('../index')

test('create an input field', function (t) {
  var field = createField()
  var vtree = field.render(h, { value: 'example' })
  t.equal(vtree.tagName, 'TEXTAREA')
  t.end()
})

test('create a display field', function (t) {
  var field = createField()
  var vtree = field.render(h, {
    value: 'example',
    display: true
  })
  t.equal(vtree.tagName, 'DIV')
  t.end()
})
