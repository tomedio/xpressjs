const fs = require('node:fs')
const envfile = require('envfile')

module.exports = {
  /**
   * Update environment file according to given parameters:
   * * filePath: string - path to env file (default: .env)
   * * data: Object - object with data to be added/updated; every property is an env variable
   * * override: boolean - a flag informing if overriding existing variables is allowed
   * @param {{filePath: string, data: Object, override: boolean}} parameters Operation parameters
   */
  updateEnv: function (parameters) {
    const filePath = parameters.filePath || '.env'
    const newValues = parameters.data || null
    const override = parameters.override || false

    if (newValues === null) {
      throw new Error('No env values is given')
    }
    if (!fs.existsSync(filePath)) {
      throw new Error('File ' + filePath + ' does not exist')
    }
    const parsedFile = envfile.parse(fs.readFileSync(filePath, 'utf8'))

    const newFields = Object.keys(newValues)
    for (const field in parsedFile) {
      if (newFields.indexOf(field) >= 0 && !override) {
        throw new Error('Field ' + field + 'is already set and can not be overwritten')
      }
    }

    const newParsedFile = Object.assign({}, parsedFile, newValues)
    fs.writeFileSync(filePath, envfile.stringify(newParsedFile))
  },

  /**
   * Remove environment variables from a file
   * @param {string[]} fieldsToDelete Names of environment variables which are expected to be removed
   * @param {string} filePath Path to env file (default: .env)
   */
  deleteValues: function (fieldsToDelete, filePath = undefined) {
    if (!fieldsToDelete || fieldsToDelete.length === 0) {
      throw new Error('No env values is given')
    }

    if (!fs.existsSync(filePath)) {
      throw new Error('File ' + filePath + ' does not exist')
    }
    const parsedFile = envfile.parse(fs.readFileSync(filePath, 'utf8'))

    const existingFields = Object.keys(parsedFile)
    for (const field of fieldsToDelete) {
      if (existingFields.indexOf(field) >= 0) {
        delete parsedFile[field]
      }
    }

    fs.writeFileSync(filePath, envfile.stringify(parsedFile))
  }
}
