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
  var editor
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
      var user = xtend(state.user)
      user.profile = action.profile
      return xtend(state, { user: user })
    case constants.SET_NOTIFICATION:
      var notification = xtend(state.notification)
      notification.level = action.level
      notification.message = action.message
      return xtend(state, { notification: notification })
    case constants.NEW_ROW:
      editor = xtend(state.editor)
      var row = {
        key: editor.data.length + 1,
        value: {}
      }
      Object.keys(editor.properties).forEach(function (key) {
        row.value[key] = null
      })
      editor.data.push(row)
      return xtend(state, { editor: editor })
    case constants.NEW_COLUMN:
      var property = action.property
      editor = xtend(state.editor)
      if (!property.key) property.key = cuid()
      if (!property.default) property.default = null
      if (!property.type) property.type = ['string']
      if (typeof property.type === 'string') property.type = [property.type]

      var prop = schema.addProperty(property)
      editor.properties[prop.key] = prop

      editor.data.forEach(function (item) {
        item.value[property.key] = null
      })

      return xtend(state, { editor: editor })
    case constants.DESTROY:
      editor = xtend(state.editor)
      editor.data = []
      editor.properties = {}
      return xtend(state, { editor: editor })
    case constants.DESTROY_ROW:
      editor = xtend(state.editor)
      var newData = editor.data.filter(function (row) {
        return row.key !== action.key
      })
      editor.data = newData
      return xtend(state, { editor: editor })
    case constants.DESTROY_COLUMN:
      editor = xtend(state.editor)
      editor.data.forEach(function (item) {
        delete item.value[action.key]
      })
      delete editor.properties[action.key]
      return xtend(state, { editor: editor })
    case constants.RENAME_COLUMN:
      editor = xtend(state.editor)
      editor.properties[action.key].name = action.newName
      return xtend(state, { editor: editor })
    case constants.PROPERTY_TYPE:
      editor = xtend(state.editor)
      editor.properties[action.propertyKey].type = [action.propertyType]
      return xtend(state, { editor: editor })
    case constants.SET_ACTIVE_ROW:
      editor = xtend(state.editor)
      editor.activeRow = action.activeRow
      return xtend(state, { editor: editor })
    case constants.SET_ACTIVE_PROPERTY:
      editor = xtend(state.editor)
      editor.activeProperty = action.propertyKey
      return xtend(state, { editor: editor })
    case constants.UPDATE_CELL_CONTENT:
      editor = xtend(state.editor)
      editor.data.some(function (row) {
        if (row.key === action.rowKey) {
          row.value[action.propertyKey] = action.value
          return true
        }
      })
      return xtend(state, { editor: editor })
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
      editor = xtend(editor)
      editor.data = action.data
      editor.properties = action.properties
      editor.saveData = action.saveData || initialState.saveData
      return xtend(state, { editor: editor })
    case constants.SET_GITHUB_BRANCHES:
      return xtend(state, { githubBranches: action.branches })
    case constants.SET_GITHUB_FILES:
      return xtend(state, { githubFiles: action.files })
    case constants.MODAL:
      var ui = xtend(state.ui)
      if (action.value) {
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

      return xtend(state, { ui: ui })
    case constants.MENU:
      ui = xtend(state.ui)
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
      state = xtend(state, { ui: ui })
      return state
    case constants.SAVE_TO_GITHUB_SUCCESS:
      var file = xtend(state.file)
      file.saveData = action.saveData
      return xtend(state, { file: file })
    case constants.RESET:
      return xtend(state, { editor: initialState.editor })
    case constants.SET_FILENAME:
      file = xtend(state.file)
      file.name = action.filename
      return xtend(state, { file: file })
    case constants.SET_FILE_TYPE:
      file = xtend(state.file)
      file.type = action.fileType
      return xtend(state, { file: file })
    case constants.SET_FILE:
      editor = xtend(state.editor)
      editor.data = action.data
      editor.properties = action.properties
      return xtend(state, { editor: editor })
    case constants.CLOSE_MODALS:
      ui = xtend(state.ui)
      Object.keys(ui.modals).forEach(function (key) {
        ui.modals[key] = false
      })
      return xtend(state, { ui: ui })
    default:
      return state
  }
}
