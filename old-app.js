var cookie = require('cookie-cutter')
var h = require('virtual-dom/h')

var orgs = require('./lib/github-organizations')
var orgRepos = require('./lib/github-org-repos')
var repos = require('./lib/github-user-repos')
var profile = require('./lib/github-user-profile')
var router = require('./lib/router')
var state = require('./lib/state')
var editor = require('./lib/editor')(state)

var content = require('./elements/content')()
var header = require('./elements/header')(document.querySelector('header'))
var auth = require('./elements/github-auth')()
var landing = require('./elements/landing')()
var getStarted = require('./elements/get-started')()

auth.addEventListener('sign-out', function () {
  cookie.set('editdata', '', { expires: new Date(0) })
  state.user = null
  state.data = []
  state.properties = []
  window.location = window.location.origin
})

router.on('/', function (params) {
  if (state.user && state.gist) window.location.hash = '/edit/' + state.gist.id
  else if (state.user && !state.gist) window.location.hash = '/edit'
  else renderContent([landing.render(state)])
})

router.on('/about', function (params) {
  var about = require('./elements/about')()
  var html = about.render(state)
  renderContent([html])
})

router.on('/docs', function (params) {
  var docs = require('./elements/docs')()
  var html = docs.render(state)
  renderContent([html])
})

router.on('/edit', function (params) {
  if (!state.user) window.location.hash = '/'
  var html = getStarted.render(state)
  renderContent([html])
})

router.on('/edit/new', function (params) {
  if (!state.user) window.location.hash = '/'
  state.data = []
  state.properties = []
  renderEditor()
})

getStarted.addEventListener('click', function (source) {
  if (source === 'empty') {
    window.location.hash = '/edit/new'
  } else if (source === 'github') {
    openGithubFile()
  } else if (source === 'dat') {
    openDat()
  } else if (source === 'csv') {

  } else if (source === 'json') {

  }
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
    router.start()
    if (!state.gist) window.location = window.location.origin + '/#/edit'
  })
} else if (state.user && state.user.token) {
  profile(state.user.token, function (err, profile) {
    if (err) console.error(err)
    state.user.profile = profile
    router.start()
  })
} else {
  router.start()
}

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
  openGithubFile()
})

editor.save.addEventListener('click', function (e) {
  if (!state.save.type || !state.save.source || !state.save.location) {
    return console.error('need save information')
  }

  if (state.save.source === 'github') {
    if (state.save.type === 'csv') {
      editor.toCSV(function (err, data) {
        if (err) console.error(err)
        var message = ''
        editor.popup.open([
          h('h1', 'Update ' + state.save.location.path + ' in GitHub repository'),
          h('h2', 'Add a commit message:'),
          h('input.text-input', {
            type: 'text',
            value: message,
            oninput: function (e) {
              message = e.target.value
            }
          }),
          h('button.button-blue', {
            onclick: function (e) {
              e.preventDefault()
              require('./lib/github-update-blob')(state.user, state.save, data, message, function (err, body) {
                if (err) return console.error(err)
                state.save.location.sha = body.content.sha
                state.save.location.url = body.content.git_url
                editor.popup.close()
              })
            }
          }, 'Save to GitHub'),
          h('p.help', 'File ' + state.save.location.path + ' will be updated in ' + state.save.owner + '/' + state.save.repo),
          h('div.alternate', [
            h('h1', 'Alternate save options'),
            h('h2', 'Choose an alternative, or see the Export menu'),
            h('ul.item-list', [
              h('li.item', {
                onclick: function (e) {
                  require('./lib/github-create-blob')({
                    owner: state.save.owner,
                    repo: state.save.repo,
                    token: state.user.token,
                    path: 'test.json',
                    message: 'Create test.json',
                    content: editor.toJSON(),
                    branch: state.save.branch
                  }, function (err, res) {
                    console.log(err, res)
                    editor.popup.close()
                  })
                }
              }, 'Save new JSON file')
            ])
          ])
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
  editor.newRow()
  renderEditor()
})

editor.newColumnMenu.addEventListener('click', function (e) {
  editor.newColumn()
  if (!state.data.length) editor.newRow()
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



var url = require('url')
var qs = require('querystring')
state.url = url.parse(window.location.href)
state.url.query = qs.parse(state.url.query)

function openDat () {
  
}