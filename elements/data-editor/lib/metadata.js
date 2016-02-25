var extend = require('xtend')

module.exports = function (options) {
  var metadata = {}

  metadata.init = function editor_metadata_init (dataset) {
    dataset = dataset || {}
    dataset.metadata = dataset.metadata || {}
    return extend({
      key: dataset.key || dataset.metadata.key || null,
      title: null,
      description: null,
      website: null,
      source: null
    }, dataset.metadata)
  }

  return metadata
}
