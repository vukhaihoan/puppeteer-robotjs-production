// const puppeteer = require("puppeteer-core");
const GoLogin = require("gologin");

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const createProfileGologin = async (profileName) => {
    const GL = new GoLogin({
        token: process.env.GOLOGIN_TOKEN,
    });

    // next parameters are required for creating

    const profile_id = await GL.create({
        os: "win",
        name: profileName || "DefaultName",
        startUrl: "https://www.google.com/",
    });

    console.log("profile id=", profile_id);

    // update profile
    // await GL.update({
    //     id: profile_id,
    // });

    const profile = await GL.getProfile(profile_id);

    console.log("new profile name=", profile.name);

    //await GL.delete(profile_id);
    return {
        profile_id,
        profileName,
    };
};
module.exports = createProfileGologin;
