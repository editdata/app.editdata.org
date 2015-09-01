var openGitHubFile = require('./open-github-file')
var openUploadedFile = require('./open-uploaded-file')

module.exports = function openFile (source, state) {
  if (source === 'empty') {
    window.location.hash = '/edit/new'
  } else if (source === 'github') {
    return openGitHubFile(state)
  } else if (source === 'upload') {
    return openUploadedFile(state)
  } else if (source === 'dat') {

  }
}
