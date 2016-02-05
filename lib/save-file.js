var saveNewFile = require('./save-new-file')
var saveUpdatedGitHubFile = require('./save-updated-github-file')

module.exports = function saveFile (props) {
  if (!props.saveData.source || !props.saveData.location) {
    return saveNewFile(props)
  } else if (props.saveData.source === 'github') {
    return saveUpdatedGitHubFile(props)
  }
}
