var h = require('virtual-dom/h')
var createPopup = require('../elements/popup')
var parseCSV = require('./parse-csv')
var parseJSON = require('./parse-json')

module.exports = function openUploadedFile (state) {
  var popup = createPopup()

  var el = popup.open([
    h('h1', 'Upload a CSV or JSON file'),
    h('h2', 'Currently only CSV or JSON files are supported'),
    h('input#upload-file', {
      type: 'file',
      onchange: function (e) {
        var file = e.target.files[0]
        var reader = new window.FileReader()

        reader.onload = function (e) {
          var type = require('./accept-file')(file.name)
          if (type instanceof Error) return popup.send('error', type)
          if (type === 'csv') {
            parseCSV(e.target.result, end)
          } else if (type === 'json') {
            parseJSON(e.target.result, end)
          }
        }

        reader.readAsText(file)
        e.preventDefault()
      }
    })
  ])

  function end (err, data, properties) {
    var save = null
    popup.send('done', data, properties, save)
  }

  setTimeout(function () {
    popup.send('render', el)
  })

  return popup
}
