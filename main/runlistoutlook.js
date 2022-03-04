require("../overWrite");
require("dotenv").config();
const amount = 1;
var fs = require("fs");
var util = require("util");
const {
    runOutlookBridge,
    gologinApi: { changeProxyOfProfile, checkProxyFromGologinApi },
    ipChanger: {
        helper: { checkIp, compareIp },
        xproxy: { getCurrentProxyXproxy, getNewProxyXproxy },
    },
    createProfileBridge,
    initial: { launchProfileGologin },
} = require("../sbridge");
const { listProfile, listOutlook, status } = require("../data");
const { delay, goto, axios, rn } = require("../src/utils");
function consoleToLog(i) {
    let logFile = fs.createWriteStream(__dirname + `/../logs/${i}.txt`, { flags: "a" }); // Or 'w' to truncate the file every time the process starts.
    let logStdout = process.stdout;
    console.log = function () {
        logFile.write(util.format.apply(null, arguments) + "\n");
        logStdout.write(util.format.apply(null, arguments) + "\n");
    };
    console.error = console.log;
}
async function createUserAndProfile() {
    const userAndProfile = await createProfileBridge();
    listProfile.push(userAndProfile);
    fs.writeFileSync(__dirname + "/../data/listProfile.json", JSON.stringify(listProfile));
    return userAndProfile;
}
async function proxyChanger() {
    function fullchangeCallback() {}
    await compareIp();
}

async function main() {
    if (amount == 0) {
        throw new Error("Amount is 0");
    }
    let i = 0;
    while (i < amount) {
        // consoleToLog(i);
        // const { user, profile } = await createUserAndProfile();
        await proxyChanger();

        i++;
    }
}
main();
