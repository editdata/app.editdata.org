var h = require('virtual-dom/h')

var PopupList = require('../elements/popup-list')

module.exports = OpenGithubFile

/**
 * Open an existing Github file
 * @param {Object} props
 */
function OpenGithubFile (props) {
  var githubBranches = props.githubBranches || []
  var githubRepos = props.githubRepos || []
  var githubFiles = props.githubFiles || []
  var githubOrgs = props.githubOrgs || []
  var activeBranch = props.activeBranch
  var activeRepo = props.activeRepo
  var activeOrg = props.activeOrg
  var actions = props.actions

  var setActiveBranch = actions.setActiveBranch
  var setActiveFile = actions.setActiveFile
  var setActiveRepo = actions.setActiveRepo
  var setActiveOrg = actions.setActiveOrg
  var getGithubOrgs = actions.getGithubOrgs

  if (!githubOrgs.length) {
    getGithubOrgs()
    return h('div')
  }

  if (!activeOrg) {
    return h('div', [
      h('h1', 'Open a file from GitHub'),
      h('h2', 'Choose an organization:'),
      h('button', { onclick: function () {
        getGithubOrgs(props)
      }}, 'refresh'),
      h('ul.item-list', PopupList({
        githubOrgs: githubOrgs,
        key: 'login',
        onclick: function (org) {
          setActiveOrg(org)
        }
      }))
    ])
  }

  if (!activeRepo) {
    return h('div', [
      h('h1', 'Open a file from GitHub'),
      h('h2', 'Choose a repository:'),
      h('ul.item-list', PopupList({
        githubRepos: githubRepos,
        key: 'name',
        onclick: function (repo) {
          setActiveRepo(repo)
        }
      }))
    ])
  }

  if (!activeBranch) {
    return h('div', [
      h('h1', 'Open a file from GitHub'),
      h('h2', 'Choose a branch:'),
      h('ul.item-list', PopupList({
        githubBranches: githubBranches,
        key: 'name',
        onclick: function (branch) {
          setActiveBranch(branch)
        }
      }))
    ])
  }

  return h('div', [
    h('h1', 'Open a file from GitHub'),
    h('h2', 'Choose a file:'),
    h('ul.item-list', PopupList(githubFiles, {
      key: 'path',
      onclick: function (file) {
        setActiveFile(file)
      }
    }))
  ])
}
