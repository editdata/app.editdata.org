var actions = require('../actions')
var h = require('virtual-dom/h')

module.exports = function saveGitHubFile (props) {
  var type = require('../lib/accept-file')(props.saveData.location.path)
  if (type instanceof Error) {
    return h('div', type.message)
  }

  var message = ''

  return ('div', [
    h('h1', 'Update ' + props.saveData.location.path + ' in GitHub repository'),
    h('h2', 'Add a commit message:'),
    h('input.text-input', {
      type: 'text',
      value: message,
      oninput: function (e) {
        message = e.target.value
      }
    }),
    h('button.button-blue', {
      onclick: function (e) {
        e.preventDefault()
        actions.save.updatedGithubFile(message, props.store)
        actions.modal('saveToGithub', false, props.store)
      }
    }, 'Save to GitHub'),
    h('p.help', 'File ' + props.saveData.location.path + ' will be updated in ' + props.saveData.owner + '/' + props.saveData.repo)
  ])
}
