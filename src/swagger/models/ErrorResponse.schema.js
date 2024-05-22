module.exports = {
  ErrorResponse: {
    type: 'object',
    required: ['status', 'message'],
    properties: {
      status: {
        type: 'number',
        description: 'Status code of the response',
        example: 200
      },
      message: {
        type: 'string',
        description: 'Human-readable message of the response',
        example: 'Data is changed successfully'
      },
      object: {
        type: 'object',
        description: 'Human-readable message of the response'
      }
    }
  }
}
