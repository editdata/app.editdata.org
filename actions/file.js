var parseCSV = require('../lib/parse-csv')
var parseJSON = require('../lib/parse-json')
var constants = require('../constants')

module.exports = function FileActionCreators (store, commonActions) {
  function read (file) {
    var reader = new window.FileReader()

    reader.onload = function (e) {
      var type = require('../lib/accept-file')(file.name)
      if (type instanceof Error) return store(readError(type))
      if (type === 'csv') {
        parseCSV(e.target.result, end)
      } else if (type === 'json') {
        parseJSON(e.target.result, end)
      }
    }

    function end (err, data, properties) {
      // TODO: Handle error
      if (err) console.error(err)
      setFile(data, properties)
    }

    reader.readAsText(file)
  }

  function readError (err) {
    return store({
      type: constants.FILE_READ_ERROR,
      error: err
    })
  }

  function setFile (data, properties) {
    return store({
      type: constants.SET_FILE,
      data: data,
      properties: properties
    })
  }

  /**
   * Set the file type to save as
   * @param {String} type
   * @param {Store} store
   */
  function setFileType (type) {
    store({
      type: constants.SET_FILE_TYPE,
      fileType: type
    })
  }

  /**
   * Set the current file name
   * @param {String} filename
   * @param {Store} store
   */
  function setFilename (filename) {
    store({
      type: constants.SET_FILENAME,
      filename: filename
    })
  }

  return {
    read: read,
    readError: readError,
    setFileType: setFileType,
    setFilename: setFilename
  }
}
