const express = require("express");
const employeeRoute = express.Router();
const {
  getAllEmployee,
  createEmployee,
  updateEmployee,
  findParticularEmployee,
  selectedDeleteNotification,
  deleteNotification,
  notificationStatusUpdate,
  multiSelectedDeleteNotification,
  employeeLoginStatusUpdate,
  getAllEmployeeByStatus,
  employeeLogoutStatusUpdate,
  EmployeeTeam,
  employeeByDepartment,
  deleteEmployee,
  verifyAccount,
  userData,
  getEmployeeByStatus,
  getAllEmployeeID,
  updateEmployeeShift,
  getUpcomingScheduledShifts,
  getAllEmployeesShiftHistory,
  EmployeeAllForAdmin,
  getMobileLoginStatusByEmpId,
  getFnFEmployee,
  getBirthdayBoardEmployees,
  getAllEmployeeBasic,
  findParticularEmployeeNavbar,
  employeeByDepartmentLight,
  employeesByDepartmentDetail,
  getAllEmployeeTable,
  exportAllEmployees,
  getEmployeeById,
  getEmployeeByIdEditForm,
} = require("../controllers/employeeController");
const { fileUploadMiddleware, checkFileSize } = require("../middleware/multer");
const {
  verifyAdminHRManager,
  verifyAdminHR,
  verifyAdminHREmployee,
  verifyAll,
} = require("../middleware/rbacMiddleware");
// GET: Retrieve all countries
employeeRoute.get("/employee/", verifyAll, getAllEmployee);
employeeRoute.get("/employeeTable/", verifyAll, getAllEmployeeTable);
employeeRoute.get("/employee/export", verifyAll, exportAllEmployees);
employeeRoute.get(
  "/empNavParticulars",
  verifyAll,
  findParticularEmployeeNavbar
);
employeeRoute.get("/employeeBasic/", verifyAll, getAllEmployeeBasic);
employeeRoute.get("/employeeFNF/", verifyAdminHRManager, getFnFEmployee);
employeeRoute.post("/verifyAccount", verifyAll, verifyAccount);
employeeRoute.get("/employee/:id?", verifyAll, getAllEmployee);
employeeRoute.get("/particularEmployee/:id", verifyAll, findParticularEmployee);
employeeRoute.get("/userData/:id", verifyAll, userData);
employeeRoute.post(
  "/notificationStatusUpdate/:id",
  verifyAll,
  notificationStatusUpdate
);
employeeRoute.post("/managersList", verifyAll, getEmployeeByStatus);
employeeRoute.post("/managersMailsList", verifyAll, getAllEmployeeByStatus);
employeeRoute.post("/employeeTeam", verifyAll, EmployeeTeam);
employeeRoute.post("/EmployeeAllForAdmin", verifyAll, EmployeeAllForAdmin);
employeeRoute.get("/employeeByDepartment", verifyAll, employeeByDepartment);
employeeRoute.get("/team-board", verifyAll, employeeByDepartmentLight);

employeeRoute.get(
  "/department/:departmentName",
  verifyAll,
  employeesByDepartmentDetail
);

employeeRoute.get("/employeeDetails", verifyAll, getAllEmployeeID);

employeeRoute.post(
  "/notificationDeleteHandler/:id",
  verifyAll,
  deleteNotification
);
employeeRoute.patch(
  "/employeeLoginStatusUpdate",
  verifyAll,
  employeeLoginStatusUpdate
);
employeeRoute.patch(
  "/employeeLogoutStatusUpdate",
  verifyAll,
  employeeLogoutStatusUpdate
);

employeeRoute.post(
  "/multiSelectedNotificationDelete",
  verifyAll,
  multiSelectedDeleteNotification
);
employeeRoute.post(
  "/selectedNotificationDelete",
  verifyAll,
  selectedDeleteNotification
);

employeeRoute.post(
  "/employee",
  verifyAdminHR, // only Admin (1) and HR (2) can create employees
  fileUploadMiddleware,
  checkFileSize,
  createEmployee
);

// PUT: Update an existing employee
employeeRoute.put(
  "/employee/:id",
  verifyAll,
  fileUploadMiddleware,
  checkFileSize,
  updateEmployee
);
employeeRoute.put(
  "/employeebyId/:id",
  verifyAll,
  fileUploadMiddleware,
  checkFileSize,
  getEmployeeById,
);
employeeRoute.put(
  "/employeeIdEditForm/:id",
  verifyAll,
  fileUploadMiddleware,
  checkFileSize,
  getEmployeeByIdEditForm,
);
employeeRoute.put("/employees/update-shift", verifyAll, updateEmployeeShift);
employeeRoute.get(
  "/employees/scheduled-shifts",
  verifyAll,
  getUpcomingScheduledShifts
);
employeeRoute.get(
  "/employees/shift-history",
  verifyAll,
  getAllEmployeesShiftHistory
);
employeeRoute.get("/birthday-board", verifyAll, getBirthdayBoardEmployees);

//Get if mobile access is allowed or not
employeeRoute.get(
  "/employee/:id/mobile-login-status",
  verifyAll,
  getMobileLoginStatusByEmpId
);

module.exports = employeeRoute;
