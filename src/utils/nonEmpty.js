/**
 * Remove empty items from an array
 * @param {any[]} arr
 * @return {any[]}
 */
function nonEmpty(arr) {
  return this.filter(item => item !== undefined && item !== null && item !== '');
}

module.exports = nonEmpty;
