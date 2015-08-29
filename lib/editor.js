var csvWriter = require('csv-write-stream')
var elClass = require('element-class')
var fromArray = require('from2-array')
var through = require('through2')
var dataset = require('data-set')

module.exports = Editor

function Editor (state) {
  if (!(this instanceof Editor)) return new Editor(state)
  var self = this
  this.state = state
  this._active = { row: null, column: null, cell: null }

  this.el = {
    list: document.getElementById('list'),
    listWrapper: document.querySelector('.list-wrapper'),
    item: document.getElementById('item'),
    menu: document.getElementById('menu')
  }

  this.popup = require('../elements/popup')(document.body)
  this.headers = require('../elements/headers')(this.el.list)
  this.item = require('../elements/item')(this.el.item)
  this.list = require('../elements/list')({ appendTo: this.el.list })
  this.menu = require('menu-element')(this.el.menu)

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

    self.render(self.state)
    self.list.send('active', self._active)
  })

  this.openDropdown.addEventListener('click', function (e) {
    self.render(self.state)
  })

  this.exportDropdown.addEventListener('click', function (e) {
    self.render(self.state)
  })

  this.openDropdown.addEventListener('close', function (e) {
    self.render(self.state)
  })

  this.exportDropdown.addEventListener('close', function (e) {
    self.render(self.state)
  })
}

Editor.prototype.render = function (state) {
  state = state || this.state
  this.headers.render(state.properties)
  this.list.render(state.data)
  this.menu.render([
    this.openDropdown.render(state.menu.dropdowns.open),
    this.save.render(state),
    this.exportDropdown.render(state.menu.dropdowns.export),
    this.newColumnMenu.render(state),
    this.newRowMenu.render(state)
  ], state)
}

Editor.prototype.write = function (item) {
  this.state.data.push(item)
  this.render(this.state)
}

Editor.prototype.newColumn = function () {
  var name = window.prompt('new column')
  this.state.properties.push(name)
  this.headers.render(this.state.properties)
  this.state.data.forEach(function (item) {
    item.value[name] = null
  })
  this.list.render(this.state.data)
  if (this._active.rowdata) this.item.render(this._active.rowdata)
}

Editor.prototype.newRow = function () {
  var row = {
    key: this.state.data.length + 1,
    value: {}
  }

  this.state.properties.forEach(function (key) {
    row.value[key] = null
  })

  this.write(row)
}

Editor.prototype.destroy = function () {
  this.state.data = []
  this.state.properties = []
  this.render(this.state)
}

Editor.prototype.destroyRow = function (key) {
  this.state.data = this.state.data.filter(function (row) {
    return row.key !== key
  })
  this.render(this.state)
}

Editor.prototype.destroyColumn = function (name) {
  this.state.data.forEach(function (item) {
    delete item.value[name]
  })
  this.state.properties = this.state.properties.filter(function (header) {
    return header !== name
  })
  this.render({ data: this.state.data, properties: this.state.properties })
}

Editor.prototype.renameColumn = function (oldname, newname) {
  this.state.data.forEach(function (item) {
    item.value[newname] = item.value[oldname]
    delete item.value[oldname]
  })
  var i = this.state.properties.indexOf(oldname)
  this.state.properties[i] = newname
  this.render({ data: this.state.data, properties: this.state.properties })
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
  return this.state.data.map(function (obj) {
    return { key: obj.key, value: obj.value }
  })
}

Editor.prototype.toJSON = function () {
  return JSON.stringify(this.getData())
}

Editor.prototype.toCSV = function (callback) {
  var csv = ''
  var writer = csvWriter({ headers: this.state.properties })
  fromArray.obj(this.state.data)
    .pipe(through.obj(function (chunk, enc, next) {
      this.push(chunk.value)
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
