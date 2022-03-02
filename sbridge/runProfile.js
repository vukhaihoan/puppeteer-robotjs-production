const { runProfileGoLogin } = require("../src/intial");
module.exports = async function (profileId) {
    return await runProfileGoLogin(profileId);
};
