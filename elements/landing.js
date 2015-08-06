var BaseElement = require('base-element')
var inherits = require('inherits')
var config = require('../config')[process.env.NODE_ENV]

module.exports = Landing
inherits(Landing, BaseElement)

function Landing (options) {
  if (!(this instanceof Landing)) return new Landing(options)
  BaseElement.call(this)
}

Landing.prototype.render = function (state) {
  var h = this.html.bind(this)
  var elements = []

  var url = 'https://github.com/login/oauth/authorize?client_id=' + config.client_id + '&scope=gist&redirect_uri=' + config.redirect_uri

  var button = h('a.button.large.button-blue', { href: url }, [
    h('i.fa.fa-github-square'),
    ' Sign in with GitHub'
  ])

  elements.push(h('div.welcome', [
    h('h2', 'Hello! Let\'s edit some data!'),
    h('p', 'editdata.org is a simple version of flatsheet, a tool for curating data as editorial content.'),
    button,
    h('p', h('a', { href: 'http://flatsheet.io', target: '_blank' }, 'learn more about flatsheet')),
    h('p', h('a', { href: 'http://github.com/flatsheet/editdata.org', target: '_blank' }, 'editdata.org on github'))
  ]))

  var vtree = h('div.landing', elements)
  return this.afterRender(vtree)
}
