module.exports = {
  Healthcheck: {
    type: 'object',
    properties: {
      app: {
        type: 'object',
        description: 'Object containing application details',
        properties: {
          name: {
            type: 'string',
            description: 'Name of the application',
            example: 'concrete-microapp-name'
          },
          version: {
            type: 'string',
            description: 'Version of the application',
            example: '1.0.0'
          }
        }
      },
      date: {
        type: 'string',
        format: 'date-time',
        description: 'Date of the update',
        example: '2024-05-21T15:43:39.901Z'
      },
      result: {
        type: 'string',
        description: 'Indicator if request was successful',
        example: 'success'
      }
    }
  }
}
