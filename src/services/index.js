// require("dotenv").config();
const {
    PuppeteerChromiumType: { Page },
} = require("../shared/puppeteerFunction");
const { axios, delay, goto, rn } = require("../utils/index");

async function createTask(page) {
    async function fetch() {
        const { data } = await axios.post("https://api.anycaptcha.com/createTask", {
            clientKey: process.env.ANYCAPTCHA_KEY,
            task: {
                type: "FunCaptchaTaskProxyless",
                websitePublicKey: "B7D8911C-5CC8-A9A3-35B0-554ACEE604DA",
                websiteURL: page.url(),
            },
        });
        return data;
    }
    return await goto(fetch, (data) => data.errorId > 0, { retryDelayTime: 3000 });
}

async function getTaskResult(taskId) {
    async function fetch() {
        const { data } = await axios.post("https://api.anycaptcha.com/getTaskResult", {
            clientKey: process.env.ANYCAPTCHA_KEY,
            taskId: taskId,
        });
        return data;
    }
    return await goto(fetch, (data) => data.errorId > 0 || data.status == "processing", { retryDelayTime: 2000 });
}

async function evaluateSubmitToken(page, tokenGlobal) {
    const elementHandle = await page.$("#enforcementFrame");
    const frame = await elementHandle.contentFrame();
    await frame.evaluate(() => {
        let script = document.createElement("SCRIPT");
        script.append(
            'function AnyCaptchaSubmit(token) { parent.postMessage(JSON.stringify({ eventId: "challenge-complete", payload: { sessionToken: token } }), "*") }'
        );
        document.documentElement.appendChild(script);
    });
    async function submit() {
        await frame.evaluate((token) => {
            var anyCaptchaToken = token;
            AnyCaptchaSubmit(anyCaptchaToken);
            return {
                success: true,
                msg: "Evaluate submit token success",
            };
        }, tokenGlobal);
    }
    async function condition() {
        let success = true;
        try {
            await page.waitForSelector("#idSIButton9", {
                timeout: 30 * 1000,
                visible: true,
            });
        } catch (error) {
            success = false;
            console.log("can not see next button after verify bot : TRY SUBMIT CAPTCHA AGAIN (evaluate)");
        }
        if (!success) {
            return true;
        }
        return false;
    }
    return await goto(submit, condition, { retryDelayTime: 3000 });
}

async function main() {
    const createTaskData = await createTask();
    console.log(createTaskData);
    const taskResultData = await getTaskResult(createTaskData.taskId);
    console.log(taskResultData);
    await evaluateSubmitToken(page, taskResultData.solution.token);
}
// main();

/**
 *
 * @param {Page} page
 */
async function submitAnyCaptchaToken(page) {
    try {
        const createTaskData = await createTask(page);
        console.log(createTaskData);
        const taskResultData = await getTaskResult(createTaskData.taskId);
        console.log(taskResultData);
        await evaluateSubmitToken(page, taskResultData.solution.token);
        console.log("SUBMIT ANY CAPTCHA SUCCESS");
        await delay(rn(2000, 3000));
    } catch (error) {
        console.log("SUBMIT ANY CAPTCHA FAILED");
        throw new Error(error);
    }
}

module.exports = { submitAnyCaptchaToken };
