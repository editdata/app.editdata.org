var Storage = require('simple-local-storage')
var BaseElement = require('base-element')
var elClass = require('element-class')
var inherits = require('inherits')
var dataset = require('data-set')

module.exports = Editor
inherits(Editor, BaseElement)

function Editor (options) {
  if (!(this instanceof Editor)) return new Editor(options)
  options = options || {}
  BaseElement.call(this)
  var self = this

  this.data = []
  this.properties = options.properties || []
  this._active = { row: null, column: null, cell: null }

  this.headers = require('../elements/headers')()
  this.item = require('../elements/item')()
  this.list = require('../elements/list')({ height: window.innerHeight })
  this.actions = require('../elements/actions')()
  this.filter = require('../elements/filter')()

  this.store = new Storage()
  var state = this.store.get('state')
  if (state) {
    this.data = state.data
    this.properties = state.properties
    this.render(state)
  }

  this.list.addEventListener('click', function (e, row) {
    var rowEl = e.target.parentNode.parentNode
    var header = dataset(e.target).key

    self._active.cell = e.target
    self._active.column = header
    self._active.row = rowEl
    self._active.rowKey = row.key
    self._active.itemPropertyId = 'item-property-' + row.key + '-' + header

    self.data.forEach(function (obj) {
      if (obj.key === row.key) row.active = { cell: e.target }
      else obj.active = false
    })

    self.render(self.data)
    self.list.send('active', self._active)
  })
}

Editor.prototype.render = function (options) {
  var h = this.html.bind(this)
  options = options || {}
  var self = this

  var properties = options.properties || this.properties
  var data = options.data || this.data

  var elements = [
    h('div#actions', [
      self.actions.render(),
      self.filter.render()
    ]),
    h('div.list-wrapper.active', [
      h('div#list', [
        self.headers.render(properties),
        this.list.render(data)
      ])
    ]),
    h('div#item', this.item.render(options.row))
  ]

  // TODO: move this line somewhere more sensible:
  this.store.set('state', JSON.stringify({ data: data, properties: properties }))

  var vtree = h('div#editor', elements)
  return this.afterRender(vtree)
}

Editor.prototype.write = function (item) {
  this.data.push(item)
  this.render(this.data)
}

Editor.prototype.newColumn = function () {
  var name = window.prompt('new column')
  this.properties.push(name)
  this.headers.render(this.properties)
  this.data.forEach(function (item) {
    item.value[name] = null
  })
  this.list.render(this.data)
  if (this._active.rowdata) this.item.render(this._active.rowdata)
}

Editor.prototype.destroy = function () {
  this.data = []
  this.properties = []
  this.store.set('state', null)
  this.render()
}

Editor.prototype.destroyRow = function (key) {
  this.data = this.data.filter(function (row) {
    return row.key !== key
  })
  this.render({ data: this.data })
}

Editor.prototype.destroyColumn = function (name) {
  this.data.forEach(function (item) {
    delete item.value[name]
  })
  this.properties = this.properties.filter(function (header) {
    return header !== name
  })
  this.render({ data: this.data, properties: this.properties })
}

Editor.prototype.renameColumn = function (oldname, newname) {
  this.data.forEach(function (item) {
    item.value[newname] = item.value[oldname]
    delete item.value[oldname]
  })
  var i = this.properties.indexOf(oldname)
  this.properties[i] = newname
  this.render({ data: this.data, properties: this.properties })
}

Editor.prototype.setActiveRow = function (key) {
  this
}

Editor.prototype.setActiveColumn = function (key) {
  this.data.forEach(function (row) {
    if (row.key === key) row.active = true
    else row.active = false
  })
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
  var columnsWidth = this.properties.length * 150
  var listActiveWidth = window.innerWidth - 20
  var itemActiveWidth = Math.floor(window.innerWidth * 0.55)
  var listEl = document.querySelector('.list-wrapper')

  if (elClass(listEl).has('active')) {
    if (columnsWidth >= listActiveWidth) {
      listEl.style.width = 'inherit'
      listEl.style.right = '10px'
    } else if (columnsWidth >= itemActiveWidth) {
      listEl.style.width = (this.properties.length * 150 + 2).toString() + 'px'
    } else {
      listEl.style.width = 'inherit'
      listEl.style.right = 'inherit'
    }
  }
}
