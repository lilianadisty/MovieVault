// function authentication(req, res, next) {
//   console.log("noni");
//   next();
// }
const { User } = require("../models");
const { verifyToken } = require("../helper/jwt");

const authentication = async (req, res, next) => {
  //   console.log(req.headers.authorization);
  //   next();

  try {
    let access_token = req.headers.authorization;
    let [bearer, token] = access_token.split(" ");

    if (bearer !== "Bearer") {
      throw { name: "Invalid Token" };
    }

    let payload = verifyToken(token);
    // console.log(payload);

    let user = await User.findByPk(payload.id);
    // console.log(user);

    if (!user) {
      throw { name: "Invalid Token" };
    }

    // console.log(bearer);
    req.user = {
      id: user.id,
    };
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthenticated" });
  }
};

module.exports = authentication;
