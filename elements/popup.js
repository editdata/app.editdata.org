var BaseElement = require('base-element')
var inherits = require('inherits')

module.exports = Popup
inherits(Popup, BaseElement)

function Popup (options) {
  if (!(this instanceof Popup)) return new Popup(options)
  BaseElement.call(this, options)
  this.visible = false
  this.width = options.width || 320
  this.height = options.height || 320
}

Popup.prototype.render = function (elements) {
  var self = this
  var vtree

  var width = (window.innerWidth > 800 ? 500 : 320)
  var height = (window.innerWidth > 800 ? 500 : 320)

  if (this.visible) {
    vtree = this.html('div.popup-overlay.visible', [
      this.html('div.popup-wrapper', {
        style: {
          width: width + 'px',
          height: height + 'px',
          marginLeft: -(width / 2) + 'px',
          marginTop: -(height / 2) + 'px',
          top: '50%',
          left: '50%'
        }
      }, [
        this.html('div.popup-header', [
          this.html('button.popup-close', {
            onclick: function () {
              self.close()
            }
          }, 'x')
        ]),
        this.html('section.popup', elements)
      ])
    ])
  } else {
    vtree = this.html('div.popup-overlay.hidden')
  }

  return this.afterRender(vtree)
}

Popup.prototype.close = function () {
  this.visible = false
  this.render()
}

Popup.prototype.open = function (elements) {
  this.visible = true
  this.render(elements)
}

Popup.prototype.toggle = function (elements) {
  this.visible = !this.visible
  if (!this.visible) {
    this.render()
  } else {
    this.render(elements)
  }
}
