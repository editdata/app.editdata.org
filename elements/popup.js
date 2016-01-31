var h = require('virtual-dom/h')

module.exports = Popup

function Popup (props, children) {
  var visible = props.visible
  var onclose = props.onclose

  var width = (window.innerWidth > 800 ? 500 : 320)
  var height = (window.innerWidth > 800 ? 500 : 320)

  if (!visible) return h('div.popup-overlay.hidden')

  return h('div.popup-overlay.visible', [
    h('div.popup-wrapper', {
      style: {
        width: width + 'px',
        height: height + 'px',
        marginLeft: -(width / 2) + 'px',
        marginTop: -(height / 2) + 'px',
        top: '50%',
        left: '50%'
      }
    }, [
      h('div.popup-header', [
        h('button.popup-close', {
          onclick: function (e) {
            close(e, onclose)
          }
        }, 'x')
      ]),
      h('section.popup', children)
    ])
  ])
}

function close (e, onclose) {
  if (onclose) onclose(e)
}
