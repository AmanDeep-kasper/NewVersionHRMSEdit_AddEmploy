const express = require("express");
const router = express.Router();
const {
  addPayrollRecord,
  addPayrollRecordsMany,
  getAllPayrollRecords,
  getPayrollRecordsByYear,
  getPayrollRecordsByMonth,
  getPayrollRecordsByEmployee,
  updateAttendanceChecked,
  updatePayrollRecordsMany,
  getPayrollRecords,
  updateBulkEmployeeAttendanceData,
  bulkUpdateEmployeeAttendance,
  updateSalaryStatus,
  getAllPayrollData,
  getAllPayrollDataAllEmp
} = require("../controllers/PayrollRecordsControllers");

const {
  verifyAdminHRManager,
  verifyAdminHR,
  verifyAll,
  verifyAdmin,
  verifyHR,
  verifyEmployee,
} = require("../middleware/rbacMiddleware");


router.post("/payroll/addPayroll", verifyAdminHRManager, addPayrollRecord);

router.post("/payroll/addPayrollRecordsMany",  addPayrollRecordsMany);

// Route to get all payroll records
router.get("/payroll", verifyAll, getAllPayrollRecords);


// Route to get payroll records by year
router.get("/payroll/:year", verifyAll, getPayrollRecordsByYear);

// Route to get payroll records by month in a specific year
router.get("/payroll/:year/:month", verifyAll, getPayrollRecordsByMonth);

// Route to get payroll records for a specific employee
router.get("/payroll/employee/:employeeId", verifyAll, getPayrollRecordsByEmployee);


router.put("/payroll/update-attendance-checked", verifyAll, updateAttendanceChecked);

router.put("/payroll/update-many", verifyAll, updatePayrollRecordsMany);

router.put("/payroll/get", verifyAll, getPayrollRecords);

router.put("/payroll/update-bulk", verifyAll, updateBulkEmployeeAttendanceData);

router.post("/payroll/updateBulkData", verifyAll, bulkUpdateEmployeeAttendance);

router.put("/update-salary-status", verifyAll, updateSalaryStatus);


router.get("/getSalarySlips/:employeeId", verifyAll, getAllPayrollData);

router.get("/getSalarySlips", verifyAll, getAllPayrollDataAllEmp);

module.exports = router;
