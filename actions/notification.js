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

  return {
    set: set
  }
}
