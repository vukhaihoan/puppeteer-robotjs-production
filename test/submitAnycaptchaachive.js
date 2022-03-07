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
