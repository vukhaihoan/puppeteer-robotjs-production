// require("dotenv").config();
const { delay, axios } = require("../utils");

const instance = axios.create({
    baseURL: "https://api.gologin.com",
    headers: {
        Authorization: "Bearer " + process.env.GOLOGIN_TOKEN,
    },
});

async function checkProxyFromGologinApi(type, host, port) {
    return await instance
        .post("/browser/check_proxy", {
            type,
            host,
            port,
        })
        .then((res) => res.data);
}

async function changeProxyOfProfile(id, type, host, port) {
    return await instance
        .patch(`/browser/${id}/proxy`, {
            mode: type,
            host,
            port,
        })
        .then((res) => res.data);
}
async function main() {
    console.log(await checkProxyFromGologinApi("socks5", "100014837701498.ldproxy.com", 17309));
    // console.log(await changeProxyOfProfile("62187795c9544bcba0815034", "socks5", "100014837701498.ldproxy.com", 17309));
}
// main();
module.exports = {
    checkProxyFromGologinApi,
    changeProxyOfProfile,
};
