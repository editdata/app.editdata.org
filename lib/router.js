var sheetRouter = require('sheet-router')
var Index = require('../pages/index')
var About = require('../pages/about')
var Editor = require('../pages/editor')

module.exports = Router

function Router (app) {
  return sheetRouter(function (route, thunk) {
    return [
      route('/', function (o, props) {
        return Index(props)
      }),
      route('/about', function (o, props) {
        return About(props)
      }),
      route('/edit', [
        route('/', function (o, props) {
          return Editor(props)
        }),
        route('/new', function (o, props) {
          return Editor(props)
        }),
        route('/github/:owner/:repo/:branch', function (o, props) {
          return Editor(props)
        })
      ])
    ]
  })
}
