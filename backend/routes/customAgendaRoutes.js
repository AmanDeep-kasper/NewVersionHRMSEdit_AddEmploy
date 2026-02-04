const express = require("express");
const router = express.Router();
const {
    createCustomAgenda,
    getAllCustomAgendas,
    getCustomAgendaById,
    updateCustomAgenda,
    deleteCustomAgenda,
} = require("../controllers/customAgendaController");
const {verifyAdminHRManager,verifyAdmin,verifyAll} = require('../middleware/rbacMiddleware');

// Routes
router.post("/custom-agenda", verifyAll,createCustomAgenda);
router.get("/custom-agenda",verifyAll, getAllCustomAgendas);
router.get("/custom-agenda/:id", verifyAll,getCustomAgendaById);
router.put("/custom-agenda/:id",verifyAll, updateCustomAgenda);
router.delete("/custom-agenda/:id", verifyAll,deleteCustomAgenda);

module.exports = router;
