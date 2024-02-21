const { getMessage } = require('./Messages')
const logger = require('../logger')

module.exports = {
  createError: function (status, errorMessage = null, cause = null) {
    const message = errorMessage ?? getMessage(status) ?? 'An error occurred'
    if (cause) {
      logger.default.error(cause)
    }
    return {
      status,
      message
    }
  }
}
