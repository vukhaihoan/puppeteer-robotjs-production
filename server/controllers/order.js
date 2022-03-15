const order = async (req, res, next) => {
  console.log("callec order function");
  next();
};

module.exports = { order };
