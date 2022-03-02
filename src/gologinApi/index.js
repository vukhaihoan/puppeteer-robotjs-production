// require("dotenv").config();
const { delay, axios } = require("../utils");

const instance = axios.create({
    baseURL: "https://api.gologin.com",
    headers: {
        Authorization: "Bearer " + process.env.GOLOGIN_TOKEN,
    },
});

async function checkProxy(type, host, port) {
    return await instance
        .post("/browser/check_proxy", {
            type,
            host,
            port,
        })
        .then((res) => res.data);
}

async function changeProxy(id, type, host, port) {
    return await instance
        .patch(`/browser/${id}/proxy`, {
            mode: type,
            host,
            port,
        })
        .then((res) => res.data);
}
async function main() {
    console.log(await checkProxy("socks5", "100014837701498.ldproxy.com", 17309));
    // console.log(await changeProxy("62187795c9544bcba0815034", "socks5", "100014837701498.ldproxy.com", 17309));
}
// main();
module.exports = {
    checkProxy,
    changeProxy,
};
