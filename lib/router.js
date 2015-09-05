var match = require('pathname-match')
var wayfarer = require('wayfarer')('/')
var history = require('history-state')({ pushState: true })
var state = require('./state')
var router = {}

router.on = function (route, callback) {
  wayfarer.on(route, function (params) {
    callback({ params: params, url: state.setUrl() })
  })
}

router.go = function (route) {
  history.change(route)
}

router.start = function () {
  history.start()
}

history.on('change', function () {
  wayfarer(match(window.location.pathname))
})

// wayfarer(match(window.location.pathname))
module.exports = router
