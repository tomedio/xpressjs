/**
 * Function to clean the given log
 * @param {string} logMessage Original log message
 * @returns {string}
 */
const cleanLog = (logMessage) => logMessage.trim().replaceAll('\n', ' ').replaceAll(/\s+/g, ' ')

module.exports = {
  cleanLog
}
