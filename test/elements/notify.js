var createElement = require('virtual-dom/create-element')
var dom = require('dom-events')
var test = require('tape')

var Notify = require('../../elements/notify')

test('Notify returns a <div> with class `notify`', function (t) {
  t.plan(2)
  var vnode = Notify({})
  var element = createElement(vnode)
  t.equal(element.tagName, 'DIV')
  t.equal(element.classList[0], 'notify')
})

test('Notify returns a <div> with class `notify-{props.level}`', function (t) {
  t.plan(1)
  var vnode = Notify({ level: 'success' })
  var element = createElement(vnode)
  t.equal(element.classList[1], 'notify-success')
})

test('Notify returns a <p> with {props.message}', function (t) {
  t.plan(1)
  var vnode = Notify({ message: 'Foo' })
  var element = createElement(vnode).children[0]
  t.equal(element.innerText, 'Foo')
})

test('Notify execs `props.close` when button is clicked', function (t) {
  t.plan(1)
  var vnode = Notify({
    close: function () {
      t.ok(true)
    }
  })
  var element = createElement(vnode)
  dom.emit(element, 'click')
})
