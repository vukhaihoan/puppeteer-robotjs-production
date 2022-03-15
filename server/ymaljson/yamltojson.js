const yaml = require("js-yaml");
const fs = require("fs");
const obj = yaml.load(fs.readFileSync(__dirname + "/input.yaml", { encoding: "utf-8" }));
fs.writeFileSync(__dirname + "/yamltojson.json", JSON.stringify(obj, null, 2));
