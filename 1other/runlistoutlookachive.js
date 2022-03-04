require("../overWrite");
require("dotenv").config();
var fs = require("fs");
var util = require("util");
const amount = 3;
const { runOutlookBridge, gologinApi, ipChanger, createProfileBridge } = require("../sbridge");
const launchProfileGologin = require("../src/intial/launchProfileGologin");
const { listProfile, listOutlook, status } = require("../data");
const { delay, goto } = require("../src/utils");

const currentIndex = status.outlook.currentIndex;
const lastIndex = currentIndex + amount - 1;

async function main() {
    if (amount == 0) {
        throw new Error("Amount is 0");
    }
    let i = currentIndex;
    while (i <= lastIndex) {
        var logFile = fs.createWriteStream(`${i}.txt`, { flags: "a" });
        // Or 'w' to truncate the file every time the process starts.
        var logStdout = process.stdout;

        console.log = function () {
            logFile.write(util.format.apply(null, arguments) + "\n");
            logStdout.write(util.format.apply(null, arguments) + "\n");
        };
        console.error = console.log;
        const result = await createProfileBridge();

        listProfile.push(result);
        await gologinApi.changeProxy(listProfile[i].profile.profile_id, "socks5", "100014837701498.ldproxy.com", 15309);
        await delay(10000);
        let proxyStatus;
        let gologin;
        async function proxyChecker() {
            const res = await gologinApi.checkProxy("socks5", "100014837701498.ldproxy.com", 15309);
            console.log("proxyStatus", res);
            proxyStatus = res.status;
        }
        async function condition() {
            let result = true;
            if (proxyStatus != "success") {
                result = false;
                console.log("proxy failed, try to re check");
            } else {
                console.log("Proxy is working");
            }
            return !result;
        }
        await goto(proxyChecker, condition, 3);
        try {
            gologin = await launchProfileGologin(listProfile[i].profile.profile_id);
            await runOutlookBridge(listProfile[i].profile.profile_id, listProfile[i].user, gologin);
        } catch (error) {
            console.log(error);
            result.error = error;
            await gologin.GL.stop();
        }

        listOutlook.push(result);
        await ipChanger.xproxy.getNewProxy(15309);
        i++;
    }
    status.outlook.currentIndex = lastIndex + 1;
    fs.writeFileSync(__dirname + "/../data/status.json", JSON.stringify(status));
    fs.writeFileSync(__dirname + "/../data/listOutlook.json", JSON.stringify(listOutlook));
    fs.writeFileSync(__dirname + "/../data/listProfile.json", JSON.stringify(listProfile));
}
main();
