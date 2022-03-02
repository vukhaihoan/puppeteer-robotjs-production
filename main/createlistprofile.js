require("dotenv").config();
var amount = 1;
const { createProfileBridge } = require("../sbridge");
const { listProfile } = require("../data");
const fs = require("fs");
async function main() {
    // run createProfileBridge() 10 times
    for (let i = 0; i < amount; i++) {
        const result = await createProfileBridge();
        listProfile.push(result);
    }
    fs.writeFileSync(__dirname + "/../data/listProfile.json", JSON.stringify(listProfile));
}
main();
