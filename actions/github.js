var githubProfile = require('../lib/github-user-profile')
var orgs = require('../lib/github-organizations')
var orgRepos = require('../lib/github-org-repos')
var branches = require('../lib/github-get-branches')
var githubFile = require('../lib/github-get-blob')
var githubUserRepos = require('../lib/github-user-repos')
var repoFiles = require('../lib/github-repo-files')
var githubAuth = require('../lib/github-auth')
var constants = require('../constants')

module.exports = function GithubActionCreators (store, commonActions) {
  var setUserProfile = commonActions.setUserProfile
  var setRoute = commonActions.setRoute
  var setUser = commonActions.setUser

  /**
   * Retrieve a user's profile from Github.
   * @param  {String} userToken Github user token
   * @param  {Store} store     App store
   */
  function getProfile (userToken) {
    githubProfile(userToken, function (err, profile) {
      // TODO: Handle errors
      if (err) console.error(err)
      if (profile.message === 'Bad credentials') return console.error(profile)
      store(setUserProfile(profile))
      return store(setRoute('/'))
    })
  }

  /**
   * Authorize a Github user
   * @param  {String} code
   * @param  {Store} store
   */
  function auth (code) {
    githubAuth(code, function (err, user) {
      // TODO: Handle error
      if (err) return console.error(err)
      store(setUser(user))
      return setRoute('/')
    })
  }

  /**
   * Set the Github Organizations.  Inserts user as first organization.
   * @param {Array} list  Array of Github orgs
   * @param {Store} store
   * @return {Function}
   */
  function setOrgs (list) {
    return store({
      type: constants.SET_GITHUB_ORGS,
      orgs: list
    })
  }

  /**
   * Get Github organizations available to `user`
   * @param  {Object} user
   * @param  {Store} store
   */
  function getOrgs (user) {
    if (!user) {
      var state = store.getState()
      user = state.user
    }
    orgs(user, function (err, orgList) {
      // TODO: Handle error
      if (err) return console.error(err)
      return setOrgs(orgList)
    })
  }

  /**
   * Set the current Github org and retrieve its repos
   * @param  {Object} user
   * @param  {String} orgLogin
   * @param  {Store} store
   * @return {Function}
   */
  function setActiveOrg (orgLogin) {
    store({
      type: constants.SELECTED_ORG,
      org: orgLogin
    })

    getRepos()
  }

  /**
   * Set the current Github repos
   * @param {Array} repoList Array of Github repos
   * @param {Store} store
   * @return {Function}
   */
  function setRepos (repoList) {
    return store({
      type: constants.SET_GITHUB_REPOS,
      repos: repoList
    })
  }

  /**
   * Load a Github file
   * @param  {Object} file
   * @param  {Store} store
   */
  function setActiveFile (file) {
    var state = store.getState()

    githubFile({
      owner: state.activeOrg.login,
      repo: state.activeRepo.name,
      token: state.user.token,
      path: file.path,
      branch: state.activeBranch.name
    }, function (err, data, properties, saveData) {
      // TODO: Handle error
      if (err) console.error(err)
      setTimeout(function () { setRoute('/edit') }, 1)
      return store({
        type: constants.SELECTED_FILE,
        data: data,
        properties: properties,
        saveData: saveData
      })
    })
  }

  /**
   * Retrieve a user's Github repos
   * @param  {Object} user
   * @param  {Store} store
   */
  function getRepos () {
    var state = store.getState()
    var activeOrg = state.activeOrg
    var userLogin = state.user .profile.login

    if (!activeOrg) return
    if (activeOrg.login === userLogin) return getUserRepos()
    return getOrgRepos()
  }

  function getFiles () {
    var state = store.getState()
    repoFiles(state.user, state.activeOrg.login, state.activeRepo, function (err, fileList) {
      // TODO: Handle error
      if (err) console.error(err)
      return store({
        type: constants.SET_GITHUB_FILES,
        files: fileList
      })
    })
  }

  function getOrgRepos () {
    var state = store.getState()
    if (state.activeOrg === state.user.profile.login) {
      return getUserRepos()
    }
    orgRepos(state.user, state.activeOrg.login, function (err, repoList) {
      // TODO: Handle error
      if (err) console.error(err)
      return store({
        type: constants.SET_GITHUB_REPOS,
        repos: repoList
      })
    })
  }

  function getUserRepos () {
    var state = store.getState()
    githubUserRepos(state.user, function (err, repoList) {
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
   * @param  {Object} repo
   * @param  {Store} store
   */
  function setActiveRepo (repo) {
    store({
      type: constants.SELECTED_REPO,
      repo: repo
    })

    getBranches()
  }

  function getBranches () {
    var state = store.getState()
    var ownerLogin = state.activeOrg.login
    if (!state.activeRepo) return
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

  /**
   * Load a Github branch and all its files
   * @param  {String} branch
   * @param  {Store} store
   */
  function setActiveBranch (branch) {
    store({
      type: constants.SELECTED_BRANCH,
      branch: branch
    })

    getFiles()
  }

  /**
  * Unset active selections
  */
  function unsetSelections () {
    return store({
      type: constants.UNSET_ACTIVE_GITHUB_SELECTIONS
    })
  }

  return {
    auth: auth,
    setRepos: setRepos,
    setOrgs: setOrgs,
    getProfile: getProfile,
    getOrgs: getOrgs,
    getFiles: getFiles,
    getBranches: getBranches,
    getUserRepos: getUserRepos,
    getOrgRepos: getOrgRepos,
    getRepos: getRepos,
    setActiveBranch: setActiveBranch,
    setActiveRepo: setActiveRepo,
    setActiveFile: setActiveFile,
    setActiveOrg: setActiveOrg,
    unsetSelections: unsetSelections
  }
}
