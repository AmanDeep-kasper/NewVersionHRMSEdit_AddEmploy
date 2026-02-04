const jwt = require("jsonwebtoken");
// const jwtKey = 'your-secret-key'; // Replace with your actual secret key
require("dotenv").config();

const isAuthenticatedUser = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.sendStatus(403);

  jwt.verify(token, process.env.jwtKey, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded;
    next();
  });
};

module.exports = isAuthenticatedUser;
