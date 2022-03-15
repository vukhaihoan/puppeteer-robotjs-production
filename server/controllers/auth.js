const signUp = async (req, res, next) => {
  console.log("callec signUp function");
  next();
};
const signIn = async (req, res, next) => {
  console.log("callec signIn function");
  next();
};
const secret = async (req, res, next) => {
  console.log("callec secret function");
  next();
};

const auth = {
  signUp,
  signIn,
  secret,
};

module.exports = auth;
