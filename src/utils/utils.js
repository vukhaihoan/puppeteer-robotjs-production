function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}
function rn(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
module.exports = {
    delay,
    rn,
};
