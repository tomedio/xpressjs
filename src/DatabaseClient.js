// eslint-disable-next-line no-unused-vars
const { Prisma, PrismaClient } = require('@prisma/client')

const DatabaseClient = (function () {
  let client

  return {
    /**
     * @returns {PrismaClient<Prisma.PrismaClientOptions, "log" extends keyof Prisma.PrismaClientOptions ? (Prisma.PrismaClientOptions["log"] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<Prisma.PrismaClientOptions["log"]> : never) : never, DefaultArgs>}
     */
    getPrismaClient: function () {
      if (client === undefined) {
        client = new PrismaClient()
      }
      return client
    }
  }
})()

module.exports = DatabaseClient
