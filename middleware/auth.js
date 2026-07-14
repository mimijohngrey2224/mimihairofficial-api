const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  const  authHeader = req.header("Authorization");

    // ✅ LOG 1 — check header
  console.log("AUTH HEADER:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized Access" });
  }

  try {
  const token = authHeader.split(" ")[1];
 // ✅ LOG 2 — check token
    console.log("TOKEN:", token);

    if (!token) {
      return res.status(401).json({ message: "Invalid Token Format" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

const admin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied" });
  }
  next();
};

const optional = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return next();
  }

  try {
    const token = authHeader.split(" ")[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = await User.findById(decoded.id).select("-password");
    }

    next();
  } catch (error) {
    next();
  }
};

module.exports = { auth, admin, optional };


