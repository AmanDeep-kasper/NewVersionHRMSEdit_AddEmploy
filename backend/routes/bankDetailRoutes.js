const express = require("express");
const router = express.Router();
const bankDetailController = require("../controllers/bankDetailController");
const {
    verifyAdminHRManager,
    verifyAdminHR,
    verifyAll,
    verifyAdmin,
    verifyHR,
    verifyEmployee,
} = require("../middleware/rbacMiddleware");

router.post("/bankDetails/",verifyAll, bankDetailController.createBankDetail);
router.get("/bankDetails/", verifyAll, bankDetailController.getAllBankDetails);
router.get("/bankDetailsEmployee/:id",verifyAll, bankDetailController.getBankDetailsByEmployeeID);
router.get("/bankDetails/:id",verifyAll, bankDetailController.getBankDetailById);
router.put("/bankDetails/:id",verifyAll, bankDetailController.updateBankDetail);
router.delete("/bankDetails/:id", verifyAll,bankDetailController.deleteBankDetail);

module.exports = router;
