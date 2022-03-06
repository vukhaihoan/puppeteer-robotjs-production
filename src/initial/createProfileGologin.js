// const puppeteer = require("puppeteer-core");
const GoLogin = require("gologin");

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const createProfileGologin = async (profileName) => {
    const GL = new GoLogin({
        token: process.env.GOLOGIN_TOKEN,
    });

    // next parameters are required for creating

    const profileId = await GL.create({
        os: "win",
        name: profileName || "DefaultName",
        startUrl: "https://www.google.com/",
    });

    console.log("profile id=", profileId);

    // update profile
    // await GL.update({
    //     id: profileId,
    // });

    const profile = await GL.getProfile(profileId);

    console.log("new profile name=", profile.name);

    //await GL.delete(profileId);
    return {
        profileId,
        profileName,
    };
};
module.exports = createProfileGologin;
