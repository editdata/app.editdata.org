var h = require('virtual-dom/h')

module.exports = function (props) {
  var onFilename = props.onFilename
  var onJSON = props.onJSON
  var onCSV = props.onCSV
  var onCSVToGithub = props.onCSVToGithub
  var onJSONToGithub = props.onJSONToGithub

  return h('div', [
    h('h1', 'Save'),
    h('h2', 'Save a new file to GitHub or your computer'),
    h('h3', 'File name:'),
    h('input.small', {
      type: 'text',
      oninput: function (e) {
        onFilename(e.target.value)
      }
    }),
    h('ul.item-list', [
      h('li.item', {
        onclick: function (e) {
          onJSON()
        }
      }, 'Download JSON file'),
      h('li.item', {
        onclick: function (e) {
          onCSV()
        }
      }, 'Download CSV file'),
      h('li.item', {
        onclick: function (e) {
          onJSONToGithub()
        }
      }, 'Save JSON file to GitHub'),
      h('li.item', {
        onclick: function (e) {
          onCSVToGithub()
        }
      }, 'Save CSV file to GitHub')
    ])
  ])
}
