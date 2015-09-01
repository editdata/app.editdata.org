var hashMatch = require('hash-match')

var router = module.exports = require('wayfarer')('/')

router.start = function () {
  router(hashMatch(window.location.hash))
  window.addEventListener('hashchange', function (e) {
    router(hashMatch(window.location.hash))
  })
}

router.go = function (path, options) {
  options = options || {}
  if (!options.query) window.location = window.location.origin + '/#' + path
  else window.location.hash = path
}
