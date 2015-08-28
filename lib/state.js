var url = require('url')
var qs = require('querystring')
var Storage = require('simple-local-storage')
var cookie = require('cookie-cutter')
var extend = require('extend')

var store = new Storage()
var state = window.state = extend(store.get('editdata'), {
  site: {
    title: 'EditData'
  },
  gist: null,
  user: null,
  url: null,
  data: [],
  properties: [],
  menu: {
    dropdowns: {
      save: { open: false },
      open: { open: false },
      export: { open: false }
    }
  }
})

state.url = url.parse(window.location.href)
state.url.query = qs.parse(state.url.query)

if (!state.user) {
  var token = cookie.get('editdata')
  if (token && token !== 'undefined') {
    state.user = { token: token }
  }
}

module.exports = state
