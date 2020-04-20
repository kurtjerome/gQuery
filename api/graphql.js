import { ApolloServer, gql } from "apollo-server-micro"
import cheerio from "cheerio"

import { getHTML } from "./_chromium"

const cors = require("micro-cors")()
const isDev = process.env.NOW_REGION === "dev1"

const typeDefs = gql`
    type Query {
        page(url: String!): Website
    }

    type Website {
        g(query: String!): [DOMNode]
    }

    type DOMNode {
        html: String
        text: String
        val: String
        attr(name: String!): String
        first(query: String!): DOMNode
        find(query: String!): [DOMNode]
    }
`

const resolvers = {
    Query: {
        page: async (_parent, { url }, { isDev, getHTML, cheerio }) => {
            const html = await getHTML({ isDev, url })

            return cheerio.load(html)
        },
    },
    Website: {
        g: ($, { query }, _context) => {
            return $(query).toArray()
        },
    },
    DOMNode: {
        html: (g, _args, { cheerio }) => {
            return cheerio(g).html()
        },
        text: (g, _args, { cheerio }) => {
            return cheerio(g).text()
        },
        val: (g, _args, { cheerio }) => {
            return cheerio(g).val()
        },
        attr: (g, { name }, { cheerio }) => {
            return cheerio(g).attr(name)
        },
        find: (g, { query }, { cheerio }) => {
            return cheerio(g).find(query).toArray()
        },
        first: (g, { query }, { cheerio }) => {
            return cheerio(g).find(query).first()
        },
    },
}

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
