require("dotenv").config();
const fs = require("fs");
const { runOutlookBridge } = require("../sbridge");
const { oneProfile } = require("../data");
async function main() {
    await runOutlookBridge(oneProfile.profile.profileId, oneProfile.user);
}
main();
