const swaggerUi = require('swagger-ui-express')
const swaggerAutogenLibrary = require('swagger-autogen')
const fs = require('fs').promises

const defaultDefinition = require('./defaultDefinition.js')
const EndpointsRegistry = require('./EndpointsRegistry.js')
const { deepMerge } = require('../utils')

const models = {
  ...require('./models/Healthcheck.schema.js'),
  ...require('./models/ErrorResponse.schema.js'),
  ...require('./models/SuccessResponse.schema.js')
}

const paths = {
  ...require('./paths/Healthcheck.schema.js'),
  ...require('./paths/Docs.schema.js')
}

const swaggerAutogen = swaggerAutogenLibrary({
  openapi: '3.0.0',
  writeOutputFile: false
})

function addInternalEndpoints(swaggerDefinition) {
  let fullDefinition = swaggerDefinition
  const healthCheckEndpoint = EndpointsRegistry.getHealthcheck()
  if (healthCheckEndpoint) {
    fullDefinition = deepMerge(fullDefinition, {
      paths: {
        [healthCheckEndpoint]: paths.Healthcheck
      }
    })
  }
  const docsEndpoint = EndpointsRegistry.getDocs()
  if (docsEndpoint) {
    fullDefinition = deepMerge(fullDefinition, {
      paths: {
        [docsEndpoint]: paths.Docs
      }
    })
  }
  return fullDefinition
}

/**
 * @typedef {Object} AdditionalEndpoints
 * @property {string} healthcheck - Path to healthcheck endpoint
 * @property {string} docs - Path to docs endpoint
 */

/**
 * Generate Swagger file
 * @param {string} outputPath - Path to the output Swagger file
 * @param {Object} swaggerDefinition - Basic definition of the Swagger
 * @param {string[]} endpointsFiles - Array of patches to endpoints files
 * @param {AdditionalEndpoints} additionalEndpointPaths - Additional endpoints
 * @return {Promise<false | {success: boolean, data: any}>}
 */
function generate(outputPath, swaggerDefinition, endpointsFiles, additionalEndpointPaths = {}) {
  if (additionalEndpointPaths.healthcheck) {
    EndpointsRegistry.setHealthcheck(additionalEndpointPaths.healthcheck)
  }
  if (additionalEndpointPaths.docs) {
    EndpointsRegistry.setDocs(additionalEndpointPaths.docs)
  }
  return swaggerAutogen(outputPath, endpointsFiles, deepMerge(defaultDefinition, swaggerDefinition)).then((result) => {
    if (result.success) {
      const fullSwagger = addInternalEndpoints(result.data)
      return fs.writeFile(outputPath, JSON.stringify(fullSwagger, null, 2)).then(() => fullSwagger)
    } else {
      throw new Error('Swagger can not be generated right now. Check definitions and try again.')
    }
  })
}

/**
 * Prepare handler for Swagger endpoint
 * @param {Object} swaggerDefinition - Basic definition of the Swagger
 * @param {string[]} endpointsFiles - Array of patches to endpoints files
 * @param {string} endpointPath - Optional endpoint for Swagger, "/docs" by default
 * @return {Promise<(function(*, *): void)|*>} Handler for Swagger endpoint
 */
async function getSwaggerEndpoint(swaggerDefinition, endpointsFiles, endpointPath = '/docs') {
  EndpointsRegistry.setDocs(endpointPath)
  const result = await swaggerAutogen(
    './swagger-output.json',
    endpointsFiles,
    deepMerge(defaultDefinition, swaggerDefinition)
  )
  if (result.success) {
    return (req, res) => {
      const fullResult = addInternalEndpoints(result.data)
      if (req.get('Accept') === 'application/json' || req.query.format === 'json') {
        res.json(fullResult)
      } else {
        swaggerUi.setup(fullResult)(req, res)
      }
    }
  } else {
    throw new Error('Swagger can not be generated right now. Check definitions and try again.')
  }
}

/**
 * Use Swagger endpoint in the application
 * @param {Object} app - Express application
 * @param {function} handler Handler to be called when Swagger endpoint is requested
 */
function useSwagger(app, handler) {
  app.use(EndpointsRegistry.getDocs(), getMiddleware(), handler)
}

/**
 * Return middleware needed for Swagger to work
 * @returns {function[]}
 */
function getMiddleware() {
  return swaggerUi.serve
}

module.exports = {
  getSwaggerEndpoint,
  useSwagger,
  generate,
  models
}
