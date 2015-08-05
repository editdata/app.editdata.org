module.exports = function (options, callback) {
  var gh = options.github
  var id = options.id
  var gist = gh.getGist(id)
  gist.read(callback)
  return gist
}