var h = require('virtual-dom/h')

module.exports = OpenUploadedFile

/**
 * Upload a CSV or JSON file
 * @param {Object} props
 */
function OpenUploadedFile (props) {
  return h('div', [
    h('h1', 'Upload a CSV or JSON file'),
    h('h2', 'Currently only CSV or JSON files are supported'),
    h('input#upload-file', {
      type: 'file',
      onchange: function (e) {
        var file = e.target.files[0]
        if (props.onfile) props.onfile(e, file)
      }
    })
  ])
}
