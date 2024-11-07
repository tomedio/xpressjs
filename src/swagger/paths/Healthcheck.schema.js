module.exports = {
  Healthcheck: {
    get: {
      summary: 'Healthcheck to verify API availability',
      description: 'Healthcheck to verify API availability',
      responses: {
        200: {
          description: 'Healthcheck result',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Healthcheck'
              }
            }
          }
        }
      }
    }
  }
}
