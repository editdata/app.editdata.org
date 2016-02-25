var ViewList = require('view-list')
var fields = require('../data-fields')

module.exports = function RowsComponent (options) {
  var rowHeight = options.rowHeight || 30
  var height = window.innerHeight - rowHeight

  var viewList = ViewList({
    className: 'data-grid-rows',
    rowHeight: rowHeight,
    eachrow: modifyRow(options),
    readonly: true,
    properties: {},
    height: height
  })

  return viewList.render(options.data)
}

/**
 * Apply this function to each row
 * @param  {Object} options
 * @return {Function}
 */
function modifyRow (options) {
  var h = options.h
  var onfocus = options.onfocus
  var onblur = options.onblur
  var onclick = options.onclick
  var oninput = options.oninput
  var properties = options.properties

  function onFocus (rowKey, propertyKey) {
    return function (event) {
      if (onfocus) return onfocus(event, rowKey, propertyKey)
    }
  }

  function onBlur (rowKey, propertyKey) {
    return function (event) {
      if (onblur) return onblur(event, rowKey, propertyKey)
    }
  }

  function onClick (rowKey, propertyKey) {
    return function (event) {
      if (onclick) return onclick(event, rowKey, propertyKey)
    }
  }

  function onInput (rowKey, propertyKey) {
    return function (event) {
      if (oninput) return oninput(event, rowKey, propertyKey)
    }
  }

  return function eachRow (row) {
    if (!row) return
    if (!row.key) row.key = row.id
    if (!row.value) row.value = row.properties || {}
    var propertyKeys = Object.keys(row.value)
    var elements = propertyKeys.map(element)

    function element (key) {
      var prop = properties[key]
      var type = prop.type[0]
      if (type === 'undefined') type = 'string'

      var value = row.value[key]

      var propertyOptions = {
        h: h,
        value: value,
        id: 'cell-' + row.key + '-' + key,
        attributes: {
          'data-type': type, // todo: use property type from options.properties
          'data-key': key,
          rows: 1
        },
        onfocus: onFocus(row.key, key),
        onblur: onBlur(row.key, key),
        onclick: onClick(row.key, key),
        oninput: onInput(row.key, key)
      }

      if (options.readonly) {
        propertyOptions.attributes.readonly = true
      }
      var field = fields[type]
      return field(propertyOptions)
    }

    var rowOptions = { attributes: { 'data-key': row.key } }

    if (row.active) {
      rowOptions.className = 'active'
      rowOptions.attributes['data-active'] = 'true'
    }

    return h('li.data-grid-row', rowOptions, [
      h('.data-grid-row-items', elements)
    ])
  }
}
