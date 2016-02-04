var h = require('virtual-dom/h')

module.exports = GetStarted

function GetStarted (props) {
  var actions = props.actions

  var options = [
    {
      slug: 'empty',
      text: 'Start new empty dataset'
    },
    {
      slug: 'github',
      text: 'Edit CSV or JSON file from GitHub'
    },
    {
      slug: 'upload',
      text: 'Upload CSV or JSON file'
    }
  ]
  var items = []

  options.forEach(function (item) {
    var el = h('li.list-item', {
      onclick: function (e) {
        actions.openNew(item.slug)
      }
    }, item.text)
    items.push(el)
  })

  return h('div.get-started.content-box', [
    h('h1', 'Get Started!'),
    h('h2', 'Start a new dataset or open an existing one.'),
    h('ul.list', items)
  ])
}
