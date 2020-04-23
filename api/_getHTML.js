import fetch from "node-fetch"

import { getHTML as getRenderedHTML } from "./_chromium"

export default function ({ isDev, url, render, waitFor }) {
    if (!render) {
        return fetch(url).then((res) => res.text())
    } else {
        return getRenderedHTML({ isDev, url, waitFor })
    }
}
