const express = require("express");
const {
  getShifts,
  createShift,
  updateShift,
  deleteShift,
  getShiftById,
  getShiftTotals,
} = require("../controllers/shiftController");


const {
  verifyAdminHRManager,
  verifyAdminHR,
  verifyAll,
  verifyAdmin,
  verifyHR,
  verifyEmployee,
} = require("../middleware/rbacMiddleware");
const router = express.Router();

// Protect routes with verifyAll middleware
// IMPORTANT: register the totals route BEFORE the /shifts/:id route so the literal "totals"
// does not get interpreted as a dynamic :id and cause CastError when treated as an ObjectId.
// Get aggregated totals by shift for a period (query: period=today|week|month|year|custom&startDate=&endDate=)
router.get("/shifts/totals", verifyAll, getShiftTotals);

router
  .route("/shifts")
  .get(verifyAdminHR, getShifts)
  .post(verifyAdminHR, createShift);

router
  .route("/shifts/:id")
  .put(verifyAdminHR, updateShift)
  .delete(verifyAdminHR, deleteShift);

router.post("/shifts/getById", verifyAdminHR, getShiftById);

// Route to get shift details by ID
router.get("/shifts/:id", verifyAll, getShiftById);

module.exports = router;
