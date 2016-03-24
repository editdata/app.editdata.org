var constants = require('../constants')

module.exports = function EditorActionCreators (store, commonActions) {
  var setRoute = commonActions.setRoute
  var modal = commonActions.modal

  /**
   * Add a row to the sheet
   * @param  {Store} store App store
   * @return {Function}
   */
  function newRow () {
    return store({
      type: constants.NEW_ROW
    })
  }

  /**
   * Destroy row with `key`
   * @param  {String} key   Row key
   * @param  {Store} store
   * @return {Function}
   */
  function destroyRow (key) {
    return store({
      type: constants.DESTROY_ROW,
      key: key
    })
  }

  /**
   * Add a column to the sheet
   * @param  {String} name
   * @param  {String} type
   * @param  {Store} store
   * @return {Function}
   */
  function newColumn (name, type) {
    return store({
      type: constants.NEW_COLUMN,
      property: { name: name, type: type }
    })
  }

  /**
   * Destroy column with `key`
   * @param  {String} key   Column key
   * @param  {Store} store
   * @return {Function}
   */
  function destroyColumn (key) {
    return store({
      type: constants.DESTROY_COLUMN,
      key: key
    })
  }

  /**
   * Rename column with `key` to `newName`
   * @param  {String} key     Column key
   * @param  {String} newName
   * @param  {Store} store
   * @return {Function}
   */
  function renameColumn (key, newName) {
    return store({
      type: constants.RENAME_COLUMN,
      key: key,
      newName: newName
    })
  }

  /**
   * Update a cell's contents
   * @param  {Object} property
   * @param  {Object} row
   * @return {Function}
   */
  function updateCellContent (propertyKey, rowKey, value) {
    return store({
      type: constants.UPDATE_CELL_CONTENT,
      propertyKey: propertyKey,
      value: value,
      rowKey: rowKey
    })
  }

  /**
   * Destroy the current sheet (wipe state.properties and state.data)
   * @param  {Store} store
   * @return {Function}       [description]
   */
  function destroy () {
    return store({
      type: constants.DESTROY
    })
  }

  /**
   * Set the active row
   * @param {Object} active Active Row object
   * @param {Function} store
   * @return {Function}
   */
  function setActiveRow (active) {
    return store({
      type: constants.SET_ACTIVE_ROW,
      activeRow: active
    })
  }

  /**
   * Set the property currently being edited
   * @param {String} propertyKey
   * @param {Store} store
   * @return {Function}
   */
  function setActiveProperty (propertyKey) {
    return store({
      type: constants.SET_ACTIVE_PROPERTY,
      propertyKey: propertyKey
    })
  }

  /**
   * Load uploaded file
   * @param  {Array} data
   * @param  {Object} properties
   * @param  {Object} save
   * @param  {Store} store
   * @return {Function}
   */
  function selectUploadedFile (data, properties, save) {
    setRoute('/edit')
    return store({
      type: constants.SELECTED_FILE,
      data: data,
      properties: properties,
      save: save
    })
  }

  /**
   * Trigger Open New File process
   * @param  {String} slug  File source
   * @param  {Store} store
   * @return {Function}
   */
  function openNew (slug) {
    if (slug === 'empty') {
      destroy()
      return setRoute('/edit/new')
    }
    if (slug === 'github') return modal('openNewGithub', true, store)
    if (slug === 'upload') return modal('openNewUpload', true, store)
  }

  /**
   * Display `err` when opening file
   * @param  {Error} err
   * @param  {Store} store
   * @return {Function}
   */
  function openNewError (err) {
    return store({
      type: constants.OPEN_NEW_ERROR,
      err: err
    })
  }

  function propertyType (propertyKey, propertyType) {
    store({
      type: constants.PROPERTY_TYPE,
      propertyKey: propertyKey,
      propertyType: propertyType
    })
  }

  return {
    newRow: newRow,
    newColumn: newColumn,
    destroyRow: destroyRow,
    destroyColumn: destroyColumn,
    renameColumn: renameColumn,
    propertyType: propertyType,
    openNewError: openNewError,
    openNew: openNew,
    setActiveProperty: setActiveProperty,
    setActiveRow: setActiveRow,
    selectUploadedFile: selectUploadedFile,
    updateCellContent: updateCellContent
  }
}
