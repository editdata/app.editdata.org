var saveNewFile = require('./save-new-file')
var saveUpdatedGitHubFile = require('./save-updated-github-file')

module.exports = function saveFile (props) {
  if (!state.saveData.source || !state.saveData.location) {
    return saveNewFile(props)
  } else if (state.saveData.source === 'github') {
    return saveUpdatedGitHubFile(props)
  }
}
