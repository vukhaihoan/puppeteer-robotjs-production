const data = require("../../../lib/vietnamese-namedb/uit_member.json");
const ho = require("../../../lib/vietnamese-namedb/ho.json");
const boy = require("../../../lib/vietnamese-namedb/boy.json");
const girl = require("../../../lib/vietnamese-namedb/girl_full.json");
const { rn } = require("../../utils");
function r(type) {
    return function () {
        if (type == "last_name" && rn(0, 1)) {
            return ho[~~(Math.random() * ho.length)][type];
        }
        if (type == "fist_name" && rn(0, 1)) {
            return rn(0, 1)
                ? boy[~~(Math.random() * girl.length)]["fist_name"]
                : girl[~~(Math.random() * boy.length)]["fist_name"];
        }

        return data[~~(Math.random() * data.length)][type];
    };
}

function random() {
    return random.full();
}

random.first = r("first_name");
random.last = r("last_name");
random.lastOne = r("last_name_group");
random.full = r("full_name");
function generatePassword(length) {
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}
function getRandomDate() {
    return new Date(Math.random() * new Date().getTime());
} // get random date
function getRandomDateInRange(startDate, endDate) {
    if (!startDate) startDate = new Date();
    if (!endDate) endDate = new Date();

    let diff = endDate.getTime() - startDate.getTime();
    return new Date(Math.random() * diff + startDate.getTime());
}
function randomDate() {
    let startDate = new Date(1988, 2, 2);
    let endDate = new Date(2005, 3, 3);
    return getRandomDateInRange(startDate, endDate); // random date in ran
}
function formatDate() {
    let month = randomDate().getMonth();
    let day = randomDate().getDate();
    let year = randomDate().getFullYear();
    while (month === 0 || day === 0 || year === 0) {
        month = randomDate().getMonth();
        day = randomDate().getDate();
        year = randomDate().getFullYear();
    }
    return {
        day: String(day),
        month: String(month),
        year: String(year),
    };
}
function removeAccents(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
}

module.exports = {
    rname: random,
    stringGenerate: generatePassword,
    rdate: formatDate,
    removeAccents,
};
