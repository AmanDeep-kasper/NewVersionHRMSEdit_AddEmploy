const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWTKEY);
    req.user = decoded;
    next();
  } catch (err) {
    // ⛔ VERY IMPORTANT
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "ACCESS_TOKEN_EXPIRED" });
    }

    return res.status(401).json({ message: "TOKEN_INVALID" });
  }
};
