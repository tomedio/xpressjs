const { createError } = require('./http/Error')
const { getMessage } = require('./http/Messages')
const logger = require('./logger')

module.exports = {
  handle: function (serverErrorMessage = getMessage(500)) {
    return (err, req, res, next) => {
      let error
      if (err.status && err.message) {
        error = err
      } else {
        error = createError(500, serverErrorMessage, err)
      }
      logger.default.error('HTTP ' + error.status + ': ' + error.message)
      res.status(error.status).json(error)
      next()
    }
  }
}
