const express = require("express");
const router = express.Router();
const marketingReportController = require("../controllers/marketingReportController");
const { verifyAll } = require("../middleware/rbacMiddleware");

router.post(
  "/marketingReports",
  verifyAll,
  marketingReportController.createMarketingReport
);
router.get(
  "/marketingReports",
  verifyAll,
  marketingReportController.getAllMarketingReports
);
router.get(
  "/marketingReports/:id",
  verifyAll,
  marketingReportController.getMarketingReportById
);
router.put(
  "/marketingReports/:id",
  verifyAll,
  marketingReportController.updateMarketingReportById
);
router.delete(
  "/marketingReports/:id",
  verifyAll,
  marketingReportController.deleteMarketingReportById
);

router.post(
  "/marketingReports/Bulk",
  verifyAll,
  marketingReportController.bulkCreateMarketingReports
);
router.post(
  "/marketingReports/uploadMany",
  verifyAll.apply,
  marketingReportController.uploadMarketingReport
);

module.exports = router;
