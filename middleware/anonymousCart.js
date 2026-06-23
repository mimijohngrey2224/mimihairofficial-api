
//change to new 18 march
const { v4: uuidv4 } = require("uuid");

const handleAnonymousCart = (req, res, next) => {
  let anonymousId = req.cookies.anonymousId;

  if (!anonymousId) {
    anonymousId = uuidv4();

    res.cookie("anonymousId", anonymousId, {
      httpOnly: true,
      sameSite: "lax"
    });
  }

  req.anonymousId = anonymousId; // ✅ FIXED

  next();
};

module.exports = handleAnonymousCart;

