import { ApolloServer, gql } from "apollo-server-micro"
import cheerio from "cheerio"

import { getHTML } from "./_chromium"

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
        attr(name: String!): String
        val: String
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
        attr: (g, { name }, { cheerio }) => {
            return cheerio(g).attr(name)
        },
        val: (g, _args, { cheerio }) => {
            return cheerio(g).val()
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

module.exports = (req, res, ...args) => {
    if (req.method === "OPTIONS") {
        return res.status(200).send()
    }

    const handler = server.createHandler({ path: "/api" })

    return handler(req, res, ...args)
}
