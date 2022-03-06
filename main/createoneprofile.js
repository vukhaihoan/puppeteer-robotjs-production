require("dotenv").config();
const { createUserAndProfileBridge } = require("../sbridge");
const fs = require("fs");
async function main() {
    const result = await createUserAndProfileBridge();
    fs.writeFileSync(__dirname + "/../data/oneProfile.json", JSON.stringify(result));
}
main();
