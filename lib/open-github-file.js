var h = require('virtual-dom/h')

var orgs = require('./github-organizations')
var repos = require('./github-user-repos')
var orgRepos = require('./github-org-repos')
var repoFiles = require('./github-repo-files')
var createPopup = require('../elements/popup')
var popupList = require('../elements/popup-list')

module.exports = function openGithubFile (state, app, html, callback) {
  orgs(state.user, function (err, orgList) {
    if (err) return callback(err)

    var popup = createPopup(function () {
      app.renderContent([html], state)
    })

    var orgListEl = popupList(orgList, {
      key: 'login',
      onclick: function (org) {
        orgRepos(state.user, org.login, function (err, repoList) {
          if (err) return callback(err)

          var repoListEl = popupList(repoList, {
            key: 'name',
            onclick: function (repo) {
              orgRepos(state.user, org, repo, function (err, fileList) {
                if (err) return callback(err)
                
                var fileListEl = popupList(fileList, {
                  key: 'path',
                  onclick: function (file) {
                    require('./github-get-blob')(state.user, org, repo, file, callback)
                  }
                })

                var popupEl = popup.open([
                  h('h1', 'Open a file from GitHub'),
                  h('h2', 'Choose a file:'),
                  h('ul.item-list', fileListEl)
                ])

                app.renderContent([html, popupEl], state)
              })
            }
          })

          var popupEl = popup.open([
            h('h1', 'Open a file from GitHub'),
            h('h2', 'Choose a repository:'),
            h('ul.item-list', repoListEl)
          ])

          app.renderContent([html, popupEl], state)
        })
      }
    })

    orgListEl.unshift(h('li.item', {
      onclick: function (e) {
        repos(state.user, function (err, repoList) {
          if (err) return callback(err)
          var repoListEl = popupList(repoList, {
            key: 'name',
            onclick: function (repo) {
              repoFiles(state.user, state.user.profile, repo, function (err, fileList) {
                if (err) return callback(err)

                var fileListEl = popupList(fileList, {
                  key: 'path',
                  onclick: function (file) {
                    require('./github-get-blob')(state.user, state.user.profile, repo, file, callback)
                  }
                })

                var popupEl = popup.open([
                  h('h1', 'Open a file from GitHub'),
                  h('h2', 'Choose a file:'),
                  h('ul.item-list', fileListEl)
                ])

                app.renderContent([html, popupEl], state)
              })
            }
          })

          var popupEl = popup.open([
            h('h1', 'Open a file from GitHub'),
            h('h2', 'Choose a repository:'),
            h('ul.item-list', repoListEl)
          ])

          app.renderContent([html, popupEl], state)
        })
      }
    }, state.user.profile.login))

    var popupEl = popup.open([
      h('h1', 'Open a file from GitHub'),
      h('h2', 'Choose an organization:'),
      h('ul.item-list', orgListEl)
    ])

    app.renderContent([html, popupEl], state)
  })

  app.renderContent([html], state)
}
