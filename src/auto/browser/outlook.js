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
                    console.log("CLOSE PAGE BEFOR CLOSE BROWSER : " + "https://" + page.url().split("/")[2]);
                }

                await page.close();
            });
        await browser.close();
        await GL.stop();
        console.log("CLOSE Brower&Gologin SUCCESS");
    } catch (error) {
        const errMessage = `CLOSE Brower&Gologin ERROR `;
        console.log(errMessage, error);
        throw new Error(errMessage);
    }
}
const Global = {
    browser: null,
    GL: null,
    page: null,
};

class PageFunctionNomal {
    constructor(page) {
        /**
         * @type {PuppeteerChromiumType.Page}
         */
        this.page = page;
    }
    async click(selector, message, ...delayTime) {
        try {
            const element = await this.page.waitForSelector(selector);
            await this.page.click(selector, { delay: 100 });
            await delay(rn(delayTime[0] || 500, delayTime[1] || 1000));
            console.log(message + " SUCCESS");
            return element;
        } catch (error) {
            console.log(message + " ERROR", error);
            throw new Error(message + " ERROR");
        }
    }
    async type(selector, text, message, ...delayTime) {
        try {
            // await this.page.waitForSelector(selector);
            const element = await this.click(selector, "click befor TYPE : " + message, delayTime[2], delayTime[3]);
            await this.page.keyboard.type(text, { delay: 100 });
            await delay(rn(delayTime[0] || 500, delayTime[1] || 1000));
            console.log(message + " SUCCESS");
            return element;
        } catch (error) {
            console.log(message + " ERROR", error);
            throw new Error(message + " ERROR");
        }
    }
    async select(selector, value, message, ...delayTime) {
        try {
            // const element = await this.page.waitForSelector(selector);
            const element = await this.click(selector, "click befor SELECT : " + message, delayTime[2], delayTime[3]);
            await this.page.select(selector, value);
            await delay(rn(delayTime[0] || 500, delayTime[1] || 1000));
            console.log(message + " SUCCESS");
            return element;
        } catch (error) {
            console.log(message + " ERROR", error);
            throw new Error(message + " ERROR");
        }
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
        const cratebuttonlist = await page.$$('a[href="https://outlook.live.com/owa/?nlp=1&signup=1"]');
        try {
            await cratebuttonlist[0].click({ delay: 100 });
        } catch (err) {
            await cratebuttonlist[1].click({ delay: 100 });
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
        const faileLink = await page.waitForSelector("#suggLink", {
            hidden: true,
        });
        if (faileLink) {
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

async function submitAnyCaptchaToken(page) {
    let tryAgainByAnyCaptcha = false;
    async function submitAnyCaptcha() {
        try {
            const elementHandle = await page.$("#enforcementFrame");
            const frame = await elementHandle.contentFrame();
            const {
                data: { taskId },
            } = await axios.post("https://api.anycaptcha.com/createTask", {
                clientKey: process.env.ANYCAPTCHA_KEY,
                task: {
                    type: "FunCaptchaTaskProxyless",
                    websitePublicKey: "B7D8911C-5CC8-A9A3-35B0-554ACEE604DA",
                    websiteURL: page.url(),
                },
            });
            await delay(rn(1000, 2000));
            let getTaskResultCondition = false;
            let tokenGlobal = null;
            async function getTaskResult() {
                try {
                    const res = await axios.post("https://api.anycaptcha.com/getTaskResult", {
                        clientKey: process.env.ANYCAPTCHA_KEY,
                        taskId: taskId,
                    });
                    const {
                        data: {
                            solution: { token },
                        },
                    } = res;
                    // console.log("RES getTaskResult", res.data, res.status);
                    console.log("ANY_CAPTCHA_TOKEN = ", token);
                    tokenGlobal = token;
                } catch (error) {
                    console.log("ERROR getTaskResult debug", error);
                    getTaskResultCondition = true;
                }
            }
            function conditionTaskResult() {
                return getTaskResultCondition;
            }
            await goto(getTaskResult, conditionTaskResult, {
                retryAmount: 3,
            });
            const submitToken = await frame.evaluate((token) => {
                var anyCaptchaToken = token;
                let script = document.createElement("SCRIPT");
                script.append(
                    'function AnyCaptchaSubmit(token) { parent.postMessage(JSON.stringify({ eventId: "challenge-complete", payload: { sessionToken: token } }), "*") }'
                );
                document.documentElement.appendChild(script);
                AnyCaptchaSubmit(anyCaptchaToken);
                return "SUBMIT TOKEN CALL";
            }, tokenGlobal);
            console.log(submitToken);
        } catch (error) {
            console.log("SUBMIT TOKEN ERROR DUE TO submitAnyCaptcha function -> TRY AGAIN");
            tryAgainByAnyCaptcha = true;
        }
    }
    async function conditionSubmitAC() {
        let success = true;
        try {
            await page.waitForSelector("#idSIButton9", {
                timeout: 35 * 1000,
                visible: true,
            });
        } catch (error) {
            console.log("TRY SUBMIT CAPTCHA AGAIN");
            success = false;
        }
        if (!success || tryAgainByAnyCaptcha) {
            return true;
        }
        return false;
    }
    await goto(submitAnyCaptcha, conditionSubmitAC, 2);
    console.log("SUBMIT ANY CAPTCHA SUCCESS");
    await delay(rn(2000, 3000));
}

async function runOutlook({ user, profile }, i) {
    try {
        const { mail, password, last, first, born } = user;
        const { browser, GL } = await launchGologin(profile.profileId);
        Global.browser = browser;
        Global.GL = GL;
        const page = await browser.newPage();
        const instancePage = new PageFunctionNomal(page);
        await installMouseHelper(page);
        const cursor = createCursor(page);

        await gotoOutlookUrl(page, instancePage);

        await gotoSignUpUrl(page, instancePage);

        await instancePage.type("#MemberName", mail.Normal, "TYPE MAIL");
        // await instancePage.type("#MemberName", "vukhaihoan", "TYPE MAIL"); // check fail email test
        await instancePage.click("#iSignupAction", "CLICK SIGN UP BUTTON");

        page.setDefaultTimeout(5000);
        await checkFailEmailKnowError(page, instancePage);

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
        console.log(`RUN PROFILE OUTLOOOK ERROR : ${profile.profileId}`, error);
        await closeBrowserAndGologin(Global.browser, Global.GL, true);
    }
}
module.exports = runOutlook;
