const { createProfileBridge } = require("../../sbridge");
const createProfile = async (req, res, next) => {
    console.log(req.body);

    next();
};

const auth = {
    createProfile,
};

module.exports = auth;
