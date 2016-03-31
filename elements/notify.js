var h = require('virtual-dom/h')

module.exports = Notification

function Notification (props) {
  var message = props.message
  var level = props.level
  var close = props.close

  return h('div.notify.notify-' + level, {
    onclick: function (e) {
      if (close) close(e)
    }
  }, [
    h('p.message', message)
  ])
}
