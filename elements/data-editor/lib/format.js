var assert = require('assert')
var type = require('type-of')
var emitter = require('component-emitter')
var metadata = require('./metadata')()
var properties = require('./properties')()
var rows = require('./rows')()

module.exports = function (options) {
  var format = {}
  emitter(format)

  /**
  * @name format.toKeyFormat
  */
  format.init = function editor_format_init (dataset) {
    if (type(dataset) === 'array') {
      dataset = { data: dataset }
    }

    var results = {
      metadata: metadata.init(dataset),
      properties: dataset.properties || {},
      data: []
    }

    dataset.data.forEach(function (row) {
      if (type(row) !== 'object') {
        return new Error('data format is invalid. an array of objects is required')
      }

      var formatted = {
        key: row.key || rows.createKey(),
        value: {}
      }

      Object.keys(row).forEach(function (propName) {
        var prop = properties.get(results, propName)

        if (!prop) {
          prop = properties.init(results, { name: propName, value: row[propName] })
        }

        formatted.value[prop.key] = row[propName]

        if (!results.properties[prop.key]) {
          results.properties[prop.key] = prop
        }
      })

      results.data.push(formatted)
    })

    return results
  }

  /**
  * @name format.toKeyFormat
  */
  format.toKeyFormat = function editor_format_toKeyFormat (dataset, row) {
    var data = {}

    Object.keys(row).forEach(function (key) {
      var prop = format.findProperty(dataset, key)

      if (!prop) {
        prop = format.createProperty(key, row[key])
      }

      if (!dataset.properties[prop.key]) {
        dataset.properties[prop.key] = prop
      }

      data[prop.key] = row[key]
    })

    dataset.data = data
    return dataset
  }

  /**
  * @name format.rowToKeyFormat
  */
  format.rowToKeyFormat = function editor_format_rowToKeyFormat (dataset, row) {
    var data = {}

    Object.keys(row).forEach(function (key) {
      var prop = format.findProperty(dataset, key)

      if (!prop) {
        dataset = format.createProperty(key, row[key])
      }

      if (!dataset.properties[prop.key]) {
        dataset.properties[prop.key] = prop
      }

      data[prop.key] = row[key]
    })

    return { dataset: dataset, row: data }
  }

  /**
  * @name format.toNameFormat
  */
  format.toNameFormat = function editor_format_toNameFormat (dataset) {
    var data = []

    dataset.data.forEach(function (row) {
      data.push(format.rowToNameFormat(dataset, row))
    })

    dataset.data = data
    return dataset
  }

  /**
  * @name format.rowToNameFormat
  */
  format.rowToNameFormat = function editor_format_rowToNameFormat (dataset, row) {
    var data = {}
    var prop

    Object.keys(row).forEach(function (key) {
      prop = format.findProperty(dataset, key)
      data[prop.name] = row[key]
    })

    return data
  }

  /**
  *
  * @name format.convert
  * @param
  * @example
  *
  */
  format.convert = function editor_format_convert (dataset, row, options) {
    options = options || {}
    if (options.to === 'names') {
      return format.toNameFormat(dataset)
    } else {
      return format.toKeyFormat(dataset)
    }
  }

  format.convertRow = function editor_format_convertRow (dataset, row, options) {
    options = options || {}
    if (options.to === 'names') {
      return format.rowToNameFormat(dataset, row)
    } else {
      return format.rowToKeyFormat(dataset, row)
    }
  }

  /**
  *
  * @name format.getType
  * @param
  * @example
  *
  */
  format.getType = function editor_format_getType (dataset, key) {
    return dataset.properties[key].type[0]
  }

  /**
  *
  * @name format.isType
  * @param
  * @example
  *
  */
  format.isType = function editor_format_isType (prop, checkType) {
    prop.type.some(function (type) {
      return type === checkType
    })
  }

  return format
}
