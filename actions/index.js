/*global requestAnimationFrame*/
var constants = require('../constants')
var githubProfile = require('../lib/github-user-profile')
var orgs = require('../lib/github-organizations')
var orgRepos = require('../lib/github-org-repos')
var branches = require('../lib/github-get-branches')
var githubFile = require('../lib/github-get-blob')
var githubUserRepos = require('../lib/github-user-repos')
var repoFiles = require('../lib/github-repo-files')

var auth = require('../lib/github-auth')
var router = require('../lib/router')

var save = require('./save')

var editor = {}

/**
 * Sign out of the app
 * @param  {Store} store App store
 * @return {Function}
 */
function signOut (store) {
  return store({
    type: constants.SIGN_OUT
  })
}

/**
 * Reset state to initialState
 * @param {Store} store
 * @return {Function}
 */
function reset (store) {
  store({
    type: constants.RESET
  })
}

/**
 * Set the current URL properties.  This is a
 * Private method, use `setRoute` to trigger route changes.
 * @return {Object}
 */
function setUrl () {
  return {
    type: constants.SET_URL
  }
}

/**
 * Set a user's Github profile
 * @param {Object} profile Github profile object
 * @return {Object}
 */
function setUserProfile (profile) {
  return {
    type: constants.SET_USER_PROFILE,
    profile: profile
  }
}

/**
 * Set the current user
 * @param {Object} user User object
 * @return {Object}
 */
function setUser (user) {
  return {
    type: constants.SET_USER,
    user: user
  }
}

/**
 * Trigger a route change.  The router call is wrapped in
 * `requestAnimationFrame` to throttle quick route changes.
 * @param {String} url     Path to trigger
 * @param {Object} options Router options
 * @param {Store} store   App store
 */
function setRoute (url, options, store) {
  requestAnimationFrame(function () {
    router.go(url, options || {})
    setUrl(store)
  })
}

/**
 * Toggle `modal` open or closed.  Opening a model closes all other modals.
 * @param  {String} modal Modal property name, as found in initialState
 * @param  {Booleab} value True to open, false to close
 * @param  {Store} store App store
 * @return {Function}
 */
function modal (modal, value, store) {
  return store({
    type: constants.MODAL,
    modal: modal,
    value: value
  })
}

/**
 * Toggle drop-down `menu` open or closed.  Opening a menu
 * closes all other menus.
 * @param  {String} menu  Menu property name, as found in initialState
 * @param  {Boolean} value True to open, false to close
 * @param  {Store} store App store
 * @return {Function}
 */
function menu (menu, value, store) {
  return store({
    type: constants.MENU,
    menu: menu,
    value: value
  })
}

/**
 * Retrieve a user's profile from Github.
 * @param  {String} userToken Github user token
 * @param  {Store} store     App store
 * @return {Function}
 */
function getGithubProfile (userToken, store) {
  githubProfile(userToken, function (err, profile) {
    // TODO: Handle errors
    if (err) console.error(err)
    if (profile.message === 'Bad credentials') return console.error(profile)
    store(setUserProfile(profile))
    return setRoute('/edit/new', store)
  })
}

/**
 * Authorize a Github user
 * @param  {String} code
 * @param  {Store} store
 * @return {Function}
 */
function githubAuth (code, store) {
  auth(code, function (err, user) {
    // TODO: Handle error
    if (err) console.error(err)
    store(setUser(user))
    return setRoute('/edit/new', {query: false}, store)
  })
}

/**
 * Add a row to the sheet
 * @param  {Store} store App store
 * @return {Function}
 */
editor.newRow = function newRow (store) {
  return store({
    type: constants.NEW_ROW
  })
}

/**
 * Destroy row with `key`
 * @param  {String} key   Row key
 * @param  {Store} store
 * @return {Function}
 */
editor.destroyRow = function destroyRow (key, store) {
  return store({
    type: constants.DESTROY_ROW,
    key: key
  })
}

/**
 * Add a column to the sheet
 * @param  {String} name
 * @param  {String} type
 * @param  {Store} store
 * @return {Function}
 */
editor.newColumn = function newColumn (name, type, store) {
  return store({
    type: constants.NEW_COLUMN,
    property: { name: name, type: type }
  })
}

/**
 * Destroy column with `key`
 * @param  {String} key   Column key
 * @param  {Store} store
 * @return {Function}
 */
editor.destroyColumn = function destroyColumn (key, store) {
  return store({
    type: constants.DESTROY_COLUMN,
    key: key
  })
}

/**
 * Rename column with `key` to `newName`
 * @param  {String} key     Column key
 * @param  {String} newName
 * @param  {Store} store
 * @return {Function}
 */
editor.renameColumn = function renameColumn (key, newName, store) {
  return store({
    type: constants.RENAME_COLUMN,
    key: key,
    newName: newName
  })
}

/**
 * Update a cell's contents
 * @param  {Object} property
 * @param  {Object} row
 * @param  {Store} store
 * @return {Function}
 */
editor.updateCellContent = function updateCellContent (propertyKey, value, rowKey, store) {
  return store({
    type: constants.UPDATE_CELL_CONTENT,
    propertyKey: propertyKey,
    value: value,
    rowKey: rowKey
  })
}

/**
 * Destroy the current sheet (wipe state.properties and state.data)
 * @param  {Store} store
 * @return {Function}       [description]
 */
editor.destroy = function destroy (store) {
  return store({
    type: constants.DESTROY
  })
}

/**
 * Set the active row
 * @param {Object} active Active Row object
 * @param {Function} store
 * @return {Function}
 */
editor.setActiveRow = function setActiveRow (active, store) {
  return store({
    type: constants.SET_ACTIVE_ROW,
    activeRow: active
  })
}

/**
 * Set the property currently being edited
 * @param {String} propertyKey
 * @param {Store} store
 * @return {Function}
 */
editor.setActiveProperty = function setActiveProperty (propertyKey, store) {
  return store({
    type: constants.SET_ACTIVE_PROPERTY,
    propertyKey: propertyKey
  })
}

/**
 * Set the Github Organizations.  Inserts user as first organization.
 * @param {Array} list  Array of Github orgs
 * @param {Store} store
 * @return Function
 */
editor.setGithubOrgs = function setGithubOrgs (list, store) {
  return store({
    type: constants.SET_GITHUB_ORGS,
    orgs: list
  })
}

/**
 * Get Github organizations available to `user`
 * @param  {Object} user
 * @param  {Store} store
 * @return {Function}
 */
editor.getGithubOrgs = function getGithubOrgs (user, store) {
  orgs(user, function (err, orgList) {
    if (err) return editor.openNewError(err, store)
    return editor.setGithubOrgs(orgList, store)
  })
}

/**
 * Set the current Github org and retrieve its repos
 * @param  {Object} user
 * @param  {String} orgLogin
 * @param  {Store} store
 * @return {Function}
 */
editor.selectGithubOrg = function selectGithubOrg (user, orgLogin, store) {
  store({
    type: constants.SELECTED_ORG,
    org: orgLogin
  })

  if (user.profile.login === orgLogin) {
    return editor.getUserRepos(user, store)
  }

  orgRepos(user, function (err, repoList) {
    // TODO: Handle error
    if (err) console.error(err)
    return editor.setGithubRepos(repoList, store)
  })
}

/**
 * Set the current Github repos
 * @param {Array} repoList Array of Github repos
 * @param {Store} store
 * @return {Function}
 */
editor.setGithubRepos = function setGithubRepos (repoList, store) {
  return store({
    type: constants.SET_GITHUB_REPOS,
    repos: repoList
  })
}

/**
 * Load a Github file
 * @param  {Object} file
 * @param  {Store} store
 * @return {Function}
 */
editor.selectGithubFile = function selectGithubFile (file, store) {
  var state = store.getState()
  githubFile({
    owner: state.activeOrg,
    repo: state.activeRepo.name,
    token: state.user.token,
    path: file.path,
    branch: state.activeBranch.name
  }, function (err, data, properties, save) {
    // TODO: Handle error
    if (err) console.error(err)
    setTimeout(function () { setRoute('/edit') }, 1)
    return store({
      type: constants.SELECTED_FILE,
      data: data,
      properties: properties,
      save: save
    })
  })
}

/**
 * Load uploaded file
 * @param  {Array} data
 * @param  {Object} properties
 * @param  {Object} save
 * @param  {Store} store
 * @return {Function}
 */
editor.selectUploadedFile = function selectUploadedFile (data, properties, save, store) {
  setRoute('/edit')
  return store({
    type: constants.SELECTED_FILE,
    data: data,
    properties: properties,
    save: save
  })
}

/**
 * Trigger Open New File process
 * @param  {String} slug  File source
 * @param  {Store} store
 * @return {Function}
 */
editor.openNew = function openNew (slug, store) {
  if (slug === 'empty') {
    editor.destroy(store)
    return setRoute('/edit/new')
  }
  if (slug === 'github') return modal('openNewGithub', true, store)
  if (slug === 'upload') return modal('openNewUpload', true, store)
}

/**
 * Display `err` when opening file
 * @param  {Error} err
 * @param  {Store} store
 * @return {Function}
 */
editor.openNewError = function openNewError (err, store) {
  return store({
    type: constants.OPEN_NEW_ERROR,
    err: err
  })
}

/**
 * Retrieve a user's Github repos
 * @param  {Object} user
 * @param  {Store} store
 * @return {Function}
 */
editor.getUserRepos = function getUserRepos (user, store) {
  githubUserRepos(user, function (err, repoList) {
    // TODO: Handle error
    if (err) console.error(err)
    return store({
      type: constants.SET_GITHUB_REPOS,
      repos: repoList
    })
  })
}

/**
 * Load a Github repo and its branches
 * @param  {Object} user
 * @param  {Object} repo
 * @param  {Store} store
 * @return {Function}
 */
editor.selectGithubRepo = function selectGithubRepo (user, repo, store) {
  store({
    type: constants.SELECTED_REPO,
    repo: repo
  })

  branches({
    token: user.token,
    owner: user.profile.login,
    repo: repo.name
  }, function (err, branchesList) {
    // TODO: Handle error
    if (err) console.error(err)
    return store({
      type: constants.SET_GITHUB_BRANCHES,
      branches: branchesList
    })
  })
}

editor.getBranches = function getBranches (ownerLogin, store) {
  var state = store.getState()
  branches({
    token: state.user.token,
    owner: ownerLogin,
    repo: state.activeRepo.name
  }, function (err, branchesList) {
    // TODO: Handle error
    if (err) console.error(err)
    return store({
      type: constants.SET_GITHUB_BRANCHES,
      branches: branchesList
    })
  })
}

editor.clearBranches = function clearBranches (store) {
  store({
    type: constants.CLEAR_BRANCHES
  })
}

editor.clearRepos = function clearRepos (store) {
  store({
    type: constants.CLEAR_REPOS
  })
}

editor.clearOrgs = function clearOrgs (store) {
  store({
    type: constants.CLEAR_ORGS
  })
}

editor.propertyType = function propertyType (propertyKey, propertyType, store) {
  store({
    type: constants.PROPERTY_TYPE,
    propertyKey: propertyKey,
    propertyType: propertyType
  })
}

/**
 * Load a Github branch and all its files
 * @param  {String} branch
 * @param  {Store} store
 * @return {Function}
 */
editor.selectGithubBranch = function selectGithubBranch (branch, store) {
  var state = store.getState()
  store({
    type: constants.SELECTED_BRANCH,
    branch: branch
  })

  repoFiles(state.user, state.activeOrg, state.activeRepo, function (err, fileList) {
    // TODO: Handle error
    if (err) console.error(err)
    return store({
      type: constants.SET_GITHUB_FILES,
      files: fileList
    })
  })
}

/**
 * Set the file type to save as
 * @param {String} type
 * @param {Store} store
 * @return {Function}
 */
editor.setFileType = function setFileType (type, store) {
  store({
    type: constants.SET_FILE_TYPE,
    fileType: type
  })
}

/**
 * Set the current file name
 * @param {String} filename
 * @param {Store} store
 */
editor.setFilename = function setFilename (filename, store) {
  store({
    type: constants.SET_FILENAME,
    filename: filename
  })
}

module.exports = {
  editor: editor,
  modal: modal,
  menu: menu,
  save: save,
  reset: reset,
  setUrl: setUrl,
  setUser: setUser,
  setUserProfile: setUserProfile,
  setRoute: setRoute,
  githubAuth: githubAuth,
  getGithubProfile: getGithubProfile,
  signOut: signOut
}
