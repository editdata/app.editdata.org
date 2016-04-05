var githubCreateBlob = require('../lib/github-create-blob')
var githubUpdateBlob = require('../lib/github-update-blob')
var saveBlob = require('../lib/save-download-blob')
var toCSV = require('../lib/to-csv')
var toJSON = require('../lib/to-json')
var constants = require('../constants')

module.exports = function SaveActionCreators (store, commonActions) {
  /**
   * Trigger CSV download through the browser
   * @param  {Store} store
   */
  function downloadCSV () {
    var state = store.getState()
    var editor = state.editor
    var file = state.file
    toCSV(editor.properties, editor.data, function (err, csv) {
      if (err) console.error(err)
      return saveBlob(csv, file.name + '.' + file.type)
    })
  }

  /**
   * Trigger JSON download through the browser
   * @param  {Store} store
   * @return {Function}
   */
  function downloadJSON () {
    var state = store.getState()
    var editor = state.editor
    var file = state.file
    return saveBlob(toJSON(editor.properties, editor.data), file.name + '.' + file.type)
  }

  /**
   * Save a new file to Github `branch`
   * @param  {String} branch
   * @param  {Store} store
   */
  function newGithubFile (branch) {
    var state = store.getState()
    var editor = state.editor
    var file = state.file

    if (file.type === 'json') {
      save(toJSON(editor.properties, editor.data))
    } else if (file.type === 'csv') {
      toCSV(editor.properties, editor.data, function (err, data) {
        // TODO: Handle error
        if (err) console.error(err)
        return save(data)
      })
    }

    function save (src) {
      var filename = state.file.name + '.' + state.file.type
      githubCreateBlob({
        owner: state.activeOrg.login,
        repo: state.activeRepo.name,
        token: state.user.token,
        path: filename,
        message: 'Create ' + filename,
        content: src,
        branch: branch.name
      }, function (err, res, save) {
        // TODO: Handle Error
        if (err) console.error(err)
        store({
          type: constants.MODAL,
          modal: 'saveNewFileToGithub',
          value: false
        })

        store({
          type: constants.SET_NOTIFICATION,
          level: 'success',
          message: 'File successfully saved to Github!'
        })
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
   */
  function updatedGithubFile (message) {
    var state = store.getState()
    var fileType = state.file.type

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
        owner: state.file.saveData.owner,
        repo: state.file.saveData.repo,
        path: state.file.saveData.location.path,
        message: message,
        content: data,
        sha: state.file.saveData.location.sha
      }, function (err, body) {
        // TODO: Handle error
        if (err) return console.error(err)
        state.file.saveData.location.sha = body.content.sha
        state.file.saveData.location.url = body.content.git_url
        store({
          type: constants.MODAL,
          modal: 'saveNewFile',
          value: false
        })

        store({
          type: constants.SET_NOTIFICATION,
          level: 'success',
          message: 'File successfully saved to Github!'
        })

        return store({
          type: constants.SAVE_TO_GITHUB_SUCCESS,
          saveData: state.file.saveData
        })
      })
    }
  }

  return {
    downloadCSV: downloadCSV,
    downloadJSON: downloadJSON,
    newGithubFile: newGithubFile,
    updatedGithubFile: updatedGithubFile
  }
}
