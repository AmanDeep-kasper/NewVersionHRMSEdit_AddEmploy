const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "tmp/" });

const { uploadBranding, getBranding, getAllBranding } = require("../../controllers/settings/brandlogoController");
const { verifyAdminHR } = require("../../middleware/rbacMiddleware");

router.post(
    "/settings/upload-branding",
    verifyAdminHR,
    upload.fields([
        { name: "logo" },
        { name: "miniIcon" },
        { name: "footerLogo" },
        { name: "footerMiniLogo" },
        { name: "faviconLogo" }
    ]),
    uploadBranding
);
// GET list of brandings
router.get("/settings/branding", getAllBranding);
// GET specific company branding
router.get("/settings/branding/:companyId", getBranding);

module.exports = router;



// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const { uploadBranding, getBranding } = require('../../controllers/brandingController');
// const { verifyAdminHR } = require('../../middleware/rbacMiddleware');

// // temporary upload to /files via multer disk storage (store in tmp, controller will move)
// const upload = multer({ dest: 'tmp/' });

// // POST /api/settings/upload-branding
// router.post('/settings/upload-branding', verifyAdminHR, upload.fields([{ name: 'logo' }, { name: 'miniIcon' }]), uploadBranding);

// // GET /api/settings/branding/:companyId?  (public)
// router.get('/settings/branding/:companyId?', getBranding);

// module.exports = router;
