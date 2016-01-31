var h = require('virtual-dom/h')
var parseCSV = require('../lib/parse-csv')
var parseJSON = require('../lib/parse-json')

module.exports = OpenUploadedFile

function OpenUploadedFile (props) {
  var onEnd = props.onEnd
  var onError = props.onError

  function end (err, data, properties) {
    // TODO: Handle error
    if (err) console.error(err)
    var save = null

    onEnd(data, properties, save)
  }

  return h('div', [
    h('h1', 'Upload a CSV or JSON file'),
    h('h2', 'Currently only CSV or JSON files are supported'),
    h('input#upload-file', {
      type: 'file',
      onchange: function (e) {
        var file = e.target.files[0]
        var reader = new window.FileReader()

        reader.onload = function (e) {
          var type = require('../lib/accept-file')(file.name)
          if (type instanceof Error) return onError(type)
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
}
