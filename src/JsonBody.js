const express = require('express')

module.exports = express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf
  }
})
