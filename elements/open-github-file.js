var h = require('virtual-dom/h')
var actions = require('../actions')

var PopupList = require('../elements/popup-list')

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
      actions.editor.selectGithubBranch(branch, props.store)
    }
  })
}

function GithubFileList (props) {
  return PopupList(props.githubFiles, {
    key: 'path',
    onclick: function (file) {
      actions.editor.selectGithubFile(file, props.store)
    }

  })
}

module.exports = function openGithubFile (props) {
  // var popup = Popup()

  if (!props.githubOrgs) {
    actions.editor.getGithubOrgs(props.user, props.store)
    return h('div')
  }

  if (!props.githubRepos) {
    return h('div', [
      h('h1', 'Open a file from GitHub'),
      h('h2', 'Choose an organization:'),
      h('button', { onclick: function () {
        actions.editor.getGithubOrgs(props.user, props.store)
      }}, 'refresh'),
      h('ul.item-list', GithubOrgList(props))
    ])
  }

  if (!props.activeRepo) {
    return h('div', [
      h('h1', 'Open a file from GitHub'),
      h('h2', 'Choose a repository:'),
      h('ul.item-list', GithubRepoList(props))
    ])
  }

  if (!props.activeBranch) {
    return h('div', [
      h('h1', 'Open a file from GitHub'),
      h('h2', 'Choose a branch:'),
      h('ul.item-list', GithubBranchList(props))
    ])
  }

  if (!props.selectedGithubFile) {
    return h('div', [
      h('h1', 'Open a file from GitHub'),
      h('h2', 'Choose a file:'),
      h('ul.item-list', GithubFileList(props))
    ])
  }
}
