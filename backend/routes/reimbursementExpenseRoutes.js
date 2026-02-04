// routes/reimbursementExpenseRoutes.js
const express = require("express");
const router = express.Router();
const reimbursementExpenseController = require("../controllers/reimbursementExpenseController");
const {
  verifyAdminHRManager,
  verifyAdminHR,
  verifyAll,
} = require("../middleware/rbacMiddleware");

router.post(
  "/reimbursement-expenses",
    verifyAdminHRManager,
  reimbursementExpenseController.createReimbursementExpense
);
router.get(
  "/reimbursement-expenses",
    verifyAdminHRManager,
  reimbursementExpenseController.getAllReimbursementExpenses
);
router.get(
  "/reimbursement-expenses/:employeeId",
    verifyAdminHRManager,
  reimbursementExpenseController.getAllReimbursementExpensesByEmployee
);
router.get(
  "/reimbursement-expenses/:id",
    verifyAdminHRManager,
  reimbursementExpenseController.getReimbursementExpenseById
);
router.put(
  "/reimbursement-expenses/:id",
    verifyAdminHRManager,
  reimbursementExpenseController.updateReimbursementExpenseById
);
router.delete(
  "/reimbursement-expenses/:id",
    verifyAdminHRManager,
  reimbursementExpenseController.deleteReimbursementExpenseById
);

module.exports = router;
