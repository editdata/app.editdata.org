var BaseElement = require('base-element')
var inherits = require('inherits')

module.exports = Content
inherits(Content, BaseElement)

function Content () {
  if (!(this instanceof Content)) return new Content()
  BaseElement.call(this)
}

Content.prototype.render = function (elements, state) {
  var h = this.html
  return this.afterRender(
    h('div#content', [
      h('div.content-wrapper', [
        h('div.content', elements)
      ])
    ])
  )
}
