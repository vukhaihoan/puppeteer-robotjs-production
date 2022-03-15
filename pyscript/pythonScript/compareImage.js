const util = require("util");
const exec = util.promisify(require("child_process").exec);
const path = require("path");
async function compare(templateLocation, cropLocation) {
    const response = await exec(
        `python ${path.join(__dirname, "/compare.py")} "${templateLocation}" "${cropLocation}"`
    );
    const { stdout, stderr } = response;
    // console.log(response);
    const status = stdout.split("\r\n")[0];
    return Number(status);
}
module.exports = compare;
