module.exports = {
  components: {
    '@schemas': {
      ...require('./models/Healthcheck.schema.js'),
      ...require('./models/ErrorResponse.schema.js')
    }
  }
}
