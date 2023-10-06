const { getMessage } = require('./Messages')

module.exports = {
  createSuccess: function (status, message = null, object = undefined) {
    return {
      status,
      message: message ?? getMessage(status) ?? getMessage(200),
      object
    }
  },
  createListResponse: function (items, totalPages = undefined) {
    return {
      items,
      totalPages
    }
  }
}
