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
  var menus = props.menus || {}
  var openNew = props.openNew
  var newRow = props.newRow
  var modal = props.modal
  var menu = props.menu

  function openNewFilePopup (event) {
    var slug = event.target.id
    openNew(slug)
  }

  function showSave () {
    console.log('showSave clicked')
    modal('saveFile', true)
  }

  function showExport () {
    console.log('showExport clicked')
    modal('exportFile', true)
  }

  function createNewRow () {
    newRow()
  }

  function newColumn () {
    modal('createNewColumn', true)
  }

  var openEmpty = MenuItem({ id: 'empty', text: 'New empty dataset' })
  var openGithub = MenuItem({ id: 'github', text: 'GitHub' })
  var openUpload = MenuItem({ id: 'upload', text: 'Upload CSV or JSON' })
  var save = MenuItem({ id: 'save', text: 'Save' })
  var exportItem = MenuItem({ id: 'export', text: 'Export' })
  var newRowMenu = MenuItem({ id: 'new-row', text: 'New row' })
  var newColumnMenu = MenuItem({ id: 'new-column', text: 'New column' })

  var openDropdown = Dropdown({
    id: 'open',
    text: 'Open dataset',
    elements: [
      openEmpty,
      openGithub,
      openUpload
    ]
  })

  openEmpty.addEventListener('click', openNewFilePopup)
  openGithub.addEventListener('click', openNewFilePopup)
  openUpload.addEventListener('click', openNewFilePopup)
  save.addEventListener('click', showSave)
  exportItem.addEventListener('click', showExport)
  newRowMenu.addEventListener('click', createNewRow)
  newColumnMenu.addEventListener('click', newColumn)

  openDropdown.addEventListener('click', function (e) {
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
  })

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
