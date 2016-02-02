var h = require('virtual-dom/h')
var Menu = require('menu-element')()
var MenuItem = require('menu-element/item')
var Dropdown = require('menu-element/dropdown')

module.exports = MenuBar

/**
 * Editor Menu Bar
 * @param {Object} props
 */
function MenuBar (props) {
  var actions = props.actions || {}
  var menus = props.menus || {}

  var openNew = actions.openNew
  var newRow = actions.newRow
  var modal = actions.modal
  var menu = actions.menu

  function openNewFilePopup (event) {
    var slug = event.target.id
    openNew(slug)
  }

  function showSave () {
    modal('saveNewFile', true)
  }

  function createNewRow () {
    newRow()
  }

  function newColumn () {
    modal('createNewColumn', true)
  }

  var openEmpty = MenuItem({ id: 'empty', text: 'New empty dataset', onclick: openNewFilePopup })
  var openGithub = MenuItem({ id: 'github', text: 'GitHub', onclick: openNewFilePopup })

  // var openDat = MenuItem({ id: 'dat', text: 'Dat' })
  var openUpload = MenuItem({ id: 'upload', text: 'Upload CSV or JSON', onclick: openNewFilePopup })

  var openDropdown = Dropdown({
    id: 'open',
    text: 'Open dataset',
    elements: [
      openEmpty,
      openGithub,
      openUpload
    ],
    onclick: function () {
      menu('openFile', true)

      function listener (e) {
        var found = false
        for (var element = e.target; element; element = element.parentNode) {
          if (element.id === 'open') found = true
        }
        if (!found) {
          if (menu) menu('openFile', false)
          document.body.removeEventListener('click', listener)
        }
      }

      document.body.addEventListener('click', listener)
    }
  })

  var save = MenuItem({ id: 'save', text: 'Save', onclick: showSave })
  var exportItem = MenuItem({ id: 'export', text: 'Export', onclick: showSave })
  var newRowMenu = MenuItem({ id: 'new-row', text: 'New row', onclick: createNewRow })
  var newColumnMenu = MenuItem({ id: 'new-column', text: 'New column', onclick: newColumn })

  return h('div#menu', [
    Menu.render([
      openDropdown.render({ open: menus.openFile }),
      save.render(props),
      exportItem.render(props),
      newColumnMenu.render(props),
      newRowMenu.render(props)
    ], props)
  ])
}
