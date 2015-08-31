var element = require('base-element')
var inherits = require('inherits')
var createPopup = require('./popup')

module.exports = Headers
inherits(Headers, element)

function Headers (appendTo) {
  if (!(this instanceof Headers)) return new Headers(appendTo)
  element.call(this, appendTo)
}

Headers.prototype.render = function (properties) {
  var self = this
  var items = []

  Object.keys(properties).forEach(function (key) {
    var property = properties[key]
    items.push(self.html('li#' + property.key + '.list-header-item.data-list-property', [
      property.name,
      self.html('button#column-settings.small', {
        onclick: function (e) {
          var popup = createPopup(function () {
            self.send('close', property)
          })

          popup.addEventListener('render', function (el) {
            self.send('render', el, property)
          })

          popup.addEventListener('close', function (el) {
            self.send('close', el, property)
          })

          var newName = ''
          var el = popup.open([
            self.html('h1', property.name + ' settings'),
            self.html('h2', 'Manage the settings of this column'),
            self.html('h3', 'Change column type'),
            self.html('input.small.change-column-type', {
              type: 'text',
              oninput: function (e) {
                
              }
            }),
            self.html('button.small.button-blue', {
              onclick: function (e) {
                
              }
            }, 'Change type'),
            self.html('hr'),
            self.html('h3', 'Rename column'),
            self.html('input.small.rename-column', {
              type: 'text',
              oninput: function (e) {
                newName = e.target.value
                
              }
            }),
            self.html('button.small.button-blue', {
              onclick: function (e) {
                self.send('rename-column', property, newName, e)
              }
            }, 'Rename'),
            self.html('hr'),
            self.html('h3', 'Destroy column'),
            self.html('button.small.button-red', {
              onclick: function (e) {
                self.send('destroy-column', property, e)
              }
            }, 'Destroy ' + property.name + ' column')
          ])

          self.send('render', el, properties[key])
        }
      }, self.html('i.fa.fa-gear', ''))
    ]))
  })

  var vtree = this.html('ul.headers-list.data-list-properties', items)
  return this.afterRender(vtree)
}
