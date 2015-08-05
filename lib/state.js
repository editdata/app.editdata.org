var url = require('url')
var qs = require('querystring')
var cookie = require('cookie-cutter')

var state = window.state = {
  site: {
    title: 'EditData'
  },
  url: null,
  user: null,
  updateUrl: function () {
    this.url = url.parse(window.location.href)
    this.url.query = qs.parse(this.url.query)
    return this.url
  }
}

state.updateUrl()

if (!state.user) {
  var token = cookie.get('editdata')
  if (token && token !== 'undefined') {
    state.user = { token: token }
  }
}

module.exports = state
