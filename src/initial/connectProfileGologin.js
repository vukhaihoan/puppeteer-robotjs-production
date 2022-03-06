const GoLogin = require("gologin");
async function runProfile(profileId) {
    const GL = new GoLogin({
        token: process.env.GOLOGIN_TOKEN,
        profileId: profileId,
        uploadCookiesToServer: true,
    });

    const { status, wsUrl } = await GL.start().catch((e) => {
        console.trace(e);
        return { status: "failure" };
    });

    if (status !== "success") {
        console.log("Invalid status");
        return;
    }
    console.log("Successfully running profile");
    // const browser = await puppeteer.connect({
    //     browserWSEndpoint: wsUrl.toString(),
    //     ignoreHTTPSErrors: true,
    //     defaultViewport: null,
    // });
    // console.log("connected");
    const result = {
        status,
        wsUrl: wsUrl.toString(),
        GL,
    };
    return result;
}
module.exports = runProfile;
