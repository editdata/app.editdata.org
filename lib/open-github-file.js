var h = require('virtual-dom/h')
var actions = require('../actions')

var PopupList = require('../elements/popup-list')

function GithubOrgList (props) {
  return PopupList(props.githubOrganizations, {
    key: 'login',
    onclick: function (org) {
      actions.editor.getGithubRepos(props.user, org.login, props.store)
    }
  })
}

function GithubRepoList (props) {
  return PopupList(props.githubRepos, {
    key: 'name',
    onclick: function (repo) {
      actions.editor.selectGithubRepo(repo, props.store)
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
      actions.editor.selectGithubFile(file)
    }

  })
}

module.exports = function openGithubFile (props) {
  // var popup = Popup()
  var content

  if (!props.githubOrganizations) {
    actions.editor.getGithubOrgs(props)
    content = h('div')
  }

  if (!props.selectedGithubOrg) {
    content = h('div', [
      h('h1', 'Open a file from GitHub'),
      h('h2', 'Choose a repository:'),
      h('ul.item-list', GithubOrgList(props))
    ])
  }

  if (!props.selectedGithubRepo) {
    content = h('div', [
      h('h1', 'Open a file from GitHub'),
      h('h2', 'Choose a repository:'),
      h('ul.item-list', GithubRepoList(props))
    ])
  }

  if (!props.selectedGithubBranch) {
    content = h('div', [
      h('h1', 'Open a file from GitHub'),
      h('h2', 'Choose a branch:'),
      h('ul.item-list', GithubBranchList(props))
    ])
  }

  if (!props.selectedGithubFile) {
    content = h('div', [
      h('h1', 'Open a file from GitHub'),
      h('h2', 'Choose a file:'),
      h('ul.item-list', GithubFileList(props))
    ])
  }

  return content
}
