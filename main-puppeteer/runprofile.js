require("dotenv").config();
const { runProfileBridge } = require("../sbridge");
const { oneProfile } = require("../data");
async function main() {
    const res = await runProfileBridge(oneProfile.profile.profileId);
    console.log(res);
}
main();
