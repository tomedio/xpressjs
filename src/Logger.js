const Logger = (function () {
  const logger = {}

  return {
    getLogger: function (loggerId = 0) {
      if (logger[loggerId] === undefined) {
        return console
      }
      return logger[loggerId]
    },

    configureLogger: function (configureFn, loggerId = 0) {
      logger[loggerId] = configureFn()
    }
  }
})()

module.exports = Logger
