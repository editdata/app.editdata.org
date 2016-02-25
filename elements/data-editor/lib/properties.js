var cuid = require('cuid')
var type = require('type-of')
var clone = require('clone')
var extend = require('xtend')
var emitter = require('component-emitter')
var isDataset = require('./is-dataset')

module.exports = function (options) {
  var properties = {}
  emitter(properties)

  /**
  * Create a property key.
  *
  * @name properties.createKey
  */
  properties.createKey = function editor_properties_createKey () {
    return 'property-' + cuid()
  }

  /**
  * Find a property by name or key.
  *
  * @name properties.get
  * @param {Object} dataset, dataset object with `data`, `properties`, `key`, and `metadata` properties
  * @param (String) id name or key of property
  * @returns {Object} property object
  * @example
  * var property = properties.get(dataset, id)
  */
  properties.get = function editor_properties_get (dataset, id) {
    isDataset(dataset)
    var props = dataset.properties
    var name = id.name ? id.name : id
    var propkey = id.key ? id.key : id

    for (var key in props) {
      var nameMatch = props[key].name === name
      var keyMatch = props[key].key === propkey
      if (nameMatch || keyMatch) return props[key]
    }
  }

  properties.init = function editor_properties_init (dataset, options) {
    isDataset(dataset)
    options = options || {}

    var key = options.key || properties.createKey()
    var name = options.name
    var value = options.value
    var propertyType = options.type || [type(value), 'null']
    var defaultValue = options.default || null

    var prop = {
      key: key,
      name: name,
      type: propertyType,
      default: defaultValue
    }

    if (dataset.properties[prop.key]) {
      throw new Error('A property with key ' + prop.key + ' already exists')
    } else {
      dataset.properties[prop.key] = prop
    }

    return prop
  }

  /**
  * Create a new property and add it to the dataset.
  *
  * @name properties.create
  * @param {Object} dataset, dataset object with `data`, `properties`, `key`, and `metadata` properties
  * @returns {String} dataset returns a clone of the dataset including the new property
  * @example
  * dataset = properties.create(dataset, {
  *   key: 'uuid',
  *   value: ''
  * })
  */
  properties.create = function editor_properties_create (dataset, options) {
    isDataset(dataset)
    var prop = properties.init(dataset, options)
    dataset.properties[prop.key] = prop

    dataset.data.forEach(function (row, i) {
      dataset.data[i].value[prop.key] = prop.default
    })

    console.log('heyp', dataset.data)
    return clone(dataset)
  }

  properties.update = function editor_properties_update (dataset, options) {
    isDataset(dataset)
    var prop = properties.find(dataset, options.key)
    prop = extend(prop, options)
    dataset.properties[prop.key] = prop
    return clone(dataset)
  }

  properties.remove = function editor_properties_remove (dataset, id, destroyData) {
    if (typeof id === 'object') id = id.key
    var prop = properties.find(dataset, id)
    delete dataset.properties[prop.key]

    if (destroyData !== false) {
      dataset = removeRowProp(dataset, prop.key)
    }

    return clone(dataset)
  }

  /**
  * @name removeRowProp
  * @private
  */
  function removeRowProp (dataset, key) {
    return dataset.data.map(function (row) {
      return row.key !== key
    })
  }

  properties.getKeys = function editor_properties_getKeys (dataset) {
    isDataset(dataset)
    return Object.keys(dataset.properties)
  }

  return properties
}
