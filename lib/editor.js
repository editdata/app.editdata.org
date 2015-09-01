var csvWriter = require('csv-write-stream')
var elClass = require('element-class')
var fromArray = require('from2-array')
var through = require('through2')
var dataset = require('data-set')
var h = require('virtual-dom/h')
var schema = require('data-schema')()
var cuid = require('cuid')

module.exports = Editor

function Editor (state) {
  if (!(this instanceof Editor)) return new Editor(state)
  var self = this
  this.state = state
  this._active = { row: null, column: null, cell: null }
  this.schema = schema

  this.headers = require('../elements/headers')()
  this.item = require('../elements/item')()
  this.list = require('../elements/list')()
  this.menu = require('menu-element')()

  var item = require('menu-element/item')
  var dropdown = require('menu-element/dropdown')

  this.openEmpty = item({ id: 'empty-dataset', text: 'New empty dataset' })
  this.openGithub = item({ id: 'github', text: 'GitHub' })
  this.openDat = item({ id: 'dat', text: 'Dat' })
  this.openCSV = item({ id: 'upload-csv', text: 'Upload CSV' })
  this.openJSON = item({ id: 'upload-json', text: 'Upload JSON' })
  this.openDropdown = dropdown({
    id: 'open',
    text: 'Open dataset',
    elements: [
      this.openEmpty,
      this.openGithub,
      this.openDat,
      this.openCSV,
      this.openJSON
    ]
  })

  this.save = item({ id: 'save', text: 'Save' })

  this.exportJSON = item({ id: 'export-json', text: 'JSON' })
  this.exportCSV = item({ id: 'export-csv', text: 'CSV' })
  this.exportDropdown = dropdown({
    id: 'export',
    text: 'Export',
    elements: [this.exportJSON, this.exportCSV]
  })

  this.newRowMenu = item({ id: 'new-row', text: 'New row' })
  this.newColumnMenu = item({ id: 'new-column', text: 'New column' })

  this.list.addEventListener('click', function (e, row) {
    var rowEl = e.target.parentNode.parentNode
    var header = dataset(e.target).key

    self._active.cell = e.target
    self._active.column = header
    self._active.row = rowEl
    self._active.rowKey = row.key
    self._active.itemPropertyId = 'item-property-' + row.key + '-' + header

    self.state.data.forEach(function (obj) {
      if (obj.key === row.key) row.active = { cell: e.target }
      else obj.active = false

      Object.keys(obj.value).forEach(function (key) {
        var id = 'cell-' + obj.key + '-' + key
        if (id === e.target.id) {
          elClass(e.target).add('active-cell')
        } else {
          elClass(document.getElementById(id)).remove('active-cell')
        }
      })
    })

    self.list.send('active', self._active)
  })

  this.openDropdown.addEventListener('close', function (e) {
    self.render(self.state)
  })

  this.exportDropdown.addEventListener('close', function (e) {
    self.render(self.state)
  })
}

Editor.prototype.render = function (elements, state) {
  state = state || this.state

  elements = ([
    h('div#editor', [
      h('div#menu', [
        this.menu.render([
          this.openDropdown.render(state.menu.dropdowns.open),
          this.save.render(state),
          this.exportDropdown.render(state.menu.dropdowns.export),
          this.newColumnMenu.render(state),
          this.newRowMenu.render(state)
        ], state)
      ]),
      h('div.list-wrapper', [
        this.headers.render(state.properties),
        h('div#list', [this.list.render(state.data)])
      ])
    ])
  ]).concat(elements)

  return elements
}

Editor.prototype.write = function (item) {
  this.state.data.push(item)
  this.render(this.state)
}

Editor.prototype.newColumn = function (property) {
  if (!property.key) property.key = cuid()
  if (!property.type) property.type = ['string', 'null']
  if (!property.default) property.default = null

  var prop = this.schema.addProperty(property)
  this.state.properties[prop.key] = prop

  this.headers.render(this.state.properties)
  this.state.data.forEach(function (item) {
    item.value[property.key] = null
  })

  this.list.render(this.state.data)
  if (this._active.rowdata) this.item.render(this._active.rowdata, this.state)
}

Editor.prototype.newRow = function () {
  var row = {
    key: this.state.data.length + 1,
    value: {}
  }

  Object.keys(this.state.properties).forEach(function (key) {
    row.value[key] = null
  })

  this.write(row)
}

Editor.prototype.destroy = function () {
  this.state.data = []
  this.state.properties = {}
  this.render(this.state)
}

Editor.prototype.destroyRow = function (key) {
  this.state.data = this.state.data.filter(function (row) {
    return row.key !== key
  })
  this.render(this.state)
}

Editor.prototype.destroyColumn = function (key) {
  this.state.data.forEach(function (item) {
    delete item.value[key]
  })
  delete this.state.properties[key]
  this.render({ data: this.state.data, properties: this.state.properties })
}

Editor.prototype.renameColumn = function (property, newname) {
  this.state.properties[property.key].name = newname
}

Editor.prototype.setActiveRow = function (key) {
  this.state.data.forEach(function (row) {
    if (row.key === key) row.active = true
    else row.active = false
  })
}

Editor.prototype.setActiveColumn = function (key) {

}

Editor.prototype.itemActive = function () {
  var listEl = document.querySelector('.list-wrapper')
  var itemEl = document.querySelector('#item')
  elClass(itemEl).add('active')
  elClass(listEl).remove('active')
  this.checkListWidth()
}

Editor.prototype.listActive = function () {
  var listEl = document.querySelector('.list-wrapper')
  var itemEl = document.querySelector('#item')
  elClass(itemEl).remove('active')
  elClass(listEl).add('active')
  if (this.state.data.length) elClass(listEl).add('has-data')
  else elClass(listEl).remove('has-data')
  this.checkListWidth()
}

Editor.prototype.checkListWidth = function () {
  var columnsWidth = this.state.properties.length * 150
  var listActiveWidth = window.innerWidth - 20
  var itemActiveWidth = Math.floor(window.innerWidth * 0.55)
  var listEl = document.querySelector('.list-wrapper')

  if (this.state.data.length) elClass(listEl).add('has-data')
  else elClass(listEl).remove('has-data')

  if (elClass(listEl).has('active')) {
    if (columnsWidth >= listActiveWidth) {
      listEl.style.width = 'inherit'
      listEl.style.right = '10px'
    } else if (columnsWidth >= itemActiveWidth) {
      listEl.style.width = (this.state.properties.length * 150 + 2).toString() + 'px'
    } else {
      listEl.style.width = 'inherit'
      listEl.style.right = 'inherit'
    }
  }
}

Editor.prototype.getData = function () {
  var self = this
  var props = self.state.properties
  return this.state.data.map(function (obj) {
    var data = {}
    Object.keys(obj.value).forEach(function (key) {
      var p = props[key]

      // TODO: mooooore types
      if (p.type[0] === 'number') {
        data[p.name] = parseFloat(obj.value[key])
      } else {
        data[p.name] = obj.value[key]
      }
    })
    return data
  })
}

Editor.setPropertyType = function (key, type) {
  if (typeof key === 'object' && key.key) key = key.key
  this.state.properties[key].type = type
}

Editor.prototype.getPropertyNames = function () {
  var names = []
  Object.keys(this.state.properties).forEach(function (key) {
    names.push(this.state.properties[key].name)
  })
  return names
}

Editor.prototype.toJSON = function () {
  return JSON.stringify(this.getData())
}

Editor.prototype.toCSV = function (callback) {
  var csv = ''
  var writer = csvWriter({ headers: this.getPropertyNames() })
  fromArray.obj(this.getData())
    .pipe(through.obj(function (chunk, enc, next) {
      this.push(chunk)
      next()
    }))
    .pipe(writer)
    .on('data', function (data) {
      csv += data
    })
    .on('end', function () {
      callback(null, csv)
    })
}
