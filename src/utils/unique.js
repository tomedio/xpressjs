/**
 * Remove duplicates from an array
 * @param {any[]} arr
 * @param {function} fn
 * @return {any[]}
 */
function unique(arr, fn = null) {
  const uniqueItems = new Map()
  return arr.filter((item) => {
    const key = fn ? fn(item) : item
    const isNew = !uniqueItems.has(key)
    if (isNew) uniqueItems.set(key, true)
    return isNew
  })
}

module.exports = unique
