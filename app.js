var GitHub = require('github-api')
var cookie = require('cookie-cutter')
var profile = require('./lib/get-profile')
var router = require('./lib/router')
var state = require('./lib/state')
var editor = require('./lib/editor')()
var github

var content = require('./elements/content')()
var header = require('./elements/header')()
var auth = require('./elements/github-auth')()

auth.addEventListener('sign-out', function () {
  cookie.set('editdata', '', { expires: new Date(0) })
  state.user = null
  window.location = window.location.origin
})

router.on('/', function (params) {
  content.render([
    header.render([
      auth.render(state)
    ], state),
    auth.render(state)
  ])
})

router.on('/edit', function (params) {
  renderEditor()
  editor.listActive()
})

function renderEditor (options) {
  content.render([
    header.render([
      auth.render(state)
    ], state),
    editor.render(options)
  ])
}

if (state.url.query.code) {
  auth.verify(state.url.query.code, function (err, user) {
    if (err) console.log(err)
    state.user = user
    cookie.set('editdata', user.token)
    github = new GitHub({
      token: user.token,
      auth: 'oauth'
    })
    router.start()
    window.location = window.location.origin + '/#/edit'
  })
} else if (state.user && state.user.token) {
  profile(state.user.token, function (err, profile) {
    if (err) console.log(err)
    state.user.profile = profile
    router.start()
    window.location = window.location.origin + '/#/edit'
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
  renderEditor({ data: editor.data })
})

editor.item.addEventListener('input', function (property, row, e) {
  renderEditor({ row: row })
})

editor.actions.addEventListener('new-row', function (e) {
  var row = {
    key: editor.data.length + 1,
    value: {}
  }

  editor.properties.forEach(function (key) {
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

editor.actions.addEventListener('destroy', function (e) {
  if (window.confirm('wait. are you sure you want to destroy all this data?')) {
    editor.destroy()
    renderEditor()
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

