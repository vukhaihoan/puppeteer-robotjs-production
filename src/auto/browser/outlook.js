const { delay, rn } = require("../../utils");
const launchProfileGologin = require("../../intial/launchProfileGologin");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const adblocker = require("puppeteer-extra-plugin-adblocker");

const {
    type,
    click,
    select,
    humanizePuppeteer: { humanScroll, humanType },
} = require("../../shared/puppeteerFunction");
const { createCursor, installMouseHelper } = require("ghost-cursor");

// const { ORBITA_BROWSER, params, env } =
async function runOutlook(profileId) {
    puppeteer.use(StealthPlugin());
    puppeteer.use(adblocker());
    const ws = await launchProfileGologin(profileId);
    const ORBITA_BROWSER = ws?.ORBITA_BROWSER;
    const params = ws?.params;
    const env = ws?.env;
    const GL = ws?.GL;
    params.push("--profile-directory=Default");
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: ORBITA_BROWSER,
        args: params,
        userDataDir: ORBITA_BROWSER[0].split("=")[1],
    });
    const page = await browser.newPage();
    await installMouseHelper(page);
    const cursor = createCursor(page);

    // await page.goto("https://bot.sannysoft.com");
    await page.goto("https://vi-vn.facebook.com/", {
        waitUntil: "networkidle0",
    });

    const selector = "#email";
    await page.waitForSelector(selector);
    await cursor.click(selector);
    await delay(1000);
    await humanType(page, "vũ khải hoàn vukhaihoan");
    await delay(10000);
    // await browser.close();
    // await GL.stop();
}
module.exports = runOutlook;
