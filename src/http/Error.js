const { getMessage } = require('./Messages')
const logger = require('../logger')

module.exports = {
  createError: function (status, errorMessage = null, cause = null) {
    const message = errorMessage ?? getMessage(status) ?? 'An error occurred'
    logger.default.error('HTTP ' + status + ': ' + message)
    if (cause) {
      logger.default.error(cause)
    }
    return {
      status,
      message
    }
  }
}
