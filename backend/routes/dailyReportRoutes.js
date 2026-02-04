const express = require("express");
const router = express.Router();
const dailyReportController = require("../controllers/dailyReportController");
const {verifyAdminHRManager,verifyAdmin,verifyAll} = require('../middleware/rbacMiddleware');

// CRUD routes
router.post("/dailyReports/", verifyAll,dailyReportController.createReport);
router.get("/dailyReports/",verifyAll, dailyReportController.getAllReports);
router.get("/dailyReports/:id", verifyAll,dailyReportController.getReportById);
router.put("/dailyReports/:id",verifyAll, dailyReportController.updateReport);
router.delete("/dailyReports/:id",verifyAll, dailyReportController.deleteReport);

module.exports = router;
