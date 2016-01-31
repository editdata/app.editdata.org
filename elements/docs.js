var h = require('virtual-dom/h')

module.exports = Docs

function Docs (state) {
  return h('div.docs', [
    h('h1', 'Documentation')
  ])
}
