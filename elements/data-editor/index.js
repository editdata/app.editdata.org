var createElement = require('virtual-dom/create-element')
var widget = require('virtual-widget')
var h = require('virtual-dom/h')

function init () {
  var el = createElement(h('div#editor', this.children))
  this.format = require('./lib/format')(this.state)
  this.rows = require('./lib/rows')(this.state)
  this.properties = require('./lib/properties')(this.state)
  this.metadata = require('./lib/metadata')(this.state)

  this.init = function editor_init (dataset) {
    return this.format.init(dataset)
  }
  this.reset = function editor_reset () {
    var self = this
    return { data: [], properties: {}, metadata: self.format.initMetadata() }
  }
  this.toNameFormat = function editor_toNameFormat (dataset) {}
  this.toGeoJSON = function editor_toGeoJSON (dataset) {}
  return el
}

function update (prev, el) {}
function destroy (el) {}

module.exports = widget({
  init: init,
  update: update,
  destroy: destroy
})
