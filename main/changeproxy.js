require("dotenv").config();
const { gologinApi } = require("../sbridge");
const { changeProxy, checkProxy } = gologinApi;
const { oneProfile } = require("../data");
async function main() {
    await changeProxy(oneProfile.profile.profile_id, "socks5", "100014837701498.ldproxy.com", 15309);
    console.log("change proxy done");
}
main();
