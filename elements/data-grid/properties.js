module.exports = PropertiesView

function PropertiesView (options) {
  var properties = options.properties
  var onmouseover = options.onmouseover
  var onmouseout = options.onmouseout
  var onconfigure = options.onconfigure
  var h = options.h
  var items = []

  function onMouseOver (propertyKey) {
    return function (event) {
      if (onmouseover) onmouseover(event, propertyKey)
    }
  }

  function onMouseOut (propertyKey) {
    return function (event) {
      if (onmouseout) onmouseout(event, propertyKey)
    }
  }

  function onConfigure (propertyKey) {
    return function (event) {
      if (onconfigure) onconfigure(event, propertyKey)
    }
  }

  Object.keys(properties).forEach(function (key) {
    var property = properties[key]
    items.push(h('li#' + property.key + '.data-grid-property', [
      h('span.data-grid-property-name', {
        onmouseover: onMouseOver(key),
        onmouseout: onMouseOut(key)
      }, property.name),
      h('button.data-grid-property-configure.small', {
        onclick: onConfigure(key)
      }, h('i.fa.fa-gear', ''))
    ]))
  })

  return h('ul.data-grid-properties', { className: options.className }, items)
}
