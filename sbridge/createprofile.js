const { createProfileGoLogin, createUser } = require("../src/intial");
module.exports = async function () {
    const user = createUser();
    const profile = await createProfileGoLogin(user.password);
    return {
        user,
        profile,
    };
};
