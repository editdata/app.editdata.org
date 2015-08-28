var GitHub = require('github-api')
var cookie = require('cookie-cutter')
var h = require('virtual-dom/h')

var orgs = require('./lib/github-organizations')
var orgRepos = require('./lib/github-org-repos')
var repos = require('./lib/github-user-repos')
var profile = require('./lib/github-user-profile')
var router = require('./lib/router')
var state = require('./lib/state')
var editor = require('./lib/editor')(state)
var github

var content = require('./elements/content')()
var header = require('./elements/header')(document.querySelector('header'))
var auth = require('./elements/github-auth')()
var landing = require('./elements/landing')()
var dataset = require('./elements/new-dataset')()

auth.addEventListener('sign-out', function () {
  cookie.set('editdata', '', { expires: new Date(0) })
  state.user = null
  state.gist = null
  state.data = []
  state.properties = []
  window.location = window.location.origin
})

router.on('/', function (params) {
  if (state.user && state.gist) window.location.hash = '/edit/' + state.gist.id
  else if (state.user && !state.gist) window.location.hash = '/edit/new'
  else renderContent([landing.render(state)])
})

router.on('/about', function (params) {
  var about = require('./elements/about')()
  var html = about.render(state)
  renderContent([html])
})

router.on('/edit/new', function (params) {
  if (!state.user) window.location.hash = '/'
  state.gist = null
  state.data = []
  state.properties = []
  renderEditor()
})

router.on('/edit/gist/:gist', function (params) {
  var gist = github.getGist(params.gist)
  gist.read(function (err, data) {
    if (err) console.error(err)
    state.gist = data
    state.data = JSON.parse(data.files['data.json'].content)
    state.properties = JSON.parse(data.files['metadata.json'].content).properties
    renderEditor()
    editor.listActive()
  })
})

router.on('/view/gist/:gist', function (params) {
  // TODO: make this a read-only version of the editor
  window.location.hash = '/gist/edit/' + params.gist
})

router.on('/edit/github/:user/:repo/:branch/:file', function (params) {
  // TODO: use this route for editing data in github repos
})

router.on('/view/github/:user/:repo/:branch/:file', function (params) {
  // TODO: use this route for viewing data in github repos
})

function renderContent (elements) {
  document.getElementById('editor').style.display = 'none'
  document.getElementById('content').style.display = 'initial'
  header.render([auth.render(state)], state)
  content.render(elements)
}

function renderEditor () {
  document.getElementById('editor').style.display = 'initial'
  document.getElementById('content').style.display = 'none'
  header.render([auth.render(state)], state)
  editor.render(state)
}

if (state.url.query.code) {
  auth.verify(state.url.query.code, function (err, user) {
    if (err) console.error(err)
    state.user = user
    cookie.set('editdata', user.token)
    github = new GitHub({
      token: user.token,
      auth: 'oauth'
    })
    router.start()
    if (!state.gist) window.location = window.location.origin + '/#/edit/new'
  })
} else if (state.user && state.user.token) {
  github = new GitHub({
    token: state.user.token,
    auth: 'oauth'
  })
  profile(state.user.token, function (err, profile) {
    if (err) console.error(err)
    state.user.profile = profile
    router.start()
  })
} else {
  router.start()
}

dataset.addEventListener('empty', function (csv) {
  state.editing = true
  window.location.hash = '/edit/new'
})

editor.openEmpty.addEventListener('click', function (e) {
  editor.popup.open([
    h('h1', 'Create a new dataset')
  ])
  renderEditor()
})

editor.openCSV.addEventListener('click', function (e) {
  editor.popup.open([
    h('h1', 'Upload a CSV file')
  ])
  renderEditor()
})

editor.openJSON.addEventListener('click', function (e) {
  editor.popup.open([
    h('h1', 'Upload a JSON file')
  ])
  renderEditor()
})

editor.list.addEventListener('click', function (e, row) {
  editor.item.render(row)
  editor.itemActive()
  renderEditor()
})

editor.item.addEventListener('close', function (e) {
  editor.listActive()
})

editor.openGithub.addEventListener('click', function (e) {
  orgs(state.user, function (err, orgs) {
    var list = []

    list.push(h('li.org.item', {
      onclick: function (e) {
        repos(state.user, function (err, repos) {
          console.log(repos)
          renderRepos(repos, state.user.profile)
        })
      }
    }, state.user.profile.login))

    orgs.forEach(function (org) {
      list.push(h('li.org.item', {
        onclick: function (e) {
          orgRepos(state.user, org.login, function (err, repos) {
            console.log(repos)
            renderRepos(repos, org)
          })
        }
      }, org.login))
    })

    editor.popup.open([
      h('h1', 'Open a file from GitHub'),
      h('h2', 'Choose an organization:'),
      h('ul.item-list', list)
    ])
  })

  function renderRepos (repos, owner) {
    var list = []
    repos.forEach(function (repo) {
      list.push(h('li.repo.item', {
        onclick: function (e) {
          console.log(repo.url, repo.default_branch)
          require('./lib/github-repo-files')(state.user, owner, repo, function (err, res) {
            renderFiles(res, repo, owner)
          })
        }
      }, repo.name))
    })

    editor.popup.open([
      h('h1', 'Open a file from GitHub'),
      h('h2', 'Choose a repository:'),
      h('ul.item-list', list)
    ])
  }

  function renderFiles (files, repo, owner) {
    var list = []

    files.tree.forEach(function (file) {
      list.push(h('li.file.item', {
        onclick: function (e) {
          require('./lib/github-get-blob')(state.user, owner, repo, file, function (err, data, properties, type) {
            if (err) return console.error(err)
            state.data = data
            state.properties = properties
            state.save.type = type
            state.save.source = 'github'
            state.save.location = file
            state.save.branch = repo.default_branch
            state.save.owner = owner.login
            state.save.repo = repo.name
            console.log(state.save)
            editor.popup.close()
            renderEditor()
          })
        }
      }, file.path))
    })

    editor.popup.open([
      h('h1', 'Open a file from GitHub'),
      h('h2', 'Choose a JSON or CSV file:'),
      h('ul.item-list', list)
    ])
  }

  renderEditor()
})

editor.save.addEventListener('click', function (e) {
  if (!state.save.type || !state.save.source || !state.save.location) {
    return console.error('need save information')
  }
  console.log(state.save)
  if (state.save.source === 'github') {
    if (state.save.type === 'csv') {
      editor.toCSV(function (err, data) {
        var message = ''
        editor.popup.open([
          h('h1', 'Save to GitHub repo'),
          h('h2', 'Add a commit message:'),
          h('input', {
            type: 'text',
            value: message,
            oninput: function (e) {
              message = e.target.value
            }
          }),
          h('button', {
            onclick: function (e) {
              e.preventDefault()
              require('./lib/github-save-blob')(state.user, state.save, data, message, function (err, body) {
                if (err) return console.log('the error', err)
                console.log('response from PUT', body)
                require('./lib/github-get-blob')(state.user, { login: state.save.owner }, { name: state.save.repo }, { path: body.content.path}, function (err, getbody) {

                })
                state.save.location.sha = body.content.sha
                state.save.location.url = body.content.git_url
                editor.popup.close()
              })
            }
          }, 'Save to GitHub')
        ])
      })
    }
  }
})

editor.list.addEventListener('load', function () {
  renderEditor()
})

editor.item.addEventListener('input', function (property, row, e) {
  renderEditor()
})

editor.newRowMenu.addEventListener('click', function (e) {
  newRow()
  renderEditor()
})

function newRow () {
  var row = {
    key: state.data.length + 1,
    value: {}
  }

  state.properties.forEach(function (key) {
    row.value[key] = null
  })

  editor.write(row)
}

editor.newColumnMenu.addEventListener('click', function (e) {
  editor.newColumn()
  if (!state.data.length) newRow()
  renderEditor()
  editor.checkListWidth()
})

editor.item.addEventListener('destroy-row', function (row, e) {
  if (window.confirm('wait. are you sure you want to destroy all the data in this row?')) {
    editor.destroyRow(row.key)
    renderEditor()
    editor.listActive()
  }
})

editor.headers.addEventListener('destroy-column', function (header, e) {
  if (window.confirm('wait. are you sure you want to destroy all the data in this column?')) {
    editor.destroyColumn(header)
    renderEditor()
    editor.checkListWidth()
  }
})

editor.headers.addEventListener('rename-column', function (header, e) {
  var newName = window.prompt('New name for the column')
  editor.renameColumn(header, newName)
  renderEditor()
})

editor.list.addEventListener('active', function (active) {
  setTimeout(function () {
    document.getElementById(active.itemPropertyId).focus()
  }, 0)
})
