var h = require('virtual-dom/h')

module.exports = Landing

function Landing (props) {
  var config = props.config

  var url = 'https://github.com/login/oauth/authorize?client_id=' + config.client_id + '&scope=repo&redirect_uri=' + config.redirect_uri

  var Button = h('a.button.large.button-blue', { href: url }, [
    h('i.fa.fa-github-square'),
    ' Sign in with GitHub'
  ])

  return h('div.landing.content-box', [
    h('div.welcome', [
      h('h1', 'Hello! Let\'s edit some data!'),
      h('p', 'editdata.org is a tool for curating data as editorial content.'),
      Button,
      h('p', h('a', { href: 'http://editdata.org', target: '_blank' }, 'learn more about editdata')),
      h('p', h('a', { href: 'http://github.com/flatsheet/editdata.org', target: '_blank' }, 'editdata.org on github'))
    ])
  ])
}
