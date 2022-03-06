const puppeteer = require("puppeteer");
const { delay } = require("../utils");

async function changeIpModem() {
    const startTime = Date.now();
    await new Promise((resolve, reject) => {
        try {
            puppeteer
                .launch({
                    headless: false,
                    // defaultViewport: {
                    //     width: 1536,
                    //     height: 722,
                    // },
                    defaultViewport: null,
                    args: [
                        "--start-maximized", // you can also use '--start-fullscreen'
                    ],
                    ignoreHTTPSErrors: true,
                    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
                })
                .then(async function (browser) {
                    async function createPage() {
                        const page = await browser.newPage();
                        await page.goto("http://192.168.1.1/", { waitUntil: "networkidle2" });
                        return page;
                    }
                    async function login(page) {
                        await page.waitForSelector("#txt_Username");
                        await page.$eval("#txt_Username", (el) => (el.value = "admin"));
                        await page.waitForSelector("#txt_Password");
                        await page.$eval("#txt_Password", (el) => (el.value = "HWTC9B1035A6"));
                        await page.waitForSelector("#button");
                        await page.$eval("#button", (el) => el.click());
                        await page.waitForNavigation({ waitUntil: "networkidle0" });
                    }
                    async function initial(page) {
                        console.log(page.url());
                        await login(page);
                        const status = await checkRetryPageAndGoHomePage(page);
                        if (status) {
                            await initial(page);
                        }
                        await page.waitForSelector("#Cmbutton");
                        await page.$eval("#Cmbutton", (el) => el.click());
                        await page.waitForSelector('li[name="mainli_wan"]');
                        await page.$eval('li[name="mainli_wan"]', (el) => el.click());
                        await page.waitForNetworkIdle();
                        // await page.screenshot({ path: "./example2.png" });
                        await delay(200);
                        console.log("Done! initial - Login");
                    }
                    async function closePage(page) {
                        return await page.close();
                    }
                    function checkHomePage(page) {
                        if (page.url() == "https://192.168.1.1/") {
                            console.log("Home page is loaded");
                            return true;
                        }
                        // console.log("Home page is not loaded");
                        return false;
                    }
                    async function checkRetryPageAndGoHomePage(page) {
                        if ((await page.$("#btnReboot")) != null) {
                            console.log("login retry page is loaded");
                            await page.waitForSelector("#btnReboot");
                            await page.$eval("#btnReboot", (el) => el.click());
                            await page.waitForNavigation({ waitUntil: "networkidle2" });
                            return true;
                        }
                        console.log("login retry page is not loaded");
                        return false;
                    }
                    const page = await createPage();
                    await initial(page);
                    async function switchClick(page) {
                        await page.mouse.click(718, 245);
                        await delay(500);
                        if (checkHomePage(page)) {
                            await initial(page);
                            await switchClick(page);
                        }
                        await page.mouse.click(718, 315);
                        await delay(100);
                        await page.evaluate(() => {
                            window.scrollBy(0, window.innerHeight);
                        });
                        await delay(100);
                        await page.mouse.click(730, 655);
                        await delay(500);
                        if (checkHomePage(page)) {
                            await initial(page);
                            await switchClick(page);
                        }
                        await page.evaluate(() => {
                            window.scrollTo(0, 0);
                        });
                        await page.waitForResponse("https://192.168.1.1/images/button_bg.gif");
                        return null;
                    }
                    await switchClick(page);
                    await delay(3800);
                    await switchClick(page);
                    await browser.close();
                    resolve({
                        success: true,
                    });
                });
        } catch (error) {
            console.log("error", error);
            res.send({
                status: "error",
                error: String(error),
                success: false,
            });
            reject(error);
            return;
        }
    });
    const endTime = Date.now();
    const timeTaken = endTime - startTime;
    // await page.screenshot({ path: "./changeip.png" });
    const data = {
        logTime: new Date().toISOString(),
        message: "Done! IP Changed",
        timeTaken: {
            ms: timeTaken,
            s: timeTaken / 1000,
            m: timeTaken / 1000 / 60,
        },
        success: true,
    };
    console.log(data);
    return data;
}
module.exports = changeIpModem;
