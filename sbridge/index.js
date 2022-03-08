const { createProfileGoLogin, createUser } = require("../src/initial");
const { cookieGoogle, outlook, facebook } = require("../src/auto");
const { runProfileGoLogin } = require("../src/initial");
const ipChanger = require("../src/ipChanger");
const gologinApi = require("../src/gologinApi");
const initial = require("../src/initial");

async function createUserAndProfile() {
  const user = createUser();
  const profile = await createProfileGoLogin(user.password);
  return {
    user,
    profile,
  };
}

module.exports = {
  createUserAndProfileBridge: createUserAndProfile,
  runCookieGoogleBridge: cookieGoogle,
  runProfileBridge: runProfileGoLogin,
  runOutlookBridge: outlook,
  runFacebookBridge: facebook,
  ipChanger,
  gologinApi,
  initial,
};
