/**
 * Deep merge two given objects
 * @param {Object} firstObject
 * @param {Object} secondObject
 * @return {Object}
 */
function deepMerge(firstObject, secondObject) {
  const result = { ...firstObject }

  for (const key in secondObject) {
    if (Object.prototype.hasOwnProperty.call(secondObject, key)) {
      if (typeof secondObject[key] === 'object' && secondObject[key] !== null && firstObject[key]) {
        result[key] = deepMerge(firstObject[key], secondObject[key])
      } else {
        result[key] = secondObject[key]
      }
    }
  }

  return result
}

module.exports = deepMerge
