var fs = require("fs");
var util = require("util");
const {
  runOutlookBridge,
  gologinApi: { changeProxyOfProfile, checkProxyFromGologinApi, compareProxyGologin, proxyChangerGoLogin },
  ipChanger: {
    xproxy: { getCurrentProxyXproxy, getNewProxyXproxy, compareProxyXproxy, proxyChangerXproxy },
  },
  createUserAndProfileBridge,
} = require("../sbridge");
const { listProfile, listOutlook, status } = require("../data");
const { delay, goto, axios, rn } = require("../src/utils");
function consoleToLog(i) {
  let logFile = fs.createWriteStream(__dirname + `/../logs/${i}.txt`, {
    flags: "a",
  }); // Or 'w' to truncate the file every time the process starts.
  let logStdout = process.stdout;
  console.log = function () {
    logFile.write(util.format.apply(null, arguments) + "\n");
    if (process.env.MODE == "DEVELOPMENT") {
      logStdout.write(util.format.apply(null, arguments) + "\n");
    }
  };
  console.error = console.log;
}
async function createUserAndProfileFs() {
  const userAndProfile = await createUserAndProfileBridge();
  listProfile.push(userAndProfile);
  fs.writeFileSync(__dirname + "/../data/listProfile.json", JSON.stringify(listProfile));
  return userAndProfile;
}
module.exports = {
  consoleToLog,
  createUserAndProfileFs,
};
