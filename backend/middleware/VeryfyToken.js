const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken.logout");
require("dotenv").config();

const JWTKEY = process.env.JWTKEY;

const verifyToken = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 1️⃣ Verify JWT
    const decoded = jwt.verify(token, JWTKEY);

    // 2️⃣ Check session exists in DB
    const sessionExists = await RefreshToken.findOne({
      user: decoded._id,
      sessionId: decoded.sessionId,
    });

    if (!sessionExists) {
      return res.status(401).json({ message: "Session expired" });
    }

    // 3️⃣ Attach user
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Verify token error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyToken;
