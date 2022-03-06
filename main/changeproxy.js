require("dotenv").config();
const { gologinApi } = require("../sbridge");
const { changeProxyOfProfile, checkProxy } = gologinApi;
const { oneProfile } = require("../data");
async function main() {
    res = await changeProxyOfProfile("6222d155a6b626dcb00f2842", "socks5", "100014837701498.ldproxy.com", 15309);
    // await changeProxyOfProfile(oneProfile.profile.profileId, "socks5", "100014837701498.ldproxy.com", 15309);
    console.log("change proxy done", res);
}
main();
