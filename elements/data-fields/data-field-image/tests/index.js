var test = require('tape')
var h = require('virtual-dom/h')
var createField = require('../index')

test('create an input field', function (t) {
  var field = createField()
  var vtree = field.render(h, { value: 'https://g.twimg.com/Twitter_logo_blue.png' })
  t.equal(vtree.tagName, 'INPUT')
  t.equal(vtree.properties.src, 'https://g.twimg.com/Twitter_logo_blue.png')
  t.end()
})

test('create a display field', function (t) {
  var field = createField()
  var vtree = field.render(h, {
    value: 'https://g.twimg.com/Twitter_logo_blue.png',
    display: true
  })
  t.equal(vtree.tagName, 'IMG')
  t.equal(vtree.properties.src, 'https://g.twimg.com/Twitter_logo_blue.png')
  t.end()
})
