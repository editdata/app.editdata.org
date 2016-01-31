var h = require('virtual-dom/h')
var actions = require('../actions')
var OpenGithubFile = require('./open-github-file')
var OpenUploadedFile = require('./open-uploaded-file')
var Popup = require('./popup')

module.exports = GetStarted

function GetStarted (props) {
  var options = [
    {
      slug: 'empty',
      text: 'Start new empty dataset'
    },
    {
      slug: 'github',
      text: 'Edit CSV or JSON file from GitHub'
    },
    {
      slug: 'upload',
      text: 'Upload CSV or JSON file'
    }
  ]
  var store = props.store
  var items = []
  var popup

  if (props.modals.openNewGithub) {
    popup = Popup({ visible: true, onclose: function () {
      actions.modal('openNewGithub', false, props.store)
    }}, OpenGithubFile(props))
  }

  if (props.modals.openNewUpload) {
    popup = Popup({ visible: true, onclose: function () {
      actions.modal('openNewUpload', false, props.store)
    }}, OpenUploadedFile({
      onEnd: function (data, properties, save) {
        actions.modal('openNewUpload', false, props.store)
        actions.editor.selectUploadedFile(data, properties, save, store)
      },
      onError: function (type) {
        actions.editor.uploadError(type)
      }
    }))
  }

  options.forEach(function (item) {
    var el = h('li.list-item', {
      onclick: function (e) {
        actions.editor.openNew(item.slug, props.store)
      }
    }, item.text)
    items.push(el)
  })

  return h('div.get-started', [
    h('h1', 'Get Started!'),
    h('h2', 'Start a new dataset or open an existing one.'),
    h('ul.list', items),
    popup
  ])
}
