const jwt = require('jsonwebtoken')
const { createError } = require('./http/Error')

let accessTokenSecret = null

function getAccessToken() {
  return accessTokenSecret ?? process.env.JWT_TOKEN_SECRET
}

module.exports = {
  setUpTokenSecret(getterFn) {
    accessTokenSecret = getterFn()
  },
  signAccessToken(payload) {
    return new Promise((resolve, reject) => {
      jwt.sign({ payload }, getAccessToken(), {}, (err, token) => {
        if (err) {
          reject(createError(500, 'Error with authentication. Please wait and try again.', err))
        }
        resolve(token)
      })
    })
  },
  verifyAccessToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, getAccessToken(), (err, payload) => {
        if (err) {
          const message =
            err.name === 'JsonWebTokenError'
              ? 'You are unauthorized to do this'
              : 'An error with authorization occurred'
          return reject(createError(401, message, err))
        }
        resolve(payload)
      })
    })
  },
  /**
   * @typedef {Object} WhitelistItem
   * @property {string} method - HTTP method
   * @property {string} path - Whitelisted path
   */

  /**
   * @typedef {Object} JwtAuthenticateOptions
   * @property {WhitelistItem[]} whitelist - Whitelisted endpoints, skipped in token validation
   */

  /**
   * @param {JwtAuthenticateOptions} options
   * @returns {function}
   */
  jwtAuthenticate: function (options) {
    return function (req, res, next) {
      const whitelist = options?.whitelist ?? []
      const whitelistedRequest = whitelist.find(
        (entry) =>
          entry.method.toLowerCase() === req.method.toLowerCase() &&
          (typeof entry.path === 'object' ? req.url.match(entry.path) : entry.path === req.url)
      )
      if (whitelistedRequest) {
        return next()
      }

      const self = module.exports

      const authHeader = req.headers.authorization
      if (!authHeader) {
        return next(createError(401))
      }

      const [type, token] = authHeader.split(' ')

      if (type !== 'Bearer') {
        return next(createError(401))
      }

      if (!token) {
        return next(createError(401))
      }

      return self
        .verifyAccessToken(token)
        .then((content) => {
          req.user = content.payload
          next()
        })
        .catch((error) => next(error))
    }
  }
}
