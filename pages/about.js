var h = require('virtual-dom/h')
var Header = require('../elements/Header')

module.exports = About

function About (props) {
  return h('div.app-container', [
    Header(props),
    h('div.about.content-box', [
      h('h1', 'About EditData.org'),
      h('h2', 'Hello. Let me tell you about everything.'),
      h('p', 'EditData.org is a tool for editing CSV & JSON files from your computer & from GitHub.'),
      h('p', [
        'Learn more at ',
        h('a', {
          href: 'http://about.editdata.org',
          target: '_blank'
        }, 'about.editdata.org')
      ]),
      h('p', [
        h('a.button', {
          href: 'https://github.com/editdata/editdata.org',
          target: '_blank'
        }, 'Source on GitHub')
      ]),
      h('p', [
        h('a.button', {
          href: 'https://github.com/editdata/editdata.org/issues/new',
          target: '_blank'
        }, 'Report an issue')
      ])
    ])
  ])
}
