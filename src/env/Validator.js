module.exports = {
  /**
   *
   * @param requiredVariables
   * @returns {Promise<null|{message: string, variables: string[]}>}
   */
  checkRequiredVars: function (requiredVariables) {
    const notAvailableVariables = []
    for (const variableName of requiredVariables) {
      if (typeof process.env[variableName] === 'undefined' || process.env[variableName] === '') {
        notAvailableVariables.push(variableName)
      }
    }
    return new Promise((resolve, reject) => {
      if (notAvailableVariables.length > 0) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return reject({
          message: `Required environment variables: ${notAvailableVariables.join(', ')} are not available`,
          variables: notAvailableVariables
        })
      }
      return resolve(null)
    })
  }
}
