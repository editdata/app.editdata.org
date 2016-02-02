var h = require('virtual-dom/h')

module.exports = function (props) {
  var actions = props.actions
  var setFilename = actions.setFilename
  var setFileType = actions.setFileType
  var downloadJSON = actions.downloadJSON
  var downloadCSV = actions.downloadCSV
  var modal = actions.modal

  return h('div', [
    h('h1', 'Save'),
    h('h2', 'Save a new file to GitHub or your computer'),
    h('h3', 'File name:'),
    h('input.small', {
      type: 'text',
      oninput: function (e) {
        if (setFilename) setFilename(e.target.value)
      }
    }),
    h('ul.item-list', [
      h('li.item', {
        onclick: function (e) {
          if (downloadJSON) downloadJSON()
        }
      }, 'Download JSON file'),
      h('li.item', {
        onclick: function (e) {
          if (downloadCSV) downloadCSV()
        }
      }, 'Download CSV file'),
      h('li.item', {
        onclick: function (e) {
          if (setFileType) setFileType('json')
          if (modal) modal('saveNewFileToGithub', true)
        }
      }, 'Save JSON file to GitHub'),
      h('li.item', {
        onclick: function (e) {
          if (setFileType) setFileType('CSV')
          if (modal) modal('saveNewFileToGithub', true)
        }
      }, 'Save CSV file to GitHub')
    ])
  ])
}
