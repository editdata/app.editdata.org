var h = require('virtual-dom/h')
var Thunk = require('vdom-thunk')
var partial = require('vdom-thunk/partial')
var diff = require('deep-diff').diff
var xtend = require('deep-extend')

var OpenUploadedFile = require('../elements/open-uploaded-file')
var OpenGithubFile = require('../elements/open-github-file')
var ColumnSettings = require('../elements/column-settings')
var CreateNewColumn = require('../elements/create-column')
var SaveToGithub = require('../elements/save-to-github')
var SaveFile = require('../elements/save-file')
var MenuBar = require('../elements/menu-bar')
var Header = require('../elements/header')
var Notify = require('../elements/notify')
var Popup = require('../elements/popup')
var DataGrid = require('data-grid')
var DataForm = require('data-form')

module.exports = EditorContainer

function EditorContainer (props) {
  var notification = props.notification
  var modals = props.ui.modals
  var actions = props.actions
  var editorProps = {}
  var Notification
  var CurrentModal
  var FormComponent

  editorProps.actions = actions.editor

  /**
   * Active Modal
   */
  Object.keys(modals).some(function (key) {
    if (!modals[key]) return false
    editorProps.activeModal = key
    return true
  })

  if (editorProps.activeModal) {
    var Modal = getModal(editorProps.activeModal)
    CurrentModal = Popup({ onclose: closeModal }, [ Modal ])
  }

  /**
   * Flash Notifications Component
   */

  if (props.notification.message) {
    notification.actions = {
      close: function () {
        actions.notification.set(null, null)
      }
    }
    Notification = Thunk(Notify, notification)
  }

  /**
   * Menu Component
   */

  var menuState = {
    menus: props.ui.menus,
    actions: {
      openNew: actions.editor.openNew,
      newRow: actions.editor.newRow,
      modal: actions.modal,
      menu: actions.menu
    }
  }

  var MenuComponent = Thunk(MenuBar, menuState)

  /**
   * Data-grid Component
   */
  var gridState = {
    properties: props.editor.properties,
    data: props.editor.data,
    onconfigure: function onconfigure (event, propertyKey) {
      actions.editor.setActiveProperty(propertyKey)
      actions.modal('columnSettings', true)
    },
    onclick: function (event, rowKey, propertyKey) {
      actions.editor.setActiveProperty(propertyKey)
      actions.editor.setActiveRow(rowKey)
    }
  }

  if (props.editor.activeRow) gridState.activeRowKey = props.editor.activeRow
  if (props.editor.activeProperty) gridState.activePropertyKey = props.editor.activeProperty

  var GridThunk = partial(function (currentArgs, previousArgs) {
    var current = {
      properties: currentArgs[1].properties,
      data: currentArgs[1].data,
      activeRowKey: currentArgs[1].activeRowKey,
      activePropertyKey: currentArgs[1].activePropertyKey
    }

    var previous = {
      properties: previousArgs[1].properties,
      data: previousArgs[1].data,
      activeRowKey: previousArgs[1].activeRowKey,
      activePropertyKey: previousArgs[1].activePropertyKey
    }

    var differences = diff(current, previous)
    if (differences) return false
    return true
  })

  /**
   * Data-form Component
   */

  if (props.editor.activeRow) {
    var activeRowKey = props.editor.activeRow
    var activeRow
    props.editor.data.some(function (row) {
      if (row.key === activeRowKey) {
        activeRow = row
        return true
      }
    })

    var formState = {
      row: activeRow,
      activeColumnKey: props.editor.activeProperty,
      properties: props.editor.properties,
      onclose: function () {
        actions.editor.setActiveRow(null)
        actions.editor.setActiveProperty(null)
      },
      ondestroy: function (event, rowKey) {
        if (window.confirm('wait. are you sure you want to destroy all the data in this row?')) {
          actions.editor.destroyRow(rowKey)
        }
      },
      onupdate: function (e, row) {
        actions.editor.updateDataRow(row)
      },
      onclick: function (event, rowKey, propertyKey) {
        if (propertyKey === props.editor.activeProperty) return
        actions.editor.setActiveProperty(propertyKey)
      },
      onfocus: function (event, rowKey, propertyKey) {
        if (propertyKey === props.editor.activeProperty) return
        actions.editor.setActiveProperty(propertyKey)
      }
    }
    FormComponent = Thunk(DataForm, h, formState)
  }

  return h('div#editor-container', [
    Thunk(Header, props),
    Notification,
    MenuComponent,
    h('div', {
      className: FormComponent ? 'grid-wrapper active' : 'grid-wrapper'
    }, [
      GridThunk(DataGrid, h, xtend({}, gridState))
    ]),
    CurrentModal,
    FormComponent
  ])

  function closeModal () {
    actions.closeModals()
  }

  function getModal (type) {
    if (type === 'openNewGithub') {
      return OpenGithubFile({
        githubBranches: props.githubBranches,
        githubRepos: props.githubRepos,
        githubFiles: props.githubFiles,
        githubOrgs: props.githubOrgs,
        activeBranch: props.activeBranch,
        activeRepo: props.activeRepo,
        activeOrg: props.activeOrg,
        actions: {
          getOrgs: actions.github.getOrgs,
          getRepos: actions.github.getRepos,
          getFiles: actions.github.getFiles,
          getBranches: actions.github.getBranches,
          setActiveOrg: actions.github.setActiveOrg,
          setActiveRepo: actions.github.setActiveRepo,
          setActiveBranch: actions.github.setActiveBranch,
          setActiveFile: actions.github.setActiveFile
        }
      })
    }

    if (type === 'openNewUpload') {
      return OpenUploadedFile({
        onfile: function onfile (event, file) {
          actions.file.read(file)
          actions.closeModals()
        }
      })
    }

    if (type === 'saveNewFile') {
      return SaveFile({
        file: props.file,
        onfilename: function (e, value) {
          actions.file.setFilename(value)
        },
        actions: {
          setFileType: actions.file.setFileType,
          saveUpdatedGithubFile: actions.save.updatedGithubFile,
          downloadJSON: actions.save.downloadJSON,
          downloadCSV: actions.save.downloadCSV,
          modal: actions.modal
        }
      })
    }

    if (type === 'saveNewFileToGithub') {
      return SaveToGithub({
        githubBranches: props.githubBranches,
        githubRepos: props.githubRepos,
        githubFiles: props.githubFiles,
        githubOrgs: props.githubOrgs,
        activeBranch: props.activeBranch,
        activeRepo: props.activeRepo,
        activeOrg: props.activeOrg,
        file: props.file,
        actions: {
          getOrgs: actions.github.getOrgs,
          getRepos: actions.github.getRepos,
          getFiles: actions.github.getFiles,
          getBranches: actions.github.getBranches,
          setActiveOrg: actions.github.setActiveOrg,
          setActiveRepo: actions.github.setActiveRepo,
          setActiveBranch: actions.github.setActiveBranch,
          saveNewFileToGithub: actions.save.newGithubFile
        }
      })
    }

    if (type === 'createNewColumn') {
      return CreateNewColumn({
        onsubmit: function (event, column) {
          actions.editor.newColumn(column.name, column.type)
        }
      })
    }

    if (type === 'columnSettings') {
      var editor = props.editor
      var active = editor.properties[editor.activeProperty]
      var columnSettingsProps = {
        property: active,
        actions: {
          propertyType: actions.editor.propertyType,
          renameColumn: actions.editor.renameColumn,
          destroyColumn: function (key) {
            actions.closeModals()
            actions.editor.destroyColumn(key)
          }
        }
      }

      return ColumnSettings(columnSettingsProps)
    }
  }
}
