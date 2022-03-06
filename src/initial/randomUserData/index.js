const { rname, stringGenerate, rdate, removeAccents } = require("./randomHelper");
const { delay, rn } = require("../../utils");
const detaillv3 = require("../../../lib/vietnamese-namedb/details.json");

function randomUserData() {
    const first = rname.first();
    const last = rname.last();
    const lastOne = rname.lastOne();
    const fullname = `${lastOne} ${first}`;
    function realPass() {
        const symbol = ["!", "@", "#", "$", "%", "*", "?"]; // "^", "&" error
        const pass1 =
            removeAccents(rname.lastOne()) + stringGenerate(3) + rn(1, 999) + symbol[rn(0, symbol.length - 1)];
        const pass2 =
            rn(1, 9999) + removeAccents(rname.lastOne()) + +stringGenerate(4) + symbol[rn(0, symbol.length - 1)];
        const pass3 = stringGenerate(5) + removeAccents(rname.lastOne()) + rn(1, 99) + symbol[rn(0, symbol.length - 1)];
        return [pass1, pass2, pass3][rn(0, 2)];
    }
    const password = realPass();

    // random mail
    function randomMail() {
        const raFirst = removeAccents(first);
        const raLast = removeAccents(last);
        const raLastOne = removeAccents(lastOne);
        const shortmail = [raFirst, raLast];
        const longmail = [raFirst, raLastOne];
        const reverseshortmail = shortmail.reverse();
        const reverselongmail = longmail.reverse();
        const mail = [shortmail, longmail, reverseshortmail, reverselongmail];
        return mail[~~(Math.random() * mail.length)];
    }
    function formatMail() {
        const mail = randomMail();
        let mailJoin;
        switch (rn(1, 5)) {
            case 1:
                mailJoin = mail.join(".");
                break;
            case 2:
                // mailJoin = mail.join("_");
                mailJoin = mail.join(".");
                break;
            default:
                mailJoin = mail.join("");
                break;
        }
        return mailJoin.split(" ").join("");
    }
    function randomMaillLvel2() {
        const mailLevel1 = formatMail();

        const detail = [rn(10, 99), rn(0, 9), rn(100, 999), rn(1000, 9999), ""];
        const mailLevel2 = mailLevel1 + detail[rn(0, 4)];
        return mailLevel2;
    }
    function randomMaillLvel3() {
        const mail = randomMaillLvel2();
        const check = rn(0, 2);
        if (check === 0) {
            return mail + detaillv3[~~(Math.random() * detaillv3.length)];
        }
        return mail;
    }
    const born = rdate();
    const mailHard = randomMaillLvel3().toLowerCase();
    const mailNormal = `${removeAccents(first)}${removeAccents(lastOne)}${rn(1, 1000)}${stringGenerate(
        3
    )}`.toLowerCase();
    const fullResult = {
        mail: {
            Normal: mailNormal,
            Hard: mailHard,
        },
        password,
        // lastOne: removeAccents(lastOne),
        // last: removeAccents(last),
        // first: removeAccents(first),
        // fullname: removeAccents(fullname),
        lastOne: lastOne,
        last: last,
        first: first,
        fullname: fullname,
        born,
    };
    // console.log(fullResult);
    return fullResult;
}
// randomUserData();
module.exports = randomUserData;
