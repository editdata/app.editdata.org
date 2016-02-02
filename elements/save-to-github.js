var h = require('virtual-dom/h')

var PopupList = require('../elements/popup-list')

module.exports = SaveToGithub

function SaveToGithub (props) {
  var githubBranches = props.githubBranches || []
  var githubRepos = props.githubRepos || []
  var githubOrgs = props.githubOrgs || []
  var activeRepo = props.activeRepo
  var activeOrg = props.activeOrg
  var actions = props.actions

  var saveNewFileToGithub = actions.saveNewFileToGithub
  var getGithubOrgs = actions.getGithubOrgs
  var setActiveRepo = actions.setActiveRepo
  var setActiveOrg = actions.setActiveOrg

  if (!githubOrgs.length) {
    getGithubOrgs()
    return h('div')
  }

  if (!activeOrg) {
    return h('div', [
      h('h1', 'Save a file to GitHub'),
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
      h('h1', 'Save a file to GitHub'),
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

  return h('div', [
    h('h1', 'Save a file to GitHub'),
    h('h2', 'Choose a branch:'),
    h('ul.item-list', PopupList({
      githubBranches: githubBranches,
      key: 'name',
      onclick: function (branch) {
        if (saveNewFileToGithub) {
          saveNewFileToGithub(branch)
        }
      }
    }))
  ])
}
