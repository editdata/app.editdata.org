var h = require('virtual-dom/h')

module.exports = function (props) {
  var filename = props.file.name
  var onfilename = props.onfilename
  var actions = props.actions

  var setFileType = actions.setFileType
  var downloadJSON = actions.downloadJSON
  var downloadCSV = actions.downloadCSV
  var modal = actions.modal

  var OptionList = h('ul.item-list', [
    h('li.item', {
      onclick: function (e) {
        setFileType('json')
        downloadJSON()
      }
    }, 'Download JSON file'),
    h('li.item', {
      onclick: function (e) {
        setFileType('csv')
        downloadCSV()
      }
    }, 'Download CSV file'),
    h('li.item', {
      onclick: function (e) {
        setFileType('json')
        modal('saveNewFileToGithub', true)
      }
    }, 'Save JSON file to GitHub'),
    h('li.item', {
      onclick: function (e) {
        setFileType('csv')
        modal('saveNewFileToGithub', true)
      }
    }, 'Save CSV file to GitHub')
  ])

  return h('div', [
    h('h1', 'Save'),
    h('h2', 'Save a new file to GitHub or your computer'),
    h('h3', 'File name:'),
    h('input.small', {
      value: filename,
      type: 'text',
      oninput: function (e) {
        if (onfilename) onfilename(e, e.target.value)
      }
    }),
    h('p.help', ' Note that the appropriate extension will be appended to the file name'),
    filename ? OptionList : null
  ])
}
