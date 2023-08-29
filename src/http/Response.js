const { getMessage } = require('./Messages')

module.exports = {
  createSuccess: function (status, message = null) {
    return {
      status,
      message: message ?? getMessage(status) ?? getMessage(200)
    }
  },
  createListResponse: function (items, totalPages = undefined) {
    return {
      items,
      totalPages
    }
  }
}
