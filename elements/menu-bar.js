var h = require('virtual-dom/h')
var Menu = require('menu-element')()
var MenuItem = require('menu-element/item')
var Dropdown = require('menu-element/dropdown')
var actions = require('../actions')

module.exports = MenuBar

function MenuBar (props) {
  var openFileDropdownIsVisible = props.menus.openFile
  var store = props.store

  function openNewFilePopup (event) {
    var slug = event.target.id
    actions.editor.openNew(slug, store)
  }

  function showSave () {
    actions.modal('saveNewFile', true, store)
  }

  var openEmpty = MenuItem({
    id: 'empty',
    text: 'New empty dataset',
    onclick: openNewFilePopup
  })

  var openGithub = MenuItem({
    id: 'github',
    text: 'GitHub',
    onclick: openNewFilePopup
  })

  // var openDat = MenuItem({ id: 'dat', text: 'Dat' })
  var openUpload = MenuItem({
    id: 'upload',
    text: 'Upload CSV or JSON',
    onclick: openNewFilePopup
  })

  var openDropdown = Dropdown({
    id: 'open',
    text: 'Open dataset',
    elements: [
      openEmpty,
      openGithub,
      openUpload
    ],
    onclick: function () {
      actions.menu('openFile', true, store)

      // TODO: Find a better way to do this
      var listener = function (e) {
        var found = false
        for (var element = e.target; element; element = element.parentNode) {
          if (element.id === 'open') found = true
        }
        if (!found) {
          actions.menu('openFile', false, store)
          document.body.removeEventListener('click', listener)
        }
      }

      document.body.addEventListener('click', listener)
    }
  })

  var save = MenuItem({ id: 'save', text: 'Save', onclick: showSave })
  var exportItem = MenuItem({ id: 'export', text: 'Export', onclick: showSave })

  var newRowMenu = MenuItem({
    id: 'new-row',
    text: 'New row',
    onclick: function () {
      actions.editor.newRow(store)
    }
  })

  var newColumnMenu = MenuItem({
    id: 'new-column',
    text: 'New column',
    onclick: function () {
      actions.modal('createNewColumn', true, store)
    }
  })

  return h('div#menu', [
    Menu.render([
      openDropdown.render({ open: openFileDropdownIsVisible }),
      save.render(props),
      exportItem.render(props),
      newColumnMenu.render(props),
      newRowMenu.render(props)
    ], props)
  ])
}
