var hashMatch = require('hash-match')

var router = module.exports = require('wayfarer')('/')

router.start = function () {
  router(hashMatch(window.location.hash))
  window.addEventListener('hashchange', function (e) {
    router(hashMatch(window.location.hash))
  })
}

router.go = function (path) {
  window.location.hash = path
}
