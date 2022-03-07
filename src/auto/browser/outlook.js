const path = require("path");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const adblocker = require("puppeteer-extra-plugin-adblocker");
const { createCursor, installMouseHelper } = require("ghost-cursor");
const { launchProfileGologin } = require("../../initial/index");
const { delay, rn, axios, goto } = require("../../utils");
const {
    humanizePuppeteer: { humanScroll, humanType },
    PuppeteerChromiumType,
} = require("../../shared/puppeteerFunction");
const { submitAnyCaptchaToken } = require("../../services/index");
puppeteer.use(StealthPlugin());
puppeteer.use(adblocker());
/**
 * @returns {Promise<{browser : PuppeteerChromiumType.Browser, GL : any}>}
 */
async function launchGologin(profileId) {
    try {
        let { ORBITA_BROWSER, params, env, GL } = await launchProfileGologin(profileId);
        const browser = await puppeteer.launch({
            headless: false,
            executablePath: ORBITA_BROWSER,
            args: params,
            userDataDir: ORBITA_BROWSER[0].split("=")[1],
        });
        return {
            browser,
            GL,
        };
    } catch (error) {
        const errMessage = `LAUNCH PROFILE GOLOGIN ERROR : ${profileId}`;
        console.log(errMessage, error);
        throw new Error(errMessage);
    }
}
async function closeBrowserAndGologin(browser, GL, err) {
    try {
        (await browser.pages())
            .filter((value, index) => index > 0)
            .forEach(async (page, index) => {
                if (err) {
                    console.log("FORCE CLOSE PAGE DUE TO ERROR : " + "https://" + page.url().split("/")[2]);
                } else {
                    console.log("CLOSE PAGE BEFORE CLOSE BROWSER : " + "https://" + page.url().split("/")[2]);
                }

                await page.close();
            });
        await browser.close();
        await GL.stop();
        console.log("CLOSE Browser&Gologin SUCCESS");
    } catch (error) {
        const errMessage = `CLOSE Browner&Gologin ERROR `;
        console.log(errMessage, error);
        throw new Error(errMessage);
    }
}
const Global = {
    browser: null,
    GL: null,
    page: null,
};

class PageFunctionNormal {
    constructor(page) {
        /**
         * @type {PuppeteerChromiumType.Page}
         */
        this.page = page;
    }
    async initAction(callback, message) {
        try {
            async function callBackGoto() {
                let condition = false;
                try {
                    await callback();
                } catch (error) {
                    console.log("ERROR IN ACTION : " + message, error);
                    condition = true;
                }
                return condition;
            }
            await goto(callBackGoto, (condition) => condition, { retryMessage: `click ${message} by goto` });
        } catch (error) {
            console.log(message + " ERROR", error);
            throw new Error(message + " ERROR");
        }
    }

    async click(selector, message, ...delayTime) {
        async function initCallback() {
            const element = await this.page.waitForSelector(selector);
            await delay(rn(500, 1000));
            await this.page.click(selector, { delay: 100 });
            await delay(rn(delayTime[0] || 500, delayTime[1] || 1000));
            console.log(message + " SUCCESS");
            return element;
        }
        const bindAction = initCallback.bind(this);
        await this.initAction(bindAction, message);
    }
    async type(selector, text, message, ...delayTime) {
        async function initCallback() {
            // await this.page.waitForSelector(selector);
            const element = await this.click(selector, "click before TYPE : " + message, delayTime[2], delayTime[3]);
            await this.page.keyboard.type(text, { delay: 100 });
            await delay(rn(delayTime[0] || 500, delayTime[1] || 1000));
            console.log(message + " SUCCESS");
            return element;
        }
        const bindAction = initCallback.bind(this);
        await this.initAction(bindAction, message);
    }
    async select(selector, value, message, ...delayTime) {
        async function initCallback() {
            // const element = await this.page.waitForSelector(selector);
            const element = await this.click(selector, "click before SELECT : " + message, delayTime[2], delayTime[3]);
            await this.page.select(selector, value);
            await delay(rn(delayTime[0] || 500, delayTime[1] || 1000));
            console.log(message + " SUCCESS");
            return element;
        }
        const bindAction = initCallback.bind(this);
        await this.initAction(bindAction, message);
    }
}
class PageFunctionHuman {}

async function waitForNavigationKnowError(page, options = {}, message = "unknown message") {
    try {
        await page.waitForNavigation(options);
    } catch (error) {
        console.log("WAIT FOR NAVIGATION KNOW ERROR : " + message);
    }
}

async function gotoOutlookUrl(page, instancePage) {
    try {
        await page.goto("https://www.google.com/", {
            timeout: 0,
        });

        await instancePage.type("input[name=q]", "hotmail", "TYPE GOOGLE SEARCH ");
        await page.keyboard.press("Enter");
        await waitForNavigationKnowError(page, { timeout: 0 }, "WAIT GOOGLE SEARCH LOAD ");
        await instancePage.click('a[href="https://outlook.live.com/"] > h3', "CLICK HOTMAIL ");
        await waitForNavigationKnowError(page, { timeout: 5000 }, "WAIT GOTO OUTLOOK URL ");
        console.log("GOTO OUTLOOK URL SUCCESS");
    } catch (error) {
        console.log("GOTO OUTLOOK URL ERROR", error);
        throw new Error("GOTO OUTLOOK URL ERROR");
    }
}

async function gotoSignUpUrl(page) {
    try {
        await page.waitForSelector('a[href="https://outlook.live.com/owa/?nlp=1&signup=1"]');
        const createButtonList = await page.$$('a[href="https://outlook.live.com/owa/?nlp=1&signup=1"]');
        try {
            await createButtonList[0].click({ delay: 100 });
        } catch (err) {
            await createButtonList[1].click({ delay: 100 });
        }
        await waitForNavigationKnowError(
            page,
            {
                waitUntil: "networkidle2",
                timeout: 0,
            },
            "WAIT GOTO SIGN UP URL"
        );
        console.log("GOTO SIGN UP URL SUCCESS");
    } catch (error) {
        console.log("GOTO SIGN UP URL ERROR", error);
        throw new Error("GOTO SIGN UP URL ERROR");
    }
}

async function checkFailEmailKnowError(page, instancePage) {
    try {
        const failedLink = await page.waitForSelector("#suggLink", {
            hidden: true,
        });
        if (failedLink) {
            await instancePage.click("#suggLink", "CLICK FAIL LINK");
            const buttonNameMail = await instancePage.click("#Suggestions > div > a", "CLICK BUTTON NAME MAIL");
            // get Mail Name
            const newMail = (await buttonNameMail.getProperty("textContent"))._remoteObject.value;
            const newMailTextSplit = newMail.split("@")[0];
            console.log("NEW MAIL FAIL: ", newMailTextSplit);
            await instancePage.click("#iSignupAction", "CLICK SIGN UP BUTTON AGAIN");
            await delay(rn(2000, 3000));
        }
    } catch (error) {
        console.log("CHECK FAIL EMAIL KNOW ERROR : N0_FAIL_EMAIL");
    }
}
const slow3G = PuppeteerChromiumType.networkConditions["Slow 3G"];
async function runOutlook({ user, profile }, i) {
    try {
        const { mail, password, last, first, born } = user;
        const { browser, GL } = await launchGologin(profile.profileId);
        Global.browser = browser;
        Global.GL = GL;
        const page = await browser.newPage();
        // await page.emulateNetworkConditions(slow3G);
        const instancePage = new PageFunctionNormal(page);
        await installMouseHelper(page);
        const cursor = createCursor(page);

        await gotoOutlookUrl(page, instancePage);

        await gotoSignUpUrl(page, instancePage);

        await instancePage.type("#MemberName", mail.Normal, "TYPE MAIL");
        // await instancePage.type("#MemberName", "vukhaihoan", "TYPE MAIL"); // check fail email test
        await instancePage.click("#iSignupAction", "CLICK SIGN UP BUTTON");

        page.setDefaultTimeout(10000);
        await checkFailEmailKnowError(page, instancePage);
        page.setDefaultTimeout(20000);

        await instancePage.type("#PasswordInput", password, "TYPE PASSWORD", 2000, 3000);

        await instancePage.click("#ShowHidePasswordCheckbox", "CLICK SHOW HIDE PASSWORD");

        await instancePage.click("#iSignupAction", "CLICK SIGN UP BUTTON", 2000, 3000);

        await instancePage.type("#FirstName", last, "TYPE FIRST NAME", 1000, 2000);

        await instancePage.type("#LastName", first, "TYPE LAST NAME", 1000, 2000);

        await instancePage.click("#iSignupAction", "CLICK SIGN UP BUTTON", 2000, 3000);

        await instancePage.select("#BirthMonth", born.month, "SELECT BORN MONTH");

        await instancePage.select("#BirthDay", born.day, "SELECT BORN DAY");

        await instancePage.type("#BirthYear", born.year, "SELECT BORN YEAR");

        await instancePage.click("#iSignupAction", "CLICK SIGN UP BUTTON", 4000, 5000);

        await submitAnyCaptchaToken(page);

        await instancePage.click("#KmsiCheckboxField", "CLICK KMSI CHECKBOX");

        await instancePage.click("#idSIButton9", "CLICK SIGN UP BUTTON", 4000, 5000);

        page.setDefaultTimeout(20000);
        await waitForNavigationKnowError(page, { waitUntil: "networkidle2" }, "WAIT GOTO MAILBOX PAGE");

        await delay(rn(4000, 5000));

        await instancePage.click('span[title="no-reply@microsoft.com"]', "CLICK NO REPLY", 3000, 4000);

        // await page.waitForSelector('button[aria-label="Forward"]');
        // await page.evaluate(() => {
        //     document.querySelector('button[aria-label="Forward"]').scrollIntoView();
        // });
        await page.screenshot({ path: path.resolve(__dirname, `../../../logs/${i}.png`) });

        // await page.close();

        await closeBrowserAndGologin(browser, GL);
    } catch (error) {
        console.log(`RUN PROFILE OUTLOOK ERROR : ${profile.profileId}`, error);
        await closeBrowserAndGologin(Global.browser, Global.GL, true);
    }
}
module.exports = runOutlook;
