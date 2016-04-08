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
  var getBranches = actions.getBranches
  var getRepos = actions.getRepos
  var getFiles = actions.getFiles
  var getOrgs = actions.getOrgs

  if (!githubOrgs.length) {
    getOrgs()
    return h('div')
  }

  if (!activeOrg) {
    return h('div', [
      h('h1', 'Open a file from GitHub'),
      h('h2', 'Choose an organization:'),
      h('button.small.gray', { onclick: function () {
        getOrgs()
      }}, 'refresh'),
      h('ul.item-list', PopupList(githubOrgs, {
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
      h('button.small.gray', { onclick: function () {
        getRepos()
      }}, 'refresh'),
      h('button.small.gray', { onclick: function () {
        setActiveOrg(null)
      }}, 'back'),
      h('ul.item-list', PopupList(githubRepos, {
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
      h('button.small.gray', { onclick: function () {
        getBranches()
      }}, 'refresh'),
      h('button.small.gray', { onclick: function () {
        setActiveRepo(null)
      }}, 'back'),
      h('ul.item-list', PopupList(githubBranches, {
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
    h('button.small.gray', { onclick: function () {
      getFiles()
    }}, 'refresh'),
    h('button.small.gray', { onclick: function () {
      setActiveBranch(null)
    }}, 'back'),
    h('ul.item-list', PopupList(githubFiles, {
      key: 'path',
      onclick: function (file) {
        setActiveFile(file)
      }
    }))
  ])
}
