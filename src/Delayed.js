/**
 * Resolve passed Promise object with given delay (ms)
 * @param {Promise<*>} p
 * @param {number} delay
 * @returns {Promise<*>}
 */
function delayed(p, delay) {
  return new Promise((resolve, reject) => {
    p.then((result) => {
      setTimeout(() => resolve(result), delay)
    }).catch((error) => {
      setTimeout(() => reject(error), delay)
    })
  })
}

module.exports = delayed
