/**
 * Deep merge two given objects
 * @param {Object} firstObject
 * @param {Object} secondObject
 * @return {Object}
 */
function deepMerge(firstObject, secondObject) {
  if (Array.isArray(firstObject) && Array.isArray(secondObject)) {
    return [...firstObject, ...secondObject];
  }

  if (typeof firstObject === 'object' && firstObject !== null && typeof secondObject === 'object' && secondObject !== null) {
    const result = { ...firstObject };

    for (const key in secondObject) {
      if (Object.prototype.hasOwnProperty.call(secondObject, key)) {
        if (typeof secondObject[key] === 'object' && secondObject[key] !== null && firstObject[key]) {
          result[key] = deepMerge(firstObject[key], secondObject[key]);
        } else {
          result[key] = secondObject[key];
        }
      }
    }

    return result;
  }

  return secondObject;
}

module.exports = deepMerge
