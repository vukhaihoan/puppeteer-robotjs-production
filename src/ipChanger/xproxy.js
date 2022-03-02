const { axios, delay } = require("../utils");

async function getCurrentProxy() {
    const { data } = await axios.get(
        "http://100014837701498.ldproxy.com:14211/status?proxy=100014837701498.ldproxy.com:14309"
    );
    return data;
}
async function getNewProxy() {
    const { data } = await axios.get(
        "http://100014837701498.ldproxy.com:14211/reset?proxy=100014837701498.ldproxy.com:14309"
    );
    return data;
}

async function xProxy() {
    const current = await getCurrentProxy();
    console.log(current);
    const status = await getNewProxy();
    console.log(status);
    await delay(3800);
    const newProxy = await getCurrentProxy();
    console.log(newProxy);
}
xProxy();
module.exports = xProxy;
