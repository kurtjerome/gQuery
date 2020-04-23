export default {
    Query: {
        page: async (
            _parent,
            { url, render, waitFor },
            { isDev, getHTML, cheerio }
        ) => {
            const html = await getHTML({ isDev, url, render, waitFor })

            return cheerio.load(html)
        },
    },
    Page: {
        g: ($, { query }) => {
            return $(query).toArray()
        },
        find: ($, { query }) => {
            return $(query).toArray()
        },
        findOne: ($, { query }) => {
            return $(query).first()
        },
    },
    Node: {
        html: (g, _args, { cheerio }) => {
            return cheerio(g).html()
        },
        text: (g, _args, { cheerio }) => {
            return cheerio(g).text()
        },
        val: (g, _args, { cheerio }) => {
            return cheerio(g).val()
        },
        data: (g, _args, { cheerio }) => {
            return cheerio(g).data()
        },
        attr: (g, { name }, { cheerio }) => {
            return cheerio(g).attr(name)
        },
        find: (g, { query }, { cheerio }) => {
            return cheerio(g).find(query).toArray()
        },
        findOne: (g, { query }, { cheerio }) => {
            return cheerio(g).find(query).first()
        },
    },
}
