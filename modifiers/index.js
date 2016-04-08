var schema = require('data-schema')()
var cuid = require('cuid')
var cookie = require('cookie-cutter')
var qs = require('qs')
var url = require('url')
var xtend = require('deep-extend')

var initialState = require('../lib/initial-state')
var constants = require('../constants')

module.exports = modifyState

function modifyState (action, state) {
  var editor
  state = xtend({}, initialState, state)
  switch (action.type) {
    case constants.SET_URL:
      var newURL = url.parse(window.location.href)
      newURL.query = qs.parse(newURL.query)
      return xtend({}, state, { url: newURL })
    case constants.SIGN_OUT:
      cookie.set('editdata', '', { expires: new Date(0) })
      return initialState
    case constants.SET_USER:
      cookie.set('editdata', action.user.token)
      return xtend({}, state, { user: action.user })
    case constants.SET_USER_PROFILE:
      var user = xtend({}, state.user)
      user.profile = action.profile
      return xtend({}, state, { user: user })
    case constants.SET_NOTIFICATION:
      var notification = xtend({}, state.notification)
      notification.level = action.level
      notification.message = action.message
      return xtend({}, state, { notification: notification })
    case constants.UNSET_NOTIFICATION:
      return xtend({}, state, { notification: { level: null, message: null } })
    case constants.NEW_ROW:
      var data = state.data.slice()
      var row = {
        key: data.length + 1,
        value: {}
      }
      Object.keys(state.properties).forEach(function (key) {
        row.value[key] = null
      })
      data.push(row)
      return xtend({}, state, { data: data })
    case constants.NEW_COLUMN:
      var property = action.property
      var properties = xtend({}, state.properties)
      data = state.data.slice()
      if (!property.key) property.key = cuid()
      if (!property.default) property.default = null
      if (!property.type) property.type = ['string']
      if (typeof property.type === 'string') property.type = [property.type]

      var prop = schema.addProperty(property)
      properties[prop.key] = prop

      data.forEach(function (item) {
        item.value[property.key] = null
      })
      delete state.data
      delete state.properties
      return xtend({}, state, { properties: properties, data: data })
    case constants.DESTROY:
      delete state.data
      delete state.properties
      return xtend({}, state, { data: [], properties: {} })
    case constants.DESTROY_ROW:
      data = state.data.slice()
      var newData = data.filter(function (row) {
        return row.key !== action.key
      })
      delete state.data
      return xtend({}, state, { data: newData })
    case constants.DESTROY_COLUMN:
      data = state.data.slice()
      data.forEach(function (item) {
        delete item.value[action.key]
      })
      delete state.properties[action.key]
      return xtend({}, state, { data: data })
    case constants.RENAME_COLUMN:
      state.properties[action.key].name = action.newName
      return xtend({}, state)
    case constants.PROPERTY_TYPE:
      state.properties[action.propertyKey].type = [action.propertyType]
      return xtend({}, state)
    case constants.SET_ACTIVE_ROW:
      editor = xtend({}, state.editor)
      editor.activeRow = action.activeRow
      return xtend({}, state, { editor: editor })
    case constants.SET_ACTIVE_PROPERTY:
      editor = xtend({}, state.editor)
      editor.activeProperty = action.propertyKey
      return xtend({}, state, { editor: editor })
    case constants.UPDATE_ROW:
      data = state.data.slice()
      data.forEach(function (row, i) {
        if (row.key === action.row.key) {
          data[i] = action.row
        }
      })
      return xtend({}, state, { data: data })
    case constants.SET_GITHUB_ORGS:
      action.orgs.unshift({ login: state.user.profile.login })
      return xtend({}, state, { githubOrgs: action.orgs })
    case constants.SET_GITHUB_REPOS:
      return xtend({}, state, { githubRepos: action.repos })
    case constants.CLEAR_REPOS:
      return xtend({}, state, { githubRepos: [], activeRepo: null })
    case constants.CLEAR_ORGS:
      return xtend({}, state, { githubOrgs: [], activeOrg: null })
    case constants.CLEAR_BRANCHES:
      return xtend({}, state, { githubBranches: [], activeBranch: null })
    case constants.UNSET_ACTIVE_GITHUB_SELECTIONS:
      return xtend({}, state, { activeOrg: null, activeRepo: null, activeBranch: null })
    case constants.SELECTED_REPO:
      return xtend({}, state, { activeRepo: action.repo })
    case constants.SELECTED_ORG:
      return xtend({}, state, { activeOrg: action.org })
    case constants.SELECTED_BRANCH:
      return xtend({}, state, { activeBranch: action.branch })
    case constants.SELECTED_FILE:
      state.data = action.data
      state.properties = action.properties
      state.file.saveData = action.saveData || initialState.saveData
      state.file.name = action.saveData.location.name
      state.file.type = state.file.name.split('.')[1]
      return xtend({}, state, { activeOrg: null, activeRepo: null, activeBranch: null })
    case constants.SET_GITHUB_BRANCHES:
      return xtend({}, state, { githubBranches: action.branches })
    case constants.SET_GITHUB_FILES:
      return xtend({}, state, { githubFiles: action.files })
    case constants.MODAL:
      var ui = xtend({}, state.ui)
      var editor = xtend({}, state.editor)

      if (action.value) {
        editor.activeProperty = null
        Object.keys(ui.modals).forEach(function (key) {
          if (key === action.modal) {
            ui.modals[key] = true
            return
          }
          ui.modals[key] = false
        })
      } else {
        ui.modals[action.modal] = false
      }

      return xtend({}, state, { ui: ui, editor: editor })
    case constants.MENU:
      ui = xtend({}, state.ui)
      if (action.value) {
        Object.keys(ui.menus).forEach(function (key) {
          if (key === action.menu) {
            ui.menus[key] = true
            return
          }
          ui.menus[key] = false
        })
      } else {
        ui.menus[action.menu] = false
      }
      state = xtend({}, state, { ui: ui })
      return state
    case constants.SAVE_TO_GITHUB_SUCCESS:
      var file = xtend({}, state.file)
      file.saveData = action.saveData
      return xtend({}, state, { file: file, activeOrg: null, activeRepo: null, activeBranch: null })
    case constants.RESET:
      return xtend({}, state, { editor: initialState.editor })
    case constants.SET_FILENAME:
      file = xtend({}, state.file)
      file.name = action.filename
      return xtend({}, state, { file: file })
    case constants.SET_FILE_TYPE:
      file = xtend({}, state.file)
      file.type = action.fileType
      return xtend({}, state, { file: file })
    case constants.SET_FILE:
      state.data = action.data
      state.properties = action.properties
      state.editor.activeProperty = null
      state.editor.activeRow = null
      return xtend({}, state)
    case constants.CLOSE_MODALS:
      ui = xtend({}, state.ui)
      Object.keys(ui.modals).forEach(function (key) {
        ui.modals[key] = false
      })
      return xtend({}, state, { ui: ui })
    default:
      return xtend({}, state)
  }
}
