import { ApolloServer } from "apollo-server-micro"
import cheerio from "cheerio"

import typeDefs from "./_typeDefs"
import resolvers from "./_resolvers"
import getHTML from "./_getHTML"
// import { getHTML } from "./_chromium"

const cors = require("micro-cors")()
const isDev = process.env.NOW_REGION === "dev1"

const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
    context: (integrationContext) => ({
        ...integrationContext,
        cheerio,
        getHTML,
        isDev,
    }),
})

exports.config = {
    api: { bodyParser: false },
}

module.exports = cors((req, res, ...args) => {
    if (req.method === "OPTIONS") {
        return res.status(200).send()
    }

    const handler = server.createHandler({ path: "/api" })

    return handler(req, res, ...args)
})
