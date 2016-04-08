var h = require('virtual-dom/h')
var Header = require('../elements/header')

module.exports = Support

function Support (props) {
  return h('div.app-container', [
    Header(props),
    h('div.about.content-box', [
      h('h1', 'Get help with EditData.org'),
      h('h2', 'Report an issue, find documentation, contact us about building similar apps.'),
      h('p', 'Want to learn more about the EditData project and how to use EditData.org?'),
      h('p', [
        h('a.button', {
          href: 'http://about.editdata.org',
          target: '_blank'
        }, 'Documentation')
      ]),
      h('p', 'Having issues not explained in the docs?'),
      h('p', [
        h('a.button', {
          href: 'https://github.com/editdata/editdata.org/issues/new',
          target: '_blank'
        }, 'Report an issue')
      ]),
      h('p', 'Need features not available on EditData.org?'),
      h('p', [
        h('a.button', {
          href: 'mailto:hi@editdata.org'
        }, 'Contact us about consulting')
      ])
    ])
  ])
}
