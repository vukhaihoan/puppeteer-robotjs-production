const { delay, rn, axios, goto } = require("../../utils");
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
puppeteer.use(StealthPlugin());
puppeteer.use(adblocker());
async function runOutlook(profileId, user, gologin) {
    const { ORBITA_BROWSER, params, env, GL } = gologin;
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
    const { mail, password, last, first, born } = user;
    await page.goto("https://www.google.com/", {
        waitUntil: "networkidle0",
    });
    await page.type("input[name=q]", "hotmail", { delay: 100 });
    await delay(1000);
    // await page.click("input[name=btnK]", { delay: 100 });
    await page.keyboard.press("Enter");

    await page.waitForNavigation({
        waitUntil: "networkidle0",
        timeout: 0,
    });

    await page.waitForSelector('a[href="https://outlook.live.com/"] > h3');
    await page.click('a[href="https://outlook.live.com/"]', { delay: 100 });
    await delay(rn(2000, 3000));
    const cratebuttonlist = await page.$$('a[href="https://outlook.live.com/owa/?nlp=1&signup=1"]');
    try {
        await cratebuttonlist[0].click({ delay: 100 });
        console.log("trường hợp button có nền trắng");
    } catch (err) {
        await cratebuttonlist[1].click({ delay: 100 });
        console.log("trường hợp button không có nền trắng");
    }
    try {
        await page.waitForNavigation({
            waitUntil: "networkidle0",
        });
    } catch (error) {
        console.log("error", error);
    }

    await delay(rn(500, 1000));
    await page.waitForSelector("#MemberName");
    await page.click("#MemberName", { delay: 100 });
    await page.focus("#MemberName", { delay: 100 });
    await page.keyboard.type(mail.Normal, { delay: 100 });
    await delay(rn(500, 1000));
    await page.waitForSelector("#iSignupAction");
    await page.click("#iSignupAction", { delay: 100 });
    try {
        await page.setDefaultTimeout(5000);
        const faileLink = page.waitForSelector("#suggLink", {
            hidden: true,
        });
        if (faileLink) {
            await click(page, "#suggLink");
            const buttonNameMail = await click(page, "#Suggestions > div > a");
            const newMail = await buttonNameMail.getProperty("textContent");
            const newMailTextSplit = newMail.split("@")[0];
            console.log("new mail: ", newMailTextSplit);
            await click(page, "#iSuggCancel");
            await click(page, "#iSignupAction");
            await delay(rn(2000, 3000));
        }
    } catch (error) {
        console.log("không có fail Link -> mail true");
    }
    await page.keyboard.type(password, { delay: 100 });
    await delay(rn(2000, 3000));
    await page.waitForSelector("#ShowHidePasswordCheckbox");
    await page.click("#ShowHidePasswordCheckbox", { delay: 100 });
    await delay(rn(1000, 2000));
    await page.waitForSelector("#iSignupAction");
    await page.click("#iSignupAction", { delay: 100 });
    await delay(rn(2000, 3000));
    await page.keyboard.type(last, { delay: 100 });
    await delay(rn(1000, 2000));
    await page.waitForSelector("#LastName");
    await page.click("#LastName", { delay: 100 });
    await page.keyboard.type(first, { delay: 100 });
    await delay(rn(1000, 2000));
    await page.waitForSelector("#iSignupAction");
    await page.click("#iSignupAction", { delay: 100 });
    await delay(rn(2000, 3000));
    await page.waitForSelector("#BirthMonth");
    await page.click("#BirthMonth", { delay: 100 });
    await delay(rn(500, 1000));
    await page.select("#BirthMonth", born.month);
    await delay(rn(500, 1000));
    await page.waitForSelector("#BirthDay");
    await page.click("#BirthDay", { delay: 100 });
    await delay(rn(500, 1000));
    await page.select("#BirthDay", born.day);
    await delay(rn(500, 1000));
    await page.waitForSelector("#BirthYear");
    await page.click("#BirthYear", { delay: 100 });
    await delay(rn(500, 1000));
    await page.keyboard.type(born.year, { delay: 100 });
    await delay(rn(500, 1000));
    await page.waitForSelector("#iSignupAction");
    await page.click("#iSignupAction", { delay: 100 });
    await delay(rn(4000, 5000));
    async function submitAnyCaptcha() {
        const elementHandle = await page.$("#enforcementFrame");
        const frame = await elementHandle.contentFrame();
        console.log("page url: ", page.url());
        const createTask = await axios.post("https://api.anycaptcha.com/createTask", {
            clientKey: process.env.ANYCAPTCHA_KEY,
            task: {
                type: "FunCaptchaTaskProxyless",
                websitePublicKey: "B7D8911C-5CC8-A9A3-35B0-554ACEE604DA",
                websiteURL: page.url(),
            },
        });
        const { taskId } = createTask.data;
        const result = await axios.post("https://api.anycaptcha.com/getTaskResult", {
            clientKey: process.env.ANYCAPTCHA_KEY,
            taskId: taskId,
        });
        const token = result.data.solution.token;
        console.log("token: ", token);
        const submitToken = await frame.evaluate((token) => {
            var anyCaptchaToken = token;
            let script = document.createElement("SCRIPT");
            script.append(
                'function AnyCaptchaSubmit(token) { parent.postMessage(JSON.stringify({ eventId: "challenge-complete", payload: { sessionToken: token } }), "*") }'
            );
            document.documentElement.appendChild(script);
            AnyCaptchaSubmit(anyCaptchaToken);
            return "submit success on page";
        }, token);

        console.log(submitToken);
    }
    async function condition() {
        let success = true;
        try {
            await page.waitForSelector("#idSIButton9", {
                timeout: 30 * 1000,
                visible: true,
            });
        } catch (error) {
            console.log("try to re submit captcha");
            success = false;
        }
        return !success;
    }

    await goto(submitAnyCaptcha, condition, 3);

    await delay(rn(1000, 1500));
    await page.click("#KmsiCheckboxField", { delay: 100 });
    await delay(rn(1000, 2000));
    await page.click("#idSIButton9", { delay: 100 });
    await page.setDefaultTimeout(30000);
    await page.waitForNavigation({
        waitUntil: "networkidle0",
        timeout: 0,
    });
    await delay(rn(4000, 5000));
    await page.waitForSelector('span[title="no-reply@microsoft.com"]');
    await page.click('span[title="no-reply@microsoft.com"]', { delay: 100 });
    await delay(rn(3000, 4000));
    await page.waitForSelector('button[aria-label="Forward"]');
    await page.evaluate(() => {
        document.querySelector('button[aria-label="Forward"]').scrollIntoView();
    });
    await delay(rn(3000, 4000));
    await page.close();
    await browser.close();
    await GL.stop();
    return;
}
module.exports = runOutlook;
