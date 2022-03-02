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
    wsUrl.GL = GL;
    return wsUrl;
}
module.exports = launchProfile;
