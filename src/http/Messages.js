let defaultStatusMessages = {
  200: 'Operation has been finished successfully',
  400: 'Your request does not contain all required information',
  401: 'You are not authorized to do this operation',
  403: 'This operation is forbidden for you',
  404: 'Not found',
  500: 'Unexpected server error occurred'
}

module.exports = {
  setDefaultMessages: function (defaultMessages) {
    defaultStatusMessages = Object.assign(defaultStatusMessages, defaultMessages)
  },
  getMessage: function (status) {
    return defaultStatusMessages[status] ?? null
  }
}
