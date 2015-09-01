var h = require('virtual-dom/h')
var createPopup = require('../elements/popup')
var saveBlob = require('./save-download-blob')
var orgs = require('./github-organizations')
var repos = require('./github-user-repos')
var orgRepos = require('./github-org-repos')
var popupList = require('../elements/popup-list')

module.exports = function (app, state) {
  var popup = createPopup()

  var filename = ''
  var el = popup.open([
    h('h1', 'Save'),
    h('h2', 'Save a new file to GitHub or your computer'),
    h('h3', 'File name:'),
    h('input.small', {
      type: 'text',
      oninput: function (e) {
        filename = e.target.value
      }
    }),
    h('ul.item-list', [
      h('li.item', {
        onclick: function (e) {
          saveBlob(app.editor.toJSON(), filename)
        }
      }, 'Download JSON file'),
      h('li.item', {
        onclick: function (e) {
          app.editor.toCSV(function (err, data) {
            saveBlob(data, filename)
          })
        }
      }, 'Download CSV file'),
      h('li.item', {
        onclick: function (e) {
          saveToGitHub(app.editor.toJSON(), filename)
        }
      }, 'Save JSON file to GitHub'),
      h('li.item', {
        onclick: function (e) {
          app.editor.toCSV(function (err, data) {
            saveToGitHub(data, filename)
          })
        }
      }, 'Save CSV file to GitHub')
    ])
  ])

  function saveToGitHub (data, filename) {
    orgs(state.user, function (err, orgList) {
      if (err) return popup.send('error', err)

      var orgListEl = popupList(orgList, {
        key: 'login',
        onclick: function (org) {
          orgRepos(state.user, org.login, function (err, repoList) {
            if (err) return popup.send('error', err)

            var repoListEl = popupList(repoList, {
              key: 'name',
              onclick: function (repo) {
                require('./github-create-blob')({
                  owner: state.user.profile.login,
                  repo: repo.name,
                  token: state.user.token,
                  path: filename,
                  message: 'Create ' + filename,
                  content: data,
                  branch: repo.default_branch
                }, function (err, res, save) {
                  state.saveData = save
                  state.save()
                  app.renderEditor([], state)
                })
              }
            })

            var popupEl = popup.open([
              h('h1', 'Save a file to GitHub'),
              h('h2', 'Choose a repository:'),
              h('ul.item-list', repoListEl)
            ])

            app.renderEditor([popupEl], state)
          })
        }
      })

      orgListEl.unshift(h('li.item', {
        onclick: function (e) {
          repos(state.user, function (err, repoList) {
            if (err) return popup.send('error', err)
            var repoListEl = popupList(repoList, {
              key: 'name',
              onclick: function (repo) {
                require('./github-create-blob')({
                  owner: state.user.profile.login,
                  repo: repo.name,
                  token: state.user.token,
                  path: filename,
                  message: 'Create ' + filename,
                  content: data,
                  branch: repo.default_branch
                }, function (err, res, save) {
                  state.saveData = save
                  state.save()
                  app.renderEditor([], state)
                })
              }
            })

            var popupEl = popup.open([
              h('h1', 'Save a file to GitHub'),
              h('h2', 'Choose a repository:'),
              h('ul.item-list', repoListEl)
            ])

            app.renderEditor([popupEl], state)
          })
        }
      }, state.user.profile.login))

      var popupEl = popup.open([
        h('h1', 'Save a file to GitHub'),
        h('h2', 'Choose an organization:'),
        h('ul.item-list', orgListEl)
      ])

      app.renderEditor([popupEl], state)
    })
  }

  setTimeout(function () {
    app.renderEditor([el], state)
  })

  return popup
}