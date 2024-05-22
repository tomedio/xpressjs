/**
 * Split an array into chunks of a specified size
 * @param {array} originalArray Array to split
 * @param {number} size Size of each chunk
 * @return {array[]}
 */
function chunkArray(originalArray, size = 100) {
  const chunks = []
  for (let i = 0; i < originalArray.length; i += size) {
    chunks.push(originalArray.slice(i, i + size))
  }
  return chunks
}

module.exports = chunkArray
