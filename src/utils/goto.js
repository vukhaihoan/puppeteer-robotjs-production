const { delay } = require("./utils");

function isPromise(promise) {
    return !!promise && typeof promise.then === "function";
}

async function goto(callback, condition, { retryAmount = 5, retryDelayTime = 2000, errmessgae, retryMessage }) {
    // console.log(condition);
    function retryDelay(retryCount) {
        console.log(`${retryMessage || "retry find image"} attempt : ${retryCount}`);
        return retryCount * retryDelayTime; // time interval between retries
    }
    var i = 0;
    var check = false;
    start: while (true) {
        if (i > 0) {
            await delay(retryDelay(i));
        }
        await callback();
        const conditionResult = await condition();
        i++;
        if (i < retryAmount && conditionResult) continue start;
        if (i == retryAmount) {
            check = true;
        }
        break;
    }
    if (check) {
        throw new Error((errmessgae || `Failed to submit captcha `) + `after ${retryAmount} attempts`);
    }
}
// let status = false;
// goto(function () {
//     console.log("Hello, world!");
// }, !status);

module.exports = goto;
