var h = require('virtual-dom/h')
var Router = require('./router')
var Header = require('../elements/header')

module.exports = Container
function Container (props) {
  return h('div.app-container', [
    Header(props),
    Router(props)
  ])
}
