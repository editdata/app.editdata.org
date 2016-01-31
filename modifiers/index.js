var schema = require('data-schema')()
var cuid = require('cuid')
var cookie = require('cookie-cutter')
var qs = require('qs')
var url = require('url')
var xtend = require('xtend')

var initialState = require('../lib/initial-state')
var constants = require('../constants')

module.exports = modifyState

function modifyState (action, state) {
  var data
  state = xtend(initialState, state)
  switch (action.type) {
    case constants.SET_URL:
      var newURL = url.parse(window.location.href)
      newURL.query = qs.parse(newURL.query)
      return xtend(state, { url: newURL })
    case constants.SIGN_OUT:
      cookie.set('editdata', '', { expires: new Date(0) })
      window.location = window.location.origin
      return initialState
    case constants.SET_USER:
      cookie.set('editdata', action.user.token)
      return xtend(state, { user: action.user })
    case constants.SET_USER_PROFILE:
      return xtend(state, {
        user: {
          profile: action.profile,
          token: state.token
        }
      })
    case constants.NEW_ROW:
      data = state.data
      var row = {
        key: state.data.length + 1,
        value: {}
      }
      Object.keys(state.properties).forEach(function (key) {
        row.value[key] = null
      })
      data.push(row)
      return xtend(state, { data: data })
    case constants.NEW_COLUMN:
      var property = action.property
      var properties = state.properties
      data = state.data
      if (!property.key) property.key = cuid()
      if (!property.type) property.type = 'string'
      if (!property.default) property.default = null

      var prop = schema.addProperty(property)
      properties[prop.key] = prop

      data.forEach(function (item) {
        item.value[property.key] = null
      })

      return xtend(state, {
        data: state.data,
        properties: state.properties
      })
    case constants.DESTROY:
      return xtend(state, {
        data: [],
        properties: {}
      })
    case constants.DESTROY_ROW:
      data = state.data
      var newData = data.filter(function (row) {
        return row.key !== action.key
      })
      return xtend(state, { data: newData })
    case constants.DESTROY_COLUMN:
      data = state.data
      properties = state.properties
      data.forEach(function (item) { delete item.value[action.key] })
      delete properties[action.key]
      return xtend(state, { data: data, properties: properties })
    case constants.RENAME_COLUMN:
      properties = state.properties
      properties[action.key].name = action.newName
      return xtend(state, { properties: properties })
    case constants.PROPERTY_TYPE:
      state.properties[action.propertyKey].type = action.propertyType
      return xtend(state, { properties: state.properties })
    case constants.SET_ACTIVE_ROW:
      return xtend(state, { activeRow: action.activeRow })
    case constants.SET_ACTIVE_PROPERTY:
      return xtend(state, { activeProperty: action.propertyKey })
    case constants.UPDATE_CELL_CONTENT:
      state.data.some(function (row) {
        if (row.key === action.rowKey) {
          row.value[action.propertyKey] = action.value
          return true
        }
      })
      return xtend(state, { rows: state.rows })
    case constants.SET_GITHUB_ORGS:
      action.orgs.unshift({ login: state.user.profile.login })
      return xtend(state, { githubOrgs: action.orgs })
    case constants.SET_GITHUB_REPOS:
      return xtend(state, { githubRepos: action.repos })
    case constants.CLEAR_REPOS:
      return xtend(state, { githubRepos: [], activeRepo: null })
    case constants.CLEAR_ORGS:
      return xtend(state, { githubOrgs: [], activeOrg: null })
    case constants.SELECTED_REPO:
      return xtend(state, { activeRepo: action.repo })
    case constants.SELECTED_ORG:
      return xtend(state, { activeOrg: action.org })
    case constants.SELECTED_BRANCH:
      return xtend(state, { activeBranch: action.branch })
    case constants.SELECTED_FILE:
      return xtend(state, {
        data: action.data,
        properties: action.properties,
        saveData: action.save || initialState.saveData
      })
    case constants.SET_GITHUB_BRANCHES:
      return xtend(state, { githubBranches: action.branches })
    case constants.SET_GITHUB_FILES:
      return xtend(state, { githubFiles: action.files })
    case constants.MODAL:
      if (action.value) {
        Object.keys(state.modals).forEach(function (key) {
          if (key === action.modal) {
            state.modals[key] = true
            return
          }
          state.modals[key] = false
        })
      } else {
        state.modals[action.modal] = false
      }
      return xtend(state, { modals: state.modals })
    case constants.MENU:
      if (action.value) {
        Object.keys(state.menus).forEach(function (key) {
          if (key === action.menu) {
            state.menus[key] = true
            return
          }
          state.menus[key] = false
        })
      } else {
        state.menus[action.menu] = false
      }
      return xtend(state, { menus: state.menus })
    case constants.SAVE_TO_GITHUB_SUCCESS:
      return xtend(state, { saveData: action.saveData })
    case constants.RESET:
      return xtend(state, {
        data: initialState.data,
        properties: initialState.properties
      })
    case constants.SET_FILENAME:
      return xtend(state, {
        filename: action.filename
      })
    case constants.SET_FILE_TYPE:
      return xtend(state, {
        fileType: action.fileType
      })
    default:
      return state
  }
}
