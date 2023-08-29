// eslint-disable-next-line no-unused-vars
const { ZodType } = require('zod')
const { createError } = require('./http/Error')

/**
 * Validate if input data is correctly described by expected schema and return invalid fields
 * @param {ZodType} expectedSchema Expected schema of input object
 * @param {Object} inputData Object with input data to be validated
 * @returns {string[]}
 */
function getInvalidFields(expectedSchema, inputData) {
  const validationResult = expectedSchema.safeParse(inputData)
  let wrongFieldsList = []
  if (!validationResult.success) {
    wrongFieldsList = validationResult.error.issues.map((singleError) => singleError.path.join('.')).join(', ')
    throw new Error(wrongFieldsList)
  }
  return wrongFieldsList
}

module.exports = {
  /**
   * Create an ExpressJS middleware to validate request query
   * @param {ZodType} expectedQuery Expected schema of request query
   * @param {function|null} errorHandler Function to be executed with a list of invalid fields if any are found
   * @returns {function}
   */
  validateQuery: function (expectedQuery, errorHandler = null) {
    return (req, res, next) => {
      const invalidFields = getInvalidFields(expectedQuery, req.query)
      if (invalidFields.length) {
        if (errorHandler) {
          return errorHandler(invalidFields, req, res, next)
        } else {
          next(createError(400, `Query parameters: ${invalidFields} are invalid`))
        }
      }
    }
  },

  /**
   * Create an ExpressJS middleware to validate request body
   * @param {ZodType} expectedQuery Expected schema of request body
   * @param {function|null} errorHandler Function to be executed with a list of invalid values if any are found
   * @returns {function}
   */
  validateBody: function (expectedQuery, errorHandler = null) {
    return (req, res, next) => {
      const invalidFields = getInvalidFields(expectedQuery, req.body)
      if (invalidFields.length) {
        if (errorHandler) {
          return errorHandler(invalidFields, req, res, next)
        } else {
          next(createError(400, `Body fields: ${invalidFields} are invalid`))
        }
      }
    }
  }
}
