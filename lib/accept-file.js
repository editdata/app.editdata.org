var ext = require('file-extension')

module.exports = function acceptFile (filename) {
  var accept = ['csv', 'json']
  var comingSoon = ['tsv', 'geojson', 'yml']
  var type = ext(filename)

  if (!type) return new Error('The filename is missing an extension')

  if (accept.indexOf(type) < 0) {
    if (comingSoon.indexOf(type) >= 0) {
      return new Error(type + ' is not yet supported, but will be!')
    }
    return new Error(type + ' is not supported')
  } else {
    return type
  }
}
