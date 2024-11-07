const { updateContext, getContext } = require('./Context')
const { v4: uuidv4 } = require('uuid')
const { useContext } = require('../Context')

let requestIdentifier = null

const requestId = (req, res, next) => {
  updateContext({ requestId: uuidv4() })
  return next()
}

const useRid = (app) => {
  useContext(app)
  app.use(requestId)
}

const setRid = (reqId) => {
  requestIdentifier = reqId
}

const getRid = () => {
  return getContext()?.requestId ?? requestIdentifier
}

module.exports = {
  useRid,
  getRid,
  setRid
}
