var cookie = require('cookie-cutter')
var h = require('virtual-dom/h')

var createPopup = require('../elements/popup')
var openFile = require('./open-file')
var saveFile = require('./save-file')
var saveNewFile = require('./save-new-file')

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
    return openFile(source, state)
  }

  app.saveFile = function (state) {
    return saveFile(app, state)
  }

  app.editor.list.addEventListener('scroll', function () {
    var row = app.editor.getActiveRow()
    var html = app.editor.item.render(row.data, state)
    app.renderEditor([html], state)
  })

  app.editor.list.addEventListener('click', function (e, row) {
    var html = app.editor.item.render(row, state)
    app.renderEditor([html], state)
    app.editor.itemActive()
    app.editor.checkListWidth()
  })

  app.editor.list.addEventListener('load', function () {
    app.renderEditor([], state)
    app.editor.checkListWidth()
  })

  app.editor.item.addEventListener('input', function (property, row, e) {
    var html = app.editor.item.render(row, state)
    app.renderEditor([html], state)
    state.save()
  })

  app.editor.newRowMenu.addEventListener('click', function (e) {
    app.editor.newRow()
    app.renderEditor([], state)
  })

  app.editor.newColumnMenu.addEventListener('click', function (e) {
    var popup = createPopup()

    var name, type
    var el = popup.open([
      h('h1', 'Create new column'),
      h('h2', 'Set the column name & type'),
      h('div', [
        h('input.small', {
          type: 'text',
          oninput: function (e) {
            name = e.target.value
          }
        })
      ]),
      h('div', [
        h('select.small', [
          h('option', 'string'),
          h('option', 'number')
        ])
      ]),
      h('div', [
        h('button.button-blue', {
          onclick: function () {
            app.editor.newColumn({
              name: name,
              type: type
            })
            if (!state.data.length) app.editor.newRow()
            state.save()
            app.renderEditor([], state)
            app.editor.checkListWidth()
          }
        }, 'Create column')
      ])
    ])

    popup.addEventListener('close', function () {
      app.renderEditor([], state)
    })

    app.renderEditor([el], state)
  })

  app.editor.item.addEventListener('destroy-row', function (row, e) {
    if (window.confirm('wait. are you sure you want to destroy all the data in this row?')) {
      app.editor.destroyRow(row.key)
      app.renderEditor([], state)
      app.editor.listActive()
      state.save()
    }
  })

  app.editor.headers.addEventListener('render', function (el, property) {
    app.renderEditor([el], state)
  })

  app.editor.headers.addEventListener('close', function (el, property) {
    app.renderEditor([], state)
  })

  app.editor.headers.addEventListener('destroy-column', function (property, e) {
    app.editor.destroyColumn(property.key)
    app.renderEditor([], state)
    app.editor.checkListWidth()
    state.save()
  })

  app.editor.headers.addEventListener('rename-column', function (property, newName, e) {
    app.editor.renameColumn(property, newName)
    state.save()
    app.renderEditor([], state)
  })

  app.editor.list.addEventListener('active', function (active) {
    setTimeout(function () {
      document.getElementById(active.itemPropertyId).focus()
    }, 0)
  })

  app.editor.item.addEventListener('focus', function (e) {

  })

  app.editor.openDropdown.addEventListener('click', function (e) {
    app.renderEditor([], state)
  })

  app.editor.export.addEventListener('click', function (e) {
    var popup = saveNewFile(app, state)
    
    popup.addEventListener('close', function () {
      app.renderEditor([], state)
    })
  })

  function opener (source) {
    var popup = app.openFile(source, state)

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
      state.saveData.source = source
      state.activeDataset = true
      state.save()
      app.renderEditor([], state)
    })
  }

  app.editor.openGithub.addEventListener('click', function (e) {
    opener('github')
  })

  app.editor.openEmpty.addEventListener('click', function (e) {
    state.resetDataset()
    app.renderEditor([], state)
  })

  app.editor.openUpload.addEventListener('click', function (e) {
    opener('upload')
  })

  app.editor.item.addEventListener('close', function (e) {
    app.editor.listActive()
  })

  app.editor.save.addEventListener('click', function (e) {
    var popup = app.saveFile(state)

    popup.addEventListener('close', function () {
      app.renderEditor([], state)
    })

    popup.addEventListener('render', function (el) {
      app.renderEditor([el], state)
    })
  })

  return app
}
