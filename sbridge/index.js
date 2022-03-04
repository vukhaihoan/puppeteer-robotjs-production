const createProfileBridge = require("./createprofile");
const runcookieGoogleBridge = require("./runCookieGoogle");
const runProfileBridge = require("./runProfile");
const ipChanger = require("./changeIp");
const gologinApi = require("./gologinApi");
const runOutlookBridge = require("./runOutlook");
const initial = require("./intial");
module.exports = {
    createProfileBridge,
    runcookieGoogleBridge,
    runOutlookBridge,
    runProfileBridge,
    ipChanger,
    gologinApi,
    initial,
};
