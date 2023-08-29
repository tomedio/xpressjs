const { createError } = require('./http/Error')
const { getMessage } = require('./http/Messages')

module.exports = {
  handle: function (serverErrorMessage = getMessage(500)) {
    return (err, req, res, next) => {
      let error
      if (err.status && err.message) {
        error = err
      } else {
        error = createError(500, serverErrorMessage, err)
      }
      res.status(error.status).json(error)
      next()
    }
  }
}
