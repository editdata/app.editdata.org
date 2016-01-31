var elClass = require('element-class')
var dataset = require('data-set')
var h = require('virtual-dom/h')
var actions = require('../actions')
var WidthHook = require('../lib/width-hook')

var OpenUploadedFile = require('./open-uploaded-file')
var OpenGithubFile = require('./open-github-file')
var CreateNewColumn = require('./create-column')
var SaveToGithub = require('./save-to-github')
var SaveFile = require('./save-file')
var MenuBar = require('./menu-bar')
var Headers = require('./headers')
var Popup = require('./popup')
var Item = require('./item')
var List = require('./list')

module.exports = Editor

function Editor (props) {
  var properties = props.properties
  var store = props.store
  var data = props.data
  var activeItem
  var popup

  // Modals
  // TODO: Move the modals out and pass them in as props as needed
  if (props.modals.openNewGithub) {
    popup = Popup({ visible: true, onclose: function () {
      actions.modal('openNewGithub', false, props.store)
    }}, OpenGithubFile(props))
  }

  if (props.modals.openNewUpload) {
    popup = Popup({ visible: true, onclose: function () {
      actions.modal('openNewUpload', false, props.store)
    }}, OpenUploadedFile({
      onEnd: function (data, properties, save) {
        actions.modal('openNewUpload', false, props.store)
        actions.editor.selectUploadedFile(data, properties, save, store)
      },
      onError: function (type) {
        actions.editor.uploadError(type)
      }
    }))
  }

  if (props.modals.saveNewFile) {
    popup = Popup({ visible: true, onclose: function () {
      actions.modal('saveNewFile', false, store)
    }}, SaveFile({
      store: props.store,
      saveData: props.saveData,
      onFilename: function (name) { actions.editor.setFilename(name, store) },
      onJSON: function () { actions.editor.saveJSON(store) },
      onCSV: function () { actions.editor.saveCSV(store) },
      onJSONToGithub: function () {
        actions.editor.setFileType('json', store)
        actions.modal('saveNewFile', false, store)
        actions.modal('saveNewFileToGithub', true, store)
      },
      onCSVToGithub: function () {
        actions.editor.setFileType('csv', store)
        actions.modal('saveNewFile', false, store)
        actions.modal('saveNewFileToGithub', true, store)
      }
    }))
  }

  if (props.modals.saveNewFileToGithub) {
    popup = Popup({ visible: true, onclose: function () {
      actions.modal('saveNewFileToGithub', false, store)
    }}, SaveToGithub(props))
  }

  if (props.modals.createNewColumn) {
    popup = Popup({ visible: true, onclose: function () {
      actions.modal('createNewColumn', false, store)
    }}, CreateNewColumn({
      onsubmit: function (name, type) {
        actions.editor.newColumn(name, type, store)
      }
    }))
  }

  if (props.activeRow) {
    var currentRow
    props.data.some(function (row) {
      if (row.key === props.activeRow.rowKey) {
        currentRow = row
        return true
      }
    })

    activeItem = Item({
      activePropertyId: props.activeRow.itemPropertyId,
      item: currentRow,
      properties: props.properties,
      onInput: function (key, value, row, e) {
        actions.editor.updateCellContent(key, value, row, store)
      },
      onClose: function () {
        actions.editor.setActiveRow(null, store)
      },
      onFocus: function (event, row) {
        setActiveRow(event, row)
      },
      onDestroy: function (item) {
        if (window.confirm('wait. are you sure you want to destroy all the data in this row?')) {
          actions.editor.destroyRow(item.key, store)
        }
      }
    })
  }

  return h('div#editor', [
    MenuBar(props),
    h('div', {
      className: activeItem ? 'list-wrapper has-data'
      : 'list-wrapper active has-data'
    }, [
      Headers({
        activeProperty: props.activeProperty,
        properties: properties,
        store: store
      }),
      h('div#list', [
        List({
          data: data,
          handleClick: setActiveRow,
          className: 'row-list',
          widthHook: WidthHook(properties.length, data.length)
        })
      ])
    ]),
    popup,
    activeItem
  ])

  function setActiveRow (event, row) {
    var el = event.target
    var rowEl = el.parentNode.parentNode
    var headerKey = dataset(el).key
    var active = {}
    active.cell = {
      element: el,
      data: row[headerKey]
    }
    active.column = headerKey
    active.row = {
      element: rowEl,
      data: row
    }
    active.rowKey = row.key
    active.itemPropertyId = 'item-property-' + row.key + '-' + headerKey

    actions.editor.setActiveRow(active, store)

    props.data.forEach(function (obj) {
      if (obj.key === row.key) row.active = { cell: el }
      else obj.active = false

      Object.keys(obj.value).forEach(function (key) {
        var id = 'cell-' + obj.key + '-' + key
        if (id === el.id) {
          elClass(el).add('active-cell')
        } else {
          elClass(document.getElementById(id)).remove('active-cell')
        }
      })
    })
  }
}
