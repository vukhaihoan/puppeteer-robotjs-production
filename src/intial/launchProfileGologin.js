// const puppeteer = require("puppeteer-core");
const GoLogin = require("gologin-launch");

async function launchProfile(profileId) {
    const GL = new GoLogin({
        token: process.env.GOLOGIN_TOKEN,
        profile_id: profileId,
        // uploadCookiesToServer: true,
    });
    const { status, wsUrl } = await GL.start().catch((e) => {
        console.trace(e);
        return { status: "failure" };
    });

    if (status !== "success") {
        console.log("Invalid status");
        return;
    }

    // const { ORBITA_BROWSER, params, env } = wsUrl;

    // const browser = await puppeteer.launch({
    //     headless: false,
    //     executablePath: ORBITA_BROWSER,
    //     args: params,
    // });
    // const page = await browser.newPage();
    // await page.goto("https://www.facebook.com/");
    // console.log(await page.content());
    // await page.screenshot({ path: "example.png" });
    // await browser.close();
    // await GL.stop();
    wsUrl.GL = GL;
    // console.log("wsUrl", wsUrl);
    return wsUrl;
}
module.exports = launchProfile;
