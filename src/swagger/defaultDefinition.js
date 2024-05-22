module.exports = {
  servers: [
    {
      url: '/'
    }
  ],
  components: {
    '@schemas': {
      ...require('./models/Healthcheck.schema.js'),
      ...require('./models/ErrorResponse.schema.js')
    }
  }
}
