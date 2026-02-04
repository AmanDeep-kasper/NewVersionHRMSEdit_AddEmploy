const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // ✅ Get token from cookies
      const token = req.cookies?.token;
      if (!token) return res.status(401).json({ message: "Unauthorized" });

      // ✅ Verify token
      const decoded = jwt.verify(token, process.env.JWTKEY);

      // ✅ Check user role
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }

      // ✅ Attach user to request
      req.user = decoded;
      next();
    } catch (err) {
      console.error("Role verification error:", err.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};

module.exports = verifyRoles;
