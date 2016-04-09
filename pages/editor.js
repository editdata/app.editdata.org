var h = require('virtual-dom/h')
var Thunk = require('vdom-thunk')
var xtend = require('xtend')

var OpenUploadedFile = require('../elements/open-uploaded-file')
var OpenGithubFile = require('../elements/open-github-file')
var ColumnSettings = require('../elements/column-settings')
var CreateNewColumn = require('../elements/create-column')
var SaveToGithub = require('../elements/save-to-github')
var ExportFile = require('../elements/export-file')
var SaveFile = require('../elements/save-file')
var MenuBar = require('../elements/menu-bar')
var Header = require('../elements/header')
var Notify = require('../elements/notify')
var Popup = require('../elements/popup')
var DataGrid = require('data-grid')
var DataForm = require('data-form')

module.exports = function EditorContainer (props) {
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
    var Modal = getModal(props.ui.modals)
    CurrentModal = Popup({ onclose: actions.closeModals }, [ Modal ])
  }

  /**
   * Flash Notifications Component
   */

  if (props.notification.message) {
    notification.actions = {
      close: function () {
        actions.notification.unset()
      }
    }
    Notification = Thunk(Notify, notification)
  }

  /**
   * Menu Component
   */

  var menuState = {
    menus: props.ui.menus,
    openNew: actions.editor.openNew,
    newRow: actions.editor.newRow,
    modal: actions.modal,
    menu: actions.menu
  }

  var MenuComponent = Thunk(MenuBar, menuState)

  /**
   * Data-grid Component
   */
  var gridState = {
    properties: props.properties,
    data: props.data,
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

  /**
   * Data-form Component
   */
  if (props.editor.activeRow) {
    var activeRowKey = props.editor.activeRow
    var activeRow
    props.data.some(function (row) {
      if (row.key === activeRowKey) {
        activeRow = row
        return true
      }
    })

    var formState = {
      row: activeRow,
      activeColumnKey: props.editor.activeProperty,
      properties: props.properties,
      closeButtonText: 'x',
      onclose: function () {
        actions.editor.setActiveRow(null)
        actions.editor.setActiveProperty(null)
      },
      ondestroy: function (event) {
        actions.modal('destroyRowConfirm', true)
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
      DataGrid(xtend({}, gridState))
    ]),
    CurrentModal,
    FormComponent
  ])

  function getModal (modalsObject) {
    var activeModal

    Object.keys(modalsObject).some(function (key) {
      if (!modals[key]) return false
      activeModal = key
      return true
    })

    if (!activeModal) return

    if (activeModal === 'openNewGithub') {
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

    if (activeModal === 'openNewUpload') {
      return OpenUploadedFile({
        onfile: function onfile (event, file) {
          actions.file.read(file)
          actions.closeModals()
        }
      })
    }

    if (activeModal === 'saveFile') {
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

    if (activeModal === 'exportFile') {
      return ExportFile({
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

    if (activeModal === 'saveNewFileToGithub') {
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

    if (activeModal === 'createNewColumn') {
      return CreateNewColumn({
        onsubmit: function (event, column) {
          actions.editor.newColumn(column.name, column.type)
          actions.closeModals()
        }
      })
    }

    if (activeModal === 'columnSettings') {
      var editor = props.editor
      var active = props.properties[editor.activeProperty]
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

    if (activeModal === 'destroyRowConfirm') {
      return h('div.u-center', {}, [
        h('p', 'Are you sure you want to destroy all the data in this row?'),
        h('button', {
          onclick: function (e) {
            actions.editor.destroyRow(props.editor.activeRow)
            actions.editor.setActiveRow(null)
            actions.editor.setActiveProperty(null)
            actions.closeModals()
          }
        }, 'Delete Row')
      ])
    }
  }
}
