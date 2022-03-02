const { outlook } = require("../src/auto");
module.exports = async function (profile_id, user) {
    return await outlook(profile_id, user);
};
