const { createError } = require('./http/Error')
const { getMessage } = require('./http/Messages')

module.exports = function (errorMessage = getMessage(404)) {
  return (req, res, next) => {
    next(createError(404, errorMessage, { method: req.method, url: req.url }))
  }
}
