var test = require('tape')
var h = require('virtual-dom/h')
var createField = require('../index')

test('create an input field', function (t) {
  var field = createField()
  var vtree = field.render(h, { value: 'example.com' })
  t.equal(vtree.tagName, 'INPUT')
  t.equal(vtree.properties.href, 'http://example.com')
  t.end()
})

test('create a display field', function (t) {
  var field = createField()
  var vtree = field.render(h, {
    value: 'example.com',
    display: true
  })
  t.equal(vtree.tagName, 'A')
  t.equal(vtree.properties.href, 'http://example.com')
  t.end()
})
