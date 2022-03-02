const girl = require("./girl.json");
const girl_one_word = require("./girl_one_word.json");
const fs = require("fs");
// merge girl and gril_one_word
const girl_full = girl_one_word.concat(girl);
fs.writeFileSync("girl_full.json", JSON.stringify(girl_full));
