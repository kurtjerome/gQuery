import chrome from "chrome-aws-lambda"
import puppeteer from "puppeteer-core"

export async function getHTML({ url, waitFor, isDev }) {
    const options = await getOptions(isDev)
    const browser = await puppeteer.launch(options)

    const page = await browser.newPage()
    await page.goto(url)

    if (waitFor) {
        await page.mainFrame().waitForSelector(waitFor)
    }

    const html = await page.evaluate(() => document.documentElement.innerHTML)

    await page.close()
    await browser.close()

    return html
}

async function getOptions(isDev) {
    if (isDev) {
        return {
            args: [],
            executablePath: getLocalExePath(),
            headless: true,
        }
    }

    return {
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless,
    }
}

function getLocalExePath() {
    switch (process.platform) {
        case "win32":
            return "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
        case "linux":
            return "/usr/bin/google-chrome"
        default:
            return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    }
}
