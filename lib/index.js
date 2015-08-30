var cookie = require('cookie-cutter')
var h = require('virtual-dom/h')

var createPopup = require('../elements/popup')
var openFile = require('./open-file')

module.exports = function (el, state) {
  var app = {
    el: document.getElementById(el),
    state: state
  }

  var container = require('../elements/container')(app.el)
  var header = require('../elements/header')()
  var content = require('../elements/content')()
  var auth = require('../elements/github-auth')()
  app.editor = require('./editor')(state)

  auth.addEventListener('sign-out', function () {
    cookie.set('editdata', '', { expires: new Date(0) })
    state.reset()
    window.location = window.location.origin
  })

  app.render = function render (elements, state) {
    app.state = state
    elements = [
      header.render([auth.render(state)], state)
    ].concat(elements)
    container.render(elements)
  }

  app.renderContent = function renderContent (elements, state) {
    var html = content.render(elements)
    app.render([html], state)
  }

  app.renderEditor = function renderEditor (elements, state) {
    var html = app.editor.render(elements, state)
    app.render([html], state)
  }

  app.auth = function (state, callback) {
    auth.verify(state.url.query.code, callback)
  }

  app.openFile = function (source, state) {
    return openFile(this, source, state)
  }

  app.editor.list.addEventListener('click', function (e, row) {
    var html = app.editor.item.render(row)
    app.renderEditor([html], state)
    app.editor.itemActive()
  })

  app.editor.list.addEventListener('load', function () {
    app.renderEditor([], state)
    app.editor.checkListWidth()
  })

  app.editor.item.addEventListener('input', function (property, row, e) {
    var html = app.editor.item.render(row)
    app.renderEditor([html], state)
    state.save()
  })

  app.editor.newRowMenu.addEventListener('click', function (e) {
    app.editor.newRow()
    app.renderEditor([], state)
  })

  app.editor.newColumnMenu.addEventListener('click', function (e) {
    app.editor.newColumn()
    if (!state.data.length) app.editor.newRow()
    app.renderEditor([], state)
    app.editor.checkListWidth()
    state.save()
  })

  app.editor.item.addEventListener('destroy-row', function (row, e) {
    if (window.confirm('wait. are you sure you want to destroy all the data in this row?')) {
      app.editor.destroyRow(row.key)
      app.renderEditor([], state)
      app.editor.listActive()
      state.save()
    }
  })

  app.editor.headers.addEventListener('destroy-column', function (header, e) {
    if (window.confirm('wait. are you sure you want to destroy all the data in this column?')) {
      app.editor.destroyColumn(header)
      app.renderEditor([], state)
      app.editor.checkListWidth()
      state.save()
    }
  })

  app.editor.headers.addEventListener('rename-column', function (header, e) {
    var newName = window.prompt('New name for the column')
    app.editor.renameColumn(header, newName)
    app.renderEditor([], state)
    state.save()
  })

  app.editor.list.addEventListener('active', function (active) {
    setTimeout(function () {
      document.getElementById(active.itemPropertyId).focus()
    }, 0)
  })

  app.editor.openDropdown.addEventListener('click', function (e) {
    app.renderEditor([], state)
  })

  app.editor.openGithub.addEventListener('click', function (e) {
    var popup = app.openFile('github', state)

    popup.addEventListener('render', function (popupEl) {
      app.renderEditor([popupEl], state)
    })

    popup.addEventListener('close', function () {
      app.renderEditor([], state)
    })

    popup.addEventListener('done', function (data, properties, save) {
      state.data = data
      state.properties = properties
      state.saveData = save
      state.saveData.source = 'github'
      state.activeDataset = true
      state.save()
      app.renderEditor([], state)
    })
  })

  app.editor.openEmpty.addEventListener('click', function (e) {
    console.log('todo: start new dataset')
  })

  app.editor.openCSV.addEventListener('click', function (e) {
    console.log('todo: start new dataset')
  })

  app.editor.openJSON.addEventListener('click', function (e) {
    console.log('todo: openJSON')
  })

  app.editor.item.addEventListener('close', function (e) {
    app.editor.listActive()
  })

  

  app.editor.save.addEventListener('click', function (e) {
    if (!state.saveData.type || !state.saveData.source || !state.saveData.location) {
      return console.error('need save information')
    }

    var popup = createPopup(function () {
      app.renderEditor([], state)
    })

    function save (data) {
      var message = ''
      var html = popup.open([
        h('h1', 'Update ' + state.saveData.location.path + ' in GitHub repository'),
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
            require('./github-update-blob')(state.user, state.saveData, data, message, function (err, body) {
              if (err) return console.error(err)
              state.saveData.location.sha = body.content.sha
              state.saveData.location.url = body.content.git_url
              app.renderEditor([], state)
            })
          }
        }, 'Save to GitHub'),
        h('p.help', 'File ' + state.saveData.location.path + ' will be updated in ' + state.saveData.owner + '/' + state.saveData.repo),
        h('div.alternate', [
          h('h1', 'Alternate save options'),
          h('h2', 'Choose an alternative, or see the Export menu'),
          h('ul.item-list', [
            h('li.item', {
              onclick: function (e) {
                require('./github-create-blob')({
                  owner: state.saveData.owner,
                  repo: state.saveData.repo,
                  token: state.user.token,
                  path: 'test.json',
                  message: 'Create test.json',
                  content: app.editor.toJSON(),
                  branch: state.saveData.branch
                }, function (err, res) {
                  app.renderEditor([], state)
                })
              }
            }, 'Save new JSON file')
          ])
        ])
      ])
      app.renderEditor([html], state)
    }

    if (state.saveData.source === 'github') {
      if (state.saveData.type === 'csv') {
        app.editor.toCSV(function (err, data) {
          if (err) console.error(err)
          save(data)
        })
      } else if (state.saveData.type === 'json') {
        save(app.editor.toJSON())
      }
    }
  })

  return app
}
