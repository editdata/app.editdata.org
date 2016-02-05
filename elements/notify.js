var h = require('virtual-dom/h')

module.exports = Notification

function Notification (props) {
  var actions = props.actions
  var message = props.message
  var type = props.type
  var close = actions.close

  return h('div.notify.notify-' + type, {
    onclick: function (e) {
      close(e)
    }
  }, [
    h('div.message', message)
  ])
}
