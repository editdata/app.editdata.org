var Storage = require('simple-local-storage')
var xtend = require('xtend')
var merge = require('deep-merge')

var constants = require('../constants')

var store = new Storage()

module.exports = modifyState

function modifyState (action, state) {
  switch (action.type) {
    case constants.SET_URL:
      return xtend(state, { url: action.url })
    case constants.SAVE:
      return store.set('editdata', state)
    case constants.SET_USER:
      return xtend(state, { user: action.user })
    case constants.SET_USER_PROFILE:
      return merge(state, { user: { profile: action.profile } })
    case constants.NEW_ROW:
      var data = state.data
      data.push(action.row)
      return xtend(state, { data: data })
    case constants.NEW_COLUMN:
      var data = action.data
      var properties = action.properties
      return xtend(state, { data: data, properties: properties })
    default:
      return state
  }
}

// var qs = require('querystring')
// var Storage = require('simple-local-storage')
// var cookie = require('cookie-cutter')
// var extend = require('extend')
//
// var defaultState = {
//   site: {
//     title: 'EditData'
//   },
//   user: {
//     profile: null,
//     token: null
//   },
//   url: null,
//   data: [],
//   properties: {},
//   saveData: {
//     type: null,
//     source: null,
//     location: null,
//     branch: null
//   },
//   activeDataset: false,
//   menu: {
//     dropdowns: {
//       open: { open: false },
//       export: { open: false }
//     }
//   }
// }
//
// var store = new Storage()
// var state = window.state = extend(defaultState, (store.get('editdata') || {}))
//
// state.setUrl = function () {
//   console.log(window.location.href)
//   state.url = url.parse(window.location.href)
//   state.url.query = qs.parse(state.url.query)
//   return state.url
// }
//
// state.setUrl()
//
// state.save = function () {
//   store.set('editdata', state)
// }
//
// state.reset = function () {
//   state.user = {
//     profile: null,
//     token: null
//   }
//   state.data = []
//   state.properties = {}
//   state.activeDataset = false
//   state.saveData = {
//     type: null,
//     source: null,
//     location: null,
//     branch: null
//   }
//   store.set('editdata', state)
// }
//
// state.resetDataset = function () {
//   state.activeDataset = false
//   state.data = []
//   state.properties = {}
//   state.saveData = {
//     type: null,
//     source: null,
//     location: null,
//     branch: null
//   }
//   store.set('editdata', state)
// }
//
// if (!state.user) {
//   var token = cookie.get('editdata')
//   if (token && token !== 'undefined') {
//     state.user = { token: token }
//   }
// }
//
// module.exports = state
