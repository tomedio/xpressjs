const { updateContext, getContext} = require('./Context')
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

const getRid = () => {
  return getContext()?.requestId;
}

module.exports = {
  useRid,
  getRid
}
