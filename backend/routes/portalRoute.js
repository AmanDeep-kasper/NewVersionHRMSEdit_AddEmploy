
const express = require('express');
const portalRoute = express.Router();

const {verifyAdmin} = require('../middleware/rbacMiddleware');
const { getAllPortal, createPortal, updatePortal, deletePortal } = require('../controllers/portalController');

// GET: Retrieve all countries
portalRoute.get("/admin/portal",verifyAdmin, getAllPortal);

// POST: Create a new city
portalRoute.post("/admin/portal",verifyAdmin, createPortal);

// PUT: Update an existing education
portalRoute.put("/admin/portal/:id",verifyAdmin, updatePortal);

// DELETE: Delete a existing portal
portalRoute.delete("/admin/portal/:id/",verifyAdmin, deletePortal);

module.exports = portalRoute;