var url = require('url')
var qs = require('querystring')
var Storage = require('simple-local-storage')
var cookie = require('cookie-cutter')
var extend = require('extend')

var store = new Storage()
var state = window.state = extend(defaultState, store.get('editdata'))

state.setUrl = function () {
  state.url = url.parse(window.location.href)
  state.url.query = qs.parse(state.url.query)
}

state.setUrl()

state.save = function () {
  store.set('editdata', state)
}

state.reset = function () {
  store.set('editdata', defaultState)
}

if (!state.user) {
  var token = cookie.get('editdata')
  if (token && token !== 'undefined') {
    state.user = { token: token }
  }
}

module.exports = state

var defaultState = {
  site: {
    title: 'EditData'
  },
  user: null,
  url: null,
  data: [],
  properties: [],
  saveData: {
    type: null,
    source: null,
    location: null,
    branch: null
  },
  menu: {
    dropdowns: {
      open: { open: false },
      export: { open: false }
    }
  }
}