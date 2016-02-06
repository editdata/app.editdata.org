var h = require('virtual-dom/h')

var OpenUploadedFile = require('../elements/open-uploaded-file')
var OpenGithubFile = require('../elements/open-github-file')
var ColumnSettings = require('../elements/column-settings')
var CreateNewColumn = require('../elements/create-column')
var SaveToGithub = require('../elements/save-to-github')
var GetStarted = require('../elements/get-started')
var SaveFile = require('../elements/save-file')
var MenuBar = require('../elements/menu-bar')
var Notify = require('../elements/notify')
var Editor = require('../elements/editor')
var Popup = require('../elements/popup')
var Sheet = require('../elements/sheet')
var Item = require('../elements/item')

module.exports = EditorContainer

function EditorContainer (props) {
  var notification = props.notification
  var modals = props.ui.modals
  var actions = props.actions
  var newFile = props.newFile
  var url = props.url
  var editorProps = {}
  var Notification
  var CurrentModal
  var CurrentView
  var CurrentRow

  editorProps.actions = actions.editor

  if (url.pathname.substring(0, 12) === '/edit/new') newFile = true

  // Detect active modal
  Object.keys(modals).some(function (key) {
    if (!modals[key]) return false
    editorProps.activeModal = key
    return true
  })

  if (editorProps.activeModal) {
    var Modal = getModal(editorProps.activeModal)
    CurrentModal = Popup({ onclose: closeModal }, [ Modal ])
  }

  if (props.notification.message) {
    notification.actions = {
      close: function () {
        actions.notification.set(null, null)
      }
    }
    Notification = Notify(notification)
  }

  var menuBarProps = {
    menus: props.ui.menus,
    actions: {
      openNew: actions.editor.openNew,
      newRow: actions.editor.newRow,
      modal: actions.modal,
      menu: actions.menu
    }
  }

  var sheetProps = {
    activeProperty: props.activeProperty,
    activePropertyKey: props.editor.activeRow ? props.editor.activeRow.column : null,
    activeRowKey: props.editor.activeRow ? props.editor.activeRow.row : null,
    activeItem: props.activeItem,
    properties: props.editor.properties,
    data: props.editor.data,
    actions: {
      destroyColumn: actions.editor.destroyColumn,
      renameColumn: actions.editor.renameColumn,
      propertyType: actions.editor.propertyType,
      setActiveProperty: actions.editor.setActiveProperty,
      setActiveRow: actions.editor.setActiveRow,
      modal: actions.modal
    }
  }

  var getStartedProps = {
    actions: { openNew: actions.editor.openNew }
  }

  if (!props.editor.data.length && !newFile) {
    CurrentView = GetStarted(getStartedProps)
  } else {
    CurrentView = Editor(editorProps, [
      MenuBar(menuBarProps),
      Sheet(sheetProps)
    ])
  }

  // Display Row Editor if `activeRow`
  if (props.editor.activeRow) {
    var activeRow = props.editor.activeRow
    var activeRowData
    props.editor.data.some(function (row) {
      if (row.key === parseInt(activeRow.row, 10)) {
        activeRowData = row
        return true
      }
    })

    if (activeRowData) {
      CurrentRow = Item({
        activeColumnKey: activeRow.column,
        activeRowKey: activeRow.row,
        activeRowData: activeRowData,
        properties: props.editor.properties,
        actions: {
          updateCellContent: actions.editor.updateCellContent,
          setActiveRow: actions.editor.setActiveRow,
          destroyRow: actions.editor.destroyRow
        }
      })
    }
  }

  return h('div#editor-container', [
    Notification,
    CurrentView,
    CurrentModal,
    CurrentRow
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
        actions: {
          read: actions.file.read
        }
      })
    }

    if (type === 'saveNewFile') {
      return SaveFile({
        file: props.file,
        actions: {
          setFilename: actions.file.setFilename,
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
        actions: { newColumn: actions.editor.newColumn }
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
            actions.editor.destroyColumn(key)
            actions.closeModals()
          }
        }
      }

      return ColumnSettings(columnSettingsProps)
    }
  }
}
