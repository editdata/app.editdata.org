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
  location: document.location.href,
  config: config,
  editor: {
    activeProperty: null,
    activeRow: null,
    data: [],
    properties: {}
  },
  file: {
    type: null,
    name: null,
    saveData: {
      type: null,
      source: null,
      location: null,
      branch: null
    }
  },
  githubOrgs: [],
  githubRepos: [],
  githubBranches: [],
  ui: {
    menus: {
      openFile: false
    },
    modals: {
      openNewGithub: false,
      openNewUpload: false,
      saveNewFile: false,
      saveNewFileToGithub: false,
      createNewColumn: false,
      columnSettings: false
    }
  }
}
