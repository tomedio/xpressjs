const bcrypt = require('bcrypt')
const crypto = require('node:crypto')

module.exports = {
  hashPassword: function (plainPassword) {
    return bcrypt.hashSync(plainPassword, 8)
  },
  generateToken: function (size = 20) {
    return crypto.randomBytes(size).toString('hex')
  }
}
