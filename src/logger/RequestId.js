const { updateContext } = require('./Context')
const { v4: uuidv4 } = require('uuid')
const { useContext } = require('../Context')

const requestId = (req, res, next) => {
  updateContext({ requestId: uuidv4() })
  return next()
}

const useRid = (app) => {
  useContext(app)
  app.use(requestId)
}

module.exports = {
  useRid
}
