const express = require("express");
const {
  // ─── Write / Mutating operations ───────────────────────────────
  createAttendance,
  createHolidays,
  updateAttendance,
  updateAttendanceStatus,
  updateBreak,

  // ─── Payroll & Processing ──────────────────────────────────────
  processPayrollForMonth,

  // ─── Read / Query operations ───────────────────────────────────
  findAttendance,
  findEmployeeAttendanceEployeeId,
  findEmployeeAttendanceId,
  todaysAttendance,
  todaysTeamAttendance,
  getTodaysAttendanceStatus,
  getTodaysAttendanceMinimal,
  getEmployeeTodayAttendance,
  attendanceRegister,
  getHolidaysByMonth,
  findAllHolidays,
  getBreakInfo,
  getBreakInfoByEmail,
  checkEarlyForEmployee,
  canClockInForEmployee,
  getWorkingHoursSummary,
  getWorkingHoursBreakdown,
  getAttendanceRaw,
  getAttendanceSummary,

  // ─── Delete ────────────────────────────────────────────────────
  deleteHoliday,
  dashboardAttendance,
  mytodaylogs,
  DashboardLogButton,
  MonthlyLogSummary,
} = require("../controllers/AttendanceController");

const {
  verifyAdminHRManager,
  verifyAdminHR,
  verifyAll,
  verifyAdmin,
  verifyHR,
  verifyEmployee,
} = require("../middleware/rbacMiddleware");

const router = express.Router();

// ────────────────────────────────────────────────────────────────
//  Attendance – Current day / Today related
// ────────────────────────────────────────────────────────────────
router.get("/dashboard-attendance", verifyAdminHRManager, dashboardAttendance);
router.get("/today/status", verifyAll, getTodaysAttendanceStatus);
router.get("/todays-attendance", verifyAdminHRManager, todaysAttendance);
router.get("/today-team", verifyAll, todaysTeamAttendance);
router.get("/monthly-Attendance-Summary", verifyAll, MonthlyLogSummary);

router.get("/mytodaylogs", verifyAll, mytodaylogs);

router.get(
  "/employee/today/:employeeId",
  verifyAll,
  getEmployeeTodayAttendance
);

router.get(
  "/employee/today-minimal/:employeeId",
  verifyAll,
  getTodaysAttendanceMinimal
);

// ────────────────────────────────────────────────────────────────
//  Attendance – History / By period / Register
// ────────────────────────────────────────────────────────────────
// router.get("/attendance", verifyAll, findAttendance);
router.get("/attendance/:year/:month", verifyAll, findAttendance); // commented in original

router.get(
  "/attendances/:employeeId",
  verifyAll,
  findEmployeeAttendanceEployeeId
);
router.get("/dashboard-log-button/:employeeId", verifyAll, DashboardLogButton);

router.get("/attendance/:id", verifyAll, findEmployeeAttendanceId);

router.get("/register/:year/:month", verifyAdminHRManager, attendanceRegister);
router.get("/summary/:year/:month", verifyAll, getAttendanceSummary); // assuming this is allowed for employees too
router.get("/raw", verifyAdminHRManager, getAttendanceRaw); // very permissive – consider restricting

// Working hours reports
router.get(
  "/working-hours-summary/:employeeId",
  verifyAll,
  getWorkingHoursSummary
);
router.get(
  "/working-hours-breakdown/:employeeId",
  verifyAll,
  getWorkingHoursBreakdown
);

// ────────────────────────────────────────────────────────────────
//  Clock-in / Clock-out related – permission to act now
// ────────────────────────────────────────────────────────────────
router.get(
  "/attendance/:employeeId/can-clock-in",
  verifyAll,
  canClockInForEmployee
);
router.post("/attendance/:attendanceId", verifyAll, createAttendance); // note: unusual – usually POST /attendance

// ────────────────────────────────────────────────────────────────
//  Break related
// ────────────────────────────────────────────────────────────────
router.post("/break/info", verifyAll, getBreakInfo);
router.post("/break/info-by-email", verifyAll, getBreakInfoByEmail);
router.post("/break/update", verifyAdminHR, updateBreak);

// Early leave / special checks (admin only mostly)
router.post(
  "/attendance/check-early/:employeeId",
  verifyAdminHR,
  checkEarlyForEmployee
);
// router.get("/attendance/check-early/:employeeId", verifyAll, checkEarlyForEmployee); // commented in original

// ────────────────────────────────────────────────────────────────
//  Status & manual updates
// ────────────────────────────────────────────────────────────────
router.post("/updateAttendance", verifyAdminHR, updateAttendance);
router.post("/update-Attendance-Status", verifyAll, updateAttendanceStatus); // very broad permission – reconsider?

// ────────────────────────────────────────────────────────────────
//  Holidays
// ────────────────────────────────────────────────────────────────
router.get("/holidays", verifyAll, findAllHolidays);
router.get("/holidays/month", verifyAll, getHolidaysByMonth);

router.post("/holidays", verifyAdminHR, createHolidays);
router.delete("/holidays/:id", verifyAdminHR, deleteHoliday);

// ────────────────────────────────────────────────────────────────
//  Payroll & final processing
// ────────────────────────────────────────────────────────────────
router.post(
  "/process-payroll/:year/:month",
  verifyAdminHRManager,
  processPayrollForMonth
);

module.exports = {
  attendanceRoute: router,
  // or just module.exports = router;  ← more common nowadays
};
