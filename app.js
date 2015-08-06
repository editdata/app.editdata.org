var GitHub = require('github-api')
var cookie = require('cookie-cutter')
var profile = require('./lib/get-profile')
var router = require('./lib/router')
var state = require('./lib/state')
var editor = require('./lib/editor')(state)
var github

var content = require('./elements/content')()
var header = require('./elements/header')()
var auth = require('./elements/github-auth')()
var landing = require('./elements/landing')()

auth.addEventListener('sign-out', function () {
  cookie.set('editdata', '', { expires: new Date(0) })
  state.user = null
  window.location = window.location.origin
})

//   this.store.set('state', JSON.stringify({ data: data, properties: properties }))

router.on('/', function (params) {
  if (state.user) window.location.hash = '/edit'
  else renderLanding()
})

router.on('/edit', function (params) {
  if (state.gist) {
    window.location.hash = '/edit/' + state.gist
  } else {
    renderEditor()
    editor.listActive()
  }
})

router.on('/edit/:gist', function (params) {
  var gist = github.getGist(params.gist)
  gist.read(function (err, data) {
    if (err) console.error(err)
    state.gist = data
    state.data = JSON.parse(data.files['data.json'].content)
    state.properties = JSON.parse(data.files['metadata.json'].content).properties
    console.log('wwhuwhywyhwyhwhywyhw', state)
    renderEditor({ data: state.data })
    editor.listActive()
  })
})

function renderLanding (options) {
  content.render([
    header.render([
      auth.render(state)
    ], state),
    auth.render(state),
    landing.render()
  ])
}

function renderEditor (options) {
  content.render([
    header.render([
      auth.render(state)
    ], state),
    editor.render(options)
  ])
}

window.renderEditor = renderEditor

if (state.url.query.code) {
  auth.verify(state.url.query.code, function (err, user) {
    if (err) console.log(err)
    state.user = user
    console.log(state)
    cookie.set('editdata', user.token)
    github = new GitHub({
      token: user.token,
      auth: 'oauth'
    })
    router.start()
    if (!state.gist) window.location = window.location.origin + '/#/edit'
  })
} else if (state.user && state.user.token) {
  github = new GitHub({
    token: state.user.token,
    auth: 'oauth'
  })
  profile(state.user.token, function (err, profile) {
    if (err) console.log(err)
    state.user.profile = profile
    router.start()
  })
} else {
  router.start()
}

editor.list.addEventListener('click', function (e, row) {
  editor.itemActive()
  renderEditor({ row: row })
})

editor.item.addEventListener('close', function (e) {
  editor.listActive()
})

editor.filter.addEventListener('filter', function (results, length) {
  renderEditor({ data: results })
})

editor.filter.addEventListener('reset', function (results, length) {
  renderEditor()
})

editor.list.addEventListener('load', function () {
  renderEditor({ data: state.data })
})

editor.item.addEventListener('input', function (property, row, e) {
  renderEditor({ row: row })
})

editor.actions.addEventListener('save-gist', function (e) {
  if (state.gist) updateGist()
  else createGist()
})

function updateGist (callback) {
  var gist = github.getGist(state.gist.id)
  editor.toCSV(function (err, csv) {
    if (err) console.error(err)
    gist.update({
      files: {
        'data.json': {
          content: editor.toJSON()
        },
        'data.csv': {
          content: csv
        },
        'metadata.json': {
          content: JSON.stringify({ properties: state.properties })
        }
      }
    }, function (err, res) {
      if (err) console.error(err)
      if (callback) callback()
    })
  })
}

function createGist () {
  var gist = github.getGist()
  editor.toCSV(function (err, csv) {
    if (err) console.error(err)
    gist.create({
      description: 'data! from editdata.org!',
      public: true,
      files: {
        'data.json': {
          content: editor.toJSON()
        },
        'data.csv': {
          content: csv
        },
        'metadata.json': {
          content: JSON.stringify({ properties: state.properties })
        },
        'readme.md': {
          content: 'This gist was created using [editdata.org](http://editdata.org)'
        }
      }
    }, function (err, res) {
      if (err) console.error(err)
      window.location.hash = '/edit/' + res.id
    })
  })
}

editor.actions.addEventListener('new-row', function (e) {
  var row = {
    key: state.data.length + 1,
    value: {}
  }

  state.properties.forEach(function (key) {
    row.value[key] = null
  })

  editor.write(row)
  renderEditor()
})

editor.actions.addEventListener('new-column', function (e) {
  editor.newColumn()
  renderEditor()
  editor.checkListWidth()
})

editor.actions.addEventListener('new-dataset', function (e) {
  if (window.confirm('are you sure you want to start a new dataset? your current work will be saved to your gist.')) {
    updateGist(function () {
      window.location.hash = '/edit'
    })
  }
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

