require("dotenv").config();
const fs = require("fs");
const { runCookieGoogleBridge } = require("../sbridge");
const { oneProfile } = require("../data");
async function main() {
    await runCookieGoogleBridge(oneProfile.profile.profileId);
}
main();
