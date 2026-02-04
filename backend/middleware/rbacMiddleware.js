const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtKey = process.env.JWTKEY;

// ✅ Extract token only from cookies
function getToken(req) {
  return req.cookies?.token || null;
}

// ✅ Verify token and role
function verifyRole(req, res, next, allowedRoles) {
  const token = getToken(req);
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, jwtKey, (err, authData) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    if (allowedRoles.includes(authData.Account)) {
      req.user = authData;
      next();
    } else {
      res.status(403).json({ message: "Forbidden: insufficient role" });
    }
  });
}

// ✅ Custom Role check for complex rules
function verifyCustom(req, res, next, roleChecks) {
  const token = getToken(req);
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, jwtKey, (err, authData) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    if (roleChecks(authData)) {
      req.user = authData;
      next();
    } else {
      res.status(403).json({ message: "Forbidden: insufficient role" });
    }
  });
}

// ✅ Role functions
function verifyAdmin(req, res, next) {
  verifyRole(req, res, next, [1]);
}

function verifyAdminHR(req, res, next) {
  verifyRole(req, res, next, [1, 2]);
}

function verifyHR(req, res, next) {
  verifyRole(req, res, next, [2]);
}

function verifyManager(req, res, next) {
  verifyRole(req, res, next, [4]);
}

function verifyAll(req, res, next) {
  verifyRole(req, res, next, [1, 2, 3, 4]);
}

function verifyHREmployee(req, res, next) {
  verifyCustom(req, res, next, (authData) => {
    if (authData.Account === 2) return true;
    if (authData.Account === 3) return authData._id === req.params.id;
    return false;
  });
}

function verifyEmployee(req, res, next) {
  verifyCustom(req, res, next, (authData) => {
    return authData.Account === 3 && authData._id === req.params.id;
  });
}

function verifyAdminHRManager(req, res, next) {
  verifyRole(req, res, next, [1, 2, 4]);
}

function verifyAdminHREmployee(req, res, next) {
  verifyCustom(req, res, next, (authData) => {
    return (
      authData.Account === 1 ||
      authData.Account === 2 ||
      (authData.Account === 3 && authData._id === req.params.id)
    );
  });
}

module.exports = {
  verifyAdmin,
  verifyAdminHR,
  verifyHR,
  verifyManager,
  verifyAll,
  verifyHREmployee,
  verifyEmployee,
  verifyAdminHRManager,
  verifyAdminHREmployee,
};
