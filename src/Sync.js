/**
 * Resolve given Promise object inline, return error or result
 * @param {Promise<*>} p
 * @returns {Promise<{error: Error|null, result: *|null}>}
 */
async function sync(p) {
  return p.then((result) => ({ error: null, result })).catch((error) => ({ error, result: null }))
}

module.exports = sync
