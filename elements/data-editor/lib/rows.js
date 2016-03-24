var cuid = require('cuid')
var extend = require('xtend')
var clone = require('clone')
var emitter = require('component-emitter')

module.exports = function (options) {
  var rows = {}
  emitter(rows)

  rows.get = function editor_rows_get (state, key) {
    var row
    var i = 0
    var l = state.data.length

    for (i; i < l; i++) {
      if (state.data[i].key === key) {
        row = this.state.data[i]
      }
    }

    return row
  }

  rows.create = function editor_rows_create (state, row) {
    var rowkey

    if (row.key && row.value) {
      rowkey = row.key
      value = row.value
    } else if (row) {
      rowkey = rows.createKey()
    }

    var value = {}
    Object.keys(state.properties).forEach(function (key) {
      value[key] = state.properties[key].default
    })

    var data = { key: rowkey, value: value }
    state.data.push(data)
    return clone(state)
  }

  rows.update = function editor_rows_update (state, row) {
    var key = row.key
    var i = 0
    var l = state.data.length

    for (i; i < l; i++) {
      if (state.data[i].key === key) {
        state.data[i] = extend(state.data[i], row)
      }
    }

    return clone(state)
  }

  rows.remove = function editor_rows_remove (state, key) {
    if (typeof key === 'object' && key.key) key = key.key

    state.data = state.data.filter(function (row) {
      return row.key !== key
    })

    this.emit('row:remove', key)
    return clone(state)
  }

  rows.validate = function editor_rows_validate (state, row) {

  }

  rows.format = function editor_rows_format (state, row) {

  }

  rows.toNameFormat = function editor_rows_toNameFormat (state, row) {

  }

  rows.toKeyFormat = function editor_rows_toKeyFormat (state, row) {

  }

  rows.toGeoJSON = function editor_rows_toGeoJSON (state, row) {

  }

  /**
  *
  * @name rows.createKey
  * @param
  * @example
  *
  */
  rows.createKey = function editor_rows_createKey () {
    return 'row-' + cuid()
  }

  return rows
}
