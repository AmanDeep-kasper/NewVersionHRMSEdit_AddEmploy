const express = require("express");
const {
  loginEmployee,
  refreshTokenController,
  getUserData,
  logoutEmployee,
} = require("../controllers/loginController");
const verifyToken = require("../middleware/VeryfyToken");

const loginRoute = express.Router();

loginRoute.post("/login", loginEmployee);
loginRoute.post("/refresh-token", refreshTokenController);
loginRoute.get("/me", verifyToken, getUserData);
loginRoute.post("/logout", logoutEmployee);

module.exports = loginRoute;
