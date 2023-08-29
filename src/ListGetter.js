const DatabaseClient = require('./DatabaseClient')

module.exports = {
  getList: async function (query, entityObject, pageNumber, pageSize) {
    const prisma = DatabaseClient.getPrismaClient()

    const realQuery = Object.assign({}, query, {
      skip: (pageNumber - 1) * pageSize,
      take: pageSize
    })
    const { where } = query

    const [items, totalItems] = await prisma.$transaction([
      entityObject.findMany(realQuery),
      entityObject.count({ where })
    ])

    return { items, totalItems, totalPages: Math.ceil(totalItems / pageSize) }
  }
}
