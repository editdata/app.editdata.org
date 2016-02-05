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

// orgs(user, function (err, orgList) {
//   if (err) return popup.send('error', err)
//
//   var orgListEl = PopupList(orgList, {
//     key: 'login',
//     onclick: function (org) {
//
//     })
//       orgRepos(user, org.login, function (err, repoList) {
//         if (err) return popup.send('error', err)
//
//         var repoListEl = PopupList(repoList, {
//           key: 'name',
//           onclick: function (repo) {
//             branches({
//               token: state.user.token,
//               owner: org.login,
//               repo: repo.name
//             }, function (err, branchList) {
//               if (err) return popup.send('error', err)
//               var branchListEl = PopupList(branchList, {
//                 key: 'name',
//                 onclick: function (branch) {
//                   repoFiles(state.user, org, repo, function (err, fileList) {
//                     if (err) return popup.send('error', err)
//
//                     var fileListEl = PopupList(fileList, {
//                       key: 'path',
//                       onclick: function (file) {
//                         require('./github-get-blob')({
//                           owner: org.login,
//                           repo: repo.name,
//                           token: state.user.token,
//                           path: file.path,
//                           branch: branch.name
//                         }, function (err, data, properties, save) {
//                           if (err) return popup.send('error', err)
//                           popup.send('done', data, properties, save)
//                         })
//                       }
//                     })
//
//                     var popupEl = popup.open([
//                       h('h1', 'Open a file from GitHub'),
//                       h('h2', 'Choose a file:'),
//                       h('ul.item-list', fileListEl)
//                     ])
//
//                     popup.send('render', popupEl)
//                   })
//                 }
//               })
//
//               var popupEl = popup.open([
//                 h('h1', 'Open a file from GitHub'),
//                 h('h2', 'Choose a branch:'),
//                 h('ul.item-list', branchListEl)
//               ])
//
//               popup.send('render', popupEl)
//             })
//           }
//         })
//
//         var popupEl = popup.open([
//           h('h1', 'Open a file from GitHub'),
//           h('h2', 'Choose a repository:'),
//           h('ul.item-list', repoListEl)
//         ])
//
//         popup.send('render', popupEl)
//       })
//     }
//   })
//
//   orgListEl.unshift(h('li.item', {
//     onclick: function (e) {
//       repos(state.user, function (err, repoList) {
//         if (err) return popup.send('error', err)
//         var repoListEl = PopupList(repoList, {
//           key: 'name',
//           onclick: function (repo) {
//             branches({
//               token: state.user.token,
//               owner: state.user.profile.login,
//               repo: repo.name
//             }, function (err, branchList) {
//               if (err) return popup.send('error', err)
//               var branchListEl = PopupList(branchList, {
//                 key: 'name',
//                 onclick: function (branch) {
//                   console.log(branch)
//                   repoFiles(state.user, state.user.profile, repo, function (err, fileList) {
//                     if (err) return popup.send('error', err)
//
//                     var fileListEl = PopupList(fileList, {
//                       key: 'path',
//                       onclick: function (file) {
//                         require('./github-get-blob')({
//                           owner: state.user.profile.login,
//                           repo: repo.name,
//                           token: state.user.token,
//                           path: file.path,
//                           branch: branch.name
//                         }, function (err, data, properties, save) {
//                           if (err) return popup.send('error', err)
//                           popup.send('done', data, properties, save)
//                         })
//                       }
//                     })
//
//                     var popupEl = popup.open([
//                       h('h1', 'Open a file from GitHub'),
//                       h('h2', 'Choose a file:'),
//                       h('ul.item-list', fileListEl)
//                     ])
//
//                     popup.send('render', popupEl)
//                   })
//                 }
//               })
//
//               var popupEl = popup.open([
//                 h('h1', 'Open a file from GitHub'),
//                 h('h2', 'Choose a branch:'),
//                 h('ul.item-list', branchListEl)
//               ])
//
//               popup.send('render', popupEl)
//             })
//           }
//         })
//
//         var popupEl = popup.open([
//           h('h1', 'Open a file from GitHub'),
//           h('h2', 'Choose a repository:'),
//           h('ul.item-list', repoListEl)
//         ])
//
//         popup.send('render', popupEl)
//       })
//     }
//   }, state.user.profile.login))
//
//   var popupEl = popup.open([
//     h('h1', 'Open a file from GitHub'),
//     h('h2', 'Choose an organization:'),
//     h('ul.item-list', orgListEl)
//   ])
//
//   popup.send('render', popupEl)
// })
//
// popup.send('render', null)
// return popup
// }
