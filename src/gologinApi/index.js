// require("dotenv").config();
const { delay, axios } = require("../utils");
const axiosRetry = require("axios-retry");
const isIp = require("is-ip");

const instance = axios.create({
    baseURL: "https://api.gologin.com",
    headers: {
        Authorization: "Bearer " + process.env.GOLOGIN_TOKEN,
    },
});
instance.interceptors.response.use(async (response) => {
    if (response.data.status != "success") {
        const err = new Error("gologin error interceptors after 5 retries ");
        err.config = response.config; // axios-retry using this
        err.response = response; // optional, if you need for retry condition
        throw err;
    }
    return response;
});
axiosRetry(instance);

async function checkProxyFromGologinApi(type, host, port) {
    return await instance
        .post(
            "/browser/check_proxy",
            {
                type,
                host,
                port,
            },
            {
                "axios-retry": {
                    retryCondition: (error) => {
                        console.log("retryCondition for checkProxyFromGologinApi");
                        return true;
                    },
                    retries: 5,
                    retryDelay: (retryCount) => {
                        console.log(`checkProxyFromGologinApiretry attempt: ${retryCount}`);
                        return retryCount * 5000; // time interval between retries
                    },
                },
            }
        )
        .then((res) => {
            console.log(res.status);
            return res.data;
        });
    // .catch((err) => {
    //     console.log(err.message);
    // });
}

async function changeProxyOfProfile(id, type, host, port) {
    return await axios
        .patch(
            `https://api.gologin.com/browser/${id}/proxy`,
            {
                mode: type,
                host,
                port,
            },
            {
                headers: {
                    Authorization: "Bearer " + process.env.GOLOGIN_TOKEN,
                },
            }
        )
        .then((res) => {
            // console.log(res);
            return res.status;
        })
        .catch((err) => {
            console.log(err);
        });
}

function block4v6(ipv6) {
    return ipv6.split(":")[3];
}

async function compareProxyGologin(fullchangeCallback, type, host, port) {
    let { origin: ipBeforeChange } = await checkProxyFromGologinApi(type, host, port);
    console.log(ipBeforeChange);
    await fullchangeCallback();
    let { origin: ipAfterChange } = await checkProxyFromGologinApi(type, host, port);
    console.log(ipAfterChange);
    let changeResult = {
        success: false,
        message: "NO_CHANGE",
    };
    if (isIp.v4(ipAfterChange)) {
        if (ipBeforeChange != ipAfterChange) {
            changeResult.success = true;
            changeResult.message = "CHANGE_V4";
            console.log("ipv4 changed");
        } else {
            console.log("ipv4 not changed");
        }
    }
    if (isIp.v6(ipAfterChange)) {
        if (ipBeforeChange != ipAfterChange && block4v6(ipBeforeChange) != block4v6(ipAfterChange)) {
            changeResult.v6Changed = true;
            changeResult.message = "CHANGE_V6";
            console.log("ipv6 changed");
        } else {
            console.log("ipv6 not changed");
        }
    }
    return changeResult;
}

async function main() {
    // console.log(await checkProxyFromGologinApi("socks5", "100014837701498.ldproxy.com", 17309));
    // console.log(await changeProxyOfProfile("62187795c9544bcba0815034", "socks5", "100014837701498.ldproxy.com", 17309));
    // await compareProxyGologin("62187795c9544bcba0815034", "socks5", "100014837701498.ldproxy.com", 17309);
}
// main();
module.exports = {
    checkProxyFromGologinApi,
    changeProxyOfProfile,
    compareProxyGologin,
};
