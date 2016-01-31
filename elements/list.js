var ViewList = require('view-list')
var extend = require('extend')
var value = require('dom-value')
var dataset = require('data-set')

module.exports = List

function List (props) {
  var options = extend({
    className: 'row-list',
    rowHeight: 40,
    eachrow: rows,
    editable: true,
    properties: {},
    height: 643
  }, props)

  var list = ViewList(options)

  function rows (row) {
    var properties = Object.keys(row.value)
    var elements = properties.map(element)

    function element (key) {
      function getProperty (target) {
        var property = {}
        var ds = dataset(target)
        property[ds.key] = value(target)
        return property
      }

      function onfocus (e) {
        var property = getProperty(e.target)
        list.send('focus', e, property, row)
      }

      function onblur (e) {
        var property = getProperty(e.target)
        list.send('blur', e, property, row)
      }

      var propertyOptions = {
        id: 'cell-' + row.key + '-' + key,
        attributes: {
          'data-type': 'string', // todo: use property type from options.properties
          'data-key': key
        },
        onfocus: onfocus,
        onblur: onblur
      }

      return list.html('li.list-property', [
        list.html('span.list-property-value', propertyOptions, row.value[key])
      ])
    }

    var rowOptions = {
      attributes: { 'data-key': row.key },
      onclick: function (e) {
        props.handleClick(e, row)
      }
    }

    if (row.active) {
      rowOptions.className = 'active'
      rowOptions.attributes['data-active'] = 'true'
    }

    return list.html('li.list-row', rowOptions, [
      list.html('ul.list-properties', elements)
    ])
  }

  // HACK: Prevents infinite loop caused by using `view-list` with `virtual-app`
  list = list.render(props.data)
  list.properties = props
  return list
}
