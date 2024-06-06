const path = require('path')
const { createLogger, format, transports } = require('winston')

const { context, output } = require('./Format')
const { uniqueTimestamp } = require('./UniqueTimestamp')
const utils = require('./Utils')
const { useRid, getRid } = require('./RequestId')

// eslint-disable-next-line import/no-dynamic-require
const packageJson = require(path.join(process.cwd(), 'package.json'))
const labelValue = packageJson.name

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
    format: combine(label({ label: labelValue }), timestamp(), context(), output),
    ...options
  })
}

const defaultLogger = getLogger()

const uniqueTimestampLogger = getLogger({
  format: combine(label({ label: labelValue }), uniqueTimestamp(), context(), output),
})

module.exports = {
  getLogger,
  default: defaultLogger,
  uniqueTimestampLogger,
  labelValue,
  formatters: {
    context,
    output,
    uniqueTimestamp
  },
  useRid,
  getRid,
  utils
}
