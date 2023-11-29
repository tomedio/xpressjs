/**
 * Stop program execution for a time defined in a parameter
 * @param {number} ms Time to sleep (in ms)
 * @returns {Promise<undefined>}
 */
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

module.exports = sleep