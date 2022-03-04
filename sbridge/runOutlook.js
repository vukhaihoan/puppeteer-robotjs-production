const { outlook } = require("../src/auto");
module.exports = async function (profile_id, user, gologin) {
    return await outlook(profile_id, user, gologin);
};
