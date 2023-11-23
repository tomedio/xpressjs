const path = require('path')
const packageJson = require(path.join(process.cwd(), 'package.json'))

function getHealthCheckResult() {
    return {
        app: {
            name: packageJson.name,
            version: packageJson.version,
        },
        date: new Date(),
        result: 'success'
    }
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
 * @param {function|null}callback
 */
function useHealthCheck(app, callback = null) {
    app.get('/', (req, res, next) => {
        let result = {}
        if (callback) {
            const callbackResult = callback(req, res, next)
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
