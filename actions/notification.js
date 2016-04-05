var constants = require('../constants')

module.exports = function NotificationActionCreators (store, commonActions) {
  /**
   * Set the current notification
   * @param {String} level
   * @param {String} message
   */
  function set (level, message) {
    return store({
      type: constants.SET_NOTIFICATION,
      level: level,
      message: message
    })
  }

  function unset () {
    return store({
      type: constants.UNSET_NOTIFICATION
    })
  }

  return {
    set: set,
    unset: unset
  }
}
