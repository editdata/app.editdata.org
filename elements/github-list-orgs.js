var h = require('virtual-dom/h')
var state = require('./lib/state')

module.exports = function listOrgs (orgs, userclick, orgclick) {
  var list = []

  list.push(h('li.org.item', {
    onclick: userclick
  }, state.user.profile.login))

  orgs.forEach(function (org) {
    list.push(h('li.org.item', {
      onclick: orgclick
    }, org.login))
  })
}
