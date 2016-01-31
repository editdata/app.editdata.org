var h = require('virtual-dom/h')
var actions = require('../actions')
var PopupList = require('./popup-list')

module.exports = SaveToGitHub

function SaveToGitHub (props) {
  if (!props.activeOrg) {
    if (!props.githubOrgs.length) actions.editor.getGithubOrgs(props.user, props.store)
    return h('div', [
      h('h1', 'Save a file to GitHub'),
      h('h2', 'Choose an organization:'),
      h('button', { onclick: function () {
        actions.editor.getGithubOrgs(props.user, props.store)
      }}, 'refresh'),
      h('ul.item-list', GithubOrgList(props))
    ])
  }

  if (!props.activeRepo) {
    return h('div', [
      h('h1', 'Save a file to GitHub'),
      h('h2', 'Choose a repository:'),
      h('button', { onclick: function () {
        actions.editor.getUserRepos(props.user, props.store)
      }}, 'refresh'),
      h('button', { onclick: function () {
        actions.editor.clearOrgs(props.store)
      }}, 'back'),
      h('ul.item-list', GithubRepoList(props))
    ])
  }

  return h('div', [
    h('h1', 'Save a file to GitHub'),
    h('h2', 'Choose a branch:'),
    h('button', { onclick: function () {
      actions.editor.getBranches(props.user.profile.login, props.store)
    }}, 'refresh'),
    h('button', { onclick: function () {
      actions.editor.clearRepos(props.store)
    }}, 'back'),
    h('ul.item-list', GithubBranchList(props))
  ])
}

function GithubOrgList (props) {
  return PopupList(props.githubOrgs, {
    key: 'login',
    onclick: function (org) {
      actions.editor.selectGithubOrg(props.user, org.login, props.store)
    }
  })
}

function GithubRepoList (props) {
  return PopupList(props.githubRepos, {
    key: 'name',
    onclick: function (repo) {
      actions.editor.selectGithubRepo(props.user, repo, props.store)
    }
  })
}

function GithubBranchList (props) {
  return PopupList(props.githubBranches, {
    key: 'name',
    onclick: function (branch) {
      actions.save.newGithubFile(branch, props.store)
      actions.modal('saveNewFileToGithub', false, props.store)
    }
  })
}
