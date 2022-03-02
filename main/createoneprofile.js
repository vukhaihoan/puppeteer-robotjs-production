require("dotenv").config();
const { createProfileBridge } = require("../sbridge");
const fs = require("fs");
async function main() {
    const result = await createProfileBridge();
    fs.writeFileSync(__dirname + "/../data/oneProfile.json", JSON.stringify(result));
}
main();
