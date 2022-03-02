const { outlook } = require("../src/auto");
module.exports = async function (profile_id) {
    return await outlook(profile_id);
};
