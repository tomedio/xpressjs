module.exports = {
  getFilters: function (rawFilters, definition) {
    const parsedFilters = {}
    const filterNames = Object.keys(definition)
    if (filterNames.length === 0) {
      return null
    }
    for (const filterName of Object.keys(definition)) {
      const parser = definition[filterName].parser ?? null
      const value = rawFilters[filterName] ?? definition[filterName].default
      parsedFilters[filterName] = parser ? parser(value) : value
    }
    return parsedFilters
  }
}
