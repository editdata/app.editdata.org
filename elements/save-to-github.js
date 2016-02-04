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
  var getOrgs = actions.getOrgs
  var getRepos = actions.getRepos
  var getBranches = actions.getBranches
  var setActiveRepo = actions.setActiveRepo
  var setActiveOrg = actions.setActiveOrg

  if (!githubOrgs.length) {
    getOrgs()
    return h('div')
  }

  if (!activeOrg) {
    return h('div', [
      h('h1', 'Save a file to GitHub'),
      h('h2', 'Choose an organization:'),
      h('button', { onclick: function () {
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
      h('h1', 'Save a file to GitHub'),
      h('h2', 'Choose a repository:'),
      h('button.small', { onclick: function () {
        getRepos()
      }}, 'refresh'),
      h('button.small', { onclick: function () {
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

  return h('div', [
    h('h1', 'Save a file to GitHub'),
    h('h2', 'Choose a branch:'),
    h('button.small', { onclick: function () {
      getBranches()
    }}, 'refresh'),
    h('button.small', { onclick: function () {
      setActiveRepo(null)
    }}, 'back'),
    h('ul.item-list', PopupList(githubBranches, {
      key: 'name',
      onclick: function (branch) {
        saveNewFileToGithub(branch)
      }
    }))
  ])
}
