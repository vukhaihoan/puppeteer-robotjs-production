// const YAML = require("yaml");
// const fs = require("fs");
// const jsonObject = require("./test.json");

// const doc = new YAML.Document();
// doc.contents = jsonObject;
// fs.writeFileSync(__dirname + "/jsontoyaml.yaml", doc.toString());
const yaml = require("js-yaml");
const fs = require("fs");
const jsonObject = require("./input.json");
const yamlDoc = yaml.dump(jsonObject);
fs.writeFileSync(__dirname + "/jsontoyaml.yaml", yamlDoc);
