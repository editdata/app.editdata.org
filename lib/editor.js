var BaseElement = require('base-element')
var elClass = require('element-class')
var inherits = require('inherits')
var dataset = require('data-set')
var toCSV = require('json2csv')

module.exports = Editor
inherits(Editor, BaseElement)

function Editor (state) {
  if (!(this instanceof Editor)) return new Editor(state)
  BaseElement.call(this)
  var self = this
  this.state = state
  this._active = { row: null, column: null, cell: null }

  this.headers = require('../elements/headers')()
  this.item = require('../elements/item')()
  this.list = require('../elements/list')({ height: window.innerHeight })
  this.actions = require('../elements/actions')()
  this.filter = require('../elements/filter')()

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
    })

    self.render()
    self.list.send('active', self._active)
  })
}

Editor.prototype.render = function (options) {
  var h = this.html.bind(this)
  options = options || {}
  var self = this

  var elements = [
    h('div#actions', [
      self.actions.render(this.state),
      self.filter.render()
    ]),
    h('div.list-wrapper.active', [
      h('div#list', [
        self.headers.render(this.state.properties),
        this.list.render(this.state.data)
      ])
    ]),
    h('div#item', this.item.render(options.row))
  ]

  var vtree = h('div#editor', elements)
  return this.afterRender(vtree)
}

Editor.prototype.write = function (item) {
  this.state.data.push(item)
  this.render(this.state.data)
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

Editor.prototype.destroy = function () {
  this.state.data = []
  this.state.properties = []
  this.render()
}

Editor.prototype.destroyRow = function (key) {
  this.state.data = this.state.data.filter(function (row) {
    return row.key !== key
  })
  this.render({ data: this.state.data })
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
  this.checkListWidth()
}

Editor.prototype.checkListWidth = function () {
  var columnsWidth = this.state.properties.length * 150
  var listActiveWidth = window.innerWidth - 20
  var itemActiveWidth = Math.floor(window.innerWidth * 0.55)
  var listEl = document.querySelector('.list-wrapper')

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
  console.log(this.getData())
  return JSON.stringify(this.getData())
}

Editor.prototype.toCSV = function (callback) {
  var data = this.state.data.map(function (obj) {
    return obj.value
  })
  toCSV({ data: data, fields: this.state.properties }, callback)
}
