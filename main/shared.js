var fs = require("fs");
var util = require("util");
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
  fs.writeFileSync(
    __dirname + "/../data/listProfile.json",
    JSON.stringify(listProfile)
  );
  return userAndProfile;
}
module.exports = {
  consoleToLog,
  createUserAndProfileFs,
};
