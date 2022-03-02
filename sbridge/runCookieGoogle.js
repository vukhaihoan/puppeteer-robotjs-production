const { cookieGoogle } = require("../src/auto");
module.exports = async function (profile_id) {
    return await cookieGoogle(profile_id);
};
