require("dotenv").config();
const { delay, goto, axios, rn } = require("../src/utils");
const {
    runOutlookBridge,
    gologinApi: { changeProxyOfProfile, checkProxyFromGologinApi, compareProxyGologin },
    ipChanger: {
        xproxy: { getCurrentProxyXproxy, getNewProxyXproxy, compareProxyXproxy },
    },
    createUserAndProfileBridge,
} = require("../sbridge");

const { oneProfile } = require("../data");
async function proxyChangerXproxy(port) {
    async function fullChangeCallback() {
        await getNewProxyXproxy(port);
        await delay(5000);
    }
    return await compareProxyXproxy(fullChangeCallback, port);
}
async function main() {
    // res = await changeProxyOfProfile("6222d155a6b626dcb00f2842", "socks5", "100014837701498.ldproxy.com", 15309);
    // await changeProxyOfProfile(oneProfile.profile.profileId, "socks5", "100014837701498.ldproxy.com", 15309);
    // console.log("change proxy done", res);
    console.log("check proxy done", await proxyChangerXproxy(15309));
}
main();
