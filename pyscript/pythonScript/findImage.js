const util = require("util");
const exec = util.promisify(require("child_process").exec);
const path = require("path");
async function findMultiple(smallImgLocation, bigImgLocation) {
    const response = await exec(
        `python ${path.join(__dirname, "/findmultiple.py")} "${smallImgLocation}" "${bigImgLocation}"`
    );
    const { stdout, stderr } = response;
    const result = stdout.split("\r\n").join(" ").split(" ");
    const length = result.length;
    const arr = [];
    let obj = {};
    result.forEach((value, index) => {
        if (index === length - 1) {
            return false;
        }
        if (index % 2 === 0) {
            obj.x = Number(value);
        }
        if (index % 2 === 1) {
            obj.y = Number(value);
            arr.push(obj);
            obj = {};
        }
    });
    // console.log(arr);
    return arr;
}
async function findOne(smallImgLocation, bigImgLocation) {
    const response = await exec(
        `python ${path.join(__dirname, "/findone.py")}  "${smallImgLocation}" "${bigImgLocation}"`
    );
    const { stdout, stderr } = response;
    const result = stdout.split("\r\n").join("").split(" ");
    const x = Number(result[0]);
    const y = Number(result[1]);
    const arr = [{ x, y }];
    // console.log(arr);
    return arr;
}
async function findCorner(smallImgLocation, bigImgLocation) {
    const response = await exec(
        `python ${path.join(__dirname, "/findone.py")}  "${smallImgLocation}" "${bigImgLocation}"`
    );
    const { stdout, stderr } = response;
    const result = stdout.split("\r\n").join("").split(" ");
    const x = Number(result[0]);
    const y = Number(result[1]);
    const arr = [{ x, y }];
    // console.log(arr);
    return arr;
}
module.exports = {
    findMultiple,
    findOne,
    findCorner,
};
