const { format } = require('winston')
const { getContext } = require('./Context')
const { getRid } = require('./RequestId')
const { cleanLog } = require('./Utils')

const context = format((info) => {
  info.context = getContext()
  return info
})

/**
 * Creates the output format used for logs
 */
const output = format.printf(({ level, message, timestamp, label, context, ...metadata }) => {
  let header = `[${timestamp}][${label}][${level}]`
  let requestIdentifier = getRid()
  const { requestId, ...restContext } = context ?? {}
  requestIdentifier = requestId ?? requestIdentifier
  if (requestIdentifier) {
    header += `[rid:${requestIdentifier}]`
  }
  let msg = `${header}: ${message}`
  const allMetadata = { ...restContext, ...metadata }
  if (Object.keys(allMetadata).length) {
    msg += ` ${JSON.stringify(allMetadata)}`
  }
  return cleanLog(msg)
})

module.exports = {
  context,
  output
}
