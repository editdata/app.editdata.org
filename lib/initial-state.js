var config = require('../config')

module.exports = {
  site: {
    title: 'EditData'
  },
  user: {
    profile: null,
    token: null
  },
  data: [],
  properties: {},
  url: null,
  location: document.location.href,
  config: config,
  editor: {
    activeProperty: null,
    activeRow: null,
    saveData: {
      type: null,
      source: null,
      location: null,
      branch: null
    }
  },
  file: {
    type: null,
    name: null
  },
  githubOrgs: [],
  githubRepos: [],
  githubBranches: [],
  activeOrg: null,
  activeRepo: null,
  activeBranch: null,
  notification: {
    level: null,
    message: null
  },
  ui: {
    menus: {
      openFile: false
    },
    modals: {
      openNewGithub: false,
      openNewUpload: false,
      saveFile: false,
      exportFile: false,
      saveNewFileToGithub: false,
      createNewColumn: false,
      columnSettings: false,
      destroyRowConfirm: false
    }
  }
}
