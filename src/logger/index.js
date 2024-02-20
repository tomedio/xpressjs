const path = require('path')
const { createLogger, format, transports } = require('winston')

const { context, output } = require('./Format')
const utils = require('./Utils')
const { useRid } = require('./RequestId')

// eslint-disable-next-line import/no-dynamic-require
const packageJson = require(path.join(process.cwd(), 'package.json'))

const { combine, timestamp, label } = format
/**
 * Logger instance used for logging all logs
 */
function getLogger(options = {}) {
  return createLogger({
    level: process.env.LOGGING_LEVEL || 'debug',
    transports: [
      new transports.Console({
        handleExceptions: true
      })
    ],
    format: combine(label({ label: packageJson.name }), timestamp(), context(), output),
    ...options
  })
}

const defaultLogger = getLogger()

module.exports = {
  getLogger,
  default: defaultLogger,
  formatters: {
    context,
    output
  },
  useRid,
  utils
}
