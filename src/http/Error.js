const { getMessage } = require('./Messages')
const logger = require('../logger')

module.exports = {
  createError: function (status, errorMessage = null, cause = null) {
    const message = errorMessage ?? getMessage(status) ?? 'An error occurred'
    let logMessage = `Error is raised: ${errorMessage}`
    if (cause) {
      logMessage += `Cause: ${JSON.stringify(cause)}`
    }
    logger.default.error(logMessage)
    return {
      status,
      message
    }
  }
}
