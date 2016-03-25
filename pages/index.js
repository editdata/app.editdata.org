var h = require('virtual-dom/h')
var qs = require('query-string')
var Header = require('../elements/header')
var OpenUploadedFile = require('../elements/open-uploaded-file')
var OpenGithubFile = require('../elements/open-github-file')
var Popup = require('../elements/popup')
var GetStarted = require('../elements/get-started')
var Landing = require('../elements/landing')

module.exports = Index

function Index (props) {
  var actions = props.actions
  var user = props.user
  var query = qs.parse(window.location.search)
  var CurrentModal = null

  // User has a token but no profile, grab it from Github
  if (!user.profile && user.token) actions.github.auth(user.token)

  // User is authenticating with Github OAuth
  if (!user.profile && query && query.code) actions.github.auth(query.code)

  var loggedIn = user.profile && user.token

  var modals = props.ui.modals
  var activeModal = null

  // Detect active modal
  Object.keys(modals).some(function (key) {
    if (!modals[key]) return false
    activeModal = key
    return true
  })

  if (activeModal) {
    var Modal = getModal(activeModal)
    CurrentModal = Popup({ onclose: actions.closeModals }, [ Modal ])
  }

  function getModal (type) {
    if (type === 'openNewGithub') {
      return OpenGithubFile({
        githubBranches: props.githubBranches,
        githubRepos: props.githubRepos,
        githubFiles: props.githubFiles,
        githubOrgs: props.githubOrgs,
        activeBranch: props.activeBranch,
        activeRepo: props.activeRepo,
        activeOrg: props.activeOrg,
        actions: {
          getOrgs: actions.github.getOrgs,
          getRepos: actions.github.getRepos,
          getFiles: actions.github.getFiles,
          getBranches: actions.github.getBranches,
          setActiveOrg: actions.github.setActiveOrg,
          setActiveRepo: actions.github.setActiveRepo,
          setActiveBranch: actions.github.setActiveBranch,
          setActiveFile: actions.github.setActiveFile
        }
      })
    }

    if (type === 'openNewUpload') {
      return OpenUploadedFile({
        onfile: function onfile (event, file) {
          actions.file.read(file)
          actions.closeModals()
          actions.setRoute('/edit')
        }
      })
    }
  }

  return h('div.app-container', [
    Header(props),
    h('div#content', [
      h('div.content-wrapper', [
        h('div.content', loggedIn ? GetStarted(props) : Landing(props))
      ])
    ]),
    CurrentModal
  ])
}
