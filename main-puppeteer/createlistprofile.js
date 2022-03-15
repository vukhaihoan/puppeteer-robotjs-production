require("dotenv").config();
var amount = 1;
const { createUserAndProfileBridge } = require("../sbridge");
const { listProfile } = require("../data");
const fs = require("fs");
async function main() {
    // run createUserAndProfileBridge() 10 times
    for (let i = 0; i < amount; i++) {
        const result = await createUserAndProfileBridge();
        listProfile.push(result);
    }
    fs.writeFileSync(__dirname + "/../data/listProfile.json", JSON.stringify(listProfile));
}
main();
