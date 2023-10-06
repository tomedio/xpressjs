async function sync(p) {
  return p.then((result) => ({ error: null, result })).catch((error) => ({ error, result: null }))
}

module.exports = sync
