module.exports = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
