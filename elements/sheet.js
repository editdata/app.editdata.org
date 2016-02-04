var h = require('virtual-dom/h')
var WidthHook = require('../lib/width-hook')

var List = require('./list')
var Headers = require('./headers')

module.exports = Sheet

function Sheet (props) {
  var activePropertyKey = props.activePropertyKey
  var activeRowKey = props.activeRowKey
  var activeProperty = props.activeProperty
  var activeItem = props.activeItem
  var properties = props.properties
  var actions = props.actions
  var data = props.data

  var setActiveProperty = actions.setActiveProperty
  var setActiveRow = actions.setActiveRow
  var modal = actions.modal

  return h('div', {
    className: activeItem ? 'list-wrapper has-data'
    : 'list-wrapper active has-data'
  }, [
    Headers({
      actions: {
        setActiveProperty: setActiveProperty,
        modal: modal
      },
      activeProperty: activeProperty,
      properties: properties
    }),
    h('div#list', [
      List({
        data: data,
        handleClick: setActiveRow,
        activePropertyKey: activePropertyKey,
        activeRowKey: activeRowKey,
        className: 'row-list',
        widthHook: WidthHook(properties.length, data.length)
      })
    ])
  ])
}
