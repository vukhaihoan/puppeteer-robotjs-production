const { delay, rn } = require("../utils/utils");
const axios = require("../utils/axios");
async function type(page, selector, text, ...delayTime) {
    const element = await page.waitForSelector(selector);
    await page.click(selector, { delay: 100 });
    await delay(rn(delayTime[0] || 500, delayTime[1] || 1000));
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
// click for One Element find
async function click(page, selector, ...delayTime) {
    const element = await page.waitForSelector(selector);
    await page.click(selector, { delay: 100 });
    await delay(rn(delayTime[0] || 500, delayTime[1] || 1000));
    return element;
}
async function outlook(browser, user) {
    const { mail, password, last, first, born } = user;
    const page = await browser.newPage();
    await page.goto("https://www.google.com/", {
        waitUntil: "networkidle0",
    });
    await page.type("input[name=q]", "hotmail", { delay: 100 });
    await delay(1000);
    await page.click("input[name=btnK]", { delay: 100 });
    await page.waitForNavigation({
        waitUntil: "networkidle0",
    });
    await page.waitForSelector('a[href="https://outlook.live.com/"] > h3');
    await page.click('a[href="https://outlook.live.com/"]', { delay: 100 });
    await delay(rn(2000, 3000));
    // click create new mail
    const cratebuttonlist = await page.$$('a[href="https://outlook.live.com/owa/?nlp=1&signup=1"]');
    // button có nền trắng
    try {
        await cratebuttonlist[0].click({ delay: 100 });
        console.log("trường hợp button có nền trắng");
    } catch (err) {
        await cratebuttonlist[1].click({ delay: 100 });
        console.log("trường hợp button không có nền trắng");
    }
    await page.waitForNavigation({
        waitUntil: "networkidle0",
    });
    await delay(rn(500, 1000));
    await page.waitForSelector("#MemberName");
    await page.click("#MemberName", { delay: 100 });
    await page.focus("#MemberName", { delay: 100 });
    await page.keyboard.type(mail, { delay: 100 });
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
            const newMail = await buttonNameMail.getProperty("textContent"); // newMail='tranngoc2022@outlook.com'
            const newMailTextSplit = newMailText.split("@")[0];
            console.log("new mail: ", newMailTextSplit);
            // bấm back
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

    // frame2
    const elementHandle = await page.$("#enforcementFrame");
    const frame = await elementHandle.contentFrame();

    const createTask = await axios.post("https://api.anycaptcha.com/createTask", {
        clientKey: "0c953269633d43478dc84f6468b0378e",
        task: {
            type: "FunCaptchaTaskProxyless",
            websitePublicKey: "B7D8911C-5CC8-A9A3-35B0-554ACEE604DA",
            websiteURL: page.url(),
        },
    });
    const { taskId } = createTask.data;
    const result = await axios.post("https://api.anycaptcha.com/getTaskResult", {
        clientKey: "0c953269633d43478dc84f6468b0378e",
        taskId: taskId,
    });
    const token = result.data.solution.token;
    const submitToken = await frame.evaluate((token) => {
        var anyCaptchaToken = token;
        // var enc = document.getElementById("enforcementFrame");
        // var encWin = enc.contentWindow || enc;
        // var encDoc = enc.contentDocument || encWin.document;
        // let script = encDoc.createElement("SCRIPT");
        // script.append(
        //     'function AnyCaptchaSubmit(token) { parent.postMessage(JSON.stringify({ eventId: "challenge-complete", payload: { sessionToken: token } }), "*") }'
        // );
        // encDoc.documentElement.appendChild(script);
        // encWin.AnyCaptchaSubmit(anyCaptchaToken);
        let script = document.createElement("SCRIPT");
        script.append(
            'function AnyCaptchaSubmit(token) { parent.postMessage(JSON.stringify({ eventId: "challenge-complete", payload: { sessionToken: token } }), "*") }'
        );
        // script.append('function AnyCaptchaSubmit(token) { console.log("AnyCaptchaSubmit", token) }');
        document.documentElement.appendChild(script);
        AnyCaptchaSubmit(anyCaptchaToken);
        return "submit success";
    }, token);

    console.log(submitToken);

    await page.waitForSelector("#idSIButton9", {
        timeout: 120 * 1000,
        visible: true,
    });

    await delay(rn(1000, 1500));

    await page.click("#KmsiCheckboxField", { delay: 100 });
    await delay(rn(1000, 2000));
    await page.click("#idSIButton9", { delay: 100 });
    await page.setDefaultTimeout(30000);
    await page.waitForNavigation({
        waitUntil: "networkidle0",
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
    return;
}
module.exports = outlook;
