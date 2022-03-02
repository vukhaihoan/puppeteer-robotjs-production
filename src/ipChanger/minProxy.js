require("dotenv").config();
const { axios, delay } = require("../utils");
async function getStatusProxy() {
    const { data } = await axios.get(
        `https://dash.minproxy.vn/api/rotating/v1/proxy_v4/get-status?api_key=${process.env.MINPROXY_TOKEN}`
    );
    return data;
}
async function getCurrentProxy() {
    const { data } = await axios.get(
        `https://dash.minproxy.vn/api/rotating/v1/proxy_v4/get-current-proxy?api_key=${process.env.MINPROXY_TOKEN}`
    );
    return data;
}
async function getNewProxy() {
    const { data } = await axios.get(
        `https://dash.minproxy.vn/api/rotating/v1/proxy_v4/get-new-proxy?api_key=${process.env.MINPROXY_TOKEN}`
    );
    return data;
}

async function minProxy() {
    const current = await getCurrentProxy();
    console.log(current);
    const { http_proxy_ipv4, sock_proxy_ipv4, http_proxy_ipv6, sock_proxy_ipv6 } = current.data;
    const proxies = [http_proxy_ipv4, sock_proxy_ipv4, http_proxy_ipv6, sock_proxy_ipv6];
}
minProxy();
module.exports = minProxy;
