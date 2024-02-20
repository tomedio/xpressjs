const BasicContext = require('../Context')

const LOGGER_CONTEXT_KEY = 'loggerContext'

/**
 * Set the given object as a logs context
 * @param {Object} context New logs context object
 */
const setContext = (context) => {
  BasicContext.setContext(LOGGER_CONTEXT_KEY, context)
}

/**
 * Get logs context object if set
 * @returns {Object|null}
 */
const getContext = () => BasicContext.getContext(LOGGER_CONTEXT_KEY)

/**
 * Update current logs context with passed data
 * @param {Object} additionalData
 */
const updateContext = (additionalData) => BasicContext.updateContext(LOGGER_CONTEXT_KEY, additionalData)

module.exports = {
  updateContext,
  setContext,
  getContext
}
