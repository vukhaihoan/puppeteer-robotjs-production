const { axios, delay } = require("../utils");

async function getCurrentProxyXproxy(port) {
    const { data } = await axios.get(
        "http://100014837701498.ldproxy.com:14211/status?proxy=100014837701498.ldproxy.com:" + port
    );
    return data;
}
async function getNewProxyXproxy(port) {
    const { data } = await axios.get(
        "http://100014837701498.ldproxy.com:14211/reset?proxy=100014837701498.ldproxy.com:" + port
    );
    return data;
}

async function main() {
    const current = await getCurrentProxyXproxy();
    console.log(current);
    const status = await getNewProxyXproxy();
    console.log(status);
    await delay(3800);
    const newProxy = await getCurrentProxyXproxy();
    console.log(newProxy);
}
// main();
module.exports = {
    getCurrentProxyXproxy,
    getNewProxyXproxy,
};
