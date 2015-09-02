var h = require('virtual-dom/h')

module.exports = function (items, options) {
  var key = options.key || 'name'
  var list = []

  items.forEach(function (item) {
    list.push(h('li.item', {
      onclick: function () {
        options.onclick(item)
      }
    }, item[key]))
  })

  return list
}
