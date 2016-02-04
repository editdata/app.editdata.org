var h = require('virtual-dom/h')

module.exports = Editor

function Editor (props, children) {
  return h('div#editor', children)
}
