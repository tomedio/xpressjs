const httpContext = require('express-http-context')

let contextInitialized = false

/**
 * Verify if context is initialized
 * @returns {boolean}
 */
const isInitialized = () => contextInitialized;

/**
 * Verify if context has been initialized
 */
const verifyInitialization = () => {
  if (!isInitialized()) {
    throw new Error('Context is used but not initialized')
  }
}

/**
 * Set the given object as a context
 * @param {string} key Key used to identify context data
 * @param {Object} context New logs context object
 */
const setContext = (key, context) => {
  verifyInitialization()
  httpContext.set(key, context)
}

/**
 * Get context object if set
 * @param {string} key Key used to identify context data
 * @returns {Object|null}
 */
const getContext = (key) => {
  verifyInitialization()
  return httpContext.get(key) || null
}

/**
 * Initialize Express context
 * @param {Object} app Express app instance
 */
const useContext = (app) => {
  if (!contextInitialized) {
    app.use(httpContext.middleware)
    contextInitialized = true
  }
}

/**
 * Update current context under the given key with passed data
 * @param {string} key
 * @param {Object} additionalData
 */
const updateContext = (key, additionalData) => {
  const currentContext = getContext(key) ?? {}
  const newContext = { ...currentContext, ...additionalData }
  setContext(key, newContext)
}

module.exports = {
  isInitialized,
  useContext,
  setContext,
  updateContext,
  getContext
}
