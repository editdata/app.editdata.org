var githubCreateBlob = require('../lib/github-create-blob')
var githubUpdateBlob = require('../lib/github-update-blob')
var saveBlob = require('../lib/save-download-blob')
var toCSV = require('../lib/to-csv')
var toJSON = require('../lib/to-json')
var constants = require('../constants')

/**
 * Trigger CSV download through the browser
 * @param  {Store} store
 * @return {Function}
 */
function csv (store) {
  var state = store.getState()
  toCSV(state.properties, state.data, function (err, csv) {
    if (err) console.error(err)
    return saveBlob(csv, state.filename)
  })
}

/**
 * Trigger JSON download through the browser
 * @param  {Store} store
 * @return {Function}
 */
function json (store) {
  var state = store.getState()
  return saveBlob(toJSON(state.properties, state.data), state.filename)
}

/**
 * Save a new file to Github `branch`
 * @param  {String} branch
 * @param  {Store} store
 * @return {Function}
 */
function newGithubFile (branch, store) {
  var state = store.getState()
  var fileType = state.fileType
  if (fileType === 'json') save(toJSON(state.properties, state.data))
  if (fileType === 'csv') {
    toCSV(state.properties, state.data, function (err, data) {
      // TODO: Handle error
      if (err) console.error(err)
      return save(data)
    })
  }

  function save (src) {
    githubCreateBlob({
      owner: state.activeOrg,
      repo: state.activeRepo.name,
      token: state.user.token,
      path: state.filename,
      message: 'Create ' + state.filename,
      content: src,
      branch: branch.name
    }, function (err, res, save) {
      // TODO: Handle Error
      if (err) console.error(err)
      return store({
        type: constants.SAVE_TO_GITHUB_SUCCESS,
        saveData: save
      })
    })
  }
}

/**
 * Save an updated Github file
 * @param  {String} message Commit message
 * @param  {Store} store
 * @return {Function}
 */
function updatedGithubFile (message, store) {
  var state = store.getState()
  var fileType = state.fileType

  if (fileType === 'json') save(toJSON(state.properties, state.data))
  if (fileType === 'csv') {
    toCSV(state.properties, state.data, function (err, data) {
      // TODO: Handle error
      if (err) console.error(err)
      return save(data)
    })
  }

  function save (data) {
    githubUpdateBlob({
      token: state.user.token,
      owner: state.saveData.owner,
      repo: state.saveData.repo,
      path: state.saveData.location.path,
      message: message,
      content: data,
      sha: state.saveData.location.sha
    }, function (err, body) {
      // TODO: Handle error
      if (err) return console.error(err)
      state.saveData.location.sha = body.content.sha
      state.saveData.location.url = body.content.git_url
      return store({
        type: constants.SAVE_TO_GITHUB_SUCCESS,
        saveData: state.saveData
      })
    })
  }
}

module.exports = {
  csv: csv,
  json: json,
  newGithubFile: newGithubFile,
  updatedGithubFile: updatedGithubFile
}
