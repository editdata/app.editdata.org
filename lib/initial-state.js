var config = require('../config')

module.exports = {
  site: {
    title: 'EditData'
  },
  user: {
    profile: null,
    token: null
  },
  url: null,
  data: [],
  properties: {},
  saveData: {
    type: null,
    source: null,
    location: null,
    branch: null
  },
  activeProperty: null,
  activeRow: null,
  location: document.location.href,
  config: config,
  fileType: null,
  modals: {
    openNewGithub: false,
    openNewUpload: false,
    saveNewFile: false,
    saveNewFileToGithub: false,
    createNewColumn: false,
    columnSettings: false
  },
  menus: {
    openFile: false
  },
  githubOrgs: [],
  githubRepos: [],
  githubBranches: []
}
