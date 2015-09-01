var saveNewFile = require('./save-new-file')
var saveUpdatedGitHubFile = require('./save-updated-github-file')

module.exports = function saveFile (app, state) {
  if (!state.saveData.source || !state.saveData.location) {
    return saveNewFile(app, state)
  } else if (state.saveData.source === 'github') {
    return saveUpdatedGitHubFile(app, state)
  }
}
