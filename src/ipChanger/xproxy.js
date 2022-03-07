const { axios, delay, goto } = require("../utils");
const axiosRetry = require("axios-retry");

const xproxyInstance = axios.create();
xproxyInstance.interceptors.response.use(async (response) => {
    if (!response.data.status) {
        const err = new Error("xproxy error interceptors after 5 retries : " + response.data.message);
        err.config = response.config;
        err.response = response;
        throw err;
    }
    return response;
});
axiosRetry(xproxyInstance, {
    retries: 5,
});

async function getCurrentProxyXproxy(port, type) {
    let dataReturned = null;
    try {
        const { data } = await xproxyInstance.get(
            "http://100014837701498.ldproxy.com:14211/status?proxy=100014837701498.ldproxy.com:" + port,
            {
                "axios-retry": {
                    retryDelay: (retryCount) => {
                        console.log(`getCurrentProxyXproxy ${type ? type : ""}: ${retryCount}`);
                        return retryCount * 5000; // time interval between retries
                    },
                    retryCondition: (error) => {
                        console.log("retry condition for getCurrentProxyXproxy " + type ? type : "");
                        return true;
                    },
                },
            }
        );
        dataReturned = data;
    } catch (error) {
        console.log(error);
    }
    return dataReturned;
}

async function getNewProxyXproxy(port) {
    const { data } = await xproxyInstance.get(
        "http://100014837701498.ldproxy.com:14211/reset?proxy=100014837701498.ldproxy.com:" + port,
        {
            "axios-retry": {
                retryDelay: (retryCount) => {
                    console.log(`getNewProxyXproxy get new proxyretry attempt: ${retryCount}`);
                    return retryCount * 10000; // time interval between retries
                },
                retryCondition: (error) => {
                    console.log("retry condition for getNewProxyXproxy");
                    return true;
                },
            },
        }
    );
    return data;
}
function block4v6(ipv6) {
    return ipv6.split(":")[3];
}

async function compareProxyXproxy(fullChangeCallback, port) {
    const IpBeforeChange = await getCurrentProxyXproxy(port);
    console.log("IpBeforeChange", IpBeforeChange);
    await fullChangeCallback();
    if (!IpBeforeChange) {
        return {
            message: "GET_IP_BEFORE_CHANGE_FAILED",
        };
    }
    let ipChangerCompareResult = {
        v4Changed: false,
        v6Changed: false,
        success: false,
        message: "BOTH_V4_V6",
    };
    async function callback() {
        const IpAfterChange = await getCurrentProxyXproxy(port, true);
        console.log("IpAfterChange", IpAfterChange);
        if (IpBeforeChange.public_ip != IpAfterChange.public_ip) {
            ipChangerCompareResult.v4Changed = true;
            console.log("ipv4 changed");
        } else {
            console.log("ipv4 not changed");
        }

        if (
            IpBeforeChange.public_ip_v6 != IpAfterChange.public_ip_v6 &&
            block4v6(IpBeforeChange.public_ip_v6) != block4v6(IpAfterChange.public_ip_v6)
        ) {
            ipChangerCompareResult.v6Changed = true;
            console.log("ipv6 changed");
        } else {
            console.log("ipv6 not changed");
        }
    }
    function condition() {
        if (ipChangerCompareResult.v4Changed == false || ipChangerCompareResult.v6Changed == false) {
            return true;
        }
    }
    await goto(callback, condition, {
        errmessgae: "Failed to change ip",
        retryDelayTime: 5000,
    });
    if (ipChangerCompareResult.v4Changed && ipChangerCompareResult.v6Changed) {
        ipChangerCompareResult.success = true;
    }
    return ipChangerCompareResult;
}

async function main() {
    const current = await getCurrentProxyXproxy(15309, "BEFORE");
    console.log(current);
    const status = await getNewProxyXproxy(15309);
    console.log(status);
    const newProxy = await getCurrentProxyXproxy(15309, "AFTER");
    console.log(newProxy);
}
// main();
module.exports = {
    getCurrentProxyXproxy,
    getNewProxyXproxy,
    compareProxyXproxy,
};
