import { gql } from "apollo-server-micro"

export default gql`
    type Query {
        page(url: String!, render: Boolean, waitFor: String): Page
    }

    type Page {
        g(query: String!): [Node]
        find(query: String!): [Node]
        findOne(query: String!): Node
    }

    type Node {
        html: String
        text: String
        val: String
        data: String
        attr(name: String!): String
        find(query: String!): [Node]
        findOne(query: String!): Node
    }
`
