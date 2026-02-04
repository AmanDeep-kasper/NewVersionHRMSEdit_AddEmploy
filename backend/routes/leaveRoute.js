const express = require("express");
const leaveRoute = express.Router();

const {
  verifyAdminHRManager,
  verifyHREmployee,
  verifyEmployee,
  verifyAll,
  verifyAdminHR
} = require("../middleware/rbacMiddleware");

const {
  getAllLeaveApplication,
  createLeaveApplication,
  updateLeaveApplication,
  deleteLeaveApplication,
  updateLeaveApplicationHr,
  getAllLeaveApplicationHr,
  deleteLeaveApplicationHr,
  getLeaveApplicationNo,
  getLeaveApplicationsByMonthYear,
  getAllLeaves,
  getMyLeaves,
  getAllLeaveApplicationHrDash,
} = require("../controllers/leaveController");

leaveRoute.get("/getmyLeave", verifyAll, getMyLeaves);


// GET: Retrieve all leave
leaveRoute.get(
  "/leave-application-emp/:id?",
  verifyAll,
  getAllLeaveApplication
);

leaveRoute.get("/leaves/:employeeId?",  getAllLeaves);

leaveRoute.get(
  "/leave-application-man/:id?",
  verifyAll,
  getAllLeaveApplication
);

leaveRoute.get(
  "/leave-application-by-month-year",
  verifyAll,
  getLeaveApplicationsByMonthYear
);

leaveRoute.post(
  "/leave-application-hr",
  verifyAdminHRManager,
  getAllLeaveApplicationHr
);

leaveRoute.get(
  "/leave-application-hr/dashboard",
  verifyAdminHRManager,
  getAllLeaveApplicationHrDash,
);

leaveRoute.post(
  "/leave-application-data",
  verifyAdminHRManager,
  getLeaveApplicationNo
);

// POST: Create a new leave
leaveRoute.post("/leave-application-emp/:id?", verifyAll,createLeaveApplication);
leaveRoute.post(
  "/leave-application-man/:id?",
  verifyAll,
  createLeaveApplication
);

// PUT: Update an existing leave
leaveRoute.put(
  "/leave-application-emp/:id?",
  verifyHREmployee,
  updateLeaveApplication
);


leaveRoute.put(
  "/leave-application-hr/:id",
  verifyAdminHRManager,
  updateLeaveApplicationHr
);

// DELETE: Delete a leave
leaveRoute.delete(
  "/leave-application-emp/:id/:id2",
    verifyAdminHR,
  deleteLeaveApplication
);

leaveRoute.delete(
  "/leave-application-hr/:id/:id2",
  verifyAdminHR,
  deleteLeaveApplicationHr
);
module.exports = leaveRoute;
