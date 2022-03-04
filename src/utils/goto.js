const { delay } = require("./utils");

function isPromise(promise) {
    return !!promise && typeof promise.then === "function";
}

function retryDelay(retryCount) {
    console.log(`retry find image attempt: ${retryCount}`);
    return retryCount * 2000; // time interval between retries
}

async function goto(callback, condition, retryAmount = 5) {
    // console.log(condition);
    var i = 0;
    var check = false;
    start: while (true) {
        await callback();
        const conditionResult = await condition();
        if (i > 0) {
            await delay(retryDelay(i));
        }
        i++;
        if (i < retryAmount && conditionResult) continue start;
        if (i == retryAmount) {
            check = true;
        }
        break;
    }
    if (check) {
        throw new Error(`Failed to submit captcha after ${retryAmount} attempts`);
    }
}
// let status = false;
// goto(function () {
//     console.log("Hello, world!");
// }, !status);

module.exports = goto;
