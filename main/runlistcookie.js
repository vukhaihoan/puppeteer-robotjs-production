require("dotenv").config();
const fs = require("fs");
const amount = 1;
let paralle = 1;
const { runCookieGoogleBridge } = require("../sbridge");
const { listProfile, listCookies, status } = require("../data");
const { delay } = require("../src/utils");
const { gologinApi } = require("../sbridge");

const currentIndex = status.cookie.currentIndex;
const lastIndex = currentIndex + amount - 1;

// run list promise in paralle

async function main() {
    if (paralle == 0) {
        throw new Error("Parallel is 0");
    }
    if (amount == 0) {
        throw new Error("Amount is 0");
    }
    let i = currentIndex;
    let total = 0;
    while (i <= lastIndex) {
        // logic
        // create arr from i to i + paralle
        let arr = [];
        for (let j = 0; j < paralle; j++) {
            if (i + j > lastIndex) {
                break;
            }
            arr.push(i + j);
        }
        const listProfileId = arr.map((item) => listProfile[item].profile.profileId);
        await Promise.all(
            listProfileId.map(async (item, index) => {
                await delay(200 * index);
                // await gologinApi.changeProxy(item, "socks5", "100014837701498.ldproxy.com", 15309);
                // await gologinApi.checkProxy("socks5", "100014837701498.ldproxy.com", 15309);
                const result = await runCookieGoogleBridge(item);
                listCookies.push(result);
            })
        ).then((result) => {
            // console.log(result);
        });

        total += paralle;
        let taskAmout = amount - total;
        i += paralle;
        if (taskAmout < paralle && taskAmout > 0 && i > currentIndex) {
            paralle = taskAmout;
        }
    }
    status.cookie.currentIndex = lastIndex + 1;
    fs.writeFileSync(__dirname + "/../data/status.json", JSON.stringify(status));
    fs.writeFileSync(__dirname + "/../data/listCookies.json", JSON.stringify(listCookies));
}
main();
