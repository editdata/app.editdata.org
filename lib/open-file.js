var openGitHubFile = require('./open-github-file')

module.exports = function openFile (app, source, state) {
  if (source === 'empty') {
    window.location.hash = '/edit/new'
  } else if (source === 'github') {
    return openGitHubFile(state)
  } else if (source === 'dat') {

  } else if (source === 'csv') {

  } else if (source === 'json') {

  }
}