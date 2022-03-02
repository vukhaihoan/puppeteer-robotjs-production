const { puppeteer, Cluster, clusterConnect, puppeteerChromiumType } = require("../../shared/puppeteerFunction");
const { delay, rn } = require("../../utils");
const runProfile = require("../../intial/connectProfileGologin");
const { listKeywords } = require("../../../data");

async function runPerProfile(profile_id) {
    try {
        let currentProfile;
        const ws = async () => {
            const res = await runProfile(profile_id);
            currentProfile = res;
            return res.wsUrl;
        };
        const { cluster, browser } = await clusterConnect(ws);
        cluster.on("taskerror", (err, data, willRetry) => {
            if (willRetry) {
                console.warn(`Encountered an error while crawling ${data}. ${err.message}\nThis job will be retried`);
            } else {
                console.error(`Failed to crawl ${data}: ${err.message}`);
            }
        });
        // cluster.browser.browser.on("targetchanged", (target) => console.log(target));
        /**
         * @param {{page: puppeteerChromiumType.Page, data: string}}
         */
        const multipleLink = async ({ page, data: q }) => {
            try {
                const searchPraram = q.split(" ").join("+");
                await page.goto(`https://www.google.com/search?q=${searchPraram}`, {
                    waitUntil: "networkidle0",
                });
                const listE = await page.$$("a > h3");
                const e = listE[Math.floor(Math.random() * listE.length)];
                await page.evaluate((e) => {
                    e.click();
                }, e);
                // await page.waitForNavigation({
                //     timeout: 10000,
                // });
                await delay(10000);
                console.log("done with q: " + q);
            } catch (error) {
                console.log(error);
            }
        };
        /**
         * @param {{page: puppeteerChromiumType.Page, data: string}}
         */
        const youtube = async ({ page, data: q }) => {
            try {
                await page.goto(`https://www.google.com/search?q=youtube`, {
                    waitUntil: "networkidle0",
                });
                await page.waitForSelector('a[href="https://www.youtube.com/?hl=vi"] > h3');
                await page.click('a[href="https://www.youtube.com/?hl=vi"] > h3');

                await page.waitForNavigation();
                const listE = await page.$$("#contents yt-formatted-string");
                const e = listE[rn(0, 7)];
                await page.evaluate((e) => {
                    e.click();
                }, e);
                // await page.waitForNavigation({
                //     timeout: 10000,
                // });
                await delay(10000);
                console.log("done with youtube");
            } catch (error) {
                console.log(error);
            }
        };
        /**
         * @param {{page: puppeteerChromiumType.Page, data: string}}
         */
        const googlenews = async ({ page, data: url, worker }) => {
            try {
                console.log(worker);
                await page.goto(url, {
                    waitUntil: "networkidle0",
                });

                await page.waitForSelector("article > a");
                const listE = await page.$$("article > a");
                const e = listE[Math.floor(Math.random() * listE.length)];
                await page.evaluate((e) => {
                    e.click();
                }, e);
                // try {
                //     const newWindowTarget = await browser.waitForTarget((target) => {});
                // } catch (error) {
                //     // console.log(error);
                // }
                await delay(10000);
                console.log("Done with googlenews");
            } catch (error) {
                console.log(error);
            }
        };
        /**
         * @param {{page: puppeteerChromiumType.Page, data: string}}
         */
        const changeLanguage = async ({ page, data: url, worker }) => {
            try {
                await page.goto(url, {
                    waitUntil: "networkidle0",
                });
                page.on("dialog", async (dialog) => {
                    console.log(dialog.message());
                    await dialog.accept();
                });
                await page.waitForSelector("div[data-value=vi] > span");
                await page.click("div[data-value=vi] > span");

                await page.waitForSelector("#form-buttons > div");
                await page.click("#form-buttons > div");
                // await page.waitForNavigation();
                await delay(5000);
            } catch (error) {
                console.log(error);
            }
        };
        cluster.queue("https://www.google.com/preferences#languages", changeLanguage);
        for (let i = 0; i < rn(4, 6); i++) {
            cluster.queue(listKeywords[rn(0, Math.floor(Math.random() * listKeywords.length))], multipleLink);
        }
        cluster.queue("https://news.google.com/topstories?hl=vi&gl=VN&ceid=VN:vi", googlenews);
        cluster.queue("", youtube);
        await cluster.idle();
        (await browser.pages())
            .filter((value, index) => index > 0)
            .forEach(async (page, index) => {
                console.log("close page :" + page.url());
                await page.close();
            });
        console.log("done");
        await cluster.close();
        await currentProfile.GL.stop();
    } catch (error) {
        return {
            profile_id,
            success: false,
            error,
        };
    }
    return {
        profile_id,
        success: true,
    };
}
module.exports = runPerProfile;
