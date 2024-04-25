const path = require('path')
const packageJson = require(path.join(process.cwd(), 'package.json'))

/**
 * Get basic health check result
 * @return {{app: {name, version}, date: Date, result: string}}
 */
function getHealthCheckResult() {
  return {
    app: {
      name: packageJson.name,
      version: packageJson.version
    },
    date: new Date(),
    result: 'success'
  }
}

/**
 * Check if given value is a Promise object
 * @param {*} value
 */
function isPromise(value) {
  return !!value && (typeof value === 'object' || typeof value === 'function') && typeof value.then === 'function';
}

/**
 * Health check controller
 * @param req
 * @param res
 */
function healthCheckController(req, res) {
  res.json(getHealthCheckResult())
}

/**
 * Apply health check controller to express app
 * @param {Object} app Express app object
 * @param {string} endpoint Health check endpoint
 * @param {function|null} callback
 */
function useHealthCheck(app, endpoint = '/', callback = null) {
  app.get(endpoint, async (req, res, next) => {
    let result = {}
    if (callback) {
      const callbackRawResult = callback(req, res, next)
      const callbackResult = isPromise(callbackRawResult) ? await callbackRawResult : callbackRawResult;
      if (callbackResult && typeof callbackResult === 'object') {
        result = callbackResult
      }
    }
    res.json({
      ...getHealthCheckResult(),
      ...result
    })
  })
}

module.exports = {
  controller: healthCheckController,
  useHealthCheck
}
