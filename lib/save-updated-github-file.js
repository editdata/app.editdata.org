var h = require('virtual-dom/h')
var createPopup = require('../elements/popup')

module.exports = function saveGitHubFile (app, state) {
  var popup = createPopup()

  var type = require('./accept-file')(state.saveData.location.path)
  if (type instanceof Error) return popup.send('error', type)

  if (type === 'csv') {
    app.editor.toCSV(function (err, data) {
      if (err) return popup.send('error', err)
      save(data)
    })
  } else if (type === 'json') {
    save(app.editor.toJSON())
  }

  function save (data) {
    console.log('happening?')
    var message = ''
    var html = popup.open([
      h('h1', 'Update ' + state.saveData.location.path + ' in GitHub repository'),
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
          require('./github-update-blob')({
            token: state.user.token,
            owner: state.saveData.owner,
            repo: state.saveData.repo,
            path: state.saveData.location.path,
            message: message,
            content: data,
            sha: state.saveData.location.sha
          }, function (err, body) {
            if (err) return console.error(err)
            state.saveData.location.sha = body.content.sha
            state.saveData.location.url = body.content.git_url
            app.renderEditor([], state)
          })
        }
      }, 'Save to GitHub'),
      h('p.help', 'File ' + state.saveData.location.path + ' will be updated in ' + state.saveData.owner + '/' + state.saveData.repo)
    ])

    setTimeout(function () {
      app.renderEditor([html], state)
    }, 0)
  }

  return popup
}
