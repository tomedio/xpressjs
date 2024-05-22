const swaggerUi = require('swagger-ui-express')
const swaggerAutogenLibrary = require('swagger-autogen')

const defaultDefinition = require('./defaultDefinition.js')
const { deepMerge } = require('../utils')
const models = {
  ...require('./models/Healthcheck.schema.js'),
  ...require('./models/ErrorResponse.schema.js'),
  ...require('./models/SuccessResponse.schema.js')
}

/**
 * Get the handler for Swagger
 * @param {Object} swaggerDefinition Basic definition of the Swagger
 * @param {string[]} endpointsFiles Array of patches to endpoints files
 * @param {Object} swaggerOptions Options for Swagger
 * @return {Promise<(function(*, *): void)|*>}
 */
async function getHandler(swaggerDefinition, endpointsFiles, swaggerOptions) {
  const swaggerAutogen = swaggerAutogenLibrary({
    writeOutputFile: false,
    openapi: '3.0.0'
  })
  const result = await swaggerAutogen('./swagger-output.json', endpointsFiles, swaggerDefinition)
  if (result.success) {
    return swaggerUi.setup(result.data, swaggerOptions)
  } else {
    throw new Error('Swagger can not be generated right now. Check definitions and try again.')
  }
}

/**
 * Generate Swagger file
 * @param {string} outputPath - Path to the output Swagger file
 * @param {Object} swaggerDefinition - Basic definition of the Swagger
 * @param {string[]} endpointsFiles - Array of patches to endpoints files
 * @return {Promise<false | {success: boolean, data: any}>}
 */
function generate(outputPath, swaggerDefinition, endpointsFiles) {
  const swaggerAutogen = swaggerAutogenLibrary({
    openapi: '3.0.0'
  })
  return swaggerAutogen(outputPath, endpointsFiles, swaggerDefinition).then((result) => {
    if (result.success) {
      return result
    } else {
      throw new Error('Swagger can not be generated right now. Check definitions and try again.')
    }
  })
}

/**
 * Use Swagger in the application
 * @param {Object} app - Express application
 * @param {Object} swaggerDefinition - Basic definition of the Swagger
 * @param {string[]} endpointsFiles - Array of patches to endpoints files
 * @param {Object} swaggerOptions - Options for Swagger
 * @param {string} endpoint - Optional endpoint for Swagger, "/docs" by default
 */
function useSwagger(app, swaggerDefinition, endpointsFiles, swaggerOptions = {}, endpoint = '/docs') {
  return getHandler(deepMerge(defaultDefinition, swaggerDefinition), endpointsFiles, swaggerOptions).then((handler) =>
    app.use(endpoint, getMiddleware(), handler)
  )
}

/**
 * Return middleware needed for Swagger to work
 * @returns {function[]}
 */
function getMiddleware() {
  return swaggerUi.serve
}

module.exports = {
  useSwagger,
  generate,
  models
}