module.exports = {
  Docs: {
    get: {
      summary: 'Swagger documentation off the API',
      description: 'Swagger documentation off the API',
      parameters: [
        {
          name: 'Accept',
          in: 'header',
          description: 'Accept header',
          required: false,
          schema: {
            type: 'string',
            enum: ['application/json']
          }
        },
        {
          name: 'format',
          in: 'query',
          description: 'Format query parameter',
          required: false,
          schema: {
            type: 'string',
            enum: ['json']
          }
        }
      ],
      responses: {
        200: {
          description: 'Content of the documentation, depending on the requested format',
          content: {
            'application/json': {
              schema: {
                type: 'object'
              }
            },
            'text/html': {}
          }
        }
      }
    }
  }
}
