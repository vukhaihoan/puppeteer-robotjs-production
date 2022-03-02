require("dotenv").config();
const { runProfileBridge } = require("../sbridge");
const { oneProfile } = require("../data");
async function main() {
    const res = await runProfileBridge(oneProfile.profile.profile_id);
    console.log(res);
}
main();
