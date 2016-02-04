/*global requestAnimationFrame*/
var elClass = require('element-class')

module.exports = WidthHook

function WidthHook (propertiesLength, dataLength) {
  if (!(this instanceof WidthHook)) return new WidthHook(propertiesLength, dataLength)
  this.propertiesLength = propertiesLength
  this.dataLength = dataLength
}

WidthHook.prototype.hook = function () {
  var self = this
  requestAnimationFrame(function () {
    var columnsWidth = self.propertiesLength * 150
    var listActiveWidth = window.innerWidth - 20
    var itemActiveWidth = Math.floor(window.innerWidth * 0.55)
    var listEl = document.querySelector('.list-wrapper')

    if (self.dataLength) elClass(listEl).add('has-data')
    else elClass(listEl).remove('has-data')

    if (elClass(listEl).has('active')) {
      if (columnsWidth >= listActiveWidth) {
        listEl.style.width = 'inherit'
        listEl.style.right = '10px'
      } else if (columnsWidth >= itemActiveWidth) {
        listEl.style.width = (this.propertiesLength * 150 + 2).toString() + 'px'
      } else {
        listEl.style.width = 'inherit'
        listEl.style.right = 'inherit'
      }
    }
  })
}
