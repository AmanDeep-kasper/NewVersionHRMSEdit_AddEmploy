const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const verifyRoles = require("../middleware/verifyRoles");
const {
  getAdminDashboard,
  getHRDashboard,
  getManagerDashboard,
  getEmployeeDashboard,
} = require("../controllers/dashboardController");

const dashboardRoute = express.Router();

// ✅ Protected routes
dashboardRoute.get("/admin", verifyToken, verifyRoles("admin"), getAdminDashboard);
dashboardRoute.get("/hr", verifyToken, verifyRoles("HR"), getHRDashboard);
dashboardRoute.get("/manager", verifyToken, verifyRoles("manager"), getManagerDashboard);
dashboardRoute.get("/employee", verifyToken, verifyRoles("employee"), getEmployeeDashboard);

module.exports = dashboardRoute;
