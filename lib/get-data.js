module.exports = function getData (properties, data) {
  return data.map(function (obj) {
    var data = {}
    Object.keys(obj.value).forEach(function (key) {
      var p = properties[key]

      // TODO: mooooore types
      if (p.type[0] === 'number') {
        data[p.name] = parseFloat(obj.value[key])
      } else {
        data[p.name] = obj.value[key]
      }
    })
    return data
  })
}
