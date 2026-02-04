// Middleware to verify role-based access
const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.employee?.Account; // assuming Account = role number or name

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access forbidden: insufficient role" });
    }

    next();
  };
};

module.exports = verifyRoles;
