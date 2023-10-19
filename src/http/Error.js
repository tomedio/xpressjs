const { getMessage } = require('./Messages')
const {logger} = require('../Logger')

module.exports = {
  createError: function (status, errorMessage = null, cause = null) {
    const message = errorMessage ?? getMessage(status) ?? 'An error occurred'
    logger.error('HTTP ' + status + ': ' + message)
    if (cause) {
      logger.error(cause)
    }
    return {
      status,
      message
    }
  }
}
