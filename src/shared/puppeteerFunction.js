const PuppeteerChromiumType = require("puppeteer");
// const { createCursor } = require("ghost-cursor");
const humanizePuppeteer = require("../../lib/humanize-puppeteer");

async function type(page, selector, text, ...delayTime) {
    const element = await page.waitForSelector(selector);
    await page.click(selector, { delay: 100 });
    await delay(rn(delayTime[0] || 1000, delayTime[1] || 2000));
    await page.keyboard.type(text, { delay: 100 });
    await delay(rn(delayTime[2] || 500, delayTime[3] || 1000));
    return element;
}

async function select(page, selector, value, ...delayTime) {
    const element = await page.waitForSelector(selector);
    await page.click(selector, { delay: 100 });
    await delay(rn(delayTime[0] || 500, delayTime[1] || 1000));
    await page.select(selector, value);
    await delay(rn(delayTime[2] || 500, delayTime[3] || 1000));
    return element;
}

async function click(page, selector, ...delayTime) {
    const element = await page.waitForSelector(selector);
    await page.click(selector, { delay: 100 });
    await delay(rn(delayTime[0] || 500, delayTime[1] || 1000));
    return element;
}

module.exports = {
    type,
    select,
    click,
    humanizePuppeteer,
    PuppeteerChromiumType,
};
