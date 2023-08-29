const { getMessage } = require('./Messages')
const Logger = require('../Logger')

module.exports = {
  createError: function (status, errorMessage = null, cause = null) {
    const message = errorMessage ?? getMessage(status) ?? 'An error occurred'
    Logger.getLogger().error('HTTP ' + status + ': ' + message)
    if (cause) {
      Logger.getLogger().error(cause)
    }
    return {
      status,
      message
    }
  }
}
