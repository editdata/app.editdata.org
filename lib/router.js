var sheetRouter = require('sheet-router')
var Index = require('../pages/index')
var About = require('../pages/about')
var Support = require('../pages/support')
var Editor = require('../pages/editor')

module.exports = Router

function Router (app) {
  return sheetRouter(function (route, thunk) {
    return [
      thunk('/', function (o, props) {
        return Index(props)
      }),
      thunk('/about', function (o, props) {
        return About(props)
      }),
      thunk('/support', function (o, props) {
        return Support(props)
      }),
      route('/edit', [
        thunk('/', function (o, props) {
          return Editor(props)
        }),
        thunk('/new', function (o, props) {
          return Editor(props)
        }),
        thunk('/github/:owner/:repo/:branch', function (o, props) {
          return Editor(props)
        })
      ])
    ]
  })
}
