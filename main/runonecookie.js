require("dotenv").config();
const fs = require("fs");
const { runcookieGoogleBridge } = require("../sbridge");
const { oneProfile } = require("../data");
async function main() {
    await runcookieGoogleBridge(oneProfile.profile.profileId);
}
main();
