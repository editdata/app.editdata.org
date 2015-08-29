var BaseElement = require('base-element')
var inherits = require('inherits')

module.exports = Notify
inherits(Notify, BaseElement)

function Notify (options, onclose) {
  if (!(this instanceof Notify)) return new Notify(options, onclose)
  BaseElement.call(this)
  if (typeof options === 'function') {
    onclose = options
    options = {}
  }
  this.onclose = onclose
  this.showing = false
}

Notify.prototype.render = function (state) {
  var h = this.html
  var self = this
  var vtree

  if (this.showing) {
    vtree = h('div.notify.notify-' + state.type, {
      onclick: function (e) {
        self.hide()
      }
    }, [
      h('div.message', state.message)
    ])
  } else {
    vtree = h('div.notify.hidden')
  }

  return this.afterRender(vtree)
}

Notify.prototype.show = function (options) {
  this.showing = true
  return this.render(options)
}

Notify.prototype.hide = function () {
  this.showing = false
  if (this.onclose) this.onclose()
  return this.render({})
}
